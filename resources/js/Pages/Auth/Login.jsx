import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showTestUsers, setShowTestUsers] = useState(true);

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    const testUsers = [
        { name: 'مصطفى (المدير)', email: 'mustafa@marcetime.com', password: '123456', role: 'مدير - 70% أرباح' },
        { name: 'دنيا (الشريك)', email: 'donia@marcetime.com', password: '123456', role: 'شريك - 30% أرباح' }
    ];

    const fillTestUser = (user) => {
        setData({
            ...data,
            email: user.email,
            password: user.password
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <Head title="تسجيل الدخول - مارسيتايم" />

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-10 opacity-50">
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
                </div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Glass Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative">
                    {/* Decorative elements */}
                    <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"></div>
                    <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75"></div>
                            <svg className="w-10 h-10 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-3">مارسيتايم</h1>
                        <p className="text-white/70 text-lg">نظام إدارة المخزون ونقطة البيع</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-3">
                                البريد الإلكتروني
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-white placeholder-white/50"
                                    placeholder="أدخل البريد الإلكتروني"
                                    required
                                    dir="ltr"
                                />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-300">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-3">
                                كلمة المرور
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-white placeholder-white/50"
                                    placeholder="أدخل كلمة المرور"
                                    required
                                    dir="ltr"
                                />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-300">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="w-4 h-4 text-purple-500 bg-white/10 border-white/30 rounded focus:ring-purple-400 focus:ring-2"
                            />
                            <label htmlFor="remember" className="mr-3 text-sm text-white/80">
                                تذكرني
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative">
                                {processing ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        جاري تسجيل الدخول...
                                    </div>
                                ) : (
                                    'تسجيل الدخول'
                                )}
                            </span>
                        </button>
                    </form>

                    {/* Test Users Section */}
                    {showTestUsers && (
                        <div className="mt-8 pt-6 border-t border-white/20">
                            <p className="text-sm text-white/60 text-center mb-4">حسابات تجريبية للاختبار:</p>
                            <div className="space-y-3">
                                {testUsers.map((user, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => fillTestUser(user)}
                                        className="w-full text-right p-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300 group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="flex justify-between items-center relative">
                                            <div>
                                                <p className="font-medium text-white">{user.name}</p>
                                                <p className="text-sm text-white/60">{user.role}</p>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm text-white/50" dir="ltr">{user.email}</p>
                                                <p className="text-xs text-white/40" dir="ltr">123456</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowTestUsers(false)}
                                className="w-full mt-4 text-xs text-white/40 hover:text-white/60 transition-colors duration-200"
                            >
                                إخفاء الحسابات التجريبية
                            </button>
                        </div>
                    )}

                    {!showTestUsers && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setShowTestUsers(true)}
                                className="text-sm text-white/50 hover:text-white/70 transition-colors duration-200"
                            >
                                عرض الحسابات التجريبية
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
