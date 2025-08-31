import React, { useState, useEffect } from 'react';

export default function PWAInstallPrompt({ onDismiss }) {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);

    useEffect(() => {
        // Check if device is iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(iOS);

        // Check if app is already installed (standalone mode)
        const standalone = window.matchMedia('(display-mode: standalone)').matches;
        setIsInStandaloneMode(standalone);

        console.log('PWA Device Info:', { iOS, standalone });

        // For Android Chrome - listen for install prompt
        const handleBeforeInstallPrompt = (e) => {
            console.log('beforeinstallprompt fired');
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        console.log('Install button clicked, deferredPrompt:', !!deferredPrompt);

        if (deferredPrompt) {
            try {
                console.log('Showing install prompt...');
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log('Install prompt result:', outcome);

                if (outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                    setDeferredPrompt(null);
                    if (onDismiss) onDismiss();
                } else {
                    console.log('User dismissed the install prompt');
                }
            } catch (error) {
                console.error('Error during install prompt:', error);
            }
        } else {
            console.log('No deferredPrompt available, showing manual instructions');
            // إذا لم يكن هناك deferredPrompt، اظهر تعليمات يدوية
            alert('لتثبيت التطبيق:\n1. اضغط على قائمة المتصفح (⋮)\n2. اختر "إضافة إلى الشاشة الرئيسية"\n3. اضغط "إضافة"');
        }
    };

    const handleDismiss = () => {
        // Don't show again for this session
        sessionStorage.setItem('pwa-install-dismissed', 'true');
        if (onDismiss) onDismiss();
    };

    // Don't show if already dismissed in this session or if already installed
    if (sessionStorage.getItem('pwa-install-dismissed') === 'true' || isInStandaloneMode) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative">
                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* App Icon */}
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <img
                            src="/images/logo.png"
                            alt="marcetime"
                            className="w-full h-full object-cover rounded-2xl"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">تثبيت marcetime</h2>
                    <p className="text-gray-600">احصل على تجربة أفضل مع التطبيق المثبت</p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-gray-700">وصول سريع من الشاشة الرئيسية</span>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-gray-700">أداء أسرع وأكثر سلاسة</span>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 17H4l5 5v-5z" />
                            </svg>
                        </div>
                        <span className="text-gray-700">يعمل بدون إنترنت</span>
                    </div>
                </div>

                {/* Install Instructions */}
                {isIOS ? (
                    <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                        <h3 className="font-semibold text-blue-800 mb-2">طريقة التثبيت على iPhone:</h3>
                        <div className="space-y-2 text-sm text-blue-700">
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <span>1.</span>
                                <span>اضغط على أيقونة المشاركة</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                </svg>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <span>2.</span>
                                <span>اختر "إضافة إلى الشاشة الرئيسية"</span>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <span>3.</span>
                                <span>اضغط "إضافة"</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <button
                            onClick={handleInstall}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            {deferredPrompt ? 'تثبيت التطبيق الآن' : 'عرض تعليمات التثبيت'}
                        </button>

                        {!deferredPrompt && (
                            <div className="bg-blue-50 rounded-2xl p-4 text-center">
                                <p className="text-sm text-blue-700">
                                    أو اضغط على قائمة المتصفح (⋮) واختر "إضافة إلى الشاشة الرئيسية"
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {!isIOS && (
                    <button
                        onClick={handleDismiss}
                        className="w-full mt-3 text-gray-500 hover:text-gray-700 py-2 px-4 rounded-xl transition-colors"
                    >
                        ربما لاحقاً
                    </button>
                )}
            </div>
        </div>
    );
}
