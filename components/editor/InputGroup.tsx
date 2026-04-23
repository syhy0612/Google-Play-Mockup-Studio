import React from 'react';
import { X } from '../IconComponents';

interface FieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const InputGroup: React.FC<FieldProps> = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-1">
    <label className="text-xs text-gray-500 ml-1">{label}</label>
    <div className="relative group">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-8 transition-all placeholder:text-gray-400"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          aria-label="Clear"
          title="Clear"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
);

export const TextAreaGroup: React.FC<FieldProps> = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-1">
    <label className="text-xs text-gray-500 ml-1">{label}</label>
    <div className="relative group">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none pr-8 transition-all placeholder:text-gray-400"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 p-1 bg-white/80 rounded-full"
          aria-label="Clear"
          title="Clear"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
);
