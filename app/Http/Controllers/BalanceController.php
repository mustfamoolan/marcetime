<?php

namespace App\Http\Controllers;

use App\Models\Balance;
use App\Models\Withdrawal;
use App\Models\Sale;
use App\Models\ProfitDistribution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BalanceController extends Controller
{
    /**
     * عرض صفحة الأرصدة
     */
    public function index()
    {
        // إنشاء رصيد جديد إذا لم يكن موجوداً
        $balance = Balance::first();
        if (!$balance) {
            $balance = Balance::create([]);
        }

        // تحديث الأرصدة من المبيعات
        $this->updateBalances();

        // إعادة تحميل البيانات المحدثة
        $balance = Balance::first();

        // الحصول على آخر 5 سحوبات فقط للصفحة الرئيسية
        $recentWithdrawals = Withdrawal::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // صلاحيات العرض والسحب
        $userId = Auth::id();
        $isMustafa = $userId == 1;

        return Inertia::render('Balance/Index', [
            'balance' => $balance,
            'recentWithdrawals' => $recentWithdrawals,
            'userPermissions' => [
                'canWithdrawCapital' => $isMustafa, // مصطفى فقط
                'canWithdrawMustafaProfit' => $isMustafa,
                'canWithdrawDoniaProfit' => !$isMustafa,
                'canViewAllBalances' => $isMustafa, // مصطفى يرى كل الأرصدة
                'canViewCapitalBalance' => $isMustafa, // رأس المال للمصطفى فقط
                'canViewMustafaBalance' => $isMustafa, // رصيد مصطفى للمصطفى فقط
                'canViewDoniaBalance' => true, // دنيا ترى رصيدها، مصطفى يرى كل الأرصدة
            ]
        ]);
    }

    /**
     * سحب رصيد
     */
    public function withdraw(Request $request)
    {
        $request->validate([
            'type' => 'required|in:capital,mustafa_profit,donia_profit',
            'amount' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string|max:255'
        ]);

        $userId = Auth::id();
        $type = $request->type;
        $amount = $request->amount;

        // التحقق من الصلاحيات
        if ($type === 'capital' && $userId != 1) {
            return back()->withErrors(['message' => 'ليس لديك صلاحية سحب رأس المال']);
        }

        if ($type === 'mustafa_profit' && $userId != 1) {
            return back()->withErrors(['message' => 'ليس لديك صلاحية سحب أرباح مصطفى']);
        }

        if ($type === 'donia_profit' && $userId == 1) {
            return back()->withErrors(['message' => 'ليس لديك صلاحية سحب أرباح دنيا']);
        }

        DB::transaction(function () use ($userId, $type, $amount, $request) {
            $balance = Balance::first();

            // التحقق من وجود رصيد كافي
            $currentBalance = 0;
            switch ($type) {
                case 'capital':
                    $currentBalance = $balance->capital_balance;
                    break;
                case 'mustafa_profit':
                    $currentBalance = $balance->mustafa_balance;
                    break;
                case 'donia_profit':
                    $currentBalance = $balance->donia_balance;
                    break;
            }

            if ($amount > $currentBalance) {
                throw new \Exception('الرصيد المتاح غير كافي');
            }

            // خصم المبلغ من الرصيد
            switch ($type) {
                case 'capital':
                    $balance->capital_balance -= $amount;
                    break;
                case 'mustafa_profit':
                    $balance->mustafa_balance -= $amount;
                    break;
                case 'donia_profit':
                    $balance->donia_balance -= $amount;
                    break;
            }

            $balance->save();

            // تسجيل السحب
            Withdrawal::create([
                'user_id' => $userId,
                'type' => $type,
                'amount' => $amount,
                'notes' => $request->notes
            ]);
        });

        return back()->with('success', 'تم سحب المبلغ بنجاح');
    }

    /**
     * تحديث الأرصدة من المبيعات والأرباح
     */
    private function updateBalances()
    {
        $balance = Balance::first();

        // حساب إجمالي تكاليف المنتجات (رأس المال)
        $totalCapital = Sale::sum(DB::raw('unit_purchase_price * quantity_sold'));

        // حساب إجمالي الأرباح
        $totalMustafaProfit = ProfitDistribution::sum('mustafa_share');
        $totalDoniaProfit = ProfitDistribution::sum('donia_share');
        $totalProfit = $totalMustafaProfit + $totalDoniaProfit;        // حساب إجمالي السحوبات
        $totalCapitalWithdrawn = Withdrawal::where('type', 'capital')->sum('amount');
        $totalMustafaWithdrawn = Withdrawal::where('type', 'mustafa_profit')->sum('amount');
        $totalDoniaWithdrawn = Withdrawal::where('type', 'donia_profit')->sum('amount');

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

    /**
     * عرض جميع السحوبات مع pagination
     */
    public function withdrawals(Request $request)
    {
        $perPage = 20; // 20 سحب لكل صفحة
        $userId = Auth::id();
        $isMustafa = $userId == 1;

        // استعلام السحوبات مع التصفية حسب الصلاحيات
        $query = Withdrawal::with('user')->orderBy('created_at', 'desc');

        // إذا لم يكن مصطفى، فقط سحوباتها
        if (!$isMustafa) {
            $query->where('type', 'donia_profit');
        }

        $withdrawals = $query->paginate($perPage);

        return Inertia::render('Balance/Withdrawals', [
            'withdrawals' => $withdrawals,
            'userPermissions' => [
                'canViewAllBalances' => $isMustafa,
            ]
        ]);
    }
}
