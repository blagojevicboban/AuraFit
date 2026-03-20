import React, { createContext, useContext, useEffect, useState } from 'react';

interface PWAContextType {
  isInstallable: boolean;
  installApp: () => Promise<void>;
  showInstallPrompt: boolean;
  setShowInstallPrompt: (show: boolean) => void;
  forceUpdate: () => Promise<void>;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(() => {
    // Debug override
    return localStorage.getItem('pwa_debug_force') === 'true';
  });
  const [showInstallPrompt, setShowInstallPrompt] = useState(() => {
    // Show prompt if it hasn't been dismissed in this session
    return !sessionStorage.getItem('pwa_prompt_dismissed');
  });

  useEffect(() => {
    console.log('[PWA] Context initialized');
    
    const handler = (e: any) => {
      console.log('[PWA] beforeinstallprompt event caught!');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    console.log('[PWA] Standalone mode:', isStandalone);
    
    if (isStandalone) {
      setIsInstallable(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setIsInstallable(false);
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
  };

  const forceUpdate = async () => {
    console.log('[PWA] Forcing update and cache clear...');
    try {
      // 1. Unregister all service workers
      if (window.navigator.serviceWorker) {
        const registrations = await window.navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }
      // 2. Clear all PWA caches
      if (window.caches) {
        const keys = await window.caches.keys();
        for (const key of keys) {
          await window.caches.delete(key);
        }
      }
      // 3. Clear storage (optional but good for a hard reset)
      // localStorage.clear(); // Uncomment if you want a complete nuclear reset
      
      console.log('[PWA] Reset complete. Reloading...');
      // 4. Force reload from server
      window.location.replace('/home'); 
      window.location.reload();
    } catch (error) {
      console.error('[PWA] Error during force update:', error);
      window.location.reload();
    }
  };

  return (
    <PWAContext.Provider value={{ isInstallable, installApp, showInstallPrompt, setShowInstallPrompt, forceUpdate }}>
      {children}
    </PWAContext.Provider>
  );

}

export function usePWA() {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
}
