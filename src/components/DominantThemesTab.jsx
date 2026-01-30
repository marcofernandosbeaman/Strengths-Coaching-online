import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Sparkles, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STORAGE_KEY = "soundboard_dominant_themes_v1";

function safeParseJson(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function withTrademark(name) {
  return `${name}®`;
}

// Geometry helpers (SVG donut)
function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function arcPath(cx, cy, rOuter, rInner, startAngle, endAngle) {
  const startOuter = polarToCartesian(cx, cy, rOuter, endAngle);
  const endOuter = polarToCartesian(cx, cy, rOuter, startAngle);
  const startInner = polarToCartesian(cx, cy, rInner, startAngle);
  const endInner = polarToCartesian(cx, cy, rInner, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${rInner} ${rInner} 0 ${largeArcFlag} 1 ${endInner.x} ${endInner.y}`,
    "Z",
  ].join(" ");
}

function segmentMidpoint(cx, cy, r, startAngle, endAngle) {
  const mid = (startAngle + endAngle) / 2;
  return polarToCartesian(cx, cy, r, mid);
}

// Blend generator (simple, rule-based)
function generateBlend(a, b) {
  const aName = withTrademark(a.name);
  const bName = withTrademark(b.name);
  const aDomain = a.domain;
  const bDomain = b.domain;
  const domainLine = aDomain && bDomain ? `Domains: ${aDomain} + ${bDomain}` : "";
  const complement =
    aDomain && bDomain && aDomain !== bDomain
      ? "Different domains often creates a broad, balanced blend, as long as you stay intentional about what leads."
      : "Same-domain blends can feel powerful and consistent, especially under pressure, but can become intense if overused.";

  return {
    title: `${aName} + ${bName}`,
    summary: `Together, this can look like ${a.blurb} When paired with ${b.name.toLowerCase()}, it may show up as a distinctive way of thinking, relating, or acting. ${complement}`,
    whatYouMightLove: [
      "Clarity about what matters, with energy to follow through.",
      "A sense of momentum once you commit.",
    ],
    watchFor: [
      "Overusing the blend when a simpler approach would do.",
      "Moving faster than others can follow.",
    ],
  };
}

export function DominantThemesTab(props) {
  const { strengths, themeToDomain, getThemeColourClass } = props;

  const strengthByKey = React.useMemo(() => {
    const m = new Map();
    strengths.forEach((s) => m.set(s.key, s));
    return m;
  }, [strengths]);

  const [state, setState] = React.useState(() => {
    if (typeof window === "undefined") {
      return { slots: Array(10).fill(null), showDomainColours: true };
    }
    return safeParseJson(localStorage.getItem(STORAGE_KEY), {
      slots: Array(10).fill(null),
      showDomainColours: true,
    });
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const slots = state.slots;
  const showDomainColours = state.showDomainColours;

  const selectedKeys = React.useMemo(
    () => slots.filter((k) => Boolean(k)),
    [slots]
  );

  const allTenSelected = selectedKeys.length === 10;

  // Theme details dialog (double-click)
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [detailKey, setDetailKey] = React.useState(null);

  // Blend mode: select 2 from chosen 10
  const [blendMode, setBlendMode] = React.useState(false);
  const [blendKeys, setBlendKeys] = React.useState([]); // max 2

  function setSlot(index, key) {
    setState((prev) => {
      const next = [...prev.slots];
      next[index] = key;
      return { ...prev, slots: next };
    });
  }

  function clearAll() {
    setState((prev) => ({ ...prev, slots: Array(10).fill(null) }));
    setBlendKeys([]);
    setBlendMode(false);
    setDetailOpen(false);
  }

  function openDetail(themeKey) {
    setDetailKey(themeKey);
    setDetailOpen(true);
  }

  function isOptionDisabled(optionKey, slotIndex) {
    return slots.some((k, i) => i !== slotIndex && k === optionKey);
  }

  function toggleBlendPick(themeKey) {
    if (!blendMode) return;
    if (!selectedKeys.includes(themeKey)) return;

    setBlendKeys((prev) => {
      if (prev.includes(themeKey)) return prev.filter((k) => k !== themeKey);
      if (prev.length >= 2) return prev; // block at 2
      return [...prev, themeKey];
    });
  }

  const blend = React.useMemo(() => {
    if (blendKeys.length !== 2) return null;
    const a0 = strengthByKey.get(blendKeys[0]);
    const b0 = strengthByKey.get(blendKeys[1]);
    if (!a0 || !b0) return null;

    const a = {
      ...a0,
      domain: a0.domain ?? (themeToDomain ? themeToDomain[a0.key] : undefined),
    };
    const b = {
      ...b0,
      domain: b0.domain ?? (themeToDomain ? themeToDomain[b0.key] : undefined),
    };

    return generateBlend(a, b);
  }, [blendKeys, strengthByKey, themeToDomain]);

  // Wheel render
  const size = 420;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 190;
  const rInner = 120;
  const segmentAngle = 360 / 10;

  const centrePanel = (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-[240px]">
        <Card className="rounded-2xl shadow-sm pointer-events-auto">
          <CardContent className="pt-4">
            {!blendMode ? (
              <>
                <div className="text-sm font-semibold">Dominant themes</div>
                <div className="text-xs opacity-80 mt-1">
                  Double-click a segment for details.
                </div>
              </>
            ) : blend ? (
              <>
                <div className="text-sm font-semibold leading-snug">
                  {blend.title}
                </div>
                <div className="text-xs leading-relaxed mt-2 line-clamp-5">
                  {blend.summary}
                </div>
                <div className="mt-3 grid gap-2">
                  <div>
                    <div className="text-xs font-semibold">What you might love</div>
                    <ul className="mt-1 text-xs list-disc pl-5">
                      {blend.whatYouMightLove.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Watch for</div>
                    <ul className="mt-1 text-xs list-disc pl-5">
                      {blend.watchFor.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBlendKeys([])}
                  >
                    Reset
                  </Button>
                  <div className="text-[11px] opacity-70">Use what fits.</div>
                </div>
              </>
            ) : (
              <>
                <div className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Theme blend
                </div>
                <div className="text-xs opacity-80 mt-1">
                  Click two themes on the wheel.
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {blendKeys.length === 0 ? (
                    <Badge variant="secondary">Pick first theme</Badge>
                  ) : null}
                  {blendKeys.map((k) => {
                    const s = strengthByKey.get(k);
                    return (
                      <Badge key={k} variant="secondary">
                        {s ? withTrademark(s.name) : k}
                      </Badge>
                    );
                  })}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBlendKeys([])}
                  >
                    Reset
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  function renderWheel() {
    if (!allTenSelected) {
      return (
        <div className="flex items-center justify-center h-[420px]">
          <div className="text-center max-w-sm">
            <div className="text-lg font-semibold">Dominant themes</div>
            <div className="text-sm opacity-80 mt-1">
              Select your 10 themes to populate your wheel.
            </div>
            <div className="mt-4 rounded-2xl border border-dashed p-6 opacity-70">
              Wheel will appear once all 10 slots are filled.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-[420px] h-[420px]">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {slots.map((themeKey, idx) => {
            if (!themeKey) return null;
            const s0 = strengthByKey.get(themeKey);
            const name = s0 ? withTrademark(s0.name) : themeKey;
            const start = idx * segmentAngle;
            const end = start + segmentAngle;
            const domain =
              s0?.domain ?? (themeToDomain ? themeToDomain[themeKey] : undefined);

            const fillClass = showDomainColours
              ? getThemeColourClass(themeKey, domain)
              : "fill-neutral-200";
            const strokeClass = showDomainColours
              ? "stroke-white/70"
              : "stroke-neutral-300";

            const labelPos = segmentMidpoint(
              cx,
              cy,
              (rOuter + rInner) / 2,
              start,
              end
            );

            const isBlendPick = blendKeys.includes(themeKey);

            return (
              <g key={`${themeKey}-${idx}`}>
                <path
                  d={arcPath(cx, cy, rOuter, rInner, start, end)}
                  className={`${fillClass} ${strokeClass} cursor-pointer`}
                  strokeWidth={2}
                  onClick={() => {
                    if (blendMode) toggleBlendPick(themeKey);
                  }}
                  onDoubleClick={() => openDetail(themeKey)}
                />
                {isBlendPick ? (
                  <path
                    d={arcPath(cx, cy, rOuter, rInner, start, end)}
                    className="fill-transparent stroke-black/40"
                    strokeWidth={4}
                    pointerEvents="none"
                  />
                ) : null}
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="select-none"
                  style={{ fontSize: 12, fontWeight: 600 }}
                  fill={showDomainColours ? "white" : "#111"}
                >
                  {name}
                </text>
                <text
                  x={labelPos.x}
                  y={labelPos.y + 18}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="select-none"
                  style={{ fontSize: 11, fontWeight: 500 }}
                  fill={showDomainColours ? "white" : "#333"}
                >
                  #{idx + 1}
                </text>
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r={rInner - 18} className="fill-white" />
        </svg>
        {centrePanel}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="pt-5">
          <div className="flex flex-col gap-2">
            <div className="text-xl font-semibold">Dominant themes</div>
            <div className="text-sm opacity-80 leading-relaxed">
              <p>
                When we first receive our CliftonStrengths report, our themes are
                shown in a linear order from 1 to 34.
              </p>
              <p className="mt-2">
                It can be tempting to assume that our #1 theme is significantly
                stronger than our #10, simply because of where it sits on the
                list.
              </p>
              <p className="mt-2">
                By taking our top 10 dominant themes out of that linear order
                and placing them into a circle, we are invited to see them
                differently.
              </p>
              <p className="mt-2">
                This view helps us appreciate how our dominant themes interact,
                how they blend, and how they can bring balance and regulation to
                one another, depending on the situation we are in.
              </p>
              <p className="mt-2 font-medium">
                Let's start exploring how your dominant themes work together.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
              <div className="flex items-center gap-2">
                <span className="text-sm opacity-80">Domain colours</span>
                <Switch
                  checked={showDomainColours}
                  onCheckedChange={(v) =>
                    setState((p) => ({ ...p, showDomainColours: v }))
                  }
                />
              </div>
              <Button variant="outline" onClick={clearAll}>
                Clear
              </Button>
            </div>
          </div>
          <div className="grid gap-4 mt-5 lg:grid-cols-2">
            {/* Left: 10 ranked selectors */}
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Your top 10 (ranked)</div>
                <Badge variant="secondary">{selectedKeys.length}/10</Badge>
              </div>
              <div className="grid gap-2">
                {Array.from({ length: 10 }).map((_, i) => {
                  const current = slots[i];
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-8 text-sm font-semibold">{i + 1}</div>
                      <Select
                        value={current ?? ""}
                        onValueChange={(val) => setSlot(i, val || null)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a theme" />
                        </SelectTrigger>
                        <SelectContent>
                          {strengths.map((s) => {
                            const disabled = isOptionDisabled(s.key, i);
                            return (
                              <SelectItem
                                key={s.key}
                                value={s.key}
                                disabled={disabled}
                              >
                                {withTrademark(s.name)}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      {current ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSlot(i, null)}
                          aria-label="Clear slot"
                          title="Clear"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              {/* Blend controls */}
              <Card className="rounded-2xl border-neutral-200">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Theme blend
                      </div>
                      <div className="text-xs opacity-80 mt-1">
                        Turn on, then single-click two themes on the wheel.
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm opacity-80">Select 2</span>
                      <Switch
                        checked={blendMode}
                        onCheckedChange={(v) => {
                          setBlendMode(v);
                          setBlendKeys([]);
                        }}
                        disabled={!allTenSelected}
                      />
                    </div>
                  </div>
                  {blendMode ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {blendKeys.length === 0 ? (
                        <Badge variant="secondary">Pick first theme</Badge>
                      ) : null}
                      {blendKeys.map((k) => {
                        const s = strengthByKey.get(k);
                        return (
                          <Badge key={k} variant="secondary">
                            {s ? withTrademark(s.name) : k}
                          </Badge>
                        );
                      })}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setBlendKeys([])}
                      >
                        Reset
                      </Button>
                    </div>
                  ) : null}
                  {!allTenSelected ? (
                    <div className="mt-3 text-xs opacity-70">
                      Fill all 10 slots to enable blend mode.
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
            {/* Right: Wheel */}
            <div className="flex items-center justify-center">{renderWheel()}</div>
          </div>
        </CardContent>
      </Card>
      {/* Theme detail dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              {detailKey && strengthByKey.get(detailKey)
                ? withTrademark(strengthByKey.get(detailKey).name)
                : "Theme"}
            </DialogTitle>
          </DialogHeader>
          {detailKey && strengthByKey.get(detailKey) ? (
            <div className="text-sm leading-relaxed">
              {strengthByKey.get(detailKey).blurb}
            </div>
          ) : (
            <div className="text-sm opacity-80">No description found.</div>
          )}
          <div className="text-xs opacity-70">
            Tip: double-click a segment to open this.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
