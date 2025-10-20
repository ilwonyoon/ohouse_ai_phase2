import { useState } from "react";

/**
 * Custom hook for media viewer state management
 * Handles opening/closing media viewer with source element tracking
 */
export function useMediaViewer() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sourceElement, setSourceElement] = useState<HTMLElement | null>(null);

  const openMediaViewer = (imageUrl: string, element: HTMLElement) => {
    setSelectedImage(imageUrl);
    setSourceElement(element);
  };

  const closeMediaViewer = () => {
    setSelectedImage(null);
    setSourceElement(null);
  };

  return {
    selectedImage,
    sourceElement,
    openMediaViewer,
    closeMediaViewer,
    isOpen: selectedImage !== null
  };
}
