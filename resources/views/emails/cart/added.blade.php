<x-mail::message>
# Item Added to Your Cart

Hi **{{ $user->name }}**,

You just added **{{ $product->name }}** (x{{ $quantity }}) to your shopping cart.

<x-mail::button :url="route('cart.index')">
View Cart & Checkout
</x-mail::button>

Don't wait too long — stock is limited!<br>
{{ config('app.name') }}
</x-mail::message>
