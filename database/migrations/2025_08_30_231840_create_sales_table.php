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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // البائع
            $table->integer('quantity_sold')->default(1);
            $table->decimal('unit_purchase_price', 10, 2);
            $table->decimal('unit_marketing_cost', 10, 2);
            $table->decimal('unit_selling_price', 10, 2);
            $table->decimal('total_cost', 10, 2);
            $table->decimal('total_revenue', 10, 2);
            $table->decimal('total_profit', 10, 2);
            $table->enum('payment_type', ['cash', 'debt'])->default('cash');
            $table->string('customer_name')->nullable(); // اسم العميل للبيع بالأجل
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
