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
        Schema::create('withdrawals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // من قام بالسحب
            $table->enum('type', ['capital', 'mustafa_profit', 'donia_profit']); // نوع السحب
            $table->decimal('amount', 15, 2); // المبلغ المسحوب
            $table->text('notes')->nullable(); // ملاحظات اختيارية
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('withdrawals');
    }
};
