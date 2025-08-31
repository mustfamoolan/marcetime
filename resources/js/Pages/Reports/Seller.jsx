import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';

export default function Seller() {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const fetchSellers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (dateFrom) params.append('date_from', dateFrom);
            if (dateTo) params.append('date_to', dateTo);

            const response = await fetch(`/reports/sellers?${params}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                }
            });
            const data = await response.json();
            setSellers(data.sellers || []);
        } catch (error) {
            console.error('خطأ في تحميل بيانات البائعين:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSellers();
    }, []);

    const handleFilter = () => {
        setCurrentPage(1);
        fetchSellers();
    };

    // حساب البيانات للصفحة الحالية
    const getCurrentPageData = () => {
        if (!sellers) return [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sellers.slice(startIndex, endIndex);
    };

    // حساب إجمالي عدد الصفحات
    const totalPages = sellers ? Math.ceil(sellers.length / itemsPerPage) : 0;

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

    const totalStats = {
        sales_count: sellers.reduce((sum, s) => sum + (parseInt(s.sales_count) || 0), 0),
        total_revenue: sellers.reduce((sum, s) => sum + (parseFloat(s.total_revenue) || 0), 0),
        total_profit: sellers.reduce((sum, s) => sum + (parseFloat(s.total_profit) || 0), 0),
        total_profit_share: sellers.reduce((sum, s) => sum + (parseFloat(s.profit_share) || 0), 0),
    };

    return (
        <AppLayout
            title="تقرير البائعين"
            renderHeader={() => (
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    تقرير البائعين
                </h2>
            )}
        >
            <Head title="تقرير البائعين" />

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

                            {/* الإحصائيات الإجمالية */}
                            <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                    <h3 className="text-lg font-semibold text-blue-800 mb-2">إجمالي المبيعات</h3>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {totalStats.sales_count}
                                    </p>
                                </div>
                                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                    <h3 className="text-lg font-semibold text-green-800 mb-2">إجمالي الإيرادات</h3>
                                    <p className="text-3xl font-bold text-green-600">
                                        {Math.round(totalStats.total_revenue || 0).toLocaleString()} دينار
                                    </p>
                                </div>
                                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">إجمالي الأرباح</h3>
                                    <p className="text-3xl font-bold text-yellow-600">
                                        {Math.round(totalStats.total_profit || 0).toLocaleString()} دينار
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                                    <h3 className="text-lg font-semibold text-purple-800 mb-2">أنصبة الأرباح</h3>
                                    <p className="text-3xl font-bold text-purple-600">
                                        {Math.round(totalStats.total_profit_share || 0).toLocaleString()} دينار
                                    </p>
                                </div>
                            </div>

                            {/* جدول البائعين */}
                            <div className="overflow-x-auto">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">أداء البائعين</h3>
                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <p className="mt-2 text-gray-600">جاري تحميل البيانات...</p>
                                    </div>
                                ) : sellers.length > 0 ? (
                                    <>
                                        <table className="min-w-full bg-white border border-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">البائع</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عدد المبيعات</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجمالي الإيرادات</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">متوسط البيعة</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجمالي الأرباح</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نصيب الأرباح</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">هامش الربح</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">معدل الأداء</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {getCurrentPageData().map((seller, index) => {
                                                const salesCount = parseInt(seller.sales_count) || 0;
                                                const totalRevenue = parseFloat(seller.total_revenue) || 0;
                                                const totalProfit = parseFloat(seller.total_profit) || 0;
                                                const profitShare = parseFloat(seller.profit_share) || 0;

                                                const avgSale = salesCount > 0 ? Math.round(totalRevenue / salesCount) : 0;
                                                const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0.0';
                                                const performance = salesCount > 0 ? Math.round(totalProfit / salesCount) : 0;

                                                return (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                            {seller.user?.name || 'غير محدد'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {salesCount}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                                                            {Math.round(totalRevenue).toLocaleString()} دينار
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">
                                                            {avgSale.toLocaleString()} دينار
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-green-600">
                                                            {Math.round(totalProfit).toLocaleString()} دينار
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-purple-600">
                                                            {Math.round(profitShare).toLocaleString()} دينار
                                                        </td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                                profitMargin >= 30
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : profitMargin >= 15
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {profitMargin}%
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                                performance >= 100
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : performance >= 50
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {performance} دينار/بيعة
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
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
                                                            {Math.min(currentPage * itemsPerPage, sellers.length)}
                                                        </span>
                                                        {' '}من{' '}
                                                        <span className="font-medium">{sellers.length}</span>
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
                                        <p className="text-gray-600">لا توجد بيانات بائعين في الفترة المحددة</p>
                                    </div>
                                )}
                            </div>

                            {/* رسم بياني بسيط للمقارنة */}
                            {sellers.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">مقارنة الأداء</h3>
                                    <div className="space-y-4">
                                        {sellers.map((seller, index) => {
                                            const maxRevenue = Math.max(...sellers.map(s => parseFloat(s.total_revenue) || 0));
                                            const sellerRevenue = parseFloat(seller.total_revenue) || 0;
                                            const percentage = maxRevenue > 0 ? (sellerRevenue / maxRevenue) * 100 : 0;

                                            return (
                                                <div key={index} className="flex items-center space-x-4" dir="ltr">
                                                    <div className="w-24 text-sm text-gray-600 text-right">
                                                        {seller.user?.name || 'غير محدد'}
                                                    </div>
                                                    <div className="flex-1 bg-gray-200 rounded-full h-6">
                                                        <div
                                                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-6 rounded-full flex items-center justify-end px-2"
                                                            style={{ width: `${percentage}%` }}
                                                        >
                                                            <span className="text-xs text-white font-medium">
                                                                {Math.round(sellerRevenue).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
