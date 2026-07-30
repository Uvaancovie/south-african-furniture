-- ==========================================================
-- FURNITURE HAVEN - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ==========================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  sku TEXT UNIQUE,
  stock_quantity INT NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'General',
  material TEXT,
  color TEXT,
  width DECIMAL(8, 2),
  height DECIMAL(8, 2),
  depth DECIMAL(8, 2),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Product Images Table
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- 5. Products Table RLS Policies
DROP POLICY IF EXISTS "Allow public read access to active products" ON public.products;
CREATE POLICY "Allow public read access to active products"
  ON public.products FOR SELECT
  USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated admin full access to products" ON public.products;
CREATE POLICY "Allow authenticated admin full access to products"
  ON public.products FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 6. Product Images Table RLS Policies
DROP POLICY IF EXISTS "Allow public read access to product images" ON public.product_images;
CREATE POLICY "Allow public read access to product images"
  ON public.product_images FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated admin full access to product images" ON public.product_images;
CREATE POLICY "Allow authenticated admin full access to product images"
  ON public.product_images FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 7. Supabase Storage Bucket Setup for Product Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for 'product-images' bucket
DROP POLICY IF EXISTS "Public Read Access on product-images" ON storage.objects;
CREATE POLICY "Public Read Access on product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin Upload Access on product-images" ON storage.objects;
CREATE POLICY "Admin Upload Access on product-images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin Delete Access on product-images" ON storage.objects;
CREATE POLICY "Admin Delete Access on product-images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images');
