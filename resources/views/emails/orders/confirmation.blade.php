<x-mail::message>
# Order Confirmed!

Hi **{{ $order->user->name }}**,

Your order **{{ $order->order_number }}** has been placed successfully and is now being processed.

<x-mail::table>
| Item | Qty | Price |
|:-----|:---:|------:|
@foreach ($order->items as $item)
| {{ $item->product_name }} | {{ $item->quantity }} | R {{ number_format($item->subtotal, 2) }} |
@endforeach
</x-mail::table>

**Subtotal:** R {{ number_format($order->subtotal, 2) }}
**Shipping:** R {{ number_format($order->shipping_cost, 2) }}
**VAT (15%):** R {{ number_format($order->tax, 2) }}
**Total:** R {{ number_format($order->total, 2) }}

<x-mail::button :url="route('orders.show', $order)">
View Order
</x-mail::button>

Your invoice is attached to this email.

Thanks for shopping with us!<br>
{{ config('app.name') }}
</x-mail::message>
