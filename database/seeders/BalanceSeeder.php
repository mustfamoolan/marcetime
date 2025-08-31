<?php

namespace Database\Seeders;

use App\Models\Balance;
use App\Models\Sale;
use App\Models\ProfitDistribution;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BalanceSeeder extends Seeder
{
    /**
     * تشغيل السيدر لحساب الأرصدة من البيانات الموجودة
     */
    public function run(): void
    {
        // إنشاء سجل الرصيد الأولي أو تحديثه
        $balance = Balance::first();
        if (!$balance) {
            $balance = Balance::create([]);
        }

        // حساب إجمالي تكاليف المنتجات (رأس المال)
        $totalCapital = Sale::sum(DB::raw('unit_purchase_price * quantity_sold'));

        // حساب إجمالي الأرباح
        $totalMustafaProfit = ProfitDistribution::sum('mustafa_share');
        $totalDoniaProfit = ProfitDistribution::sum('donia_share');
        $totalProfit = $totalMustafaProfit + $totalDoniaProfit;

        // حساب إجمالي السحوبات (إذا وجدت)
        $totalCapitalWithdrawn = \App\Models\Withdrawal::where('type', 'capital')->sum('amount') ?? 0;
        $totalMustafaWithdrawn = \App\Models\Withdrawal::where('type', 'mustafa_profit')->sum('amount') ?? 0;
        $totalDoniaWithdrawn = \App\Models\Withdrawal::where('type', 'donia_profit')->sum('amount') ?? 0;

        // تحديث الأرصدة
        $balance->update([
            // الأرصدة الحالية (بعد خصم السحوبات)
            'capital_balance' => $totalCapital - $totalCapitalWithdrawn,
            'mustafa_balance' => $totalMustafaProfit - $totalMustafaWithdrawn,
            'donia_balance' => $totalDoniaProfit - $totalDoniaWithdrawn,

            // الإحصائيات الإجمالية (لا تتغير أبداً)
            'total_capital_all_time' => $totalCapital,
            'total_mustafa_all_time' => $totalMustafaProfit,
            'total_donia_all_time' => $totalDoniaProfit,
            'total_profit_all_time' => $totalProfit
        ]);

        $this->command->info('تم حساب وتحديث الأرصدة بنجاح');
        $this->command->info("رصيد رأس المال: {$balance->capital_balance}");
        $this->command->info("رصيد مصطفى: {$balance->mustafa_balance}");
        $this->command->info("رصيد دنيا: {$balance->donia_balance}");
    }
}

