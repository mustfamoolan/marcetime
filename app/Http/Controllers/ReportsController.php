<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use App\Models\Debt;
use App\Models\DebtPayment;
use App\Models\ProfitDistribution;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportsController extends Controller
{
    /**
     * عرض صفحة التقارير الرئيسية
     */
    public function index()
    {
        return Inertia::render('Reports/Index');
    }

    /**
     * تقرير المبيعات
     */
    public function salesReport(Request $request)
    {
        // إذا كان طلب Inertia navigation أو طلب مباشر من المتصفح
        if ($request->header('X-Inertia') || (!$request->expectsJson() && !$request->ajax() && $request->accepts('text/html'))) {
            return Inertia::render('Reports/Sales');
        }

        // API Response
        $query = Sale::with(['user', 'product']);

        // تصفية حسب التاريخ
        if ($request->start_date) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->end_date) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        // تصفية حسب البائع
        if ($request->seller_id) {
            $query->where('user_id', $request->seller_id);
        }

        // تصفية حسب الفترة المحددة مسبقاً
        if ($request->period) {
            switch ($request->period) {
                case 'today':
                    $query->whereDate('created_at', today());
                    break;
                case 'this_week':
                    $query->whereBetween('created_at', [
                        now()->startOfWeek(),
                        now()->endOfWeek()
                    ]);
                    break;
                case 'this_month':
                    $query->whereMonth('created_at', now()->month)
                          ->whereYear('created_at', now()->year);
                    break;
                case 'this_year':
                    $query->whereYear('created_at', now()->year);
                    break;
            }
        }

        // إحصائيات الملخص
        $summary = [
            'total_sales' => $query->count(),
            'total_revenue' => round($query->sum('total_revenue'), 2),
            'total_profit' => round($query->sum('total_profit'), 2),
            'average_sale' => round($query->avg('total_revenue'), 2)
        ];

        // بيانات المبيعات مع تحويل للتنسيق المطلوب
        $salesData = $query->orderBy('created_at', 'desc')->get();

        $formattedSales = $salesData->map(function ($sale) {
            return [
                'id' => $sale->id,
                'created_at' => $sale->created_at,
                'product_name' => $sale->product->name ?? 'منتج محذوف',
                'seller_name' => $sale->user->name ?? 'مستخدم محذوف',
                'quantity_sold' => $sale->quantity_sold,
                'unit_selling_price' => round($sale->unit_selling_price, 2),
                'total_revenue' => round($sale->total_revenue, 2),
                'total_profit' => round($sale->total_profit, 2),
                'payment_type' => $sale->payment_type,
                'customer_name' => $sale->customer_name
            ];
        });

        // تعديل الملخص ليشمل count بدلاً من total_sales
        $summary = [
            'count' => $query->count(),
            'total_revenue' => round($query->sum('total_revenue'), 2),
            'total_profit' => round($query->sum('total_profit'), 2),
            'average_sale' => $query->count() > 0 ? round($query->sum('total_revenue') / $query->count(), 2) : 0
        ];

        // قائمة البائعين للتصفية
        $sellers = User::select('id', 'name')->get();

        return response()->json([
            'sales' => $formattedSales,
            'summary' => $summary,
            'sellers' => $sellers
        ]);
    }

    /**
     * تقرير الأرباح
     */
    public function profitReport(Request $request)
    {
        // إذا كان طلب Inertia navigation أو طلب مباشر من المتصفح
        if ($request->header('X-Inertia') || (!$request->expectsJson() && !$request->ajax() && $request->accepts('text/html'))) {
            return Inertia::render('Reports/Profit');
        }

        $dateRange = $this->getDateRange($request);

        $profits = ProfitDistribution::with(['sale.product', 'sale.user'])
            ->whereHas('sale', function($query) use ($dateRange) {
                $query->whereBetween('created_at', $dateRange);
            })
            ->get();

        $summary = [
            'total_profit' => round($profits->sum(function($p) { return $p->mustafa_share + $p->donia_share; }), 2),
            'mustafa_total' => round($profits->sum('mustafa_share'), 2),
            'donia_total' => round($profits->sum('donia_share'), 2),
        ];

        // تنسيق بيانات الأرباح
        $formattedProfits = $profits->map(function($profit) {
            return [
                'mustafa_share' => round($profit->mustafa_share, 2),
                'donia_share' => round($profit->donia_share, 2),
                'sale' => $profit->sale
            ];
        });

        return response()->json([
            'profits' => $formattedProfits,
            'summary' => $summary
        ]);
    }

    /**
     * تقرير الديون
     */
    public function debtReport(Request $request)
    {
        // إذا كان طلب Inertia navigation أو طلب مباشر من المتصفح
        if ($request->header('X-Inertia') || (!$request->expectsJson() && !$request->ajax() && $request->accepts('text/html'))) {
            return Inertia::render('Reports/Debt');
        }

        $dateRange = $this->getDateRange($request);

        $debts = Debt::with(['sale.product', 'payments'])
            ->whereBetween('created_at', $dateRange)
            ->get();

        $payments = DebtPayment::with(['debt.sale.product'])
            ->whereBetween('created_at', $dateRange)
            ->get();

        $summary = [
            'total_debts' => $debts->count(),
            'total_debt_amount' => $debts->sum('total_amount'),
            'total_paid' => $debts->sum('paid_amount'),
            'total_outstanding' => $debts->sum('remaining_amount'),
            'payments_count' => $payments->count(),
            'payments_amount' => $payments->sum('amount'),
        ];

        return response()->json([
            'debts' => $debts,
            'payments' => $payments,
            'summary' => $summary
        ]);
    }

    /**
     * تقرير المنتجات
     */
    public function productReport(Request $request)
    {
        // إذا كان طلب Inertia navigation أو طلب مباشر من المتصفح
        if ($request->header('X-Inertia') || (!$request->expectsJson() && !$request->ajax() && $request->accepts('text/html'))) {
            return Inertia::render('Reports/Product');
        }

        $dateRange = $this->getDateRange($request);

        $productStats = Sale::with('product')
            ->select('product_id')
            ->selectRaw('COUNT(*) as sales_count')
            ->selectRaw('SUM(quantity_sold) as total_quantity')
            ->selectRaw('SUM(total_revenue) as total_revenue')
            ->selectRaw('SUM(total_profit) as total_profit')
            ->whereBetween('created_at', $dateRange)
            ->groupBy('product_id')
            ->orderBy('total_profit', 'desc')
            ->get();

        return response()->json([
            'products' => $productStats
        ]);
    }

    /**
     * تقرير البائعين
     */
    public function sellerReport(Request $request)
    {
        // إذا كان طلب Inertia navigation أو طلب مباشر من المتصفح
        if ($request->header('X-Inertia') || (!$request->expectsJson() && !$request->ajax() && $request->accepts('text/html'))) {
            return Inertia::render('Reports/Seller');
        }

        $dateRange = $this->getDateRange($request);

        $sellerStats = Sale::with('user')
            ->select('user_id')
            ->selectRaw('COUNT(*) as sales_count')
            ->selectRaw('SUM(total_revenue) as total_revenue')
            ->selectRaw('SUM(total_profit) as total_profit')
            ->whereBetween('created_at', $dateRange)
            ->groupBy('user_id')
            ->get();

        // إضافة توزيع الأرباح لكل بائع (من إجمالي الأرباح للفترة)
        foreach ($sellerStats as $stat) {
            if ($stat->user_id == 1) {
                // مصطفى - نصيبه من جميع أرباح الفترة
                $stat->profit_share = ProfitDistribution::whereHas('sale', function($query) use ($dateRange) {
                    $query->whereBetween('created_at', $dateRange);
                })->sum('mustafa_share');
            } else {
                // دنيا - نصيبها من جميع أرباح الفترة
                $stat->profit_share = ProfitDistribution::whereHas('sale', function($query) use ($dateRange) {
                    $query->whereBetween('created_at', $dateRange);
                })->sum('donia_share');
            }
        }

        return response()->json([
            'sellers' => $sellerStats
        ]);
    }

    /**
     * الحصول على نطاق التاريخ
     */
    private function getDateRange(Request $request)
    {
        $dateFrom = $request->date_from ? Carbon::parse($request->date_from) : Carbon::now()->startOfMonth();
        $dateTo = $request->date_to ? Carbon::parse($request->date_to)->endOfDay() : Carbon::now()->endOfDay();

        return [$dateFrom, $dateTo];
    }

    /**
     * ملخص المبيعات
     */
    private function getSalesReport($dateRange)
    {
        return [
            'total_sales' => Sale::whereBetween('created_at', $dateRange)->count(),
            'total_revenue' => Sale::whereBetween('created_at', $dateRange)->sum('total_revenue'),
            'total_profit' => Sale::whereBetween('created_at', $dateRange)->sum('total_profit'),
            'average_sale' => Sale::whereBetween('created_at', $dateRange)->avg('total_revenue'),
        ];
    }

    /**
     * تقرير الأرباح
     */
    private function getProfitReport($dateRange)
    {
        $profits = ProfitDistribution::whereHas('sale', function($query) use ($dateRange) {
            $query->whereBetween('created_at', $dateRange);
        })->selectRaw('SUM(mustafa_share) as mustafa_total, SUM(donia_share) as donia_total')->first();

        return [
            'total_profit' => ($profits->mustafa_total ?? 0) + ($profits->donia_total ?? 0),
            'mustafa_share' => $profits->mustafa_total ?? 0,
            'donia_share' => $profits->donia_total ?? 0,
        ];
    }

    /**
     * تقرير الديون
     */
    private function getDebtReport($dateRange)
    {
        return [
            'debts_created' => Debt::whereBetween('created_at', $dateRange)->count(),
            'debt_amount' => Debt::whereBetween('created_at', $dateRange)->sum('total_amount'),
            'payments_received' => DebtPayment::whereBetween('created_at', $dateRange)->sum('amount'),
            'outstanding_amount' => Debt::whereBetween('created_at', $dateRange)->sum('remaining_amount'),
        ];
    }

    /**
     * تقرير المنتجات
     */
    private function getProductReport($dateRange)
    {
        return Sale::with('product')
            ->select('product_id')
            ->selectRaw('COUNT(*) as sales_count')
            ->selectRaw('SUM(total_profit) as total_profit')
            ->whereBetween('created_at', $dateRange)
            ->groupBy('product_id')
            ->orderBy('total_profit', 'desc')
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
     * تقرير البائعين
     */
    private function getSellerReport($dateRange)
    {
        return Sale::with('user')
            ->select('user_id')
            ->selectRaw('COUNT(*) as sales_count')
            ->selectRaw('SUM(total_revenue) as total_revenue')
            ->selectRaw('SUM(total_profit) as total_profit')
            ->whereBetween('created_at', $dateRange)
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
     * ملخص المبيعات للاستعلام
     */
    private function getSalesSummary($query)
    {
        $clone = clone $query;
        return [
            'count' => $clone->count(),
            'revenue' => $clone->sum('total_revenue'),
            'profit' => $clone->sum('total_profit'),
            'cost' => $clone->sum('total_cost'),
        ];
    }

    /**
     * نظرة عامة على التقارير - تعيد البيانات للـ API
     */
    public function overview(Request $request)
    {
        // إذا كان الطلب من API (AJAX)
        if ($request->expectsJson() || $request->ajax()) {
            try {
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

                // توزيع الأرباح (70% للمتجر، 30% للبائع)
                $storeProfit = $totalProfit * 0.70;
                $sellerProfit = $totalProfit * 0.30;

                // إحصائيات اليوم
                $today = Carbon::today();
                $todaySales = Sale::whereDate('created_at', $today)->count();
                $todayRevenue = Sale::whereDate('created_at', $today)->sum('total_revenue');
                $todayProfit = Sale::whereDate('created_at', $today)->sum('total_profit');

                // أفضل المنتجات
                $topProducts = Product::withSum('sales', 'quantity_sold')
                    ->orderBy('sales_sum_quantity_sold', 'desc')
                    ->limit(5)
                    ->get();

                // أفضل البائعين
                $topSellers = \App\Models\User::withSum('sales', 'total_revenue')
                    ->orderBy('sales_sum_total_revenue', 'desc')
                    ->limit(5)
                    ->get();

                return response()->json([
                    'general' => [
                        'total_products' => $totalProducts,
                        'total_sales' => $totalSales,
                        'total_debts' => $totalDebts,
                        'active_debts' => $activeDebts,
                        'total_revenue' => $totalRevenue,
                        'total_profit' => $totalProfit
                    ],
                    'sales' => [
                        'total_revenue' => $totalRevenue,
                        'total_profit' => $totalProfit,
                        'total_cost' => $totalCost,
                        'store_profit' => $storeProfit,
                        'seller_profit' => $sellerProfit
                    ],
                    'debts' => [
                        'total_amount' => $totalDebtAmount,
                        'paid_amount' => $totalPaidAmount,
                        'pending_amount' => $totalOutstanding
                    ],
                    'today' => [
                        'sales_count' => $todaySales,
                        'total_revenue' => $todayRevenue,
                        'total_profit' => $todayProfit
                    ],
                    'top_products' => $topProducts,
                    'top_sellers' => $topSellers
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'حدث خطأ في تحميل البيانات',
                    'message' => $e->getMessage()
                ], 500);
            }
        }

        // إذا كان طلب عادي من المتصفح، إرجع صفحة التقارير
        return $this->index();
    }
}
