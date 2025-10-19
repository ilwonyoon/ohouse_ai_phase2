import React, { useState, useMemo } from 'react';
import { designTokens } from '../designSystem/tokens';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

export const DesignSystemViewer: React.FC = () => {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedValue(value);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  // Calculate contrast ratio with proper WCAG formula
  const getLuminance = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    let r = (rgb >> 16) & 0xff;
    let g = (rgb >> 8) & 0xff;
    let b = (rgb >> 0) & 0xff;

    // Normalize to 0-1
    r = r / 255;
    g = g / 255;
    b = b / 255;

    // Apply gamma correction
    r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
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
    <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white px-4 py-8 md:px-8 md:py-12">
        <div className="max-w-full md:max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Design System</h1>
          <p className="text-slate-300 text-sm md:text-lg">Complete Design Tokens Reference</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-full md:max-w-7xl mx-auto">
          <Tabs defaultValue="colors" className="w-full">
            {/* Tab Navigation - Responsive */}
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6 md:mb-8 bg-white border border-gray-200 p-1 gap-1">
              <TabsTrigger value="colors" className="text-xs md:text-sm px-1 md:px-2">
                <span className="hidden sm:inline">Colors</span>
                <span className="sm:hidden">Color</span>
              </TabsTrigger>
              <TabsTrigger value="typography" className="text-xs md:text-sm px-1 md:px-2">
                <span className="hidden sm:inline">Typography</span>
                <span className="sm:hidden">Type</span>
              </TabsTrigger>
              <TabsTrigger value="spacing" className="text-xs md:text-sm px-1 md:px-2">
                Spacing
              </TabsTrigger>
              <TabsTrigger value="radius" className="text-xs md:text-sm px-1 md:px-2">
                <span className="hidden md:inline">Radius</span>
                <span className="md:hidden">Radii</span>
              </TabsTrigger>
              <TabsTrigger value="shadows" className="text-xs md:text-sm px-1 md:px-2">
                <span className="hidden md:inline">Shadows</span>
                <span className="md:hidden">Shadow</span>
              </TabsTrigger>
              <TabsTrigger value="animation" className="text-xs md:text-sm px-1 md:px-2">
                <span className="hidden md:inline">Animation</span>
                <span className="md:hidden">Animate</span>
              </TabsTrigger>
            </TabsList>

            {/* ==================== COLORS TAB ==================== */}
            <TabsContent value="colors" className="space-y-6">
              {/* Primary Colors */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Primary Colors</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(designTokens.color.primary).map(([name, value]) => (
                    <Card key={name} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-32 md:h-40 w-full" style={{ backgroundColor: value as string }} />
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 capitalize text-sm">{name}</p>
                            <p className="text-xs text-gray-600 font-mono mt-1">{value}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(value as string)}
                            className="ml-2 flex-shrink-0"
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

              {/* Semantic Colors */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Semantic Colors</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {Object.entries(designTokens.color.semantic).map(([name, value]) => (
                    <Card key={name} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-20 md:h-28 w-full" style={{ backgroundColor: value }} />
                      <CardContent className="pt-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 capitalize text-xs md:text-sm truncate">
                              {name}
                            </p>
                            <p className="text-xs text-gray-600 font-mono mt-1 truncate">{value}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(value)}
                            className="flex-shrink-0 h-6 w-6 p-0"
                          >
                            {copiedValue === value ? (
                              <Check size={12} className="text-green-600" />
                            ) : (
                              <Copy size={12} />
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
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Neutral Scale</h2>
                <div className="space-y-2">
                  {Object.entries(designTokens.color.neutral).map(([name, value]) => (
                    <Card key={name} className="overflow-hidden hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-3 p-3">
                        <div
                          className="w-16 h-10 rounded-lg border border-gray-200 flex-shrink-0"
                          style={{ backgroundColor: value }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">{name}</p>
                          <p className="text-xs text-gray-600 font-mono">{value}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(value)}
                          className="flex-shrink-0"
                        >
                          {copiedValue === value ? (
                            <Check size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Contrast Ratios */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">WCAG Contrast</h2>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm md:text-base">
                          Primary Dark on Light
                        </p>
                        <p className="text-xs md:text-sm text-gray-600 mt-1">Contrast ratio for text</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-xl md:text-2xl font-bold text-gray-900">
                          {getContrastRatio(
                            designTokens.color.primary.dark,
                            designTokens.color.primary.light
                          )}
                          :1
                        </p>
                        <Badge
                          className={`mt-2 text-xs ${
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
            <TabsContent value="typography" className="space-y-6">
              {/* Typography Scale */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Typography Scale</h2>
                <div className="space-y-3">
                  {Object.entries(designTokens.typography.scale).map(([name, style]) => (
                    <Card key={name} className="overflow-hidden hover:shadow-sm transition-shadow">
                      <CardContent className="pt-4 pb-4">
                        <div
                          style={{
                            fontSize: (style as any).size,
                            fontWeight: (style as any).weight,
                            lineHeight: (style as any).lineHeight,
                          }}
                          className="mb-4 text-gray-900 line-clamp-2 md:line-clamp-none"
                        >
                          The quick brown fox jumps over the lazy dog
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-3 border-t border-gray-200 text-xs">
                          <div>
                            <p className="text-gray-600 font-medium uppercase tracking-wide">Name</p>
                            <p className="font-semibold text-gray-900 mt-1 truncate">{name}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium uppercase tracking-wide">Size</p>
                            <p className="font-mono text-gray-900 mt-1 truncate">{(style as any).size}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium uppercase tracking-wide">Weight</p>
                            <p className="font-mono text-gray-900 mt-1">{(style as any).weight}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium uppercase tracking-wide">LH</p>
                            <p className="font-mono text-gray-900 mt-1 truncate">{(style as any).lineHeight}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Font Sizes */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Font Sizes</h2>
                <div className="space-y-2">
                  {Object.entries(designTokens.typography.fontSize).map(([name, values]) => (
                    <Card key={name} className="hover:shadow-sm transition-shadow">
                      <CardContent className="flex items-center gap-3 py-3">
                        <div
                          style={{ fontSize: (values as any).size }}
                          className="flex-shrink-0 w-12 text-gray-900 font-semibold text-center"
                        >
                          Aa
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{name}</p>
                          <p className="text-xs text-gray-600 font-mono">
                            {(values as any).size} / {(values as any).lineHeight}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(name)}>
                          {copiedValue === name ? (
                            <Check size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* ==================== SPACING TAB ==================== */}
            <TabsContent value="spacing" className="space-y-6">
              {/* Spacing Scale */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Spacing Scale</h2>
                <div className="space-y-3">
                  {Object.entries(designTokens.spacing).map(([name, value]) => {
                    const pixels = parseInt(value);
                    return (
                      <Card key={name} className="hover:shadow-sm transition-shadow">
                        <CardContent className="pt-3 pb-3">
                          <div className="flex items-center gap-3">
                            <div
                              style={{ width: value, height: '30px', minWidth: value }}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm">{name}</p>
                              <p className="text-xs text-gray-600">{value}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Usage Guide */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Usage Guidelines</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card className="bg-amber-50 border-amber-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Text (2-8px)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="bg-white p-2 rounded text-xs">
                        Label
                        <p style={{ marginTop: '2px' }} className="text-gray-600">
                          Hint text
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50 border-green-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Component (12-16px)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white rounded p-2 space-y-2">
                        <div className="h-6 bg-blue-200 rounded" />
                        <div className="h-6 bg-blue-200 rounded" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Separation (20-24px)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-white border rounded p-2 text-xs font-medium">C1</div>
                      <div className="bg-white border rounded p-2 text-xs font-medium">C2</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-red-50 border-red-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Section (32px)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-white border rounded p-2 text-xs font-medium">S1</div>
                      <div className="bg-white border rounded p-2 text-xs font-medium">S2</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* ==================== RADIUS TAB ==================== */}
            <TabsContent value="radius" className="space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Border Radius</h2>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
                  {Object.entries(designTokens.radius).map(([name, value]) => (
                    <Card key={name} className="hover:shadow-md transition-shadow overflow-hidden">
                      <div
                        style={{
                          borderRadius: value,
                          backgroundColor: '#3b82f6',
                          aspectRatio: '1',
                        }}
                        className="w-full"
                      />
                      <CardContent className="pt-2">
                        <p className="font-semibold text-gray-900 text-xs md:text-sm truncate">{name}</p>
                        <p className="text-xs text-gray-600 font-mono truncate">{value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* ==================== SHADOWS TAB ==================== */}
            <TabsContent value="shadows" className="space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Elevation</h2>
                <div className="space-y-3">
                  {Object.entries(designTokens.shadow)
                    .filter(([name]) => !name.includes('glow'))
                    .map(([name, value]) => (
                      <Card
                        key={name}
                        style={{ boxShadow: value as string }}
                        className="p-4 bg-white"
                      >
                        <p className="text-xs md:text-sm text-gray-700 font-medium">{name}</p>
                        <p className="text-xs text-gray-500 font-mono mt-2 break-all">{value}</p>
                      </Card>
                    ))}
                </div>
              </div>
            </TabsContent>

            {/* ==================== ANIMATION TAB ==================== */}
            <TabsContent value="animation" className="space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Duration</h2>
                <div className="space-y-2">
                  {Object.entries(designTokens.animation.duration).map(([name, value]) => (
                    <Card key={name} className="hover:shadow-sm transition-shadow">
                      <CardContent className="flex items-center justify-between py-3">
                        <p className="font-semibold text-gray-900 text-sm capitalize">{name}</p>
                        <Badge variant="outline" className="text-xs md:text-sm font-mono">
                          {value}ms
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Easing</h2>
                <div className="space-y-2">
                  {Object.entries(designTokens.animation.easing).map(([name, value]) => (
                    <Card key={name} className="hover:shadow-sm transition-shadow">
                      <CardContent className="pt-3 pb-3">
                        <p className="font-semibold text-gray-900 text-sm capitalize mb-2">{name}</p>
                        <p className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded break-all">
                          {value}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Z-Index</h2>
                <div className="space-y-2">
                  {Object.entries(designTokens.animation.zIndex).map(([name, value]) => (
                    <Card key={name} className="hover:shadow-sm transition-shadow">
                      <CardContent className="flex items-center justify-between py-3">
                        <p className="font-semibold text-gray-900 text-sm capitalize">{name}</p>
                        <Badge className="bg-blue-100 text-blue-800 text-xs md:text-sm font-mono">
                          {value}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-white px-4 py-6 md:px-8 md:py-8 mt-8">
        <div className="max-w-full md:max-w-7xl mx-auto">
          <p className="text-xs md:text-sm text-gray-600 text-center">
            Design System v1.0 • Built with shadcn/ui & Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemViewer;
