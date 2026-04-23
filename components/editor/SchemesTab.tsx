import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AppConfig, SavedScheme } from '../../types';
import {
  addScheme,
  deleteScheme,
  getSchemes,
  StorageError,
  updateScheme,
} from '../../utils/storage';
import { generateUUID } from '../../utils/uuid';
import { Save, Edit3, Trash2, Download } from '../IconComponents';
import { useDialog } from '../../hooks/useDialog';
import { CustomDialog } from './CustomDialog';

interface SchemesTabProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

const getNextDefaultName = (schemes: SavedScheme[]) => {
  const now = new Date();
  const datePart = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
  const prefix = `${datePart}-`;

  const existingSuffixes = schemes
    .filter((s) => s.name.startsWith(prefix))
    .map((s) => s.name.slice(prefix.length));

  if (existingSuffixes.length === 0) return `${prefix}A`;

  let counter = 0;
  while (true) {
    let suffix = '';
    let i = counter;
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

export const SchemesTab: React.FC<SchemesTabProps> = ({ config, setConfig }) => {
  const [schemes, setSchemes] = useState<SavedScheme[]>([]);
  const { dialog, open: openDialog, close: closeDialog } = useDialog();

  useEffect(() => {
    setSchemes(getSchemes());
  }, []);

  const showError = (title: string, e: unknown) => {
    const message =
      e instanceof StorageError ? e.message : `${title}失败: ${(e as Error).message ?? String(e)}`;
    openDialog({
      type: 'alert',
      title,
      message,
      onConfirm: closeDialog,
    });
  };

  const handleSave = () => {
    openDialog({
      type: 'prompt',
      title: '保存方案',
      message: '请输入方案名称',
      defaultValue: getNextDefaultName(schemes),
      onConfirm: (name) => {
        if (!name) return;
        const newScheme: SavedScheme = {
          id: generateUUID(),
          name,
          config: { ...config },
          savedAt: Date.now(),
        };
        const previous = schemes;
        setSchemes([newScheme, ...schemes]);
        try {
          addScheme(newScheme);
          closeDialog();
        } catch (e) {
          setSchemes(previous);
          showError('保存', e);
        }
      },
    });
  };

  const handleRename = (scheme: SavedScheme) => {
    openDialog({
      type: 'prompt',
      title: '重命名方案',
      message: '请输入新的方案名称',
      defaultValue: scheme.name,
      onConfirm: (newName) => {
        if (!newName || newName === scheme.name) {
          closeDialog();
          return;
        }
        const updated = { ...scheme, name: newName };
        const previous = schemes;
        setSchemes(schemes.map((s) => (s.id === scheme.id ? updated : s)));
        try {
          updateScheme(updated);
          closeDialog();
        } catch (e) {
          setSchemes(previous);
          showError('重命名', e);
        }
      },
    });
  };

  const handleDelete = (id: string) => {
    openDialog({
      type: 'confirm',
      title: '删除方案',
      message: '确定要删除这个方案吗？此操作无法撤销。',
      onConfirm: () => {
        const previous = schemes;
        setSchemes(schemes.filter((s) => s.id !== id));
        try {
          deleteScheme(id);
          closeDialog();
        } catch (e) {
          setSchemes(previous);
          showError('删除', e);
        }
      },
    });
  };

  const handleUpdate = (scheme: SavedScheme) => {
    openDialog({
      type: 'confirm',
      title: '更新方案',
      message: `确定要用当前配置覆盖 "${scheme.name}" 吗？此操作无法撤销。`,
      onConfirm: () => {
        const updated = { ...scheme, config: { ...config }, savedAt: Date.now() };
        const previous = schemes;
        setSchemes(schemes.map((s) => (s.id === scheme.id ? updated : s)));
        try {
          updateScheme(updated);
          closeDialog();
        } catch (e) {
          setSchemes(previous);
          showError('更新', e);
        }
      },
    });
  };

  const handleLoad = (scheme: SavedScheme) => {
    openDialog({
      type: 'confirm',
      title: '加载方案',
      message: `确定要加载 "${scheme.name}" 吗？当前未保存的更改将会丢失。`,
      onConfirm: () => {
        setConfig(scheme.config);
        closeDialog();
      },
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <button
          onClick={handleSave}
          className="w-full py-3 bg-brand text-white rounded-xl font-medium shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:bg-brand-hover transition-all flex items-center justify-center gap-2"
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
                <div
                  key={scheme.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 group/title">
                        <h4 className="font-bold text-gray-800">{scheme.name}</h4>
                        <button
                          onClick={() => handleRename(scheme)}
                          className="opacity-0 group-hover/title:opacity-100 text-gray-400 hover:text-blue-600 transition-opacity"
                          title="重命名"
                          aria-label={`重命名 ${scheme.name}`}
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(scheme.savedAt).toLocaleString()} • 应用截图*
                        {scheme.config.screenshots.length}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(scheme.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label={`删除 ${scheme.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-1">
                    <div className="flex -space-x-2 overflow-hidden py-1">
                      <img
                        src={scheme.config.logoUrl}
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                        alt=""
                      />
                      {scheme.config.screenshots.slice(0, 3).map((s) => (
                        <img
                          key={s}
                          src={s}
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover bg-gray-100"
                          alt=""
                        />
                      ))}
                    </div>
                    <div className="flex-1" />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(scheme)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 flex items-center gap-1 transition-colors"
                        title="保存当前配置覆盖此方案"
                      >
                        <Save className="w-3 h-3" /> 保存
                      </button>
                      <button
                        onClick={() => handleLoad(scheme)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3 h-3" /> 加载
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <CustomDialog {...dialog} onClose={closeDialog} />
    </>
  );
};
