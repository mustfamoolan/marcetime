<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use App\Models\Debt;
use App\Models\ProfitDistribution;
use App\Models\Balance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * عرض لوحة التحكم الرئيسية مع الإحصائيات
     */
    public function index()
    {
        // تحديث الأرصدة أولاً
        $this->updateBalances();

        $statistics = $this->getStatistics();

        // للتشخيص
        \Log::info('Dashboard Statistics:', $statistics);

        return inertia('Dashboard', [
            'statistics' => $statistics
        ]);
    }

    /**
     * حساب جميع الإحصائيات
     */
    private function getStatistics()
    {
        $userId = Auth::id();
        $isMustafa = $userId == 1;

        // تحديث الأرصدة أولاً
        $this->updateBalances();

        // الحصول على الأرصدة
        $balance = Balance::first();
        if (!$balance) {
            $balance = Balance::create([]);
        }

        // إحصائيات عامة
        $totalProducts = Product::count();
        $totalSales = Sale::count();
        $totalDebts = Debt::count();

        // إحصائيات المبيعات
        $totalRevenue = Sale::sum('total_revenue');
        $totalProfit = Sale::sum('total_profit');
        $totalCost = Sale::sum('total_cost');

        // إحصائيات الديون
        $totalDebtAmount = Debt::sum('total_amount');
        $totalPaidAmount = Debt::sum('paid_amount');
        $totalOutstanding = Debt::where('remaining_amount', '>', 0)->sum('remaining_amount');
        $activeDebts = Debt::where('remaining_amount', '>', 0)->count();

        // توزيع الأرباح
        $profitDistribution = ProfitDistribution::selectRaw('
            SUM(mustafa_share) as mustafa_total,
            SUM(donia_share) as donia_total
        ')->first();

        // حساب الرصيد الشخصي للمستخدم
        $userBalance = 0;
        $userTotalProfit = 0;
        if ($isMustafa) {
            $userBalance = $balance->mustafa_balance;
            $userTotalProfit = $balance->total_mustafa_all_time;
        } else {
            $userBalance = $balance->donia_balance;
            $userTotalProfit = $balance->total_donia_all_time;
        }

        // إحصائيات اليوم
        $todayStats = $this->getTodayStatistics();

        // إحصائيات الشهر
        $monthStats = $this->getMonthStatistics();

        // أفضل المنتجات
        $topProducts = $this->getTopProducts();

        // إحصائيات البائعين
        $sellerStats = $this->getSellerStatistics();

        return [
            'user' => [
                'current_balance' => $userBalance,
                'total_profit_all_time' => $userTotalProfit,
                'is_manager' => $isMustafa,
            ],
            'general' => [
                'total_products' => $totalProducts,
                'total_sales' => $totalSales,
                'total_debts' => $totalDebts,
                'total_revenue' => $totalRevenue,
                'total_profit' => $totalProfit,
                'total_cost' => $totalCost,
            ],
            'debts' => [
                'total_debt_amount' => $totalDebtAmount,
                'total_paid_amount' => $totalPaidAmount,
                'total_outstanding' => $totalOutstanding,
                'active_debts' => $activeDebts,
                'collection_rate' => $totalDebtAmount > 0 ? ($totalPaidAmount / $totalDebtAmount) * 100 : 0,
            ],
            'profit_distribution' => [
                'mustafa_total' => $profitDistribution->mustafa_total ?? 0,
                'donia_total' => $profitDistribution->donia_total ?? 0,
            ],
            'today' => $todayStats,
            'month' => $monthStats,
            'top_products' => $topProducts,
            'seller_stats' => $sellerStats,
        ];
    }

    /**
     * إحصائيات اليوم
     */
    private function getTodayStatistics()
    {
        $today = Carbon::today();

        return [
            'sales_count' => Sale::whereDate('created_at', $today)->count(),
            'revenue' => Sale::whereDate('created_at', $today)->sum('total_revenue'),
            'profit' => Sale::whereDate('created_at', $today)->sum('total_profit'),
            'debts_created' => Debt::whereDate('created_at', $today)->count(),
            'debt_payments' => Debt::whereHas('payments', function($query) use ($today) {
                $query->whereDate('created_at', $today);
            })->count(),
        ];
    }

    /**
     * إحصائيات الشهر الحالي
     */
    private function getMonthStatistics()
    {
        $startOfMonth = Carbon::now()->startOfMonth();

        return [
            'sales_count' => Sale::where('created_at', '>=', $startOfMonth)->count(),
            'revenue' => Sale::where('created_at', '>=', $startOfMonth)->sum('total_revenue'),
            'profit' => Sale::where('created_at', '>=', $startOfMonth)->sum('total_profit'),
            'debts_created' => Debt::where('created_at', '>=', $startOfMonth)->count(),
        ];
    }

    /**
     * أفضل المنتجات مبيعاً
     */
    private function getTopProducts()
    {
        return Sale::with('product')
            ->select('product_id', DB::raw('COUNT(*) as sales_count'), DB::raw('SUM(total_profit) as total_profit'))
            ->groupBy('product_id')
            ->orderBy('sales_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function($sale) {
                return [
                    'product_name' => $sale->product->name ?? 'منتج محذوف',
                    'sales_count' => $sale->sales_count,
                    'total_profit' => $sale->total_profit,
                ];
            });
    }

    /**
     * إحصائيات البائعين
     */
    private function getSellerStatistics()
    {
        return Sale::with('user')
            ->select('user_id', DB::raw('COUNT(*) as sales_count'), DB::raw('SUM(total_revenue) as total_revenue'), DB::raw('SUM(total_profit) as total_profit'))
            ->groupBy('user_id')
            ->get()
            ->map(function($sale) {
                return [
                    'seller_name' => $sale->user->name ?? 'مستخدم محذوف',
                    'sales_count' => $sale->sales_count,
                    'total_revenue' => $sale->total_revenue,
                    'total_profit' => $sale->total_profit,
                ];
            });
    }

    /**
     * تحديث الأرصدة
     */
    private function updateBalances()
    {
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
