import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ debts = [], summary = {} }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState(null);
    const [debtsList, setDebtsList] = useState(debts);
    const [hidePaidDebts, setHidePaidDebts] = useState(() => {
        // تحميل الحالة من localStorage عند بدء التشغيل
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('hidePaidDebts');
            return saved === 'true';
        }
        return false;
    });

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        notes: ''
    });

    // حفظ الحالة في localStorage عند تغييرها
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('hidePaidDebts', hidePaidDebts.toString());
        }
    }, [hidePaidDebts]);

    const filteredDebts = debtsList.filter(debt => {
        const matchesSearch = debt.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && debt.remaining_amount > 0) ||
            (statusFilter === 'paid' && debt.remaining_amount === 0);

        // إخفاء الديون المسددة بالكامل إذا كان الخيار مفعل
        const shouldShow = !hidePaidDebts || parseFloat(debt.remaining_amount) > 0.01;

        return matchesSearch && matchesStatus && shouldShow;
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ar-IQ', {
            style: 'currency',
            currency: 'IQD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handlePayment = (e) => {
        e.preventDefault();

        console.log('محاولة السداد:', selectedDebt.id, data);

        post(`/debts/${selectedDebt.id}/payment`, data, {
            onSuccess: () => {
                console.log('تم السداد بنجاح');

                // إغلاق النافذة أولاً
                reset();
                setShowPaymentModal(false);
                setSelectedDebt(null);

                // إعادة تحميل الصفحة لضمان عرض البيانات المحدثة
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            },
            onError: (errors) => {
                console.error('خطأ في السداد:', errors);
                alert('حدث خطأ: ' + JSON.stringify(errors));
            }
        });
    };

    const openPaymentModal = (debt) => {
        setSelectedDebt(debt);
        setShowPaymentModal(true);
        // تعيين المبلغ المتبقي كافتراضي
        setData('amount', debt.remaining_amount.toString());
    };

    const getStatusBadge = (debt) => {
        const remaining = parseFloat(debt.remaining_amount) || 0;
        const paid = parseFloat(debt.paid_amount) || 0;

        if (remaining <= 0 || remaining < 0.01) {
            return <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">مسدد بالكامل</span>;
        } else if (paid > 0) {
            return <span className="px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">مسدد جزئياً</span>;
        } else {
            return <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">مستحق</span>;
        }
    };

    return (
        <AppLayout>
            <Head title="إدارة الديون" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="py-4 sm:py-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
                                    >
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </Link>
                                    <div>
                                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">إدارة الديون</h1>
                                        <p className="text-sm text-gray-500 mt-1">متابعة وتحصيل الديون المستحقة</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                        {/* Total Outstanding */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-600">الديون المستحقة</p>
                                        <p className="text-2xl font-bold text-red-700">
                                            {formatCurrency(summary.total_outstanding || 0)}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">{summary.outstanding_count || 0} دين</p>
                                    </div>
                                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Paid */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600">المبلغ المحصل</p>
                                        <p className="text-2xl font-bold text-green-700">
                                            {formatCurrency(summary.total_paid || 0)}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">{summary.paid_count || 0} دفعة</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Debts */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600">إجمالي الديون</p>
                                        <p className="text-2xl font-bold text-blue-700">
                                            {formatCurrency(summary.total_amount || 0)}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">{summary.total_count || 0} دين</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
                        <div className="p-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="البحث عن عميل..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="sm:w-48">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="all">جميع الديون</option>
                                            <option value="active">المستحقة</option>
                                            <option value="paid">المسددة</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Hide Paid Debts Toggle */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setHidePaidDebts(!hidePaidDebts)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                            hidePaidDebts
                                                ? 'bg-gray-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        <span className="text-sm">👁️</span>
                                        <span className="text-sm">
                                            {hidePaidDebts ? 'إظهار المسددة' : 'إخفاء المسددة'}
                                        </span>
                                    </button>
                                    {hidePaidDebts && (
                                        <span className="text-xs text-gray-500">
                                            الديون المسددة بالكامل مخفية
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Debts List */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">قائمة الديون</h3>
                                <span className="text-sm text-gray-500">
                                    عرض {filteredDebts.length} من {debtsList.length} دين
                                    {hidePaidDebts && (
                                        <span className="text-xs text-orange-600 mr-2">
                                            (المسددة مخفية)
                                        </span>
                                    )}
                                </span>
                            </div>

                            {filteredDebts.length === 0 ? (
                                <div className="text-center py-8">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <p className="text-gray-500">لا توجد ديون</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredDebts.map((debt) => (
                                        <div key={debt.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-bold text-gray-900 text-lg">{debt.customer_name}</h4>
                                                    {getStatusBadge(debt)}
                                                </div>

                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">إجمالي الدين:</span>
                                                        <span className="font-bold text-blue-600">
                                                            {formatCurrency(debt.total_amount)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">المدفوع:</span>
                                                        <span className="font-bold text-green-600">
                                                            {formatCurrency(debt.paid_amount)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">المتبقي:</span>
                                                        <span className="font-bold text-red-600">
                                                            {formatCurrency(debt.remaining_amount)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">التاريخ:</span>
                                                        <span className="font-medium">
                                                            {new Date(debt.created_at).toLocaleDateString('ar-EG')}
                                                        </span>
                                                    </div>
                                                </div>

                                                {parseFloat(debt.remaining_amount) > 0.01 && (
                                                    <button
                                                        onClick={() => openPaymentModal(debt)}
                                                        className="w-full mt-3 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
                                                    >
                                                        سداد دفعة
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && selectedDebt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-sm">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">
                                    سداد دين
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setSelectedDebt(null);
                                        reset();
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <div className="font-medium text-gray-900 mb-2">{selectedDebt.customer_name}</div>
                                <div className="text-sm space-y-1">
                                    <div className="flex justify-between">
                                        <span>إجمالي الدين:</span>
                                        <span className="font-bold text-blue-600">
                                            {formatCurrency(selectedDebt.total_amount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>المتبقي:</span>
                                        <span className="font-bold text-red-600">
                                            {formatCurrency(selectedDebt.remaining_amount)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handlePayment} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        المبلغ المراد سداده
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max={selectedDebt.remaining_amount}
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        required
                                    />
                                    {errors.amount && (
                                        <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setData('amount', (selectedDebt.remaining_amount / 2).toString())}
                                        className="flex-1 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                    >
                                        نصف المبلغ
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('amount', selectedDebt.remaining_amount.toString())}
                                        className="flex-1 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                                    >
                                        كامل المبلغ
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ملاحظات (اختياري)
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="ملاحظات..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPaymentModal(false);
                                            setSelectedDebt(null);
                                            reset();
                                        }}
                                        className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold disabled:opacity-50"
                                    >
                                        {processing ? 'جاري السداد...' : 'تأكيد'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
