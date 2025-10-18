# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **React + TypeScript prototype** for "Ohouse AI", an AI-powered interior design mobile app built from a Figma design. The app simulates a mobile experience (375px × 812px viewport) for browsing design inspiration, uploading room photos, getting AI analysis, and managing design renderings.

**Original Figma Design**: https://www.figma.com/design/hW2sRQYmfYqExadIAoCaXP/Mobile-Screen-Design

## Development Commands

### Core Commands
- `npm install` - Install dependencies
- `npm run dev` - Start development server (http://localhost:3000, auto-opens in browser)
- `npm run build` - Build for production (outputs to `build/` directory)

### Development Notes
- Dev server runs on **port 3000** with hot reload
- Build output: `build/` directory
- No linting, testing, or type checking scripts configured

## Architecture Overview

### High-Level Structure

The app is a **single-page application (SPA)** with tab-based navigation:

```
App.tsx (main container with tab navigation)
├── Home Tab
│   ├── Feature cards (3 creation modes)
│   ├── Design inspiration feed (grid of 20 images)
│   └── Filter chips (Room Type, Style, Budget)
└── My Page Tab
    └── Rendering history (in-progress and completed renders)
```

### Creation Flow Architecture

Each of the three creation modes (Place Object, Interior Design, Exterior Design) follows an identical flow pattern implemented as separate page components:

1. **Space Selection Page** - Choose room type from 6 categories
2. **Image Upload Page** - Upload custom image or select from 3 examples
3. **Room Analysis Page** - Simulates 3-step AI analysis (9 seconds total)
4. **Analysis Results Page** - Displays product recommendations and render button

Each page maintains its own React state and uses `useCallback` for state mutations. Navigation between pages uses conditional rendering based on state (`currentStep`).

### State Management Pattern

- Uses React hooks (useState, useContext, useCallback)
- No global state manager (Redux, Zustand, etc.)
- Per-page state is managed individually within each component
- Rendering queue tracked via `renderingQueue` state in App.tsx with toast notifications

### Component Organization

- **`src/components/ui/`** - 60+ shadcn/ui components (pre-built Radix UI wrappers)
- **`src/components/`** - Feature-specific components:
  - Page components: `CreationPage.tsx`, `RoomAnalysisPage.tsx`, `MyPageContent.tsx`
  - UI components: `FeatureCard.tsx`, `FeedCard.tsx`, `FilterChip.tsx`, etc.
  - Utility components: `ScanningImageOverlay.tsx`, `ProcessingIndicator.tsx`

### Styling System

- **Tailwind CSS** for utility-first styling
- **shadcn/ui components** provide pre-styled interactive elements
- **CSS variables** for theming in `src/styles/globals.css`
- **Motion library** for animations and transitions

### Data & Mock Data

The app uses hardcoded mock data with no backend:
- **18 design images** from Unsplash (filtered by room type and style)
- **Room types**: Living Room, Bedroom, Kitchen, Bathroom, Dining Room, Office
- **Styles**: Modern, Minimalist, Industrial, Scandinavian, Traditional, Contemporary
- **Budget ranges**: Under $1K, $1K-$5K, $5K-$10K, $10K-$25K, Over $25K
- **Product recommendations**: Hardcoded per analysis page
- **Rendering simulation**: 5-second processing time per request

## Key Dependencies & Their Purpose

| Library | Purpose |
|---------|---------|
| `react`, `react-dom` | Core framework |
| `@radix-ui/*` | Accessible component primitives |
| `shadcn/ui` | Pre-built UI components (via components/ui/) |
| `tailwind-css` | Utility-first styling |
| `motion` | Smooth animations and transitions |
| `lucide-react` | Icon library |
| `react-hook-form` | Form state management |
| `embla-carousel-react` | Image carousel functionality |
| `sonner` | Toast notifications |
| `recharts` | Data visualization (if needed) |
| `react-resizable-panels` | Resizable panel layouts |

## Common Development Tasks

### Adding a New Page/Creation Mode
1. Create a new component in `src/components/` that follows the 4-step flow pattern
2. Add state management for the 4 steps (`currentStep`, space selection, image, analysis)
3. Add navigation link in App.tsx's feature cards
4. Implement the same step progression pattern (space → upload → analysis → results)

### Modifying the Design Feed
- Image data is in the feed card map logic (search for image array definitions)
- Filter logic is in `FilterChip.tsx` and feed card filtering
- To add new images, add to the image data structure with room type and style tags

### Adjusting Rendering Queue Simulation
- 5-second timeout is hardcoded in rendering queue submission logic
- Progress updates simulate 0-100% over the processing duration
- Toast notifications triggered at submission and completion

### Styling Changes
- Use Tailwind classes in JSX
- Modify CSS variables in `src/styles/globals.css` for theme adjustments
- Components follow shadcn/ui patterns with `className` prop composition

## Build & Deployment

- Build target: `esnext` (modern JavaScript)
- Output format: ES modules
- No pre-rendering or static generation
- App is entirely client-side rendered

## Notable Implementation Details

### Vite Alias Configuration
The `vite.config.ts` includes extensive module aliases to resolve dependency version mismatches. These aliases map specific package versions to ensure the correct dependencies are loaded.

### Mobile Viewport
The app is designed for a fixed mobile viewport (375px × 812px). Responsive design is not a priority.

### Scanning Animation
`ScanningImageOverlay.tsx` provides a visual effect simulating AI analysis, with animated detection boxes scanning the uploaded image.

### Image Fallback Component
`src/components/figma/ImageWithFallback.tsx` handles image loading failures gracefully with fallback UI.
