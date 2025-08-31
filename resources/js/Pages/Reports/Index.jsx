import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { router } from '@inertiajs/react';
import {
    ChartBarIcon,
    CurrencyDollarIcon,
    UsersIcon,
    ShoppingBagIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';

export default function ReportsIndex() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOverviewStats();
    }, []);

    const fetchOverviewStats = async () => {
        setLoading(true);
        try {
            const response = await fetch('/reports/overview', {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ar-IQ', {
            style: 'currency',
            currency: 'IQD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    const reportTypes = [
        {
            id: 'sales',
            name: 'تقرير المبيعات',
            icon: CurrencyDollarIcon,
            color: 'bg-green-500',
            description: 'تفاصيل جميع المبيعات'
        },
        {
            id: 'profit',
            name: 'تقرير الأرباح',
            icon: ArrowTrendingUpIcon,
            color: 'bg-emerald-500',
            description: 'توزيع الأرباح والعمولات'
        },
        {
            id: 'debts',
            name: 'تقرير الديون',
            icon: ClockIcon,
            color: 'bg-yellow-500',
            description: 'حالة المديونيات والسداد'
        },
        {
            id: 'products',
            name: 'تقرير المنتجات',
            icon: ShoppingBagIcon,
            color: 'bg-purple-500',
            description: 'أداء المنتجات والمخزون'
        },
        {
            id: 'sellers',
            name: 'تقرير البائعين',
            icon: UsersIcon,
            color: 'bg-blue-500',
            description: 'أداء البائعين وعمولاتهم'
        }
    ];

    const handleReportNavigation = (reportId) => {
        router.visit(`/reports/${reportId}`);
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">جاري تحميل التقارير...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">التقارير والإحصائيات</h1>
                    <p className="text-gray-600">تابع أداء متجرك وحلل البيانات المهمة</p>
                </div>

                {stats && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">الإحصائيات السريعة</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">إجمالي المبيعات</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(stats.general?.total_revenue)}
                                        </p>
                                    </div>
                                    <CurrencyDollarIcon className="w-8 h-8 text-green-500" />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">إجمالي الأرباح</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(stats.general?.total_profit)}
                                        </p>
                                    </div>
                                    <ArrowTrendingUpIcon className="w-8 h-8 text-emerald-500" />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">الديون المستحقة</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(stats.debts?.pending_amount)}
                                        </p>
                                    </div>
                                    <ClockIcon className="w-8 h-8 text-yellow-500" />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">عدد المنتجات</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.general?.total_products}
                                        </p>
                                    </div>
                                    <ShoppingBagIcon className="w-8 h-8 text-purple-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {reportTypes.map((report) => (
                        <div
                            key={report.id}
                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleReportNavigation(report.id)}
                        >
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className={`${report.color} p-3 rounded-lg`}>
                                        <report.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="mr-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {report.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {report.description}
                                        </p>
                                    </div>
                                </div>

                                <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors">
                                    عرض التقرير
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {stats?.today && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">إحصائيات اليوم</h2>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">
                                        {stats.today.sales_count}
                                    </p>
                                    <p className="text-sm text-gray-600">عملية بيع</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatCurrency(stats.today.total_revenue)}
                                    </p>
                                    <p className="text-sm text-gray-600">إجمالي المبيعات</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-emerald-600">
                                        {formatCurrency(stats.today.total_profit)}
                                    </p>
                                    <p className="text-sm text-gray-600">صافي الربح</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
