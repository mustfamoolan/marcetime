<?php

namespace App\Console\Commands;

use App\Models\Balance;
use App\Models\Sale;
use App\Models\ProfitDistribution;
use App\Models\Withdrawal;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RecalculateBalances extends Command
{
    /**
     * اسم ووصف الأمر
     */
    protected $signature = 'balance:recalculate';
    protected $description = 'إعادة حساب جميع الأرصدة من البيانات الموجودة';

    /**
     * تنفيذ الأمر
     */
    public function handle()
    {
        $this->info('بدء إعادة حساب الأرصدة...');

        // إنشاء أو تحديث سجل الرصيد
        $balance = Balance::first();
        if (!$balance) {
            $balance = Balance::create([]);
            $this->info('تم إنشاء سجل رصيد جديد');
        }

        // حساب إجمالي تكاليف المنتجات (رأس المال)
        $totalCapital = Sale::sum(DB::raw('unit_purchase_price * quantity_sold'));
        $this->info("إجمالي رأس المال: {$totalCapital}");

        // حساب إجمالي الأرباح
        $totalMustafaProfit = ProfitDistribution::sum('mustafa_share');
        $totalDoniaProfit = ProfitDistribution::sum('donia_share');
        $totalProfit = $totalMustafaProfit + $totalDoniaProfit;

        $this->info("إجمالي أرباح مصطفى: {$totalMustafaProfit}");
        $this->info("إجمالي أرباح دنيا: {$totalDoniaProfit}");
        $this->info("إجمالي الأرباح: {$totalProfit}");

        // حساب إجمالي السحوبات
        $totalCapitalWithdrawn = Withdrawal::where('type', 'capital')->sum('amount') ?? 0;
        $totalMustafaWithdrawn = Withdrawal::where('type', 'mustafa_profit')->sum('amount') ?? 0;
        $totalDoniaWithdrawn = Withdrawal::where('type', 'donia_profit')->sum('amount') ?? 0;

        $this->info("إجمالي سحوبات رأس المال: {$totalCapitalWithdrawn}");
        $this->info("إجمالي سحوبات مصطفى: {$totalMustafaWithdrawn}");
        $this->info("إجمالي سحوبات دنيا: {$totalDoniaWithdrawn}");

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

        $this->info('');
        $this->info('=== الأرصدة الحالية ===');
        $this->info("رصيد رأس المال: {$balance->capital_balance}");
        $this->info("رصيد مصطفى: {$balance->mustafa_balance}");
        $this->info("رصيد دنيا: {$balance->donia_balance}");
        $this->info('');
        $this->info('✅ تم إعادة حساب الأرصدة بنجاح!');

        return 0;
    }
}
