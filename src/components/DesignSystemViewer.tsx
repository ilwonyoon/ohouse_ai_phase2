import React, { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  designTokens,
  spacingScale,
  spacingPurpose,
} from '../designSystem/tokens';
import {
  Copy,
  Check,
  Search,
  Palette,
  Type,
  Ruler,
  Square,
  SunMedium,
  Timer,
  GitBranch,
  Sparkles,
} from 'lucide-react';

type TokenEntry = [string, unknown];
type MatchesQuery = (label: string, value: unknown) => boolean;

type TabDefinition = {
  value: string;
  label: string;
  icon: LucideIcon;
  tagline: string;
};

const TABS: TabDefinition[] = [
  {
    value: 'colors',
    label: 'Colors',
    icon: Palette,
    tagline: 'Brand palettes, semantics, and surfaces',
  },
  {
    value: 'typography',
    label: 'Typography',
    icon: Type,
    tagline: 'Scales, families, and weight system',
  },
  {
    value: 'spacing',
    label: 'Spacing',
    icon: Ruler,
    tagline: 'Consistent rhythm and sizing rules',
  },
  {
    value: 'radius',
    label: 'Radius',
    icon: Square,
    tagline: 'Shape language across components',
  },
  {
    value: 'shadows',
    label: 'Shadows',
    icon: SunMedium,
    tagline: 'Elevation, effects, and glow tokens',
  },
  {
    value: 'animation',
    label: 'Motion',
    icon: Timer,
    tagline: 'Durations, easing curves, and layers',
  },
];

const prettifyName = (token: string | number) => {
  const str = String(token);
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
};

const flattenToken = (value: unknown): string => {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(flattenToken).join(' ');
  }
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>)
      .map(flattenToken)
      .join(' ');
  }
  return '';
};

const getLuminance = (hex: string) => {
  const rgb = parseInt(hex.slice(1), 16);
  let r = (rgb >> 16) & 0xff;
  let g = (rgb >> 8) & 0xff;
  let b = (rgb >> 0) & 0xff;

  r /= 255;
  g /= 255;
  b /= 255;

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
  return parseFloat(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
};

const getWCAGLevel = (ratio: number) => {
  if (ratio >= 7) {
    return {
      level: 'AAA',
      badgeClass: 'bg-emerald-100 text-emerald-700',
      message: 'Passes large & small text contrast',
    };
  }
  if (ratio >= 4.5) {
    return {
      level: 'AA',
      badgeClass: 'bg-blue-100 text-blue-700',
      message: 'Passes large text contrast',
    };
  }
  return {
    level: 'Needs attention',
    badgeClass: 'bg-amber-100 text-amber-700',
    message: 'Increase contrast for accessibility',
  };
};

const valueToString = (value: unknown) => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  return flattenToken(value);
};

export const DesignSystemViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('colors');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const matchesQuery = useMemo<MatchesQuery>(() => {
    if (!normalizedQuery) {
      return () => true;
    }
    return (label, value) => {
      const haystack = `${label} ${flattenToken(value)}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    };
  }, [normalizedQuery]);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedValue(value);
    window.setTimeout(() => setCopiedValue(null), 2000);
  };

  const colorSections = useMemo(() => {
    const primary = Object.entries(designTokens.color.primary).filter(([name, value]) =>
      matchesQuery(name, value),
    );
    const brand = Object.entries(designTokens.color.brand ?? {}).filter(([name, value]) =>
      matchesQuery(name, value),
    );
    const semantic = Object.entries(designTokens.color.semantic).filter(([name, value]) =>
      matchesQuery(name, value),
    );
    const neutral = Object.entries(designTokens.color.neutral).filter(([name, value]) =>
      matchesQuery(name, value),
    );
    const surfaces = Object.entries(designTokens.color.background ?? {}).filter(([name, value]) =>
      matchesQuery(name, value),
    );
    const borders = Object.entries(designTokens.color.border ?? {}).filter(([name, value]) =>
      matchesQuery(name, value),
    );
    const opacity = Object.entries(designTokens.color.opacity ?? {}).filter(([name, value]) =>
      matchesQuery(name, value),
    );

    return { primary, brand, semantic, neutral, surfaces, borders, opacity };
  }, [matchesQuery]);

  const hasColorResults = useMemo(
    () => Object.values(colorSections).some(section => section.length > 0),
    [colorSections],
  );

  const typographySections = useMemo(() => {
    const scale = Object.entries(designTokens.typography.scale).filter(([name, value]) =>
      matchesQuery(name, value),
    );
    const fontSize = Object.entries(designTokens.typography.fontSize).filter(([name, value]) =>
      matchesQuery(name, value),
    );
    const fontWeight = Object.entries(designTokens.typography.fontWeight).filter(([name, value]) =>
      matchesQuery(name, value),
    );
    const fontFamily = Object.entries(designTokens.typography.fontFamily).filter(([name, value]) =>
      matchesQuery(name, value),
    );

    return { scale, fontSize, fontWeight, fontFamily };
  }, [matchesQuery]);

  const spacingEntries = useMemo(
    () => Object.entries(designTokens.spacing).filter(([name, value]) => matchesQuery(name, value)),
    [matchesQuery],
  );

  const spacingIntent = useMemo(
    () =>
      Object.entries(spacingPurpose).filter(([name, value]) =>
        matchesQuery(name, value.join(' ')),
      ),
    [matchesQuery],
  );

  const radiusEntries = useMemo(
    () => Object.entries(designTokens.radius).filter(([name, value]) => matchesQuery(name, value)),
    [matchesQuery],
  );

  const shadowEntries = useMemo(
    () => Object.entries(designTokens.shadow).filter(([name, value]) => matchesQuery(name, value)),
    [matchesQuery],
  );

  const animationDurations = useMemo(
    () =>
      Object.entries(designTokens.animation.duration).filter(([name, value]) =>
        matchesQuery(name, value),
      ),
    [matchesQuery],
  );

  const animationEasing = useMemo(
    () =>
      Object.entries(designTokens.animation.easing).filter(([name, value]) =>
        matchesQuery(name, value),
      ),
    [matchesQuery],
  );

  const animationLayers = useMemo(
    () =>
      Object.entries(designTokens.animation.zIndex).filter(([name, value]) =>
        matchesQuery(name, value),
      ),
    [matchesQuery],
  );

  const contrastPairs = useMemo(() => {
    const pairs = [
      {
        id: 'primary-light',
        title: 'Primary Dark on Light',
        foreground: designTokens.color.primary.dark,
        background: designTokens.color.primary.light,
      },
      {
        id: 'primary-dark',
        title: 'Primary Light on Dark',
        foreground: designTokens.color.primary.light,
        background: designTokens.color.primary.dark,
      },
      {
        id: 'brand-blue',
        title: 'Brand Blue on Midnight',
        foreground: designTokens.color.brand.blue,
        background: designTokens.color.primary.dark,
      },
    ];

    return pairs.map(pair => {
      const ratio = getContrastRatio(pair.foreground, pair.background);
      return {
        ...pair,
        ratio,
        wcag: getWCAGLevel(ratio),
      };
    });
  }, []);

  const heroStats = useMemo(() => {
    const colorCount =
      Object.keys(designTokens.color.primary).length +
      Object.keys(designTokens.color.brand ?? {}).length +
      Object.keys(designTokens.color.semantic).length +
      Object.keys(designTokens.color.neutral).length;
    const typeCount =
      Object.keys(designTokens.typography.scale).length +
      Object.keys(designTokens.typography.fontSize).length +
      Object.keys(designTokens.typography.fontWeight).length;
    const spacingCount =
      Object.keys(designTokens.spacing).length + Object.keys(designTokens.radius).length;
    const motionCount =
      Object.keys(designTokens.shadow).length +
      Object.keys(designTokens.animation.duration).length +
      Object.keys(designTokens.animation.easing).length;

    return {
      total: colorCount + typeCount + spacingCount + motionCount,
      colorCount,
      typeCount,
      spacingCount,
      motionCount,
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="relative isolate">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-indigo-500/40 blur-3xl" />
          <div className="absolute bottom-0 left-28 h-64 w-64 rounded-full bg-purple-500/30 blur-3xl" />
        </div>

        <div className="relative px-6 pb-20 pt-12 sm:px-10 lg:px-16">
          <div className="mx-auto flex max-w-6xl flex-col gap-10">
            <header className="overflow-hidden rounded-[32px] border border-white/15 bg-white/10 p-8 text-white shadow-[0_40px_80px_-40px_rgba(59,130,246,0.45)] backdrop-blur-lg md:p-10">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="space-y-4">
                  <Badge className="border border-white/30 bg-white/15 text-white backdrop-blur">
                    System v1.0
                  </Badge>
                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                      Ohouse AI Design System
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                      A single source of truth for color, typography, motion, and spatial rhythm
                      across the AI-driven mobile experience.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <Sparkles size={16} />
                    Crafted for clarity. Updated weekly.
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    size="lg"
                    className="h-11 rounded-full border border-white/30 bg-white/15 px-6 text-white shadow-lg shadow-indigo-500/20 transition hover:bg-white/25"
                  >
                    <GitBranch className="mr-2 h-5 w-5" />
                    Flow View
                  </Button>
                </div>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-white/10 bg-white/10 text-white shadow-inner backdrop-blur">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                      Token Families
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-end justify-between">
                    <span className="text-3xl font-semibold">{heroStats.total}</span>
                    <span className="text-sm text-white/70">Foundational primitives</span>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/10 text-white shadow-inner backdrop-blur">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                      Color System
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-end justify-between">
                    <span className="text-3xl font-semibold">{heroStats.colorCount}</span>
                    <span className="text-sm text-white/70">Brand & functional hues</span>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/10 text-white shadow-inner backdrop-blur">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                      Typography
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-end justify-between">
                    <span className="text-3xl font-semibold">{heroStats.typeCount}</span>
                    <span className="text-sm text-white/70">Scale & family rules</span>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/10 text-white shadow-inner backdrop-blur">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                      Motion & Depth
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-end justify-between">
                    <span className="text-3xl font-semibold">{heroStats.motionCount}</span>
                    <span className="text-sm text-white/70">Timing + elevation</span>
                  </CardContent>
                </Card>
              </div>
            </header>

            <section className="-mt-8 rounded-[32px] border border-white/10 bg-white p-6 shadow-2xl shadow-indigo-500/10 sm:p-8">
              <div className="flex flex-col gap-5 border-b border-slate-200/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Token Explorer</p>
                  <p className="text-sm text-slate-500">
                    Search any token by name or value. Results update across tabs instantly.
                  </p>
                </div>
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input
                    value={searchQuery}
                    onChange={event => setSearchQuery(event.target.value)}
                    placeholder="Search tokens — try “brand blue” or “16px”"
                    className="h-11 rounded-xl border-slate-200 bg-white pl-10 text-sm shadow-inner focus-visible:ring-2 focus-visible:ring-slate-900/10"
                  />
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4 w-full">
                <TabsList className="flex flex-wrap gap-2 border-0 bg-transparent px-1">
                  {TABS.map(tab => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="group flex items-center gap-2 rounded-full border border-slate-200/60 bg-white px-4 py-2 text-sm font-medium text-slate-500 transition-all data-[state=active]:border-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white hover:-translate-y-0.5 hover:border-slate-900/60 hover:text-slate-900"
                    >
                      <tab.icon
                        size={16}
                        className="text-slate-400 transition group-data-[state=active]:text-white"
                      />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="mt-8 space-y-10">
                  <TabsContent value="colors" className="space-y-12 focus-visible:outline-none">
                    {!hasColorResults && (
                      <Card className="border-dashed border-slate-300 bg-slate-50">
                        <CardContent className="py-10 text-center">
                          <p className="text-lg font-semibold text-slate-700">No color tokens found</p>
                          <p className="mt-1 text-sm text-slate-500">
                            Adjust your search to see palette, surface, and semantic tokens.
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {colorSections.primary.length > 0 && (
                      <section className="space-y-5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                          <div>
                            <h2 className="text-xl font-semibold text-slate-900">Primary Palette</h2>
                            <p className="text-sm text-slate-500">
                              Core brand hues for immersive surfaces and hero components.
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                          {colorSections.primary.map(([name, value]) => (
                            <Card
                              key={`primary-${name}`}
                              className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-sm transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-200/40"
                            >
                              <div
                                className="h-32 bg-gradient-to-br from-black/10 to-black/0 transition group-hover:opacity-90"
                                style={{ backgroundColor: String(value) }}
                              />
                              <CardContent className="flex flex-col gap-4 p-5">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                      {prettifyName(name)}
                                    </p>
                                    <p className="font-mono text-xs text-slate-500">
                                      {String(value)}
                                    </p>
                                  </div>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleCopy(String(value))}
                                    className="h-9 w-9 rounded-full border-slate-200 text-slate-500 hover:text-slate-900"
                                  >
                                    {copiedValue === String(value) ? (
                                      <Check size={16} className="text-emerald-500" />
                                    ) : (
                                      <Copy size={16} />
                                    )}
                                  </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="rounded-full border-indigo-200 text-indigo-600">
                                    Brand
                                  </Badge>
                                  <span className="text-xs text-slate-500">
                                    Primary surfaces & navigation
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </section>
                    )}

                    {colorSections.brand.length > 0 && (
                      <section className="space-y-5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                          <div>
                            <h2 className="text-xl font-semibold text-slate-900">Brand Extensions</h2>
                            <p className="text-sm text-slate-500">
                              Supporting hues for gradients, illustrations, and moments of delight.
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                          {colorSections.brand.map(([name, value]) => (
                            <Card
                              key={`brand-${name}`}
                              className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-sm transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-200/40"
                            >
                              <div
                                className="h-28 bg-gradient-to-br from-black/10 to-black/0 transition group-hover:opacity-90"
                                style={{ backgroundColor: String(value) }}
                              />
                              <CardContent className="flex items-center justify-between p-5">
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {prettifyName(name)}
                                  </p>
                                  <p className="font-mono text-xs text-slate-500">
                                    {String(value)}
                                  </p>
                                </div>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => handleCopy(String(value))}
                                  className="h-9 w-9 rounded-full border-slate-200 text-slate-500 hover:text-slate-900"
                                >
                                  {copiedValue === String(value) ? (
                                    <Check size={16} className="text-emerald-500" />
                                  ) : (
                                    <Copy size={16} />
                                  )}
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </section>
                    )}

                    {colorSections.semantic.length > 0 && (
                      <section className="space-y-5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                          <div>
                            <h2 className="text-xl font-semibold text-slate-900">Semantic Colors</h2>
                            <p className="text-sm text-slate-500">
                              Messaging, validation, and system feedback states.
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                          {colorSections.semantic.map(([name, value]) => (
                            <Card
                              key={`semantic-${name}`}
                              className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-sm transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-200/40"
                            >
                              <div
                                className="h-24 bg-gradient-to-br from-black/10 to-black/0 transition group-hover:opacity-90"
                                style={{ backgroundColor: String(value) }}
                              />
                              <CardContent className="flex items-center justify-between p-5">
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {prettifyName(name)}
                                  </p>
                                  <p className="font-mono text-xs text-slate-500">
                                    {String(value)}
                                  </p>
                                </div>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => handleCopy(String(value))}
                                  className="h-9 w-9 rounded-full border-slate-200 text-slate-500 hover:text-slate-900"
                                >
                                  {copiedValue === String(value) ? (
                                    <Check size={16} className="text-emerald-500" />
                                  ) : (
                                    <Copy size={16} />
                                  )}
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </section>
                    )}

                    {colorSections.neutral.length > 0 && (
                      <section className="space-y-5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                          <div>
                            <h2 className="text-xl font-semibold text-slate-900">Neutral Scale</h2>
                            <p className="text-sm text-slate-500">
                              Elevation steps for text, surfaces, and theming transitions.
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {colorSections.neutral.map(([name, value]) => (
                            <Card
                              key={`neutral-${name}`}
                              className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className="h-14 w-14 rounded-2xl border border-slate-200 shadow-inner"
                                  style={{ backgroundColor: String(value) }}
                                />
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    Step {prettifyName(name)}
                                  </p>
                                  <p className="font-mono text-xs text-slate-500">
                                    {String(value)}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleCopy(String(value))}
                                className="h-9 w-9 rounded-full border-slate-200 text-slate-500 hover:text-slate-900"
                              >
                                {copiedValue === String(value) ? (
                                  <Check size={16} className="text-emerald-500" />
                                ) : (
                                  <Copy size={16} />
                                )}
                              </Button>
                            </Card>
                          ))}
                        </div>
                      </section>
                    )}

                    {(colorSections.surfaces.length > 0 || colorSections.borders.length > 0) && (
                      <section className="space-y-5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                          <div>
                            <h2 className="text-xl font-semibold text-slate-900">Surfaces & Borders</h2>
                            <p className="text-sm text-slate-500">
                              Structural colors to define backgrounds, panels, and outlines.
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {colorSections.surfaces.map(([name, value]) => (
                            <Card
                              key={`surface-${name}`}
                              className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className="h-16 w-16 rounded-3xl border border-slate-200 shadow-inner"
                                  style={{ backgroundColor: String(value) }}
                                />
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {prettifyName(name)}
                                  </p>
                                  <p className="font-mono text-xs text-slate-500">
                                    {String(value)}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleCopy(String(value))}
                                className="h-9 w-9 rounded-full border-slate-200 text-slate-500 hover:text-slate-900"
                              >
                                {copiedValue === String(value) ? (
                                  <Check size={16} className="text-emerald-500" />
                                ) : (
                                  <Copy size={16} />
                                )}
                              </Button>
                            </Card>
                          ))}

                          {colorSections.borders.map(([name, value]) => (
                            <Card
                              key={`border-${name}`}
                              className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className="h-16 w-16 rounded-3xl border border-slate-200 shadow-inner"
                                  style={{ background: `linear-gradient(135deg, ${String(value)}, rgba(148,163,184,0.2))` }}
                                />
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {prettifyName(name)}
                                  </p>
                                  <p className="font-mono text-xs text-slate-500">
                                    {String(value)}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleCopy(String(value))}
                                className="h-9 w-9 rounded-full border-slate-200 text-slate-500 hover:text-slate-900"
                              >
                                {copiedValue === String(value) ? (
                                  <Check size={16} className="text-emerald-500" />
                                ) : (
                                  <Copy size={16} />
                                )}
                              </Button>
                            </Card>
                          ))}
                        </div>
                      </section>
                    )}

                    {colorSections.opacity.length > 0 && (
                      <section className="space-y-5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                          <div>
                            <h2 className="text-xl font-semibold text-slate-900">Opacity Tokens</h2>
                            <p className="text-sm text-slate-500">
                              Apply consistent translucency across overlays and hover states.
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {colorSections.opacity.map(([name, value]) => {
                            const numericValue = Number(value);
                            return (
                              <Card
                                key={`opacity-${name}`}
                                className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                      {prettifyName(name)}
                                    </p>
                                    <p className="font-mono text-xs text-slate-500">
                                      {numericValue}
                                    </p>
                                  </div>
                                  <Badge className="rounded-full bg-indigo-100 text-indigo-700">
                                    {Math.round(numericValue * 100)}%
                                  </Badge>
                                </div>
                                <div className="mt-4 h-12 overflow-hidden rounded-2xl border border-slate-200">
                                  <div
                                    className="h-full w-full"
                                    style={{
                                      background: `linear-gradient(90deg, rgba(59,130,246,${numericValue}) 0%, rgba(59,130,246,${Math.max(
                                        numericValue - 0.2,
                                        0,
                                      )}) 70%, rgba(59,130,246,0.08) 100%)`,
                                    }}
                                  />
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </section>
                    )}

                    <section className="space-y-5">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">Contrast Insights</h2>
                          <p className="text-sm text-slate-500">
                            Validate primary pairings against WCAG 2.1 color contrast requirements.
                          </p>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {contrastPairs.map(pair => (
                          <Card
                            key={pair.id}
                            className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-slate-50 p-5 shadow-sm"
                          >
                            <div
                              className="h-20 rounded-2xl border border-slate-200 shadow-inner"
                              style={{
                                background: `linear-gradient(135deg, ${pair.foreground} 0%, ${pair.background} 100%)`,
                              }}
                            />
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{pair.title}</p>
                              <p className="text-xs text-slate-500">
                                {pair.foreground} on {pair.background}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-2xl font-semibold text-slate-900">
                                  {pair.ratio}:1
                                </p>
                                <p className="text-xs text-slate-500">{pair.wcag.message}</p>
                              </div>
                              <Badge className={`rounded-full ${pair.wcag.badgeClass}`}>
                                {pair.wcag.level}
                              </Badge>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </section>
                  </TabsContent>

                  <TabsContent value="typography" className="space-y-12 focus-visible:outline-none">
                    {typographySections.scale.length > 0 && (
                      <section className="space-y-5">
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">Type Scale</h2>
                          <p className="text-sm text-slate-500">
                            Harmonized headings and body styles across breakpoints.
                          </p>
                        </div>
                        <div className="grid gap-5 md:grid-cols-2">
                          {typographySections.scale.map(([name, value]) => {
                            const spec = value as {
                              size: string;
                              weight: number;
                              lineHeight: string;
                              letterSpacing?: string;
                            };
                            return (
                              <Card
                                key={`type-scale-${name}`}
                                className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl"
                              >
                                <p
                                  style={{
                                    fontSize: spec.size,
                                    fontWeight: spec.weight,
                                    lineHeight: spec.lineHeight,
                                    letterSpacing: spec.letterSpacing,
                                  }}
                                  className="text-slate-900"
                                >
                                  The quick brown fox jumps over the lazy dog
                                </p>
                                <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
                                  <div>
                                    <p className="font-semibold text-slate-900">Token</p>
                                    <p className="mt-1 font-mono text-slate-500">{name}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-900">Size</p>
                                    <p className="mt-1 font-mono text-slate-500">{spec.size}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-900">Weight</p>
                                    <p className="mt-1 font-mono text-slate-500">{spec.weight}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-900">Line Height</p>
                                    <p className="mt-1 font-mono text-slate-500">{spec.lineHeight}</p>
                                  </div>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </section>
                    )}

                    {typographySections.fontSize.length > 0 && (
                      <section className="space-y-5">
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">Font Sizes</h2>
                          <p className="text-sm text-slate-500">
                            Modular scale tuned for comfortable reading on mobile.
                          </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {typographySections.fontSize.map(([name, value]) => {
                            const spec = value as { size: string; lineHeight: string };
                            return (
                              <Card
                                key={`font-size-${name}`}
                                className="flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
                              >
                                <div
                                  style={{ fontSize: spec.size }}
                                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900"
                                >
                                  Aa
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-slate-900">
                                    {prettifyName(name)}
                                  </p>
                                  <p className="font-mono text-xs text-slate-500">
                                    {spec.size} / {spec.lineHeight}
                                  </p>
                                </div>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => handleCopy(name)}
                                  className="h-9 w-9 rounded-full border-slate-200 text-slate-500 hover:text-slate-900"
                                >
                                  {copiedValue === name ? (
                                    <Check size={16} className="text-emerald-500" />
                                  ) : (
                                    <Copy size={16} />
                                  )}
                                </Button>
                              </Card>
                            );
                          })}
                        </div>
                      </section>
                    )}

                    {typographySections.fontWeight.length > 0 && (
                      <section className="space-y-5">
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">Font Weight</h2>
                          <p className="text-sm text-slate-500">
                            Defined weight ramp for hierarchy and emphasis.
                          </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          {typographySections.fontWeight.map(([name, value]) => (
                            <Card
                              key={`font-weight-${name}`}
                              className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
                            >
                              <p className="text-lg font-semibold text-slate-900">
                                {prettifyName(name)}
                              </p>
                              <p className="mt-2 font-mono text-sm text-slate-500">{value}</p>
                            </Card>
                          ))}
                        </div>
                      </section>
                    )}

                    {typographySections.fontFamily.length > 0 && (
                      <section className="space-y-5">
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">Font Families</h2>
                          <p className="text-sm text-slate-500">
                            System-first stacks for performance and legibility.
                          </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {typographySections.fontFamily.map(([name, value]) => (
                            <Card
                              key={`font-family-${name}`}
                              className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
                            >
                              <p className="text-sm font-semibold text-slate-900">
                                {prettifyName(name)}
                              </p>
                              <p className="mt-2 text-sm text-slate-600" style={{ fontFamily: String(value) }}>
                                The quick brown fox jumps over the lazy dog
                              </p>
                              <p className="mt-3 text-xs text-slate-500">{String(value)}</p>
                            </Card>
                          ))}
                        </div>
                      </section>
                    )}
                  </TabsContent>

                  <TabsContent value="spacing" className="space-y-12 focus-visible:outline-none">
                    {spacingEntries.length > 0 && (
                      <section className="space-y-5">
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">Spacing Scale</h2>
                          <p className="text-sm text-slate-500">
                            Core spacing tokens derived from 2px multiples for rhythm.
                          </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {spacingEntries.map(([name, value]) => (
                            <Card
                              key={`spacing-${name}`}
                              className="flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
                            >
                              <div className="flex h-14 flex-col justify-between">
                                <div
                                  className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                                  style={{ width: valueToString(value) }}
                                />
                                <div
                                  className="h-2 rounded-full bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-pink-500/40"
                                  style={{ width: valueToString(value) }}
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-900">
                                  {prettifyName(name)}
                                </p>
                                <p className="font-mono text-xs text-slate-500">{String(value)}</p>
                              </div>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleCopy(String(value))}
                                className="h-9 w-9 rounded-full border-slate-200 text-slate-500 hover:text-slate-900"
                              >
                                {copiedValue === String(value) ? (
                                  <Check size={16} className="text-emerald-500" />
                                ) : (
                                  <Copy size={16} />
                                )}
                              </Button>
                            </Card>
                          ))}
                        </div>
                      </section>
                    )}

                    <section className="space-y-5">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">Spacing Scale (px)</h2>
                        <p className="text-sm text-slate-500">
                          Numerical map for layout grids and fixed spacing decisions.
                        </p>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {Object.entries(spacingScale).map(([key, value]) => (
                          <Card
                            key={`spacing-scale-${key}`}
                            className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
                          >
                            <p className="text-3xl font-semibold text-slate-900">{value}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">px</p>
                            <p className="mt-3 font-mono text-xs text-slate-500">
                              Token: {key}
                            </p>
                          </Card>
                        ))}
                      </div>
                    </section>

                    {spacingIntent.length > 0 && (
                      <section className="space-y-5">
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">Spacing Intent</h2>
                          <p className="text-sm text-slate-500">
                            Guidance on where to apply each cluster of spacing tokens.
                          </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {spacingIntent.map(([name, values]) => (
                            <Card
                              key={`spacing-intent-${name}`}
                              className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
                            >
                              <p className="text-sm font-semibold text-slate-900">
                                {prettifyName(name)}
                              </p>
                              <div className="mt-4 flex flex-wrap gap-2">
                                {(values as string[]).map(token => (
                                  <Badge
                                    key={token}
                                    variant="outline"
                                    className="rounded-full border-indigo-200 bg-indigo-50 text-indigo-600"
                                  >
                                    {token}
                                  </Badge>
                                ))}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </section>
                    )}
                  </TabsContent>

                  <TabsContent value="radius" className="space-y-12 focus-visible:outline-none">
                    {radiusEntries.length > 0 ? (
                      <section className="space-y-5">
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">Radius Tokens</h2>
                          <p className="text-sm text-slate-500">
                            Rounded geometry that shapes the mobile brand personality.
                          </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
                          {radiusEntries.map(([name, value]) => (
                            <Card
                              key={`radius-${name}`}
                              className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
                            >
                              <div className="mb-4 aspect-square w-full rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
                                <div
                                  className="mx-auto mt-4 h-16 w-16 border border-slate-300 bg-white"
                                  style={{ borderRadius: String(value) }}
                                />
                              </div>
                              <p className="text-sm font-semibold text-slate-900">
                                {prettifyName(name)}
                              </p>
                              <p className="font-mono text-xs text-slate-500">{String(value)}</p>
                            </Card>
                          ))}
                        </div>
                      </section>
                    ) : (
                      <Card className="border-dashed border-slate-300 bg-slate-50">
                        <CardContent className="py-10 text-center">
                          <p className="text-lg font-semibold text-slate-700">No radius tokens found</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="shadows" className="space-y-12 focus-visible:outline-none">
                    {shadowEntries.length > 0 ? (
                      <section className="space-y-5">
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">Elevation & Effects</h2>
                          <p className="text-sm text-slate-500">
                            Depth tokens tailored for iOS glassmorphism and AI overlays.
                          </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {shadowEntries.map(([name, value]) => (
                            <Card
                              key={`shadow-${name}`}
                              className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-2xl"
                              style={{ boxShadow: String(value) }}
                            >
                              <p className="text-sm font-semibold">{prettifyName(name)}</p>
                              <p className="mt-3 text-xs text-slate-500">{String(value)}</p>
                            </Card>
                          ))}
                        </div>
                      </section>
                    ) : (
                      <Card className="border-dashed border-slate-300 bg-slate-50">
                        <CardContent className="py-10 text-center">
                          <p className="text-lg font-semibold text-slate-700">No elevation tokens found</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="animation" className="space-y-12 focus-visible:outline-none">
                    <section className="space-y-5">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">Motion Tokens</h2>
                        <p className="text-sm text-slate-500">
                          System-level timing, easing, and z-layer rhythm for fluid interactions.
                        </p>
                      </div>

                      <div className="grid gap-5 lg:grid-cols-3">
                        <Card className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
                          <p className="text-sm font-semibold text-slate-900">Durations</p>
                          <div className="mt-4 space-y-3">
                            {animationDurations.map(([name, value]) => (
                              <div
                                key={`duration-${name}`}
                                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                              >
                                <span className="text-sm font-medium text-slate-700">
                                  {prettifyName(name)}
                                </span>
                                <Badge className="rounded-full bg-indigo-100 text-indigo-700">
                                  {value}ms
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </Card>

                        <Card className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
                          <p className="text-sm font-semibold text-slate-900">Easing Curves</p>
                          <div className="mt-4 space-y-3">
                            {animationEasing.map(([name, value]) => (
                              <div
                                key={`easing-${name}`}
                                className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                              >
                                <span className="text-sm font-medium text-slate-700">
                                  {prettifyName(name)}
                                </span>
                                <p className="font-mono text-xs text-slate-500">{String(value)}</p>
                              </div>
                            ))}
                          </div>
                        </Card>

                        <Card className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
                          <p className="text-sm font-semibold text-slate-900">Layer Hierarchy</p>
                          <div className="mt-4 space-y-3">
                            {animationLayers.map(([name, value]) => (
                              <div
                                key={`layer-${name}`}
                                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                              >
                                <span className="text-sm font-medium text-slate-700">
                                  {prettifyName(name)}
                                </span>
                                <Badge variant="outline" className="rounded-full border-indigo-200 text-indigo-600">
                                  z-{value}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </div>
                    </section>
                  </TabsContent>
                </div>
              </Tabs>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemViewer;
