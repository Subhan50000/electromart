<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SellerRequest;
use Illuminate\Http\Request;

class SellerRequestController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'shop_name'        => 'required|string|max:255',
            'shop_description' => 'required|string',
            'phone'            => 'required|string',
            'address'          => 'required|string',
        ]);

        // Check already submitted
        $existing = SellerRequest::where('user_id', $request->user()->id)
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Aap pehle se request submit kar chuke hain.',
            ], 422);
        }

        $sellerRequest = SellerRequest::create([
            'user_id'          => $request->user()->id,
            'shop_name'        => $request->shop_name,
            'shop_description' => $request->shop_description,
            'phone'            => $request->phone,
            'address'          => $request->address,
            'cnic'             => $request->cnic,
        ]);

        return response()->json([
            'message' => 'Request submit ho gayi! Admin review karega.',
            'data'    => $sellerRequest,
        ], 201);
    }

    public function status(Request $request)
    {
        $sellerRequest = SellerRequest::where('user_id', $request->user()->id)
            ->latest()
            ->first();

        return response()->json($sellerRequest);
    }
}