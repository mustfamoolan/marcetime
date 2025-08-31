<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // اسم المنتج
            $table->string('image')->nullable(); // صورة المنتج
            $table->decimal('purchase_price', 10, 2); // سعر الشراء
            $table->decimal('marketing_cost', 10, 2)->default(1000.00); // كلفة التسويق (1000 دينار)
            $table->decimal('selling_price', 10, 2); // سعر البيع
            $table->integer('quantity')->default(0); // الكمية المتاحة
            $table->text('description')->nullable(); // وصف المنتج (اختياري)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
