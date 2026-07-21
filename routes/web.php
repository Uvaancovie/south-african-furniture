<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ShippingEstimateController;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'featuredProducts' => Product::with('primaryImage')
            ->where('is_featured', true)
            ->where('is_active', true)
            ->limit(4)
            ->get(),
        'categories' => Category::withCount('products')
            ->whereNull('parent_id')
            ->orderBy('name')
            ->get(),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard', [
            'stats' => [
                'total_products' => Product::count(),
                'active_products' => Product::where('is_active', true)->count(),
                'inactive_products' => Product::where('is_active', false)->count(),
                'featured_products' => Product::where('is_featured', true)->count(),
                'total_categories' => Category::count(),
                'low_stock_products' => Product::where('stock_quantity', '<=', 5)
                    ->where('stock_quantity', '>', 0)
                    ->count(),
                'out_of_stock' => Product::where('stock_quantity', '<=', 0)->count(),
                'categories_with_products' => Category::has('products')->count(),
                'total_orders' => Order::count(),
                'pending_orders' => Order::where('status', 'pending')->count(),
                'total_revenue' => Order::sum('total'),
                'total_customers' => \App\Models\User::count(),
            ],
            'recentProducts' => Product::with('primaryImage')
                ->latest()
                ->limit(5)
                ->get(),
            'categoryBreakdown' => Category::withCount('products')
                ->orderBy('products_count', 'desc')
                ->limit(10)
                ->get(),
            'recentOrders' => Order::with('user')
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    })->name('dashboard');

    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/{product}', [CartController::class, 'add'])->name('cart.add');
    Route::patch('/cart/{product}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{product}', [CartController::class, 'remove'])->name('cart.remove');

    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::get('/orders/{order}/invoice', [InvoiceController::class, 'download'])->name('orders.invoice');
    Route::post('/orders/{order}/message', [OrderController::class, 'message'])->name('orders.message');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('categories', CategoryController::class);
        Route::resource('products', ProductController::class);
        Route::get('orders', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
        Route::patch('orders/{order}', [AdminOrderController::class, 'update'])->name('orders.update');
        Route::post('orders/{order}/message', [AdminOrderController::class, 'message'])->name('orders.message');
        Route::get('customers', [CustomerController::class, 'index'])->name('customers.index');
    });
});

Route::get('catalog', [CatalogController::class, 'index'])->name('catalog.index');
Route::get('catalog/{product:slug}', [CatalogController::class, 'show'])->name('catalog.show');

Route::get('shipping/estimate', ShippingEstimateController::class)->name('shipping.estimate');

require __DIR__.'/settings.php';
