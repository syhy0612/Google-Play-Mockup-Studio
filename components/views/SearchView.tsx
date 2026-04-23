import React from 'react';
import { motion } from 'framer-motion';
import { AppConfig } from '../../types';
import { INITIAL_CONFIG } from '../../constants';
import { Star, ArrowLeft, Search, Mic } from '../IconComponents';

interface SearchViewProps {
  config: AppConfig;
  installLabel: string;
  onBack: () => void;
  onDetailsClick: () => void;
  onOpenLightbox: (index: number) => void;
  onOpenSettings: () => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  config,
  installLabel,
  onBack,
  onDetailsClick,
  onOpenLightbox,
  onOpenSettings,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-20 bg-white min-h-full"
    >
      <div className="sticky top-0 bg-white z-20 px-2 pb-2 pt-[calc(0.5rem+env(safe-area-inset-top))] flex items-center gap-2 shadow-sm border-b border-gray-100">
        <button onClick={onBack} className="p-2 text-gray-500">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 bg-[#f1f3f4] h-10 rounded-full flex items-center px-4 gap-2">
          <Search className="w-5 h-5 text-gray-500" />
          <span className="flex-1 text-gray-900 text-sm">
            {config.appName || INITIAL_CONFIG.appName}
          </span>
        </div>
        <button className="p-2 text-gray-500" onClick={onOpenSettings}>
          <Mic className="w-5 h-5" />
        </button>
      </div>

      <div className="px-5 py-4">
        <div className="flex gap-4 cursor-pointer" onClick={onDetailsClick}>
          <img
            src={config.logoUrl || INITIAL_CONFIG.logoUrl}
            alt="Icon"
            className="w-16 h-16 rounded-xl shadow-sm object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="text-base font-medium text-gray-900 truncate">
              {config.appName || INITIAL_CONFIG.appName}
            </h3>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              {config.devName || INITIAL_CONFIG.devName}
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
              <span className="flex items-center gap-0.5">
                {config.rating || INITIAL_CONFIG.rating}{' '}
                <Star className="w-2.5 h-2.5 fill-current" />
              </span>
              <span>•</span>
              <span>{config.downloads || INITIAL_CONFIG.downloads}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar pb-2 items-center">
          {config.screenshots.map((src, idx) => (
            <div
              key={src}
              className="h-[180px] w-auto bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 cursor-pointer"
              onClick={() => onOpenLightbox(idx)}
            >
              <img src={src} className="h-full w-auto object-contain" alt="" />
            </div>
          ))}
          {config.screenshots.length === 0 && (
            <div className="w-full h-24 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-400">
              No screenshots
            </div>
          )}
        </div>

        <button className="w-full mt-4 bg-brand text-white font-medium py-2 rounded-full text-sm hover:bg-brand-hover shadow-sm">
          {installLabel}
        </button>
      </div>
    </motion.div>
  );
};
