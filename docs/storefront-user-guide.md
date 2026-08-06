# Storefront User Guide

Audience: **customers**, **support agents**, and anyone explaining how the shop works.

## What customers can do

| Action | Where |
|---|---|
| Browse the brand story | Home (Landing) |
| Browse all products | Catalog |
| Filter by category | Catalog category pills |
| Search products | Catalog search (name, description, material, SKU) |
| View product details | Product page (images, specs, shipping, care) |
| Add items to cart | Catalog cards, product page, featured sections |
| Change cart quantities | Cart drawer |
| Remove cart items | Cart drawer |
| Proceed to checkout | Cart drawer button |

## Navigation

- **Home** — marketing landing page
- **Catalog** — full product grid
- **Cart** — bag icon opens the cart drawer; badge shows item count
- **Admin** — staff only (not for customers)

Mobile: use the hamburger menu for the same links.

## Product page

Customers can typically see:

- Image gallery (main image + thumbnails; lightbox zoom where available)
- Price in **ZAR** with VAT-inclusive messaging
- Stock status (in stock count vs made-to-order style messaging)
- SKU and material highlights
- Quantity selector with live subtotal
- Tabs: Description, Specifications, Shipping / White-Glove Delivery, Care
- Related products

## Cart & delivery messaging

| Item | Behavior |
|---|---|
| Cart storage | Browser session memory (not saved to an account) |
| Delivery estimate | **R450** standard estimate |
| Free delivery | Subtotal over **R15,000** |
| Checkout | Secure checkout confirmation on the client; cart is cleared after confirm |

> **Important for support:** there is currently **no server-side order record or payment gateway**. “Checkout” confirms intent in the UI. If you need real orders, that is a future product feature.

## Brand promises shown on the site

- Solid South African hardwood positioning (teak, oak, ash, walnut, leather)
- 10-year structural timber warranty messaging
- White-glove delivery messaging (placement / assembly / packaging removal)
- Made-to-order customization messaging

## FAQ topics covered on the landing page

The homepage FAQ accordion typically covers:

- Delivery
- Custom dimensions
- Materials
- Warranty

Use that content as the first-line support script; keep it in sync when marketing copy changes.

## Accessibility & device support

- Responsive layout for mobile and desktop
- Sticky header for quick access to catalog and cart
- Toast messages confirm cart actions

## Related docs

- [Admin guide](./admin-guide.md) — how staff publish products customers see
- [Troubleshooting](./troubleshooting.md)
