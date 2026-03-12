
-- Drop all existing RESTRICTIVE policies and recreate as PERMISSIVE

-- PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- USER_ROLES
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- DONATIONS
DROP POLICY IF EXISTS "Users can view own donations" ON public.donations;
DROP POLICY IF EXISTS "Users can insert donations" ON public.donations;
DROP POLICY IF EXISTS "Anon can insert donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can manage donations" ON public.donations;

CREATE POLICY "Users can view own donations" ON public.donations FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert donations" ON public.donations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Anon can insert donations" ON public.donations FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY "Admins can manage donations" ON public.donations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- APPLICATIONS
DROP POLICY IF EXISTS "Users can view own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can insert applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can manage applications" ON public.applications;

CREATE POLICY "Users can view own applications" ON public.applications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert applications" ON public.applications FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage applications" ON public.applications FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- CHATS
DROP POLICY IF EXISTS "Users can view own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can send chats" ON public.chats;
DROP POLICY IF EXISTS "Admins can manage chats" ON public.chats;

CREATE POLICY "Users can view own chats" ON public.chats FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can send chats" ON public.chats FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage chats" ON public.chats FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- CASES
DROP POLICY IF EXISTS "Anyone can view cases" ON public.cases;
DROP POLICY IF EXISTS "Admins can manage cases" ON public.cases;

CREATE POLICY "Anyone can view cases" ON public.cases FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage cases" ON public.cases FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- BLOG_POSTS
DROP POLICY IF EXISTS "Anyone can view published blogs" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can manage blogs" ON public.blog_posts;

CREATE POLICY "Anyone can view published blogs" ON public.blog_posts FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Admins can manage blogs" ON public.blog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- IMPACT_COUNTER
DROP POLICY IF EXISTS "Anyone can view impact" ON public.impact_counter;
DROP POLICY IF EXISTS "Admins can manage impact" ON public.impact_counter;

CREATE POLICY "Anyone can view impact" ON public.impact_counter FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage impact" ON public.impact_counter FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- PAYMENT_METHODS
DROP POLICY IF EXISTS "Anyone can view payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Admins can manage payment methods" ON public.payment_methods;

CREATE POLICY "Anyone can view payment methods" ON public.payment_methods FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage payment methods" ON public.payment_methods FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ZAKAT_RATES
DROP POLICY IF EXISTS "Anyone can view rates" ON public.zakat_rates;
DROP POLICY IF EXISTS "Admins can manage rates" ON public.zakat_rates;

CREATE POLICY "Anyone can view rates" ON public.zakat_rates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage rates" ON public.zakat_rates FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- QUOTES
DROP POLICY IF EXISTS "Anyone can view active quotes" ON public.quotes;
DROP POLICY IF EXISTS "Admins can manage quotes" ON public.quotes;

CREATE POLICY "Anyone can view active quotes" ON public.quotes FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins can manage quotes" ON public.quotes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- SITE_CONTENT
DROP POLICY IF EXISTS "Anyone can view site content" ON public.site_content;
DROP POLICY IF EXISTS "Admins can manage site content" ON public.site_content;

CREATE POLICY "Anyone can view site content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage site content" ON public.site_content FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RATION_BAG_ITEMS
DROP POLICY IF EXISTS "Anyone can view ration items" ON public.ration_bag_items;
DROP POLICY IF EXISTS "Admins can manage ration items" ON public.ration_bag_items;

CREATE POLICY "Anyone can view ration items" ON public.ration_bag_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage ration items" ON public.ration_bag_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- GALLERY
DROP POLICY IF EXISTS "Anyone can view gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admins can manage gallery" ON public.gallery;

CREATE POLICY "Anyone can view gallery" ON public.gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage gallery" ON public.gallery FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
