# Furniture Store — Codebase Overview

## Project Identity

| Field | Value |
|---|---|
| **Name** | Furniture Store (FurnitureHaven) |
| **Stack** | Laravel 13 + Inertia.js v3 + React 19 + TypeScript + Tailwind CSS v4 |
| **Database** | SQLite (local/dev) |
| **Auth** | Laravel Fortify (login, register, password reset, email verification) |
| **Payments** | No payment gateway — orders are auto-marked `paid_at = now()` at creation |
| **Shipping** | `laratables/laravel-shipping` package with config-based rules |
| **PDF Invoices** | barryvdh/laravel-dompdf |
| **Queue** | Database driver |
| **SSR** | Inertia server-side rendering enabled on `http://127.0.0.1:13714` |
| **Testing** | Pest PHP + PHPStan |
| **Frontend Assets** | Vite 8 + Tailwind v4 + shadcn/ui components |

---

## Tech Stack (Complete)

### Backend (PHP)
- **Framework:** Laravel 13.x (`laravel/framework ^13.17`)
- **Auth:** Laravel Fortify 1.x (login, register, password reset, email verification, 2FA fields exist but 2FA not active)
- **Inertia:** `inertiajs/inertia-laravel ^3.0` — server-side Inertia adapter
- **Wayfinder:** `laravel/wayfinder ^0.1.14` — auto-generates typed TypeScript route functions
- **PDF:** `barryvdh/laravel-dompdf ^3.1` — invoice PDF generation
- **Shipping:** `laratables/laravel-shipping ^1.2` — shipping cost calculation
- **Dev tools:** Laravel Boost, Larastan, Pest, Pint, Sail

### Frontend (JS/TS)
- **Framework:** React 19.2 + TypeScript 5.7
- **SSR/SRA:** Inertia.js v3 (`@inertiajs/react ^3.0`, `@inertiajs/vite ^3.0`)
- **Build:** Vite 8
- **CSS:** Tailwind CSS v4 (CSS-first config via `@import 'tailwindcss'`)
- **UI Primitives:** Radix UI (13+ primitives — Dialog, Select, Checkbox, DropdownMenu, Tooltip, Toggle, Slot, Separator, Collapsible, NavigationMenu, Avatar, Label)
- **Icons:** Lucide React
- **Components:** shadcn/ui-style CVA components with `data-slot` attributes
- **Utilities:** `clsx`, `tailwind-merge`, `class-variance-authority`
- **Animation:** `tw-animate-css` for enter/exit animations
- **Toasts:** Sonner (toast notifications)
- **Code quality:** ESLint, Prettier (with `prettier-plugin-tailwindcss`), TypeScript strict mode
- **React Compiler:** `babel-plugin-react-compiler` enabled (experimental)

---

## Directory Structure

```
/
├── app/
│   ├── Actions/Fortify/        # Auth actions (CreateNewUser, ResetUserPassword)
│   ├── Concerns/               # Shared traits (PasswordValidationRules)
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/          # Admin CRUD (Category, Product, Order, Customer)
│   │   │   ├── Settings/       # Profile & Security settings
│   │   │   ├── CartController.php
│   │   │   ├── CatalogController.php
│   │   │   ├── CheckoutController.php
│   │   │   ├── InvoiceController.php
│   │   │   └── OrderController.php
│   │   ├── Middleware/
│   │   │   └── HandleInertiaRequests.php   # Global Inertia shared props
│   │   ├── Requests/
│   │   │   ├── Settings/                   # Profile/Password/2FA requests
│   │   │   ├── StoreCategoryRequest.php
│   │   │   ├── UpdateCategoryRequest.php
│   │   │   ├── StoreProductRequest.php
│   │   │   └── UpdateProductRequest.php
│   │   └── Resources/          # (empty — no API resources yet)
│   ├── Mail/
│   │   ├── ItemAddedToCart.php
│   │   ├── OrderConfirmation.php (attaches PDF invoice)
│   │   ├── OrderDelivered.php
│   │   └── OrderShipped.php
│   ├── Models/
│   │   ├── Category.php
│   │   ├── DeliveryZone.php
│   │   ├── Order.php
│   │   ├── OrderItem.php
│   │   ├── OrderMessage.php
│   │   ├── Product.php
│   │   ├── ProductImage.php
│   │   └── User.php
│   ├── Providers/
│   │   ├── AppServiceProvider.php
│   │   └── FortifyServiceProvider.php
│   └── Services/
│       └── CartService.php     # Session-based cart management
├── bootstrap/
├── config/
│   ├── fortify.php             # Fortify config (registration, passwords, email verification)
│   ├── inertia.php             # Inertia SSR settings
│   ├── shipping.php            # Shipping fee rules
│   └── ... (app, auth, cache, database, queue, session, etc.)
├── database/
│   └── migrations/             # 12 migration files
├── resources/
│   ├── css/
│   │   └── app.css             # Tailwind v4 CSS (theme tokens, light/dark vars)
│   ├── js/                     # Frontend React/TypeScript app
│   │   ├── app.tsx             # Inertia app bootstrap + layout resolution
│   │   ├── components/
│   │   │   ├── ui/             # 25 shadcn/ui components (button, card, dialog, select, etc.)
│   │   │   ├── public-header.tsx
│   │   │   ├── public-footer.tsx
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── breadcrumbs.tsx
│   │   │   └── ... (app-content, shipping-calculator, etc.)
│   │   ├── hooks/              # 7 hooks (use-appearance, use-mobile, use-flash-toast, etc.)
│   │   ├── layouts/            # 4 layouts (app, auth, catalog, settings)
│   │   ├── lib/
│   │   │   └── utils.ts        # cn(), formatPrice(), toUrl()
│   │   ├── pages/              # Inertia page components
│   │   │   ├── welcome.tsx     # Homepage
│   │   │   ├── dashboard.tsx   # Customer dashboard
│   │   │   ├── auth/           # Login, register, forgot/reset password, verify email
│   │   │   ├── cart/
│   │   │   ├── catalog/        # Product listing + detail
│   │   │   ├── checkout/
│   │   │   ├── orders/
│   │   │   ├── settings/       # Profile, security, appearance
│   │   │   └── admin/          # Categories, products, orders, customers
│   │   ├── routes/             # Auto-generated by Wayfinder (typed route functions)
│   │   └── types/              # TypeScript type definitions
│   └── views/
│       ├── app.blade.php       # Root Blade template (Inertia entry)
│       ├── emails/             # HTML email templates
│       ├── pdfs/
│       │   └── invoice.blade.php
│       └── vendor/mail/        # Mail layout overrides
├── routes/
│   ├── web.php                 # Main routes
│   ├── settings.php            # Settings routes
│   └── console.php
├── tests/
│   ├── Feature/
│   └── Unit/
├── vendor/
├── node_modules/
├── package.json
├── composer.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js          # NOT PRESENT — using CSS-first Tailwind v4
├── boost.json                  # Laravel Boost skills config
└── skills-lock.json
```

---

## Database Schema

### `users`
| Column | Type |
|---|---|
| id | bigint (PK) |
| name | string |
| email | string (unique) |
| email_verified_at | datetime (nullable) |
| password | string |
| two_factor_secret | text (nullable) |
| two_factor_recovery_codes | text (nullable) |
| two_factor_confirmed_at | datetime (nullable) |
| remember_token | string (nullable) |
| timestamps | |

### `categories`
| Column | Type |
|---|---|
| id | bigint (PK) |
| name | string |
| slug | string (unique) |
| description | text (nullable) |
| parent_id | bigint (FK→categories, nullable) |
| sort_order | int (default 0) |
| is_active | boolean (default true) |
| timestamps | |

### `products`
| Column | Type |
|---|---|
| id | bigint (PK) |
| name | string |
| slug | string (unique) |
| description | text (nullable) |
| price | decimal(10,2) |
| sku | string(100) (unique) |
| stock_quantity | int (default 0) |
| category_id | bigint (FK→categories, nullable) |
| material | string (nullable) |
| color | string (nullable) |
| width | decimal(8,2) (nullable) |
| height | decimal(8,2) (nullable) |
| depth | decimal(8,2) (nullable) |
| weight | decimal(8,2) (nullable) |
| is_active | boolean (default true) |
| is_featured | boolean (default false) |
| timestamps | |

### `product_images`
| Column | Type |
|---|---|
| id | bigint (PK) |
| product_id | bigint (FK→products, cascade) |
| image_path | string |
| alt_text | string (nullable) |
| sort_order | int (default 0) |
| is_primary | boolean (default false) |
| timestamps | |

### `orders`
| Column | Type |
|---|---|
| id | bigint (PK) |
| user_id | bigint (FK→users, cascade) |
| order_number | string (unique) — format: `ORD-XXXXXXXXXX` |
| status | string (default 'pending') — one of: pending, confirmed, processing, shipped, delivered, cancelled |
| subtotal | decimal(12,2) |
| tax | decimal(12,2) |
| shipping_cost | decimal(12,2) |
| discount | decimal(12,2) (default 0) |
| total | decimal(12,2) |
| currency | string(3) (default 'ZAR') |
| notes | text (nullable) |
| billing_address | json |
| shipping_address | json |
| delivery_zone_id | bigint (FK→delivery_zones, nullable) |
| paid_at | datetime (nullable) |
| timestamps | |

### `order_items`
| Column | Type |
|---|---|
| id | bigint (PK) |
| order_id | bigint (FK→orders, cascade) |
| product_id | bigint (FK→products, nullable) |
| quantity | int |
| unit_price | decimal(12,2) |
| subtotal | decimal(12,2) |
| product_name | string |
| product_data | json (stores slug, sku) |
| timestamps | |

### `delivery_zones`
| Column | Type |
|---|---|
| id | bigint (PK) |
| area | string |
| province | string |
| km_from_base | decimal(8,1) (nullable) |
| fee | decimal(10,2) |
| timestamps | |

### `order_messages`
| Column | Type |
|---|---|
| id | bigint (PK) |
| order_id | bigint (FK→orders, cascade) |
| user_id | bigint (FK→users) |
| message | text |
| timestamps | |

---

## Routes (Complete Map)

### Public Routes
```
GET  /                     → Inertia::render('welcome')
GET  /catalog              → CatalogController@index       → catalog.index
GET  /catalog/{product:slug}  → CatalogController@show     → catalog.show
```

### Authenticated Routes (auth + verified)
```
GET    /dashboard          → Inertia::render('dashboard')  → dashboard
GET    /cart               → CartController@index          → cart.index
POST   /cart/{product}     → CartController@add            → cart.add
PATCH  /cart/{product}     → CartController@update         → cart.update
DELETE /cart/{product}     → CartController@remove         → cart.remove
GET    /checkout           → CheckoutController@index      → checkout.index
POST   /checkout           → CheckoutController@store      → checkout.store
GET    /orders             → OrderController@index         → orders.index
GET    /orders/{order}     → OrderController@show          → orders.show
GET    /orders/{order}/invoice → InvoiceController@download → orders.invoice
POST   /orders/{order}/message → OrderController@message   → orders.message
```

### Admin Routes (auth + verified, prefix: /admin)
```
GET     /admin/categories     → Admin\CategoryController@index    → admin.categories.index
GET     /admin/categories/create  → Admin\CategoryController@create
POST    /admin/categories     → Admin\CategoryController@store
GET     /admin/categories/{category}/edit → Admin\CategoryController@edit
PUT     /admin/categories/{category} → Admin\CategoryController@update
DELETE  /admin/categories/{category} → Admin\CategoryController@destroy
GET     /admin/products       → Admin\ProductController@index    → admin.products.index
... (same CRUD pattern)
GET     /admin/orders         → Admin\OrderController@index      → admin.orders.index
GET     /admin/orders/{order} → Admin\OrderController@show       → admin.orders.show
PATCH   /admin/orders/{order} → Admin\OrderController@update     → admin.orders.update
POST    /admin/orders/{order}/message → Admin\OrderController@message
GET     /admin/customers      → Admin\CustomerController@index   → admin.customers.index
```

### Settings Routes (auth)
```
GET    /settings/profile      → Settings\ProfileController@edit    → profile.edit
PATCH  /settings/profile      → Settings\ProfileController@update  → profile.update
DELETE /settings/profile      → Settings\ProfileController@destroy → profile.destroy (auth+verified)
GET    /settings/security     → Settings\SecurityController@edit   → security.edit (auth+verified)
PUT    /settings/password     → Settings\SecurityController@update → user-password.update (throttled 6:1)
GET    /settings/appearance   → Inertia page render               → appearance.edit
```

---

## Backend Architecture

### Model Relationships

```
Category
  ├── parent() → BelongsTo(Category)
  ├── children() → HasMany(Category, ordered by sort_order)
  └── products() → HasMany(Product)

Product
  ├── category() → BelongsTo(Category)
  ├── images() → HasMany(ProductImage, ordered by sort_order)
  └── primaryImage() → HasOne(ProductImage, where is_primary = true)

Order
  ├── user() → BelongsTo(User)
  ├── items() → HasMany(OrderItem)
  ├── messages() → HasMany(OrderMessage, latest)
  └── deliveryZone() → BelongsTo(DeliveryZone)

User
  └── orders() → HasMany(Order)
```

### CartService (`app/Services/CartService.php`)
- **Session-based** cart stored in `session('cart')`
- **Methods:** `items()`, `count()`, `total()`, `add(Product, qty)`, `update(productId, qty)`, `remove(productId)`, `clear()`
- Each cart item stores: `product_id`, `name`, `slug`, `price`, `quantity`, `image` (primary image path), `sku`, `weight_kg`, `shipping_cost`
- Cart is NOT persisted to database — lives only in session

### Checkout Flow
1. User visits `/checkout` — cart must have items
2. Selects province → delivery zone → shipping cost calculated via ShippingResolver
3. Submits: billing address + delivery zone + optional notes
4. Server validates, creates Order + OrderItems, decrements stock, clears cart
5. Queues OrderConfirmation email (with PDF invoice attachment via DomPDF)
6. Order is auto-marked as `paid_at = now()` (no payment gateway)

### Shipping (`config/shipping.php` + `laratables/laravel-shipping`)
| Config | Default | Purpose |
|---|---|---|
| base_fee | 2.50 | Base shipping fee |
| multi_product_surcharge | 1.50 | Per-item surcharge |
| heavy_item_threshold_kg | 10 | Weight threshold for heavy surcharge |
| heavy_item_surcharge | 3.00 | Additional fee for heavy items |
| max_weight_kg | 100 | Maximum order weight |
| free_enabled | true | Free shipping toggle |
| free_threshold | 75.00 | Free shipping over this amount |
| free_weight_limit_kg | null | Weight limit for free shipping |

### Form Requests
- `StoreProductRequest` — validates name, slug (unique), price, sku (unique), stock_quantity, category_id, material, color, dimensions, weight, is_active, is_featured, images (array, max 5MB each, jpeg/png/jpg/webp)
- `UpdateProductRequest` — same but slug unique ignores current product
- `StoreCategoryRequest` / `UpdateCategoryRequest` — validates name, slug, parent_id, sort_order, is_active

### Mail Classes (all implement `ShouldQueue`)
- `OrderConfirmation` — sent on order placement, attaches PDF invoice
- `OrderShipped` — sent when admin marks order as shipped
- `OrderDelivered` — sent when admin marks order as delivered
- `ItemAddedToCart` — sent when user adds an item to their cart

### Global Inertia Shared Props (`HandleInertiaRequests.php`)
| Prop | Type | Source |
|---|---|---|
| `name` | string | `config('app.name')` |
| `auth.user` | User \| null | `$request->user()` |
| `cart_count` | int | `CartService->count()` |
| `sidebarOpen` | bool | Cookie `sidebar_state` |

---

## Frontend Architecture

### App Entry (`resources/js/app.tsx`)
```tsx
createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    layout: (name) => {
        switch (true) {
            case name === 'welcome': return null;           // No layout
            case name.startsWith('auth/'): return AuthLayout;
            case name.startsWith('settings/'): return [AppLayout, SettingsLayout];
            case name.startsWith('catalog/'): return CatalogLayout;
            default: return AppLayout;
        }
    },
    strictMode: true,
    withApp: (app) => <TooltipProvider><App /><Toaster /></TooltipProvider>,
    progress: { color: '#4B5563' },
});
```

### Layout System
| Layout | Used By | Contents |
|---|---|---|
| `CatalogLayout` | `catalog/*` | PublicHeader + AppShell/Sidebar + PublicFooter |
| `AuthLayout` | `auth/*` | Simple centered form layout |
| `AppLayout` | `settings/*`, admin, dashboard, cart, checkout, orders | Sidebar + header + content area |
| SettingsLayout (nested) | `settings/*` | Settings navigation tabs within AppLayout |
| `null` | `welcome` | PublicHeader + PublicFooter rendered manually in page |

### Page Resolution by Route

| Route | Component | Layout |
|---|---|---|
| `/` | `pages/welcome.tsx` | None (renders PublicHeader/Footer itself) |
| `/dashboard` | `pages/dashboard.tsx` | AppLayout |
| `/catalog` | `pages/catalog/index.tsx` | CatalogLayout |
| `/catalog/{slug}` | `pages/catalog/show.tsx` | CatalogLayout |
| `/cart` | `pages/cart/index.tsx` | AppLayout |
| `/checkout` | `pages/checkout/index.tsx` | AppLayout |
| `/orders` | `pages/orders/index.tsx` | AppLayout |
| `/orders/{id}` | `pages/orders/show.tsx` | AppLayout |
| `/settings/profile` | `pages/settings/profile.tsx` | AppLayout + SettingsLayout |
| `/settings/security` | `pages/settings/security.tsx` | AppLayout + SettingsLayout |
| `/settings/appearance` | `pages/settings/appearance.tsx` | AppLayout + SettingsLayout |
| `/admin/categories` | `pages/admin/categories/index.tsx` | AppLayout |
| `/admin/products` | `pages/admin/products/index.tsx` | AppLayout |
| `/admin/orders` | `pages/admin/orders/index.tsx` | AppLayout |
| `/admin/customers` | `pages/admin/customers/index.tsx` | AppLayout |
| `auth/*` | `pages/auth/*.tsx` | AuthLayout |

### Key UI Components

**shadcn/ui Components** (25 in `components/ui/`):
`alert`, `avatar`, `badge`, `breadcrumb`, `button`, `card`, `checkbox`, `collapsible`, `dialog`, `dropdown-menu`, `icon`, `input`, `label`, `navigation-menu`, `placeholder-pattern`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `sonner`, `spinner`, `toggle`, `toggle-group`, `tooltip`

**Custom Components** (in `components/`):
`alert-error`, `app-content`, `app-header`, `app-logo`, `app-sidebar`, `app-sidebar-header`, `appearance-tabs`, `breadcrumbs`, `delete-user`, `heading`, `input-error`, `nav-footer`, `nav-main`, `nav-user`, `password-input`, `public-footer`, `public-header`, `shipping-calculator`, `text-link`, `user-info`, `user-menu-content`

### Custom Hooks (in `hooks/`)
| Hook | Purpose |
|---|---|
| `use-appearance` | Theme management (light/dark/system) via cookie + CSS class |
| `use-clipboard` | Copy text to clipboard |
| `use-current-url` | Current URL string |
| `use-flash-toast` | Listen for Inertia flash events and show sonner toasts |
| `use-initials` | Extract initials from name |
| `use-mobile` | Detect mobile viewport (768px breakpoint) |
| `use-mobile-navigation` | Mobile sidebar toggle state |

### Tailwind CSS v4 Theme (from `app.css`)
- **Color space:** OKLCH (perceptually uniform)
- **Primary:** Neutral black (`oklch(0.205 0 0)`) / white (`oklch(0.985 0 0)`) in dark
- **Accent color:** Amber applied via classes like `text-amber-600`, `bg-amber-600`, `border-amber-600`
- **Border radius:** `--radius: 0.625rem` → lg=10px, md=8px, sm=6px
- **Font:** Instrument Sans (Google Font via Vite's bunny() provider)
- **Dark mode:** `.dark` class variant (`@custom-variant dark (&:is(.dark *))`)
- **Animation:** `tw-animate-css` for dialog/sheet enter/exit

### Wayfinder (Frontend Route Helpers)
Auto-generated in `resources/js/routes/`. Each route gets a typed function:
```tsx
import { index as catalogIndex, show as catalogShow } from '@/routes/catalog';
import { index as cartIndex } from '@/routes/cart';

// Usage:
catalogIndex()                    // RouteDefinition { url: '/catalog', method: 'get' }
catalogShow({ product: 'slug' }) // RouteDefinition { url: '/catalog/slug', method: 'get' }

// Pass to Inertia Link:
<Link href={catalogIndex()}>Catalog</Link>
<Link href={catalogShow({ product: product.slug })}>{product.name}</Link>

// Query params:
<Link href={catalogIndex({ query: { categories: 'sofas' } })}>Sofas</Link>
```

### Shared Utilities (`resources/js/lib/utils.ts`)
```tsx
cn(...inputs: ClassValue[])          // clsx + tailwind-merge
formatPrice(price: number)           // Returns 'R1,234.56'
toUrl(href: NonNullable<InertiaLinkProps['href']>)  // Normalizes route def to URL string
```

---

## Key Technical Decisions & Conventions

### 1. Session-Based Cart
Cart data lives **only in the PHP session**, not in a database table. Cart items are collections of arrays (not Eloquent models). Cart count is shared globally via Inertia props.

### 2. No Payment Gateway
Orders are created with `paid_at = now()` at checkout time. There is no Stripe/PayPal integration. This is a deliberate simplification.

### 3. Admin vs Storefront
- **No Bagisto package dependency** — this is a custom Laravel app, not a Bagisto project
- Admin and customer-facing pages both use the same Inertia/React frontend
- Admin routes are prefixed with `/admin` and use the `AppLayout` (with sidebar)
- Customer-facing routes use either `CatalogLayout` (catalog) or `AppLayout` (cart/checkout/orders)
- There's no explicit authorization/policy layer — admin routes are gated only by `auth` + `verified`

### 4. Shipping Calculation
Uses `laratables/laravel-shipping` package which resolves shipping costs via config-based rules:
- Base fee + multi-product surcharge + heavy item surcharge
- Free shipping over a configurable threshold (default R500 in cart display, R75 in config)
- Delivery zones stored in DB with per-area fees

### 5. TypeScript Strict Mode
- `strict: true` in tsconfig
- All route functions are fully typed via Wayfinder
- Page props are typed via interface definitions at the top of each page component

---

## How to Contribute

### Adding a New Page
1. Create controller method (or use Inertia::render in route directly)
2. Add route in `routes/web.php` with a named route
3. Run `php artisan wayfinder:generate` to regenerate TypeScript route helpers
4. Create page component in `resources/js/pages/`
5. Read the `InertiaLinkProps['href']` type — route functions return `RouteDefinition` objects, not plain strings

### Adding a New Database Column
1. Create a migration: `php artisan make:migration add_column_to_table`
2. Update the model's `$fillable` array and `casts()` method
3. Update the relevant Form Request validation rules
4. Update the TypeScript types in `resources/js/types/` or the page component interfaces

### Adding a New Admin Feature
1. Create controller in `app/Http/Controllers/Admin/`
2. Add route in the `Route::prefix('admin')` group
3. Create Form Request for validation
4. Create page component in `resources/js/pages/admin/`

---

## Development Commands

```bash
# Full dev setup
composer setup

# Run dev servers (PHP + Queue + Vite concurrently)
composer dev

# Frontend dev (Vite only)
npm run dev

# Build for production
npm run build

# Lint PHP
composer lint

# TypeScript check
npm run types:check

# PHP static analysis
composer types:check

# Full test suite
composer test

# Format frontend
npm run format

# Regenerate Wayfinder routes
php artisan wayfinder:generate
```
