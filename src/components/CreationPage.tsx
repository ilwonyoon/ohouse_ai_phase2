import { useState } from "react";
import { ArrowLeft, Sofa, Bed, ChefHat, Bath, Lamp, UtensilsCrossed } from "lucide-react";
import { SpaceTypeCard } from "./SpaceTypeCard";
import { UploadButton } from "./UploadButton";
import { ExampleCard } from "./ExampleCard";
import { RoomAnalysisPage } from "./RoomAnalysisPage";
import { RenderingQueueIndicator } from "./RenderingQueueIndicator";
import { motion, AnimatePresence } from "motion/react";
import { SLIDE_ANIMATION_CONFIG } from "../constants";

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

const livingRoomExamples = [
  "https://images.unsplash.com/photo-1630699144919-681cf308ae82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzYwNjA4NTkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NjA2MjcyOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NjA2Nzk5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1680503397654-cd18497b1b41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXNoZWQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2MDY4MTg2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1638885930125-85350348d266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2MDYzMTI4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
];

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
    // Handle file upload logic here
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
      <div className="h-[44px] bg-background border-b border-border flex items-center px-4 shrink-0 relative">
        <button 
          onClick={handleBackToHome}
          className="size-8 flex items-center justify-center -ml-2"
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
          {selectedSpace === "Living room" ? (
            <UploadButton onClick={handleUploadClick} />
          ) : (
            <SpaceTypeCard
              title="Living room"
              icon={<Sofa className="size-4 text-blue-600" />}
              iconBgColor="#DBEAFE"
              onClick={() => handleSpaceSelect("Living room")}
            />
          )}
          
          {selectedSpace === "Living room" ? (
            livingRoomExamples.map((imageUrl, index) => (
              <ExampleCard
                key={index}
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
