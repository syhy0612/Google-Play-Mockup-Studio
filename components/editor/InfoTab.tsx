import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { AppConfig, Language } from '../../types';
import { INITIAL_CONFIG } from '../../constants';
import { InputGroup, TextAreaGroup } from './InputGroup';
import { X, RotateCcw } from '../IconComponents';

interface InfoTabProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  lang: Language;
  setLang: (l: Language) => void;
  galleryHeight: number;
  setGalleryHeight: (h: number) => void;
  onReset: (section: 'info' | 'store' | 'global') => void;
}

export const InfoTab: React.FC<InfoTabProps> = ({
  config,
  setConfig,
  lang,
  setLang,
  galleryHeight,
  setGalleryHeight,
  onReset,
}) => {
  const [tagInput, setTagInput] = useState('');

  const handleInputChange = (field: keyof AppConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !config.tags.includes(newTag)) {
      setConfig((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setConfig((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tagToRemove) }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <section>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex justify-between items-center">
          基本信息
          <button
            onClick={() => onReset('info')}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="重置"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </h3>
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
              <button
                onClick={addTag}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Add
              </button>
            </div>
            <Reorder.Group
              axis="x"
              values={config.tags}
              onReorder={(newTags) => setConfig((prev) => ({ ...prev, tags: newTags }))}
              className="flex flex-wrap gap-2 list-none"
            >
              {config.tags.map((tag) => (
                <Reorder.Item key={tag} value={tag} className="cursor-move">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 select-none">
                    {tag}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTag(tag);
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="ml-1.5 hover:text-blue-900 focus:outline-none cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                </Reorder.Item>
              ))}
            </Reorder.Group>
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
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex justify-between items-center">
          商店数据
          <button
            onClick={() => onReset('store')}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="重置"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <InputGroup
            label="评分"
            value={config.rating}
            onChange={(val) => handleInputChange('rating', val)}
            placeholder={INITIAL_CONFIG.rating}
          />
          <InputGroup
            label="下载量"
            value={config.downloads}
            onChange={(val) => handleInputChange('downloads', val)}
            placeholder={INITIAL_CONFIG.downloads}
          />
          <InputGroup
            label="应用大小"
            value={config.size}
            onChange={(val) => handleInputChange('size', val)}
            placeholder={INITIAL_CONFIG.size}
          />
          <InputGroup
            label="分级"
            value={config.ratedFor}
            onChange={(val) => handleInputChange('ratedFor', val)}
            placeholder={INITIAL_CONFIG.ratedFor}
          />
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex justify-between items-center">
          全局设置
          <button
            onClick={() => onReset('global')}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="重置"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </h3>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">预览语言</span>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                  lang === 'en' ? 'bg-[#2656C8] text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('zh')}
                className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                  lang === 'zh' ? 'bg-[#2656C8] text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
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
  );
};
