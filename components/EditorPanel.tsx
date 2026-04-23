import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppConfig, Language } from '../types';
import { INITIAL_CONFIG } from '../constants';
import { ImageIcon, Database, X, Settings, Edit3 } from './IconComponents';
import { useDialog } from '../hooks/useDialog';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { CustomDialog } from './editor/CustomDialog';
import { InfoTab } from './editor/InfoTab';
import { VisualTab } from './editor/VisualTab';
import { SchemesTab } from './editor/SchemesTab';

interface EditorPanelProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  lang: Language;
  setLang: (l: Language) => void;
  isOpen: boolean;
  onClose: () => void;
  galleryHeight: number;
  setGalleryHeight: (h: number) => void;
}

type TabId = 'info' | 'visual' | 'schemes';

export const EditorPanel: React.FC<EditorPanelProps> = ({
  config,
  setConfig,
  lang,
  setLang,
  isOpen,
  onClose,
  galleryHeight,
  setGalleryHeight,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('info');
  const { dialog, open: openDialog, close: closeDialog } = useDialog();

  useEscapeKey(isOpen && !dialog.isOpen, onClose);

  const handleResetSection = (section: 'info' | 'store' | 'global') => {
    openDialog({
      type: 'confirm',
      title: '重置设置',
      message: '确定要重置该部分的设置吗？',
      onConfirm: () => {
        if (section === 'info') {
          setConfig((prev) => ({
            ...prev,
            appName: INITIAL_CONFIG.appName,
            devName: INITIAL_CONFIG.devName,
            description: INITIAL_CONFIG.description,
            tags: INITIAL_CONFIG.tags,
          }));
        } else if (section === 'store') {
          setConfig((prev) => ({
            ...prev,
            rating: INITIAL_CONFIG.rating,
            downloads: INITIAL_CONFIG.downloads,
            size: INITIAL_CONFIG.size,
            ratedFor: INITIAL_CONFIG.ratedFor,
          }));
        } else {
          setLang('en');
          setGalleryHeight(160);
        }
        closeDialog();
      },
    });
  };

  const TabButton = ({
    id,
    label,
    icon: Icon,
  }: {
    id: TabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
        activeTab === id
          ? 'border-brand text-brand'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[60]"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="editor-panel-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[480px] bg-white shadow-2xl z-[70] flex flex-col"
          >
            <div className="bg-white z-10 px-6 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] border-b border-gray-100 flex items-center justify-between shrink-0">
              <h2
                id="editor-panel-title"
                className="text-xl font-bold text-gray-800 flex items-center gap-2"
              >
                <Settings className="w-5 h-5 text-brand" />
                配置面板
              </h2>
              <button
                onClick={onClose}
                aria-label="关闭配置面板"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="flex border-b border-gray-200 shrink-0">
              <TabButton id="info" label="信息" icon={Edit3} />
              <TabButton id="visual" label="视觉" icon={ImageIcon} />
              <TabButton id="schemes" label="方案" icon={Database} />
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === 'info' && (
                <InfoTab
                  config={config}
                  setConfig={setConfig}
                  lang={lang}
                  setLang={setLang}
                  galleryHeight={galleryHeight}
                  setGalleryHeight={setGalleryHeight}
                  onReset={handleResetSection}
                />
              )}
              {activeTab === 'visual' && <VisualTab config={config} setConfig={setConfig} />}
              {activeTab === 'schemes' && <SchemesTab config={config} setConfig={setConfig} />}
            </div>
          </motion.div>

          <CustomDialog {...dialog} onClose={closeDialog} />
        </>
      )}
    </AnimatePresence>
  );
};
