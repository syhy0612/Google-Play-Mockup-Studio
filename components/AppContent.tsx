import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppConfig, I18nStrings } from '../types';
import { Star, ArrowLeft, ShieldCheck } from './IconComponents';

interface AppContentProps {
  config: AppConfig;
  strings: I18nStrings;
  galleryHeight: number;
}

export const AppContent: React.FC<AppContentProps> = ({ config, strings, galleryHeight }) => {
  // Drag to Scroll Logic for Gallery List
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Lightbox Logic (CSS Scroll Snap)
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [initialScrollIndex, setInitialScrollIndex] = useState(0);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; 
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const openLightbox = (index: number) => {
    if (isDragging) return; 
    setInitialScrollIndex(index);
    setLightboxOpen(true);
  };

  // Scroll to the specific image when lightbox opens
  useEffect(() => {
    if (lightboxOpen && lightboxRef.current) {
        const width = lightboxRef.current.offsetWidth;
        lightboxRef.current.scrollTo({ left: width * initialScrollIndex, behavior: 'instant' });
    }
  }, [lightboxOpen, initialScrollIndex]);

  return (
    <div className="pb-8 bg-white min-h-full">
      {/* Lightbox Modal (CSS Scroll Snap) */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black"
          >
            {/* Snap Container */}
            <div 
                ref={lightboxRef}
                className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar items-center"
            >
                {config.screenshots.map((src, idx) => (
                    <div 
                        key={idx} 
                        className="min-w-full h-full flex items-center justify-center snap-center p-2"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <img 
                            src={src} 
                            alt={`Fullscreen ${idx}`} 
                            className="max-h-full max-w-full object-contain shadow-2xl select-none"
                            draggable={false}
                        />
                    </div>
                ))}
            </div>

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 pointer-events-none">
                {config.screenshots.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`w-1.5 h-1.5 rounded-full bg-white/50`} 
                    />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App Header Info - Safe Area Fix */}
      <motion.div 
        layout
        className="px-6 pt-[env(safe-area-inset-top)] mt-4 flex gap-4"
      >
        <img 
            src={config.logoUrl} 
            alt="App Logo" 
            className="w-[72px] h-[72px] rounded-2xl shadow-sm object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
            <h1 className="text-2xl font-medium text-gray-900 leading-tight truncate">
                {config.appName}
            </h1>
            <div className="text-[#01875f] font-medium text-sm truncate">
                {config.devName}
            </div>
             <div className="text-gray-500 text-xs truncate mt-1">
                Contains ads • In-app purchases
            </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="flex items-center justify-between px-6 py-6 mt-2">
        <div className="flex flex-col items-center flex-1 border-r border-gray-200 last:border-0">
            <div className="flex items-center font-medium text-gray-800">
                {config.rating} <Star className="w-3 h-3 ml-1 fill-current text-gray-800" />
            </div>
            <div className="text-xs text-gray-500 mt-1">{strings.reviews}</div>
        </div>
        <div className="flex flex-col items-center flex-1 border-r border-gray-200 last:border-0">
            <div className="font-medium text-gray-800">{config.size}</div>
            <div className="text-xs text-gray-500 mt-1">Size</div>
        </div>
        <div className="flex flex-col items-center flex-1 border-r border-gray-200 last:border-0">
            <div className="font-medium text-gray-800">{config.ratedFor}</div>
            <div className="text-xs text-gray-500 mt-1">Rated for</div>
        </div>
        <div className="flex flex-col items-center flex-1">
            <div className="font-medium text-gray-800">{config.downloads}</div>
            <div className="text-xs text-gray-500 mt-1">{strings.downloads}</div>
        </div>
      </div>

      {/* Install Button */}
      <div className="px-6 pb-6">
        <button className="w-full bg-[#2656C8] hover:bg-[#1e45a0] active:bg-[#183984] text-white font-medium rounded-full py-2.5 text-sm transition-colors shadow-sm">
            {strings.install}
        </button>
      </div>

      {/* Screenshots Gallery - Dynamic Height */}
      <div className="mt-2 mb-6">
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ height: `${galleryHeight}px` }} 
          className={`flex overflow-x-auto px-6 pb-0 no-scrollbar items-center select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
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
                      onClick={() => openLightbox(idx)}
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

      {/* About this app */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium text-gray-900">{strings.aboutApp}</h2>
            <ArrowLeft className="w-5 h-5 text-gray-500 rotate-180" /> 
        </div>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
            {config.description}
        </p>
        
        <div className="mt-4 flex flex-wrap gap-2">
            {config.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-600 font-medium">
                    {tag}
                </span>
            ))}
        </div>
      </div>

      {/* Data Safety */}
      <div className="px-6 py-4 mt-2">
         <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium text-gray-900">{strings.dataSafety}</h2>
            <ArrowLeft className="w-5 h-5 text-gray-500 rotate-180" /> 
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {strings.dataSafetySubtitle}
        </p>
        
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-gray-600 mt-0.5" />
                <div>
                    <div className="text-sm font-medium text-gray-900">No data shared with third parties</div>
                    <div className="text-xs text-gray-500 mt-1">The developer says this app doesn't share user data with other companies or organizations.</div>
                </div>
            </div>
        </div>
      </div>
      
      {/* Spacer */}
      <div className="h-20" />
    </div>
  );
};