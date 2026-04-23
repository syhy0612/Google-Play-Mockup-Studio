import { useRef, useState } from 'react';

export const useDragScroll = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    setIsDragging(true);
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
  };

  const onMouseLeave = () => setIsDragging(false);

  const onMouseUp = (e: React.MouseEvent) => {
    if (!ref.current) {
      setIsDragging(false);
      return;
    }
    const x = e.pageX - ref.current.offsetLeft;
    if (Math.abs(x - startX.current) >= 5) {
      e.stopPropagation();
    }
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    ref.current.scrollLeft = scrollLeft.current - walk;
  };

  return {
    ref,
    isDragging,
    handlers: { onMouseDown, onMouseLeave, onMouseUp, onMouseMove },
  };
};
