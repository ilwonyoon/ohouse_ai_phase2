import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner@2.0.3";
import { RENDERING_TIMING, ANIMATION_TIMING } from "../constants";
import { RenderingRequest, RenderingItem } from "../types";

export function useRenderingQueue() {
  const [renderingQueue, setRenderingQueue] = useState<RenderingRequest[]>([]);
  const [queueProgress, setQueueProgress] = useState<number>(0);
  const [completedRenderings, setCompletedRenderings] = useState<RenderingItem[]>([]);

  // Add a rendering request to the queue
  const addRenderingRequest = useCallback((originalImage: string, roomType: string) => {
    const newRequest: RenderingRequest = {
      id: Date.now(),
      startTime: Date.now(),
      duration: RENDERING_TIMING.REQUEST_DURATION_MS,
      originalImage,
      roomType,
    };

    setRenderingQueue((prev) => [...prev, newRequest]);

    // Show toast notification
    toast("Placing product in your room", {
      description: "Your request is being processed",
      action: {
        label: "Dismiss",
        onClick: () => {},
      },
      duration: ANIMATION_TIMING.TOAST_DURATION_MS,
    });

    // Remove request after duration and add to completed
    setTimeout(() => {
      setRenderingQueue((prev) => prev.filter((req) => req.id !== newRequest.id));

      // Add to completed renderings with a mock result image
      setCompletedRenderings((prev) => [
        ...prev,
        {
          id: newRequest.id,
          originalImage: newRequest.originalImage,
          resultImage: newRequest.originalImage, // In real app, this would be the AI-generated result
          progress: 100,
          isComplete: true,
          roomType: newRequest.roomType,
        },
      ]);
    }, newRequest.duration);
  }, []);

  // Update progress for the oldest active request
  useEffect(() => {
    if (renderingQueue.length === 0) {
      setQueueProgress(0);
      return;
    }

    const oldestRequest = renderingQueue[0];
    const interval = setInterval(() => {
      const elapsed = Date.now() - oldestRequest.startTime;
      const progress = Math.min((elapsed / oldestRequest.duration) * 100, 100);
      setQueueProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, RENDERING_TIMING.PROGRESS_UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [renderingQueue]);

  // Combine active and completed renderings for My Page
  const allRenderingItems: RenderingItem[] = [
    ...renderingQueue.map((req) => {
      const elapsed = Date.now() - req.startTime;
      const progress = Math.min((elapsed / req.duration) * 100, 100);
      return {
        id: req.id,
        originalImage: req.originalImage,
        progress,
        isComplete: false,
        roomType: req.roomType,
      };
    }),
    ...completedRenderings,
  ];

  return {
    renderingQueue,
    queueProgress,
    completedRenderings,
    allRenderingItems,
    addRenderingRequest,
  };
}
