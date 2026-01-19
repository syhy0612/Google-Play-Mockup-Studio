import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppConfig, Language, I18nStrings } from '../types';
import { ImageIcon, Smartphone, User, Database, X, ArrowUp, ArrowDown, Trash2, Settings, Edit3 } from './IconComponents';

interface EditorPanelProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  lang: Language;
  setLang: (l: Language) => void;
  strings: I18nStrings;
  isOpen: boolean;
  onClose: () => void;
}

// NOTE: Editor UI is STATIC CHINESE per v1.5 requirements.
export const EditorPanel: React.FC<EditorPanelProps> = ({ 
  config, 
  setConfig, 
  lang, 
  setLang,
  isOpen,
  onClose
}) => {
  
  const handleInputChange = (field: keyof AppConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (field: 'logoUrl' | 'bannerUrl', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setConfig(prev => ({ ...prev, [field]: url }));
    }
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newScreenshots = Array.from(e.target.files).map((file: File) => URL.createObjectURL(file));
      setConfig(prev => ({ ...prev, screenshots: [...prev.screenshots, ...newScreenshots] }));
    }
  };

  const moveScreenshot = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= config.screenshots.length) return;
    const newScreenshots = [...config.screenshots];
    const temp = newScreenshots[index];
    newScreenshots[index] = newScreenshots[index + direction];
    newScreenshots[index + direction] = temp;
    setConfig(prev => ({ ...prev, screenshots: newScreenshots }));
  };

  const deleteScreenshot = (index: number) => {
    setConfig(prev => ({ 
      ...prev, 
      screenshots: prev.screenshots.filter((_, i) => i !== index) 
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black z-[60]"
            />
            
            {/* Drawer */}
            <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-full md:w-[480px] bg-white shadow-2xl z-[70] overflow-y-auto"
            >
                <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-[#2656C8]" />
                        配置面板
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    
                    {/* Language & Version */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                         <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">预览语言</span>
                            <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white">
                                <button 
                                    onClick={() => setLang('en')}
                                    className={`px-3 py-1.5 text-xs font-bold transition-colors ${lang === 'en' ? 'bg-[#2656C8] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    EN
                                </button>
                                <button 
                                    onClick={() => setLang('zh')}
                                    className={`px-3 py-1.5 text-xs font-bold transition-colors ${lang === 'zh' ? 'bg-[#2656C8] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    中文
                                </button>
                            </div>
                         </div>
                         <div className="mt-2 text-xs text-right text-gray-400">
                             Google Play Simulator v1.5
                         </div>
                    </div>

                    {/* Basic Info Section */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Edit3 className="w-4 h-4" /> 基本信息
                        </h3>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500 ml-1">应用名称</label>
                                <input 
                                    type="text" 
                                    value={config.appName} 
                                    onChange={(e) => handleInputChange('appName', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500 ml-1">开发者名称</label>
                                <input 
                                    type="text" 
                                    value={config.devName} 
                                    onChange={(e) => handleInputChange('devName', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                             <div className="space-y-1">
                                <label className="text-xs text-gray-500 ml-1">应用描述</label>
                                <textarea 
                                    value={config.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Metrics Section */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Database className="w-4 h-4" /> 商店数据
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                             <div className="space-y-1">
                                <label className="text-xs text-gray-400">评分</label>
                                <input type="text" value={config.rating} onChange={(e) => handleInputChange('rating', e.target.value)} placeholder="4.5" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                             </div>
                             <div className="space-y-1">
                                <label className="text-xs text-gray-400">下载量</label>
                                <input type="text" value={config.downloads} onChange={(e) => handleInputChange('downloads', e.target.value)} placeholder="1B+" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                             </div>
                             <div className="space-y-1">
                                <label className="text-xs text-gray-400">应用大小</label>
                                <input type="text" value={config.size} onChange={(e) => handleInputChange('size', e.target.value)} placeholder="45 MB" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                             </div>
                             <div className="space-y-1">
                                <label className="text-xs text-gray-400">分级</label>
                                <input type="text" value={config.ratedFor} onChange={(e) => handleInputChange('ratedFor', e.target.value)} placeholder="3+" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                             </div>
                        </div>
                    </section>

                    {/* Visual Assets Section */}
                    <section>
                         <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> 视觉素材
                        </h3>
                        
                        {/* Logo & Banner Upload */}
                        <div className="flex gap-3 mb-4">
                            <label className="flex-1 cursor-pointer flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl p-3 hover:border-blue-500 hover:bg-blue-50 transition-all bg-gray-50">
                                <User className="w-5 h-5 text-gray-400 mb-1" />
                                <span className="text-xs text-gray-600 font-medium">上传图标</span>
                                <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload('logoUrl', e)} />
                            </label>
                             <label className="flex-1 cursor-pointer flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl p-3 hover:border-blue-500 hover:bg-blue-50 transition-all bg-gray-50">
                                <ImageIcon className="w-5 h-5 text-gray-400 mb-1" />
                                <span className="text-xs text-gray-600 font-medium">上传横幅</span>
                                <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload('bannerUrl', e)} />
                            </label>
                        </div>

                        {/* Smart Asset Manager */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-700">截图管理</span>
                                <label className="cursor-pointer text-xs text-blue-600 font-bold hover:text-blue-800">
                                    + 添加截图
                                    <input type="file" hidden multiple accept="image/*" onChange={handleScreenshotUpload} />
                                </label>
                            </div>
                            <div className="p-2 space-y-2 max-h-[300px] overflow-y-auto">
                                {config.screenshots.length === 0 && (
                                    <div className="text-center py-4 text-xs text-gray-400">暂无截图</div>
                                )}
                                {config.screenshots.map((src, idx) => (
                                    <motion.div 
                                        layout
                                        key={`${src}-${idx}`}
                                        className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-100 shadow-sm group"
                                    >
                                        <div className="w-12 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden relative">
                                            <img src={src} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 text-xs text-gray-500 font-mono truncate">
                                            Asset_{idx + 1}.png
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => moveScreenshot(idx, -1)}
                                                disabled={idx === 0}
                                                className="p-1.5 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30"
                                            >
                                                <ArrowUp className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => moveScreenshot(idx, 1)}
                                                disabled={idx === config.screenshots.length - 1}
                                                className="p-1.5 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30"
                                            >
                                                <ArrowDown className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => deleteScreenshot(idx)}
                                                className="p-1.5 hover:bg-red-50 rounded text-red-500 ml-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                     <div className="h-10" />
                </div>
            </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};