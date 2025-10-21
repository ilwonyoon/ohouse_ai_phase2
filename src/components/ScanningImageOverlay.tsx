import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ProductChip } from "./ProductChip";
import { ANALYSIS_TIMING, PRODUCT_CHIP_ANIMATION } from "../constants";

interface ScanningImageOverlayProps {
  imageUrl: string;
  alt: string;
  currentStepIndex: number;
  elapsedSeconds: number;
  onProductSelect: (product: string | null) => void;
}

// Product recommendations with their positions
const productRecommendations = [
  { label: "Sofa", x: 35, y: 55 },
  { label: "Coffee Table", x: 50, y: 65 },
  { label: "Rug", x: 45, y: 75 },
  { label: "Floor Lamp", x: 20, y: 40 },
];

// Detection points for different steps
const detectionPoints = [
  // Step 0: Analyzing the room - scanning pattern
  [
    { x: 25, y: 30, delay: 0 },
    { x: 50, y: 45, delay: 0.3 },
    { x: 75, y: 35, delay: 0.6 },
    { x: 30, y: 60, delay: 0.9 },
    { x: 65, y: 70, delay: 1.2 },
  ],
  // Step 1: Finding recommendations - product detection
  [
    { x: 20, y: 25, delay: 0 },
    { x: 80, y: 30, delay: 0.2 },
    { x: 45, y: 55, delay: 0.4 },
    { x: 70, y: 65, delay: 0.6 },
    { x: 35, y: 75, delay: 0.8 },
    { x: 60, y: 80, delay: 1.0 },
  ],
  // Step 2: Finalizing - fewer, more precise points
  [
    { x: 40, y: 40, delay: 0 },
    { x: 70, y: 50, delay: 0.3 },
    { x: 50, y: 70, delay: 0.6 },
  ],
];

const INTRO_TOOLTIP_DELAY_MS = 400;
const PLACEMENT_TOOLTIP_AUTO_DISMISS_MS = 2000;

export function ScanningImageOverlay({ 
  imageUrl, 
  alt, 
  currentStepIndex,
  elapsedSeconds,
  onProductSelect
}: ScanningImageOverlayProps) {
  const showScanning = elapsedSeconds < ANALYSIS_TIMING.COMPLETION_THRESHOLD_SECONDS;
  const showProducts = elapsedSeconds >= ANALYSIS_TIMING.COMPLETION_THRESHOLD_SECONDS;
  const points = detectionPoints[currentStepIndex] || detectionPoints[0];
  const [selectedChip, setSelectedChip] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [visibleChips, setVisibleChips] = useState<number>(0);
  const [introTooltipVisible, setIntroTooltipVisible] = useState(false);
  const [placementTooltipVisible, setPlacementTooltipVisible] = useState(false);
  const [hasShownPlacementTooltip, setHasShownPlacementTooltip] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const introTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const placementTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const updateSize = () => {
        setContainerSize({
          width: containerRef.current?.offsetWidth || 0,
          height: containerRef.current?.offsetHeight || 0,
        });
      };
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (introTimerRef.current) {
        clearTimeout(introTimerRef.current);
      }
      if (placementTimerRef.current) {
        clearTimeout(placementTimerRef.current);
      }
    };
  }, []);

  const handleChipSelect = (index: number) => {
    const newSelectedChip = selectedChip === index ? null : index;
    setSelectedChip(newSelectedChip);
    onProductSelect(newSelectedChip !== null ? productRecommendations[index].label : null);
  };

  const finishOnboarding = useCallback(() => {
    if (introTimerRef.current) {
      clearTimeout(introTimerRef.current);
      introTimerRef.current = null;
    }

    if (placementTimerRef.current) {
      clearTimeout(placementTimerRef.current);
      placementTimerRef.current = null;
    }

    setIntroTooltipVisible(false);
    setPlacementTooltipVisible(false);
    setVisibleChips(productRecommendations.length);
    setOnboardingComplete(true);
  }, []);

  const dismissIntroTooltip = useCallback(() => {
    if (introTimerRef.current) {
      clearTimeout(introTimerRef.current);
      introTimerRef.current = null;
    }
    setIntroTooltipVisible(false);
  }, []);

  const handlePrimaryChipDragStart = useCallback(() => {
    if (onboardingComplete) return;
    dismissIntroTooltip();
  }, [dismissIntroTooltip, onboardingComplete]);

  const handlePrimaryChipDragEnd = useCallback(
    (wasMoved: boolean) => {
      if (onboardingComplete || !wasMoved || hasShownPlacementTooltip) {
        return;
      }

      dismissIntroTooltip();
      setHasShownPlacementTooltip(true);
      setPlacementTooltipVisible(true);

      if (placementTimerRef.current) {
        clearTimeout(placementTimerRef.current);
      }

      placementTimerRef.current = window.setTimeout(() => {
        finishOnboarding();
      }, PLACEMENT_TOOLTIP_AUTO_DISMISS_MS);
    },
    [dismissIntroTooltip, finishOnboarding, hasShownPlacementTooltip, onboardingComplete]
  );

  useEffect(() => {
    if (!showProducts) {
      setVisibleChips(0);
      setIntroTooltipVisible(false);
      setPlacementTooltipVisible(false);
      setHasShownPlacementTooltip(false);
      setOnboardingComplete(false);
      if (introTimerRef.current) {
        clearTimeout(introTimerRef.current);
        introTimerRef.current = null;
      }
      if (placementTimerRef.current) {
        clearTimeout(placementTimerRef.current);
        placementTimerRef.current = null;
      }
      return;
    }

    if (onboardingComplete) {
      setVisibleChips(productRecommendations.length);
      return;
    }

    setHasShownPlacementTooltip(false);
    setVisibleChips(1);

    introTimerRef.current = window.setTimeout(() => {
      setIntroTooltipVisible(true);
    }, INTRO_TOOLTIP_DELAY_MS);

    return () => {
      if (introTimerRef.current) {
        clearTimeout(introTimerRef.current);
        introTimerRef.current = null;
      }
    };
  }, [showProducts, onboardingComplete]);

  return (
    <div ref={containerRef} className="relative w-full aspect-[3/4]">
      <ImageWithFallback
        src={imageUrl}
        alt={alt}
        className="size-full object-cover"
      />
      
      {showScanning && (
        <>
          {/* Scanning line effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/80 to-transparent shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              style={{ filter: 'blur(1px)' }}
              animate={{
                top: ['0%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>

          {/* Detection dots */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {points.map((point, index) => (
                <motion.div
                  key={`${currentStepIndex}-${index}`}
                  className="absolute"
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1],
                    opacity: [0, 1, 1],
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: point.delay,
                    ease: "easeOut",
                  }}
                >
                  {/* Outer pulse ring */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      scale: [1, 2, 2],
                      opacity: [0.6, 0.2, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  >
                    <div className="size-6 rounded-full border-2 border-blue-400" />
                  </motion.div>
                  
                  {/* Inner dot */}
                  <motion.div
                    className="size-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                    animate={{
                      scale: [1, 1.3, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Grid overlay for scanning effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div 
              className="size-full"
              style={{
                backgroundImage: `
                  linear-gradient(0deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
              }}
            />
          </motion.div>
        </>
      )}

      {/* Product chips after analysis */}
      {showProducts && (
        <>
          {productRecommendations.map((product, index) => (
            index < visibleChips && (
              <ProductChip
                key={index}
                label={product.label}
                initialX={product.x}
                initialY={product.y}
                isSelected={selectedChip === index}
                onSelect={() => handleChipSelect(index)}
                containerWidth={containerSize.width}
                containerHeight={containerSize.height}
                introTooltipVisible={
                  index === 0 && !onboardingComplete && introTooltipVisible
                }
                onIntroTooltipDismiss={index === 0 ? dismissIntroTooltip : undefined}
                placementTooltipVisible={
                  index === 0 && !onboardingComplete && placementTooltipVisible
                }
                placementTooltipText={`Drop position is where we can place the ${product.label}.`}
                onDragStart={index === 0 ? handlePrimaryChipDragStart : undefined}
                onDragEnd={index === 0 ? handlePrimaryChipDragEnd : undefined}
              />
            )
          ))}
        </>
      )}
    </div>
  );
}
