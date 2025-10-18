import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Heart } from "lucide-react";

interface FeedCardProps {
  imageUrl: string;
  isLiked: boolean;
  onLikeToggle: () => void;
  onClick: () => void;
}

export function FeedCard({ imageUrl, isLiked, onLikeToggle, onClick }: FeedCardProps) {
  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLikeToggle();
  };

  return (
    <button
      onClick={onClick}
      className="w-[167px] aspect-[3/4] rounded-lg overflow-hidden hover:opacity-90 transition-opacity relative"
    >
      <ImageWithFallback
        src={imageUrl}
        alt="Interior design"
        className="size-full object-cover"
      />
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
