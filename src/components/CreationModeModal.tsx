import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Palette, Home } from "lucide-react";

interface CreationModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: "placeObject" | "interiorDesign" | "exteriorDesign") => void;
  roomType: string;
}

export function CreationModeModal({ isOpen, onClose, onSelectMode, roomType }: CreationModeModalProps) {
  const handleModeSelect = (mode: "placeObject" | "interiorDesign" | "exteriorDesign") => {
    onSelectMode(mode);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[343px]">
        <DialogHeader>
          <DialogTitle>Choose creation mode</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          {/* Place an Object */}
          <button
            onClick={() => handleModeSelect("placeObject")}
            className="flex items-center gap-4 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors text-left"
          >
            <div className="size-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#FFE5D9" }}>
              <span className="text-2xl">🪑</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base mb-1">Place an object</h3>
              <p className="text-sm text-muted-foreground">
                Add furniture or decor to your {roomType.toLowerCase()}
              </p>
            </div>
          </button>

          {/* Interior Design */}
          <button
            onClick={() => handleModeSelect("interiorDesign")}
            className="flex items-center gap-4 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors text-left"
          >
            <div className="size-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#E9D5FF" }}>
              <Palette className="size-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base mb-1">Interior design</h3>
              <p className="text-sm text-muted-foreground">
                Redesign your entire {roomType.toLowerCase()}
              </p>
            </div>
          </button>

          {/* Exterior Design */}
          <button
            onClick={() => handleModeSelect("exteriorDesign")}
            className="flex items-center gap-4 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors text-left"
          >
            <div className="size-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#DBEAFE" }}>
              <Home className="size-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base mb-1">Exterior design</h3>
              <p className="text-sm text-muted-foreground">
                Transform your outdoor space
              </p>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
