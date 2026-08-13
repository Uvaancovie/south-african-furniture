# SAFS Furniture — Sequence Diagrams (Issue #22)

**Scope:** Sequence diagrams for the same four flows as issue #21:
1. Auth (register / login / logout)
2. Catalogue browse & product view
3. Cart & checkout
4. Admin product + image management

**Grounded in:** current prototype implementation (`src/App.vue`, `src/components/AdminLogin.vue`, `Catalog.vue`, `CartDrawer.vue`, `ProductDetail.vue`, `AdminUpload.vue`) with Supabase Auth / Storage / Postgres.

---

## 1. Auth — Registration, Login & Logout

```mermaid
sequenceDiagram
    autonumber
    actor U as Admin / User
    participant LOGIN as Auth UI<br/>(AdminLogin.vue)
    participant APP as App Shell<br/>(App.vue)
    participant AUTH as Supabase Auth
    participant DB as Supabase Postgres
    participant MAIL as Email Service

    alt Registration
        U->>LOGIN: Enter email + password (sign-up mode)
        LOGIN->>AUTH: supabase.auth.signUp(email, password)
        AUTH->>DB: Create user (password hashed)
        AUTH-->>MAIL: Send confirmation email
        alt Session auto-created
            AUTH-->>LOGIN: data.session
            LOGIN-->>APP: emit('authenticated', user)
        else Email confirmation required
            AUTH-->>LOGIN: data.user (no session)
            LOGIN-->>U: "Check email to confirm"
        end
    else Login
        U->>LOGIN: Enter credentials (sign-in mode)
        LOGIN->>AUTH: supabase.auth.signInWithPassword(email, password)
        AUTH-->>LOGIN: data.user + session (or error)
        LOGIN-->>APP: emit('authenticated', user)
    end

    APP->>APP: handleAuthenticated(user)
    APP->>APP: router.push('/admin')
    APP->>AUTH: supabase.auth.getSession()
    AUTH-->>APP: session
    APP->>APP: onAuthStateChange listener active
    APP->>DB: fetchAllProducts() → active products
    DB-->>APP: product list

    alt Logout
        U->>APP: Click "Sign Out"
        APP->>AUTH: supabase.auth.signOut()
        AUTH-->>APP: session cleared
        APP->>APP: userSession = null, router.push('/')
    end
```

---

## 2. Catalogue Browse & Product View

```mermaid
sequenceDiagram
    autonumber
    actor C as Consumer
    participant UI as Storefront<br/>(LandingPage.vue / Catalog.vue)
    participant APP as App Shell<br/>(App.vue)
    participant DB as Supabase Postgres
    participant CDN as Storage / CDN<br/>(product images)

    C->>UI: Open home / catalogue
    UI->>DB: select products(*) product_images(*), is_active, order created_at desc
    DB-->>UI: products + images (sorted by sort_order)
    UI->>CDN: Load primary image (product_images[0])
    CDN-->>UI: Image asset
    UI-->>C: Render cards (image, name, price, rating)

    loop Search & filter
        C->>UI: Type query / apply filters
        UI->>UI: Client-side filter (category, price, material, stock)
        UI-->>C: Updated results
    end

    C->>UI: Click product card
    UI-->>APP: emit('select-product', product)
    APP->>APP: router.push(product/slug)
    APP-->>UI: Show ProductDetail.vue
    C->>UI: View gallery
    UI->>CDN: Load images by sort_order
    CDN-->>UI: Gallery images
    C->>UI: Click "Add To Cart" (or quick add)
    UI-->>APP: emit('add-to-cart', { product, quantity })
    APP->>APP: handleAddToCart → merge or push cartItems
    APP-->>C: Toast "Added to cart"
```

---

## 3. Cart & Checkout

```mermaid
sequenceDiagram
    autonumber
    actor C as Consumer
    participant DETAIL as ProductDetail.vue
    participant DRAWER as CartDrawer.vue
    participant APP as App Shell<br/>(App.vue)
    participant GW as Payment Gateway<br/>(planned: hosted, PCI SAQ A)
    participant DB as Supabase Postgres
    participant MAIL as Email Queue

    C->>DETAIL: Adjust quantity, select colour
    DETAIL-->>APP: emit('add-to-cart', payload)
    APP->>APP: handleAddToCart (merge if exists / push new)
    APP-->>C: Toast confirmation

    C->>APP: Open cart drawer
    APP-->>DRAWER: cartItems
    DRAWER->>DRAWER: Compute subtotal, shipping (free > R15 000 else R450), total incl. VAT
    DRAWER-->>C: Line items + totals

    loop Manage cart
        C->>DRAWER: +/- quantity or remove
        DRAWER-->>APP: emit('update-quantity' / 'remove-item')
        APP->>APP: Update cartItems state
    end

    C->>DRAWER: "Proceed to Secure Checkout"
    DRAWER-->>APP: emit('checkout')

    alt Current prototype
        APP->>APP: handleCheckout() → toast + clear cart
    else Target flow (FR-CHK-005..007)
        APP->>GW: Create payment intent (subtotal + VAT + shipping)
        GW-->>APP: payment_url + reference
        APP-->>C: Redirect to hosted payment page
        C->>GW: Complete payment (no card data via platform)
        GW-->>APP: Signed webhook (succeeded)
        APP->>DB: Verify + insert order/order_items, decrement stock, paid_at = now
        APP->>MAIL: Enqueue OrderConfirmation (PDF VAT invoice)
        APP-->>C: Redirect to /orders/{id} + confirmation email
    end
```

---

## 4. Admin — Product & Image Management

```mermaid
sequenceDiagram
    autonumber
    actor A as Admin
    participant ADM as AdminUpload.vue
    participant AUTH as Supabase Auth
    participant ST as Supabase Storage<br/>(product-images bucket)
    participant DB as Supabase Postgres<br/>(products, product_images)
    participant APP as App Shell / Storefront

    A->>ADM: Open admin portal (authenticated)
    ADM->>DB: fetchInventory() → products + product_images
    DB-->>ADM: Inventory rows (images by sort_order)

    alt Create new product
        A->>ADM: Fill form + select/drop images
        ADM->>ADM: Preview via FileReader (imagePreviews)
        A->>ADM: Submit "Publish Product to Catalog"
        ADM->>ADM: generateSlug()
        ADM->>DB: INSERT products → select().single()
        DB-->>ADM: newProduct (id)
        loop Each selected file
            ADM->>ST: upload({productId}/{Date.now()}-{i}.{ext}, file)
            ST-->>ADM: stored object
            ADM->>ST: getPublicUrl(fileName)
            ST-->>ADM: publicUrl
            ADM->>DB: INSERT product_images (is_primary: i=0, sort_order: i)
        end
        ADM->>ADM: Reset form → switch to inventory tab
        ADM->>DB: fetchInventory() refresh
        ADM-->>APP: emit('product-updated')
        APP->>DB: fetchAllProducts() → storefront updates
    else Edit existing product
        A->>ADM: Click edit (handleEditProduct)
        ADM->>ADM: Load existingImages (is_primary, sort_order)
        A->>ADM: Star as primary / reorder with arrows
        ADM->>DB: UPDATE product_images SET is_primary, sort_order
        A->>ADM: Upload additional images
        ADM->>ST: upload new files
        ADM->>DB: INSERT product_images (is_primary only if none exists)
        ADM->>DB: UPDATE products (details, price, stock)
    else Delete product
        A->>ADM: Click delete (confirm)
        ADM->>DB: DELETE products WHERE id
        DB-->>ADM: row removed
        ADM->>ADM: Remove from local list + refresh
    end
```

---

## Rendering tips

- **GitHub:** Mermaid sequence diagrams render natively in issues and markdown.
- **VS Code:** "Mermaid Preview" extension or markdown preview.
- **Export PNG/SVG:** `npx @mermaid-js/mermaid-cli -i uml/sequence-diagrams.md -o sequence-diagrams.svg`
- **Paste into issue #22:** wrap each block in ```mermaid fenced code blocks.