<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\DeliveryZone;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::with(['category', 'primaryImage'])
            ->where('is_active', true);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($categoriesParam = $request->input('categories')) {
            $slugs = array_filter(explode(',', $categoriesParam));
            $categoryIds = Category::whereIn('slug', $slugs)->pluck('id');
            $query->whereIn('category_id', $categoryIds);
        }

        if ($priceMin = $request->input('price_min')) {
            $query->where('price', '>=', $priceMin);
        }

        if ($priceMax = $request->input('price_max')) {
            $query->where('price', '<=', $priceMax);
        }

        if ($materialsParam = $request->input('materials')) {
            $materialsList = array_filter(explode(',', $materialsParam));
            $query->whereIn('material', $materialsList);
        }

        if ($colorsParam = $request->input('colors')) {
            $colorsList = array_filter(explode(',', $colorsParam));
            $query->whereIn('color', $colorsList);
        }

        $sort = $request->input('sort', 'latest');
        match ($sort) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'name' => $query->orderBy('name'),
            default => $query->orderBy('created_at', 'desc'),
        };

        $products = $query->paginate(12)->withQueryString();

        $categories = Category::whereNull('parent_id')
            ->with(['children' => fn ($q) => $q->withCount('products')])
            ->withCount('products')
            ->orderBy('name')
            ->get();

        $materials = Product::where('is_active', true)
            ->whereNotNull('material')
            ->select('material')
            ->distinct()
            ->orderBy('material')
            ->pluck('material');

        $colors = Product::where('is_active', true)
            ->whereNotNull('color')
            ->select('color')
            ->distinct()
            ->orderBy('color')
            ->pluck('color');

        return Inertia::render('catalog/index', [
            'products' => $products,
            'categories' => $categories,
            'materials' => $materials,
            'colors' => $colors,
            'filters' => [
                'search' => $request->input('search'),
                'categories' => $request->input('categories'),
                'materials' => $request->input('materials'),
                'colors' => $request->input('colors'),
                'price_min' => $request->input('price_min'),
                'price_max' => $request->input('price_max'),
                'sort' => $sort,
            ],
        ]);
    }

    public function show(Product $product): Response
    {
        $product->load(['category', 'images', 'category.parent']);

        $related = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->with('primaryImage')
            ->limit(4)
            ->get();

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

        return Inertia::render('catalog/show', [
            'product' => $product,
            'relatedProducts' => $related,
            'provinces' => $provinces,
        ]);
    }
}
