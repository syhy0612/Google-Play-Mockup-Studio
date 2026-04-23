import React from 'react';
import { motion } from 'framer-motion';
import { AppConfig, Language } from '../../types';
import { INITIAL_CONFIG } from '../../constants';
import { getPreviewExtras } from '../../constants/previewExtras';
import { Star, Search, Mic, MoreVertical } from '../IconComponents';

interface DiscoveryViewProps {
  config: AppConfig;
  lang: Language;
  installLabel: string;
  onSearchClick: () => void;
  onDetailsClick: () => void;
  onOpenSettings: () => void;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  config,
  lang,
  installLabel,
  onSearchClick,
  onDetailsClick,
  onOpenSettings,
}) => {
  const t = getPreviewExtras(lang);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-20"
    >
      <div className="sticky top-0 bg-white z-20 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] shadow-sm">
        <div
          className="bg-white rounded-full shadow-sm border border-gray-200 h-12 flex items-center px-4 gap-3 cursor-pointer"
          onClick={onSearchClick}
        >
          <Search className="w-5 h-5 text-gray-400" />
          <span className="text-gray-500 text-sm font-normal truncate">{t.searchPlaceholder}</span>
          <div className="flex-1" />
          <Mic className="w-5 h-5 text-gray-500" />
          <div
            className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-90 relative z-10"
            onClick={(e) => {
              e.stopPropagation();
              onOpenSettings();
            }}
          >
            {(config.devName || INITIAL_CONFIG.devName || 'D')[0].toUpperCase()}
          </div>
        </div>

        <div className="flex gap-6 mt-4 overflow-x-auto no-scrollbar pb-1">
          <span className="text-brand font-medium whitespace-nowrap border-b-2 border-brand pb-1">
            {t.forYou}
          </span>
          <span className="text-gray-500 whitespace-nowrap">{t.topCharts}</span>
          <span className="text-gray-500 whitespace-nowrap">{t.children}</span>
          <span className="text-gray-500 whitespace-nowrap">{t.premium}</span>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium text-gray-900">{t.recommended}</h2>
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </div>

        <div className="space-y-3 cursor-pointer group" onClick={onDetailsClick}>
          <div className="relative rounded-xl overflow-hidden shadow-sm aspect-[2/1] bg-gray-100">
            <img
              src={config.bannerUrl || INITIAL_CONFIG.bannerUrl}
              alt="Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-black/30 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded">
              {t.ads}
            </div>
          </div>

          <div className="flex gap-3">
            <img
              src={config.logoUrl || INITIAL_CONFIG.logoUrl}
              alt="Icon"
              className="w-14 h-14 rounded-xl shadow-sm object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-gray-900 truncate">
                {config.appName || INITIAL_CONFIG.appName}
              </h3>
              <div className="text-xs text-gray-500 truncate mt-0.5">
                {config.tags?.[0] || 'App'} •{' '}
                <span className="flex items-center inline-flex gap-0.5">
                  {config.rating || INITIAL_CONFIG.rating}{' '}
                  <Star className="w-2.5 h-2.5 fill-current" />
                </span>
              </div>
            </div>
            <button className="h-8 px-6 bg-brand text-white rounded-full text-xs font-medium hover:bg-brand-hover self-center shadow-sm">
              {installLabel}
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-3">{t.newUpdated}</h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-24 flex-shrink-0 space-y-2">
                  <div className="w-24 h-24 bg-gray-100 rounded-xl" />
                  <div className="h-3 w-20 bg-gray-100 rounded" />
                  <div className="h-3 w-12 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
