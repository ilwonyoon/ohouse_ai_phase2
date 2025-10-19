import React, { useState } from 'react';
import { designTokens } from '../designSystem/tokens';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check } from 'lucide-react';

export const DesignSystemViewer: React.FC = () => {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedValue(value);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  // Calculate contrast ratio (simplified WCAG formula)
  const getLuminance = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  };

  const getContrastRatio = (hex1: string, hex2: string) => {
    const l1 = getLuminance(hex1);
    const l2 = getLuminance(hex2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
  };

  return (
    <div className="w-full h-full overflow-auto bg-white">
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Design System</h1>
          <p className="text-gray-600">Ohouse AI Design Tokens & Components</p>
        </div>

        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="spacing">Spacing</TabsTrigger>
            <TabsTrigger value="radius">Radius</TabsTrigger>
            <TabsTrigger value="shadows">Shadows</TabsTrigger>
            <TabsTrigger value="animation">Animation</TabsTrigger>
          </TabsList>

          {/* ==================== COLORS TAB ==================== */}
          <TabsContent value="colors" className="space-y-12">
            {/* Primary Colors */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Primary Colors</h2>
              <div className="grid grid-cols-2 gap-6">
                {Object.entries(designTokens.color.primary).map(([name, value]) => (
                  <div
                    key={name}
                    className="rounded-lg overflow-hidden border border-gray-200"
                  >
                    <div
                      className="h-32 w-full"
                      style={{ backgroundColor: value as string }}
                    />
                    <div className="p-4 bg-gray-50">
                      <p className="font-semibold text-gray-900">{name}</p>
                      <p className="text-sm text-gray-600 font-mono">{value}</p>
                      <button
                        onClick={() => copyToClipboard(value as string)}
                        className="mt-2 flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700"
                      >
                        {copiedValue === value ? (
                          <Check size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                        {copiedValue === value ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Semantic Colors */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Semantic Colors</h2>
              <div className="grid grid-cols-4 gap-6">
                {Object.entries(designTokens.color.semantic).map(([name, value]) => (
                  <div
                    key={name}
                    className="rounded-lg overflow-hidden border border-gray-200"
                  >
                    <div
                      className="h-24 w-full"
                      style={{ backgroundColor: value }}
                    />
                    <div className="p-3 bg-gray-50">
                      <p className="font-semibold text-gray-900 text-sm">{name}</p>
                      <p className="text-xs text-gray-600 font-mono">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Neutral Scale */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Neutral Scale</h2>
              <div className="space-y-3">
                {Object.entries(designTokens.color.neutral).map(([name, value]) => (
                  <div key={name} className="flex items-center gap-4">
                    <div
                      className="w-24 h-12 rounded-md border border-gray-200"
                      style={{ backgroundColor: value }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{name}</p>
                      <p className="text-sm text-gray-600 font-mono">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Contrast Ratios */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Contrast Ratios (WCAG)</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-semibold text-gray-900 mb-3">Dark on Light</p>
                  <p className="text-sm text-gray-700">
                    Primary Dark on Primary Light:
                    <span className="font-mono ml-2">
                      {getContrastRatio(
                        designTokens.color.primary.dark,
                        designTokens.color.primary.light
                      )}
                      :1
                    </span>
                  </p>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* ==================== TYPOGRAPHY TAB ==================== */}
          <TabsContent value="typography" className="space-y-12">
            {/* Typography Scale */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Typography Scale</h2>
              <div className="space-y-8">
                {Object.entries(designTokens.typography.scale).map(([name, style]) => (
                  <div key={name} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div
                      style={{
                        fontSize: (style as any).size,
                        fontWeight: (style as any).weight,
                        lineHeight: (style as any).lineHeight,
                      }}
                      className="mb-3 text-gray-900"
                    >
                      The quick brown fox jumps over the lazy dog
                    </div>
                    <div className="text-sm text-gray-600 space-y-1 font-mono">
                      <p>
                        <span className="font-semibold">Name:</span> {name}
                      </p>
                      <p>
                        <span className="font-semibold">Size:</span> {(style as any).size}
                      </p>
                      <p>
                        <span className="font-semibold">Weight:</span> {(style as any).weight}
                      </p>
                      <p>
                        <span className="font-semibold">Line Height:</span> {(style as any).lineHeight}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Font Sizes */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Font Sizes</h2>
              <div className="space-y-4">
                {Object.entries(designTokens.typography.fontSize).map(([name, values]) => (
                  <div key={name} className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
                    <div
                      style={{ fontSize: (values as any).size }}
                      className="flex-shrink-0 w-24 text-gray-900 font-semibold"
                    >
                      Aa
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{name}</p>
                      <p className="text-sm text-gray-600 font-mono">
                        {(values as any).size} / {(values as any).lineHeight}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Font Weights */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Font Weights</h2>
              <div className="space-y-4">
                {Object.entries(designTokens.typography.fontWeight).map(([name, weight]) => (
                  <div key={name} className="p-4 bg-gray-50 rounded-lg">
                    <p style={{ fontWeight: weight as any }} className="text-gray-900 mb-2">
                      The quick brown fox jumps over the lazy dog
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">{name}:</span> {weight}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* ==================== SPACING TAB ==================== */}
          <TabsContent value="spacing" className="space-y-12">
            {/* Spacing Scale */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Spacing Scale</h2>
              <div className="space-y-6">
                {Object.entries(designTokens.spacing).map(([name, value]) => (
                  <div key={name} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-end gap-4 mb-3">
                      <div
                        style={{ width: value, height: '40px' }}
                        className="bg-blue-500 rounded"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{name}</p>
                        <p className="text-sm text-gray-600">{value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Spacing Grid */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Component Spacing Guide</h2>
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">Text Combinations (2-8px)</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-700">Label</p>
                      <p style={{ marginTop: '2px' }} className="text-gray-600">
                        Input hint text (2px gap)
                      </p>
                    </div>
                    <div className="border-t border-gray-200 my-3" />
                    <div>
                      <p className="text-gray-700">Heading</p>
                      <p style={{ marginTop: '4px' }} className="text-gray-600">
                        Subheading text (4px gap)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Component Internal Spacing (12-16px)
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="h-8 bg-blue-200 rounded" />
                      <div className="h-8 bg-blue-200 rounded" />
                      <div className="h-8 bg-blue-200 rounded" />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Component-to-Component Spacing (20-24px)
                  </h3>
                  <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-700">Component 1</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-700">Component 2</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* ==================== RADIUS TAB ==================== */}
          <TabsContent value="radius" className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold mb-6">Border Radius Scale</h2>
              <div className="grid grid-cols-4 gap-6">
                {Object.entries(designTokens.radius).map(([name, value]) => (
                  <div key={name} className="flex flex-col items-center">
                    <div
                      style={{
                        borderRadius: value,
                        backgroundColor: '#3b82f6',
                      }}
                      className="w-24 h-24 mb-4"
                    />
                    <p className="font-semibold text-gray-900 text-center">{name}</p>
                    <p className="text-sm text-gray-600 font-mono text-center">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Radius Usage */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Usage Examples</h2>
              <div className="grid grid-cols-2 gap-6">
                <div
                  style={{ borderRadius: designTokens.radius.full }}
                  className="p-6 bg-purple-500 text-white text-center font-semibold"
                >
                  Pill Button (full)
                </div>
                <div
                  style={{ borderRadius: designTokens.radius.lg }}
                  className="p-6 bg-green-500 text-white text-center font-semibold"
                >
                  Card (lg)
                </div>
                <div
                  style={{ borderRadius: designTokens.radius.base }}
                  className="p-6 bg-orange-500 text-white text-center font-semibold"
                >
                  Button (base)
                </div>
                <div
                  style={{ borderRadius: designTokens.radius.sm }}
                  className="p-6 bg-red-500 text-white text-center font-semibold"
                >
                  Input (sm)
                </div>
              </div>
            </section>
          </TabsContent>

          {/* ==================== SHADOWS TAB ==================== */}
          <TabsContent value="shadows" className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold mb-6">Shadow Elevation Scale</h2>
              <div className="space-y-6">
                {Object.entries(designTokens.shadow)
                  .filter(([name]) => !name.includes('glow'))
                  .map(([name, value]) => (
                    <div key={name}>
                      <div
                        style={{ boxShadow: value as string }}
                        className="p-8 bg-white rounded-lg"
                      >
                        <p className="text-gray-600">Sample card with {name} shadow</p>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 font-mono">{name}</p>
                    </div>
                  ))}
              </div>
            </section>

            {/* Glow Effects */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Glow Effects</h2>
              <div className="grid grid-cols-2 gap-6">
                {Object.entries(designTokens.shadow)
                  .filter(([name]) => name.includes('glow'))
                  .map(([name, value]) => (
                    <div
                      key={name}
                      style={{ boxShadow: value as string }}
                      className="p-8 bg-white rounded-lg text-center"
                    >
                      <p className="font-semibold text-gray-900">{name}</p>
                    </div>
                  ))}
              </div>
            </section>
          </TabsContent>

          {/* ==================== ANIMATION TAB ==================== */}
          <TabsContent value="animation" className="space-y-12">
            {/* Duration */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Animation Duration</h2>
              <div className="space-y-4">
                {Object.entries(designTokens.animation.duration).map(([name, value]) => (
                  <div key={name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900">{name}</p>
                    <p className="text-gray-600 font-mono">{value}ms</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Easing */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Animation Easing</h2>
              <div className="space-y-4">
                {Object.entries(designTokens.animation.easing).map(([name, value]) => (
                  <div key={name} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">{name}</p>
                    <p className="text-sm text-gray-600 font-mono">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Z-Index */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Z-Index Scale</h2>
              <div className="space-y-4">
                {Object.entries(designTokens.animation.zIndex).map(([name, value]) => (
                  <div key={name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900">{name}</p>
                    <p className="text-gray-600 font-mono">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Animation Preview */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Animation Preview</h2>
              <div className="space-y-8">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-4">Fade In (350ms)</p>
                  <div
                    className="w-16 h-16 bg-blue-500 rounded-lg"
                    style={{
                      animation: 'fadeIn 0.35s ease-in-out forwards',
                      '@keyframes fadeIn': {
                        from: { opacity: 0 },
                        to: { opacity: 1 },
                      },
                    }}
                  />
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-4">
                    Scale Pulse (1.5s infinite)
                  </p>
                  <div
                    className="w-16 h-16 bg-purple-500 rounded-lg"
                    style={{
                      animation: 'pulse 1.5s cubic-bezier(.32,.72,0,1) infinite',
                    }}
                  />
                </div>
              </div>
              <style>{`
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
                @keyframes pulse {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.1); }
                }
              `}</style>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DesignSystemViewer;
