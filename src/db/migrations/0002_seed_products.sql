-- Seed placeholder product rows so the products section renders from D1.
-- Replace these with real products as they ship; the section falls back to
-- the "nothing yet" empty state when the table has no active rows.

INSERT INTO products (slug, name, tagline, description, status, url, sort_order) VALUES
  ('first-product', 'First product — in progress', 'The first small thing, built in the open.', 'This card is served straight from D1 to prove the pipeline. Real products will replace it.', 'active', 'https://github.com/znknl/landing', 1);
