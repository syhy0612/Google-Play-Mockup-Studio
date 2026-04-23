import React from 'react';
import { motion } from 'framer-motion';
import { AppConfig } from '../../types';
import { compressImage, fileToBase64 } from '../../utils/image';
import { Box, ImageIcon, Upload, ArrowUp, ArrowDown, Trash2 } from '../IconComponents';

interface VisualTabProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

export const VisualTab: React.FC<VisualTabProps> = ({ config, setConfig }) => {
  const handleImageUpload = async (
    field: 'logoUrl' | 'bannerUrl',
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      const compressed = await compressImage(
        base64,
        field === 'bannerUrl' ? 1280 : 512,
        0.8,
      );
      setConfig((prev) => ({ ...prev, [field]: compressed }));
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    try {
      const rawBase64s = await Promise.all(Array.from(files).map(fileToBase64));
      const newScreenshots = await Promise.all(
        rawBase64s.map((b64) => compressImage(b64, 720, 0.7)),
      );
      setConfig((prev) => ({
        ...prev,
        screenshots: [...prev.screenshots, ...newScreenshots],
      }));
    } catch (error) {
      console.error('Error processing screenshots:', error);
    }
  };

  const moveScreenshot = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= config.screenshots.length) return;
    const next = [...config.screenshots];
    [next[index], next[target]] = [next[target], next[index]];
    setConfig((prev) => ({ ...prev, screenshots: next }));
  };

  const deleteScreenshot = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
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
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => handleImageUpload('logoUrl', e)}
          />
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
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => handleImageUpload('bannerUrl', e)}
          />
        </label>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <span className="text-sm font-bold text-gray-700">截图管理</span>
          <label className="cursor-pointer text-xs text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1">
            <Upload className="w-4 h-4" />
            上传截图
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleScreenshotUpload}
            />
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
  );
};
