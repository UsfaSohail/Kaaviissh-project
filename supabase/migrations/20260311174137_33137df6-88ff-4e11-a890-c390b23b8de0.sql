
-- Seed payment methods
INSERT INTO public.payment_methods (method_name, account_title, phone_number, iban) VALUES
  ('NayaPay', 'Hamna Rauf Butt', '03427665521', 'PK16NAYA1234503427665521'),
  ('EasyPaisa', 'Himna Rauf', '03221963883', 'PK57TMFB0000000073958125'),
  ('SadaPay', 'Hamna Rauf Butt', '03427665521', NULL);

-- Seed impact counter with initial row
INSERT INTO public.impact_counter (families_helped, ration_bags_distributed, zakat_collected, total_donations, volunteers_count)
VALUES (0, 0, 0, 0, 0);

-- Seed initial zakat rates
INSERT INTO public.zakat_rates (gold_rate_per_gram, silver_rate_per_gram, is_admin_override)
VALUES (28450, 340, false);

-- Seed ration bag items
INSERT INTO public.ration_bag_items (item_name_en, item_name_ur, quantity, unit) VALUES
  ('Flour', 'آٹا', '10', 'kg'),
  ('Rice', 'چاول', '5', 'kg'),
  ('Cooking Oil', 'کھانا پکانے کا تیل', '3', 'litre'),
  ('Sugar', 'چینی', '3', 'kg'),
  ('Pulses (Daal)', 'دال', '3', 'kg'),
  ('Tea', 'چائے', '0.5', 'kg'),
  ('Natural Drinks', 'قدرتی مشروبات', '2', 'packs'),
  ('Spices', 'مصالحے', '1', 'pack');
