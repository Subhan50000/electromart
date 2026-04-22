<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // ✅ STORE REVIEW
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating'     => 'required|integer|min:1|max:5',
            'review'     => 'nullable|string|max:1000',
        ]);

        // check purchase
        $purchased = OrderItem::where('product_id', $request->product_id)
            ->whereHas('order', function ($q) use ($request) {
                $q->where('customer_id', $request->user()->id);
            })
            ->where('status', 'delivered')
            ->exists();

        if (!$purchased) {
            return response()->json([
                'message' => 'You can only review purchased products.'
            ], 403);
        }

        // prevent duplicate review
        $exists = Review::where('product_id', $request->product_id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($exists) {
            return response()->json([
                'message' => 'You already reviewed this product.'
            ], 422);
        }
      $review = Review::create([
    'product_id' => $request->product_id,
    'user_id'    => $request->user()->id,
    'rating'     => $request->rating,
    'review'     => $request->review ?? $request->comment,
]);

        return response()->json([
            'message' => 'Review submitted!',
            'review'  => $review
        ], 201);
    }
}
