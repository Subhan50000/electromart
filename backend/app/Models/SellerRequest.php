<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SellerRequest extends Model
{
    protected $fillable = [
        'user_id', 'shop_name', 'shop_description',
        'phone', 'address', 'cnic', 'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}