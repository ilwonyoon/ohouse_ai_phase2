# Component Patterns - Visual Guide

## 🎨 Pattern Visualization

### Pattern 1: IconCard (Used 3x)

```
┌─────────────────────────────────────────────────────────────┐
│                    ICONCARD PATTERN                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Current Implementations:                                   │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ FeatureCard  │  │ SpaceTypeCard│  │ UploadButton │    │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤    │
│  │ ┌──────┐     │  │ ┌──────┐     │  │ ┌──────┐     │    │
│  │ │  🪑  │     │  │ │  🛋️  │     │  │ │  ⬆️  │     │    │
│  │ └──────┘     │  │ └──────┘     │  │ └──────┘     │    │
│  │              │  │              │  │              │    │
│  │ Place an     │  │ Living room  │  │ Upload photo │    │
│  │ object       │  │              │  │              │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│   150x100px         aspect-[4/3]      aspect-[4/3]        │
│   solid border      solid border      dashed border       │
│                                                             │
│  Unified Component:                                         │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              <IconCard />                           │  │
│  │  - variant: "feature" | "space" | "upload"         │  │
│  │  - icon: ReactNode                                  │  │
│  │  - iconBgColor: string                              │  │
│  │  - title: string                                    │  │
│  │  - aspectRatio?: "4/3" | "3/2"                     │  │
│  │  - borderStyle?: "solid" | "dashed"                │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### Pattern 2: ImageCard (Used 3x)

```
┌─────────────────────────────────────────────────────────────┐
│                   IMAGECARD PATTERN                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Current Implementations:                                   │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│  │ FeedCard │  │ Example  │  │ MyPage   │                │
│  │          │  │ Card     │  │ Card     │                │
│  │ [Image]  │  │ [Image]  │  │ [Image]  │                │
│  │          │  │          │  │ ▓▓▓▓▓▓▓▓ │ ← Progress     │
│  │          │  │          │  │ ████ 75% │   Overlay      │
│  │       ♥️ │  │          │  │ Living   │ ← Label        │
│  └──────────┘  └──────────┘  └──────────┘                │
│   167px          full width    grid item                   │
│   aspect-[3/4]   aspect-[4/3]  aspect-square              │
│   like button    simple         progress bar              │
│                                                             │
│  Unified Component:                                         │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              <ImageCard />                          │  │
│  │  - imageUrl: string                                 │  │
│  │  - aspectRatio: "3/4" | "4/3" | "square"          │  │
│  │  - overlay?: ReactNode (like button, progress)     │  │
│  │  - label?: string                                   │  │
│  │  - showProgress?: boolean                           │  │
│  │  - progress?: number                                │  │
│  │  - onClick?: () => void                             │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### Pattern 3: NavigationHeader (Used 3x)

```
┌─────────────────────────────────────────────────────────────┐
│                NAVIGATIONHEADER PATTERN                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Current Implementations:                                   │
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │ Home Page Header                                  │    │
│  ├───────────────────────────────────────────────────┤    │
│  │  [←]            Ohouse ai                    [3]  │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │ Creation Page Header                              │    │
│  ├───────────────────────────────────────────────────┤    │
│  │  [←]         Place an object                [2]   │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │ Analysis Page Header                              │    │
│  ├───────────────────────────────────────────────────┤    │
│  │  [←]        living room refresh             [1]   │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  Common Structure:                                          │
│  - Height: 44px (iOS standard)                             │
│  - Back button: Left side, ArrowLeft icon                  │
│  - Title: Center, 17px font, semibold                      │
│  - Action: Right side (RenderingQueueIndicator)            │
│  - Border bottom                                            │
│                                                             │
│  Unified Component:                                         │
│  ┌─────────────────────────────────────────────────────┐  │
│  │         <NavigationHeader />                        │  │
│  │  - title: string                                    │  │
│  │  - showBackButton?: boolean                         │  │
│  │  - onBack?: () => void                              │  │
│  │  - rightAction?: ReactNode                          │  │
│  │  - backButtonLabel?: string                         │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### Pattern 4: Circular Icon Pattern (Used 4+x)

```
┌─────────────────────────────────────────────────────────────┐
│              CIRCULAR ICON PATTERN                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Variations:                                                │
│                                                             │
│  ┌────┐  ┌────┐  ┌────┐  ┌────────┐                      │
│  │ 🪑 │  │ 🛋️ │  │ ⬆️ │  │   3    │                      │
│  └────┘  └────┘  └────┘  └────────┘                      │
│   Icon    Icon    Icon    Progress                         │
│   Only    Only    Only    Ring                             │
│                                                             │
│  Sizes:                                                     │
│  - size-8  (32px) - Standard icons                         │
│  - size-12 (48px) - Medium emphasis                        │
│  - size-16 (64px) - Empty states                           │
│                                                             │
│  Features:                                                  │
│  - Colored background                                       │
│  - Optional progress ring overlay                           │
│  - Optional click handler                                   │
│  - Consistent centering (flex items-center justify-center) │
│                                                             │
│  Unified Component:                                         │
│  ┌─────────────────────────────────────────────────────┐  │
│  │       <CircularIconButton />                        │  │
│  │  - size: "sm" | "md" | "lg"                        │  │
│  │  - icon: ReactNode                                  │  │
│  │  - bgColor?: string                                 │  │
│  │  - showProgress?: boolean                           │  │
│  │  - progress?: number (0-100)                        │  │
│  │  - onClick?: () => void                             │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### Pattern 5: Aspect Ratio Containers (Used 6+x)

```
┌─────────────────────────────────────────────────────────────┐
│            ASPECT RATIO PATTERN                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Current Usage:                                             │
│                                                             │
│  ┌─────────┐  ┌──────────┐  ┌───┐                         │
│  │         │  │          │  │   │                         │
│  │  3:4    │  │   4:3    │  │ 1 │                         │
│  │         │  │          │  │ : │                         │
│  │         │  └──────────┘  │ 1 │                         │
│  │         │                 └───┘                         │
│  └─────────┘                                                │
│   FeedCard    SpaceTypeCard   MyPage                       │
│   Scanning    ExampleCard     (square)                     │
│   Overlay     UploadButton                                 │
│                                                             │
│  Locations:                                                 │
│  - FeedCard.tsx: aspect-[3/4]                              │
│  - SpaceTypeCard.tsx: aspect-[4/3]                         │
│  - ExampleCard.tsx: aspect-[4/3]                           │
│  - UploadButton.tsx: aspect-[4/3]                          │
│  - ScanningImageOverlay.tsx: aspect-[3/4]                  │
│  - MyPageContent.tsx: aspect-square                        │
│                                                             │
│  Unified Component:                                         │
│  ┌─────────────────────────────────────────────────────┐  │
│  │      <AspectRatioContainer />                       │  │
│  │  - ratio: "3/4" | "4/3" | "16/9" | "square"       │  │
│  │  - className?: string                               │  │
│  │  - children: ReactNode                              │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### Pattern 6: Progress Indicators (Used 2x)

```
┌─────────────────────────────────────────────────────────────┐
│             PROGRESS INDICATOR PATTERN                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Type 1: Progress Bar (MyPageContent)                      │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ [Image]                                             │  │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  │                  75%                                │  │
│  └─────────────────────────────────────────────────────┘  │
│  - Dim overlay (bg-black/40)                               │
│  - White progress bar                                       │
│  - Percentage text                                          │
│                                                             │
│  Type 2: Progress Ring (RenderingQueueIndicator)           │
│  ┌────┐                                                    │
│  │ ◐3 │  ← Circular progress ring                         │
│  └────┘                                                    │
│  - SVG circle with strokeDashoffset                        │
│  - Count in center                                          │
│  - Animated transition                                      │
│                                                             │
│  Unified Component:                                         │
│  ┌─────────────────────────────────────────────────────┐  │
│  │         <ProgressOverlay />                         │  │
│  │  - type: "bar" | "ring"                            │  │
│  │  - progress: number (0-100)                         │  │
│  │  - showPercentage?: boolean                         │  │
│  │  - overlay?: "dim" | "none"                        │  │
│  │  - size?: "sm" | "md" | "lg"                       │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### Pattern 7: Chip Buttons (Used 2x)

```
┌─────────────────────────────────────────────────────────────┐
│                CHIP BUTTON PATTERN                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Type 1: FilterChip (Dropdown)                             │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │ Room Type  ▼ │  │ Modern     ▼ │ ← Selected            │
│  └──────────────┘  └──────────────┘                       │
│   Unselected        Selected (blue bg)                     │
│                                                             │
│  Type 2: ProductChip (Draggable)                           │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │    Sofa      │  │ Coffee Table │                       │
│  └──────────────┘  └──────────────┘                       │
│   Unselected        Selected (blue bg + ring)              │
│   + Draggable       + Tap to select                        │
│                                                             │
│  Common Properties:                                         │
│  - Height: 40px                                             │
│  - Padding: px-4                                            │
│  - Border radius: rounded-full                              │
│  - Flex layout: items-center gap-2                         │
│  - Selected state: bg-primary text-primary-foreground      │
│  - Unselected state: bg-background border-border           │
│                                                             │
│  Unified Component:                                         │
│  ┌─────────────────────────────────────────────────────┐  │
│  │           <ChipButton />                            │  │
│  │  - label: string                                    │  │
│  │  - selected: boolean                                │  │
│  │  - icon?: ReactNode                                 │  │
│  │  - variant: "filter" | "product" | "tag"          │  │
│  │  - onClick: () => void                              │  │
│  │  - draggable?: boolean                              │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### Pattern 8: Empty State (Used 1x, expandable)

```
┌─────────────────────────────────────────────────────────────┐
│                 EMPTY STATE PATTERN                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Current Implementation (MyPageContent):                    │
│                                                             │
│              ┌────────────────────┐                         │
│              │                    │                         │
│              │      ┌──────┐      │                         │
│              │      │  ♥️  │      │                         │
│              │      └──────┘      │                         │
│              │                    │                         │
│              │ No renderings yet  │                         │
│              │                    │                         │
│              │ Your generated     │                         │
│              │ interior designs   │                         │
│              │ will appear here   │                         │
│              │                    │                         │
│              └────────────────────┘                         │
│                                                             │
│  Structure:                                                 │
│  - Centered container (flex flex-col items-center)         │
│  - Large circular icon background (size-16, rounded-full)  │
│  - Icon inside (size-8)                                    │
│  - Heading (h3, mb-2)                                      │
│  - Description text (text-sm, text-muted-foreground)       │
│  - Optional action button                                   │
│                                                             │
│  Future Use Cases:                                          │
│  - No favorites yet                                         │
│  - No search results                                        │
│  - No history                                               │
│  - No notifications                                         │
│  - Connection error                                         │
│                                                             │
│  Unified Component:                                         │
│  ┌─────────────────────────────────────────────────────┐  │
│  │           <EmptyState />                            │  │
│  │  - icon: ReactNode                                  │  │
│  │  - title: string                                    │  │
│  │  - description: string                              │  │
│  │  - action?: ReactNode (optional button)             │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Component Dependency Graph

```
┌─────────────────────────────────────────────────────────────┐
│                  COMPONENT HIERARCHY                        │
└─────────────────────────────────────────────────────────────┘

App.tsx
├── NavigationHeader ⭐ (reusable)
│   ├── ArrowLeft icon
│   └── RenderingQueueIndicator
│       └── CircularIconButton ⭐ (reusable)
│
├── FeatureCard → IconCard ⭐ (reusable)
│   └── CircularIconButton ⭐ (reusable)
│
├── FilterChip → ChipButton ⭐ (reusable)
│
├── FeedCard → ImageCard ⭐ (reusable)
│   ├── AspectRatioContainer ⭐ (reusable)
│   └── ImageWithFallback
│
└── MyPageContent
    ├── EmptyState ⭐ (reusable)
    │   └── CircularIconButton ⭐ (reusable)
    └── ImageCard ⭐ (reusable)
        ├── AspectRatioContainer ⭐ (reusable)
        ├── ProgressOverlay ⭐ (reusable)
        └── ImageWithFallback

CreationPage.tsx
├── NavigationHeader ⭐ (reusable)
│   └── RenderingQueueIndicator
│       └── CircularIconButton ⭐ (reusable)
│
├── SpaceTypeCard → IconCard ⭐ (reusable)
│   ├── CircularIconButton ⭐ (reusable)
│   └── AspectRatioContainer ⭐ (reusable)
│
├── UploadButton → IconCard ⭐ (reusable)
│   ├── CircularIconButton ⭐ (reusable)
│   └── AspectRatioContainer ⭐ (reusable)
│
└── ExampleCard → ImageCard ⭐ (reusable)
    ├── AspectRatioContainer ⭐ (reusable)
    └── ImageWithFallback

RoomAnalysisPage.tsx
├── NavigationHeader ⭐ (reusable)
│   └── RenderingQueueIndicator
│       └── CircularIconButton ⭐ (reusable)
│
├── ScanningImageOverlay
│   ├── AspectRatioContainer ⭐ (reusable)
│   ├── ImageWithFallback
│   └── ProductChip → ChipButton ⭐ (reusable)
│
└── ProcessingIndicator
    └── (custom animation, keep as-is)

⭐ = Reusable component to be created
```

---

## 🎯 Visual Impact Summary

### Before Refactoring:
```
20+ component files
~2,500 lines of component code
High duplication (3-6x for some patterns)
Inconsistent spacing/styling
Hard to maintain
```

### After Refactoring:
```
12+ component files (8 removed/consolidated)
~2,060 lines of component code (~440 lines saved)
Zero duplication for common patterns
Consistent design system usage
Easy to maintain and extend
```

---

## 🔄 Component Relationships

```
┌──────────────────────────────────────────────────────────┐
│                 REUSABILITY MATRIX                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  IconCard                                                │
│  ├── Used by: FeatureCard, SpaceTypeCard, UploadButton  │
│  └── Uses: CircularIconButton, AspectRatioContainer     │
│                                                          │
│  ImageCard                                               │
│  ├── Used by: FeedCard, ExampleCard, MyPageContent      │
│  └── Uses: AspectRatioContainer, ProgressOverlay        │
│                                                          │
│  NavigationHeader                                        │
│  ├── Used by: App, CreationPage, RoomAnalysisPage       │
│  └── Uses: CircularIconButton (via RenderingIndicator)  │
│                                                          │
│  CircularIconButton                                      │
│  ├── Used by: IconCard, NavigationHeader, EmptyState    │
│  └── Uses: (none - base component)                      │
│                                                          │
│  AspectRatioContainer                                    │
│  ├── Used by: IconCard, ImageCard, ScanningOverlay      │
│  └── Uses: (none - base component)                      │
│                                                          │
│  ProgressOverlay                                         │
│  ├── Used by: ImageCard, RenderingQueueIndicator        │
│  └── Uses: (none - base component)                      │
│                                                          │
│  ChipButton                                              │
│  ├── Used by: FilterChip, ProductChip                   │
│  └── Uses: (none - base component)                      │
│                                                          │
│  EmptyState                                              │
│  ├── Used by: MyPageContent (+ future pages)            │
│  └── Uses: CircularIconButton                           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 📐 Design Token Mapping

```
┌──────────────────────────────────────────────────────────┐
│          DESIGN TOKENS → COMPONENTS                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  SPACING (2, 4, 6, 8, 12, 16, 20, 24, 32px)            │
│  ├── IconCard: p-3 (12px)                               │
│  ├── ImageCard: (varies by content)                     │
│  ├── NavigationHeader: px-4 (16px)                      │
│  ├── ChipButton: px-4 (16px), h-[40px]                 │
│  └── EmptyState: px-8 (32px)                            │
│                                                          │
│  RADIUS (xs:2, sm:6, md:8, lg:10, xl:14, 2xl:16, full) │
│  ├── IconCard: rounded-lg (10px)                        │
│  ├── ImageCard: rounded-lg (10px)                       │
│  ├── CircularIconButton: rounded-full (9999px)          │
│  ├── ChipButton: rounded-full (9999px)                  │
│  └── EmptyState icon: rounded-full (9999px)             │
│                                                          │
│  COLORS (Primary, semantic, opacity variants)           │
│  ├── IconCard: bg-card, border-border, hover:bg-accent  │
│  ├── ImageCard: (image-based)                           │
│  ├── NavigationHeader: bg-background, border-border     │
│  ├── ChipButton: bg-primary (selected), bg-background   │
│  └── EmptyState: text-muted-foreground                  │
│                                                          │
│  TYPOGRAPHY (xs:12, sm:14, base:16, lg:18, xl:20)      │
│  ├── IconCard: text-sm (14px)                           │
│  ├── NavigationHeader: text-[17px] (iOS standard)       │
│  ├── ChipButton: text-sm (14px)                         │
│  └── EmptyState: h3 + text-sm                           │
│                                                          │
│  SHADOWS (sm, md, lg, xl, glow)                         │
│  ├── IconCard: (none by default)                        │
│  ├── ChipButton: shadow-lg (when floating)              │
│  └── ProductBottomSheet: shadow-sm                      │
│                                                          │
│  ANIMATION (150ms, 350ms, 500ms)                        │
│  ├── IconCard: transition-colors (150ms)                │
│  ├── NavigationHeader: SLIDE_ANIMATION_CONFIG (350ms)   │
│  ├── ProgressOverlay: transition (300ms)                │
│  └── ChipButton: transition-all (150ms)                 │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

**Visual Guide Last Updated:** October 19, 2025  
**Purpose:** Help developers quickly understand component patterns and relationships

