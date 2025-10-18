/**
 * Shared type definitions for the Ohouse AI application
 */

/**
 * Represents a rendering request in the queue
 */
export interface RenderingRequest {
  id: number;
  startTime: number;
  duration: number; // in milliseconds
  originalImage: string;
  roomType: string;
}

/**
 * Represents a rendering item (active or completed)
 * Used in the "My Page" tab to display rendering history
 */
export interface RenderingItem {
  id: number;
  originalImage: string;
  resultImage?: string;
  progress: number; // 0-100
  isComplete: boolean;
  roomType: string;
}

/**
 * Represents the state of a creation page
 */
export interface CreationPageState {
  selectedSpace: string;
  selectedImage: string;
  showAnalysis: boolean;
  analysisCompleted: boolean;
}
