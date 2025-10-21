import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-auto max-h-[500px] rounded-t-[20px] p-0 w-[375px] !left-1/2 !-translate-x-1/2 !right-auto gap-0"
        hideOverlay={false}
      >
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border relative">
          <SheetTitle className="text-left text-lg font-semibold pr-8">Choose creation mode</SheetTitle>
          <SheetDescription className="sr-only">
            Select how you want to create content for your {roomType}
          </SheetDescription>
        </SheetHeader>

        {/* Content with precise spacing */}
        <div className="overflow-y-auto flex-1" style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '36px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Place an Object */}
            <button
              onClick={() => handleModeSelect("placeObject")}
              className="flex items-center gap-4 cursor-pointer hover:bg-accent/50 rounded-lg transition-colors text-left"
            >
              <div className="size-16 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#FFE5D9" }}>
                <span className="text-3xl">🪑</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-1">Place an object</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Add furniture or decor to your {roomType.toLowerCase()}
                </p>
              </div>
            </button>

            {/* Interior Design */}
            <button
              onClick={() => handleModeSelect("interiorDesign")}
              className="flex items-center gap-4 cursor-pointer hover:bg-accent/50 rounded-lg transition-colors text-left"
            >
              <div className="size-16 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#E9D5FF" }}>
                <Palette className="size-7 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-1">Interior design</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Redesign your entire {roomType.toLowerCase()}
                </p>
              </div>
            </button>

            {/* Exterior Design */}
            <button
              onClick={() => handleModeSelect("exteriorDesign")}
              className="flex items-center gap-4 cursor-pointer hover:bg-accent/50 rounded-lg transition-colors text-left"
            >
              <div className="size-16 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#DBEAFE" }}>
                <Home className="size-7 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-1">Exterior design</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Transform your outdoor space
                </p>
              </div>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
