import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppConfig, Language, I18nStrings, SavedScheme } from '../types';
import { ImageIcon, User, Database, X, ArrowUp, ArrowDown, Trash2, Settings, Edit3, Save, Check, Download } from './IconComponents';

interface EditorPanelProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  lang: Language;
  setLang: (l: Language) => void;
  strings: I18nStrings;
  isOpen: boolean;
  onClose: () => void;
  galleryHeight: number;
  setGalleryHeight: (h: number) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({ 
  config, 
  setConfig, 
  lang, 
  setLang,
  isOpen,
  onClose,
  galleryHeight,
  setGalleryHeight
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'visual' | 'schemes'>('info');
  const [tagInput, setTagInput] = useState("");
  const [schemes, setSchemes] = useState<SavedScheme[]>([]);

  // Load schemes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mockup_schemes');
    if (saved) {
      try {
        setSchemes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse schemes", e);
      }
    }
  }, []);

  const saveSchemesToStorage = (newSchemes: SavedScheme[]) => {
    setSchemes(newSchemes);
    localStorage.setItem('mockup_schemes', JSON.stringify(newSchemes));
  };

  const handleSaveScheme = () => {
    const name = prompt("Enter a name for this scheme:", `${config.appName} - ${new Date().toLocaleDateString()}`);
    if (!name) return;

    const newScheme: SavedScheme = {
      id: crypto.randomUUID(),
      name,
      config: { ...config },
      savedAt: Date.now()
    };

    saveSchemesToStorage([newScheme, ...schemes]);
  };

  const handleDeleteScheme = (id: string) => {
    if (window.confirm("Are you sure you want to delete this scheme?")) {
      saveSchemesToStorage(schemes.filter(s => s.id !== id));
    }
  };

  const handleLoadScheme = (scheme: SavedScheme) => {
    if (window.confirm(`Load scheme "${scheme.name}"? Current unsaved changes will be lost.`)) {
        setConfig(scheme.config);
    }
  };
  
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

  // Tag Management Logic
  const addTag = () => {
    if (tagInput.trim()) {
        setConfig(prev => ({...prev, tags: [...prev.tags, tagInput.trim()]}));
        setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setConfig(prev => ({...prev, tags: prev.tags.filter(t => t !== tagToRemove)}));
  };

  const TabButton = ({ id, label, icon: Icon }: { id: 'info' | 'visual' | 'schemes', label: string, icon: any }) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === id 
            ? 'border-[#2656C8] text-[#2656C8]' 
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
                className="fixed top-0 right-0 bottom-0 w-full md:w-[480px] bg-white shadow-2xl z-[70] flex flex-col"
            >
                {/* Header */}
                <div className="bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-[#2656C8]" />
                        配置面板
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 shrink-0">
                    <TabButton id="info" label="信息" icon={Edit3} />
                    <TabButton id="visual" label="视觉" icon={ImageIcon} />
                    <TabButton id="schemes" label="方案" icon={Database} />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* INFO TAB */}
                    {activeTab === 'info' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                            <section>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">基本信息</h3>
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
                                    
                                    {/* Tag Manager */}
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500 ml-1">应用标签</label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                                                placeholder="Add tag"
                                                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                            <button onClick={addTag} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Add</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {config.tags.map((tag, i) => (
                                                <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                    {tag}
                                                    <button onClick={() => removeTag(tag)} className="ml-1.5 hover:text-blue-900 focus:outline-none">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
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

                            <section>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">商店数据</h3>
                                <div className="grid grid-cols-2 gap-3">
                                     <div className="space-y-1">
                                        <label className="text-xs text-gray-400">评分</label>
                                        <input type="text" value={config.rating} onChange={(e) => handleInputChange('rating', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                                     </div>
                                     <div className="space-y-1">
                                        <label className="text-xs text-gray-400">下载量</label>
                                        <input type="text" value={config.downloads} onChange={(e) => handleInputChange('downloads', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                                     </div>
                                     <div className="space-y-1">
                                        <label className="text-xs text-gray-400">应用大小</label>
                                        <input type="text" value={config.size} onChange={(e) => handleInputChange('size', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                                     </div>
                                     <div className="space-y-1">
                                        <label className="text-xs text-gray-400">分级</label>
                                        <input type="text" value={config.ratedFor} onChange={(e) => handleInputChange('ratedFor', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                                     </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">全局设置</h3>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
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
                                     <div className="pt-2 border-t border-gray-200">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-xs font-bold text-gray-700">截图区域高度</label>
                                            <span className="text-xs text-blue-600 font-mono">{galleryHeight}px</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="100"
                                            max="1000"
                                            step="10"
                                            value={galleryHeight}
                                            onChange={(e) => setGalleryHeight(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                     </div>
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {/* VISUAL TAB */}
                    {activeTab === 'visual' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <div className="flex gap-3">
                                <label className="flex-1 cursor-pointer flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 transition-all bg-gray-50 h-32">
                                    <User className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600 font-medium">上传图标</span>
                                    <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload('logoUrl', e)} />
                                </label>
                                 <label className="flex-1 cursor-pointer flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 transition-all bg-gray-50 h-32">
                                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600 font-medium">上传横幅</span>
                                    <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload('bannerUrl', e)} />
                                </label>
                            </div>

                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-700">截图管理</span>
                                    <label className="cursor-pointer text-xs text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1">
                                        + Add
                                        <input type="file" hidden multiple accept="image/*" onChange={handleScreenshotUpload} />
                                    </label>
                                </div>
                                <div className="p-3 space-y-3 max-h-[500px] overflow-y-auto">
                                    {config.screenshots.length === 0 && (
                                        <div className="text-center py-8 text-sm text-gray-400">暂无截图</div>
                                    )}
                                    {config.screenshots.map((src, idx) => (
                                        <motion.div 
                                            layout
                                            key={`${src}-${idx}`}
                                            className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-100 shadow-sm group"
                                        >
                                            <div className="w-16 h-24 bg-gray-100 rounded flex-shrink-0 overflow-hidden relative border border-gray-200">
                                                <img src={src} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-mono text-gray-400 truncate mb-1">Asset {idx + 1}</div>
                                                <div className="text-xs text-gray-500 truncate">{src.substring(src.lastIndexOf('/')+1, src.lastIndexOf('/')+20)}...</div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button 
                                                    onClick={() => moveScreenshot(idx, -1)}
                                                    disabled={idx === 0}
                                                    className="p-2 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30"
                                                >
                                                    <ArrowUp className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => moveScreenshot(idx, 1)}
                                                    disabled={idx === config.screenshots.length - 1}
                                                    className="p-2 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30"
                                                >
                                                    <ArrowDown className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => deleteScreenshot(idx)}
                                                    className="p-2 hover:bg-red-50 rounded text-red-500 ml-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* SCHEMES TAB */}
                    {activeTab === 'schemes' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                             <button 
                                onClick={handleSaveScheme}
                                className="w-full py-3 bg-[#2656C8] text-white rounded-xl font-medium shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                             >
                                <Save className="w-5 h-5" />
                                保存当前方案
                             </button>

                             <div className="space-y-3">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">已保存的方案</h3>
                                {schemes.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        没有保存的方案
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {schemes.map((scheme) => (
                                            <div key={scheme.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-gray-800">{scheme.name}</h4>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {new Date(scheme.savedAt).toLocaleString()} • {scheme.config.screenshots.length} Assets
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleDeleteScheme(scheme.id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-1">
                                                     <div className="flex -space-x-2 overflow-hidden py-1">
                                                        <img src={scheme.config.logoUrl} className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" alt=""/>
                                                        {scheme.config.screenshots.slice(0, 3).map((s, i) => (
                                                            <img key={i} src={s} className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover bg-gray-100" alt=""/>
                                                        ))}
                                                    </div>
                                                    <div className="flex-1"></div>
                                                    <button 
                                                        onClick={() => handleLoadScheme(scheme)}
                                                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 flex items-center gap-1 transition-colors"
                                                    >
                                                        <Download className="w-3 h-3" /> 加载
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                             </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
