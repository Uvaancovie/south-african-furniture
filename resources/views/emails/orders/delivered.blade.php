<x-mail::message>
# Order Delivered!

Hi **{{ $order->user->name }}**,

Your order **{{ $order->order_number }}** has been delivered. We hope you love your new furniture!

If you have any questions or concerns, feel free to reply to this email or contact us.

<x-mail::button :url="route('orders.show', $order)">
View Order
</x-mail::button>

Thanks for choosing {{ config('app.name') }}!<br>
{{ config('app.name') }}
</x-mail::message>
