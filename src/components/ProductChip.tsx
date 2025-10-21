import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ProductChipProps {
  label: string;
  initialX: number;
  initialY: number;
  isSelected: boolean;
  onSelect: () => void;
  containerWidth: number;
  containerHeight: number;
  introTooltipVisible?: boolean;
  onIntroTooltipDismiss?: () => void;
  placementTooltipVisible?: boolean;
  placementTooltipText?: string;
  onDragStart?: () => void;
  onDragEnd?: (wasMoved: boolean) => void;
}

export function ProductChip({
  label,
  initialX,
  initialY,
  isSelected,
  onSelect,
  containerWidth,
  containerHeight,
  introTooltipVisible = false,
  onIntroTooltipDismiss,
  placementTooltipVisible = false,
  placementTooltipText,
  onDragStart,
  onDragEnd,
}: ProductChipProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    hasMoved.current = false;
    
    const rect = e.currentTarget.getBoundingClientRect();
    dragStartPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    onDragStart?.();
    onIntroTooltipDismiss?.();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragRef.current) return;
    
    hasMoved.current = true;
    
    const parent = dragRef.current.parentElement;
    if (!parent) return;
    
    const parentRect = parent.getBoundingClientRect();
    const chipWidth = dragRef.current.offsetWidth;
    const chipHeight = dragRef.current.offsetHeight;
    
    let newX = ((e.clientX - parentRect.left - dragStartPos.current.x) / parentRect.width) * 100;
    let newY = ((e.clientY - parentRect.top - dragStartPos.current.y) / parentRect.height) * 100;
    
    // Keep chip within bounds
    newX = Math.max(0, Math.min(newX, 100 - (chipWidth / parentRect.width) * 100));
    newY = Math.max(0, Math.min(newY, 100 - (chipHeight / parentRect.height) * 100));
    
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    onDragEnd?.(hasMoved.current);

    // Only toggle selection if we didn't drag (just tapped)
    if (!hasMoved.current) {
      onSelect();
    }
  };

  return (
    <div
      ref={dragRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="absolute touch-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isSelected ? 20 : 10,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={`h-[40px] px-4 rounded-full flex items-center shadow-lg transition-all ${
          isSelected
            ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2'
            : 'bg-white text-gray-900'
        }`}
      >
        <span className="text-sm whitespace-nowrap">{label}</span>
      </motion.div>
      <AnimatePresence>
        {introTooltipVisible && (
          <motion.div
            key="intro-tooltip"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2"
          >
            <div
              className="relative max-w-[250px] text-center text-xs text-white shadow-lg"
              role="status"
              aria-live="polite"
            >
              <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full h-0 w-0 border-x-[9px] border-x-transparent border-b-[9px] border-b-black" />
              <div className="rounded-full bg-black px-4 py-2 leading-snug">
                Drag this chip to move it around.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {placementTooltipVisible && (
          <motion.div
            key="placement-tooltip"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2"
          >
            <div
              className="relative max-w-[250px] text-center text-xs text-white shadow-lg"
              role="status"
              aria-live="polite"
            >
              <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full h-0 w-0 border-x-[9px] border-x-transparent border-b-[9px] border-b-black" />
              <div className="rounded-full bg-black px-4 py-2 leading-snug">
                {placementTooltipText ?? "Drop position determines where the product is placed."}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
