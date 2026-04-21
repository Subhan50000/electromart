<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Mobiles',     'slug' => 'mobiles',     'icon' => '📱'],
            ['name' => 'Laptops',     'slug' => 'laptops',     'icon' => '💻'],
            ['name' => 'Tablets',     'slug' => 'tablets',     'icon' => '📟'],
            ['name' => 'TVs',         'slug' => 'tvs',         'icon' => '📺'],
            ['name' => 'Cameras',     'slug' => 'cameras',     'icon' => '📷'],
            ['name' => 'Audio',       'slug' => 'audio',       'icon' => '🎧'],
            ['name' => 'Gaming',      'slug' => 'gaming',      'icon' => '🎮'],
            ['name' => 'Accessories', 'slug' => 'accessories', 'icon' => '🔌'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}