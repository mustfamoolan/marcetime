import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    ClockIcon,
    ArrowRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function Withdrawals({ withdrawals, userPermissions }) {
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

    // ترجمة نوع السحب
    const getWithdrawalTypeLabel = (type) => {
        const types = {
            'capital': 'رأس المال',
            'mustafa_profit': 'أرباح مصطفى',
            'donia_profit': 'أرباح دنيا'
        };
        return types[type] || type;
    };

    // ألوان أنواع السحوبات
    const getTypeColor = (type) => {
        const colors = {
            'capital': 'bg-blue-100 text-blue-800',
            'mustafa_profit': 'bg-green-100 text-green-800',
            'donia_profit': 'bg-purple-100 text-purple-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AppLayout>
            <Head title="جميع السحوبات" />

            <div className="py-4 sm:py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* رأس الصفحة */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex items-center space-x-3 space-x-reverse mb-4">
                            <Link
                                href="/balance"
                                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <ArrowRightIcon className="h-5 w-5 ml-1" />
                                العودة للأرصدة
                            </Link>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                            <ClockIcon className="h-6 w-6 sm:h-8 sm:w-8 ml-3" />
                            {userPermissions.canViewAllBalances ? 'جميع السحوبات' : 'سحوباتك'}
                        </h1>
                        <p className="mt-2 text-sm sm:text-base text-gray-600">
                            سجل مفصل لجميع عمليات السحب
                        </p>
                    </div>

                    {/* قائمة السحوبات */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        {/* عرض الجدول للشاشات الكبيرة */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            التاريخ والوقت
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            المستخدم
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            نوع السحب
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            المبلغ
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            الملاحظات
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {withdrawals.data.map((withdrawal) => (
                                        <tr key={withdrawal.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(withdrawal.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {withdrawal.user.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(withdrawal.type)}`}>
                                                    {getWithdrawalTypeLabel(withdrawal.type)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                                                -{formatCurrency(withdrawal.amount)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                {withdrawal.notes || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* عرض البطاقات للموبايل */}
                        <div className="md:hidden divide-y divide-gray-200">
                            {withdrawals.data.map((withdrawal) => (
                                <div key={withdrawal.id} className="p-4 space-y-3">
                                    {/* رأس البطاقة */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 space-x-reverse mb-2">
                                                <span className="text-sm font-medium text-gray-900 truncate">
                                                    {withdrawal.user.name}
                                                </span>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(withdrawal.type)}`}>
                                                    {getWithdrawalTypeLabel(withdrawal.type)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">
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

                        {/* رسالة عدم وجود بيانات */}
                        {withdrawals.data.length === 0 && (
                            <div className="p-8 text-center">
                                <ClockIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد سحوبات</h3>
                                <p className="text-sm text-gray-500">لم يتم تسجيل أي عمليات سحب حتى الآن</p>
                            </div>
                        )}
                    </div>

                    {/* أزرار التنقل (Pagination) */}
                    {withdrawals.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <div className="flex-1 flex justify-between sm:hidden">
                                {withdrawals.prev_page_url && (
                                    <Link
                                        href={withdrawals.prev_page_url}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        السابق
                                    </Link>
                                )}
                                {withdrawals.next_page_url && (
                                    <Link
                                        href={withdrawals.next_page_url}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        التالي
                                    </Link>
                                )}
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        عرض <span className="font-medium">{withdrawals.from}</span> إلى{' '}
                                        <span className="font-medium">{withdrawals.to}</span> من{' '}
                                        <span className="font-medium">{withdrawals.total}</span> نتيجة
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        {withdrawals.prev_page_url && (
                                            <Link
                                                href={withdrawals.prev_page_url}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                            >
                                                <ChevronRightIcon className="h-5 w-5" />
                                            </Link>
                                        )}

                                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-100 text-sm font-medium text-gray-700">
                                            {withdrawals.current_page} من {withdrawals.last_page}
                                        </span>

                                        {withdrawals.next_page_url && (
                                            <Link
                                                href={withdrawals.next_page_url}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                            >
                                                <ChevronLeftIcon className="h-5 w-5" />
                                            </Link>
                                        )}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
