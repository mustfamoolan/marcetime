import { useState, useEffect } from 'react';

export function usePWA() {
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        // Register service worker immediately
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('SW registered successfully: ', registration);
                })
                .catch((registrationError) => {
                    console.error('SW registration failed: ', registrationError);
                });
        } else {
            console.log('Service Worker not supported');
        }

        // Check if app is already installed
        const checkIfInstalled = () => {
            const standalone = window.matchMedia('(display-mode: standalone)').matches;
            const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            const isIOSInstalled = iOS && standalone;

            console.log('Install check:', { standalone, iOS, isIOSInstalled });
            setIsInstalled(standalone || isIOSInstalled);
        };

        checkIfInstalled();

        // Listen for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            console.log('beforeinstallprompt event fired');
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        // Listen for appinstalled event
        const handleAppInstalled = () => {
            console.log('PWA was installed successfully');
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // For some browsers, check if install is possible
        setTimeout(() => {
            if (!deferredPrompt) {
                console.log('No beforeinstallprompt event, checking if installable manually');
                setIsInstallable(true); // Show prompt anyway for manual install
            }
        }, 1000);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const installPWA = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }

            setDeferredPrompt(null);
            setIsInstallable(false);
        }
    };

    return {
        isInstallable,
        isInstalled,
        installPWA
    };
}

export default usePWA;
