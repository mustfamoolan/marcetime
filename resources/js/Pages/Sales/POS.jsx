import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function POS({ products = [], auth }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showSaleModal, setShowSaleModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [productsList, setProductsList] = useState(products);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successData, setSuccessData] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: '',
        user_id: auth.user.id, // استخدام ID المستخدم المسجل
        quantity_sold: 1,
        payment_type: 'cash',
        customer_name: ''
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ar-IQ', {
            style: 'currency',
            currency: 'IQD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setData({
            ...data,
            product_id: product.id,
            user_id: auth.user.id, // تأكيد استخدام ID المستخدم المسجل
            quantity_sold: 1
        });
        setShowSaleModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('بدء عملية البيع...');
        console.log('البيانات:', data);
        console.log('المنتج المختار:', selectedProduct);

        // التحقق من صحة البيانات قبل الإرسال
        if (!selectedProduct || !data.quantity_sold || data.quantity_sold < 1) {
            alert('يرجى التأكد من صحة البيانات');
            return;
        }

        if (data.payment_type === 'debt' && !data.customer_name.trim()) {
            alert('يرجى إدخال اسم العميل للبيع بالأجل');
            return;
        }

        // إعداد البيانات للإرسال
        const submitData = {
            product_id: data.product_id,
            user_id: data.user_id,
            quantity_sold: data.quantity_sold,
            payment_type: data.payment_type,
            customer_name: data.payment_type === 'debt' ? data.customer_name : ''
        };

        console.log('البيانات المرسلة:', submitData);

        post(route('sales.store'), submitData, {
            onSuccess: (response) => {
                console.log('البيع تم بنجاح:', response);

                // إظهار رسالة النجاح
                setSuccessData({
                    productName: selectedProduct.name,
                    quantity: data.quantity_sold,
                    total: selectedProduct.selling_price * data.quantity_sold,
                    paymentType: data.payment_type === 'cash' ? 'نقدي' : 'أجل',
                    customerName: data.customer_name
                });
                setShowSuccessMessage(true);

                // تحديث القائمة
                setProductsList(prevProducts =>
                    prevProducts.map(product =>
                        product.id === selectedProduct.id
                            ? { ...product, quantity: product.quantity - data.quantity_sold }
                            : product
                    )
                );

                // إعادة تعيين البيانات
                setData({
                    product_id: '',
                    user_id: auth.user.id,
                    quantity_sold: 1,
                    payment_type: 'cash',
                    customer_name: ''
                });

                // إخفاء رسالة النجاح بعد 4 ثواني
                setTimeout(() => {
                    setShowSuccessMessage(false);
                    setSuccessData(null);
                }, 4000);
            },
            onError: (errors) => {
                console.error('خطأ في البيع:', errors);
                alert('حدث خطأ أثناء البيع: ' + JSON.stringify(errors));
            },
            onFinish: () => {
                console.log('انتهت العملية - إغلاق النافذة');
                // إغلاق النافذة بعد انتهاء العملية
                setShowSaleModal(false);
                setSelectedProduct(null);
            }
        });
    };    const calculateTotals = () => {
        if (!selectedProduct) return { cost: 0, revenue: 0, profit: 0 };
        const quantity = data.quantity_sold || 1;
        const cost = (selectedProduct.purchase_price + selectedProduct.marketing_cost) * quantity;
        const revenue = selectedProduct.selling_price * quantity;
        const profit = revenue - cost;
        return { cost, revenue, profit };
    };

    const { cost, revenue, profit } = calculateTotals();

    const filteredProducts = productsList.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout>
            <Head title="نقطة البيع" />

            {/* Clean iOS-style Design */}
            <div className="min-h-screen bg-gray-50">

                {/* Header */}
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-6xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <h1 className="text-xl font-semibold text-gray-900">نقطة البيع</h1>
                            </div>

                            {/* Live Stats */}
                            <div className="hidden md:flex items-center gap-6">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-blue-600">{productsList.length}</div>
                                    <div className="text-xs text-gray-500">منتج</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-green-600">
                                        {productsList.filter(p => p.quantity > 0).length}
                                    </div>
                                    <div className="text-xs text-gray-500">متوفر</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white px-4 py-3 border-b border-gray-100">
                    <div className="max-w-6xl mx-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="البحث عن منتج..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pr-10 pl-4 py-3 bg-gray-100 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="px-4 py-3">
                    <div className="max-w-6xl mx-auto">
                        <p className="text-gray-600 text-sm">تم العثور على {filteredProducts.length} منتج</p>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="px-4 pb-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleProductSelect(product)}
                                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer relative"
                                    >
                                        {/* Favorite Button */}
                                        <button className="absolute top-3 left-3 p-1.5 z-10">
                                            <svg className="w-5 h-5 text-gray-300 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </button>

                                        {/* Product Image */}
                                        <div className="aspect-square bg-gray-100 overflow-hidden">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-4">
                                            <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                                                {product.name}
                                            </h3>

                                            {/* Rating and Time (Simulated) */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                    </svg>
                                                    <span className="text-xs text-gray-600">4.8</span>
                                                </div>
                                                <span className="text-gray-300">•</span>
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-xs text-gray-600">{product.quantity} قطعة</span>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {formatCurrency(product.selling_price)}
                                                </span>
                                                {product.quantity === 0 && (
                                                    <span className="text-xs text-red-500 font-medium">نفد المخزون</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
                                    <p className="text-gray-500">جرب البحث بكلمات أخرى</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sale Modal */}
            {showSaleModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
                    <div className="bg-white w-full sm:max-w-md sm:mx-4 rounded-t-3xl sm:rounded-3xl shadow-2xl">
                        <form onSubmit={handleSubmit}>
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900">بيع المنتج</h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowSaleModal(false);
                                        setSelectedProduct(null);
                                        setData({
                                            product_id: '',
                                            user_id: auth.user.id,
                                            quantity_sold: 1,
                                            payment_type: 'cash',
                                            customer_name: ''
                                        });
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-6">
                                {/* Product Info */}
                                <div className="text-center">
                                    <h4 className="font-medium text-gray-900">{selectedProduct.name}</h4>
                                    <p className="text-sm text-gray-600 mt-1">السعر: {formatCurrency(selectedProduct.selling_price)}</p>
                                    <p className="text-xs text-blue-600 mt-1">البائع: {auth.user.name}</p>
                                </div>

                                {/* Quantity */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">الكمية</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={selectedProduct.quantity}
                                        value={data.quantity_sold}
                                        onChange={(e) => setData('quantity_sold', parseInt(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">متوفر: {selectedProduct.quantity} قطعة</p>
                                </div>

                                {/* Payment Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">طريقة الدفع</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setData('payment_type', 'cash')}
                                            className={`py-3 px-4 rounded-xl font-medium transition-colors ${
                                                data.payment_type === 'cash'
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            نقدي
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData('payment_type', 'debt')}
                                            className={`py-3 px-4 rounded-xl font-medium transition-colors ${
                                                data.payment_type === 'debt'
                                                    ? 'bg-orange-500 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            أجل
                                        </button>
                                    </div>
                                </div>

                                {/* Customer Name for Debt */}
                                {data.payment_type === 'debt' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">اسم العميل</label>
                                        <input
                                            type="text"
                                            value={data.customer_name}
                                            onChange={(e) => setData('customer_name', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="أدخل اسم العميل..."
                                            required
                                        />
                                        {errors.customer_name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
                                        )}
                                    </div>
                                )}

                                {/* Summary */}
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <h5 className="font-medium text-gray-900 mb-3">ملخص العملية</h5>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">السعر للوحدة:</span>
                                            <span className="font-medium">{formatCurrency(selectedProduct.selling_price)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">الكمية:</span>
                                            <span className="font-medium">{data.quantity_sold}</span>
                                        </div>
                                        <div className="flex justify-between border-t border-gray-200 pt-2">
                                            <span className="text-blue-600 font-medium">المبلغ الإجمالي:</span>
                                            <span className="font-bold text-blue-600">{formatCurrency(revenue)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-gray-100">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'جاري البيع...' : 'تأكيد البيع'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Success Message */}
            {showSuccessMessage && successData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full mx-4 shadow-2xl transform animate-bounce">
                        <div className="p-8 text-center">
                            {/* Success Icon */}
                            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            {/* Success Title */}
                            <h3 className="text-xl font-bold text-gray-900 mb-2">تم البيع بنجاح!</h3>

                            {/* Sale Details */}
                            <div className="space-y-2 text-sm text-gray-600 mb-6">
                                <p><span className="font-medium">المنتج:</span> {successData.productName}</p>
                                <p><span className="font-medium">الكمية:</span> {successData.quantity}</p>
                                <p><span className="font-medium">المبلغ:</span> {formatCurrency(successData.total)}</p>
                                <p><span className="font-medium">الدفع:</span> {successData.paymentType}</p>
                                {successData.paymentType === 'أجل' && (
                                    <p><span className="font-medium">العميل:</span> {successData.customerName}</p>
                                )}
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => {
                                    setShowSuccessMessage(false);
                                    setSuccessData(null);
                                }}
                                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
                            >
                                موافق
                            </button>

                            {/* Auto close message */}
                            <p className="text-xs text-gray-400 mt-2">أو سيتم الإغلاق تلقائياً خلال 4 ثواني</p>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
