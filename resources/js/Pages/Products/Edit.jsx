import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ product }) {
    const { data, setData, post, processing, errors } = useForm({
        name: product.name || '',
        description: product.description || '',
        purchase_price: product.purchase_price || '',
        marketing_cost: product.marketing_cost || 1000,
        selling_price: product.selling_price || '',
        quantity: product.quantity || '',
        image: null,
        _method: 'PUT'
    });

    const [imagePreview, setImagePreview] = useState(product.image_url || null);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ar-IQ', {
            style: 'currency',
            currency: 'IQD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const calculateProfit = () => {
        const purchasePrice = parseFloat(data.purchase_price) || 0;
        const marketingCost = parseFloat(data.marketing_cost) || 0;
        const sellingPrice = parseFloat(data.selling_price) || 0;
        const totalCost = purchasePrice + marketingCost;
        return sellingPrice - totalCost;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('products.update', product.id));
    };

    const profit = calculateProfit();
    const totalCost = (parseFloat(data.purchase_price) || 0) + (parseFloat(data.marketing_cost) || 0);
    const profitPercentage = totalCost > 0 ? (profit / totalCost) * 100 : 0;

    return (
        <AppLayout>
            <Head title={`تعديل المنتج - ${product.name}`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">تعديل المنتج</h1>
                    <p className="text-gray-600 mt-2">قم بتعديل معلومات المنتج أدناه</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white shadow-lg rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">المعلومات الأساسية</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* اسم المنتج */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    اسم المنتج *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="أدخل اسم المنتج"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>

                            {/* الوصف */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    الوصف
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="أدخل وصف المنتج (اختياري)"
                                ></textarea>
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                            </div>

                            {/* الكمية */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    الكمية *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0"
                                />
                                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                            </div>

                            {/* صورة المنتج */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    صورة المنتج
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}

                                {imagePreview && (
                                    <div className="mt-4">
                                        <img
                                            src={imagePreview}
                                            alt="معاينة الصورة"
                                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* معلومات التسعير */}
                    <div className="bg-white shadow-lg rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">معلومات التسعير</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* سعر الشراء */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    سعر الشراء (دينار) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.purchase_price}
                                    onChange={(e) => setData('purchase_price', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                                {errors.purchase_price && <p className="text-red-500 text-sm mt-1">{errors.purchase_price}</p>}
                            </div>

                            {/* كلفة التسويق */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    كلفة التسويق (دينار) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.marketing_cost}
                                    onChange={(e) => setData('marketing_cost', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="1000.00"
                                />
                                {errors.marketing_cost && <p className="text-red-500 text-sm mt-1">{errors.marketing_cost}</p>}
                            </div>

                            {/* سعر البيع */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    سعر البيع (دينار) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.selling_price}
                                    onChange={(e) => setData('selling_price', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                                {errors.selling_price && <p className="text-red-500 text-sm mt-1">{errors.selling_price}</p>}
                            </div>
                        </div>

                        {/* عرض حسابات الربح */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">حسابات الربح</h3>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                                <div className="bg-white p-3 rounded-lg">
                                    <div className="text-sm text-gray-600">إجمالي التكلفة</div>
                                    <div className="text-lg font-bold text-red-600">
                                        {formatCurrency(totalCost)}
                                    </div>
                                </div>

                                <div className="bg-white p-3 rounded-lg">
                                    <div className="text-sm text-gray-600">سعر البيع</div>
                                    <div className="text-lg font-bold text-blue-600">
                                        {formatCurrency(parseFloat(data.selling_price) || 0)}
                                    </div>
                                </div>

                                <div className="bg-white p-3 rounded-lg">
                                    <div className="text-sm text-gray-600">ربح الوحدة</div>
                                    <div className={`text-lg font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(profit)}
                                    </div>
                                </div>

                                <div className="bg-white p-3 rounded-lg">
                                    <div className="text-sm text-gray-600">نسبة الربح</div>
                                    <div className={`text-lg font-bold ${profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {profitPercentage.toFixed(1)}%
                                    </div>
                                </div>
                            </div>

                            {profit < 0 && (
                                <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                                    <div className="flex items-center gap-2 text-red-800">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <span className="font-medium">تحذير: سعر البيع أقل من إجمالي التكلفة (خسارة)</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* أزرار الإجراءات */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                        >
                            إلغاء
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {processing && (
                                <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            )}
                            {processing ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
