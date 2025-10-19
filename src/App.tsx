import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { FeatureCard } from "./components/FeatureCard";
import { FilterChip } from "./components/FilterChip";
import { FeedCard } from "./components/FeedCard";
import { CreationPage } from "./components/CreationPage";
import { RenderingQueueIndicator } from "./components/RenderingQueueIndicator";
import { MyPageContent } from "./components/MyPageContent";
import { Toaster } from "./components/ui/sonner";
import { motion, AnimatePresence } from "motion/react";
import { Palette, Home } from "lucide-react";
import {
  SLIDE_ANIMATION_CONFIG,
  MOBILE_VIEWPORT,
  TOAST_STYLES,
  FILTER_OPTIONS,
} from "./constants";
import { CreationPageState } from "./types";
import { useRenderingQueue } from "./hooks/useRenderingQueue";
import { useImageFilters } from "./hooks/useImageFilters";

const { ROOM_TYPES: roomTypes, STYLES: styles, BUDGETS: budgets } = FILTER_OPTIONS;

type Page = "home" | "placeObject" | "interiorDesign" | "exteriorDesign";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [activeTab, setActiveTab] = useState<string>("home");
  const [previousPage, setPreviousPage] = useState<Page | null>(null);

  // Use custom hooks for cleaner state management
  const {
    renderingQueue,
    queueProgress,
    completedRenderings,
    allRenderingItems,
    addRenderingRequest,
  } = useRenderingQueue();

  const {
    selectedRoomType,
    selectedStyle,
    selectedBudget,
    displayedImages,
    likedImages,
    activeFilterCount,
    handleRoomTypeSelect,
    handleStyleSelect,
    handleBudgetSelect,
    handleLikeToggle,
    clearAllFilters,
  } = useImageFilters();
  
  // Preserve creation page state for each page type
  const [creationPageStates, setCreationPageStates] = useState<Record<Page, CreationPageState>>({
    home: { selectedSpace: "", selectedImage: "", showAnalysis: false, analysisCompleted: false },
    placeObject: { selectedSpace: "", selectedImage: "", showAnalysis: false, analysisCompleted: false },
    interiorDesign: { selectedSpace: "", selectedImage: "", showAnalysis: false, analysisCompleted: false },
    exteriorDesign: { selectedSpace: "", selectedImage: "", showAnalysis: false, analysisCompleted: false },
  });

  const handleFeatureCardClick = (page: Page) => {
    setCurrentPage(page);
  };

  const handleBackToHome = () => {
    // Don't reset state - preserve it for when user returns
    // Only clear the previous page reference
    setCurrentPage("home");
    setPreviousPage(null);
  };

  const handleRenderingIndicatorClick = () => {
    // Remember the current page if we're not already on home
    if (currentPage !== "home") {
      setPreviousPage(currentPage);
    }
    // Navigate to home page first, then switch to My Page tab
    setCurrentPage("home");
    setActiveTab("mypage");
  };

  const handleBackFromMyPage = () => {
    // Return to the previous page if it exists
    if (previousPage) {
      setCurrentPage(previousPage);
      setPreviousPage(null);
    }
    // Always return to home tab when going back
    setActiveTab("home");
  };

  // Update creation page state
  const updateCreationPageState = (page: Page, state: Partial<CreationPageState>) => {
    setCreationPageStates(prev => ({
      ...prev,
      [page]: { ...prev[page], ...state }
    }));
  };

  const getPageTitle = (page: Page): string => {
    switch (page) {
      case "placeObject":
        return "Place an object";
      case "interiorDesign":
        return "Interior design";
      case "exteriorDesign":
        return "Exterior design";
      default:
        return "Ohouse ai";
    }
  };

  return (
    <div className="size-full flex items-center justify-center bg-gray-100">
      {/* Toast Notifications */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            maxWidth: TOAST_STYLES.MAX_WIDTH,
            width: TOAST_STYLES.WIDTH,
          },
        }}
      />

      {/* Mobile Screen Container */}
      <div
        className="w-[375px] h-[812px] bg-background flex flex-col overflow-hidden shadow-xl relative"
        style={{ width: MOBILE_VIEWPORT.WIDTH, height: MOBILE_VIEWPORT.HEIGHT }}
      >
        <AnimatePresence initial={false}>
          {currentPage === "home" ? (
            <motion.div
              key="home"
              initial={{ x: "-25%", opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-25%", opacity: 0.8 }}
              transition={SLIDE_ANIMATION_CONFIG}
              className="absolute inset-0 flex flex-col"
            >
              {/* iOS Top Navigation Bar */}
              <div className="h-[44px] bg-background flex items-center justify-center px-4 shrink-0 relative">
                {/* Back button for My Page when coming from creation flow */}
                {activeTab === "mypage" && previousPage && (
                  <button
                    onClick={handleBackFromMyPage}
                    className="absolute left-4 flex items-center gap-1 text-[17px] text-primary hover:opacity-70 transition-opacity active:opacity-50 cursor-pointer z-20"
                    aria-label={`Go back to ${getPageTitle(previousPage)}`}
                  >
                    <svg 
                      width="13" 
                      height="21" 
                      viewBox="0 0 13 21" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="relative -left-[2px]"
                    >
                      <path 
                        d="M10.5 3L3 10.5L10.5 18" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[17px]">{getPageTitle(previousPage)}</span>
                  </button>
                )}
                
                <h1 className="text-[17px] font-semibold tracking-[-0.41px]">
                  {activeTab === "mypage" && previousPage ? "My Page" : "Ohouse ai"}
                </h1>
                
                <div className="absolute right-4">
                  <RenderingQueueIndicator 
                    count={renderingQueue.length} 
                    progress={queueProgress}
                    completedCount={completedRenderings.length}
                    onClick={handleRenderingIndicatorClick}
                  />
                </div>
              </div>

              {/* Tabs Navigation and Content */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                {/* Tab Bar */}
                <TabsList className="h-[44px] w-full rounded-none bg-background border-b border-border p-0 shrink-0 gap-0">
                  <TabsTrigger 
                    value="home" 
                    className="flex-1 h-full rounded-none border-0 data-[state=active]:border-b-[2px] data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Home
                  </TabsTrigger>
                  <TabsTrigger 
                    value="mypage" 
                    className="flex-1 h-full rounded-none border-0 data-[state=active]:border-b-[2px] data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    My Page
                  </TabsTrigger>
                </TabsList>

                {/* Tab Content Areas */}
                <TabsContent value="home" className="flex-1 m-0 overflow-y-auto">
                  {/* Creation Feature Entry Module */}
                  <div className="px-4 py-4">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      <FeatureCard 
                        title="Place an object in your room"
                        icon={<span className="text-lg">🪑</span>}
                        iconBgColor="#FFE5D9"
                        onClick={() => handleFeatureCardClick("placeObject")}
                      />
                      <FeatureCard 
                        title="Overall Interior design"
                        icon={<Palette className="size-4 text-purple-600" />}
                        iconBgColor="#E9D5FF"
                        onClick={() => handleFeatureCardClick("interiorDesign")}
                      />
                      <FeatureCard 
                        title="Exterior design"
                        icon={<Home className="size-4 text-blue-600" />}
                        iconBgColor="#DBEAFE"
                        onClick={() => handleFeatureCardClick("exteriorDesign")}
                      />
                    </div>
                  </div>

                  {/* Explore Feed Section */}
                  <div className="py-4">
                    <div className="flex items-center justify-between px-4 mb-2">
                      <h2>Explore Feed {(selectedRoomType || selectedStyle || selectedBudget) && <span className="text-xs text-gray-500 ml-2">({(selectedRoomType ? 1 : 0) + (selectedStyle ? 1 : 0) + (selectedBudget ? 1 : 0)} active)</span>}</h2>
                      {(selectedRoomType || selectedStyle || selectedBudget) && (
                        <button
                          onClick={() => {
                            setSelectedRoomType("");
                            setSelectedStyle("");
                            setSelectedBudget("");
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 px-4 scrollbar-hide mt-2">
                      <FilterChip
                        label="Room Type"
                        options={roomTypes}
                        selectedValue={selectedRoomType}
                        onSelect={handleRoomTypeSelect}
                      />
                      <FilterChip
                        label="Style"
                        options={styles}
                        selectedValue={selectedStyle}
                        onSelect={handleStyleSelect}
                      />
                      <FilterChip
                        label="Budget"
                        options={budgets}
                        selectedValue={selectedBudget}
                        onSelect={handleBudgetSelect}
                      />
                    </div>
                    
                    {/* Feed Grid */}
                    <div className="grid grid-cols-2 gap-[9px] px-4 mt-2 pb-4">
                      {displayedImages.map((imageUrl, index) => (
                        <FeedCard
                          key={`${imageUrl}-${index}`}
                          imageUrl={imageUrl}
                          isLiked={likedImages.has(imageUrl)}
                          onLikeToggle={() => handleLikeToggle(imageUrl)}
                          onClick={() => {}}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="mypage" className="flex-1 m-0 overflow-y-auto">
                  <div className="p-4">
                    <MyPageContent renderingItems={allRenderingItems} />
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          ) : (
            <motion.div
              key="creation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={SLIDE_ANIMATION_CONFIG}
              className="absolute inset-0"
            >
              <CreationPage 
                title={getPageTitle(currentPage)} 
                onBack={handleBackToHome}
                onAddRenderingRequest={addRenderingRequest}
                renderingQueueCount={renderingQueue.length}
                renderingQueueProgress={queueProgress}
                completedCount={completedRenderings.length}
                onRenderingStatusClick={handleRenderingIndicatorClick}
                selectedSpace={creationPageStates[currentPage].selectedSpace}
                selectedImage={creationPageStates[currentPage].selectedImage}
                showAnalysis={creationPageStates[currentPage].showAnalysis}
                analysisCompleted={creationPageStates[currentPage].analysisCompleted}
                onStateChange={(state) => updateCreationPageState(currentPage, state)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
