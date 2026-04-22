<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\OrderItem;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class SellerController extends Controller
{
    // Dashboard Stats
    public function stats(Request $request)
    {
        $sellerId = $request->user()->id;

        $totalProducts = Product::where('seller_id', $sellerId)->count();

        $orders = OrderItem::where('seller_id', $sellerId);

        $totalOrders    = (clone $orders)->count();
        $delivered      = (clone $orders)->where('status', 'delivered')->count();
        $cancelled      = (clone $orders)->where('status', 'cancelled')->count();
        $pending        = (clone $orders)->where('status', 'pending')->count();

        $totalRevenue = (clone $orders)
            ->where('status', 'delivered')
            ->sum(DB::raw('price * quantity'));

        $totalReviews = Review::whereHas('product', function ($q) use ($sellerId) {
            $q->where('seller_id', $sellerId);
        })->count();

        return response()->json([
            'total_products' => $totalProducts,
            'total_orders'   => $totalOrders,
            'delivered'      => $delivered,
            'cancelled'      => $cancelled,
            'pending'        => $pending,
            'total_revenue'  => $totalRevenue,
            'total_reviews'  => $totalReviews,
        ]);
    }

    // Get all seller products
    public function products(Request $request)
    {
        $products = Product::with(['category', 'images', 'reviews'])
            ->where('seller_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($products);
    }

    // Create product
    public function createProduct(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'images'      => 'nullable|array',
            'images.*'    => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $product = Product::create([
            'seller_id'   => $request->user()->id,
            'category_id' => $request->category_id,
            'name'        => $request->name,
            'description' => $request->description,
            'price'       => $request->price,
            'stock'       => $request->stock,
            'is_active'   => true,
        ]);

        // Handle images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'is_primary' => $index === 0,
                ]);
            }
        }

        return response()->json([
            'message' => 'Product created successfully!',
            'product' => $product->load(['category', 'images']),
        ], 201);
    }

    // Update product
    public function updateProduct(Request $request, $id)
    {
        $product = Product::where('seller_id', $request->user()->id)
            ->findOrFail($id);

        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
        ]);

        $product->update([
            'category_id' => $request->category_id,
            'name'        => $request->name,
            'description' => $request->description,
            'price'       => $request->price,
            'stock'       => $request->stock,
        ]);

        // Add new images if uploaded
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'is_primary' => false,
                ]);
            }
        }

        return response()->json([
            'message' => 'Product updated successfully!',
            'product' => $product->load(['category', 'images']),
        ]);
    }

    // Delete product
    public function deleteProduct(Request $request, $id)
    {
        $product = Product::where('seller_id', $request->user()->id)
            ->findOrFail($id);

        // Delete images from storage
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully!']);
    }

    // Delete single product image
    public function deleteImage(Request $request, $imageId)
    {
        $image = ProductImage::whereHas('product', function ($q) use ($request) {
            $q->where('seller_id', $request->user()->id);
        })->findOrFail($imageId);

        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return response()->json(['message' => 'Image deleted.']);
    }

    // Shipments — pending/confirmed orders
    public function shipments(Request $request)
    {
        $items = OrderItem::with(['order.customer', 'product'])
            ->where('seller_id', $request->user()->id)
            ->whereIn('status', ['pending', 'confirmed', 'shipped'])
            ->latest()
            ->get();

        return response()->json($items);
    }

    // Update order item status
    public function updateOrderStatus(Request $request, $itemId)
    {
        $request->validate([
            'status' => 'required|in:confirmed,shipped,delivered,cancelled',
        ]);

        $item = OrderItem::where('seller_id', $request->user()->id)
            ->findOrFail($itemId);

        $item->update(['status' => $request->status]);

        return response()->json(['message' => 'Order status updated!']);
    }

    // Order history — delivered & cancelled
    public function orderHistory(Request $request)
    {
        $items = OrderItem::with(['order.customer', 'product'])
            ->where('seller_id', $request->user()->id)
            ->whereIn('status', ['delivered', 'cancelled'])
            ->latest()
            ->get();

        return response()->json($items);

    }
    
    public function reviews(Request $request)
{
    $sellerId = $request->user()->id;

    $reviews = Review::with(['product', 'user'])
        ->whereHas('product', function ($q) use ($sellerId) {
            $q->where('seller_id', $sellerId);
        })
        ->latest()
        ->get();

    return response()->json($reviews);
}
}