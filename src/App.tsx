import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { FeatureCard } from "./components/FeatureCard";
import { FilterChip } from "./components/FilterChip";
import { FeedCard } from "./components/FeedCard";
import { CreationPage } from "./components/CreationPage";
import { RenderingQueueIndicator } from "./components/RenderingQueueIndicator";
import { MyPageContent } from "./components/MyPageContent";
import { CreationModeModal } from "./components/CreationModeModal";
import { MediaViewer } from "./components/MediaViewer";
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
import { useMediaViewer } from "./hooks/useMediaViewer";

const { ROOM_TYPES: roomTypes, STYLES: styles, BUDGETS: budgets } = FILTER_OPTIONS;

type Page = "home" | "placeObject" | "interiorDesign" | "exteriorDesign";

const NAV_BAR_HEIGHT = 44;
const TAB_BAR_HEIGHT = 44;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [activeTab, setActiveTab] = useState<string>("home");
  const [previousPage, setPreviousPage] = useState<Page | null>(null);
  const [showCreationModeModal, setShowCreationModeModal] = useState(false);
  const [pendingRoomType, setPendingRoomType] = useState<string>("");
  const homeScrollRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTopRef = useRef(0);
  const [isTabBarHidden, setIsTabBarHidden] = useState(false); // Always false - tab bar always visible

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

  // Media viewer state
  const {
    selectedImage,
    sourceElement,
    openMediaViewer,
    closeMediaViewer,
    isOpen: isMediaViewerOpen
  } = useMediaViewer();
  
  // Preserve creation page state for each page type
  const [creationPageStates, setCreationPageStates] = useState<Record<Page, CreationPageState>>({
    home: { selectedSpace: "", selectedImage: "", showAnalysis: false, analysisCompleted: false },
    placeObject: { selectedSpace: "", selectedImage: "", showAnalysis: false, analysisCompleted: false },
    interiorDesign: { selectedSpace: "", selectedImage: "", showAnalysis: false, analysisCompleted: false },
    exteriorDesign: { selectedSpace: "", selectedImage: "", showAnalysis: false, analysisCompleted: false },
  });

  // Disabled: Tab bar hiding was causing jarring layout shifts
  // The scroll listener that controlled isTabBarHidden has been removed
  // to fix the weird animation/jank during scroll
  // useEffect(() => {
  //   ...scroll listener removed...
  // }, [activeTab, currentPage]);

  const handleFeatureCardClick = (page: Page) => {
    setCurrentPage(page);
  };

  const handleBackToHome = () => {
    // Reset the current creation page state when going back to home
    if (currentPage !== "home") {
      setCreationPageStates(prev => ({
        ...prev,
        [currentPage]: { selectedSpace: "", selectedImage: "", showAnalysis: false, analysisCompleted: false }
      }));
    }
    setCurrentPage("home");
    setPreviousPage(null);
  };

  const handleRenderingIndicatorClick = () => {
    // Reset all creation page states for a fresh start
    setCreationPageStates({
      home: { selectedSpace: "", selectedImage: "", showAnalysis: false, analysisCompleted: false },
      placeObject: { selectedSpace: "", selectedImage: "", showAnalysis: false, analysisCompleted: false },
      interiorDesign: { selectedSpace: "", selectedImage: "", showAnalysis: false, analysisCompleted: false },
      exteriorDesign: { selectedSpace: "", selectedImage: "", showAnalysis: false, analysisCompleted: false },
    });
    // Don't remember previous page - fresh start from home
    setPreviousPage(null);
    // Navigate to home page first, then switch to My Page tab
    setCurrentPage("home");
    setActiveTab("mypage");
  };

  const handleBackFromMyPage = () => {
    // Always return to home tab when going back from My Page
    setActiveTab("home");
    // Clear previous page reference
    setPreviousPage(null);
  };

  // Handle Create button click from My Page
  const handleCreateFromMyPage = (roomType: string) => {
    setPendingRoomType(roomType);
    setShowCreationModeModal(true);
  };

  // Handle creation mode selection from modal
  const handleCreationModeSelect = (mode: Page) => {
    // Pre-populate the selected space for the chosen creation mode
    setCreationPageStates(prev => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        selectedSpace: pendingRoomType,
        selectedImage: "",
        showAnalysis: false,
        analysisCompleted: false
      }
    }));

    // Navigate to the creation page
    setCurrentPage(mode);
    setActiveTab("home");

    // Clear pending room type
    setPendingRoomType("");
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

  const filterChipsOffset = NAV_BAR_HEIGHT + (isTabBarHidden ? 0 : TAB_BAR_HEIGHT);

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
              <div className="sticky top-0 z-40 h-[44px] bg-background flex items-center justify-center px-4 shrink-0" style={{ transition: 'none' }}>
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
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1 flex flex-col overflow-hidden gap-0"
              >
                {/* Tab Bar */}
                <div
                  className="sticky z-30 bg-background overflow-hidden"
                  style={{ top: `${NAV_BAR_HEIGHT}px`, height: isTabBarHidden ? 0 : TAB_BAR_HEIGHT, transition: 'none' }}
                >
                  <div
                    className="h-[44px] border-b border-border"
                    style={{ opacity: isTabBarHidden ? 0 : 1 }}
                  >
                    <TabsList className="h-full w-full rounded-none bg-background p-0 gap-0 border-none">
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
                  </div>
                </div>

                {/* Tab Content Areas */}
                <TabsContent value="home" className="flex-1 m-0 overflow-hidden">
                  <div ref={homeScrollRef} className="h-full overflow-y-auto pb-10">
                    {/* Creation Feature Entry Module - 12px top, 12px bottom */}
                    <div className="px-4 pt-3 pb-3" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
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

                    {/* Spacing gap - 12px */}
                    <div style={{ height: '12px' }}></div>

                    {/* Explore Feed Title - 12px bottom spacing */}
                    <div className="px-4" style={{ paddingBottom: '12px' }}>
                      <div className="flex items-center justify-between">
                        <h2>
                          Explore Feed{" "}
                          {activeFilterCount > 0 && (
                            <span className="text-xs text-gray-500 ml-2">
                              ({activeFilterCount} active)
                            </span>
                          )}
                        </h2>
                        {activeFilterCount > 0 && (
                          <button
                            onClick={clearAllFilters}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Filter Chips */}
                    <div
                      className="sticky z-20 bg-background px-4 pt-3 pb-3 shadow-[0_12px_24px_-24px_rgba(3,2,19,0.35)]"
                      style={{ top: `${filterChipsOffset}px` }}
                    >
                      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
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
                    </div>

                    {/* Spacing gap - 12px */}
                    <div style={{ height: '12px' }}></div>

                    {/* Feed Grid - 16px padding, 8px gap */}
                    <div className="grid grid-cols-2 gap-2" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                      {displayedImages.map((imageUrl, index) => (
                        <FeedCard
                          key={`${imageUrl}-${index}`}
                          imageUrl={imageUrl}
                          isLiked={likedImages.has(imageUrl)}
                          onLikeToggle={() => handleLikeToggle(imageUrl)}
                          onClick={() => {}}
                          onImageClick={openMediaViewer}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="mypage" className="flex-1 m-0 overflow-hidden">
                  <div className="h-full overflow-y-auto p-4">
                    <MyPageContent
                      renderingItems={allRenderingItems}
                      onCreateRoom={handleCreateFromMyPage}
                      onImageClick={openMediaViewer}
                    />
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

        {/* Creation Mode Selection Modal */}
        <CreationModeModal
          isOpen={showCreationModeModal}
          onClose={() => {
            setShowCreationModeModal(false);
            setPendingRoomType("");
          }}
          onSelectMode={handleCreationModeSelect}
          roomType={pendingRoomType}
        />

        {/* Media Viewer */}
        <MediaViewer
          isOpen={isMediaViewerOpen}
          selectedImage={selectedImage}
          sourceElement={sourceElement}
          onClose={closeMediaViewer}
        />
      </div>
    </div>
  );
}
