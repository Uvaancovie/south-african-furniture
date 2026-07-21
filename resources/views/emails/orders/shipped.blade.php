<x-mail::message>
# Your Order Has Been Shipped!

Hi **{{ $order->user->name }}**,

Great news! Your order **{{ $order->order_number }}** is on its way.

<x-mail::table>
| Item | Qty |
|:-----|:---:|
@foreach ($order->items as $item)
| {{ $item->product_name }} | {{ $item->quantity }} |
@endforeach
</x-mail::table>

**Shipping to:**<br>
{{ $order->shipping_address['address_line1'] }}<br>
{{ $order->shipping_address['city'] }}<br>
{{ $order->shipping_address['country'] }}

<x-mail::button :url="route('orders.show', $order)">
Track Order
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
