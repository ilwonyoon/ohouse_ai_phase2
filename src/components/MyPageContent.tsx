import React, { useState } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Progress } from "./ui/progress";
import { Sparkles } from "lucide-react";
import { RenderingItem } from "../types";
import { RoomTypeChip } from "./RoomTypeChip";
import { Button } from "./ui/button";

interface MyPageContentProps {
  renderingItems: RenderingItem[];
  onCreateRoom: (roomType: string) => void;
  onImageClick?: (imageUrl: string, element: HTMLElement) => void;
}

const ROOM_TYPES = [
  "Living room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Home Office",
  "Dining"
];

export function MyPageContent({ renderingItems, onCreateRoom, onImageClick }: MyPageContentProps) {
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string>("All");

  // Filter rendering items based on selected room type
  const filteredItems = selectedRoomFilter === "All"
    ? renderingItems
    : renderingItems.filter(item => item.roomType === selectedRoomFilter);

  // Render empty state when no renderings at all
  if (renderingItems.length === 0 && selectedRoomFilter === "All") {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground px-8 text-center">
        {/* Icon - 20px (2xl) spacing below */}
        <div className="size-16 rounded-full bg-purple-100 flex items-center justify-center" style={{ marginBottom: '20px' }}>
          <Sparkles className="size-8 text-purple-500" />
        </div>

        {/* Heading - xl (20px) + semibold, 12px (lg) spacing below */}
        <h3 className="text-xl font-semibold" style={{ marginBottom: '12px' }}>
          No renderings yet
        </h3>

        {/* Description - base (16px) + regular, 20px (2xl) spacing below */}
        <p className="text-base font-normal" style={{ marginBottom: '20px' }}>
          Your generated interior designs will appear here
        </p>

        {/* Button */}
        <Button
          onClick={() => onCreateRoom("Living room")}
          className="mt-0"
        >
          Create
        </Button>
      </div>
    );
  }

  // Render room-specific empty state
  const renderEmptyState = () => {
    if (selectedRoomFilter === "All") return null;

    return (
      <div className="col-span-2 flex flex-col items-center justify-center text-muted-foreground px-8 text-center py-16">
        {/* Icon - 20px (2xl) spacing below */}
        <div className="size-16 rounded-full bg-purple-100 flex items-center justify-center" style={{ marginBottom: '20px' }}>
          <Sparkles className="size-8 text-purple-500" />
        </div>

        {/* Heading - xl (20px) + semibold, 12px (lg) spacing below */}
        <h3 className="text-xl font-semibold" style={{ marginBottom: '12px' }}>
          No {selectedRoomFilter} yet
        </h3>

        {/* Description - base (16px) + regular, 20px (2xl) spacing below */}
        <p className="text-base font-normal" style={{ marginBottom: '20px' }}>
          Create your first {selectedRoomFilter.toLowerCase()} design
        </p>

        {/* Button */}
        <Button
          onClick={() => onCreateRoom(selectedRoomFilter)}
          className="mt-0"
        >
          Create
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      {/* Room Type Filter Chips - 12px bottom margin (padding handled by App container) */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide" style={{ marginBottom: "12px" }}>
        <RoomTypeChip
          label="All"
          isSelected={selectedRoomFilter === "All"}
          onClick={() => setSelectedRoomFilter("All")}
        />
        {ROOM_TYPES.map((roomType) => (
          <RoomTypeChip
            key={roomType}
            label={roomType}
            isSelected={selectedRoomFilter === roomType}
            onClick={() => setSelectedRoomFilter(roomType)}
          />
        ))}
      </div>

      {/* Rendering Items Grid - (padding handled by App container) */}
      <div className="grid grid-cols-2 gap-[9px]">
        {filteredItems.length === 0 ? (
          renderEmptyState()
        ) : (
          filteredItems.map((item) => {
            const imageUrl = item.isComplete && item.resultImage ? item.resultImage : item.originalImage;

            return (
              <div
                key={item.id}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={(e) => onImageClick?.(imageUrl, e.currentTarget as HTMLElement)}
              >
                {/* Original/Result Image */}
                <motion.div
                  layoutId={`image-${imageUrl}`}
                  className="size-full"
                >
                  <ImageWithFallback
                    src={imageUrl}
                    alt={`${item.roomType} rendering`}
                    className="size-full object-cover"
                  />
                </motion.div>

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
            );
          })
        )}
      </div>
    </div>
  );
}
