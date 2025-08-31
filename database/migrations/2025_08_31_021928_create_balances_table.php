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
        Schema::create('balances', function (Blueprint $table) {
            $table->id();

            // الأرصدة الحالية (قابلة للسحب)
            $table->decimal('capital_balance', 15, 2)->default(0); // رصيد رأس المال الحالي
            $table->decimal('mustafa_balance', 15, 2)->default(0); // رصيد مصطفى الحالي
            $table->decimal('donia_balance', 15, 2)->default(0);   // رصيد دنيا الحالي

            // الإحصائيات الإجمالية (لا تتصفر أبداً)
            $table->decimal('total_capital_all_time', 15, 2)->default(0);  // إجمالي رأس المال عبر التاريخ
            $table->decimal('total_mustafa_all_time', 15, 2)->default(0);  // إجمالي أرباح مصطفى عبر التاريخ
            $table->decimal('total_donia_all_time', 15, 2)->default(0);    // إجمالي أرباح دنيا عبر التاريخ
            $table->decimal('total_profit_all_time', 15, 2)->default(0);   // إجمالي الأرباح عبر التاريخ

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('balances');
    }
};
