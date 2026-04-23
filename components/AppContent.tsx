import React, { useState } from 'react';
import { AppConfig, I18nStrings, Language } from '../types';
import { Lightbox } from './Lightbox';
import { BottomNav } from './BottomNav';
import { DiscoveryView } from './views/DiscoveryView';
import { SearchView } from './views/SearchView';
import { DetailsView } from './views/DetailsView';
import { useHistoryState, ViewState } from '../hooks/useHistoryState';

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
  const { state, push, back } = useHistoryState();
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const lightboxOpen = state.overlay === 'lightbox';

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    push({ overlay: 'lightbox' });
  };

  const navigateTo = (view: ViewState) => push({ view });

  return (
    <div className="bg-white h-full flex flex-col relative overflow-hidden">
      <Lightbox
        open={lightboxOpen}
        screenshots={config.screenshots}
        initialIndex={lightboxIndex}
        singleImage={null}
        onClose={back}
      />

      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        {state.view === 'discovery' && (
          <DiscoveryView
            config={config}
            lang={lang}
            installLabel={strings.install}
            onSearchClick={() => navigateTo('search')}
            onDetailsClick={() => navigateTo('details')}
            onOpenSettings={onOpenSettings}
          />
        )}
        {state.view === 'search' && (
          <SearchView
            config={config}
            installLabel={strings.install}
            onBack={back}
            onDetailsClick={() => navigateTo('details')}
            onOpenLightbox={openLightbox}
            onOpenSettings={onOpenSettings}
          />
        )}
        {state.view === 'details' && (
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

      {(state.view === 'discovery' || state.view === 'search') && <BottomNav lang={lang} />}
    </div>
  );
};
