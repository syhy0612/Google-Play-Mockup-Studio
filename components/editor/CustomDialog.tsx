import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from '../IconComponents';
import { UIStrings } from '../../constants';

export type DialogType = 'confirm' | 'prompt' | 'alert';

export interface DialogState {
  isOpen: boolean;
  type: DialogType;
  title: string;
  message?: string;
  defaultValue?: string;
  onConfirm: (value?: string) => void;
}

interface CustomDialogProps extends DialogState {
  onClose: () => void;
  ui: UIStrings;
}

export const CustomDialog: React.FC<CustomDialogProps> = ({
  isOpen,
  title,
  message,
  defaultValue,
  onConfirm,
  onClose,
  ui,
}) => {
  const [inputValue, setInputValue] = useState(defaultValue || '');

  useEffect(() => {
    if (isOpen) setInputValue(defaultValue || '');
  }, [defaultValue, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const titleId = 'dialog-title';
  const descId = 'dialog-desc';

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={message ? descId : undefined}
          className="fixed inset-0 z-[80] flex items-center justify-center px-4"
        >
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
              <h3 id={titleId} className="text-lg font-bold text-gray-900 mb-2">
                {title}
              </h3>
              {message && (
                <p id={descId} className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {message}
                </p>
              )}

              {defaultValue !== undefined && (
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
                      aria-label="Clear"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
              {defaultValue !== undefined && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {ui.cancel}
                </button>
              )}
              <button
                onClick={() => onConfirm(inputValue || undefined)}
                autoFocus
                className="px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand-hover rounded-lg shadow-sm transition-colors"
              >
                {ui.confirm}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};