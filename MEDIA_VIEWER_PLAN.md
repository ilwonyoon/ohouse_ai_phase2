# Media Viewer Implementation Plan

## Overview

Implement a full-scale media viewer component that allows users to preview images with smooth expand/collapse animations and drag-to-dismiss gesture. Used across Home feed grid, My Page grid, and Room Analysis page.

**Date Created:** October 20, 2025

---

## 1. Interaction Flow

```
User taps image on grid
    ↓
Thumbnail position captured (getBoundingClientRect)
    ↓
Media expands from thumbnail to full-width
    ↓
Top nav with X icon appears
    ↓
User can either:
  A) Click X to close with scale-down animation
  B) Drag media downward → triggers scale-down animation
```

### Detailed Interactions

**Open Media:**
1. User taps any image in:
   - Home feed (2-column grid)
   - My Page rendering items (2-column grid)
2. Component captures source element's bounding rect
3. Media viewer modal opens with expand animation
4. Image grows from thumbnail size to full viewport width - vertically and horizontally centered within the viewport 
5. Height maintains aspect ratio
6. Top navigation bar fades in with close (X) button

**Close Media:**
1. **Method A - Click X button:**
   - Top nav X button clicked
   - Smooth scale-down animation to original position
   - Modal fades out
   - Focus returns to original image

2. **Method B - Drag to dismiss:**
   - User drags image downward
   - Visual feedback: image scales down as drag progresses
   - If drag distance > 100px: complete scale-down animation and close
   - If drag distance < 100px: snap back to full-width position
   - Elastic bounce effect on snap

---

## 2. Animation Library Selection

### Current Stack Analysis
- ✅ `motion` (framer-motion alternative) - Already installed
- ✅ `react-dom` - For modal portal
- ✅ `lucide-react` - For X icon
- ✅ `@radix-ui/react-dialog` - Optional backdrop

### Recommended Libraries

**Primary: Motion (already installed)**
- Expand/collapse animations: Use `layoutId` + position animation
- Drag gestures: Built-in `drag` prop with `onDragEnd` callback
- Scale animations: Direct `animate` prop manipulation
- Transitions: Supports custom easing and duration

**No Additional Dependencies Needed** 🎉

---

## 3. Component Architecture

### Component Tree
```
App.tsx
├── mediaViewerState (custom hook useMediaViewer)
│   ├── selectedImage: string | null
│   ├── sourceElement: HTMLElement | null
│   ├── setSelectedImage: (url: string, element: HTMLElement) => void
│   └── clearMediaViewer: () => void
│
├── MediaViewer.tsx (Portal Modal)
│   ├── Backdrop (darkened overlay, click to close)
│   ├── TopNav
│   │   └── X Close button (lucide-react)
│   └── MediaContainer (motion.img)
│       ├── Expand animation on mount
│       ├── Drag gesture handler
│       └── Scale-down animation on close
│
├── FeedCard.tsx (modified)
│   └── onClick → setSelectedImage(imageUrl, element)
│
├── MyPageContent.tsx (modified)
│   └── onClick on grid items → setSelectedImage(imageUrl, element)
│
└── RoomAnalysisPage.tsx (optional)
    └── onClick on image → setSelectedImage(imageUrl, element)
```

### File Structure
```
src/
├── components/
│   ├── MediaViewer.tsx (NEW)
│   ├── FeedCard.tsx (MODIFIED)
│   ├── MyPageContent.tsx (MODIFIED)
│   └── RoomAnalysisPage.tsx (OPTIONAL MODIFICATION)
├── hooks/
│   └── useMediaViewer.ts (NEW)
└── App.tsx (MODIFIED)
```

---

## 4. Implementation Strategy

### Phase 1: Core Media Viewer Component

**File: `src/hooks/useMediaViewer.ts`**
```typescript
// Custom hook for media viewer state management
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
    closeMediaViewer
  };
}
```

**File: `src/components/MediaViewer.tsx`**
- Modal overlay component with backdrop
- Animates image from thumbnail position to full viewport
- Top navigation with close button
- Drag-to-dismiss gesture support
- Smooth scale-down animation on close

**Key Features:**
1. Position capture: `getBoundingClientRect()` from source element
2. Expand animation: 0.35s transition to full-width
3. Drag handler: Y-axis movement detection
4. Dismiss threshold: 100px downward drag
5. Elastic snap-back: When drag < 100px

### Phase 2: Integration Points

**FeedCard.tsx Changes:**
```typescript
// Add onClick handler to image
<ImageWithFallback
  onClick={(e) => openMediaViewer(imageUrl, e.currentTarget)}
/>
```

**MyPageContent.tsx Changes:**
```typescript
// Add onClick handler to rendered grid items
<div
  onClick={(e) => openMediaViewer(item.originalImage, e.currentTarget)}
  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
/>
```

**RoomAnalysisPage.tsx (Optional):**
```typescript
// Add onClick handler to scanning image
<ScanningImageOverlay
  onClick={(e) => openMediaViewer(imageUrl, e.currentTarget)}
/>
```

### Phase 3: Polish & Refinement

1. **Visual Feedback:**
   - Backdrop blur effect (backdrop-blur-sm)
   - Smooth fade transitions
   - Cursor changes (pointer on tap)

2. **Mobile Optimization:**
   - Handle safe areas (notch, status bar)
   - Viewport height adjustments
   - Touch-friendly drag thresholds

3. **Accessibility:**
   - Keyboard close (ESC key)
   - Focus management
   - ARIA labels
   - Screen reader support

4. **Performance:**
   - GPU acceleration (will-change)
   - Lazy loading considerations
   - Memory management for large images

---

## 5. Technical Implementation Details

### Expand Animation (Motion)
```typescript
// Capture source element bounds
const rect = sourceElement?.getBoundingClientRect();

// Initial state matches thumbnail
<motion.div
  initial={{
    width: rect?.width || 0,
    height: rect?.height || 0,
    x: rect?.left || 0,
    y: rect?.top || 0,
  }}
  animate={{
    width: "100%",
    height: "auto",
    x: 0,
    y: NAV_BAR_HEIGHT, // 44px for nav
  }}
  transition={{
    duration: 0.35,
    ease: [0.32, 0.72, 0, 1]
  }}
>
  <img src={selectedImage} />
</motion.div>
```

### Drag-to-Dismiss Logic
```typescript
const [dragY, setDragY] = useState(0);

const handleDragEnd = (event, info) => {
  if (Math.abs(info.offset.y) > 100) {
    // Close with scale-down animation
    closeMediaViewer();
  } else {
    // Snap back to center
    // Motion handles automatic constraint
  }
};

<motion.div
  drag="y"
  dragElastic={0.2}
  dragConstraints={{ top: 0, bottom: 500 }}
  onDragEnd={handleDragEnd}
  onDrag={(event, info) => setDragY(info.offset.y)}
>
  {/* Content scales down based on drag */}
  <motion.img
    animate={{
      scale: 1 - Math.abs(dragY) / 1000
    }}
  />
</motion.div>
```

### Scale-Down Close Animation
```typescript
// On X button click or drag threshold met
<motion.div
  animate={{
    width: rect?.width || 0,
    height: rect?.height || 0,
    x: rect?.left || 0,
    y: rect?.top || 0,
    opacity: 0
  }}
  transition={{
    duration: 0.3,
    ease: [0.32, 0.72, 0, 1]
  }}
  onAnimationComplete={closeMediaViewer}
/>
```

---

## 6. State Management Approach

### Option A: Custom Hook (Recommended)
**Pros:**
- Isolated state logic
- Reusable across components
- Easier to test

**Cons:**
- Need to pass state through App to children

### Option B: App.tsx State
**Pros:**
- Simple implementation
- No additional hook

**Cons:**
- Clutters App component
- Harder to maintain

### Option C: Context API
**Pros:**
- Global access without prop drilling

**Cons:**
- Overkill for single feature
- Performance implications

**Selected:** Option A - Custom Hook (`useMediaViewer`)

---

## 7. Files to Create and Modify

### New Files
- **`src/hooks/useMediaViewer.ts`** - Media viewer state management hook
- **`src/components/MediaViewer.tsx`** - Main media viewer modal component

### Modified Files
- **`src/App.tsx`** - Initialize media viewer hook, render MediaViewer component
- **`src/components/FeedCard.tsx`** - Add onClick handler to open media viewer
- **`src/components/MyPageContent.tsx`** - Add onClick handler to grid items
- **`src/components/RoomAnalysisPage.tsx`** (optional) - Add onClick to image

---

## 8. Dependencies Status

### Already Installed ✅
| Package | Version | Purpose |
|---|---|---|
| motion | * | Animations, drag gestures |
| react-dom | 18.3.1 | Portal rendering |
| lucide-react | 0.487.0 | X close icon |
| @radix-ui/react-dialog | 1.1.6 | Dialog/modal base (optional) |

### No New Dependencies Needed! 🎉

---

## 9. Animation Specifications

### Timing
| Interaction | Component | Duration | Easing | Notes |
|---|---|---|---|---|
| Expand | Image | 0.35s | [0.32, 0.72, 0, 1] | From thumbnail to full-width |
| Close (X click) | Image | 0.35s | [0.32, 0.72, 0, 1] | Scale down to thumbnail |
| Snap-back (drag <100px) | Image | 0.2s | cubic-bezier(0.34, 1.56, 0.64, 1) | Elastic bounce |
| Scale-down (drag >100px) | Image | 0.3s | [0.32, 0.72, 0, 1] | Complete close |
| Nav fade in | TopNav | 0.2s | ease-in | Appears with image |
| Backdrop fade in | Backdrop | 0.3s | ease-in | Darkens behind image |

### Easing Curves
- **Default (expand/close):** `[0.32, 0.72, 0, 1]` - Smooth deceleration
- **Snap-back:** `cubic-bezier(0.34, 1.56, 0.64, 1)` - Elastic bounce effect
- **Fade:** `ease-in` or `ease-out` - Standard fade transitions

---

## 10. Key Implementation Considerations

### Layout & Positioning
- Capture thumbnail bounds BEFORE animation starts
- Account for scroll position (use `getBoundingClientRect()`)
- Maintain aspect ratio during expand
- Handle viewport width constraints (safe area, notches)

### Performance
- GPU acceleration: Add `will-change: transform, opacity`
- Image optimization: Ensure images are optimized (lazy load if needed)
- Re-render optimization: Use `motion.div` to prevent React re-renders during animation

### Mobile/Responsive
- Safe area handling: Account for notches and status bars
- Touch targets: Ensure X button is 44x44px minimum
- Gesture recognition: Distinguish between tap and drag
- Viewport height: Account for mobile keyboards

### Accessibility
- Close with ESC key
- Focus trap during modal open
- Announce modal to screen readers
- ARIA labels on close button
- Tab order management

### Edge Cases
- Image loading errors (show fallback)
- Very small images (scale up appropriately)
- Very large images (handle performance)
- Rapid open/close clicks (cancel previous animation)
- Horizontal scroll in feed (capture correct position)

---

## 11. Testing Checklist

### Expand Animation
- [ ] Image expands smoothly from thumbnail to full-width
- [ ] Aspect ratio maintained during expand
- [ ] Top nav appears with fade-in
- [ ] Close button is visible and accessible
- [ ] Backdrop darkens smoothly

### Close Animation (X Button)
- [ ] Image scales down to original position
- [ ] Smooth animation duration (~0.35s)
- [ ] Modal closes after animation completes
- [ ] Focus returns to source image

### Drag-to-Dismiss
- [ ] Dragging downward shows visual feedback
- [ ] Drag >100px closes with scale-down
- [ ] Drag <100px snaps back elastically
- [ ] Performance is smooth (60fps)

### Cross-Grid Integration
- [ ] Works on Home feed grid
- [ ] Works on My Page grid
- [ ] Works on optional Room Analysis image
- [ ] Multiple images open/close without issues

### Mobile & Accessibility
- [ ] ESC key closes modal
- [ ] Touch gestures work on mobile
- [ ] Safe areas respected
- [ ] Screen reader announces modal

---

## 12. Development Roadmap

1. **Week 1:**
   - Create `useMediaViewer` hook
   - Build `MediaViewer.tsx` component
   - Implement expand/collapse animations
   - Test core functionality

2. **Week 2:**
   - Implement drag-to-dismiss gesture
   - Integrate with FeedCard
   - Integrate with MyPageContent
   - Performance optimization

3. **Week 3:**
   - Mobile refinement
   - Accessibility enhancements
   - Visual polish
   - Cross-browser testing

4. **Week 4:**
   - Bug fixes
   - Final refinements
   - Documentation
   - Deployment

---

## 13. Future Enhancements (Out of Scope)

- Pinch-to-zoom gesture
- Swipe to navigate between images
- Save/share image functionality
- Video support (for Room Analysis before/after)
- Animated GIF support
- Image filters/editing

---

## 14. References & Resources

### Motion Library Docs
- Drag API: https://www.motion.dev/docs/react-drag
- Animation API: https://www.motion.dev/docs/react-animation
- Transitions: https://www.motion.dev/docs/react-transition

### Related Code
- Current animations: `src/App.tsx` - SLIDE_ANIMATION_CONFIG
- Gesture handling: `src/components/ProductChip.tsx` - Pointer events
- Modal patterns: `src/components/CreationModeModal.tsx`

---

## 15. Questions & Notes

**Q: Should we support video files?**
A: Out of scope for initial implementation. Images only.

**Q: Should we add image zoom/pan?**
A: Out of scope. Simple full-width view is sufficient.

**Q: Keyboard navigation?**
A: ESC to close. Arrow keys not needed (single image view).

**Q: Tap backdrop to close?**
A: Yes, clicking backdrop should close modal.

---

**Document Status:** Ready for implementation
**Last Updated:** October 20, 2025
**Author:** Claude Code
**Version:** 1.0
