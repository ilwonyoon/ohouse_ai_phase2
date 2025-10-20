import React from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Heart } from "lucide-react";

interface FeedCardProps {
  imageUrl: string;
  isLiked: boolean;
  onLikeToggle: () => void;
  onClick: () => void;
  onImageClick?: (imageUrl: string, element: HTMLElement) => void;
}

export function FeedCard({ imageUrl, isLiked, onLikeToggle, onClick, onImageClick }: FeedCardProps) {
  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLikeToggle();
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (onImageClick) {
      onImageClick(imageUrl, e.currentTarget as HTMLElement);
    } else {
      onClick();
    }
  };

  return (
    <button
      onClick={handleImageClick}
      className="w-full aspect-[3/4] rounded-lg overflow-hidden hover:opacity-90 transition-opacity relative cursor-pointer"
    >
      <motion.div
        layoutId={`image-${imageUrl}`}
        className="size-full"
      >
        <ImageWithFallback
          src={imageUrl}
          alt="Interior design"
          className="size-full object-cover"
        />
      </motion.div>
      <div
        onClick={handleHeartClick}
        className="absolute bottom-[10px] right-[10px] size-6 flex items-center justify-center cursor-pointer"
      >
        <Heart 
          className={`size-6 text-white drop-shadow-lg transition-all ${
            isLiked ? 'fill-white' : 'fill-none'
          }`}
        />
      </div>
    </button>
  );
}
