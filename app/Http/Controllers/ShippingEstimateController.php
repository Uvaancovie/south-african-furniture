<?php

namespace App\Http\Controllers;

use App\Models\DeliveryZone;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laratables\Shipping\Services\ShippingResolver;

class ShippingEstimateController extends Controller
{
    public function __construct(
        protected ShippingResolver $shipping
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1', 'max:999'],
            'delivery_zone_id' => ['required', 'integer', 'exists:delivery_zones,id'],
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $quantity = (int) $validated['quantity'];
        $deliveryZone = DeliveryZone::findOrFail($validated['delivery_zone_id']);

        $items = [
            [
                'product_id' => $product->id,
                'name' => $product->name,
                'weight_kg' => $product->weight,
                'shipping_cost' => null,
                'quantity' => $quantity,
                'price' => (float) $product->price,
            ],
        ];

        $subtotal = (float) $product->price * $quantity;
        $result = $this->shipping->resolve($items, $subtotal);

        return response()->json([
            'total_shipping' => $result['total_shipping'],
            'is_free_shipping' => $result['is_free_shipping'],
            'free_shipping_info' => $result['free_shipping_info'],
            'algorithm_result' => $result['algorithm_result'] ?? null,
            'flat_items' => $result['flat_items'] ?? [],
            'warnings' => $result['warnings'] ?? [],
            'current_zone_fee' => (float) $deliveryZone->fee,
            'current_zone_area' => $deliveryZone->area,
            'current_zone_province' => $deliveryZone->province,
        ]);
    }
}
