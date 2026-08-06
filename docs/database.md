# Database & Storage

Audience: **developers** and **ops**.

Source of truth: [`supabase/schema.sql`](../supabase/schema.sql)

## Tables

### `products`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | `gen_random_uuid()` |
| `name` | TEXT | Required |
| `slug` | TEXT | Unique |
| `description` | TEXT | Optional |
| `price` | DECIMAL(10,2) | ZAR |
| `sku` | TEXT | Unique |
| `stock_quantity` | INT | Default `0` |
| `category` | TEXT | e.g. Living Room |
| `material` | TEXT | Optional |
| `color` | TEXT | Optional |
| `width` / `height` / `depth` | DECIMAL(8,2) | Dimensions |
| `is_active` | BOOLEAN | Storefront visibility |
| `is_featured` | BOOLEAN | Homepage / related |
| `created_at` / `updated_at` | TIMESTAMPTZ | |

### `product_images`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `product_id` | UUID FK → `products` | `ON DELETE CASCADE` |
| `image_url` | TEXT | Public Storage URL |
| `alt_text` | TEXT | Optional |
| `sort_order` | INT | Gallery order |
| `is_primary` | BOOLEAN | Card / hero image |
| `created_at` | TIMESTAMPTZ | |

## Indexes

- `products.slug`
- `products.category`
- `products.is_active`
- `product_images.product_id`

## Row Level Security (RLS)

RLS is **enabled** on both tables.

### Products

| Policy intent | Who | Effect |
|---|---|---|
| Public read active | Anyone | `SELECT` where `is_active = true` **or** role is `authenticated` |
| Admin full access | `authenticated` | `ALL` (insert/update/delete/select) |

### Product images

| Policy intent | Who | Effect |
|---|---|---|
| Public read | Anyone | `SELECT` all image rows |
| Admin full access | `authenticated` | `ALL` |

> **Implication:** any signed-in Supabase user can manage inventory. If you need staff-only admins, add a roles table or `app_metadata` claim and tighten policies.

## Storage

| Item | Value |
|---|---|
| Bucket | `product-images` |
| Public | Yes (public read URLs) |
| Upload | Authenticated only |
| Delete | Authenticated only |

Typical path pattern used by the admin UI: per-product folder under the bucket, then public URL stored in `product_images.image_url`.

## Applying schema changes

1. Edit `supabase/schema.sql` (or add a dated SQL migration file under `supabase/migrations/` if you adopt that convention)
2. Run the SQL in Supabase SQL Editor (or CLI)
3. Update TypeScript types in `src/types/database.ts`
4. Update UI forms and docs in the same change

## What is not in the database yet

These exist only in the SPA (or not at all):

| Concept | Current state |
|---|---|
| Orders | No `orders` table — checkout is client-side toast |
| Cart | In-memory only |
| Customer profiles beyond Auth | Not modeled |
| Marketing / terms consent flags | Not implemented (see [privacy-compliance.md](./privacy-compliance.md)) |

## TypeScript mapping

See `src/types/database.ts`:

- `Product`
- `ProductImage`
- `NewProductInput`
- `CartItem` (client-only; not a DB table)
