import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppConfig, I18nStrings } from '../../types';
import { INITIAL_CONFIG } from '../../constants';
import { useDragScroll } from '../../hooks/useDragScroll';
import { Star, ArrowLeft, ShieldCheck, Search, MoreVertical } from '../IconComponents';

interface DetailsViewProps {
  config: AppConfig;
  strings: I18nStrings;
  galleryHeight: number;
  onBack: () => void;
  onOpenLightbox: (index: number) => void;
  onOpenSettings: () => void;
}

export const DetailsView: React.FC<DetailsViewProps> = ({
  config,
  strings,
  galleryHeight,
  onBack,
  onOpenLightbox,
  onOpenSettings,
}) => {
  const [showBanner, setShowBanner] = useState(false);
  const { ref, isDragging, handlers } = useDragScroll();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="pb-8 bg-white min-h-full"
    >
      {showBanner && (
        <div className="w-full aspect-[2/1] bg-gray-100 relative group">
          <img
            src={config.bannerUrl || INITIAL_CONFIG.bannerUrl}
            alt="Feature Graphic"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white" />
        </div>
      )}

      <div
        className={`sticky top-0 z-20 flex items-center justify-between px-2 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] ${
          showBanner ? 'bg-transparent -mt-[100%] mb-[calc(100%-56px)]' : 'bg-white'
        }`}
      >
        <button onClick={onBack} className="p-2 text-gray-800">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-800">
            <Search className="w-6 h-6" />
          </button>
          <button className="p-2 text-gray-800" onClick={onOpenSettings}>
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>

      <motion.div layout className="px-6 pt-2 mt-0 relative">
        <div className="flex gap-4">
          <img
            src={config.logoUrl || INITIAL_CONFIG.logoUrl}
            alt="App Logo"
            className="w-[72px] h-[72px] rounded-2xl shadow-sm object-cover flex-shrink-0 mt-2 cursor-pointer active:scale-95 transition-transform"
            onClick={() => setShowBanner((v) => !v)}
            title="Click to toggle banner"
          />
          <div className="flex-1 min-w-0 flex flex-col justify-between py-1 mt-2">
            <h1 className="text-2xl font-medium text-gray-900 leading-tight truncate">
              {config.appName || INITIAL_CONFIG.appName}
            </h1>
            <div className="text-[#2656C8] font-medium text-sm truncate">
              {config.devName || INITIAL_CONFIG.devName}
            </div>
            <div className="text-gray-500 text-xs truncate mt-1">
              Contains ads • In-app purchases
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center justify-between px-6 py-6 mt-2">
        <div className="flex flex-col items-center flex-1 border-r border-gray-200 last:border-0">
          <div className="flex items-center font-medium text-gray-800">
            {config.rating || INITIAL_CONFIG.rating}{' '}
            <Star className="w-3 h-3 ml-1 fill-current text-gray-800" />
          </div>
          <div className="text-xs text-gray-500 mt-1">{strings.reviews}</div>
        </div>
        <div className="flex flex-col items-center flex-1 border-r border-gray-200 last:border-0">
          <div className="font-medium text-gray-800">{config.size || INITIAL_CONFIG.size}</div>
          <div className="text-xs text-gray-500 mt-1">Size</div>
        </div>
        <div className="flex flex-col items-center flex-1 border-r border-gray-200 last:border-0">
          <div className="font-medium text-gray-800">
            {config.ratedFor || INITIAL_CONFIG.ratedFor}
          </div>
          <div className="text-xs text-gray-500 mt-1">Rated for</div>
        </div>
        <div className="flex flex-col items-center flex-1">
          <div className="font-medium text-gray-800">
            {config.downloads || INITIAL_CONFIG.downloads}
          </div>
          <div className="text-xs text-gray-500 mt-1">{strings.downloads}</div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <button className="w-full bg-[#2656C8] hover:bg-[#1E44A0] active:bg-[#163275] text-white font-medium rounded-full py-2.5 text-sm transition-colors shadow-sm">
          {strings.install}
        </button>
      </div>

      <div className="mt-2 mb-6">
        <div
          ref={ref}
          {...handlers}
          style={{ height: `${galleryHeight}px` }}
          className={`flex overflow-x-auto px-6 pb-0 no-scrollbar items-center select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          <div className="flex flex-nowrap h-full gap-3">
            {config.screenshots.length > 0 ? (
              config.screenshots.map((src, idx) => (
                <motion.img
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  key={`${src}-${idx}`}
                  src={src}
                  alt={`Screenshot ${idx}`}
                  draggable={false}
                  onClick={() => onOpenLightbox(idx)}
                  className="h-full w-auto max-w-none object-contain rounded-xl shadow-sm border border-gray-100 hover:opacity-95 active:scale-[0.98] transition-transform"
                />
              ))
            ) : (
              <div className="h-full w-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200">
                No Visual Assets
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-gray-900">{strings.aboutApp}</h2>
          <ArrowLeft className="w-5 h-5 text-gray-500 rotate-180" />
        </div>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
          {config.description || INITIAL_CONFIG.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {config.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-600 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 mt-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-gray-900">{strings.dataSafety}</h2>
          <ArrowLeft className="w-5 h-5 text-gray-500 rotate-180" />
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{strings.dataSafetySubtitle}</p>
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-gray-600 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                No data shared with third parties
              </div>
              <div className="text-xs text-gray-500 mt-1">
                The developer says this app doesn't share user data with other companies or
                organizations.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20" />
    </motion.div>
  );
};
