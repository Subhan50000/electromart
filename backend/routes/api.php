<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SellerController;
use App\Http\Controllers\Api\SellerRequestController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Public product routes
Route::get('/products',                    [ProductController::class, 'index']);
Route::get('/products/{id}',               [ProductController::class, 'show']);
Route::get('/categories',                  [ProductController::class, 'categories']);
Route::get('/sellers/{sellerId}/products', [ProductController::class, 'sellerProducts']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Seller request (customer)
    Route::post('/seller-request',       [SellerRequestController::class, 'store']);
    Route::get('/seller-request/status', [SellerRequestController::class, 'status']);

    // Seller routes
    Route::middleware('App\Http\Middleware\SellerMiddleware')
        ->prefix('seller')
        ->group(function () {
            Route::get('/stats',                          [SellerController::class, 'stats']);
            Route::get('/products',                       [SellerController::class, 'products']);
            Route::post('/products',                      [SellerController::class, 'createProduct']);
            Route::post('/products/{id}',                 [SellerController::class, 'updateProduct']);
            Route::delete('/products/{id}',               [SellerController::class, 'deleteProduct']);
            Route::delete('/images/{imageId}',            [SellerController::class, 'deleteImage']);
            Route::get('/shipments',                      [SellerController::class, 'shipments']);
            Route::put('/orders/{itemId}/status',         [SellerController::class, 'updateOrderStatus']);
            Route::get('/order-history',                  [SellerController::class, 'orderHistory']);
        });

    // Admin routes
    Route::middleware('App\Http\Middleware\AdminMiddleware')
        ->prefix('admin')
        ->group(function () {
            Route::get('/stats',                          [AdminController::class, 'stats']);
            Route::get('/customers',                      [AdminController::class, 'customers']);
            Route::get('/sellers',                        [AdminController::class, 'sellers']);
            Route::get('/seller-requests',                [AdminController::class, 'sellerRequests']);
            Route::post('/seller-requests/{id}/accept',   [AdminController::class, 'acceptSellerRequest']);
            Route::post('/seller-requests/{id}/decline',  [AdminController::class, 'declineSellerRequest']);
            Route::delete('/users/{id}',                  [AdminController::class, 'deleteUser']);
        });
});