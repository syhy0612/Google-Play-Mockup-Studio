import React from 'react';
import { Gamepad2, LayoutGrid, BookOpen } from './IconComponents';
import { Language } from '../types';
import { getPreviewExtras } from '../constants/previewExtras';

export const BottomNav: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = getPreviewExtras(lang);
  return (
    <div className="border-t border-gray-200 bg-white flex justify-around py-3 px-2 pb-5 z-30">
      <button className="flex flex-col items-center gap-1 text-brand cursor-default">
        <Gamepad2 className="w-6 h-6 fill-current" />
        <span className="text-xs font-medium">{t.games}</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-gray-500 cursor-default">
        <LayoutGrid className="w-6 h-6" />
        <span className="text-xs font-medium">{t.apps}</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-gray-500 cursor-default">
        <BookOpen className="w-6 h-6" />
        <span className="text-xs font-medium">{t.books}</span>
      </button>
    </div>
  );
};
