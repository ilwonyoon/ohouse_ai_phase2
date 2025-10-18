/**
 * Application-wide constants for timing, layout, and configuration
 */

// ============= LAYOUT CONSTANTS =============
export const MOBILE_VIEWPORT = {
  WIDTH: 375,
  HEIGHT: 812,
} as const;

// ============= ANALYSIS/PROCESSING TIMING =============
export const ANALYSIS_TIMING = {
  /** Total time for the 3-step analysis process in seconds */
  TOTAL_DURATION_SECONDS: 3,
  /** Time per step (analysis steps change every 1 second with 3-second total) */
  STEP_DURATION_SECONDS: 1,
  /** Threshold to show analysis results and product chips */
  COMPLETION_THRESHOLD_SECONDS: 3,
} as const;

// ============= RENDERING QUEUE TIMING =============
export const RENDERING_TIMING = {
  /** Duration of a single rendering request in milliseconds */
  REQUEST_DURATION_MS: 5000,
  /** Interval for progress updates in milliseconds */
  PROGRESS_UPDATE_INTERVAL_MS: 50,
} as const;

// ============= ANIMATION TIMING =============
export const ANIMATION_TIMING = {
  /** Toast notification duration in milliseconds */
  TOAST_DURATION_MS: 3000,
  /** Standard page transition duration in seconds */
  PAGE_TRANSITION_DURATION: 0.35,
} as const;

// ============= ANIMATION EASING =============
export const SLIDE_ANIMATION_CONFIG = {
  type: "tween",
  ease: [0.32, 0.72, 0, 1],
  duration: 0.35,
} as const;

// ============= PRODUCT CHIPS ANIMATION =============
export const PRODUCT_CHIP_ANIMATION = {
  /** Delay between each product chip appearing in milliseconds */
  APPEARANCE_DELAY_MS: 300,
  /** Delay before showing the hint after all chips appear in milliseconds */
  HINT_APPEARANCE_DELAY_MS: 500,
} as const;

// ============= FILTER OPTIONS =============
export const FILTER_OPTIONS = {
  ROOM_TYPES: ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Dining Room", "Office"],
  STYLES: ["Modern", "Minimalist", "Industrial", "Scandinavian", "Traditional", "Contemporary"],
  BUDGETS: ["Under $1,000", "$1,000-$5,000", "$5,000-$10,000", "$10,000-$25,000", "Over $25,000"],
} as const;

// ============= FEED CONSTANTS =============
export const FEED_CONSTANTS = {
  /** Number of images to display in the feed grid */
  DISPLAYED_IMAGES_COUNT: 20,
  /** Number of images to pad with when filtering results in too few images */
  PADDING_BATCH_SIZE: 3,
} as const;

// ============= TOAST NOTIFICATION STYLING =============
export const TOAST_STYLES = {
  MAX_WIDTH: '343px',
  WIDTH: '343px',
} as const;
