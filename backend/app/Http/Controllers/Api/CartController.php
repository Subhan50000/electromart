<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // Get cart items
    public function index(Request $request)
    {
        $items = CartItem::with(['product.primaryImage', 'product.seller'])
            ->where('customer_id', $request->user()->id)
            ->get();

        return response()->json($items);
    }

    // Add to cart
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Check stock
        if ($product->stock < ($request->quantity ?? 1)) {
            return response()->json([
                'message' => 'Not enough stock available.'
            ], 422);
        }

        $item = CartItem::where('customer_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($item) {
            $item->update([
                'quantity' => $item->quantity + ($request->quantity ?? 1)
            ]);
        } else {
            $item = CartItem::create([
                'customer_id' => $request->user()->id,
                'product_id'  => $request->product_id,
                'quantity'    => $request->quantity ?? 1,
            ]);
        }

        return response()->json([
            'message' => 'Added to cart!',
            'item'    => $item->load('product.primaryImage'),
        ]);
    }

    // Update quantity
    public function update(Request $request, $id)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);

        $item = CartItem::where('customer_id', $request->user()->id)
            ->findOrFail($id);

        $item->update(['quantity' => $request->quantity]);

        return response()->json(['message' => 'Cart updated.']);
    }

    // Remove item
    public function remove(Request $request, $id)
    {
        CartItem::where('customer_id', $request->user()->id)
            ->findOrFail($id)
            ->delete();

        return response()->json(['message' => 'Item removed.']);
    }

    // Clear cart
    public function clear(Request $request)
    {
        CartItem::where('customer_id', $request->user()->id)->delete();
        return response()->json(['message' => 'Cart cleared.']);
    }

    // Cart count
    public function count(Request $request)
    {
        $count = CartItem::where('customer_id', $request->user()->id)->sum('quantity');
        return response()->json(['count' => $count]);
    }
}