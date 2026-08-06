# Deployment

Audience: **developers** and **ops**.

## Recommended: Vercel

The repo includes [`vercel.json`](../vercel.json):

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

That SPA rewrite ensures deep links still load the app shell.

### Steps

1. Push the project to GitHub/GitLab/Bitbucket
2. Import the repo in [Vercel](https://vercel.com)
3. Configure build settings:

   | Setting | Value |
   |---|---|
   | Framework | Vite (auto-detected) |
   | Build command | `npm run build` |
   | Output directory | `dist` |

4. Add environment variables in Vercel → Project → Settings → Environment Variables:

   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | Your Supabase project URL |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | Your anon / publishable key |

5. Deploy
6. Smoke-test production:
   - Home loads
   - Catalog fetches products
   - Admin sign-in works
   - Image URLs load from Supabase Storage

> Vite bakes `VITE_*` variables into the client bundle at **build** time. If you change env vars, **redeploy**.

## Other static hosts

```bash
npm run build
```

Upload `dist/` to Netlify, Cloudflare Pages, S3 + CloudFront, etc.

Configure **SPA fallback**: unknown paths must serve `index.html`.

## Supabase production checklist

- [ ] `supabase/schema.sql` applied on the production project
- [ ] RLS policies present (do not disable RLS “to make it work”)
- [ ] `product-images` bucket exists and is public for reads
- [ ] Auth email templates / site URL configured for production domain
- [ ] Only anon key used in frontend env; service role kept server-side only (if you add server jobs later)
- [ ] Admin users created intentionally

## Domains & HTTPS

- Point your custom domain to Vercel (or your host)
- In Supabase Auth settings, add the production URL to allowed redirect / site URLs

## Rollback

- Vercel: promote a previous deployment
- Database: schema changes need careful SQL rollbacks — document every migration

## Related docs

- [Getting started](./getting-started.md)
- [Troubleshooting](./troubleshooting.md)
