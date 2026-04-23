import React from 'react';

interface DemoBadgeProps {
  visible: boolean;
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({ visible }) => {
  if (!visible) return null;
  return (
    <div
      className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 px-2.5 py-1 bg-black/55 text-white text-[10px] leading-none rounded-full backdrop-blur-sm pointer-events-none whitespace-nowrap select-none tracking-wide"
      aria-hidden="true"
    >
      Preview Demo · Not affiliated with Google
    </div>
  );
};
