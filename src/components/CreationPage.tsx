import { useState } from "react";
import { ArrowLeft, Sofa, Bed, ChefHat, Bath, Lamp, UtensilsCrossed } from "lucide-react";
import { SpaceTypeCard } from "./SpaceTypeCard";
import { UploadButton } from "./UploadButton";
import { ExampleCard } from "./ExampleCard";
import { RoomAnalysisPage } from "./RoomAnalysisPage";
import { RenderingQueueIndicator } from "./RenderingQueueIndicator";
import { motion, AnimatePresence } from "motion/react";
import { SLIDE_ANIMATION_CONFIG } from "../constants";
import { toast } from "sonner@2.0.3";

interface CreationPageProps {
  title: string;
  onBack: () => void;
  onAddRenderingRequest: (originalImage: string, roomType: string) => void;
  renderingQueueCount: number;
  renderingQueueProgress: number;
  completedCount: number;
  onRenderingStatusClick: () => void;
  // State management from parent
  selectedSpace: string;
  selectedImage: string;
  showAnalysis: boolean;
  analysisCompleted: boolean;
  onStateChange: (state: { selectedSpace?: string; selectedImage?: string; showAnalysis?: boolean; analysisCompleted?: boolean }) => void;
}

const roomExamples: Record<string, string[]> = {
  "Living room": [
    "https://images.unsplash.com/photo-1630699144919-681cf308ae82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzYwNjA4NTkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NjA2MjcyOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1680503397654-cd18497b1b41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXNoZWQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2MDY4MTg2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1638885930125-85350348d266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2MDYzMTI4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ],
  "Bedroom": [
    "https://images.unsplash.com/photo-1610307522657-8c0304960189?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmVkcm9vbSUyMGRlc2lnbnxlbnwxfHx8fDE3NjA2NDEzNTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1668089677938-b52086753f77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYwNjM2NDM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1540932217986-480754078519?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXN0ZXIlMjBiZWRyb29tJTIwbW9kZXJ8ZW58MXx8fHwxNzYwNjgxMjIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ],
  "Kitchen": [
    "https://images.unsplash.com/photo-1641823911769-c55f23c25143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBraXRjaGVuJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYwNjI2NjQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1680210849773-f97a41c6b7ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBraXRjaGVuJTIwZGVzaWdufGVufDF8fHx8MTc2MDU3NjMyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwa2l0Y2hlbnxlbnwxfHx8fDE3NjA2ODEyNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ],
  "Bathroom": [
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbSUyMHRpbGVzfGVufDF8fHx8MTc2MDY4MTI2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYXRocm9vbSUyMHNwYXxlbnwxfHx8fDE3NjA2ODEyNzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1552939149-ac2e846f29a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBiYXRocm9vbXxlbnwxfHx8fDE3NjA2ODEyNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ],
  "Home Office": [
    "https://images.unsplash.com/photo-1544140708-514b7837e6b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwaG9tZSUyMG9mZmljZXxlbnwxfHx8fDE3NjA2NDcyMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjA1OTEzNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwb2ZmaWNlJTIwc3R1ZHl8ZW58MXx8fHwxNzYwNjgxMzEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ],
  "Dining": [
    "https://images.unsplash.com/photo-1723750290151-164cb19ebab7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBkaW5pbmclMjByb29tfGVufDF8fHx8MTc2MDY3NzMxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1758977245854-b0ea036e0ce2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZGluaW5nJTIwc3BhY2V8ZW58MXx8fHwxNzYwNjgwOTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1517457373614-b7152f80baf7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkaW5pbmclMjByb29tfGVufDF8fHx8MTc2MDY4MTMyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ],
};

export function CreationPage({ 
  title, 
  onBack, 
  onAddRenderingRequest, 
  renderingQueueCount, 
  renderingQueueProgress, 
  completedCount, 
  onRenderingStatusClick,
  selectedSpace,
  selectedImage,
  showAnalysis,
  analysisCompleted,
  onStateChange
}: CreationPageProps) {
  const handleSpaceSelect = (spaceType: string) => {
    onStateChange({ selectedSpace: spaceType });
  };

  const handleUploadClick = () => {
    toast("Photo upload coming soon!", {
      description: "Try using one of the example images below for now",
      duration: 3000,
    });
  };

  const handleExampleClick = (imageUrl: string) => {
    // Reset analysis completed when selecting a new image
    onStateChange({ selectedImage: imageUrl, showAnalysis: true, analysisCompleted: false });
  };

  const handleBackFromAnalysis = () => {
    // Keep the selected image and analysis state when going back
    onStateChange({ showAnalysis: false });
  };

  const handleBackToHome = () => {
    onBack();
  };

  return (
    <div className="size-full flex flex-col bg-background relative overflow-hidden">
      <AnimatePresence initial={false}>
        {!showAnalysis ? (
          <motion.div
            key="space-selection"
            initial={{ x: "-25%", opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-25%", opacity: 0.8 }}
            transition={SLIDE_ANIMATION_CONFIG}
            className="absolute inset-0 flex flex-col"
          >
      {/* iOS Top Navigation Bar */}
      <div className="h-[44px] bg-background border-b border-border flex items-center px-4 shrink-0 relative z-10">
        <button 
          onClick={handleBackToHome}
          className="size-8 flex items-center justify-center -ml-2 cursor-pointer hover:opacity-70 active:opacity-50 transition-opacity relative z-20"
          aria-label="Go back to home"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="flex-1 text-[17px] font-semibold tracking-[-0.41px] text-center -ml-8">{title}</h1>
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
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <h2 className="mb-4">Upload or select a room to start</h2>
        
        {/* 2-Column Grid */}
        <div className="grid grid-cols-2 gap-[9px]">
          {selectedSpace ? (
            <UploadButton onClick={handleUploadClick} />
          ) : (
            <SpaceTypeCard
              title="Living room"
              icon={<Sofa className="size-4 text-blue-600" />}
              iconBgColor="#DBEAFE"
              onClick={() => handleSpaceSelect("Living room")}
            />
          )}

          {selectedSpace ? (
            (roomExamples[selectedSpace] || []).map((imageUrl, index) => (
              <ExampleCard
                key={`${selectedSpace}-${index}`}
                imageUrl={imageUrl}
                onClick={() => handleExampleClick(imageUrl)}
              />
            ))
          ) : (
            <>
              <SpaceTypeCard
                title="Bedroom"
                icon={<Bed className="size-4 text-purple-600" />}
                iconBgColor="#E9D5FF"
                onClick={() => handleSpaceSelect("Bedroom")}
              />
              <SpaceTypeCard
                title="Kitchen"
                icon={<ChefHat className="size-4 text-orange-600" />}
                iconBgColor="#FED7AA"
                onClick={() => handleSpaceSelect("Kitchen")}
              />
              <SpaceTypeCard
                title="Bathroom"
                icon={<Bath className="size-4 text-cyan-600" />}
                iconBgColor="#CFFAFE"
                onClick={() => handleSpaceSelect("Bathroom")}
              />
              <SpaceTypeCard
                title="Home Office"
                icon={<Lamp className="size-4 text-green-600" />}
                iconBgColor="#D1FAE5"
                onClick={() => handleSpaceSelect("Home Office")}
              />
              <SpaceTypeCard
                title="Dining"
                icon={<UtensilsCrossed className="size-4 text-red-600" />}
                iconBgColor="#FEE2E2"
                onClick={() => handleSpaceSelect("Dining")}
              />
            </>
          )}
        </div>
      </div>
          </motion.div>
        ) : (
          <motion.div
            key="room-analysis"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={SLIDE_ANIMATION_CONFIG}
            className="absolute inset-0"
          >
            <RoomAnalysisPage
              roomType={selectedSpace}
              imageUrl={selectedImage}
              onBack={handleBackFromAnalysis}
              onAddRenderingRequest={onAddRenderingRequest}
              renderingQueueCount={renderingQueueCount}
              renderingQueueProgress={renderingQueueProgress}
              completedCount={completedCount}
              onRenderingStatusClick={onRenderingStatusClick}
              analysisCompleted={analysisCompleted}
              onAnalysisComplete={() => onStateChange({ analysisCompleted: true })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
