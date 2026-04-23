import React, { useEffect, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { AppConfig, Language } from './types';
import { INITIAL_CONFIG, DICTIONARY } from './constants';
import { getShowWatermark, setShowWatermark as saveWatermark } from './utils/storage';
import { AppContent } from './components/AppContent';
import { DemoBadge } from './components/DemoBadge';
import { EditorPanel } from './components/EditorPanel';
import {
  HistoryStateProvider,
  readHistoryState,
  useHistoryState,
} from './hooks/useHistoryState';

const localLogo = '/assets/logo.png';
const localBanner = '/assets/Feature.png';
const screenshotPaths = [
  '/assets/1.png',
  '/assets/2.png',
  '/assets/3.png',
  '/assets/4.png',
  '/assets/5.png',
];

const AppShell: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>({
    ...INITIAL_CONFIG,
    logoUrl: localLogo,
    bannerUrl: localBanner,
    screenshots: screenshotPaths,
  });

  const [lang, setLang] = useState<Language>('en');
  const [galleryHeight, setGalleryHeight] = useState(160);
  const [showWatermark, setShowWatermark] = useState<boolean>(() => getShowWatermark());

  const handleSetWatermark = (v: boolean) => {
    setShowWatermark(v);
    saveWatermark(v);
  };

  const { state, push, back } = useHistoryState();
  const strings = DICTIONARY[lang];
  const isEditorOpen = state.overlay === 'settings';

  useEffect(() => {
    if (Capacitor.getPlatform() === 'web') return;

    const handleBackButton = async () => {
      const s = readHistoryState();
      if (s.overlay !== null || s.view !== 'discovery') {
        history.back();
      } else {
        try {
          await CapacitorApp.exitApp();
        } catch (e) {
          console.error('Exit App failed:', e);
        }
      }
    };

    const listenerPromise = CapacitorApp.addListener('backButton', handleBackButton).catch((e) => {
      console.error('Failed to add back button listener:', e);
      return null;
    });

    return () => {
      listenerPromise.then((listener) => listener && listener.remove());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-sans overflow-hidden">
      <div className="relative w-full max-w-[480px] h-[100vh] md:h-[90vh] bg-white md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-300 md:border-gray-800 md:border-[8px]">
        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth relative bg-white flex flex-col">
          <AppContent
            config={config}
            strings={strings}
            lang={lang}
            galleryHeight={galleryHeight}
            onOpenSettings={() => push({ overlay: 'settings' })}
          />
        </div>
        <DemoBadge visible={showWatermark} />
      </div>

      <EditorPanel
        config={config}
        setConfig={setConfig}
        lang={lang}
        setLang={setLang}
        isOpen={isEditorOpen}
        onClose={back}
        galleryHeight={galleryHeight}
        setGalleryHeight={setGalleryHeight}
        showWatermark={showWatermark}
        setShowWatermark={handleSetWatermark}
      />
    </div>
  );
};

const App: React.FC = () => (
  <HistoryStateProvider>
    <AppShell />
  </HistoryStateProvider>
);

export default App;
