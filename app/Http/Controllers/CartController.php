<?php

namespace App\Http\Controllers;

use App\Mail\ItemAddedToCart;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(
        protected CartService $cart
    ) {}

    public function index(): Response
    {
        return Inertia::render('cart/index', [
            'items' => $this->cart->items(),
            'total' => $this->cart->total(),
            'count' => $this->cart->count(),
        ]);
    }

    public function add(Request $request, Product $product): RedirectResponse
    {
        $quantity = $request->integer('quantity', 1);

        if ($product->stock_quantity < $quantity) {
            return back()->with('error', 'Not enough stock available.');
        }

        $this->cart->add($product, $quantity);

        Mail::to(auth()->user())->queue(new ItemAddedToCart($product, $quantity, $request->user()));

        return back()->with('success', "{$product->name} added to cart.");
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $quantity = $request->integer('quantity', 1);

        if ($quantity > $product->stock_quantity) {
            return back()->with('error', 'Not enough stock available.');
        }

        $this->cart->update($product->id, $quantity);

        return back()->with('success', 'Cart updated.');
    }

    public function remove(Product $product): RedirectResponse
    {
        $this->cart->remove($product->id);

        return back()->with('success', 'Item removed from cart.');
    }
}
