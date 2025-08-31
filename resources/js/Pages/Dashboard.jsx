import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';

export default function Dashboard({ auth, statistics = {} }) {
    const user = auth.user;

    // للتحقق من البيانات
    console.log('Statistics received:', statistics);

    // دالة لتنسيق الأرقام بالفواصل والدينار العراقي
    const formatCurrency = (amount) => {
        if (!amount || amount === 0) return '0';
        return new Intl.NumberFormat('ar-IQ').format(amount);
    };

    const stats = [
        {
            name: 'إجمالي المبيعات',
            value: formatCurrency(statistics.general?.total_revenue || 0),
            unit: 'دينار',
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'from-green-500 to-emerald-600',
        },
        {
            name: 'إجمالي الأرباح',
            value: formatCurrency(statistics.general?.total_profit || 0),
            unit: 'دينار',
            icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
            color: 'from-blue-500 to-indigo-600',
        },
        {
            name: 'رصيدك عبر التاريخ',
            value: formatCurrency(statistics.user?.total_profit_all_time || 0),
            unit: 'دينار',
            icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
            color: user.role === 'manager' ? 'from-purple-500 to-pink-600' : 'from-orange-500 to-red-600',
        },
        {
            name: 'عدد المبيعات',
            value: formatCurrency(statistics.general?.total_sales || 0),
            unit: 'عملية',
            icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
            color: 'from-teal-500 to-cyan-600',
        },
    ];

    const quickActions = [
        {
            name: 'عرض الأرصدة',
            description: 'رصيدك الحالي والسحوبات',
            href: '/balance',
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'bg-green-500 hover:bg-green-600',
        },
        {
            name: 'عرض التقارير',
            description: 'تقارير الأرباح والمبيعات',
            href: '/reports',
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            color: 'bg-purple-500 hover:bg-purple-600',
        },
        {
            name: 'إضافة منتج جديد',
            description: 'أضف منتج جديد للمخزون',
            href: '/products/create',
            icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
            color: 'bg-blue-500 hover:bg-blue-600',
        },
        {
            name: 'بيع منتج',
            description: 'تسجيل عملية بيع جديدة',
            href: '/pos',
            icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
            color: 'bg-orange-500 hover:bg-orange-600',
        },
    ];

    return (
        <AppLayout title="لوحة التحكم الرئيسية">
            <Head title="لوحة التحكم" />

            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">
                                مرحباً، {user.name}! 👋
                            </h2>
                            <p className="text-blue-100 mb-4">
                                {user.role === 'manager' ? 'مدير النظام' : 'شريك'}
                            </p>

                            {/* عرض الرصيد بشكل بارز */}
                            <div className="bg-white/20 rounded-lg p-4 mb-4">
                                <div className="flex items-center space-x-3 space-x-reverse">
                                    <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-100">رصيدك الحالي</p>
                                        <p className="text-2xl font-bold text-white">
                                            {formatCurrency(statistics.user?.current_balance || 0)} <span className="text-lg">دينار</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 space-x-reverse">
                                <div className="flex items-center space-x-2 space-x-reverse">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-blue-100">النظام يعمل بشكل طبيعي</span>
                                </div>
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center">
                                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                                    </svg>
                                </div>
                                <div className="mr-4 flex-1">
                                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                    <div className="flex items-baseline">
                                        <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                                        <p className="mr-2 text-sm text-gray-500">{stat.unit}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">الإجراءات السريعة</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.href}
                                className={`${action.color} text-white p-4 rounded-lg transition-colors duration-200 text-right group block`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <svg className="w-6 h-6 text-white/80 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={action.icon} />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-sm mb-1">{action.name}</h4>
                                <p className="text-xs text-white/80">{action.description}</p>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 text-center">
                            🎉 <strong>تم الانتهاء من:</strong> نظام المصادقة ونظام الأرصدة والتقارير!
                            الآن يمكنك متابعة رصيدك والسحوبات بكل سهولة.
                        </p>
                    </div>
                </div>

                {/* Recent Activity - Top Sellers */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">أفضل البائعين</h3>
                    {statistics.seller_stats && statistics.seller_stats.length > 0 ? (
                        <div className="space-y-4">
                            {statistics.seller_stats.slice(0, 5).map((seller, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3 space-x-reverse">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                            index === 0 ? 'bg-yellow-500' :
                                            index === 1 ? 'bg-gray-400' :
                                            index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{seller.seller_name}</p>
                                            <p className="text-sm text-gray-500">{formatCurrency(seller.sales_count)} عملية بيع</p>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-900">{formatCurrency(seller.total_revenue)} دينار</p>
                                        <p className="text-sm text-green-600">ربح: {formatCurrency(seller.total_profit)} دينار</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 mb-2">لا توجد مبيعات حتى الآن</p>
                            <p className="text-sm text-gray-400">ستظهر هنا أفضل البائعين وإحصائياتهم</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
