import React, { useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/components/ui/utils';
import {
  designTokens,
  spacingScale,
  spacingPurpose,
} from '../designSystem/tokens';
import {
  Copy,
  Check,
  Sparkles,
  Palette,
  Type,
  Ruler,
  Square,
  SunMedium,
  Timer,
  GitBranch,
  Search,
} from 'lucide-react';

const NAVIGATION: {
  heading: string;
  items: { id: string; label: string; icon: LucideIcon }[];
}[] = [
  {
    heading: 'Sections',
    items: [
      { id: 'overview', label: 'Overview', icon: Sparkles },
      { id: 'colors', label: 'Color System', icon: Palette },
      { id: 'typography', label: 'Typography', icon: Type },
      { id: 'spacing', label: 'Spacing & Layout', icon: Ruler },
      { id: 'radius', label: 'Shape Language', icon: Square },
      { id: 'shadows', label: 'Depth & Elevation', icon: SunMedium },
      { id: 'motion', label: 'Motion System', icon: Timer },
    ],
  },
];

const prettifyName = (token: string | number) =>
  String(token)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());

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

const valueToString = (value: unknown) => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  return flattenToken(value);
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
      badgeClass: 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/40',
      message: 'Passes small text & UI',
    } as const;
  }
  if (ratio >= 4.5) {
    return {
      level: 'AA',
      badgeClass: 'bg-sky-400/20 text-sky-200 border border-sky-400/40',
      message: 'Passes large text',
    } as const;
  }
  return {
    level: 'Improve',
    badgeClass: 'bg-amber-400/20 text-amber-200 border border-amber-400/40',
    message: 'Below recommended contrast',
  } as const;
};

export const DesignSystemViewer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const matchesQuery = useMemo(() => {
    if (!normalizedQuery) {
      return () => true;
    }

    return (label: string, value: unknown) => {
      const haystack = `${label} ${flattenToken(value)}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    };
  }, [normalizedQuery]);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedValue(value);
    window.setTimeout(() => setCopiedValue(null), 2000);
  };

  useEffect(() => {
    const ids = NAVIGATION.flatMap(group => group.items.map(item => item.id));
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0.1 },
    );

    const elements = ids
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
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
      Object.keys(designTokens.spacing).length +
      Object.keys(designTokens.radius).length;
    const motionCount =
      Object.keys(designTokens.shadow).length +
      Object.keys(designTokens.animation.duration).length +
      Object.keys(designTokens.animation.easing).length;

    return [
      {
        title: 'Token Families',
        value: colorCount + typeCount + spacingCount + motionCount,
        description: 'Foundational primitives curated for mobile-first AI experiences.',
      },
      {
        title: 'Color System',
        value: colorCount,
        description: 'Brand, semantic, and neutral palettes with contrast coverage.',
      },
      {
        title: 'Type Ramp',
        value: typeCount,
        description: 'Headline, body, and utility styles tuned for clarity.',
      },
      {
        title: 'Motion & Depth',
        value: motionCount,
        description: 'Elevation, easing, and timing tokens for fluid interactions.',
      },
    ];
  }, []);

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
    const surfaces = Object.entries(designTokens.color.background ?? {}).filter(
      ([name, value]) => matchesQuery(name, value),
    );
    const borders = Object.entries(designTokens.color.border ?? {}).filter(([name, value]) =>
      matchesQuery(name, value),
    );
    const opacity = Object.entries(designTokens.color.opacity ?? {}).filter(([name, value]) =>
      matchesQuery(name, value),
    );

    return { primary, brand, semantic, neutral, surfaces, borders, opacity };
  }, [matchesQuery]);

  const typographySections = useMemo(() => {
    const scale = Object.entries(designTokens.typography.scale).filter(([name, value]) =>
      matchesQuery(name, value),
    );
    const fontSize = Object.entries(designTokens.typography.fontSize).filter(([name, value]) =>
      matchesQuery(name, value),
    );
    const fontWeight = Object.entries(designTokens.typography.fontWeight).filter(
      ([name, value]) => matchesQuery(name, value),
    );
    const fontFamily = Object.entries(designTokens.typography.fontFamily).filter(
      ([name, value]) => matchesQuery(name, value),
    );

    return { scale, fontSize, fontWeight, fontFamily };
  }, [matchesQuery]);

  const spacingEntries = useMemo(
    () =>
      Object.entries(designTokens.spacing).filter(([name, value]) => matchesQuery(name, value)),
    [matchesQuery],
  );

  const spacingIntent = useMemo(
    () =>
      Object.entries(spacingPurpose).filter(([name, value]) =>
        matchesQuery(name, (value as string[]).join(' ')),
      ),
    [matchesQuery],
  );

  const radiusEntries = useMemo(
    () =>
      Object.entries(designTokens.radius).filter(([name, value]) => matchesQuery(name, value)),
    [matchesQuery],
  );

  const shadowEntries = useMemo(
    () =>
      Object.entries(designTokens.shadow).filter(([name, value]) => matchesQuery(name, value)),
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

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const hasQuery = Boolean(normalizedQuery);
  const hasColorResults = Object.values(colorSections).some(section => section.length > 0);
  const hasTypographyResults =
    typographySections.scale.length > 0 ||
    typographySections.fontSize.length > 0 ||
    typographySections.fontWeight.length > 0 ||
    typographySections.fontFamily.length > 0;
  const hasSpacingResults = spacingEntries.length > 0 || spacingIntent.length > 0;
  const hasRadiusResults = radiusEntries.length > 0;
  const hasShadowResults = shadowEntries.length > 0;
  const hasMotionResults =
    animationDurations.length > 0 ||
    animationEasing.length > 0 ||
    animationLayers.length > 0;

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#050505] text-slate-200">
      <aside className="relative hidden h-full w-72 flex-col border-r border-white/5 bg-black/25 px-5 py-8 md:flex lg:w-80">
        <div>
          <div className="text-xs uppercase tracking-[0.4em] text-slate-500">System</div>
          <div className="mt-2 text-lg font-semibold text-white">Ohouse AI</div>
          <p className="mt-1 text-xs text-slate-500">
            Navigate foundational tokens and usage guidelines.
          </p>
          <div className="mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                placeholder="Search tokens"
                className="h-10 rounded-xl border-white/10 bg-[#0d0d10] pl-9 text-sm placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-slate-100/20"
              />
            </div>
          </div>
        </div>

        <ScrollArea className="mt-8 flex-1 pr-2">
          <div className="space-y-8">
            {NAVIGATION.map(group => (
              <div key={group.heading} className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {group.heading}
                </div>
                <div className="space-y-1">
                  {group.items.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition',
                        activeSection === item.id
                          ? 'bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white',
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-6 rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-4">
          <p className="text-sm font-semibold text-white">Need user flows?</p>
          <p className="mt-1 text-xs text-slate-400">
            Switch to the Flow Explorer to audit end-to-end journeys.
          </p>
          <Button
            size="sm"
            className="mt-4 h-9 w-full rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            <GitBranch className="mr-2 h-4 w-4" /> Flow View
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:px-12">
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 md:hidden">
            {NAVIGATION[0].items.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition',
                  activeSection === item.id
                    ? 'border-white/40 bg-white/10 text-white'
                    : 'border-white/10 bg-white/5 text-slate-400',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>

          <section id="overview" className="relative">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#0c0c12] via-[#11111b] to-[#09090f] px-8 py-12 shadow-[0_50px_120px_-60px_rgba(59,130,246,0.45)]">
              <div className="absolute -left-16 top-[-80px] h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl" />
              <div className="absolute -right-10 bottom-[-60px] h-72 w-72 rounded-full bg-purple-500/25 blur-3xl" />

              <div className="relative flex flex-col gap-10">
                <div className="space-y-4 text-white">
                  <Badge className="border border-white/30 bg-white/10 text-xs uppercase tracking-[0.3em] text-white">
                    System v1.1
                  </Badge>
                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                      Ohouse AI Design System
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200/80 sm:text-base">
                      Purpose-built tokens that align visuals, motion, and accessibility across the
                      AI-assisted mobile experience. Updated weekly as new patterns ship.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo-300" /> Crafted for clarity
                    </div>
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-purple-300" /> Tokens synced to Figma
                    </div>
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-sky-300" /> Automated audits nightly
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button className="h-11 rounded-xl border border-white/20 bg-white/15 px-6 text-white shadow-lg shadow-indigo-500/20 transition hover:bg-white/25">
                    <GitBranch className="mr-2 h-5 w-5" /> Flow Explorer
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11 rounded-xl border border-white/20 bg-transparent px-6 text-white hover:bg-white/10"
                  >
                    Download Tokens
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {heroStats.map(stat => (
                    <Card
                      key={stat.title}
                      className="border-white/10 bg-white/5 text-white shadow-inner backdrop-blur"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-white/80">
                          {stat.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-semibold">{stat.value}</div>
                        <p className="mt-1 text-xs text-white/60">{stat.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="colors" className="mt-16 space-y-8">
            <div className="flex flex-col gap-2">
              <Badge className="w-fit border border-indigo-400/40 bg-indigo-500/20 text-indigo-100">
                Foundations
              </Badge>
              <h2 className="text-2xl font-semibold text-white">Color System</h2>
              <p className="max-w-2xl text-sm text-slate-400">
                Brand, semantic, and neutral palettes tuned for accessibility. Tokens display live
                previews and contrast health.
              </p>
            </div>

            {hasQuery && !hasColorResults ? (
              <Card className="border-dashed border-white/10 bg-white/5">
                <CardContent className="py-12 text-center text-sm text-slate-400">
                  No color tokens match “{searchQuery}”. Adjust your search to reveal palette
                  entries.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-10">
                {colorSections.primary.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-semibold text-white">Primary Palette</h3>
                      <p className="text-sm text-slate-500">
                        Core hues that define the Ohouse AI brand footprint.
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {colorSections.primary.map(([name, value]) => (
                        <Card
                          key={`primary-${name}`}
                          className="group overflow-hidden border-white/10 bg-[#101018] transition hover:border-indigo-400/40 hover:shadow-[0_0_0_1px_rgba(99,102,241,0.5)]"
                        >
                          <div
                            className="h-32 w-full rounded-b-3xl"
                            style={{ backgroundColor: String(value) }}
                          />
                          <CardContent className="flex items-center justify-between p-5">
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {prettifyName(name)}
                              </p>
                              <p className="font-mono text-xs text-slate-400">{String(value)}</p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleCopy(String(value))}
                              className="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:text-white"
                            >
                              {copiedValue === String(value) ? (
                                <Check className="h-4 w-4 text-emerald-300" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {colorSections.brand.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-semibold text-white">Brand Extensions</h3>
                      <p className="text-sm text-slate-500">
                        Supporting colors for gradients, illustrations, and premium accents.
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {colorSections.brand.map(([name, value]) => (
                        <Card
                          key={`brand-${name}`}
                          className="border-white/10 bg-[#101018] transition hover:border-purple-400/40 hover:shadow-[0_0_0_1px_rgba(168,85,247,0.45)]"
                        >
                          <div
                            className="h-28 w-full rounded-b-3xl"
                            style={{ backgroundColor: String(value) }}
                          />
                          <CardContent className="flex items-center justify-between p-5">
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {prettifyName(name)}
                              </p>
                              <p className="font-mono text-xs text-slate-400">{String(value)}</p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleCopy(String(value))}
                              className="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:text-white"
                            >
                              {copiedValue === String(value) ? (
                                <Check className="h-4 w-4 text-emerald-300" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {colorSections.semantic.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-semibold text-white">Semantic Tokens</h3>
                      <p className="text-sm text-slate-500">
                        Clear feedback states for success, warnings, and elevated info.
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {colorSections.semantic.map(([name, value]) => (
                        <Card
                          key={`semantic-${name}`}
                          className="border-white/10 bg-[#101018] transition hover:border-emerald-400/40 hover:shadow-[0_0_0_1px_rgba(16,185,129,0.45)]"
                        >
                          <div
                            className="h-24 w-full rounded-b-3xl"
                            style={{ backgroundColor: String(value) }}
                          />
                          <CardContent className="flex items-center justify-between p-5">
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {prettifyName(name)}
                              </p>
                              <p className="font-mono text-xs text-slate-400">{String(value)}</p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleCopy(String(value))}
                              className="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:text-white"
                            >
                              {copiedValue === String(value) ? (
                                <Check className="h-4 w-4 text-emerald-300" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {colorSections.neutral.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-semibold text-white">Neutral Ramp</h3>
                      <p className="text-sm text-slate-500">
                        Achromatic surfaces and text pairings that anchor the interface.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {colorSections.neutral.map(([name, value]) => (
                        <Card
                          key={`neutral-${name}`}
                          className="flex items-center justify-between gap-4 border-white/10 bg-[#0d0d12] p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="h-12 w-12 rounded-xl border border-white/10 shadow-inner"
                              style={{ backgroundColor: String(value) }}
                            />
                            <div>
                              <p className="text-sm font-semibold text-white">Step {name}</p>
                              <p className="font-mono text-xs text-slate-400">{String(value)}</p>
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleCopy(String(value))}
                            className="h-8 w-8 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white"
                          >
                            {copiedValue === String(value) ? (
                              <Check className="h-4 w-4 text-emerald-300" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {(colorSections.surfaces.length > 0 || colorSections.borders.length > 0) && (
                  <div className="grid gap-6 lg:grid-cols-2">
                    {colorSections.surfaces.length > 0 && (
                      <Card className="border-white/10 bg-[#0d0d12]">
                        <CardHeader>
                          <CardTitle className="text-sm font-semibold text-white">
                            Surface Tokens
                          </CardTitle>
                          <CardDescription className="text-xs text-slate-500">
                            Background layers for shells, sheets, and immersive sections.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {colorSections.surfaces.map(([name, value]) => (
                            <div
                              key={`surface-${name}`}
                              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="h-10 w-10 rounded-lg border border-white/10"
                                  style={{ backgroundColor: String(value) }}
                                />
                                <div>
                                  <p className="text-sm font-medium text-white">
                                    {prettifyName(name)}
                                  </p>
                                  <p className="font-mono text-xs text-slate-400">{String(value)}</p>
                                </div>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleCopy(String(value))}
                                className="h-8 w-8 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white"
                              >
                                {copiedValue === String(value) ? (
                                  <Check className="h-4 w-4 text-emerald-300" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {colorSections.borders.length > 0 && (
                      <Card className="border-white/10 bg-[#0d0d12]">
                        <CardHeader>
                          <CardTitle className="text-sm font-semibold text-white">
                            Border & Divider Tokens
                          </CardTitle>
                          <CardDescription className="text-xs text-slate-500">
                            Define structure and separation across components.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {colorSections.borders.map(([name, value]) => (
                            <div
                              key={`border-${name}`}
                              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3"
                            >
                              <div>
                                <p className="text-sm font-medium text-white">{prettifyName(name)}</p>
                                <p className="font-mono text-xs text-slate-400">{String(value)}</p>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleCopy(String(value))}
                                className="h-8 w-8 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white"
                              >
                                {copiedValue === String(value) ? (
                                  <Check className="h-4 w-4 text-emerald-300" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {colorSections.opacity.length > 0 && (
                  <Card className="border-white/10 bg-[#0d0d12]">
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold text-white">
                        Opacity Tokens
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Apply consistent translucency across overlays, hovers, and disabled states.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {colorSections.opacity.map(([name, value]) => {
                        const numericValue = Number(value);
                        return (
                          <div
                            key={`opacity-${name}`}
                            className="rounded-2xl border border-white/10 bg-white/5 p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  {prettifyName(name)}
                                </p>
                                <p className="font-mono text-xs text-slate-400">{numericValue}</p>
                              </div>
                              <Badge className="rounded-full border border-indigo-400/40 bg-indigo-500/20 text-indigo-100">
                                {Math.round(numericValue * 100)}%
                              </Badge>
                            </div>
                            <div className="mt-4 h-10 overflow-hidden rounded-xl border border-white/10">
                              <div
                                className="h-full w-full"
                                style={{
                                  background: `linear-gradient(90deg, rgba(59,130,246,${numericValue}) 0%, rgba(59,130,246,${Math.max(
                                    numericValue - 0.2,
                                    0,
                                  )}) 60%, rgba(59,130,246,0.1) 100%)`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                )}

                <Card className="border-white/10 bg-[#0d0d12]">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-white">
                      Contrast Health Checks
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Evaluate core text/background pairings against WCAG 2.1 ratios.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {contrastPairs.map(pair => (
                      <div
                        key={pair.id}
                        className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <div
                          className="h-16 rounded-xl border border-white/10"
                          style={{
                            background: `linear-gradient(135deg, ${pair.foreground} 0%, ${pair.background} 100%)`,
                          }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-white">{pair.title}</p>
                          <p className="text-xs text-slate-400">
                            {pair.foreground} on {pair.background}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-semibold text-white">{pair.ratio}:1</div>
                            <p className="text-xs text-slate-500">{pair.wcag.message}</p>
                          </div>
                          <Badge className={`rounded-full ${pair.wcag.badgeClass}`}>{pair.wcag.level}</Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </section>

          <section id="typography" className="mt-20 space-y-8">
            <div className="flex flex-col gap-2">
              <Badge className="w-fit border border-sky-400/40 bg-sky-500/20 text-sky-100">
                Language
              </Badge>
              <h2 className="text-2xl font-semibold text-white">Typography</h2>
              <p className="max-w-2xl text-sm text-slate-400">
                Harmonised headline, body, and utility styles tuned for reading on dense mobile
                surfaces.
              </p>
            </div>

            {hasQuery && !hasTypographyResults ? (
              <Card className="border-dashed border-white/10 bg-white/5">
                <CardContent className="py-12 text-center text-sm text-slate-400">
                  No typography tokens match “{searchQuery}”.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-10">
                {typographySections.scale.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Type Scale</h3>
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
                            key={`type-${name}`}
                            className="border-white/10 bg-[#0d0d12] p-6 text-white shadow-[0_0_0_1px_rgba(148,163,184,0.08)] transition hover:shadow-[0_10px_40px_-20px_rgba(99,102,241,0.45)]"
                          >
                            <p
                              style={{
                                fontSize: spec.size,
                                fontWeight: spec.weight,
                                lineHeight: spec.lineHeight,
                                letterSpacing: spec.letterSpacing,
                              }}
                              className="text-white"
                            >
                              The quick brown fox jumps over the lazy dog
                            </p>
                            <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-slate-400">
                              <div>
                                <p className="font-semibold text-slate-200">Token</p>
                                <p className="mt-1 font-mono">{name}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-200">Size</p>
                                <p className="mt-1 font-mono">{spec.size}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-200">Weight</p>
                                <p className="mt-1 font-mono">{spec.weight}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-200">Line Height</p>
                                <p className="mt-1 font-mono">{spec.lineHeight}</p>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

                {typographySections.fontSize.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Font Sizes</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {typographySections.fontSize.map(([name, value]) => {
                        const spec = value as { size: string; lineHeight: string };
                        return (
                          <Card
                            key={`font-size-${name}`}
                            className="flex items-center gap-4 border-white/10 bg-[#0d0d12] p-5"
                          >
                            <div
                              style={{ fontSize: spec.size }}
                              className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white"
                            >
                              Aa
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-white">{prettifyName(name)}</p>
                              <p className="font-mono text-xs text-slate-400">
                                {spec.size} / {spec.lineHeight}
                              </p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleCopy(name)}
                              className="h-8 w-8 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white"
                            >
                              {copiedValue === name ? (
                                <Check className="h-4 w-4 text-emerald-300" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

                {typographySections.fontWeight.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Font Weight Ramp</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {typographySections.fontWeight.map(([name, value]) => (
                        <Card
                          key={`font-weight-${name}`}
                          className="border-white/10 bg-[#0d0d12] p-5 text-center"
                        >
                          <p className="text-lg font-semibold text-white">{prettifyName(name)}</p>
                          <p className="mt-2 font-mono text-sm text-slate-400">{value}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {typographySections.fontFamily.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Font Families</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {typographySections.fontFamily.map(([name, value]) => (
                        <Card
                          key={`font-family-${name}`}
                          className="border-white/10 bg-[#0d0d12] p-5"
                        >
                          <p className="text-sm font-semibold text-white">{prettifyName(name)}</p>
                          <p className="mt-3 text-sm text-slate-300" style={{ fontFamily: String(value) }}>
                            The quick brown fox jumps over the lazy dog
                          </p>
                          <p className="mt-3 text-xs text-slate-500">{String(value)}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          <section id="spacing" className="mt-20 space-y-8">
            <div className="flex flex-col gap-2">
              <Badge className="w-fit border border-emerald-400/40 bg-emerald-500/20 text-emerald-100">
                Layout
              </Badge>
              <h2 className="text-2xl font-semibold text-white">Spacing & Layout</h2>
              <p className="max-w-2xl text-sm text-slate-400">
                Consistent spacing tokens and usage intent to maintain rhythm and balance.
              </p>
            </div>

            {hasQuery && !hasSpacingResults ? (
              <Card className="border-dashed border-white/10 bg-white/5">
                <CardContent className="py-12 text-center text-sm text-slate-400">
                  No spacing tokens match “{searchQuery}”.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-10">
                {spacingEntries.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Spacing Scale</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {spacingEntries.map(([name, value]) => (
                        <Card
                          key={`spacing-${name}`}
                          className="border-white/10 bg-[#0d0d12] p-5"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-white">{prettifyName(name)}</p>
                              <p className="font-mono text-xs text-slate-400">{String(value)}</p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleCopy(String(value))}
                              className="h-8 w-8 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white"
                            >
                              {copiedValue === String(value) ? (
                                <Check className="h-4 w-4 text-emerald-300" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="mt-4 h-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                            style={{ width: valueToString(value) }}
                          />
                          <div className="mt-2 h-2 rounded-full bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-pink-500/40"
                            style={{ width: valueToString(value) }}
                          />
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <Card className="border-white/10 bg-[#0d0d12]">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-white">Spacing Scale (px)</CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Numerical tokens that map 1:1 with the visual spacing ramp.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(spacingScale).map(([key, value]) => (
                      <div
                        key={`spacing-scale-${key}`}
                        className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center"
                      >
                        <div className="text-3xl font-semibold text-white">{value}</div>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">px</p>
                        <p className="mt-3 font-mono text-xs text-slate-500">Token: {key}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {spacingIntent.length > 0 && (
                  <Card className="border-white/10 bg-[#0d0d12]">
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold text-white">Spacing Intent</CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Suggested contexts for each cluster of tokens.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      {spacingIntent.map(([name, values]) => (
                        <div key={`spacing-intent-${name}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <p className="text-sm font-semibold text-white">{prettifyName(name)}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {(values as string[]).map(token => (
                              <Badge
                                key={token}
                                className="rounded-full border border-indigo-400/40 bg-indigo-500/15 text-indigo-100"
                              >
                                {token}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </section>

          <section id="radius" className="mt-20 space-y-8">
            <div className="flex flex-col gap-2">
              <Badge className="w-fit border border-purple-400/40 bg-purple-500/20 text-purple-100">
                Shape
              </Badge>
              <h2 className="text-2xl font-semibold text-white">Shape Language</h2>
              <p className="max-w-2xl text-sm text-slate-400">
                Rounding tokens that define the tactile, friendly appearance of our components.
              </p>
            </div>

            {hasQuery && !hasRadiusResults ? (
              <Card className="border-dashed border-white/10 bg-white/5">
                <CardContent className="py-12 text-center text-sm text-slate-400">
                  No radius tokens match “{searchQuery}”.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {radiusEntries.map(([name, value]) => (
                  <Card key={`radius-${name}`} className="border-white/10 bg-[#0d0d12] p-5">
                    <div className="mb-4 aspect-square w-full rounded-2xl border border-white/10 bg-white/5">
                      <div
                        className="mx-auto mt-4 h-16 w-16 border border-white/10 bg-white"
                        style={{ borderRadius: String(value) }}
                      />
                    </div>
                    <p className="text-sm font-semibold text-white">{prettifyName(name)}</p>
                    <p className="font-mono text-xs text-slate-400">{String(value)}</p>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section id="shadows" className="mt-20 space-y-8">
            <div className="flex flex-col gap-2">
              <Badge className="w-fit border border-amber-400/40 bg-amber-500/20 text-amber-100">
                Depth
              </Badge>
              <h2 className="text-2xl font-semibold text-white">Depth & Elevation</h2>
              <p className="max-w-2xl text-sm text-slate-400">
                Elevation ramp tailored for glassmorphism overlays and AI-driven highlights.
              </p>
            </div>

            {hasQuery && !hasShadowResults ? (
              <Card className="border-dashed border-white/10 bg-white/5">
                <CardContent className="py-12 text-center text-sm text-slate-400">
                  No elevation tokens match “{searchQuery}”.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {shadowEntries.map(([name, value]) => (
                  <Card
                    key={`shadow-${name}`}
                    className="border-white/10 bg-[#0d0d12] p-6 text-white"
                    style={{ boxShadow: String(value) }}
                  >
                    <p className="text-sm font-semibold">{prettifyName(name)}</p>
                    <p className="mt-3 text-xs text-slate-300">{String(value)}</p>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section id="motion" className="mt-20 space-y-8 pb-24">
            <div className="flex flex-col gap-2">
              <Badge className="w-fit border border-pink-400/40 bg-pink-500/20 text-pink-100">
                Motion
              </Badge>
              <h2 className="text-2xl font-semibold text-white">Motion System</h2>
              <p className="max-w-2xl text-sm text-slate-400">
                Timing, easing, and layering tokens that choreograph AI-assisted interactions.
              </p>
            </div>

            {hasQuery && !hasMotionResults ? (
              <Card className="border-dashed border-white/10 bg-white/5">
                <CardContent className="py-12 text-center text-sm text-slate-400">
                  No motion tokens match “{searchQuery}”.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-5 lg:grid-cols-3">
                <Card className="border-white/10 bg-[#0d0d12]">
                  <CardHeader className="px-5 pb-0 pt-5">
                    <CardTitle className="text-sm font-semibold text-white">Durations</CardTitle>
                    <CardDescription className="mt-1 text-xs text-slate-500">
                      Temporal rhythm for transitions and feedback.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pb-5 pl-5 pr-5 pt-4">
                    {animationDurations.map(([name, value]) => (
                      <div
                        key={`duration-${name}`}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <span className="text-sm font-semibold text-white">{prettifyName(name)}</span>
                        <Badge className="rounded-full border border-indigo-400/40 bg-indigo-500/20 text-indigo-100">
                          {value}ms
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-[#0d0d12]">
                  <CardHeader className="px-5 pb-0 pt-5">
                    <CardTitle className="text-sm font-semibold text-white">Easing Curves</CardTitle>
                    <CardDescription className="mt-1 text-xs text-slate-500">
                      Motion intent for accelerate, decelerate, and custom flows.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pb-5 pl-5 pr-5 pt-4">
                    {animationEasing.map(([name, value]) => (
                      <div
                        key={`easing-${name}`}
                        className="space-y-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <span className="text-sm font-semibold text-white">{prettifyName(name)}</span>
                        <p className="font-mono text-xs text-slate-400">{String(value)}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-[#0d0d12]">
                  <CardHeader className="px-5 pb-0 pt-5">
                    <CardTitle className="text-sm font-semibold text-white">Layer Hierarchy</CardTitle>
                    <CardDescription className="mt-1 text-xs text-slate-500">
                      Z-index tokens for overlays, modals, and toasts.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pb-5 pl-5 pr-5 pt-4">
                    {animationLayers.map(([name, value]) => (
                      <div
                        key={`layer-${name}`}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <span className="text-sm font-semibold text-white">{prettifyName(name)}</span>
                        <Badge className="rounded-full border border-indigo-400/40 bg-indigo-500/20 text-indigo-100">
                          z-{value}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default DesignSystemViewer;
