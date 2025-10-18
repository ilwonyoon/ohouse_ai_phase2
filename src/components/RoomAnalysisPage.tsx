import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { ScanningImageOverlay } from "./ScanningImageOverlay";
import { ProcessingIndicator } from "./ProcessingIndicator";
import { ProductBottomSheet } from "./ProductBottomSheet";
import { RenderingQueueIndicator } from "./RenderingQueueIndicator";
import { ANALYSIS_TIMING } from "../constants";

interface RoomAnalysisPageProps {
  roomType: string;
  imageUrl: string;
  onBack: () => void;
  onAddRenderingRequest: (originalImage: string, roomType: string) => void;
  renderingQueueCount: number;
  renderingQueueProgress: number;
  completedCount: number;
  onRenderingStatusClick: () => void;
  analysisCompleted: boolean;
  onAnalysisComplete: () => void;
}

export function RoomAnalysisPage({ 
  roomType, 
  imageUrl, 
  onBack, 
  onAddRenderingRequest, 
  renderingQueueCount, 
  renderingQueueProgress, 
  completedCount, 
  onRenderingStatusClick,
  analysisCompleted,
  onAnalysisComplete
}: RoomAnalysisPageProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(analysisCompleted ? ANALYSIS_TIMING.TOTAL_DURATION_SECONDS : 0);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    // If analysis is already completed, don't restart the timer
    if (analysisCompleted) {
      setElapsedSeconds(ANALYSIS_TIMING.TOTAL_DURATION_SECONDS); // Set to completed state
      return;
    }

    // Reset timer when component mounts or image changes
    setElapsedSeconds(0);
    
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [imageUrl, analysisCompleted]); // Reset when image changes

  // Separate effect to mark analysis as complete
  useEffect(() => {
    if (elapsedSeconds >= ANALYSIS_TIMING.COMPLETION_THRESHOLD_SECONDS && !analysisCompleted) {
      onAnalysisComplete();
    }
  }, [elapsedSeconds, analysisCompleted, onAnalysisComplete]);

  // Determine which step to show
  const currentStepIndex = Math.min(Math.floor(elapsedSeconds / ANALYSIS_TIMING.STEP_DURATION_SECONDS), 2);

  return (
    <div className="size-full flex flex-col bg-background">
      {/* iOS Top Navigation Bar */}
      <div className="h-[44px] bg-background border-b border-border flex items-center px-4 shrink-0 relative">
        <button 
          onClick={onBack}
          className="size-8 flex items-center justify-center -ml-2"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="flex-1 text-[17px] font-semibold tracking-[-0.41px] text-center -ml-8">
          {roomType?.toLowerCase() ?? "Room"} refresh
        </h1>
        <div className="absolute right-4">
          <RenderingQueueIndicator 
            count={renderingQueueCount} 
            progress={renderingQueueProgress}
            completedCount={completedCount}
            onClick={onRenderingStatusClick}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Image with scanning overlay */}
        <ScanningImageOverlay
          imageUrl={imageUrl}
          alt={`${roomType} to analyze`}
          currentStepIndex={currentStepIndex}
          elapsedSeconds={elapsedSeconds}
          onProductSelect={setSelectedProduct}
        />

        {/* Processing Indicator */}
        <ProcessingIndicator elapsedSeconds={elapsedSeconds} />
      </div>

      {/* Product Bottom Sheet */}
      <ProductBottomSheet
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        category={selectedProduct || ""}
        onPlaceProduct={() => onAddRenderingRequest(imageUrl, roomType)}
        isRendering={renderingQueueCount > 0}
      />
    </div>
  );
}
