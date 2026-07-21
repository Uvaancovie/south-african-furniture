<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Collection;

class CartService
{
    protected string $sessionKey = 'cart';

    public function items(): Collection
    {
        return collect(session($this->sessionKey, []));
    }

    public function count(): int
    {
        return $this->items()->sum('quantity');
    }

    public function total(): float
    {
        return $this->items()->sum(fn ($item) => $item['price'] * $item['quantity']);
    }

    public function add(Product $product, int $quantity = 1): void
    {
        $items = $this->items()->toArray();

        $existing = collect($items)->firstWhere('product_id', $product->id);

        if ($existing) {
            $items = collect($items)->map(function ($item) use ($product, $quantity) {
                if ($item['product_id'] === $product->id) {
                    $item['quantity'] += $quantity;
                }
                return $item;
            })->toArray();
        } else {
            $items[] = [
                'product_id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => (float) $product->price,
                'quantity' => $quantity,
                'image' => $product->primaryImage?->image_path,
                'sku' => $product->sku,
                'weight_kg' => $product->weight ? (float) $product->weight : null,
                'shipping_cost' => null,
            ];
        }

        session([$this->sessionKey => $items]);
    }

    public function update(int $productId, int $quantity): void
    {
        $items = $this->items()->map(function ($item) use ($productId, $quantity) {
            if ($item['product_id'] === $productId) {
                $item['quantity'] = max(0, $quantity);
            }
            return $item;
        })->filter(fn ($item) => $item['quantity'] > 0)->values()->toArray();

        session([$this->sessionKey => $items]);
    }

    public function remove(int $productId): void
    {
        $items = $this->items()
            ->reject(fn ($item) => $item['product_id'] === $productId)
            ->values()
            ->toArray();

        session([$this->sessionKey => $items]);
    }

    public function clear(): void
    {
        session()->forget($this->sessionKey);
    }
}
