# Admin Guide

Audience: **store admins**, **support**, and **ops**.

## Access

1. Open the site
2. Click **Admin** in the header (or mobile menu)
3. **Sign in** with your admin email and password  
   — or **Create Admin Account** if no user exists yet

When signed in you should see:

- An **Admin Active** style indicator in the header
- The inventory / product management screen

To leave admin mode: **Sign out**.

> Create admin accounts carefully. In the current security model, **any authenticated user can manage products**.

## What you can manage

| Task | Supported |
|---|---|
| Create products | Yes |
| Edit products | Yes |
| Upload multiple images | Yes (file picker or drag-and-drop) |
| Set primary image / order | Yes (via upload flow) |
| Toggle active / inactive | Yes |
| Mark featured | Yes |
| Delete products | Yes |
| Seed sample catalog | Yes (demo helper in admin UI) |
| Manage orders | No (not built yet) |
| Manage customers | No (Auth users only via Supabase dashboard) |

## Create a product

1. Open **Admin**
2. Fill in the product form:
   - **Name** (required)
   - **Slug** (auto-generated from name; keep URL-friendly)
   - **Category** (Living Room, Dining Room, Bedroom, Office, Outdoor, Storage, etc.)
   - **Price** in ZAR
   - **SKU** (often auto-suggested from category)
   - **Stock quantity**
   - **Material**, **color**, **dimensions** (optional but recommended)
   - **Description**
   - Flags: **Active**, **Featured**
3. Add images (required for a polished storefront card)
4. Save

### Visibility rules

| Flag | Effect on storefront |
|---|---|
| **Active = on** | Product can appear in catalog / home |
| **Active = off** | Hidden from public catalog |
| **Featured = on** | Eligible for homepage / related highlighting |

## Edit a product

1. Select the product from the admin list
2. Form pre-fills existing values
3. Change fields and/or add/remove images
4. Save — storefront refresh uses the updated data

## Images

- Upload JPEG/PNG/WebP-style web images (keep files reasonably sized for web)
- First/primary image is used on catalog cards
- Images are stored in Supabase Storage bucket **`product-images`**
- Public URLs are saved on `product_images` rows

If an image fails to upload:

- Confirm you are signed in
- Confirm the `product-images` bucket exists (run `supabase/schema.sql`)
- Check Storage policies allow authenticated insert

## Inventory tips

- Use clear SKUs (`LR-SOFA-001` style) for support conversations
- Keep **stock_quantity** honest — the PDP shows stock vs made-to-order messaging
- Prefer high-quality primary photos; secondary images for detail/angles
- Set inactive instead of deleting if you may re-list the piece

## Password / account recovery

Password reset is managed in **Supabase Auth** (dashboard or configured email templates).  
This app’s admin UI currently focuses on sign-in / sign-up, not a full account recovery screen.

## Related docs

- [Storefront user guide](./storefront-user-guide.md)
- [Troubleshooting](./troubleshooting.md)
- [Database](./database.md)
