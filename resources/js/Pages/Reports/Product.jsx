import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';

export default function Product() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (dateFrom) params.append('date_from', dateFrom);
            if (dateTo) params.append('date_to', dateTo);

            const response = await fetch(`/reports/products?${params}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                }
            });
            const data = await response.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('خطأ في تحميل بيانات المنتجات:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleFilter = () => {
        setCurrentPage(1);
        fetchProducts();
    };

    // حساب البيانات للصفحة الحالية
    const getCurrentPageData = () => {
        if (!products) return [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return products.slice(startIndex, endIndex);
    };

    // حساب إجمالي عدد الصفحات
    const totalPages = products ? Math.ceil(products.length / itemsPerPage) : 0;

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
        sales_count: products.reduce((sum, p) => sum + (parseInt(p.sales_count) || 0), 0),
        total_quantity: products.reduce((sum, p) => sum + (parseFloat(p.total_quantity) || 0), 0),
        total_revenue: products.reduce((sum, p) => sum + (parseFloat(p.total_revenue) || 0), 0),
        total_profit: products.reduce((sum, p) => sum + (parseFloat(p.total_profit) || 0), 0),
    };

    return (
        <AppLayout
            title="تقرير المنتجات"
            renderHeader={() => (
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    تقرير المنتجات
                </h2>
            )}
        >
            <Head title="تقرير المنتجات" />

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
                                    <h3 className="text-lg font-semibold text-green-800 mb-2">الكمية المباعة</h3>
                                    <p className="text-3xl font-bold text-green-600">
                                        {totalStats.total_quantity}
                                    </p>
                                </div>
                                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">إجمالي الإيرادات</h3>
                                    <p className="text-3xl font-bold text-yellow-600">
                                        {Math.round(totalStats.total_revenue || 0).toLocaleString()} دينار
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                                    <h3 className="text-lg font-semibold text-purple-800 mb-2">إجمالي الأرباح</h3>
                                    <p className="text-3xl font-bold text-purple-600">
                                        {Math.round(totalStats.total_profit || 0).toLocaleString()} دينار
                                    </p>
                                </div>
                            </div>

                            {/* جدول المنتجات */}
                            <div className="overflow-x-auto">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">أداء المنتجات</h3>
                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <p className="mt-2 text-gray-600">جاري تحميل البيانات...</p>
                                    </div>
                                ) : products.length > 0 ? (
                                    <table className="min-w-full bg-white border border-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المنتج</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عدد المبيعات</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكمية المباعة</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">متوسط الكمية</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجمالي الإيرادات</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">متوسط الإيراد</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجمالي الربح</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">هامش الربح</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {getCurrentPageData().map((product, index) => {
                                                const salesCount = parseInt(product.sales_count) || 0;
                                                const totalQuantity = parseFloat(product.total_quantity) || 0;
                                                const totalRevenue = parseFloat(product.total_revenue) || 0;
                                                const totalProfit = parseFloat(product.total_profit) || 0;

                                                const avgQuantity = salesCount > 0 ? (totalQuantity / salesCount).toFixed(1) : '0.0';
                                                const avgRevenue = salesCount > 0 ? Math.round(totalRevenue / salesCount) : 0;
                                                const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0.0';

                                                return (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                            {product.product?.name || 'غير محدد'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {salesCount}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {totalQuantity}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">
                                                            {avgQuantity}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                                                            {Math.round(totalRevenue).toLocaleString()} دينار
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">
                                                            {avgRevenue.toLocaleString()} دينار
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-green-600">
                                                            {Math.round(totalProfit).toLocaleString()} دينار
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
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-600">لا توجد بيانات منتجات في الفترة المحددة</p>
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
