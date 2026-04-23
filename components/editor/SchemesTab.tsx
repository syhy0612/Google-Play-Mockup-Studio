import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AppConfig, Language } from '../../types';
import { UI_STRINGS } from '../../constants';
import { StorageError } from '../../utils/storage';
import {
  addScheme,
  deleteScheme,
  getSchemes,
  updateScheme,
} from '../../utils/storage';
import { generateUUID } from '../../utils/uuid';
import { Save, Edit3, Trash2, Download } from '../IconComponents';
import { useDialog } from '../../hooks/useDialog';
import { CustomDialog } from './CustomDialog';

interface SchemesTabProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  lang: Language;
}

export const SchemesTab: React.FC<SchemesTabProps> = ({ config, setConfig, lang }) => {
  const ui = UI_STRINGS[lang];
  const [schemes, setSchemes] = useState<import('../../types').SavedScheme[]>([]);
  const { dialog, open: openDialog, close: closeDialog } = useDialog();

  useEffect(() => {
    setSchemes(getSchemes());
  }, []);

  const showError = (msg: string, e: unknown) => {
    openDialog({
      type: 'alert',
      title: msg,
      message: e instanceof StorageError ? e.message : `${(e as Error).message ?? String(e)}`,
      onConfirm: closeDialog,
    });
  };

  const handleSave = () => {
    openDialog({
      type: 'prompt',
      title: ui.saveScheme,
      message: ui.saveSchemeMsg,
      defaultValue: getNextDefaultName(schemes),
      onConfirm: (name) => {
        if (!name) return;
        const newScheme = {
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
          showError(ui.saveFailed, e);
        }
      },
    });
  };

  const handleRename = (scheme: import('../../types').SavedScheme) => {
    openDialog({
      type: 'prompt',
      title: ui.renameScheme,
      message: ui.renameSchemeMsg,
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
          showError(ui.renameFailed, e);
        }
      },
    });
  };

  const handleDelete = (id: string) => {
    openDialog({
      type: 'confirm',
      title: ui.deleteScheme,
      message: ui.deleteSchemeMsg,
      onConfirm: () => {
        const previous = schemes;
        setSchemes(schemes.filter((s) => s.id !== id));
        try {
          deleteScheme(id);
          closeDialog();
        } catch (e) {
          setSchemes(previous);
          showError(ui.deleteFailed, e);
        }
      },
    });
  };

  const handleUpdate = (scheme: import('../../types').SavedScheme) => {
    openDialog({
      type: 'confirm',
      title: ui.updateScheme,
      message: ui.updateSchemeMsg.replace('{name}', scheme.name),
      onConfirm: () => {
        const updated = { ...scheme, config: { ...config }, savedAt: Date.now() };
        const previous = schemes;
        setSchemes(schemes.map((s) => (s.id === scheme.id ? updated : s)));
        try {
          updateScheme(updated);
          closeDialog();
        } catch (e) {
          setSchemes(previous);
          showError(ui.updateFailed, e);
        }
      },
    });
  };

  const handleLoad = (scheme: import('../../types').SavedScheme) => {
    openDialog({
      type: 'confirm',
      title: ui.loadScheme,
      message: ui.loadSchemeMsg.replace('{name}', scheme.name),
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
          {ui.saveCurrentScheme}
        </button>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{ui.savedSchemes}</h3>
          {schemes.length === 0 ? (
            <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              {ui.noSavedSchemes}
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
                          title={ui.rename}
                          aria-label={`${ui.rename} ${scheme.name}`}
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(scheme.savedAt).toLocaleString()} • {scheme.config.screenshots.length} {ui.schemeScreenshots}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(scheme.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label={`${ui.delete} ${scheme.name}`}
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
                        title={ui.save}
                      >
                        <Save className="w-3 h-3" /> {ui.save}
                      </button>
                      <button
                        onClick={() => handleLoad(scheme)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3 h-3" /> {ui.load}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <CustomDialog {...dialog} onClose={closeDialog} ui={ui} />
    </>
  );
};

function getNextDefaultName(schemes: import('../../types').SavedScheme[]) {
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
}