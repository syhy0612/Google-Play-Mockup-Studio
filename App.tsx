import React, { useState, useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { AppConfig, Language } from './types';
import { INITIAL_CONFIG, DICTIONARY } from './constants';
import { AppContent } from './components/AppContent';
import { EditorPanel } from './components/EditorPanel';

// Fix: Use string paths for assets instead of imports.
// Direct imports of non-JS files (like .png) fail in browser-native ESM environments 
// or environments without specific image loaders configured.
const localLogo = '/assets/logo.png';
const localBanner = '/assets/Feature.png';
const img1 = '/assets/1.png';
const img2 = '/assets/2.png';
const img3 = '/assets/3.png';
const img4 = '/assets/4.png';
const img5 = '/assets/5.png';

const App: React.FC = () => {
  // v2.3: Initialize state with Local Assets
  const [config, setConfig] = useState<AppConfig>({
    ...INITIAL_CONFIG,
    logoUrl: localLogo,
    bannerUrl: localBanner,
    screenshots: [img1, img2, img3, img4, img5]
  });
    
  const [lang, setLang] = useState<Language>('en'); 
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [galleryHeight, setGalleryHeight] = useState(160); // v2.1: Default Height 160px

  const strings = DICTIONARY[lang];

  // Handle Hardware Back Button (Android)
  useEffect(() => {
    // Skip if not on native platform (optional, but good for web debugging)
    if (Capacitor.getPlatform() === 'web') return;

    const handleBackButton = async () => {
        // Check if we can go back in history state (Settings or View Navigation)
        const state = history.state || {};
        const hasOverlay = state.overlay !== null && state.overlay !== undefined;
        // Check if we are not in the root view ('discovery')
        const isNotRoot = state.view && state.view !== 'discovery';

        if (hasOverlay || isNotRoot) {
            // If overlay is open or not in root view, navigate back
            history.back();
        } else {
            // If in root view (Discovery) and no overlay, exit app
            try {
                await CapacitorApp.exitApp();
            } catch (e) {
                console.error('Exit App failed:', e);
            }
        }
    };

    const setupListener = async () => {
        try {
            const listener = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
                handleBackButton();
            });
            return listener;
        } catch (e) {
            console.error('Failed to add back button listener:', e);
            return null;
        }
    };

    const listenerPromise = setupListener();

    return () => {
        listenerPromise.then(listener => {
            if (listener) listener.remove();
        });
    };
  }, []);

  // History Management for Settings Overlay
  React.useEffect(() => {
    // Initialize history state if null
    if (!history.state) {
      history.replaceState({ view: 'discovery', overlay: null }, '');
    }

    const handlePopState = (e: PopStateEvent) => {
      const state = e.state || {};
      if (state.overlay === 'settings') {
        setIsEditorOpen(true);
      } else {
        setIsEditorOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenSettings = () => {
    history.pushState({ ...history.state, overlay: 'settings' }, '');
    setIsEditorOpen(true);
  };

  const handleCloseSettings = () => {
    history.back();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-sans overflow-hidden">
      
      {/* Mobile Preview Frame */}
      <div className="relative w-full max-w-[480px] h-[100vh] md:h-[90vh] bg-white md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-300 md:border-gray-800 md:border-[8px]">
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth relative bg-white flex flex-col">
            <AppContent 
              config={config} 
              strings={strings} 
              galleryHeight={galleryHeight} 
              onOpenSettings={handleOpenSettings}
            />
        </div>

      </div>

      {/* Editor Drawer */}
      <EditorPanel 
        config={config} 
        setConfig={setConfig} 
        lang={lang}
        setLang={setLang}
        strings={strings}
        isOpen={isEditorOpen}
        onClose={handleCloseSettings}
        galleryHeight={galleryHeight}
        setGalleryHeight={setGalleryHeight}
      />
    </div>
  );
};

export default App;
