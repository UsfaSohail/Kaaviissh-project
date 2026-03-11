
-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('donation-screenshots', 'donation-screenshots', false),
  ('donation-slips', 'donation-slips', false),
  ('application-documents', 'application-documents', false),
  ('case-images', 'case-images', true),
  ('blog-images', 'blog-images', true),
  ('gallery', 'gallery', true),
  ('ration-bag-icons', 'ration-bag-icons', true);

-- Storage RLS: authenticated users can upload to donation-screenshots
CREATE POLICY "Users can upload donation screenshots" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'donation-screenshots');
CREATE POLICY "Users can view own donation screenshots" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'donation-screenshots');

-- Application documents: authenticated upload
CREATE POLICY "Users can upload application docs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'application-documents');
CREATE POLICY "Users can view own application docs" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'application-documents');

-- Public buckets: anyone can view
CREATE POLICY "Public can view case images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'case-images');
CREATE POLICY "Public can view blog images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'blog-images');
CREATE POLICY "Public can view gallery" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'gallery');
CREATE POLICY "Public can view ration icons" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'ration-bag-icons');
CREATE POLICY "Public can view donation slips" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'donation-slips');

-- Admin can manage all storage
CREATE POLICY "Admins can manage all storage" ON storage.objects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
