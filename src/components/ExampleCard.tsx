import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ExampleCardProps {
  imageUrl: string;
  onClick?: () => void;
}

export function ExampleCard({ imageUrl, onClick }: ExampleCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-muted hover:opacity-80 transition-opacity"
    >
      <ImageWithFallback
        src={imageUrl}
        alt="Example room"
        className="size-full object-cover"
      />
    </button>
  );
}
