<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laratables\Shipping\Services\ShippingResolver;

class OrderController extends Controller
{
    public function __construct(
        protected ShippingResolver $shipping
    ) {}

    public function index(Request $request): Response
    {
        $orders = Order::with('items')
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('orders/index', [
            'orders' => $orders,
        ]);
    }

    public function show(int $id): Response
    {
        $order = Order::with(['items', 'messages.user', 'deliveryZone'])
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        $products = Product::whereIn('id', $order->items->pluck('product_id'))->get()->keyBy('id');

        $cartItems = $order->items->map(function ($item) use ($products) {
            $product = $products->get($item->product_id);
            return [
                'product_id'    => $item->product_id,
                'name'          => $item->product_name,
                'weight_kg'     => $product?->weight ? (float) $product->weight : null,
                'shipping_cost' => null,
                'quantity'      => $item->quantity,
                'price'         => (float) $item->unit_price,
            ];
        })->all();

        $deliveryZone = $order->deliveryZone;

        $shippingResult = $this->shipping->resolve($cartItems, (float) $order->subtotal);

        return Inertia::render('orders/show', [
            'order' => $order,
            'authUserId' => auth()->id(),
            'shippingBreakdown' => [
                'total_shipping'      => $shippingResult['total_shipping'],
                'is_free_shipping'    => $shippingResult['is_free_shipping'],
                'free_shipping_info'  => $shippingResult['free_shipping_info'],
                'algorithm_result'    => $shippingResult['algorithm_result'],
                'flat_items'          => $shippingResult['flat_items'],
                'warnings'            => $shippingResult['warnings'],
                'current_zone_fee'    => $deliveryZone ? (float) $deliveryZone->fee : 0,
                'current_zone_area'   => $deliveryZone ? $deliveryZone->area : null,
                'current_zone_province' => $deliveryZone ? $deliveryZone->province : null,
            ],
        ]);
    }

    public function message(Request $request, int $id): RedirectResponse
    {
        $order = Order::where('user_id', auth()->id())->findOrFail($id);

        $data = $request->validate(['message' => ['required', 'string', 'max:1000']]);

        $order->messages()->create([
            'user_id' => auth()->id(),
            'message' => $data['message'],
        ]);

        return back()->with('success', 'Message sent.');
    }
}
