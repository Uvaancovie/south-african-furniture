# SAFS Furniture — Flowcharts (Issue #21)

**Scope:** Flowcharts for the four core flows:
1. Auth (register / login / logout)
2. Catalogue browse
3. Cart & checkout
4. Admin product + image management

**Grounded in:** current prototype (`src/App.vue`, `AdminLogin.vue`, `Catalog.vue`, `CartDrawer.vue`, `ProductDetail.vue`, `AdminUpload.vue`) + Supabase Auth/Storage/Postgres.
**Legend:** `(())` start/stop · `[]` process · `{ }` decision (≤ 2 outcomes) · `[/ /]` input/output.

---

## 1. Auth Flowchart

```mermaid
flowchart TD
    START((Start))
    START --> CHECK[[Check session<br/>supabase.auth.getSession]]
    CHECK -->|Session valid| DASH[/Admin dashboard/]
    DASH --> END1((End))
    CHECK -->|No session| FORM[[Show login / register form]]
    FORM --> MODE{Sign up<br/>or sign in?}
    MODE -->|Sign in| VALIDATE[[Validate email + password fields]]
    VALIDATE --> VALID{Inputs valid?}
    VALID -->|No| FORM
    VALID -->|Yes| SIGNIN[[supabase.auth.signInWithPassword]]
    SIGNIN --> SUCCESS{Login success?}
    SUCCESS -->|No| ERROR[[Show error message]]
    ERROR --> FORM
    SUCCESS -->|Yes| AUTH[[emit authenticated -> router.push /admin]]
    AUTH --> DASH

    MODE -->|Sign up| SIGNUP[[supabase.auth.signUp]]
    SIGNUP --> NSESSION{Session auto-created?}
    NSESSION -->|Yes| AUTH
    NSESSION -->|No| MAIL[[Show 'check email to confirm' message]]
    MAIL --> SIGNIN

    DASH --> LOGOUT{Logout clicked?}
    LOGOUT -->|No| DASH
    LOGOUT -->|Yes| OUT[[supabase.auth.signOut<br/>clear session -> router.push /]]
    OUT --> END2((End))
```

---

## 2. Catalogue Browse Flowchart

```mermaid
flowchart TD
    START((Start))
    START --> OPEN[[Open home / catalogue page]]
    OPEN --> FETCH[[Query Supabase:<br/>products + product_images<br/>is_active = true]]
    FETCH --> RESULT{Data returned?}
    RESULT -->|Yes| LIVE[[Use live products<br/>sort images by sort_order]]
    RESULT -->|No| SAMPLE[[Fall back to sample dataset]]
    LIVE --> GRID
    SAMPLE --> GRID
    GRID[[Render product cards<br/>primary image + name + price]]

    GRID --> ACTION{User action?}
    ACTION -->|Search / filter| FILTER[[Filter client-side by<br/>category, price, material, stock]]
    FILTER --> GRID
    ACTION -->|Open product| DETAIL[[Show ProductDetail.vue<br/>gallery + specs + delivery info]]
    ACTION -->|Add to cart / quick add| CART[[handleAddToCart:<br/>merge or push cartItems]]
    DETAIL --> CART2{Add to cart?}
    CART2 -->|Yes| CART
    CART2 -->|No| DETAIL
    CART --> TOAST[[Show 'Added to cart' toast]]
    TOAST --> BROWSE{Keep browsing?}
    BROWSE -->|Yes| GRID
    BROWSE -->|No| END1((End))
```

---

## 3. Cart & Checkout Flowchart

```mermaid
flowchart TD
    START((Start))
    START --> OPEN[[Open cart drawer]]
    OPEN --> EMPTY{Cart has items?}
    EMPTY -->|No| E1[[Show empty-state message]]
    E1 --> END1((End))
    EMPTY -->|Yes| LIST[[List line items]]
    LIST --> TOTALS[[Compute subtotal]]
    TOTALS --> SHIP{Subtotal > R 15 000?}
    SHIP -->|Yes| FREE[[Shipping = R 0<br/>(Free Delivery)]]
    SHIP -->|No| FEE[[Shipping = R 450]]
    FREE --> TOTAL
    FEE --> TOTAL
    TOTAL[[Grand total incl. VAT]]

    LIST --> MGT{Update quantity<br/>or remove?}
    MGT -->|+ / -| QTY{Qty <= 0?}
    MGT -->|Remove| QTY2[Remove line item]
    QTY -->|Yes| QTY2
    QTY -->|No| LIST
    QTY2 --> LIST

    TOTAL --> PROCEED{Proceed to<br/>secure checkout?}
    PROCEED -->|No| LIST
    PROCEED -->|Yes + current prototype| CLEAR[[Toast 'Checkout initialized'<br/>clear cart + close drawer]]
    CLEAR --> END2((End))

    PROCEED -->|Yes + target flow| CHECK[[Validate addresses + zone + terms]]
    CHECK --> VALID{Valid?}
    VALID -->|No| ERROR[[Show validation errors]]
    ERROR --> LIST
    VALID -->|Yes| INTENT[[Create payment intent at gateway]]
    INTENT --> GATEWAY[[Redirect to hosted payment page<br/>(no card data via platform)]]
    GATEWAY --> PAID{Payment success?}
    PAID -->|No| FAILED[[Return to checkout with error]]
    FAILED --> LIST
    PAID -->|Yes| WEBHOOK[[Signed webhook verified<br/>(HMAC + idempotency)]]
    WEBHOOK --> ORDER[[Insert order + order_items<br/>decrement stock, paid_at = now]]
    ORDER --> EMAIL[[Send confirmation email<br/>with PDF VAT invoice]]
    EMAIL --> CONFIRM[/Order confirmation page<br/>/orders/id/]
    CONFIRM --> END3((End))
```

---

## 4. Admin Product + Image Flowchart

```mermaid
flowchart TD
    START((Start))
    START --> LOGIN[[Admin authenticates]]
    LOGIN --> INV[[fetchInventory: products + product_images]]
    INV --> TAB{Action?}

    TAB -->|Create product| FORM[[Fill form + select/drop images]]
    FORM --> PREVIEW[[Preview images client-side<br/>via FileReader]]
    PREVIEW --> VALIDATE{Proudct name<br/>and price set?}
    VALIDATE -->|No| FORM
    VALIDATE -->|Yes| SLUG[[generateSlug]]
    SLUG --> INSERT[[INSERT products -> select().single()]]
    INSERT --> ID[/newProduct.id/]
    ID --> LOOP{More files?}
    LOOP -->|Yes| UPLOAD[[Upload file to<br/>storage: product-images]]
    UPLOAD --> OK{Upload success?}
    OK -->|No| LOOP
    OK -->|Yes| URL[[getPublicUrl]]
    URL --> PIMG[[INSERT product_images<br/>is_primary: first image<br/>sort_order: index]]
    PIMG --> LOOP
    LOOP -->|No| RESET[[Reset form]]
    RESET --> REFRESH[[fetchInventory + emit product-updated]]
    REFRESH --> END1((End))

    TAB -->|Edit product| LOAD[[Load existing images<br/>(is_primary + sort_order)]]
    LOAD --> EDIT{User action?}
    EDIT -->|Star as primary| PRIMARY[[setPrimaryImage -><br/>UPDATE is_primary + sort_order]]
    EDIT -->|Reorder arrows| MOVE[[moveExistingImage -><br/>persist sort_order]]
    EDIT -->|Upload new images| NIMG[[Upload + insert new product_images<br/>(primary only if none exists)]]
    EDIT -->|Update details| UPD[[UPDATE products]]
    PRIMARY --> SAVE[[Success message + refresh]]
    MOVE --> SAVE
    NIMG --> SAVE
    UPD --> SAVE
    SAVE --> END2((End))

    TAB -->|Delete product| DEL{{Confirm delete?}}
    DEL -->|No| END3((End))
    DEL -->|Yes| DELETE[[DELETE products WHERE id]]
    DELETE --> REMOVE[[Remove from local list]]
    REMOVE --> END4((End))

    TAB -->|Toggle active| TOGGLE[[UPDATE is_active]]
    TOGGLE --> END5((End))
```

---

## Rendering tips

- **GitHub:** renders natively in issues and markdown.
- **VS Code:** "Mermaid Preview" extension.
- **Export:** `npx @mermaid-js/mermaid-cli -i uml/flowcharts.md -o flowcharts.svg`
- **Paste into issue #21:** wrap each diagram in ```mermaid fenced code blocks.
