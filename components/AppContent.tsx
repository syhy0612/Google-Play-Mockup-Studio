import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppConfig, I18nStrings } from '../types';
import { INITIAL_CONFIG } from '../constants';
import { 
  Star, ArrowLeft, ShieldCheck, Search, Menu, 
  User, Gamepad2, Home, Mic, MoreVertical, Check,
  LayoutGrid, BookOpen
} from './IconComponents';

interface AppContentProps {
  config: AppConfig;
  strings: I18nStrings;
  galleryHeight: number;
  onOpenSettings: () => void;
}

type ViewState = 'discovery' | 'search' | 'details';

export const AppContent: React.FC<AppContentProps> = ({ config, strings, galleryHeight, onOpenSettings }) => {
  const [currentView, setCurrentView] = useState<ViewState>('discovery');
  const [previousView, setPreviousView] = useState<ViewState>('discovery');

  // Drag to Scroll Logic for Gallery List (Reused)
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Lightbox Logic (Reused)
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [initialScrollIndex, setInitialScrollIndex] = useState(0);
  const lightboxRef = useRef<HTMLDivElement>(null);

  // Helper to handle banner preview separately if needed, 
  // but for now we'll stick to screenshot index. 
  // If we want to preview banner, we might need a separate state or 
  // include it in the array. 
  // Let's assume for now "Preview Big Image" means opening it in a viewer.
  // We can add a specialized "Banner Preview" mode or just treat it as a single-image lightbox.
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  const openLightbox = (index: number) => {
    if (isDragging) return; 
    setInitialScrollIndex(index);
    setPreviewImage(null); // Clear single image mode
    setLightboxOpen(true);
  };

  const openSinglePreview = (url: string) => {
    if (isDragging) return;
    setPreviewImage(url);
    setLightboxOpen(true);
  };

  useEffect(() => {
    if (lightboxOpen && lightboxRef.current && !previewImage) {
        const width = lightboxRef.current.offsetWidth;
        lightboxRef.current.scrollTo({ left: width * initialScrollIndex, behavior: 'instant' });
    }
  }, [lightboxOpen, initialScrollIndex, previewImage]);

  // Detect language for hardcoded strings
  const isZh = strings.install === '安装';
  const t = {
    searchPlaceholder: isZh ? '搜索应用和游戏' : 'Search apps & games',
    forYou: isZh ? '为您推荐' : 'For you',
    topCharts: isZh ? '排行榜' : 'Top charts',
    children: isZh ? '儿童' : 'Children',
    premium: isZh ? '付费' : 'Premium',
    recommended: isZh ? '为您推荐' : 'Recommended for you',
    games: isZh ? '游戏' : 'Games',
    apps: isZh ? '应用' : 'Apps',
    books: isZh ? '图书' : 'Books',
    search: isZh ? '搜索' : 'Search',
    details: isZh ? '详情' : 'Details',
    ads: isZh ? '广告' : 'Ad',
    newUpdated: isZh ? '新上架和更新' : 'New & Updated',
    suggested: isZh ? '大家都在搜' : 'Suggested for you',
    install: strings.install,
  };

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

  const navigateToDetails = () => {
    setPreviousView(currentView);
    setCurrentView('details');
  };

  const handleBack = () => {
    setCurrentView(previousView);
  };

  // Shared Lightbox Component
  const renderLightbox = () => (
    <AnimatePresence>
      {lightboxOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black"
        >
          {previewImage ? (
             /* Single Image Mode (e.g. Banner) */
             <div 
                className="w-full h-full flex items-center justify-center p-2"
                onClick={() => setLightboxOpen(false)}
             >
                <img 
                    src={previewImage} 
                    alt="Fullscreen Preview" 
                    className="max-h-full max-w-full object-contain shadow-2xl select-none"
                    draggable={false}
                />
             </div>
          ) : (
            /* Gallery Mode (Screenshots) */
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
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  // --- VIEWS ---

  const renderDiscoveryView = () => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="pb-20"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white z-20 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3 bg-[#f1f3f4] rounded-full px-4 py-2.5 shadow-sm mb-3">
          <Menu className="w-5 h-5 text-gray-600" />
          <div 
            className="flex-1 text-gray-500 text-sm cursor-pointer" 
            onClick={() => setCurrentView('search')}
          >
            {t.searchPlaceholder}
          </div>
          <div 
            className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer"
            onClick={onOpenSettings}
          >
            {config.devName ? config.devName.charAt(0).toUpperCase() : 'D'}
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto no-scrollbar text-sm font-medium border-b border-gray-100 pb-2">
            <span className="text-[#01875f] whitespace-nowrap border-b-2 border-[#01875f] pb-2">{t.forYou}</span>
            <span className="text-gray-500 whitespace-nowrap pb-2">{t.topCharts}</span>
            <span className="text-gray-500 whitespace-nowrap pb-2">{t.children}</span>
            <span className="text-gray-500 whitespace-nowrap pb-2">{t.premium}</span>
        </div>
      </div>

      {/* Recommended Section */}
      <div className="px-5 mt-4">
        <div className="flex justify-between items-center mb-3">
             <h2 className="text-lg font-medium text-gray-900">{t.recommended}</h2>
             <MoreVertical className="w-5 h-5 text-gray-400" />
        </div>

        {/* Big Card */}
        <div className="space-y-3 cursor-pointer group" onClick={navigateToDetails}>
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
                    <h3 className="text-base font-medium text-gray-900 truncate">{config.appName || INITIAL_CONFIG.appName}</h3>
                    <div className="text-xs text-gray-500 truncate mt-0.5">
                        {config.tags?.[0] || 'App'} • <span className="flex items-center inline-flex gap-0.5">{config.rating || INITIAL_CONFIG.rating} <Star className="w-2.5 h-2.5 fill-current" /></span>
                    </div>
                </div>
                <button className="h-8 px-4 bg-transparent border border-gray-300 text-[#01875f] rounded-full text-xs font-medium hover:bg-gray-50 self-center">
                    {t.install}
                </button>
             </div>
        </div>

        {/* Mock Rows */}
        <div className="mt-8 space-y-6">
            <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">{t.newUpdated}</h3>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                   {[1, 2, 3].map(i => (
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

  const renderSearchView = () => (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="pb-20 bg-white min-h-full"
    >
        {/* Search Header */}
        <div className="sticky top-0 bg-white z-20 px-2 py-2 flex items-center gap-2 shadow-sm border-b border-gray-100">
            <button onClick={() => setCurrentView('discovery')} className="p-2 text-gray-500">
                <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1 bg-[#f1f3f4] h-10 rounded-full flex items-center px-4 gap-2">
                <span className="flex-1 text-gray-900 text-sm">{config.appName || INITIAL_CONFIG.appName}</span>
                {/* Search icon removed per user request */}
            </div>
            <button className="p-2 text-gray-500">
                <Mic className="w-5 h-5" />
            </button>
        </div>

        {/* Search Result */}
        <div className="px-5 py-4">
             <div className="flex gap-4 cursor-pointer" onClick={navigateToDetails}>
                <img 
                    src={config.logoUrl || INITIAL_CONFIG.logoUrl} 
                    alt="Icon" 
                    className="w-16 h-16 rounded-xl shadow-sm object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="text-base font-medium text-gray-900 truncate">{config.appName || INITIAL_CONFIG.appName}</h3>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        {config.devName || INITIAL_CONFIG.devName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <span className="flex items-center gap-0.5">{config.rating || INITIAL_CONFIG.rating} <Star className="w-2.5 h-2.5 fill-current" /></span>
                        <span>•</span>
                        <span>{config.downloads || INITIAL_CONFIG.downloads}</span>
                    </div>
                </div>
             </div>

             {/* Inline Screenshots */}
             <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar pb-2">
                 {config.screenshots.map((src, idx) => (
                     <div key={idx} className="w-[100px] aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 cursor-pointer" onClick={() => openLightbox(idx)}>
                         <img src={src} className="w-full h-full object-cover" alt="" />
                     </div>
                 ))}
                 {config.screenshots.length === 0 && (
                     <div className="w-full h-24 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-400">
                         No screenshots
                     </div>
                 )}
             </div>

             <button className="w-full mt-4 bg-transparent border border-gray-300 text-[#01875f] font-medium py-2 rounded-full text-sm hover:bg-gray-50">
                {t.install}
             </button>
        </div>
    </motion.div>
  );

  const renderDetailsView = () => {
    return (
    <motion.div 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }} 
        exit={{ opacity: 0, x: 20 }}
        className="pb-8 bg-white min-h-full"
    >
      {/* Top Banner (Feature Graphic) - Toggleable via Logo Click */}
      {showBanner && (
        <div className="w-full aspect-[2/1] bg-gray-100 relative group">
            <img 
                src={config.bannerUrl || INITIAL_CONFIG.bannerUrl} 
                alt="Feature Graphic" 
                className="w-full h-full object-cover"
            />
            {/* Gradient Overlay: Transparent at top -> White at bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white" />
        </div>
      )}

      {/* Standard Header (Restored) */}
      <div className={`sticky top-0 z-20 flex items-center justify-between px-2 py-3 ${showBanner ? 'bg-transparent -mt-[100%] mb-[calc(100%-56px)]' : 'bg-white'}`}>
        <button onClick={handleBack} className="p-2 text-gray-800">
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

      {/* App Header Info */}
      <motion.div 
        layout
        className="px-6 pt-2 mt-0 relative"
      >
        <div className="flex gap-4">
            <img 
                src={config.logoUrl || INITIAL_CONFIG.logoUrl} 
                alt="App Logo" 
                className="w-[72px] h-[72px] rounded-2xl shadow-sm object-cover flex-shrink-0 mt-2 cursor-pointer active:scale-95 transition-transform"
                onClick={() => setShowBanner(!showBanner)}
                title="Click to toggle banner"
            />
            <div className="flex-1 min-w-0 flex flex-col justify-between py-1 mt-2">
                <h1 className="text-2xl font-medium text-gray-900 leading-tight truncate">
                    {config.appName || INITIAL_CONFIG.appName}
                </h1>
                <div className="text-[#01875f] font-medium text-sm truncate">
                    {config.devName || INITIAL_CONFIG.devName}
                </div>
                 <div className="text-gray-500 text-xs truncate mt-1">
                    Contains ads • In-app purchases
                </div>
            </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="flex items-center justify-between px-6 py-6 mt-2">
        <div className="flex flex-col items-center flex-1 border-r border-gray-200 last:border-0">
            <div className="flex items-center font-medium text-gray-800">
                {config.rating || INITIAL_CONFIG.rating} <Star className="w-3 h-3 ml-1 fill-current text-gray-800" />
            </div>
            <div className="text-xs text-gray-500 mt-1">{strings.reviews}</div>
        </div>
        <div className="flex flex-col items-center flex-1 border-r border-gray-200 last:border-0">
            <div className="font-medium text-gray-800">{config.size || INITIAL_CONFIG.size}</div>
            <div className="text-xs text-gray-500 mt-1">Size</div>
        </div>
        <div className="flex flex-col items-center flex-1 border-r border-gray-200 last:border-0">
            <div className="font-medium text-gray-800">{config.ratedFor || INITIAL_CONFIG.ratedFor}</div>
            <div className="text-xs text-gray-500 mt-1">Rated for</div>
        </div>
        <div className="flex flex-col items-center flex-1">
            <div className="font-medium text-gray-800">{config.downloads || INITIAL_CONFIG.downloads}</div>
            <div className="text-xs text-gray-500 mt-1">{strings.downloads}</div>
        </div>
      </div>

      {/* Install Button */}
      <div className="px-6 pb-6">
        <button className="w-full bg-[#01875f] hover:bg-[#017753] active:bg-[#016848] text-white font-medium rounded-full py-2.5 text-sm transition-colors shadow-sm">
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
            {config.description || INITIAL_CONFIG.description}
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
    </motion.div>
    );
  };

  return (
    <div className="bg-white h-full flex flex-col relative overflow-hidden">
       {/* Global Lightbox Overlay */}
       {renderLightbox()}

       <div className="flex-1 overflow-y-auto no-scrollbar relative">
          {currentView === 'discovery' && renderDiscoveryView()}
          {currentView === 'search' && renderSearchView()}
          {currentView === 'details' && renderDetailsView()}
       </div>
       
       {/* Bottom Nav */}
       {(currentView === 'discovery' || currentView === 'search') && (
         <div className="border-t border-gray-200 bg-white flex justify-around py-3 px-2 pb-5 z-30">
            <button 
              className={`flex flex-col items-center gap-1 text-[#01875f] cursor-default`}
            >
               <Gamepad2 className="w-6 h-6 fill-current" />
               <span className="text-xs font-medium">{t.games}</span>
            </button>
             <button 
              className={`flex flex-col items-center gap-1 text-gray-500 cursor-default`}
            >
               <LayoutGrid className="w-6 h-6" />
               <span className="text-xs font-medium">{t.apps}</span>
            </button>
            <button 
              className={`flex flex-col items-center gap-1 text-gray-500 cursor-default`}
            >
               <BookOpen className="w-6 h-6" />
               <span className="text-xs font-medium">{t.books}</span>
            </button>
         </div>
       )}
    </div>
  );
};