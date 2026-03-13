
-- Legal content table for Privacy Policy & Terms of Service
CREATE TABLE IF NOT EXISTS public.legal_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  body_en text NOT NULL DEFAULT '',
  body_ur text NOT NULL DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.legal_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view legal content" ON public.legal_content
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage legal content" ON public.legal_content
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed initial rows
INSERT INTO public.legal_content (key, body_en, body_ur) VALUES
  ('privacy_policy', 'Privacy Policy content will be added by admin.', 'رازداری کی پالیسی کا مواد ایڈمن شامل کرے گا۔'),
  ('terms_of_service', 'Terms of Service content will be added by admin.', 'شرائط و ضوابط کا مواد ایڈمن شامل کرے گا۔')
ON CONFLICT (key) DO NOTHING;

-- Ration bag config table for total price
CREATE TABLE IF NOT EXISTS public.ration_bag_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_price numeric NOT NULL DEFAULT 10000,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.ration_bag_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ration bag config" ON public.ration_bag_config
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage ration bag config" ON public.ration_bag_config
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed initial row
INSERT INTO public.ration_bag_config (total_price) VALUES (10000);
