import React, { useEffect, useState } from 'react';
import { AppConfig, I18nStrings, Language } from '../types';
import { Lightbox } from './Lightbox';
import { BottomNav } from './BottomNav';
import { DiscoveryView } from './views/DiscoveryView';
import { SearchView } from './views/SearchView';
import { DetailsView } from './views/DetailsView';

type ViewState = 'discovery' | 'search' | 'details';

interface AppContentProps {
  config: AppConfig;
  strings: I18nStrings;
  lang: Language;
  galleryHeight: number;
  onOpenSettings: () => void;
}

export const AppContent: React.FC<AppContentProps> = ({
  config,
  strings,
  lang,
  galleryHeight,
  onOpenSettings,
}) => {
  const [currentView, setCurrentView] = useState<ViewState>('discovery');

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentView('discovery');
    history.replaceState({ ...history.state, view: 'discovery', overlay: null }, '');

    const handlePopState = (e: PopStateEvent) => {
      const state = e.state || { view: 'discovery' };
      setCurrentView(state.view ?? 'discovery');
      setLightboxOpen(state.overlay === 'lightbox');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setPreviewImage(null);
    history.pushState({ ...history.state, overlay: 'lightbox' }, '');
    setLightboxOpen(true);
  };

  const navigateTo = (view: ViewState) => {
    history.pushState({ ...history.state, view }, '');
    setCurrentView(view);
  };

  const back = () => history.back();

  return (
    <div className="bg-white h-full flex flex-col relative overflow-hidden">
      <Lightbox
        open={lightboxOpen}
        screenshots={config.screenshots}
        initialIndex={lightboxIndex}
        singleImage={previewImage}
        onClose={back}
      />

      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        {currentView === 'discovery' && (
          <DiscoveryView
            config={config}
            lang={lang}
            installLabel={strings.install}
            onSearchClick={() => navigateTo('search')}
            onDetailsClick={() => navigateTo('details')}
            onOpenSettings={onOpenSettings}
          />
        )}
        {currentView === 'search' && (
          <SearchView
            config={config}
            installLabel={strings.install}
            onBack={back}
            onDetailsClick={() => navigateTo('details')}
            onOpenLightbox={openLightbox}
            onOpenSettings={onOpenSettings}
          />
        )}
        {currentView === 'details' && (
          <DetailsView
            config={config}
            strings={strings}
            galleryHeight={galleryHeight}
            onBack={back}
            onOpenLightbox={openLightbox}
            onOpenSettings={onOpenSettings}
          />
        )}
      </div>

      {(currentView === 'discovery' || currentView === 'search') && <BottomNav lang={lang} />}
    </div>
  );
};
