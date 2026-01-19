import React from 'react';
import { ArrowLeft, Search, MoreVertical } from './IconComponents';

export const PreviewHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-10 shadow-sm">
      <ArrowLeft className="w-6 h-6 text-gray-700" />
      <div className="flex items-center space-x-4">
        <Search className="w-6 h-6 text-gray-700" />
        <MoreVertical className="w-6 h-6 text-gray-700" />
      </div>
    </div>
  );
};