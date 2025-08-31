import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { router } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function SalesReport() {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [dateFilter, setDateFilter] = useState({
        start_date: '',
        end_date: '',
        seller_id: ''
    });

    useEffect(() => {
        fetchSalesReport();
    }, []);

    const fetchSalesReport = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (dateFilter.start_date) params.append('start_date', dateFilter.start_date);
            if (dateFilter.end_date) params.append('end_date', dateFilter.end_date);
            if (dateFilter.seller_id) params.append('seller_id', dateFilter.seller_id);

            const response = await fetch(`/reports/sales?${params.toString()}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            const data = await response.json();
            setReportData(data);
        } catch (error) {
            console.error('Error fetching sales report:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return Math.round(amount || 0).toLocaleString() + ' دينار';
    };

    const handleFilterChange = (field, value) => {
        setDateFilter(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const applyFilter = () => {
        setCurrentPage(1); // إعادة تعيين الصفحة عند التصفية
        fetchSalesReport();
    };

    // حساب البيانات للصفحة الحالية
    const getCurrentPageData = () => {
        if (!reportData?.sales) return [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return reportData.sales.slice(startIndex, endIndex);
    };

    // حساب إجمالي عدد الصفحات
    const totalPages = reportData?.sales ? Math.ceil(reportData.sales.length / itemsPerPage) : 0;

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

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">جاري تحميل تقرير المبيعات...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <button
                            onClick={() => router.visit('/reports')}
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5 ml-2" />
                            العودة للتقارير
                        </button>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">تقرير المبيعات</h1>
                    <p className="text-gray-600">تحليل مفصل لجميع عمليات البيع والأرباح</p>
                </div>

                <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">تصفية التقرير</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">من تاريخ</label>
                            <input
                                type="date"
                                value={dateFilter.start_date}
                                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">إلى تاريخ</label>
                            <input
                                type="date"
                                value={dateFilter.end_date}
                                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">البائع</label>
                            <select
                                value={dateFilter.seller_id}
                                onChange={(e) => handleFilterChange('seller_id', e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">جميع البائعين</option>
                                {reportData?.sellers?.map(seller => (
                                    <option key={seller.id} value={seller.id}>
                                        {seller.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={applyFilter}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                            >
                                تطبيق التصفية
                            </button>
                        </div>
                    </div>
                </div>

                {reportData?.summary && (
                    <div className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">إجمالي المبيعات</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(reportData.summary.total_revenue)}
                                        </p>
                                    </div>
                                    <CurrencyDollarIcon className="w-8 h-8 text-green-500" />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">صافي الربح</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(reportData.summary.total_profit)}
                                        </p>
                                    </div>
                                    <ArrowTrendingUpIcon className="w-8 h-8 text-emerald-500" />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">عدد العمليات</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {reportData.summary.count}
                                        </p>
                                    </div>
                                    <ChartBarIcon className="w-8 h-8 text-blue-500" />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">متوسط البيع</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(reportData.summary.average_sale)}
                                        </p>
                                    </div>
                                    <CalendarIcon className="w-8 h-8 text-purple-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">تفاصيل المبيعات</h2>
                    </div>

                    <div className="overflow-x-auto">
                        {reportData?.sales && reportData.sales.length > 0 ? (
                            <>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                التاريخ
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                المنتج
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                البائع
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الكمية
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                إجمالي المبيعات
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الربح
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                نوع الدفع
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {getCurrentPageData().map((sale, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(sale.created_at).toLocaleDateString('ar-IQ')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {sale.product_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {sale.seller_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {sale.quantity_sold}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatCurrency(sale.total_revenue)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatCurrency(sale.total_profit)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        sale.payment_type === 'cash'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {sale.payment_type === 'cash' ? 'نقدي' : 'أجل'}
                                                    </span>
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
                                                        {Math.min(currentPage * itemsPerPage, reportData.sales.length)}
                                                    </span>
                                                    {' '}من{' '}
                                                    <span className="font-medium">{reportData.sales.length}</span>
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

                                                    {/* أرقام الصفحات */}
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
                            <div className="text-center py-12">
                                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد مبيعات</h3>
                                <p className="mt-1 text-sm text-gray-500">لم يتم العثور على مبيعات في الفترة المحددة</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
