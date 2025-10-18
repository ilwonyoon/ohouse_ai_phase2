import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Progress } from "./ui/progress";
import { Heart } from "lucide-react";
import { RenderingItem } from "../types";

interface MyPageContentProps {
  renderingItems: RenderingItem[];
}

export function MyPageContent({ renderingItems }: MyPageContentProps) {
  if (renderingItems.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground px-8 text-center">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Heart className="size-8 text-muted-foreground/50" />
        </div>
        <h3 className="mb-2">No renderings yet</h3>
        <p className="text-sm">
          Your generated interior designs will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-[9px] pb-4">
      {renderingItems.map((item) => (
        <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden">
          {/* Original/Result Image */}
          <ImageWithFallback
            src={item.isComplete && item.resultImage ? item.resultImage : item.originalImage}
            alt={`${item.roomType} rendering`}
            className="size-full object-cover"
          />

          {/* In-Progress Overlay */}
          {!item.isComplete && (
            <>
              {/* Dim overlay */}
              <div className="absolute inset-0 bg-black/40" />
              
              {/* Progress bar in center */}
              <div className="absolute inset-0 flex items-center justify-center px-6">
                <div className="w-full space-y-2">
                  <Progress 
                    value={item.progress} 
                    className="h-1 bg-white/20 [&>[data-slot=progress-indicator]]:bg-white" 
                  />
                  <p className="text-white text-xs text-center font-medium">
                    {Math.round(item.progress)}%
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Room type label */}
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
            <p className="text-white text-xs">
              {item.roomType}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
