<?php

namespace App\Observers;

use App\Models\Withdrawal;
use App\Models\Balance;

class WithdrawalObserver
{
    /**
     * تحديث الأرصدة بعد إنشاء سحب جديد
     */
    public function created(Withdrawal $withdrawal): void
    {
        $this->updateBalances();
    }

    /**
     * تحديث الأرصدة بعد تحديث سحب
     */
    public function updated(Withdrawal $withdrawal): void
    {
        $this->updateBalances();
    }

    /**
     * تحديث الأرصدة بعد حذف سحب
     */
    public function deleted(Withdrawal $withdrawal): void
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
        $totalCapital = \App\Models\Sale::sum(\DB::raw('unit_purchase_price * quantity_sold'));

        // حساب إجمالي الأرباح
        $totalMustafaProfit = \App\Models\ProfitDistribution::sum('mustafa_share');
        $totalDoniaProfit = \App\Models\ProfitDistribution::sum('donia_share');
        $totalProfit = $totalMustafaProfit + $totalDoniaProfit;

        // حساب إجمالي السحوبات
        $totalCapitalWithdrawn = Withdrawal::where('type', 'capital')->sum('amount') ?? 0;
        $totalMustafaWithdrawn = Withdrawal::where('type', 'mustafa_profit')->sum('amount') ?? 0;
        $totalDoniaWithdrawn = Withdrawal::where('type', 'donia_profit')->sum('amount') ?? 0;

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
