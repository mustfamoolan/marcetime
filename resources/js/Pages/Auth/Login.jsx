import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <Head title="تسجيل الدخول - marcetime" />

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
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/30 overflow-hidden">
                            <img
                                src="/images/logo.png"
                                alt="marcetime logo"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    console.log('Logo failed to load:', e.target.src);
                                    e.target.style.display = 'none';
                                }}
                                onLoad={() => console.log('Logo loaded successfully')}
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-3">marcetime</h1>
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
                </div>
            </div>
        </div>
    );
}
