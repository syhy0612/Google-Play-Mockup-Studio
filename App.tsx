import React, { useState } from 'react';
import { AppConfig, Language } from './types';
import { INITIAL_CONFIG, DICTIONARY } from './constants';
import { PreviewHeader } from './components/PreviewHeader';
import { AppContent } from './components/AppContent';
import { EditorPanel } from './components/EditorPanel';
// Removed unused icon imports since Status Bar and FAB are gone
import { Edit3 } from './components/IconComponents';

const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>(INITIAL_CONFIG);
  const [lang, setLang] = useState<Language>('en'); // Default to English for Preview content
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [galleryHeight, setGalleryHeight] = useState(160); // v1.9: Default Height 160px

  const strings = DICTIONARY[lang];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-sans overflow-hidden">
      
      {/* Mobile Preview Frame */}
      <div className="relative w-full max-w-[480px] h-[100vh] md:h-[90vh] bg-white md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-300 md:border-gray-800 md:border-[8px]">
        
        {/* v1.8: Status Bar REMOVED for native feel */}
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth relative bg-white flex flex-col">
            <PreviewHeader onOpenSettings={() => setIsEditorOpen(true)} />
            <AppContent 
              config={config} 
              strings={strings} 
              galleryHeight={galleryHeight} 
            />
        </div>

         {/* Android Navigation Bar Mock */}
         <div className="h-6 bg-white shrink-0 flex items-center justify-center pb-2 z-20">
             <div className="w-32 h-1 bg-gray-900 rounded-full opacity-20"></div>
         </div>
      </div>

      {/* v1.8: FAB Removed. Settings triggered by Header Menu. */}

      {/* Editor Drawer */}
      <EditorPanel 
        config={config} 
        setConfig={setConfig} 
        lang={lang}
        setLang={setLang}
        strings={strings}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        galleryHeight={galleryHeight}
        setGalleryHeight={setGalleryHeight}
      />
    </div>
  );
};

export default App;