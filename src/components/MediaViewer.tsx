import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MOBILE_VIEWPORT } from "../constants";

interface MediaViewerProps {
  isOpen: boolean;
  selectedImage: string | null;
  sourceElement: HTMLElement | null;
  onClose: () => void;
}

const NAV_BAR_HEIGHT = 44;

export function MediaViewer({ isOpen, selectedImage, sourceElement, onClose }: MediaViewerProps) {
  const [dragY, setDragY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);

  // Capture source element bounds when opening
  useEffect(() => {
    if (isOpen && sourceElement) {
      const rect = sourceElement.getBoundingClientRect();
      setSourceRect(rect);
      setDragY(0);
      setIsClosing(false);
      
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSourceRect(null);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, sourceElement]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
  };

  const handleDragEnd = (event: any, info: any) => {
    const dragDistance = Math.abs(info.offset.y);
    
    if (dragDistance > 100) {
      // Close with scale-down animation
      handleClose();
    } else {
      // Reset drag state for scale animation to return to normal
      setDragY(0);
    }
  };

  const handleDrag = (event: any, info: any) => {
    setDragY(info.offset.y);
  };

  const handleAnimationComplete = () => {
    if (isClosing) {
      onClose();
      setIsClosing(false);
    }
  };

  if (!isOpen || !selectedImage) return null;

  // Calculate scale based on drag distance
  const dragScale = Math.max(0.5, 1 - Math.abs(dragY) / 1000);

  return createPortal(
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            animate={{ opacity: dragScale }}
            transition={{ duration: 0.1 }}
            className="absolute inset-0 bg-white"
            onClick={handleClose}
          />

          {/* Top Navigation */}
          <motion.div
            animate={{ opacity: dragScale }}
            transition={{ duration: 0.1 }}
            className="absolute top-0 left-0 right-0 z-10 h-[44px] flex items-center justify-end px-4 bg-gradient-to-b from-black/20 to-transparent"
          >
            <button
              onClick={handleClose}
              className="size-10 flex items-center justify-center rounded-full bg-black/80 backdrop-blur-sm text-white hover:bg-black/90 transition-colors"
              aria-label="Close media viewer"
            >
              <X className="size-5" />
            </button>
          </motion.div>

          {/* Media Container - Using layoutId for shared element transition */}
          <motion.div
            layoutId={isClosing ? undefined : `image-${selectedImage}`}
            drag="y"
            dragElastic={0.3}
            dragConstraints={{ top: -100, bottom: 300 }}
            dragTransition={{ 
              bounceStiffness: 600, 
              bounceDamping: 20,
              power: 0.3,
              timeConstant: 200
            }}
            onDragEnd={handleDragEnd}
            onDrag={handleDrag}
            className="relative w-[90%] max-h-[80%] cursor-grab active:cursor-grabbing"
            style={{
              willChange: 'transform, opacity'
            }}
            animate={{
              scale: dragScale
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
            onAnimationComplete={handleAnimationComplete}
          >
            <ImageWithFallback
              src={selectedImage}
              alt="Media viewer"
              className="w-full h-full object-contain rounded-lg shadow-2xl"
              style={{
                maxHeight: `${MOBILE_VIEWPORT.HEIGHT - 120}px`,
                userSelect: 'none',
                pointerEvents: 'none'
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
