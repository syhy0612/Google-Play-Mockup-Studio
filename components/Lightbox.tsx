import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEscapeKey } from '../hooks/useEscapeKey';

interface LightboxProps {
  open: boolean;
  screenshots: string[];
  initialIndex: number;
  singleImage: string | null;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  open,
  screenshots,
  initialIndex,
  singleImage,
  onClose,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEscapeKey(open, onClose);

  useEffect(() => {
    if (open && ref.current && !singleImage) {
      const width = ref.current.offsetWidth;
      ref.current.scrollTo({ left: width * initialIndex, behavior: 'instant' });
    }
  }, [open, initialIndex, singleImage]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black"
        >
          {singleImage ? (
            <div
              className="w-full h-full flex items-center justify-center p-2"
              onClick={onClose}
            >
              <img
                src={singleImage}
                alt="Fullscreen Preview"
                className="max-h-full max-w-full object-contain shadow-2xl select-none"
                draggable={false}
              />
            </div>
          ) : (
            <div
              ref={ref}
              className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar items-center"
            >
              {screenshots.map((src, idx) => (
                <div
                  key={src}
                  className="min-w-full h-full flex items-center justify-center snap-center p-2"
                  onClick={onClose}
                >
                  <img
                    src={src}
                    alt={`Fullscreen ${idx + 1}`}
                    className="max-h-full max-w-full object-contain shadow-2xl select-none"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
