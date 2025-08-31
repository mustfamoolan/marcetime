import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function Index({ products }) {
    const [viewMode, setViewMode] = useState('grid');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            router.delete(route('products.destroy', productToDelete.id));
            setShowDeleteModal(false);
            setProductToDelete(null);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ar-IQ', {
            style: 'currency',
            currency: 'IQD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('ar-IQ').format(number);
    };

    // حساب الإحصائيات
    const totalProducts = products.length;
    const inStock = products.filter(p => p.quantity > 0).length;
    const outOfStock = products.filter(p => p.quantity === 0).length;
    const totalPotentialProfit = products.reduce((sum, p) => sum + (p.quantity * p.unit_profit), 0);

    return (
        <AppLayout>
            <Head title="إدارة المنتجات - مارسيتايم" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                {/* Header Section */}
                <div className="bg-white shadow-lg border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
                        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div className="flex items-center space-x-3 space-x-reverse">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-xl md:text-3xl font-bold text-gray-900">إدارة المنتجات</h1>
                                    <p className="text-gray-600 text-sm md:text-base">إضافة وإدارة منتجات المخزون</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                                {/* View Mode Toggle */}
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-all ${
                                            viewMode === 'grid'
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-gray-600 hover:text-blue-600'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                        <span className="hidden sm:inline">شبكة</span>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-all ${
                                            viewMode === 'table'
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-gray-600 hover:text-blue-600'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                        </svg>
                                        <span className="hidden sm:inline">جدول</span>
                                    </button>
                                </div>

                                <Link
                                    href={route('products.create')}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-3 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 text-sm md:text-base"
                                >
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span className="whitespace-nowrap">إضافة منتج</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 space-y-4 md:space-y-6">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                        <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                            <div className="flex items-center">
                                <div className="p-2 md:p-3 bg-blue-100 rounded-lg md:rounded-xl flex-shrink-0">
                                    <svg className="w-4 h-4 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <div className="mr-2 md:mr-4 min-w-0">
                                    <p className="text-xs md:text-sm font-medium text-gray-600 truncate">المنتجات</p>
                                    <p className="text-lg md:text-2xl font-bold text-gray-900">{formatNumber(totalProducts)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                            <div className="flex items-center">
                                <div className="p-2 md:p-3 bg-green-100 rounded-lg md:rounded-xl flex-shrink-0">
                                    <svg className="w-4 h-4 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="mr-2 md:mr-4 min-w-0">
                                    <p className="text-xs md:text-sm font-medium text-gray-600 truncate">متوفر</p>
                                    <p className="text-lg md:text-2xl font-bold text-green-700">{formatNumber(inStock)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                            <div className="flex items-center">
                                <div className="p-2 md:p-3 bg-red-100 rounded-lg md:rounded-xl flex-shrink-0">
                                    <svg className="w-4 h-4 md:w-6 md:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div className="mr-2 md:mr-4 min-w-0">
                                    <p className="text-xs md:text-sm font-medium text-gray-600 truncate">نفد</p>
                                    <p className="text-lg md:text-2xl font-bold text-red-700">{formatNumber(outOfStock)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow col-span-2 lg:col-span-1">
                            <div className="flex items-center">
                                <div className="p-2 md:p-3 bg-purple-100 rounded-lg md:rounded-xl flex-shrink-0">
                                    <svg className="w-4 h-4 md:w-6 md:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <div className="mr-2 md:mr-4 min-w-0">
                                    <p className="text-xs md:text-sm font-medium text-gray-600 truncate">الربح المحتمل</p>
                                    <p className="text-sm md:text-lg font-bold text-purple-700">{formatCurrency(totalPotentialProfit)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Display */}
                    {products.length === 0 ? (
                        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-6 md:p-12 text-center">
                            <div className="w-16 h-16 md:w-24 md:h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
                                <svg className="w-8 h-8 md:w-12 md:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">لا توجد منتجات حتى الآن</h3>
                            <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">ابدأ بإضافة منتجات جديدة لمخزونك</p>
                            <Link
                                href={route('products.create')}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                            >
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                إضافة منتج جديد
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Grid View */}
                            {viewMode === 'grid' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {products.map((product) => (
                                        <div key={product.id} className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                                            {/* Product Image */}
                                            <div className="aspect-square bg-gray-100 overflow-hidden relative">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}

                                                {/* Stock Status Badge */}
                                                <div className="absolute top-2 md:top-3 right-2 md:right-3">
                                                    {product.quantity > 0 ? (
                                                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                            متوفر ({product.quantity})
                                                        </span>
                                                    ) : (
                                                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                            نفد
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-3 md:p-6">
                                                <h3 className="font-bold text-gray-900 text-base md:text-lg mb-2 truncate">{product.name}</h3>
                                                {product.description && (
                                                    <p className="text-gray-600 text-sm mb-3 md:mb-4 line-clamp-2">{product.description}</p>
                                                )}

                                                {/* Pricing Info */}
                                                <div className="space-y-1 md:space-y-2 mb-3 md:mb-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs md:text-sm text-gray-600">سعر البيع:</span>
                                                        <span className="font-bold text-green-600 text-sm md:text-base">{formatCurrency(product.selling_price)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs md:text-sm text-gray-600">الربح:</span>
                                                        <span className="font-bold text-purple-600 text-sm md:text-base">{formatCurrency(product.unit_profit)}</span>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={route('products.show', product.id)}
                                                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-2 md:px-3 rounded-lg text-center transition-colors text-xs md:text-sm font-medium"
                                                    >
                                                        عرض
                                                    </Link>
                                                    <Link
                                                        href={route('products.edit', product.id)}
                                                        className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 py-2 px-2 md:px-3 rounded-lg text-center transition-colors text-xs md:text-sm font-medium"
                                                    >
                                                        تعديل
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick(product)}
                                                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-2 md:px-3 rounded-lg transition-colors text-xs md:text-sm font-medium"
                                                    >
                                                        حذف
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Table View */}
                            {viewMode === 'table' && (
                                <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنتج</th>
                                                    <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">الكمية</th>
                                                    <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعر</th>
                                                    <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">الربح</th>
                                                    <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {products.map((product) => (
                                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                                                        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10 md:h-12 md:w-12">
                                                                    {product.image ? (
                                                                        <img
                                                                            src={product.image}
                                                                            alt={product.name}
                                                                            className="h-10 w-10 md:h-12 md:w-12 rounded-lg object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="h-10 w-10 md:h-12 md:w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                                                            <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="mr-3 md:mr-4">
                                                                    <div className="text-sm font-bold text-gray-900">{product.name}</div>
                                                                    {product.description && (
                                                                        <div className="text-sm text-gray-500 truncate max-w-32 md:max-w-48">{product.description}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                product.quantity > 0
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {product.quantity > 0 ? `${product.quantity} قطعة` : 'نفد'}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-bold text-gray-900">{formatCurrency(product.selling_price)}</div>
                                                        </td>
                                                        <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                                            <div className="text-sm font-bold text-green-600">{formatCurrency(product.unit_profit)}</div>
                                                        </td>
                                                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex justify-end gap-1 md:gap-2">
                                                                <Link
                                                                    href={route('products.show', product.id)}
                                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                                >
                                                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </svg>
                                                                </Link>
                                                                <Link
                                                                    href={route('products.edit', product.id)}
                                                                    className="text-green-600 hover:text-green-900 p-1"
                                                                >
                                                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDeleteClick(product)}
                                                                    className="text-red-600 hover:text-red-900 p-1"
                                                                >
                                                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && productToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl md:rounded-2xl max-w-md w-full mx-4 p-4 md:p-6 shadow-2xl">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 md:h-16 md:w-16 rounded-full bg-red-100 mb-4 md:mb-6">
                                <svg className="h-6 w-6 md:h-8 md:w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">حذف المنتج</h3>
                            <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                                هل أنت متأكد من حذف منتج <span className="font-semibold">"{productToDelete.name}"</span>؟
                                هذا الإجراء لا يمكن التراجع عنه.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 md:py-3 px-4 rounded-xl font-semibold transition-colors"
                                >
                                    حذف المنتج
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2.5 md:py-3 px-4 rounded-xl font-semibold transition-colors"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
