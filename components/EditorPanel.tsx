import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppConfig, Language, I18nStrings, SavedScheme } from '../types';
import { INITIAL_CONFIG } from '../constants';
import { ImageIcon, User, Database, X, ArrowUp, ArrowDown, Trash2, Settings, Edit3, Save, Check, Download, Box, Upload } from './IconComponents';

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

// Reusable Input Component with Clear Button
const InputGroup = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (val: string) => void, placeholder?: string }) => {
    const displayValue = value === placeholder ? "" : value;
    return (
        <div className="space-y-1">
            <label className="text-xs text-gray-500 ml-1">{label}</label>
            <div className="relative group">
                <input 
                    type="text" 
                    value={displayValue} 
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-8 transition-all placeholder:text-gray-400"
                />
                {displayValue && (
                    <button 
                        onClick={() => onChange('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                        title="Clear"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

// Reusable Textarea Component with Clear Button
const TextAreaGroup = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (val: string) => void, placeholder?: string }) => {
    const displayValue = value === placeholder ? "" : value;
    return (
        <div className="space-y-1">
            <label className="text-xs text-gray-500 ml-1">{label}</label>
            <div className="relative group">
                <textarea 
                    value={displayValue} 
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none pr-8 transition-all placeholder:text-gray-400"
                />
                {displayValue && (
                    <button 
                        onClick={() => onChange('')}
                        className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 p-1 bg-white/80 rounded-full"
                        title="Clear"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

// Custom Dialog Component
interface DialogProps {
    isOpen: boolean;
    type: 'confirm' | 'prompt';
    title: string;
    message?: string;
    defaultValue?: string;
    onConfirm: (value?: string) => void;
    onClose: () => void;
}

const CustomDialog = ({ isOpen, type, title, message, defaultValue, onConfirm, onClose }: DialogProps) => {
    const [inputValue, setInputValue] = useState(defaultValue || '');

    useEffect(() => {
        if (isOpen) setInputValue(defaultValue || '');
    }, [defaultValue, isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
                        onClick={onClose} 
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden z-[90]"
                    >
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                            {message && <p className="text-sm text-gray-600 mb-4 leading-relaxed">{message}</p>}
                            
                            {type === 'prompt' && (
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-8"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') onConfirm(inputValue);
                                        }}
                                    />
                                    {inputValue && (
                                        <button 
                                            onClick={() => setInputValue('')}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                            <button 
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                取消
                            </button>
                            <button 
                                onClick={() => onConfirm(type === 'prompt' ? inputValue : undefined)}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#2656C8] hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                            >
                                确认
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

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

  // Dialog State
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    type: 'confirm' | 'prompt';
    title: string;
    message?: string;
    defaultValue?: string;
    onConfirm: (val?: string) => void;
  }>({
    isOpen: false,
    type: 'confirm',
    title: '',
    onConfirm: () => {}
  });

  const closeDialog = () => setDialog(prev => ({ ...prev, isOpen: false }));

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

  const getNextDefaultName = () => {
    const now = new Date();
    const datePart = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
    const prefix = `${datePart}-`;
    
    const existingSuffixes = schemes
        .filter(s => s.name.startsWith(prefix))
        .map(s => s.name.slice(prefix.length));
    
    if (existingSuffixes.length === 0) return `${prefix}A`;

    // Generate A, B, ... Z, AA, AB ...
    let counter = 0;
    while (true) {
        let suffix = "";
        let i = counter;
        // Convert counter to base-26 letters (0->A, 25->Z, 26->AA)
        do {
            suffix = String.fromCharCode(65 + (i % 26)) + suffix;
            i = Math.floor(i / 26) - 1;
        } while (i >= 0);

        if (!existingSuffixes.includes(suffix)) {
            return prefix + suffix;
        }
        counter++;
    }
  };

  const handleRenameScheme = (scheme: SavedScheme) => {
    setDialog({
        isOpen: true,
        type: 'prompt',
        title: '重命名方案',
        message: '请输入新的方案名称',
        defaultValue: scheme.name,
        onConfirm: (newName) => {
            if (!newName || newName === scheme.name) {
                closeDialog();
                return;
            }
            const updatedSchemes = schemes.map(s => 
                s.id === scheme.id ? { ...s, name: newName } : s
            );
            saveSchemesToStorage(updatedSchemes);
            closeDialog();
        }
    });
  };

  const handleSaveScheme = () => {
    const defaultName = getNextDefaultName();
    
    setDialog({
        isOpen: true,
        type: 'prompt',
        title: '保存方案',
        message: '请输入方案名称',
        defaultValue: defaultName,
        onConfirm: (name) => {
            if (!name) return;
            const newScheme: SavedScheme = {
                id: crypto.randomUUID(),
                name,
                config: { ...config },
                savedAt: Date.now()
            };
            saveSchemesToStorage([newScheme, ...schemes]);
            closeDialog();
        }
    });
  };

  const handleDeleteScheme = (id: string) => {
    setDialog({
        isOpen: true,
        type: 'confirm',
        title: '删除方案',
        message: '确定要删除这个方案吗？此操作无法撤销。',
        onConfirm: () => {
            saveSchemesToStorage(schemes.filter(s => s.id !== id));
            closeDialog();
        }
    });
  };

  const handleLoadScheme = (scheme: SavedScheme) => {
    setDialog({
        isOpen: true,
        type: 'confirm',
        title: '加载方案',
        message: `确定要加载 "${scheme.name}" 吗？当前未保存的更改将会丢失。`,
        onConfirm: () => {
            setConfig(scheme.config);
            closeDialog();
        }
    });
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
                                    <InputGroup 
                                        label="应用名称"
                                        value={config.appName}
                                        onChange={(val) => handleInputChange('appName', val)}
                                        placeholder={INITIAL_CONFIG.appName}
                                    />
                                    <InputGroup 
                                        label="开发者名称"
                                        value={config.devName}
                                        onChange={(val) => handleInputChange('devName', val)}
                                        placeholder={INITIAL_CONFIG.devName}
                                    />
                                    
                                    {/* Tag Manager */}
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500 ml-1">应用标签</label>
                                        <div className="flex gap-2 mb-2">
                                            <div className="relative flex-1 group">
                                                <input
                                                    type="text"
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                                                    placeholder="Add tag"
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-8"
                                                />
                                                {tagInput && (
                                                    <button 
                                                        onClick={() => setTagInput('')}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
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

                                    <TextAreaGroup 
                                        label="应用描述"
                                        value={config.description}
                                        onChange={(val) => handleInputChange('description', val)}
                                        placeholder={INITIAL_CONFIG.description}
                                    />
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">商店数据</h3>
                                <div className="grid grid-cols-2 gap-3">
                                     <InputGroup label="评分" value={config.rating} onChange={(val) => handleInputChange('rating', val)} placeholder={INITIAL_CONFIG.rating} />
                                     <InputGroup label="下载量" value={config.downloads} onChange={(val) => handleInputChange('downloads', val)} placeholder={INITIAL_CONFIG.downloads} />
                                     <InputGroup label="应用大小" value={config.size} onChange={(val) => handleInputChange('size', val)} placeholder={INITIAL_CONFIG.size} />
                                     <InputGroup label="分级" value={config.ratedFor} onChange={(val) => handleInputChange('ratedFor', val)} placeholder={INITIAL_CONFIG.ratedFor} />
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
                                <label className="flex-1 cursor-pointer flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 transition-all bg-gray-50 h-32 relative overflow-hidden">
                                    {config.logoUrl && (
                                        <div 
                                            className="absolute inset-0 opacity-10 bg-center bg-no-repeat bg-cover z-0 pointer-events-none"
                                            style={{ backgroundImage: `url(${config.logoUrl})` }} 
                                        />
                                    )}
                                    <div className="relative z-10 flex flex-col items-center">
                                        <Box className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-600 font-medium">应用图标</span>
                                    </div>
                                    <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload('logoUrl', e)} />
                                </label>
                                <label className="flex-1 cursor-pointer flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 transition-all bg-gray-50 h-32 relative overflow-hidden">
                                    {config.bannerUrl && (
                                        <div 
                                            className="absolute inset-0 opacity-10 bg-center bg-no-repeat bg-cover z-0 pointer-events-none"
                                            style={{ backgroundImage: `url(${config.bannerUrl})` }} 
                                        />
                                    )}
                                    <div className="relative z-10 flex flex-col items-center">
                                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-600 font-medium">置顶大图</span>
                                    </div>
                                    <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload('bannerUrl', e)} />
                                </label>
                            </div>

                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-700">截图管理</span>
                                    <label className="cursor-pointer text-xs text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1">
                                        <Upload className="w-4 h-4" />
                                        上传截图
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
                                                <div className="text-xs text-gray-500 truncate">图{idx + 1}</div>
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
                                                        <div className="flex items-center gap-2 group/title">
                                                            <h4 className="font-bold text-gray-800">{scheme.name}</h4>
                                                            <button 
                                                                onClick={() => handleRenameScheme(scheme)} 
                                                                className="opacity-0 group-hover/title:opacity-100 text-gray-400 hover:text-blue-600 transition-opacity"
                                                                title="重命名"
                                                            >
                                                                <Edit3 className="w-3 h-3" />
                                                            </button>
                                                        </div>
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

            {/* Custom Dialog - Rendered at the end for z-index */}
            <CustomDialog 
                isOpen={dialog.isOpen}
                type={dialog.type}
                title={dialog.title}
                message={dialog.message}
                defaultValue={dialog.defaultValue}
                onConfirm={dialog.onConfirm}
                onClose={closeDialog}
            />
        </>
      )}
    </AnimatePresence>
  );
};