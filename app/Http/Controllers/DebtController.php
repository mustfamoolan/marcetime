<?php

namespace App\Http\Controllers;

use App\Models\Debt;
use App\Models\DebtPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DebtController extends Controller
{
    /**
     * عرض قائمة الديون
     */
    public function index(Request $request)
    {
        $query = Debt::with(['sale.product', 'sale.user']);

        // فلترة حسب الحالة
        if ($request->status) {
            if ($request->status === 'active') {
                $query->where('remaining_amount', '>', 0);
            } elseif ($request->status === 'paid') {
                $query->where('remaining_amount', '=', 0);
            }
        }

        // البحث بالاسم
        if ($request->search) {
            $query->where('customer_name', 'like', '%' . $request->search . '%');
        }

        $debts = $query->latest()->get();

        // إحصائيات الديون
        $summary = [
            'total_outstanding' => Debt::where('remaining_amount', '>', 0)->sum('remaining_amount'),
            'outstanding_count' => Debt::where('remaining_amount', '>', 0)->count(),
            'total_paid' => Debt::sum('paid_amount'),
            'paid_count' => DebtPayment::count(),
            'total_amount' => Debt::sum('total_amount'),
            'total_count' => Debt::count(),
        ];

        return Inertia::render('Debts/Index', [
            'debts' => $debts,
            'summary' => $summary,
            'filters' => $request->only(['status', 'search'])
        ]);
    }

    /**
     * عرض تفاصيل دين محدد
     */
    public function show(Debt $debt)
    {
        $debt->load(['sale.product', 'sale.user']);
        $payments = $debt->payments()->latest()->get();

        return Inertia::render('Debts/Show', [
            'debt' => $debt,
            'payments' => $payments
        ]);
    }

    /**
     * تسديد دين
     */
    public function payment(Request $request, Debt $debt)
    {
        \Log::info('محاولة سداد الدين:', [
            'debt_id' => $debt->id,
            'request_data' => $request->all(),
            'debt_remaining' => $debt->remaining_amount
        ]);

        try {
            $validated = $request->validate([
                'amount' => 'required|numeric|min:0.01|max:' . $debt->remaining_amount,
                'notes' => 'nullable|string|max:500'
            ]);
            \Log::info('تم التحقق من البيانات بنجاح:', $validated);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('خطأ في التحقق من البيانات:', $e->errors());
            return back()->withErrors($e->errors());
        }

        DB::beginTransaction();

        try {
            // إنشاء سجل الدفعة
            DebtPayment::create([
                'debt_id' => $debt->id,
                'amount' => $request->amount,
                'payment_date' => now()->toDateString(),
                'notes' => $request->notes
            ]);

            // تحديث مبلغ الدين المدفوع
            $debt->paid_amount += $request->amount;
            $debt->save();

            // تحديث حالة الدين
            $debt->updateStatus();

            DB::commit();

            \Log::info('تم سداد الدين بنجاح:', ['debt_id' => $debt->id]);

            // إعادة تحميل الدين مع البيانات المحدثة
            $debt->refresh();

            if (request()->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'تم تسجيل الدفعة بنجاح',
                    'debt' => $debt
                ]);
            }

            return redirect()->route('debts.index')->with('success', 'تم تسجيل الدفعة بنجاح');

        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('خطأ في سداد الدين:', [
                'debt_id' => $debt->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors(['error' => 'حدث خطأ أثناء تسجيل الدفعة: ' . $e->getMessage()]);
        }
    }

    /**
     * حذف دين (في حالة الخطأ فقط)
     */
    public function destroy(Debt $debt)
    {
        // يمكن حذف الدين فقط إذا لم يتم دفع أي مبلغ
        if ($debt->paid_amount > 0) {
            return back()->withErrors(['error' => 'لا يمكن حذف دين تم دفع جزء منه']);
        }

        $debt->delete();

        return redirect()->route('debts.index')->with('success', 'تم حذف الدين بنجاح');
    }
}
