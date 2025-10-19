import React, { useState } from 'react';
import { designTokens } from '../designSystem/tokens';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Check, Search } from 'lucide-react';

export const DesignSystemViewer: React.FC = () => {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const getWCAGLevel = (ratio: number) => {
    if (ratio >= 7) return { level: 'AAA', color: 'bg-green-100 text-green-800' };
    if (ratio >= 4.5) return { level: 'AA', color: 'bg-blue-100 text-blue-800' };
    return { level: 'Fail', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Design System</h1>
          <p className="text-purple-100 text-lg">Ohouse AI - Complete Design Tokens Reference</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <Input
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8 bg-white border border-gray-200 p-1">
              <TabsTrigger value="colors" className="text-sm">
                Colors
              </TabsTrigger>
              <TabsTrigger value="typography" className="text-sm">
                Typography
              </TabsTrigger>
              <TabsTrigger value="spacing" className="text-sm">
                Spacing
              </TabsTrigger>
              <TabsTrigger value="radius" className="text-sm">
                Radius
              </TabsTrigger>
              <TabsTrigger value="shadows" className="text-sm">
                Shadows
              </TabsTrigger>
              <TabsTrigger value="animation" className="text-sm">
                Animation
              </TabsTrigger>
            </TabsList>

            {/* ==================== COLORS TAB ==================== */}
            <TabsContent value="colors" className="space-y-8">
              {/* Primary Colors */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Primary Colors</h2>
                <div className="grid grid-cols-2 gap-6">
                  {Object.entries(designTokens.color.primary).map(([name, value]) => (
                    <Card key={name} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div
                        className="h-40 w-full"
                        style={{ backgroundColor: value as string }}
                      />
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900 capitalize">{name}</p>
                            <p className="text-sm text-gray-600 font-mono">{value}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(value as string)}
                          >
                            {copiedValue === value ? (
                              <Check size={16} className="text-green-600" />
                            ) : (
                              <Copy size={16} />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Semantic Colors */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Semantic Colors</h2>
                <div className="grid grid-cols-4 gap-6">
                  {Object.entries(designTokens.color.semantic).map(([name, value]) => (
                    <Card key={name} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div
                        className="h-32 w-full"
                        style={{ backgroundColor: value }}
                      />
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-gray-900 capitalize text-sm">{name}</p>
                            <p className="text-xs text-gray-600 font-mono mt-1">{value}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(value)}
                          >
                            {copiedValue === value ? (
                              <Check size={14} className="text-green-600" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Neutral Scale */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Neutral Scale</h2>
                <div className="space-y-3">
                  {Object.entries(designTokens.color.neutral).map(([name, value]) => (
                    <Card key={name} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4 p-4">
                        <div
                          className="w-32 h-16 rounded-lg border border-gray-200 flex-shrink-0"
                          style={{ backgroundColor: value }}
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{name}</p>
                          <p className="text-sm text-gray-600 font-mono">{value}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(value)}
                        >
                          {copiedValue === value ? (
                            <Check size={16} className="text-green-600" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Contrast Ratios */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">WCAG Contrast Compliance</h2>
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Dark on Light</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div>
                        <p className="font-semibold text-gray-900">Primary Dark on Primary Light</p>
                        <p className="text-sm text-gray-600">
                          Contrast ratio for text and UI elements
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {getContrastRatio(
                            designTokens.color.primary.dark,
                            designTokens.color.primary.light
                          )}
                          :1
                        </p>
                        <Badge
                          className={`mt-2 ${
                            getWCAGLevel(
                              parseFloat(
                                getContrastRatio(
                                  designTokens.color.primary.dark,
                                  designTokens.color.primary.light
                                )
                              )
                            ).color
                          }`}
                        >
                          {
                            getWCAGLevel(
                              parseFloat(
                                getContrastRatio(
                                  designTokens.color.primary.dark,
                                  designTokens.color.primary.light
                                )
                              )
                            ).level
                          }
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ==================== TYPOGRAPHY TAB ==================== */}
            <TabsContent value="typography" className="space-y-8">
              {/* Typography Scale */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Typography Scale</h2>
                <div className="space-y-6">
                  {Object.entries(designTokens.typography.scale).map(([name, style]) => (
                    <Card key={name} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="pt-8 pb-8">
                        <div
                          style={{
                            fontSize: (style as any).size,
                            fontWeight: (style as any).weight,
                            lineHeight: (style as any).lineHeight,
                          }}
                          className="mb-6 text-gray-900 leading-relaxed"
                        >
                          The quick brown fox jumps over the lazy dog
                        </div>
                        <div className="grid grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                          <div>
                            <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Name</p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">{name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Size</p>
                            <p className="text-sm font-mono text-gray-900 mt-1">{(style as any).size}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Weight</p>
                            <p className="text-sm font-mono text-gray-900 mt-1">{(style as any).weight}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                              Line Height
                            </p>
                            <p className="text-sm font-mono text-gray-900 mt-1">
                              {(style as any).lineHeight}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Font Sizes */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Font Sizes</h2>
                <div className="space-y-4">
                  {Object.entries(designTokens.typography.fontSize).map(([name, values]) => (
                    <Card key={name} className="hover:shadow-md transition-shadow">
                      <CardContent className="flex items-center gap-6 py-6">
                        <div
                          style={{ fontSize: (values as any).size }}
                          className="flex-shrink-0 w-20 text-gray-900 font-semibold text-center"
                        >
                          Aa
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{name}</p>
                          <p className="text-sm text-gray-600 font-mono">
                            {(values as any).size} / {(values as any).lineHeight}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            copyToClipboard(`${name}: ${(values as any).size} / ${(values as any).lineHeight}`)
                          }
                        >
                          {copiedValue === `${name}` ? (
                            <Check size={16} className="text-green-600" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Font Weights */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Font Weights</h2>
                <div className="space-y-4">
                  {Object.entries(designTokens.typography.fontWeight).map(([name, weight]) => (
                    <Card key={name} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6 pb-6">
                        <p
                          style={{ fontWeight: weight as any }}
                          className="text-gray-900 mb-4 text-lg"
                        >
                          The quick brown fox jumps over the lazy dog
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600 capitalize font-medium">{name}</p>
                          <p className="text-sm font-mono text-gray-900">{weight}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* ==================== SPACING TAB ==================== */}
            <TabsContent value="spacing" className="space-y-8">
              {/* Spacing Scale */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Spacing Scale</h2>
                <div className="space-y-6">
                  {Object.entries(designTokens.spacing).map(([name, value]) => {
                    const pixels = parseInt(value);
                    return (
                      <Card key={name} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6 pb-6">
                          <div className="flex items-end gap-4 mb-4">
                            <div
                              style={{ width: value, height: '40px', minWidth: value }}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{name}</p>
                              <p className="text-sm text-gray-600">{value} ({pixels}px)</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Spacing Usage Guide */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Usage Guidelines</h2>
                <div className="grid grid-cols-2 gap-6">
                  <Card className="bg-amber-50 border-amber-200">
                    <CardHeader>
                      <CardTitle className="text-base">Text Combinations</CardTitle>
                      <CardDescription>2px - 8px</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-white p-4 rounded-lg space-y-1">
                        <p className="text-sm font-medium text-gray-900">Label</p>
                        <p style={{ marginTop: '2px' }} className="text-xs text-gray-600">
                          Input hint text (2px gap)
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">Heading</p>
                        <p style={{ marginTop: '4px' }} className="text-xs text-gray-600">
                          Subheading text (4px gap)
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-base">Component Internal</CardTitle>
                      <CardDescription>12px - 16px</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                        <div className="h-8 bg-blue-200 rounded" />
                        <div className="h-8 bg-blue-200 rounded" />
                        <div className="h-8 bg-blue-200 rounded" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-base">Component Separation</CardTitle>
                      <CardDescription>20px - 24px</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700 font-medium">Component 1</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700 font-medium">Component 2</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-red-50 border-red-200">
                    <CardHeader>
                      <CardTitle className="text-base">Section Breaks</CardTitle>
                      <CardDescription>32px</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700 font-medium">Section 1</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700 font-medium">Section 2</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* ==================== RADIUS TAB ==================== */}
            <TabsContent value="radius" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Border Radius Scale</h2>
                <div className="grid grid-cols-4 gap-6">
                  {Object.entries(designTokens.radius).map(([name, value]) => (
                    <Card key={name} className="hover:shadow-lg transition-shadow overflow-hidden">
                      <div
                        style={{
                          borderRadius: value,
                          backgroundColor: '#3b82f6',
                          aspectRatio: '1',
                        }}
                        className="w-full"
                      />
                      <CardContent className="pt-4">
                        <p className="font-semibold text-gray-900 text-sm">{name}</p>
                        <p className="text-xs text-gray-600 font-mono mt-1">{value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Usage Examples */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Usage Examples</h2>
                <div className="grid grid-cols-2 gap-6">
                  <Card
                    style={{ borderRadius: designTokens.radius.full }}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white overflow-hidden"
                  >
                    <CardContent className="flex items-center justify-center h-32">
                      <span className="font-semibold">Pill Button (full)</span>
                    </CardContent>
                  </Card>
                  <Card
                    style={{ borderRadius: designTokens.radius.lg }}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white overflow-hidden"
                  >
                    <CardContent className="flex items-center justify-center h-32">
                      <span className="font-semibold">Card (lg)</span>
                    </CardContent>
                  </Card>
                  <Card
                    style={{ borderRadius: designTokens.radius.base }}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white overflow-hidden"
                  >
                    <CardContent className="flex items-center justify-center h-32">
                      <span className="font-semibold">Button (base)</span>
                    </CardContent>
                  </Card>
                  <Card
                    style={{ borderRadius: designTokens.radius.sm }}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white overflow-hidden"
                  >
                    <CardContent className="flex items-center justify-center h-32">
                      <span className="font-semibold">Input (sm)</span>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* ==================== SHADOWS TAB ==================== */}
            <TabsContent value="shadows" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Shadow Elevation Scale</h2>
                <div className="space-y-6">
                  {Object.entries(designTokens.shadow)
                    .filter(([name]) => !name.includes('glow'))
                    .map(([name, value]) => (
                      <Card
                        key={name}
                        style={{ boxShadow: value as string }}
                        className="p-8 bg-white"
                      >
                        <p className="text-gray-600 font-medium">
                          Sample card with <span className="font-semibold text-gray-900">{name}</span> shadow
                        </p>
                        <p className="text-xs text-gray-500 font-mono mt-3">{value}</p>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Glow Effects */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Glow Effects</h2>
                <div className="grid grid-cols-2 gap-6">
                  {Object.entries(designTokens.shadow)
                    .filter(([name]) => name.includes('glow'))
                    .map(([name, value]) => (
                      <Card
                        key={name}
                        style={{ boxShadow: value as string }}
                        className="p-8 bg-white text-center"
                      >
                        <p className="font-semibold text-gray-900">{name}</p>
                        <p className="text-xs text-gray-600 font-mono mt-2">{value}</p>
                      </Card>
                    ))}
                </div>
              </div>
            </TabsContent>

            {/* ==================== ANIMATION TAB ==================== */}
            <TabsContent value="animation" className="space-y-8">
              {/* Duration */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Animation Duration</h2>
                <div className="space-y-4">
                  {Object.entries(designTokens.animation.duration).map(([name, value]) => (
                    <Card key={name} className="hover:shadow-md transition-shadow">
                      <CardContent className="flex items-center justify-between py-6">
                        <div>
                          <p className="font-semibold text-gray-900 capitalize">{name}</p>
                          <p className="text-xs text-gray-600">Standard timing</p>
                        </div>
                        <Badge variant="outline" className="text-lg font-mono">
                          {value}ms
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Easing Functions */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Easing Functions</h2>
                <div className="space-y-4">
                  {Object.entries(designTokens.animation.easing).map(([name, value]) => (
                    <Card key={name} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6 pb-6">
                        <p className="font-semibold text-gray-900 mb-3 capitalize">{name}</p>
                        <p className="text-sm text-gray-600 font-mono bg-gray-50 p-3 rounded-lg break-words">
                          {value}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Z-Index */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Z-Index Scale</h2>
                <div className="space-y-4">
                  {Object.entries(designTokens.animation.zIndex).map(([name, value]) => (
                    <Card key={name} className="hover:shadow-md transition-shadow">
                      <CardContent className="flex items-center justify-between py-6">
                        <p className="font-semibold text-gray-900 capitalize">{name}</p>
                        <Badge className="bg-blue-100 text-blue-800 text-lg font-mono">
                          {value}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Animation Preview */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Animation Preview</h2>
                <div className="grid grid-cols-2 gap-6">
                  <Card className="flex items-center justify-center h-48">
                    <div
                      className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg"
                      style={{
                        animation: 'fadeIn 0.35s ease-in-out forwards',
                        '@keyframes fadeIn': {
                          from: { opacity: 0 },
                          to: { opacity: 1 },
                        },
                      }}
                    />
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
                  </Card>
                  <Card className="flex items-center justify-center h-48">
                    <div
                      className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg"
                      style={{
                        animation: 'pulse 1.5s cubic-bezier(.32,.72,0,1) infinite',
                      }}
                    />
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-white px-8 py-8 mt-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-600 text-center">
            Design System v1.0 • Built with shadcn/ui & Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemViewer;
