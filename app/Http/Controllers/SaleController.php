<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\Debt;
use App\Models\ProfitDistribution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SaleController extends Controller
{
    /**
     * عرض صفحة نقطة البيع
     */
    public function index()
    {
        $products = Product::where('quantity', '>', 0)->get()->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'image' => $product->image ? Storage::url($product->image) : null,
                'purchase_price' => $product->purchase_price,
                'marketing_cost' => $product->marketing_cost,
                'selling_price' => $product->selling_price,
                'quantity' => $product->quantity,
                'description' => $product->description,
            ];
        });

        return Inertia::render('Sales/POS', [
            'products' => $products,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }    /**
     * تنفيذ عملية البيع
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'user_id' => 'required|exists:users,id',
            'quantity_sold' => 'required|integer|min:1',
            'payment_type' => 'required|in:cash,debt',
            'customer_name' => 'nullable|string|max:255|required_if:payment_type,debt'
        ]);

        DB::beginTransaction();

        try {
            $product = Product::findOrFail($request->product_id);

            // التحقق من توفر الكمية
            if ($product->quantity < $request->quantity_sold) {
                return back()->withErrors(['quantity' => 'الكمية المطلوبة غير متوفرة']);
            }

            // حساب التكاليف والأرباح
            $unitPurchasePrice = $product->purchase_price;
            $unitMarketingCost = $product->marketing_cost;
            $unitSellingPrice = $product->selling_price;
            $quantitySold = $request->quantity_sold;

            $totalCost = ($unitPurchasePrice + $unitMarketingCost) * $quantitySold;
            $totalRevenue = $unitSellingPrice * $quantitySold;
            $totalProfit = $totalRevenue - $totalCost;

            // إنشاء عملية البيع
            $sale = Sale::create([
                'product_id' => $request->product_id,
                'user_id' => $request->user_id,
                'quantity_sold' => $quantitySold,
                'unit_purchase_price' => $unitPurchasePrice,
                'unit_marketing_cost' => $unitMarketingCost,
                'unit_selling_price' => $unitSellingPrice,
                'total_cost' => $totalCost,
                'total_revenue' => $totalRevenue,
                'total_profit' => $totalProfit,
                'payment_type' => $request->payment_type,
                'customer_name' => $request->customer_name
            ]);

            // توزيع الأرباح (70% مصطفى، 30% دنيا)
            $mustafaShare = $totalProfit * 0.7;
            $doniaShare = $totalProfit * 0.3;

            ProfitDistribution::create([
                'sale_id' => $sale->id,
                'mustafa_share' => $mustafaShare,
                'donia_share' => $doniaShare
            ]);

            // إذا كان البيع بالأجل، إنشاء سجل دين
            if ($request->payment_type === 'debt') {
                Debt::create([
                    'sale_id' => $sale->id,
                    'customer_name' => $request->customer_name,
                    'total_amount' => $totalRevenue,
                    'paid_amount' => 0,
                    'remaining_amount' => $totalRevenue,
                    'status' => 'pending'
                ]);
            }

            // تقليل الكمية من المخزون
            $product->decrement('quantity', $quantitySold);

            DB::commit();

            // إذا كان الطلب من صفحة POS، إرجاع استجابة JSON
            if ($request->expectsJson() || $request->wantsJson()) {
                return response()->json([
                    'message' => 'تمت عملية البيع بنجاح',
                    'sale_id' => $sale->id
                ]);
            }

            return redirect()->route('pos.index')->with('success', 'تمت عملية البيع بنجاح');

        } catch (\Exception $e) {
            DB::rollback();

            // إذا كان الطلب من صفحة POS، إرجاع استجابة JSON
            if ($request->expectsJson() || $request->wantsJson()) {
                return response()->json([
                    'message' => 'حدث خطأ أثناء تنفيذ عملية البيع',
                    'error' => $e->getMessage()
                ], 500);
            }

            return back()->withErrors(['error' => 'حدث خطأ أثناء تنفيذ عملية البيع']);
        }
    }

    /**
     * عرض تقرير المبيعات
     */
    public function report()
    {
        $sales = Sale::with(['product', 'user', 'profitDistribution'])
            ->latest()
            ->paginate(20);

        $totalSales = Sale::sum('total_revenue');
        $totalProfits = Sale::sum('total_profit');
        $mustafaTotalShare = ProfitDistribution::sum('mustafa_share');
        $doniaTotalShare = ProfitDistribution::sum('donia_share');

        return Inertia::render('Sales/Report', [
            'sales' => $sales,
            'stats' => [
                'total_sales' => $totalSales,
                'total_profits' => $totalProfits,
                'mustafa_share' => $mustafaTotalShare,
                'donia_share' => $doniaTotalShare
            ]
        ]);
    }
}
