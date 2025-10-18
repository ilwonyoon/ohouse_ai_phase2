import { Upload } from "lucide-react";

interface UploadButtonProps {
  onClick?: () => void;
}

export function UploadButton({ onClick }: UploadButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full aspect-[4/3] bg-card border-2 border-dashed border-primary rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-accent transition-colors"
    >
      <Upload className="size-6 text-primary" />
      <span className="text-sm">Upload photo</span>
    </button>
  );
}
