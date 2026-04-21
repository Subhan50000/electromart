<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\SellerRequest;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Dashboard Stats
    public function stats()
    {
        return response()->json([
            'total_customers'        => User::where('role', 'customer')->count(),
            'total_sellers'          => User::where('role', 'seller')->count(),
            'pending_seller_requests'=> SellerRequest::where('status', 'pending')->count(),
            'total_orders'           => Order::count(),
            'total_revenue'          => Order::where('status', 'delivered')->sum('total_amount'),
        ]);
    }

    // All Customers
    public function customers()
    {
        $customers = User::where('role', 'customer')
            ->latest()
            ->get(['id', 'name', 'email', 'phone', 'address', 'created_at']);

        return response()->json($customers);
    }

    // All Sellers
    public function sellers()
    {
        $sellers = User::where('role', 'seller')
            ->latest()
            ->get(['id', 'name', 'email', 'phone', 'address', 'created_at']);

        return response()->json($sellers);
    }

    // Seller Requests
    public function sellerRequests()
    {
        $requests = SellerRequest::with('user')
            ->where('status', 'pending')
            ->latest()
            ->get();

        return response()->json($requests);
    }

    // Accept Seller Request
    public function acceptSellerRequest($id)
    {
        $sellerRequest = SellerRequest::findOrFail($id);
        $sellerRequest->update(['status' => 'approved']);

        User::where('id', $sellerRequest->user_id)
            ->update(['role' => 'seller']);

        return response()->json(['message' => 'Seller request approved!']);
    }

    // Decline Seller Request
    public function declineSellerRequest($id)
    {
        $sellerRequest = SellerRequest::findOrFail($id);
        $sellerRequest->update(['status' => 'declined']);

        return response()->json(['message' => 'Seller request declined.']);
    }

    // Delete Customer
    public function deleteUser($id)
    {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'User deleted.']);
    }
}