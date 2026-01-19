import React from 'react';
import { ArrowLeft, Search, MoreVertical } from './IconComponents';

interface PreviewHeaderProps {
  onOpenSettings: () => void;
}

export const PreviewHeader: React.FC<PreviewHeaderProps> = ({ onOpenSettings }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-10 shadow-sm shrink-0">
      <ArrowLeft className="w-6 h-6 text-gray-700" />
      <div className="flex items-center space-x-4">
        <Search className="w-6 h-6 text-gray-700" />
        <button 
          onClick={onOpenSettings}
          className="p-1 -mr-1 rounded-full active:bg-gray-100 transition-colors"
        >
          <MoreVertical className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
};