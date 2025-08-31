import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';

export default function Debt() {
    const [debts, setDebts] = useState([]);
    const [payments, setPayments] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [activeTab, setActiveTab] = useState('debts');

    const fetchDebts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (dateFrom) params.append('date_from', dateFrom);
            if (dateTo) params.append('date_to', dateTo);

            const response = await fetch(`/reports/debts?${params}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                }
            });
            const data = await response.json();
            setDebts(data.debts || []);
            setPayments(data.payments || []);
            setSummary(data.summary || {});
        } catch (error) {
            console.error('خطأ في تحميل بيانات الديون:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDebts();
    }, []);

    const handleFilter = () => {
        setCurrentPage(1);
        fetchDebts();
    };

    // حساب البيانات للصفحة الحالية
    const getCurrentPageData = () => {
        const data = activeTab === 'debts' ? debts : payments;
        if (!data) return [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    // حساب إجمالي عدد الصفحات
    const getTotalPages = () => {
        const data = activeTab === 'debts' ? debts : payments;
        return data ? Math.ceil(data.length / itemsPerPage) : 0;
    };

    // وظائف التنقل بين الصفحات
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        const totalPages = getTotalPages();
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // إعادة تعيين الصفحة عند تغيير التبويب
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    return (
        <AppLayout
            title="تقرير الديون"
            renderHeader={() => (
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    تقرير الديون
                </h2>
            )}
        >
            <Head title="تقرير الديون" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6">
                            {/* فلاتر التاريخ */}
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        من تاريخ
                                    </label>
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        إلى تاريخ
                                    </label>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={handleFilter}
                                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        فلترة
                                    </button>
                                </div>
                            </div>

                            {/* ملخص الديون */}
                            <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                                    <h3 className="text-lg font-semibold text-red-800 mb-2">عدد الديون</h3>
                                    <p className="text-3xl font-bold text-red-600">
                                        {summary.total_debts || 0}
                                    </p>
                                </div>
                                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                                    <h3 className="text-lg font-semibold text-orange-800 mb-2">إجمالي المديونية</h3>
                                    <p className="text-3xl font-bold text-orange-600">
                                        {Math.round(summary.total_debt_amount || 0).toLocaleString()} دينار
                                    </p>
                                </div>
                                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                    <h3 className="text-lg font-semibold text-green-800 mb-2">المبلغ المدفوع</h3>
                                    <p className="text-3xl font-bold text-green-600">
                                        {Math.round(summary.total_paid || 0).toLocaleString()} دينار
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">المتبقي</h3>
                                    <p className="text-3xl font-bold text-gray-600">
                                        {Math.round(summary.total_outstanding || 0).toLocaleString()} دينار
                                    </p>
                                </div>
                            </div>

                            {/* التبويبات */}
                            <div className="mb-6">
                                <nav className="flex space-x-8" dir="ltr">
                                    <button
                                        onClick={() => handleTabChange('debts')}
                                        className={`px-3 py-2 font-medium text-sm rounded-md ${
                                            activeTab === 'debts'
                                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        الديون ({debts.length})
                                    </button>
                                    <button
                                        onClick={() => handleTabChange('payments')}
                                        className={`px-3 py-2 font-medium text-sm rounded-md ${
                                            activeTab === 'payments'
                                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        المدفوعات ({payments.length})
                                    </button>
                                </nav>
                            </div>

                            {/* محتوى التبويبات */}
                            <div className="overflow-x-auto">
                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <p className="mt-2 text-gray-600">جاري تحميل البيانات...</p>
                                    </div>
                                ) : activeTab === 'debts' ? (
                                    debts.length > 0 ? (
                                        <>
                                            <table className="min-w-full bg-white border border-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المنتج</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">العميل</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجمالي الدين</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المدفوع</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المتبقي</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {getCurrentPageData().map((debt, index) => (
                                                        <tr key={index} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                {debt.sale?.product?.name || 'غير محدد'}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                {debt.customer_name || 'غير محدد'}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                {Math.round(debt.total_amount || 0).toLocaleString()} دينار
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-green-600">
                                                                {Math.round(debt.paid_amount || 0).toLocaleString()} دينار
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-red-600">
                                                                {Math.round(debt.remaining_amount || 0).toLocaleString()} دينار
                                                            </td>
                                                            <td className="px-6 py-4 text-sm">
                                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                                    debt.remaining_amount > 0
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : 'bg-green-100 text-green-800'
                                                                }`}>
                                                                    {debt.remaining_amount > 0 ? 'غير مسدد' : 'مسدد'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                {new Date(debt.created_at).toLocaleDateString('ar-IQ')}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            {/* شريط التنقل بين الصفحات للديون */}
                                            {getTotalPages() > 1 && (
                                                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                                    <div className="flex-1 flex justify-between sm:hidden">
                                                        <button
                                                            onClick={goToPreviousPage}
                                                            disabled={currentPage === 1}
                                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            السابق
                                                        </button>
                                                        <button
                                                            onClick={goToNextPage}
                                                            disabled={currentPage === getTotalPages()}
                                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            التالي
                                                        </button>
                                                    </div>
                                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                        <div>
                                                            <p className="text-sm text-gray-700">
                                                                عرض{' '}
                                                                <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                                                                {' '}إلى{' '}
                                                                <span className="font-medium">
                                                                    {Math.min(currentPage * itemsPerPage, debts.length)}
                                                                </span>
                                                                {' '}من{' '}
                                                                <span className="font-medium">{debts.length}</span>
                                                                {' '}نتيجة
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                                <button
                                                                    onClick={goToPreviousPage}
                                                                    disabled={currentPage === 1}
                                                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    السابق
                                                                </button>

                                                                {Array.from({ length: Math.min(5, getTotalPages()) }, (_, i) => {
                                                                    let pageNumber;
                                                                    const totalPages = getTotalPages();
                                                                    if (totalPages <= 5) {
                                                                        pageNumber = i + 1;
                                                                    } else if (currentPage <= 3) {
                                                                        pageNumber = i + 1;
                                                                    } else if (currentPage >= totalPages - 2) {
                                                                        pageNumber = totalPages - 4 + i;
                                                                    } else {
                                                                        pageNumber = currentPage - 2 + i;
                                                                    }

                                                                    return (
                                                                        <button
                                                                            key={pageNumber}
                                                                            onClick={() => goToPage(pageNumber)}
                                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                                currentPage === pageNumber
                                                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                            }`}
                                                                        >
                                                                            {pageNumber}
                                                                        </button>
                                                                    );
                                                                })}

                                                                <button
                                                                    onClick={goToNextPage}
                                                                    disabled={currentPage === getTotalPages()}
                                                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    التالي
                                                                </button>
                                                            </nav>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-600">لا توجد ديون في الفترة المحددة</p>
                                        </div>
                                    )
                                ) : (
                                    payments.length > 0 ? (
                                        <>
                                            <table className="min-w-full bg-white border border-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المنتج</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">العميل</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">مبلغ الدفعة</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">ملاحظات</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ الدفع</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {getCurrentPageData().map((payment, index) => (
                                                        <tr key={index} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                {payment.debt?.sale?.product?.name || 'غير محدد'}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                {payment.debt?.customer_name || 'غير محدد'}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-green-600 font-semibold">
                                                                {Math.round(payment.amount || 0).toLocaleString()} دينار
                                                            </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {payment.notes || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {new Date(payment.created_at).toLocaleDateString('ar-IQ')}
                                                        </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            {/* شريط التنقل بين الصفحات للمدفوعات */}
                                            {getTotalPages() > 1 && (
                                                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                                    <div className="flex-1 flex justify-between sm:hidden">
                                                        <button
                                                            onClick={goToPreviousPage}
                                                            disabled={currentPage === 1}
                                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            السابق
                                                        </button>
                                                        <button
                                                            onClick={goToNextPage}
                                                            disabled={currentPage === getTotalPages()}
                                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            التالي
                                                        </button>
                                                    </div>
                                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                        <div>
                                                            <p className="text-sm text-gray-700">
                                                                عرض{' '}
                                                                <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                                                                {' '}إلى{' '}
                                                                <span className="font-medium">
                                                                    {Math.min(currentPage * itemsPerPage, payments.length)}
                                                                </span>
                                                                {' '}من{' '}
                                                                <span className="font-medium">{payments.length}</span>
                                                                {' '}نتيجة
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                                <button
                                                                    onClick={goToPreviousPage}
                                                                    disabled={currentPage === 1}
                                                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    السابق
                                                                </button>

                                                                {Array.from({ length: Math.min(5, getTotalPages()) }, (_, i) => {
                                                                    let pageNumber;
                                                                    const totalPages = getTotalPages();
                                                                    if (totalPages <= 5) {
                                                                        pageNumber = i + 1;
                                                                    } else if (currentPage <= 3) {
                                                                        pageNumber = i + 1;
                                                                    } else if (currentPage >= totalPages - 2) {
                                                                        pageNumber = totalPages - 4 + i;
                                                                    } else {
                                                                        pageNumber = currentPage - 2 + i;
                                                                    }

                                                                    return (
                                                                        <button
                                                                            key={pageNumber}
                                                                            onClick={() => goToPage(pageNumber)}
                                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                                currentPage === pageNumber
                                                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                            }`}
                                                                        >
                                                                            {pageNumber}
                                                                        </button>
                                                                    );
                                                                })}

                                                                <button
                                                                    onClick={goToNextPage}
                                                                    disabled={currentPage === getTotalPages()}
                                                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    التالي
                                                                </button>
                                                            </nav>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-600">لا توجد مدفوعات في الفترة المحددة</p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
