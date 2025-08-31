<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * تشغيل seeder المنتجات التجريبية
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'ساعة ذكية Apple Watch',
                'description' => 'ساعة ذكية متطورة مع جميع الميزات',
                'purchase_price' => 10000.00,
                'marketing_cost' => 1000.00,
                'selling_price' => 25000.00,
                'quantity' => 5,
            ],
            [
                'name' => 'نظارة شمسية Ray-Ban',
                'description' => 'نظارة شمسية كلاسيكية بجودة عالية',
                'purchase_price' => 5000.00,
                'marketing_cost' => 1000.00,
                'selling_price' => 12000.00,
                'quantity' => 8,
            ],
            [
                'name' => 'سماعات AirPods Pro',
                'description' => 'سماعات لاسلكية مع إلغاء الضوضاء',
                'purchase_price' => 8000.00,
                'marketing_cost' => 1000.00,
                'selling_price' => 18000.00,
                'quantity' => 12,
            ],
            [
                'name' => 'جنط سيارة رياضي',
                'description' => 'جنط رياضي مقاس 18 بوصة',
                'purchase_price' => 15000.00,
                'marketing_cost' => 1000.00,
                'selling_price' => 35000.00,
                'quantity' => 3,
            ],
            [
                'name' => 'هاتف Samsung Galaxy',
                'description' => 'هاتف ذكي بمواصفات عالية',
                'purchase_price' => 20000.00,
                'marketing_cost' => 1000.00,
                'selling_price' => 45000.00,
                'quantity' => 0, // نفدت الكمية
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
