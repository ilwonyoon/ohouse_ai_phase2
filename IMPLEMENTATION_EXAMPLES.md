# Implementation Examples

## 🚀 Step-by-Step Implementation Guide

This document provides **ready-to-use code examples** for each reusable component, showing exactly how to implement them.

---

## 1. IconCard Component

### Implementation

```tsx
// src/components/common/IconCard.tsx

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IconCardProps {
  variant: "feature" | "space" | "upload";
  icon: ReactNode;
  iconBgColor: string;
  title: string;
  onClick?: () => void;
  className?: string;
}

export function IconCard({
  variant,
  icon,
  iconBgColor,
  title,
  onClick,
  className,
}: IconCardProps) {
  // Variant-specific styles
  const variantStyles = {
    feature: "w-[150px] h-[100px] shrink-0",
    space: "w-full aspect-[4/3]",
    upload: "w-full aspect-[4/3] border-2 border-dashed",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        // Base styles
        "bg-card border border-border rounded-lg p-3",
        "flex flex-col items-start justify-between",
        "hover:bg-accent transition-colors",
        // Variant styles
        variantStyles[variant],
        className
      )}
    >
      <div
        className="size-8 rounded-full flex items-center justify-center"
        style={{ backgroundColor: iconBgColor }}
      >
        {icon}
      </div>
      <span className="text-sm text-left">{title}</span>
    </button>
  );
}
```

### Usage Examples

```tsx
// Replace FeatureCard
<IconCard
  variant="feature"
  icon={<span className="text-lg">🪑</span>}
  iconBgColor="#FFE5D9"
  title="Place an object in your room"
  onClick={() => handleFeatureCardClick("placeObject")}
/>

// Replace SpaceTypeCard
<IconCard
  variant="space"
  icon={<Sofa className="size-4 text-blue-600" />}
  iconBgColor="#DBEAFE"
  title="Living room"
  onClick={() => handleSpaceSelect("Living room")}
/>

// Replace UploadButton
<IconCard
  variant="upload"
  icon={<Upload className="size-6 text-primary" />}
  iconBgColor="transparent"
  title="Upload photo"
  onClick={handleUploadClick}
/>
```

---

## 2. ImageCard Component

### Implementation

```tsx
// src/components/common/ImageCard.tsx

import { ReactNode } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";

interface ImageCardProps {
  imageUrl: string;
  alt?: string;
  aspectRatio: "3/4" | "4/3" | "square" | "custom";
  customAspectRatio?: string;
  overlay?: ReactNode;
  label?: string;
  showProgress?: boolean;
  progress?: number;
  onClick?: () => void;
  className?: string;
}

export function ImageCard({
  imageUrl,
  alt = "Image",
  aspectRatio,
  customAspectRatio,
  overlay,
  label,
  showProgress = false,
  progress = 0,
  onClick,
  className,
}: ImageCardProps) {
  // Aspect ratio mapping
  const aspectRatioStyles = {
    "3/4": "aspect-[3/4]",
    "4/3": "aspect-[4/3]",
    square: "aspect-square",
    custom: customAspectRatio || "aspect-square",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-lg overflow-hidden",
        "hover:opacity-90 transition-opacity",
        aspectRatioStyles[aspectRatio],
        className
      )}
    >
      {/* Image */}
      <ImageWithFallback
        src={imageUrl}
        alt={alt}
        className="size-full object-cover"
      />

      {/* Progress Overlay */}
      {showProgress && (
        <>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="w-full space-y-2">
              <Progress
                value={progress}
                className="h-1 bg-white/20 [&>[data-slot=progress-indicator]]:bg-white"
              />
              <p className="text-white text-xs text-center font-medium">
                {Math.round(progress)}%
              </p>
            </div>
          </div>
        </>
      )}

      {/* Label */}
      {label && (
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
          <p className="text-white text-xs">{label}</p>
        </div>
      )}

      {/* Custom Overlay (like button, etc.) */}
      {overlay && overlay}
    </button>
  );
}
```

### Usage Examples

```tsx
// Replace FeedCard
<ImageCard
  imageUrl={imageUrl}
  alt="Interior design"
  aspectRatio="3/4"
  className="w-[167px]"
  overlay={
    <div
      onClick={(e) => {
        e.stopPropagation();
        onLikeToggle();
      }}
      className="absolute bottom-[10px] right-[10px] size-6 flex items-center justify-center cursor-pointer"
    >
      <Heart
        className={`size-6 text-white drop-shadow-lg transition-all ${
          isLiked ? "fill-white" : "fill-none"
        }`}
      />
    </div>
  }
  onClick={onClick}
/>

// Replace ExampleCard
<ImageCard
  imageUrl={imageUrl}
  alt="Example room"
  aspectRatio="4/3"
  onClick={onClick}
/>

// Replace MyPageContent rendering card
<ImageCard
  imageUrl={item.isComplete ? item.resultImage : item.originalImage}
  alt={`${item.roomType} rendering`}
  aspectRatio="square"
  label={item.roomType}
  showProgress={!item.isComplete}
  progress={item.progress}
/>
```

---

## 3. NavigationHeader Component

### Implementation

```tsx
// src/components/common/NavigationHeader.tsx

import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  backButtonLabel?: string;
  rightAction?: ReactNode;
  className?: string;
}

export function NavigationHeader({
  title,
  showBackButton = false,
  onBack,
  backButtonLabel,
  rightAction,
  className,
}: NavigationHeaderProps) {
  return (
    <div
      className={cn(
        "h-[44px] bg-background border-b border-border",
        "flex items-center px-4 shrink-0 relative",
        className
      )}
    >
      {/* Back Button */}
      {showBackButton && onBack && (
        <button
          onClick={onBack}
          className="absolute left-4 flex items-center gap-1 text-[17px] text-primary hover:opacity-70 transition-opacity active:opacity-50"
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
          {backButtonLabel && <span className="text-[17px]">{backButtonLabel}</span>}
        </button>
      )}

      {/* Title */}
      <h1
        className={cn(
          "text-[17px] font-semibold tracking-[-0.41px]",
          showBackButton ? "flex-1 text-center -ml-8" : "flex-1 text-center"
        )}
      >
        {title}
      </h1>

      {/* Right Action */}
      {rightAction && <div className="absolute right-4">{rightAction}</div>}
    </div>
  );
}
```

### Usage Examples

```tsx
// Replace App.tsx header
<NavigationHeader
  title={activeTab === "mypage" && previousPage ? "My Page" : "Ohouse ai"}
  showBackButton={activeTab === "mypage" && previousPage}
  onBack={handleBackFromMyPage}
  backButtonLabel={previousPage ? getPageTitle(previousPage) : undefined}
  rightAction={
    <RenderingQueueIndicator
      count={renderingQueue.length}
      progress={queueProgress}
      completedCount={completedRenderings.length}
      onClick={handleRenderingIndicatorClick}
    />
  }
/>

// Replace CreationPage.tsx header
<NavigationHeader
  title={title}
  showBackButton={true}
  onBack={handleBackToHome}
  rightAction={
    <RenderingQueueIndicator
      count={renderingQueueCount}
      progress={renderingQueueProgress}
      completedCount={completedCount}
      onClick={onRenderingStatusClick}
    />
  }
/>

// Replace RoomAnalysisPage.tsx header
<NavigationHeader
  title={`${roomType?.toLowerCase() ?? "Room"} refresh`}
  showBackButton={true}
  onBack={onBack}
  rightAction={
    <RenderingQueueIndicator
      count={renderingQueueCount}
      progress={renderingQueueProgress}
      completedCount={completedCount}
      onClick={onRenderingStatusClick}
    />
  }
/>
```

---

## 4. CircularIconButton Component

### Implementation

```tsx
// src/components/common/CircularIconButton.tsx

import { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface CircularIconButtonProps {
  size: "sm" | "md" | "lg";
  icon: ReactNode;
  bgColor?: string;
  showProgress?: boolean;
  progress?: number;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export function CircularIconButton({
  size,
  icon,
  bgColor,
  showProgress = false,
  progress = 0,
  onClick,
  className,
  ariaLabel,
}: CircularIconButtonProps) {
  // Size mapping
  const sizeStyles = {
    sm: "size-8",
    md: "size-12",
    lg: "size-16",
  };

  const radiusMap = {
    sm: 14,
    md: 20,
    lg: 28,
  };

  const radius = radiusMap[size];
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={cn(
        "relative rounded-full flex items-center justify-center",
        sizeStyles[size],
        onClick && "focus:outline-none focus:ring-2 focus:ring-primary active:scale-95 transition-transform",
        className
      )}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
      aria-label={ariaLabel}
    >
      {icon}

      {/* Progress Ring */}
      {showProgress && (
        <>
          {/* Background circle */}
          <svg className="absolute size-full -rotate-90" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r={radius}
              fill="none"
              stroke="rgba(0, 0, 0, 0.1)"
              strokeWidth="2"
            />
          </svg>

          {/* Progress circle */}
          <svg className="absolute size-full -rotate-90" viewBox="0 0 32 32">
            <motion.circle
              cx="16"
              cy="16"
              r={radius}
              fill="none"
              stroke="#030213"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              initial={false}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </svg>
        </>
      )}
    </Component>
  );
}
```

### Usage Examples

```tsx
// In IconCard (icon container)
<CircularIconButton
  size="sm"
  icon={<Sofa className="size-4 text-blue-600" />}
  bgColor="#DBEAFE"
/>

// In RenderingQueueIndicator
<CircularIconButton
  size="sm"
  icon={<span className="text-xs font-semibold">{count}</span>}
  showProgress={count > 0}
  progress={progress}
  onClick={onClick}
  ariaLabel={`${count} rendering requests in progress`}
/>

// In EmptyState
<CircularIconButton
  size="lg"
  icon={<Heart className="size-8 text-muted-foreground/50" />}
  bgColor="hsl(var(--muted))"
/>
```

---

## 5. AspectRatioContainer Component

### Implementation

```tsx
// src/components/common/AspectRatioContainer.tsx

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AspectRatioContainerProps {
  ratio: "3/4" | "4/3" | "16/9" | "square" | "custom";
  customRatio?: string;
  children: ReactNode;
  className?: string;
}

export function AspectRatioContainer({
  ratio,
  customRatio,
  children,
  className,
}: AspectRatioContainerProps) {
  const ratioStyles = {
    "3/4": "aspect-[3/4]",
    "4/3": "aspect-[4/3]",
    "16/9": "aspect-[16/9]",
    square: "aspect-square",
    custom: customRatio || "aspect-square",
  };

  return (
    <div className={cn(ratioStyles[ratio], className)}>
      {children}
    </div>
  );
}
```

### Usage Examples

```tsx
// In ImageCard
<AspectRatioContainer ratio="3/4" className="relative rounded-lg overflow-hidden">
  <ImageWithFallback src={imageUrl} alt={alt} className="size-full object-cover" />
</AspectRatioContainer>

// In ScanningImageOverlay
<AspectRatioContainer ratio="3/4" className="relative w-full">
  <ImageWithFallback src={imageUrl} alt={alt} className="size-full object-cover" />
  {/* Scanning effects */}
</AspectRatioContainer>

// Custom ratio
<AspectRatioContainer ratio="custom" customRatio="aspect-[21/9]">
  {children}
</AspectRatioContainer>
```

---

## 6. ProgressOverlay Component

### Implementation

```tsx
// src/components/common/ProgressOverlay.tsx

import { motion } from "motion/react";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";

interface ProgressOverlayProps {
  type: "bar" | "ring";
  progress: number;
  showPercentage?: boolean;
  overlay?: "dim" | "none";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressOverlay({
  type,
  progress,
  showPercentage = true,
  overlay = "dim",
  size = "md",
  className,
}: ProgressOverlayProps) {
  if (type === "bar") {
    return (
      <>
        {/* Dim overlay */}
        {overlay === "dim" && <div className="absolute inset-0 bg-black/40" />}

        {/* Progress bar */}
        <div className={cn("absolute inset-0 flex items-center justify-center px-6", className)}>
          <div className="w-full space-y-2">
            <Progress
              value={progress}
              className="h-1 bg-white/20 [&>[data-slot=progress-indicator]]:bg-white"
            />
            {showPercentage && (
              <p className="text-white text-xs text-center font-medium">
                {Math.round(progress)}%
              </p>
            )}
          </div>
        </div>
      </>
    );
  }

  // Ring type
  const sizeMap = {
    sm: { radius: 14, viewBox: "0 0 32 32", cx: 16, cy: 16 },
    md: { radius: 20, viewBox: "0 0 44 44", cx: 22, cy: 22 },
    lg: { radius: 28, viewBox: "0 0 60 60", cx: 30, cy: 30 },
  };

  const { radius, viewBox, cx, cy } = sizeMap[size];
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative", className)}>
      {/* Background circle */}
      <svg className="absolute size-full -rotate-90" viewBox={viewBox}>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(0, 0, 0, 0.1)"
          strokeWidth="2"
        />
      </svg>

      {/* Progress circle */}
      <svg className="absolute size-full -rotate-90" viewBox={viewBox}>
        <motion.circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#030213"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          initial={false}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </svg>

      {/* Percentage text */}
      {showPercentage && (
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}
```

### Usage Examples

```tsx
// In MyPageContent (bar type)
<ImageCard
  imageUrl={item.originalImage}
  aspectRatio="square"
  overlay={
    !item.isComplete && (
      <ProgressOverlay
        type="bar"
        progress={item.progress}
        showPercentage={true}
        overlay="dim"
      />
    )
  }
/>

// In RenderingQueueIndicator (ring type)
<ProgressOverlay
  type="ring"
  progress={progress}
  showPercentage={false}
  overlay="none"
  size="sm"
/>
```

---

## 7. EmptyState Component

### Implementation

```tsx
// src/components/common/EmptyState.tsx

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "h-full flex flex-col items-center justify-center",
        "text-muted-foreground px-8 text-center",
        className
      )}
    >
      {/* Icon container */}
      <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon}
      </div>

      {/* Title */}
      <h3 className="mb-2">{title}</h3>

      {/* Description */}
      <p className="text-sm">{description}</p>

      {/* Optional action button */}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
```

### Usage Examples

```tsx
// In MyPageContent
<EmptyState
  icon={<Heart className="size-8 text-muted-foreground/50" />}
  title="No renderings yet"
  description="Your generated interior designs will appear here"
/>

// With action button
<EmptyState
  icon={<Search className="size-8 text-muted-foreground/50" />}
  title="No results found"
  description="Try adjusting your filters or search terms"
  action={
    <Button variant="outline" onClick={handleClearFilters}>
      Clear Filters
    </Button>
  }
/>

// Connection error
<EmptyState
  icon={<WifiOff className="size-8 text-muted-foreground/50" />}
  title="Connection error"
  description="Please check your internet connection and try again"
  action={
    <Button onClick={handleRetry}>
      Retry
    </Button>
  }
/>
```

---

## 8. ChipButton Component

### Implementation

```tsx
// src/components/common/ChipButton.tsx

import { ReactNode, useState, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ChipButtonProps {
  label: string;
  selected: boolean;
  icon?: ReactNode;
  variant: "filter" | "product" | "tag";
  onClick: () => void;
  draggable?: boolean;
  className?: string;
}

export function ChipButton({
  label,
  selected,
  icon,
  variant,
  onClick,
  draggable = false,
  className,
}: ChipButtonProps) {
  const [isDragging, setIsDragging] = useState(false);
  const hasMoved = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable) return;
    setIsDragging(true);
    hasMoved.current = false;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = () => {
    if (!draggable || !isDragging) return;
    hasMoved.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggable) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    // Only trigger onClick if we didn't drag
    if (!hasMoved.current) {
      onClick();
    }
  };

  const handleClick = () => {
    if (!draggable) {
      onClick();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn(
        // Base styles
        "h-[40px] px-4 shrink-0 rounded-full",
        "flex items-center gap-2",
        "transition-all",
        // Selected state
        selected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background border-border",
        // Border
        "border",
        // Hover (only if not draggable)
        !draggable && "hover:bg-accent",
        // Dragging cursor
        draggable && (isDragging ? "cursor-grabbing" : "cursor-grab"),
        // Product variant gets extra ring when selected
        variant === "product" && selected && "ring-2 ring-blue-400 ring-offset-2",
        className
      )}
    >
      <span className="text-sm whitespace-nowrap">{label}</span>
      {icon && icon}
    </motion.button>
  );
}
```

### Usage Examples

```tsx
// Replace FilterChip
<ChipButton
  label={selectedValue || "Room Type"}
  selected={!!selectedValue}
  icon={<ChevronDown className="size-4" />}
  variant="filter"
  onClick={handleToggleDropdown}
/>

// Replace ProductChip (draggable)
<ChipButton
  label="Sofa"
  selected={isSelected}
  variant="product"
  onClick={handleSelect}
  draggable={true}
/>

// Tag variant (new use case)
<ChipButton
  label="Modern"
  selected={selectedTags.includes("Modern")}
  variant="tag"
  onClick={() => handleTagToggle("Modern")}
/>
```

---

## 🔄 Migration Checklist

### For each component:

- [ ] Create new component file in `src/components/common/`
- [ ] Add TypeScript types with JSDoc comments
- [ ] Implement all variants needed
- [ ] Test component in isolation
- [ ] Update one existing usage
- [ ] Verify visual consistency
- [ ] Update all other usages
- [ ] Delete old component file
- [ ] Update imports across codebase
- [ ] Run linter and fix any issues
- [ ] Test the entire flow

---

## 📝 Testing Strategy

### Unit Tests (Optional but Recommended)

```tsx
// src/components/common/__tests__/IconCard.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import { IconCard } from "../IconCard";
import { Sofa } from "lucide-react";

describe("IconCard", () => {
  it("renders with correct title", () => {
    render(
      <IconCard
        variant="space"
        icon={<Sofa />}
        iconBgColor="#DBEAFE"
        title="Living room"
      />
    );
    expect(screen.getByText("Living room")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(
      <IconCard
        variant="space"
        icon={<Sofa />}
        iconBgColor="#DBEAFE"
        title="Living room"
        onClick={handleClick}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies correct variant styles", () => {
    const { container } = render(
      <IconCard
        variant="upload"
        icon={<Sofa />}
        iconBgColor="#DBEAFE"
        title="Upload"
      />
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("border-dashed");
  });
});
```

---

## 🎯 Performance Considerations

### 1. Memoization

```tsx
// For components that receive complex props
import { memo } from "react";

export const IconCard = memo(function IconCard({ ... }) {
  // Component implementation
});
```

### 2. Lazy Loading

```tsx
// For components not immediately visible
import { lazy, Suspense } from "react";

const EmptyState = lazy(() => import("./common/EmptyState"));

// Usage
<Suspense fallback={<div>Loading...</div>}>
  <EmptyState {...props} />
</Suspense>
```

### 3. Avoid Inline Functions

```tsx
// ❌ Bad - creates new function on every render
<IconCard onClick={() => handleClick(id)} />

// ✅ Good - stable reference
const handleIconClick = useCallback(() => handleClick(id), [id]);
<IconCard onClick={handleIconClick} />
```

---

## 🚀 Quick Start Script

```bash
# Create all component files at once
mkdir -p src/components/common

touch src/components/common/IconCard.tsx
touch src/components/common/ImageCard.tsx
touch src/components/common/NavigationHeader.tsx
touch src/components/common/CircularIconButton.tsx
touch src/components/common/AspectRatioContainer.tsx
touch src/components/common/ProgressOverlay.tsx
touch src/components/common/EmptyState.tsx
touch src/components/common/ChipButton.tsx

# Create index file for easy imports
touch src/components/common/index.ts
```

```tsx
// src/components/common/index.ts
export { IconCard } from "./IconCard";
export { ImageCard } from "./ImageCard";
export { NavigationHeader } from "./NavigationHeader";
export { CircularIconButton } from "./CircularIconButton";
export { AspectRatioContainer } from "./AspectRatioContainer";
export { ProgressOverlay } from "./ProgressOverlay";
export { EmptyState } from "./EmptyState";
export { ChipButton } from "./ChipButton";
```

---

**Last Updated:** October 19, 2025  
**Ready for Implementation:** Yes ✅

