<?php

namespace App\Http\Controllers;

use App\Mail\OrderConfirmation;
use App\Models\DeliveryZone;
use App\Models\Order;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Laratables\Shipping\Services\ShippingResolver;

class CheckoutController extends Controller
{
    public function __construct(
        protected CartService $cart,
        protected ShippingResolver $shipping
    ) {}

    public function index(): Response|RedirectResponse
    {
        if ($this->cart->count() === 0) {
            return to_route('cart.index');
        }

        $user = auth()->user();

        $zones = DeliveryZone::orderBy('province')->orderBy('area')->get();

        $provinces = $zones->groupBy('province')->map(function ($zones, $province) {
            return [
                'name' => $province,
                'zones' => $zones->values()->map(fn ($z) => [
                    'id' => $z->id,
                    'area' => $z->area,
                    'fee' => (float) $z->fee,
                ]),
            ];
        })->values();

        return Inertia::render('checkout/index', [
            'items' => $this->cart->items(),
            'total' => $this->cart->total(),
            'count' => $this->cart->count(),
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
            'provinces' => $provinces,
            'deliveryZones' => DeliveryZone::orderBy('province')->orderBy('area')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        if ($this->cart->count() === 0) {
            return to_route('cart.index')->with('error', 'Your cart is empty.');
        }

        $validated = $request->validate([
            'delivery_zone_id' => ['required', 'integer', 'exists:delivery_zones,id'],
            'billing_address.name' => ['required', 'string', 'max:255'],
            'billing_address.phone' => ['nullable', 'string', 'max:20'],
            'billing_address.address_line1' => ['required', 'string', 'max:255'],
            'billing_address.address_line2' => ['nullable', 'string', 'max:255'],
            'billing_address.city' => ['required', 'string', 'max:100'],
            'billing_address.state' => ['nullable', 'string', 'max:100'],
            'billing_address.postal_code' => ['nullable', 'string', 'max:20'],
            'billing_address.country' => ['required', 'string', 'max:100'],
            'shipping_same' => ['boolean'],
            'shipping_address.name' => ['required_if:shipping_same,false', 'string', 'max:255'],
            'shipping_address.phone' => ['nullable', 'string', 'max:20'],
            'shipping_address.address_line1' => ['required_if:shipping_same,false', 'string', 'max:255'],
            'shipping_address.address_line2' => ['nullable', 'string', 'max:255'],
            'shipping_address.city' => ['required_if:shipping_same,false', 'string', 'max:100'],
            'shipping_address.state' => ['nullable', 'string', 'max:100'],
            'shipping_address.postal_code' => ['nullable', 'string', 'max:20'],
            'shipping_address.country' => ['required_if:shipping_same,false', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $items = $this->cart->items();
        $subtotal = $this->cart->total();
        $tax = round($subtotal * 0.15, 2);

        $deliveryZone = DeliveryZone::findOrFail($validated['delivery_zone_id']);
        $shippingResult = $this->shipping->resolve(
            $items->map(fn ($item) => [
                'product_id'    => $item['product_id'],
                'name'          => $item['name'],
                'weight_kg'     => $item['weight_kg'] ?? null,
                'shipping_cost' => $item['shipping_cost'] ?? null,
                'quantity'      => $item['quantity'],
                'price'         => $item['price'],
            ])->all(),
            $subtotal
        );
        $shippingCost = $shippingResult['total_shipping'];
        $total = $subtotal + $tax + $shippingCost;

        if ($validated['shipping_same'] ?? false) {
            $validated['shipping_address'] = $validated['billing_address'];
        }

        $order = Order::create([
            'user_id' => auth()->id(),
            'delivery_zone_id' => $deliveryZone->id,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping_cost' => $shippingCost,
            'total' => $total,
            'billing_address' => $validated['billing_address'],
            'shipping_address' => $validated['shipping_address'],
            'notes' => $validated['notes'] ?? null,
            'paid_at' => now(),
        ]);

        foreach ($items as $item) {
            $order->items()->create([
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['price'],
                'subtotal' => $item['price'] * $item['quantity'],
                'product_name' => $item['name'],
                'product_data' => ['slug' => $item['slug'], 'sku' => $item['sku']],
            ]);
        }

        foreach ($items as $item) {
            $product = Product::find($item['product_id']);
            if ($product) {
                $product->decrement('stock_quantity', $item['quantity']);
            }
        }

        $this->cart->clear();

        Mail::to($order->user)->queue(new OrderConfirmation($order));

        return to_route('orders.show', $order)
            ->with('success', "Order {$order->order_number} placed successfully!");
    }
}
