import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ProductChipProps {
  label: string;
  initialX: number;
  initialY: number;
  isSelected: boolean;
  onSelect: () => void;
  containerWidth: number;
  containerHeight: number;
  showHint?: boolean;
}

export function ProductChip({ 
  label, 
  initialX, 
  initialY, 
  isSelected,
  onSelect,
  containerWidth,
  containerHeight,
  showHint = false
}: ProductChipProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);
  const [hasBeenDragged, setHasBeenDragged] = useState(false);

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
    
    // Track if user has dragged to hide the hint
    if (hasMoved.current) {
      setHasBeenDragged(true);
    }
    
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
      
      {/* Guide message - shows on all chips when hint is enabled */}
      <AnimatePresence>
        {showHint && !isSelected && !isDragging && !hasBeenDragged && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap z-30"
          >
            <div className="bg-black text-white text-xs px-3 py-1.5 rounded-[12px] shadow-lg">
              Tap to select • Drag to move
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 size-2 bg-black rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
