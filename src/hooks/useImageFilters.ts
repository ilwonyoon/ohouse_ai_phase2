import { useState, useEffect } from "react";
import { defaultImages, imagesByFilter } from "../data/images";
import { FEED_CONSTANTS } from "../constants";

export function useImageFilters() {
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [displayedImages, setDisplayedImages] = useState<string[]>(defaultImages);
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());

  // Update images when filters change
  useEffect(() => {
    let filteredImages: string[] = [];

    // Prioritize filters: first check room type, then style, then show all
    if (selectedRoomType && imagesByFilter[selectedRoomType]) {
      filteredImages = [...imagesByFilter[selectedRoomType]];
    } else if (selectedStyle && imagesByFilter[selectedStyle]) {
      filteredImages = [...imagesByFilter[selectedStyle]];
    }

    // If we have filtered images, pad them to target count by repeating or adding defaults
    if (filteredImages.length > 0) {
      while (filteredImages.length < FEED_CONSTANTS.DISPLAYED_IMAGES_COUNT) {
        filteredImages.push(
          ...filteredImages.slice(
            0,
            Math.min(
              FEED_CONSTANTS.PADDING_BATCH_SIZE,
              FEED_CONSTANTS.DISPLAYED_IMAGES_COUNT - filteredImages.length
            )
          )
        );
      }
      setDisplayedImages(filteredImages.slice(0, FEED_CONSTANTS.DISPLAYED_IMAGES_COUNT));
    } else if (selectedRoomType || selectedStyle || selectedBudget) {
      // If any filter is selected but no specific images, shuffle the default images
      const shuffled = [...defaultImages].sort(() => Math.random() - 0.5);
      setDisplayedImages(shuffled);
    } else {
      // No filters selected, show default images
      setDisplayedImages(defaultImages);
    }
  }, [selectedRoomType, selectedStyle, selectedBudget]);

  const handleRoomTypeSelect = (value: string) => {
    setSelectedRoomType(value === selectedRoomType ? "" : value);
  };

  const handleStyleSelect = (value: string) => {
    setSelectedStyle(value === selectedStyle ? "" : value);
  };

  const handleBudgetSelect = (value: string) => {
    setSelectedBudget(value === selectedBudget ? "" : value);
  };

  const handleLikeToggle = (imageUrl: string) => {
    setLikedImages((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(imageUrl)) {
        newLiked.delete(imageUrl);
      } else {
        newLiked.add(imageUrl);
      }
      return newLiked;
    });
  };

  const clearAllFilters = () => {
    setSelectedRoomType("");
    setSelectedStyle("");
    setSelectedBudget("");
  };

  const activeFilterCount =
    (selectedRoomType ? 1 : 0) + (selectedStyle ? 1 : 0) + (selectedBudget ? 1 : 0);

  return {
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
  };
}
