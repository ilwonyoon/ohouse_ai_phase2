# Design System Implementation Plan

## Design Foundation Tokens

### **1. Color Tokens** ✅
- Primary colors: Dark purple/black (`#030213`), white (`#ffffff`)
- Semantic colors: Success (green), Error (red), Warning (orange), Info (blue)
- Neutral scale: Black, white, grays at multiple levels
- Accent colors: Current accents already defined
- Backgrounds: Light/dark mode variants
- Borders: Standard border colors

### **2. Typography Tokens** ✅
- Font families: System sans-serif, monospace
- Font sizes: xs, sm, base, lg, xl, 2xl (12px, 14px, 16px, 18px, 20px, 24px)
- Font weights: Regular (400), Medium (500), Semibold (600)
- Line heights: Standardized per size
- Letter spacing: Default + custom variants
- **Scale**: H1-H6, Body, Caption, Label

### **3. Spacing Tokens** ✅
- Base scale: `2, 4, 6, 8, 12, 16, 20, 24, 32` (in pixels)
- Small spacing (2-8px): Primarily used for text combinations
- Medium spacing (12-16px): Component internal spacing
- Large spacing (20-24px): Component-to-component spacing
- Extra large (32px): Section separation

**Spacing Logic:**
- `2-4px`: Tight text combinations
- `6-8px`: Element spacing within components
- `12-16px`: Component internal spacing
- `20-24px`: Component-to-component spacing
- `32px`: Section separation

### **4. Corner Radius Tokens** ✅
- Base: 10px (--radius)
- Scale: xs (2px), sm (6px), md (8px), lg (10px), xl (14px), 2xl (16px), full (9999px)

### **5. Additional Foundation Tokens**

#### Shadow/Elevation
- `shadow-sm`: Subtle (0 1px 3px, 0 1px 2px)
- `shadow-md`: Medium (0 4px 6px -1px, 0 2px 4px -2px)
- `shadow-lg`: Large (0 10px 15px -3px, 0 4px 6px -4px)
- `shadow-xl`: Extra Large (0 20px 25px -5px, 0 8px 10px -6px)
- `glow-blue`: Blue glow effect (0 0 8px rgba(59,130,246,0.8))

#### Motion/Animation
- **Duration**: Fast (150ms), Base (350ms), Slow (500ms)
- **Easing**:
  - `ease-in-out`: cubic-bezier(.4, 0, .2, 1)
  - `custom`: cubic-bezier(.32, .72, 0, 1)
- **Z-index Scale**: Base (10), Overlay (20), Modal (30), Toast (50)

#### Opacity
- Full: 1
- Hover: 0.9
- Disabled: 0.5
- Subtle: 0.3

#### Border Width
- Thin: 1px
- Medium: 2px

#### Focus States
- Blue outline (2px, rgba(59,130,246,0.5))

---

## Design System View Structure

### DesignSystemViewer Component
Display all tokens visually:
- Color palette with hex/OKLCH values and contrast ratios
- Typography scale (headings, body, labels)
- Spacing grid (visual representation)
- Corner radius samples
- Shadow/elevation examples
- Motion preview (animations)
- Component states (button, input, card variants)
- Z-index scale visualization

### View Toggle Implementation
```
[Flow View] ← → [Design System View]
├─ Flow View: Current mobile app prototype
└─ Design System View: Interactive design token reference
```

---

## Implementation Steps

1. Create `src/designSystem/tokens.ts` - Centralized token definitions
2. Create `src/designSystem/styles.css` - CSS variables from tokens
3. Create `src/components/DesignSystemViewer.tsx` - Interactive token showcase
4. Add toggle button to App.tsx - Switch between "Flow View" and "Design System View"
5. Apply design tokens to existing components for consistency
6. Test and verify design system implementation

---

## Token Categories

### Color System
- Primary: `#030213` (Dark), `#ffffff` (Light)
- Semantic: Success, Error, Warning, Info, Neutral
- Opacity variants for each color

### Typography System
- **Display**: H1-H3 (larger headings)
- **Body**: Base text, small, medium
- **Caption**: Labels, hints, metadata
- **Mono**: Code, monospace text

### Spacing System
- **xs**: 2px
- **sm**: 4px
- **md**: 6px
- **base**: 8px
- **lg**: 12px
- **xl**: 16px
- **2xl**: 20px
- **3xl**: 24px
- **4xl**: 32px

### Radius System
- **xs**: 2px
- **sm**: 6px
- **md**: 8px
- **base**: 10px
- **lg**: 14px
- **xl**: 16px
- **full**: 9999px

### Shadow System
- **sm**: Subtle shadows
- **md**: Medium shadows
- **lg**: Large shadows
- **xl**: Extra large shadows
- **glow**: Color-specific glow effects

### Animation System
- **Duration**: 150ms (fast), 350ms (base), 500ms (slow)
- **Easing**: Standard ease functions + custom cubic-bezier
- **Z-index**: 10 (base), 20 (overlay), 30 (modal), 50 (toast)

