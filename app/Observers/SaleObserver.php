<?php

namespace App\Observers;

use App\Models\Sale;
use App\Models\Balance;

class SaleObserver
{
    /**
     * تحديث الأرصدة بعد إنشاء مبيعة جديدة
     */
    public function created(Sale $sale): void
    {
        $this->updateBalances();
    }

    /**
     * تحديث الأرصدة بعد تحديث مبيعة
     */
    public function updated(Sale $sale): void
    {
        $this->updateBalances();
    }

    /**
     * تحديث الأرصدة بعد حذف مبيعة
     */
    public function deleted(Sale $sale): void
    {
        $this->updateBalances();
    }

    /**
     * تحديث الأرصدة تلقائياً
     */
    private function updateBalances(): void
    {
        $balance = Balance::first();
        if (!$balance) {
            $balance = Balance::create([]);
        }

        // حساب إجمالي تكاليف المنتجات (رأس المال)
        $totalCapital = Sale::sum(\DB::raw('unit_purchase_price * quantity_sold'));

        // حساب إجمالي الأرباح
        $totalMustafaProfit = \App\Models\ProfitDistribution::sum('mustafa_share');
        $totalDoniaProfit = \App\Models\ProfitDistribution::sum('donia_share');
        $totalProfit = $totalMustafaProfit + $totalDoniaProfit;

        // حساب إجمالي السحوبات
        $totalCapitalWithdrawn = \App\Models\Withdrawal::where('type', 'capital')->sum('amount') ?? 0;
        $totalMustafaWithdrawn = \App\Models\Withdrawal::where('type', 'mustafa_profit')->sum('amount') ?? 0;
        $totalDoniaWithdrawn = \App\Models\Withdrawal::where('type', 'donia_profit')->sum('amount') ?? 0;

        // تحديث الأرصدة
        $balance->update([
            // الأرصدة الحالية
            'capital_balance' => $totalCapital - $totalCapitalWithdrawn,
            'mustafa_balance' => $totalMustafaProfit - $totalMustafaWithdrawn,
            'donia_balance' => $totalDoniaProfit - $totalDoniaWithdrawn,

            // الإحصائيات الإجمالية
            'total_capital_all_time' => $totalCapital,
            'total_mustafa_all_time' => $totalMustafaProfit,
            'total_donia_all_time' => $totalDoniaProfit,
            'total_profit_all_time' => $totalProfit
        ]);
    }
}
