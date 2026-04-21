<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // All products for customer home
    public function index(Request $request)
    {
        $query = Product::with(['seller', 'category', 'primaryImage', 'reviews'])
            ->where('is_active', true);

        // Search
        if ($request->search) {
            $query->where('name', 'like', '%'.$request->search.'%')
                  ->orWhere('description', 'like', '%'.$request->search.'%');
        }

        // Category filter
        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        $products = $query->latest()->get();

        return response()->json($products);
    }

    // Single product detail
    public function show($id)
    {
        $product = Product::with([
            'seller',
            'category',
            'images',
            'reviews.customer',
        ])->findOrFail($id);

        return response()->json($product);
    }

    // All categories
    public function categories()
    {
        return response()->json(Category::all());
    }

    // Seller ke sare products
    public function sellerProducts($sellerId)
    {
        $products = Product::with(['primaryImage', 'reviews'])
            ->where('seller_id', $sellerId)
            ->where('is_active', true)
            ->latest()
            ->get();

        return response()->json($products);
    }
}