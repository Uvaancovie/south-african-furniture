# Troubleshooting

Audience: **QA**, **support**, and **developers**.

## Quick diagnosis matrix

| Symptom | Likely cause | Fix |
|---|---|---|
| Blank page / build fails | Missing deps or TS error | `npm install`; `npm run types:check`; read Vite error |
| Catalog empty | No active products or env wrong | Seed/create products; set `is_active`; check `.env` |
| “Failed to fetch” / network errors | Wrong Supabase URL/key or CORS | Verify `VITE_SUPABASE_*`; redeploy if production |
| Admin cannot save products | Not signed in / RLS | Sign in; re-run schema policies |
| Images do not upload | Bucket or storage policy missing | Run storage section of `schema.sql` |
| Images 404 | Bad URL or private bucket | Confirm public bucket + public object URLs |
| Cart empties on refresh | Expected | Cart is in-memory only |
| Checkout does nothing lasting | Expected | No orders backend yet |
| Styles broken | Tailwind/Vite issue | Restart `npm run dev`; hard refresh |

## Environment issues

### Variables not loading

1. Confirm file is named `.env` at project root
2. Keys must start with `VITE_`
3. Restart the dev server after any `.env` change
4. On Vercel, set env vars and **redeploy**

### Using the wrong key

- **Correct for browser:** anon / publishable key  
- **Never in this SPA:** service role key

## Supabase / data issues

### Schema not applied

Run [`supabase/schema.sql`](../supabase/schema.sql) in the SQL Editor.

### RLS blocking writes

Symptoms: select works, insert/update fails with permission errors.

Checks:

1. User has a valid session (`userSession` set after login)
2. Policies for `authenticated` exist on `products` and `product_images`
3. You did not enable RLS without recreating policies

### Storage upload fails

1. Bucket id must be exactly `product-images`
2. Insert policy for `authenticated` on `storage.objects`
3. File size / type acceptable to browser and Supabase limits

## Auth issues

| Problem | What to try |
|---|---|
| Cannot sign up | Check Supabase Auth providers; email confirm settings |
| Session lost on refresh | Supabase client should restore session; check local storage blocked |
| User signed in but no admin UI | Confirm `userSession` path in `App.vue`; hard refresh |

## Frontend / UX issues

### Sample products show instead of live data

Some views fall back to sample inventory when the DB returns empty or errors. Fix the Supabase connection or create active products.

### Mobile menu stuck open

Navigate using a menu link (navigation closes the menu) or refresh.

### Toast not visible

Toasts are short-lived messages in `App.vue`; confirm the action still mutated cart state.

## QA smoke checklist (release)

Copy this into a release ticket:

- [ ] `npm run build` succeeds
- [ ] Home renders hero + FAQ
- [ ] Catalog lists active products
- [ ] Search and category filters work
- [ ] Product detail gallery and add-to-cart work
- [ ] Cart quantity / remove / totals correct
- [ ] Free shipping threshold (> R15,000) behaves correctly
- [ ] Admin login / logout works
- [ ] Create product with image appears on storefront when active
- [ ] Inactive product hidden from public catalog
- [ ] Delete product removes it (and cascaded images at DB level)

## How to file a good bug report

Include:

1. Environment (local / production URL)
2. Browser + device
3. Steps to reproduce
4. Expected vs actual
5. Console / network error text (no secrets)
6. Whether user was signed in

## Related docs

- [Getting started](./getting-started.md)
- [Admin guide](./admin-guide.md)
- [Database](./database.md)
