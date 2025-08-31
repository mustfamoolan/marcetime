import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ debt, payments }) {
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        notes: ''
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ar-IQ', {
            style: 'currency',
            currency: 'IQD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handlePayment = (e) => {
        e.preventDefault();

        post(`/debts/${debt.id}/payment`, {
            onSuccess: () => {
                reset();
                setShowPaymentModal(false);
            }
        });
    };

    const getStatusColor = (remainingAmount) => {
        return remainingAmount > 0 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50';
    };

    const getStatusText = (remainingAmount) => {
        return remainingAmount > 0 ? 'مستحق' : 'مدفوع بالكامل';
    };

    return (
        <AppLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                            تفاصيل الدين - {debt.customer_name}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            رقم الدين: #{debt.id}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/debts"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            العودة للقائمة
                        </Link>
                        {debt.remaining_amount > 0 && (
                            <button
                                onClick={() => setShowPaymentModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                إضافة دفعة
                            </button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`تفاصيل الدين - ${debt.customer_name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Debt Summary */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        اسم العميل
                                    </div>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {debt.customer_name}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        المبلغ الأصلي
                                    </div>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {formatCurrency(debt.total_amount)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        المبلغ المدفوع
                                    </div>
                                    <div className="text-lg font-semibold text-green-600">
                                        {formatCurrency(debt.paid_amount)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        المبلغ المتبقي
                                    </div>
                                    <div className="text-lg font-semibold text-red-600">
                                        {formatCurrency(debt.remaining_amount)}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(debt.remaining_amount)}`}>
                                        {getStatusText(debt.remaining_amount)}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        تاريخ الدين: {new Date(debt.created_at).toLocaleDateString('ar-EG')}
                                    </span>
                                </div>
                                {debt.remaining_amount > 0 && (
                                    <div className="w-full max-w-xs">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            نسبة السداد: {((debt.paid_amount / debt.total_amount) * 100).toFixed(1)}%
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${(debt.paid_amount / debt.total_amount) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sale Details */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                تفاصيل البيع
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        المنتج
                                    </div>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {debt.sale.product.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {debt.sale.product.description}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        الكمية
                                    </div>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {debt.sale.quantity} قطعة
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        سعر الوحدة
                                    </div>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {formatCurrency(debt.sale.unit_price)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        تاريخ البيع
                                    </div>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {new Date(debt.sale.created_at).toLocaleDateString('ar-EG')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment History */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                سجل الدفعات
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            المبلغ
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            الملاحظات
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            التاريخ
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {payments.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center">
                                                <div className="text-gray-500 dark:text-gray-400">
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <p className="mt-2 text-sm">لا توجد دفعات حتى الآن</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        payments.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {formatCurrency(payment.amount)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    {payment.notes || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(payment.created_at).toLocaleDateString('ar-EG')}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    إضافة دفعة جديدة
                                </h3>
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handlePayment} className="space-y-4">
                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        المبلغ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="amount"
                                        step="0.01"
                                        min="0.01"
                                        max={debt.remaining_amount}
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.amount && (
                                        <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        الحد الأقصى: {formatCurrency(debt.remaining_amount)}
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        ملاحظات
                                    </label>
                                    <textarea
                                        id="notes"
                                        rows={3}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="ملاحظات اختيارية..."
                                        className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.notes && (
                                        <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowPaymentModal(false)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {processing ? 'جاري الحفظ...' : 'إضافة الدفعة'}
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
