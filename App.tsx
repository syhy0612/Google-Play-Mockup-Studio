import React, { useState } from 'react';
import { AppConfig, Language } from './types';
import { INITIAL_CONFIG, DICTIONARY } from './constants';
import { PreviewHeader } from './components/PreviewHeader';
import { AppContent } from './components/AppContent';
import { EditorPanel } from './components/EditorPanel';
import { Edit3, Wifi, Battery, Signal } from './components/IconComponents';

const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>(INITIAL_CONFIG);
  const [lang, setLang] = useState<Language>('en'); // Default to English for Preview content
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const strings = DICTIONARY[lang];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-sans overflow-hidden">
      
      {/* Mobile Preview Frame */}
      <div className="relative w-full max-w-[480px] h-[100vh] md:h-[90vh] bg-white md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-300 md:border-gray-800 md:border-[8px]">
        {/* Authentic Status Bar */}
        <div className="h-10 bg-white flex items-center justify-between px-6 select-none shrink-0 z-20 pt-1">
            <span className="text-sm font-medium text-gray-900 tracking-wide">12:30</span>
            <div className="flex gap-1.5 items-center">
                <Signal className="w-4 h-4 text-gray-900" />
                <Wifi className="w-4 h-4 text-gray-900" />
                <Battery className="w-5 h-5 text-gray-900" />
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth relative bg-white">
            <PreviewHeader />
            <AppContent config={config} strings={strings} />
        </div>

         {/* Android Navigation Bar Mock */}
         <div className="h-6 bg-white shrink-0 flex items-center justify-center pb-2 z-20">
             <div className="w-32 h-1 bg-gray-900 rounded-full opacity-20"></div>
         </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={() => setIsEditorOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#2656C8] hover:bg-[#1e45a0] text-white rounded-2xl shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-40"
      >
        <Edit3 className="w-6 h-6" />
      </button>

      {/* Editor Drawer */}
      <EditorPanel 
        config={config} 
        setConfig={setConfig} 
        lang={lang}
        setLang={setLang}
        strings={strings}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />
    </div>
  );
};

export default App;