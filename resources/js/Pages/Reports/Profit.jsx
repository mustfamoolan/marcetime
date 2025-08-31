import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';

export default function Profit() {
    const [profits, setProfits] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const fetchProfits = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (dateFrom) params.append('date_from', dateFrom);
            if (dateTo) params.append('date_to', dateTo);

            const response = await fetch(`/reports/profit?${params}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                }
            });
            const data = await response.json();
            setProfits(data.profits || []);
            setSummary(data.summary || {});
        } catch (error) {
            console.error('خطأ في تحميل بيانات الأرباح:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfits();
    }, []);

    const handleFilter = () => {
        setCurrentPage(1);
        fetchProfits();
    };

    // حساب البيانات للصفحة الحالية
    const getCurrentPageData = () => {
        if (!profits) return [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return profits.slice(startIndex, endIndex);
    };

    // حساب إجمالي عدد الصفحات
    const totalPages = profits ? Math.ceil(profits.length / itemsPerPage) : 0;

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
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <AppLayout
            title="تقرير الأرباح"
            renderHeader={() => (
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    تقرير الأرباح
                </h2>
            )}
        >
            <Head title="تقرير الأرباح" />

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

                            {/* ملخص الأرباح */}
                            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                    <h3 className="text-lg font-semibold text-green-800 mb-2">إجمالي الأرباح</h3>
                                    <p className="text-3xl font-bold text-green-600">
                                        {Math.round(summary.total_profit || 0).toLocaleString()} دينار
                                    </p>
                                </div>
                                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                    <h3 className="text-lg font-semibold text-blue-800 mb-2">نصيب مصطفى</h3>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {Math.round(summary.mustafa_total || 0).toLocaleString()} دينار
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                                    <h3 className="text-lg font-semibold text-purple-800 mb-2">نصيب دنيا</h3>
                                    <p className="text-3xl font-bold text-purple-600">
                                        {Math.round(summary.donia_total || 0).toLocaleString()} دينار
                                    </p>
                                </div>
                            </div>

                            {/* جدول الأرباح */}
                            <div className="overflow-x-auto">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">تفاصيل توزيع الأرباح</h3>
                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <p className="mt-2 text-gray-600">جاري تحميل البيانات...</p>
                                    </div>
                                ) : profits.length > 0 ? (
                                    <>
                                        <table className="min-w-full bg-white border border-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المنتج</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">البائع</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نصيب مصطفى</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نصيب دنيا</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجمالي الربح</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ البيع</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {getCurrentPageData().map((profit, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {profit.sale?.product?.name || 'غير محدد'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {profit.sale?.user?.name || 'غير محدد'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {Math.round(profit.mustafa_share || 0).toLocaleString()} دينار
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {Math.round(profit.donia_share || 0).toLocaleString()} دينار
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-green-600">
                                                            {Math.round((profit.mustafa_share || 0) + (profit.donia_share || 0)).toLocaleString()} دينار
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {new Date(profit.sale?.created_at).toLocaleDateString('ar-IQ')}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {/* شريط التنقل بين الصفحات */}
                                        {totalPages > 1 && (
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
                                                        disabled={currentPage === totalPages}
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
                                                                {Math.min(currentPage * itemsPerPage, profits.length)}
                                                            </span>
                                                            {' '}من{' '}
                                                            <span className="font-medium">{profits.length}</span>
                                                            {' '}نتيجة
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                            <button
                                                                onClick={goToPreviousPage}
                                                                disabled={currentPage === 1}
                                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                السابق
                                                            </button>

                                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                                let pageNumber;
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
                                                                disabled={currentPage === totalPages}
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
                                        <p className="text-gray-600">لا توجد بيانات أرباح في الفترة المحددة</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
