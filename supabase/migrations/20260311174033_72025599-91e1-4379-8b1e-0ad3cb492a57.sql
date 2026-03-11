
-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. User roles table (separate from profiles per security guidelines)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- 3. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  language_preference TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Cases table
CREATE TABLE public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_ur TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  description_ur TEXT NOT NULL DEFAULT '',
  location TEXT,
  target_amount NUMERIC NOT NULL DEFAULT 0,
  raised_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Completed')),
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  donor_name TEXT,
  donor_email TEXT,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL DEFAULT 'Custom' CHECK (type IN ('Ration', 'Zakat', 'Case-Specific', 'Custom')),
  payment_method TEXT CHECK (payment_method IN ('NayaPay', 'EasyPaisa', 'SadaPay')),
  screenshot_url TEXT,
  slip_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Blog posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_ur TEXT NOT NULL DEFAULT '',
  body_en TEXT NOT NULL DEFAULT '',
  body_ur TEXT NOT NULL DEFAULT '',
  category TEXT,
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  full_name TEXT NOT NULL,
  cnic TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  income_details TEXT,
  documents_url TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Chats table
CREATE TABLE public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'admin')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Impact counter table
CREATE TABLE public.impact_counter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  families_helped INTEGER NOT NULL DEFAULT 0,
  ration_bags_distributed INTEGER NOT NULL DEFAULT 0,
  zakat_collected NUMERIC NOT NULL DEFAULT 0,
  total_donations NUMERIC NOT NULL DEFAULT 0,
  volunteers_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Zakat rates table
CREATE TABLE public.zakat_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gold_rate_per_gram NUMERIC NOT NULL DEFAULT 0,
  silver_rate_per_gram NUMERIC NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_admin_override BOOLEAN NOT NULL DEFAULT false
);

-- 11. Payment methods table
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method_name TEXT NOT NULL,
  account_title TEXT NOT NULL,
  phone_number TEXT,
  iban TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. Ration bag items table
CREATE TABLE public.ration_bag_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name_en TEXT NOT NULL,
  item_name_ur TEXT NOT NULL DEFAULT '',
  quantity TEXT,
  unit TEXT,
  icon_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. Gallery table
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  category TEXT,
  caption_en TEXT,
  caption_ur TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. Quotes table
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text_en TEXT NOT NULL,
  text_ur TEXT NOT NULL DEFAULT '',
  source_en TEXT,
  source_ur TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 15. Site content table
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value_en TEXT NOT NULL DEFAULT '',
  value_ur TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- SECURITY DEFINER FUNCTION for role checks
-- ============================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============================================================
-- AUTO-CREATE PROFILE + DEFAULT USER ROLE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'phone', '')
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- User roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Cases (public read, admin write)
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view cases" ON public.cases FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage cases" ON public.cases FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Donations
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own donations" ON public.donations FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert donations" ON public.donations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Anon can insert donations" ON public.donations FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY "Admins can manage donations" ON public.donations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Blog posts (public read published, admin write)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published blogs" ON public.blog_posts FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Admins can manage blogs" ON public.blog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own applications" ON public.applications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert applications" ON public.applications FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage applications" ON public.applications FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Chats
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own chats" ON public.chats FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can send chats" ON public.chats FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage chats" ON public.chats FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Impact counter (public read, admin write)
ALTER TABLE public.impact_counter ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view impact" ON public.impact_counter FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage impact" ON public.impact_counter FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Zakat rates (public read, admin write)
ALTER TABLE public.zakat_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view rates" ON public.zakat_rates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage rates" ON public.zakat_rates FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Payment methods (public read, admin write)
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view payment methods" ON public.payment_methods FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage payment methods" ON public.payment_methods FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Ration bag items (public read, admin write)
ALTER TABLE public.ration_bag_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view ration items" ON public.ration_bag_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage ration items" ON public.ration_bag_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Gallery (public read, admin write)
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view gallery" ON public.gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage gallery" ON public.gallery FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Quotes (public read, admin write)
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active quotes" ON public.quotes FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins can manage quotes" ON public.quotes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Site content (public read, admin write)
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view site content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage site content" ON public.site_content FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- ENABLE REALTIME for key tables
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.cases;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.donations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.impact_counter;
