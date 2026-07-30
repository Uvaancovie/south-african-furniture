export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string | null;
  sort_order?: number;
  is_primary?: boolean;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  sku?: string | null;
  stock_quantity: number;
  category: string;
  material?: string | null;
  color?: string | null;
  width?: number | null;
  height?: number | null;
  depth?: number | null;
  is_active: boolean;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
  product_images?: ProductImage[];
}

export interface NewProductInput {
  name: string;
  slug: string;
  description?: string;
  price: number;
  sku?: string;
  stock_quantity: number;
  category: string;
  material?: string;
  color?: string;
  width?: number | null;
  height?: number | null;
  depth?: number | null;
  is_active: boolean;
  is_featured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedMaterial?: string;
}
