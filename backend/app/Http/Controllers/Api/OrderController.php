<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // Place order
    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string',
            'shipping_phone'   => 'required|string',
        ]);

        $cartItems = CartItem::with('product')
            ->where('customer_id', $request->user()->id)
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'message' => 'Your cart is empty.'
            ], 422);
        }

        // Check stock for all items
        foreach ($cartItems as $cartItem) {
            if ($cartItem->product->stock < $cartItem->quantity) {
                return response()->json([
                    'message' => "Not enough stock for: {$cartItem->product->name}"
                ], 422);
            }
        }

        DB::transaction(function () use ($request, $cartItems) {
            $total = $cartItems->sum(fn($i) => $i->product->price * $i->quantity);

            $order = Order::create([
                'customer_id'      => $request->user()->id,
                'total_amount'     => $total,
                'shipping_address' => $request->shipping_address,
                'shipping_phone'   => $request->shipping_phone,
                'status'           => 'pending',
            ]);

            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $cartItem->product_id,
                    'seller_id'  => $cartItem->product->seller_id,
                    'quantity'   => $cartItem->quantity,
                    'price'      => $cartItem->product->price,
                    'status'     => 'pending',
                ]);

                // Reduce stock
                Product::where('id', $cartItem->product_id)
                    ->decrement('stock', $cartItem->quantity);
            }

            // Clear cart
            CartItem::where('customer_id', $request->user()->id)->delete();
        });

        return response()->json([
            'message' => 'Order placed successfully!'
        ], 201);
    }

    // Get customer orders
    public function index(Request $request)
    {
        $orders = Order::with(['items.product.primaryImage', 'items.seller'])
            ->where('customer_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($orders);
    }

    // Single order
    public function show(Request $request, $id)
    {
        $order = Order::with([
            'items.product.primaryImage',
            'items.seller',
        ])
        ->where('customer_id', $request->user()->id)
        ->findOrFail($id);

        return response()->json($order);
    }
}