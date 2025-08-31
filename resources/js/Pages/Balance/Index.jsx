import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    CurrencyDollarIcon,
    BanknotesIcon,
    UserIcon,
    ArrowDownTrayIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

export default function Index({ balance, recentWithdrawals, userPermissions }) {
    const [withdrawalForm, setWithdrawalForm] = useState({
        type: '',
        amount: '',
        notes: ''
    });
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);

    // تنسيق العملة
    const formatCurrency = (amount) => {
        return Math.round(Number(amount)).toLocaleString('ar-IQ') + ' د.ع';
    };

    // تنسيق التاريخ
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ar-IQ', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // معالجة السحب
    const handleWithdraw = (e) => {
        e.preventDefault();

        router.post('/balance/withdraw', withdrawalForm, {
            onSuccess: () => {
                setWithdrawalForm({ type: '', amount: '', notes: '' });
                setShowWithdrawModal(false);
            }
        });
    };

    // فتح نموذج السحب
    const openWithdrawModal = (type) => {
        setWithdrawalForm({ ...withdrawalForm, type });
        setShowWithdrawModal(true);
    };

    // ترجمة نوع السحب
    const getWithdrawalTypeLabel = (type) => {
        const types = {
            'capital': 'رأس المال',
            'mustafa_profit': 'أرباح مصطفى',
            'donia_profit': 'أرباح دنيا'
        };
        return types[type] || type;
    };

    // تصفية السحوبات حسب صلاحيات المستخدم
    const getFilteredWithdrawals = () => {
        if (userPermissions.canViewAllBalances) {
            // مصطفى يرى جميع السحوبات
            return recentWithdrawals;
        } else {
            // دنيا ترى سحوباتها فقط
            return recentWithdrawals.filter(withdrawal =>
                withdrawal.type === 'donia_profit'
            );
        }
    };

    return (
        <AppLayout>
            <Head title="الأرصدة" />

            <div className="py-4 sm:py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* العنوان */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">نظام الأرصدة</h1>
                        <p className="mt-2 text-sm sm:text-base text-gray-600">إدارة الأرصدة الحالية والسحوبات</p>
                    </div>

                    {/* الأرصدة الحالية */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        {/* رصيد رأس المال - مصطفى فقط */}
                        {userPermissions.canViewCapitalBalance && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <BanknotesIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                                    </div>
                                    <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                                        <h3 className="text-base sm:text-lg font-medium text-blue-900 truncate">رصيد رأس المال</h3>
                                        <p className="text-lg sm:text-2xl font-bold text-blue-600 break-all">
                                            {formatCurrency(balance.capital_balance)}
                                        </p>
                                        {userPermissions.canWithdrawCapital && (
                                            <button
                                                onClick={() => openWithdrawModal('capital')}
                                                className="mt-2 w-full sm:w-auto bg-blue-600 text-white px-3 py-2 rounded-md text-xs sm:text-sm hover:bg-blue-700 transition-colors"
                                            >
                                                <ArrowDownTrayIcon className="h-3 w-3 sm:h-4 sm:w-4 inline ml-1" />
                                                سحب
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* رصيد مصطفى - مصطفى فقط */}
                        {userPermissions.canViewMustafaBalance && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <UserIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                                    </div>
                                    <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                                        <h3 className="text-base sm:text-lg font-medium text-green-900 truncate">رصيد مصطفى</h3>
                                        <p className="text-lg sm:text-2xl font-bold text-green-600 break-all">
                                            {formatCurrency(balance.mustafa_balance)}
                                        </p>
                                        {userPermissions.canWithdrawMustafaProfit && (
                                            <button
                                                onClick={() => openWithdrawModal('mustafa_profit')}
                                                className="mt-2 w-full sm:w-auto bg-green-600 text-white px-3 py-2 rounded-md text-xs sm:text-sm hover:bg-green-700 transition-colors"
                                            >
                                                <ArrowDownTrayIcon className="h-3 w-3 sm:h-4 sm:w-4 inline ml-1" />
                                                سحب
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* رصيد دنيا - دنيا ومصطفى */}
                        {userPermissions.canViewDoniaBalance && (
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <UserIcon className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                                    </div>
                                    <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                                        <h3 className="text-base sm:text-lg font-medium text-purple-900 truncate">رصيد دنيا</h3>
                                        <p className="text-lg sm:text-2xl font-bold text-purple-600 break-all">
                                            {formatCurrency(balance.donia_balance)}
                                        </p>
                                        {userPermissions.canWithdrawDoniaProfit && (
                                            <button
                                                onClick={() => openWithdrawModal('donia_profit')}
                                                className="mt-2 w-full sm:w-auto bg-purple-600 text-white px-3 py-2 rounded-md text-xs sm:text-sm hover:bg-purple-700 transition-colors"
                                            >
                                                <ArrowDownTrayIcon className="h-3 w-3 sm:h-4 sm:w-4 inline ml-1" />
                                                سحب
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* الإحصائيات الإجمالية - مصطفى فقط */}
                    {userPermissions.canViewAllBalances && (
                        <div className="bg-white shadow rounded-lg p-6 mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">الإحصائيات الإجمالية (عبر التاريخ)</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {userPermissions.canViewCapitalBalance && (
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500">إجمالي رأس المال</p>
                                        <p className="text-lg font-bold text-blue-600">
                                            {formatCurrency(balance.total_capital_all_time)}
                                        </p>
                                    </div>
                                )}
                                {userPermissions.canViewMustafaBalance && (
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500">إجمالي أرباح مصطفى</p>
                                        <p className="text-lg font-bold text-green-600">
                                            {formatCurrency(balance.total_mustafa_all_time)}
                                        </p>
                                    </div>
                                )}
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">إجمالي أرباح دنيا</p>
                                    <p className="text-lg font-bold text-purple-600">
                                        {formatCurrency(balance.total_donia_all_time)}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">إجمالي الأرباح</p>
                                    <p className="text-lg font-bold text-gray-800">
                                        {formatCurrency(balance.total_profit_all_time)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* إحصائيات مبسطة لدنيا */}
                    {!userPermissions.canViewAllBalances && (
                        <div className="bg-white shadow rounded-lg p-6 mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">إحصائياتك الشخصية</h2>
                            <div className="text-center">
                                <p className="text-sm text-gray-500">إجمالي أرباحك عبر التاريخ</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {formatCurrency(balance.total_donia_all_time)}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* آخر السحوبات */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                                    <ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 ml-2" />
                                    {userPermissions.canViewAllBalances ? 'آخر السحوبات' : 'سحوباتك الأخيرة'}
                                </h2>
                                {getFilteredWithdrawals().length > 0 && (
                                    <Link
                                        href="/balance/withdrawals"
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                    >
                                        عرض الكل
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* عرض الجدول للشاشات الكبيرة */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                            التاريخ
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                            المستخدم
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                            النوع
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                            المبلغ
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                            الملاحظات
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {getFilteredWithdrawals().length > 0 ? (
                                        getFilteredWithdrawals().map((withdrawal) => (
                                            <tr key={withdrawal.id}>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {formatDate(withdrawal.created_at)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {withdrawal.user.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {getWithdrawalTypeLabel(withdrawal.type)}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-red-600">
                                                    -{formatCurrency(withdrawal.amount)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {withdrawal.notes || '-'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                                لا توجد سحوبات حتى الآن
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* عرض البطاقات للموبايل */}
                        <div className="md:hidden">
                            {getFilteredWithdrawals().length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                    {getFilteredWithdrawals().map((withdrawal) => (
                                        <div key={withdrawal.id} className="p-4 space-y-3">
                                            {/* رأس البطاقة */}
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 space-x-reverse">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {withdrawal.user.name}
                                                        </span>
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {getWithdrawalTypeLabel(withdrawal.type)}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatDate(withdrawal.created_at)}
                                                    </p>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-lg font-bold text-red-600">
                                                        -{formatCurrency(withdrawal.amount)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* الملاحظات */}
                                            {withdrawal.notes && (
                                                <div className="bg-gray-50 rounded-md p-3">
                                                    <p className="text-xs text-gray-600 font-medium mb-1">الملاحظات:</p>
                                                    <p className="text-sm text-gray-800">{withdrawal.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <ClockIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد سحوبات حتى الآن</h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {userPermissions.canViewAllBalances
                                            ? 'لم يتم تسجيل أي عمليات سحب حتى الآن'
                                            : 'لم تقومي بأي عمليات سحب حتى الآن'
                                        }
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        يمكنك سحب رصيدك باستخدام أزرار السحب أعلاه
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* نموذج السحب */}
            {showWithdrawModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
                    <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
                                سحب {getWithdrawalTypeLabel(withdrawalForm.type)}
                            </h3>
                            <form onSubmit={handleWithdraw} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        المبلغ
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        required
                                        value={withdrawalForm.amount}
                                        onChange={(e) => setWithdrawalForm({
                                            ...withdrawalForm,
                                            amount: e.target.value
                                        })}
                                        className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="أدخل المبلغ"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        الملاحظات (اختياري)
                                    </label>
                                    <textarea
                                        value={withdrawalForm.notes}
                                        onChange={(e) => setWithdrawalForm({
                                            ...withdrawalForm,
                                            notes: e.target.value
                                        })}
                                        className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows="3"
                                        placeholder="أدخل ملاحظات إضافية..."
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <button
                                        type="submit"
                                        className="w-full sm:flex-1 bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 font-medium transition-colors"
                                    >
                                        تأكيد السحب
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowWithdrawModal(false)}
                                        className="w-full sm:flex-1 bg-gray-500 text-white px-4 py-3 rounded-md hover:bg-gray-600 font-medium transition-colors"
                                    >
                                        إلغاء
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
