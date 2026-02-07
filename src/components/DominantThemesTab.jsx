import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { SelectedThemeChips } from "@/components/SelectedThemeChips";
import { withTrademark } from "@/lib/withTrademark";
import { Picker } from "@/components/Picker";
import { getStrengthColor } from "@/utils/strengthUtils";
import themeTraits from "@/data/theme-traits.json";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

function getTraits(themeKey) {
  return themeTraits[themeKey];
}

// Wheel geometry helpers
function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
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

// Coach + client questions
function coachQuestions(a, b) {
  return [
    `What might be amplified when ${a} and ${b} show up together?`,
    `What would "balanced use" look like, so neither one over-runs the other?`,
    `Where might this combination be most helpful right now?`,
  ];
}

function clientQuestions() {
  return [
    "What do you notice about this combination?",
    "Where does this help you?",
    "What feels true for you here?",
    "What possibilities could this bring at work, in your life, or in your relationships?",
  ];
}

// Pair key is stable (order-insensitive)
function pairKey(a, b) {
  return [a, b].sort().join("::");
}

export function DominantThemesTab(props) {
  const { strengths, themeToDomain, getThemeColourClass } = props;

  const strengthByKey = React.useMemo(() => {
    const m = new Map();
    strengths.forEach((s) => m.set(s.key, s));
    return m;
  }, [strengths]);

  // Session-only state (NO localStorage)
  const [selected, setSelected] = React.useState([]);
  const [showDomainColours, setShowDomainColours] = React.useState(true);
  const [mode, setMode] = React.useState("off");
  const [pair, setPair] = React.useState([]); // max 2 from selected 10

  // Notes are session-only, stored per pair
  const [pairNotes, setPairNotes] = React.useState({});

  const selectedKeys = selected;
  const allTenSelected = selectedKeys.length === 10;

  function clearAll() {
    setSelected([]);
    setMode("off");
    setPair([]);
    setPairNotes({});
  }

  function toggleSelect(key) {
    setSelected((prev) => {
      if (prev.includes(key)) {
        // Remove from pair if it was selected for exploration
        setPair((p) => p.filter((k) => k !== key));
        return prev.filter((k) => k !== key);
      }
      if (prev.length >= 10) return prev;
      return [...prev, key];
    });
  }

  function togglePairPick(themeKey) {
    if (!allTenSelected) return;
    if (mode === "off") return;
    if (!selectedKeys.includes(themeKey)) return;

    setPair((prev) => {
      if (prev.includes(themeKey)) return prev.filter((k) => k !== themeKey);
      if (prev.length >= 2) return prev;
      return [...prev, themeKey];
    });
  }

  // Build centre content
  const centre = React.useMemo(() => {
    if (mode === "off") return null;
    if (pair.length !== 2) return { state: "pick" };

    const aKey = pair[0];
    const bKey = pair[1];
    const a = strengthByKey.get(aKey);
    const b = strengthByKey.get(bKey);
    if (!a || !b) return { state: "pick" };

    const aName = withTrademark(a.name);
    const bName = withTrademark(b.name);
    const aTraits = getTraits(aKey);
    const bTraits = getTraits(bKey);
    const aBrief = aTraits?.brings ?? a.blurb;
    const bBrief = bTraits?.brings ?? b.blurb;

    if (mode === "client") {
      const key = pairKey(aKey, bKey);
      const saved = pairNotes[key]?.answers ?? Array(4).fill("");
      return {
        state: "client",
        aKey,
        bKey,
        aName,
        bName,
        aBrief,
        bBrief,
        questions: clientQuestions(),
        answers: saved,
        noteKey: key,
      };
    }

    // Coach mode: pattern + balance + 3 prompts
    const aDrivers = (aTraits?.drivers ?? []).slice(0, 2).join(" and ");
    const bDrivers = (bTraits?.drivers ?? []).slice(0, 2).join(" and ");
    const pattern = `This combination might look like blending ${aDrivers || aBrief} with ${bDrivers || bBrief}.`;
    const balance = `When balanced, it can help you stay grounded while still moving things forward, depending on what the moment needs.`;

    return {
      state: "coach",
      aName,
      bName,
      pattern,
      balance,
      prompts: coachQuestions(aName, bName),
    };
  }, [mode, pair, strengthByKey, pairNotes, allTenSelected, selectedKeys]);

  // Wheel sizing
  const size = 600;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 275;
  const rInner = 170;
  const segmentAngle = 360 / 10;

  const wheelRef = React.useRef(null);
  const [isCapturing, setIsCapturing] = React.useState(false);

  async function downloadInsightsPdf() {
    if (!wheelRef.current || !allTenSelected) return;

    // Hide center panel during capture
    setIsCapturing(true);
    
    // Wait for React to update DOM
    await new Promise(resolve => setTimeout(resolve, 100));

    // Capture wheel as image with proper color handling
    const dataUrl = await toPng(wheelRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      style: {
        transform: 'scale(1)',
      }
    });

    // Show center panel again
    setIsCapturing(false);

    // Collect explored pairs with notes (client mode notes only)
    const pairsWithNotes = Object.entries(pairNotes)
      .map(([k, v]) => ({ k, ...v }))
      .sort((a, b) => a.updatedAt - b.updatedAt);

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Download insights", 40, 48);

    // Wheel image
    const imgW = pageW - 80;
    const imgH = imgW; // square
    doc.addImage(dataUrl, "PNG", 40, 70, imgW, imgH, undefined, "FAST");

    // Next page: pairs + notes
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Theme combinations explored", 40, 48);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    let y = 80;

    // Helper: write wrapped text
    const writeWrapped = (text) => {
      const lines = doc.splitTextToSize(text, pageW - 80);
      lines.forEach((ln) => {
        if (y > pageH - 60) {
          doc.addPage();
          y = 40;
        }
        doc.text(ln, 40, y);
        y += 16;
      });
    };

    if (pairsWithNotes.length === 0) {
      writeWrapped("No notes were captured in this session.");
    } else {
      for (const item of pairsWithNotes) {
        const [t1, t2] = item.k.split("::");
        const s1 = strengthByKey.get(t1);
        const s2 = strengthByKey.get(t2);
        const title = `${s1 ? withTrademark(s1.name) : t1} + ${s2 ? withTrademark(s2.name) : t2}`;

        doc.setFont("helvetica", "bold");
        writeWrapped(title);
        doc.setFont("helvetica", "normal");

        const qs = clientQuestions();
        qs.forEach((q, i) => {
          const ans = item.answers[i]?.trim() || "–";
          writeWrapped(`• ${q}`);
          writeWrapped(`  ${ans}`);
        });
        y += 8;
      }
    }

    // Disclaimer page footer
    doc.setFontSize(10);
    doc.setTextColor(90);
    doc.text(
      "Confidentiality note: typed notes are session-only. Refreshing clears them.",
      40,
      pageH - 30,
    );

    doc.save("download-insights.pdf");
  }

  // UI blocks
  const selectedChips = selectedKeys.length > 0 ? (
    <SelectedThemeChips
      title="Selected themes"
      items={selectedKeys.map((k, idx) => {
        const s = strengthByKey.get(k);
        return {
          key: k,
          label: s ? withTrademark(s.name) : k,
          badgeText: `#${idx + 1}`,
        };
      })}
      onRemove={(k) => toggleSelect(k)}
    />
  ) : null;


  const modeToggle = (
    <Card className="rounded-2xl border-black/10">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Explore two themes</div>
            <div className="text-xs opacity-80 mt-1">
              Choose a mode, then click two themes on the wheel.
            </div>
            <div className="text-xs opacity-70 mt-2">
              <div>
                <span className="font-semibold">Coach notes:</span> quick
                interpretive cues + prompts.
              </div>
              <div>
                <span className="font-semibold">Client explore:</span> neutral
                descriptions + reflective questions + notes.
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="inline-flex rounded-xl border border-black/10 bg-white p-1">
              <button
                type="button"
                className={`px-3 py-1 text-sm rounded-lg ${mode === "off" ? "bg-neutral-100 font-semibold" : ""}`}
                onClick={() => {
                  setMode("off");
                  setPair([]);
                }}
                disabled={!allTenSelected}
              >
                Off
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-sm rounded-lg ${mode === "coach" ? "bg-neutral-100 font-semibold" : ""}`}
                onClick={() => {
                  setMode("coach");
                  setPair([]);
                }}
                disabled={!allTenSelected}
              >
                Coach
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-sm rounded-lg ${mode === "client" ? "bg-neutral-100 font-semibold" : ""}`}
                onClick={() => {
                  setMode("client");
                  setPair([]);
                }}
                disabled={!allTenSelected}
              >
                Client
              </button>
            </div>
            <Button
              variant="outline"
              onClick={downloadInsightsPdf}
              disabled={!allTenSelected}
              title={
                !allTenSelected
                  ? "Fill all 10 slots to enable export"
                  : "Download PDF"
              }
            >
              Download insights
            </Button>
          </div>
        </div>
        <div className="mt-3 text-xs opacity-70">
          Confidentiality: notes are session-only. Refreshing clears them.
          Download if you want to keep them.
        </div>
      </CardContent>
    </Card>
  );


  function renderCentrePanel() {
    if (mode === "off") return null;
    if (!centre || centre.state === "pick") {
      return (
        <div className="text-center">
          <div className="text-sm font-semibold">Select two themes</div>
          <div className="text-xs opacity-80 mt-1">
            Click two segments on the wheel.
          </div>
          {pair.length ? (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {pair.map((k) => {
                const s = strengthByKey.get(k);
                return (
                  <Badge key={k} variant="secondary">
                    {s ? withTrademark(s.name) : k}
                  </Badge>
                );
              })}
              <Button variant="ghost" size="sm" onClick={() => setPair([])}>
                Reset
              </Button>
            </div>
          ) : null}
        </div>
      );
    }

    if (centre.state === "coach") {
      return (
        <div className="grid gap-3">
          <div className="text-sm font-semibold">
            {centre.aName} + {centre.bName}
          </div>
          <div className="text-xs leading-relaxed">{centre.pattern}</div>
          <div className="text-xs leading-relaxed">{centre.balance}</div>
          <div>
            <div className="text-xs font-semibold">
              Questions to open insight
            </div>
            <ul className="mt-2 text-xs list-disc pl-5 space-y-1">
              {centre.prompts.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => setPair([])}>
              Reset
            </Button>
          </div>
        </div>
      );
    }

    // Client mode: side-by-side + 4 questions + note fields
    return (
      <div className="grid gap-3">
        <div className="text-sm font-semibold">
          {centre.aName} + {centre.bName}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Card className="rounded-2xl border-black/10">
            <CardContent className="pt-3">
              <div className="text-xs font-semibold">{centre.aName}</div>
              <div className="mt-2 text-xs opacity-80 leading-relaxed">
                {centre.aBrief}
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-black/10">
            <CardContent className="pt-3">
              <div className="text-xs font-semibold">{centre.bName}</div>
              <div className="mt-2 text-xs opacity-80 leading-relaxed">
                {centre.bBrief}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="text-xs font-semibold">Reflection notes</div>
        <div className="grid gap-2">
          {centre.questions.map((q, i) => (
            <div key={q} className="grid gap-1">
              <div className="text-xs opacity-80">{q}</div>
              <textarea
                className="min-h-[44px] w-full resize-y rounded-xl border border-black/10 bg-white p-2 text-sm"
                value={centre.answers[i] ?? ""}
                onChange={(e) => {
                  const next = [...centre.answers];
                  next[i] = e.target.value;
                  setPairNotes((prev) => ({
                    ...prev,
                    [centre.noteKey]: {
                      answers: next,
                      updatedAt: Date.now(),
                    },
                  }));
                }}
                placeholder="Type short notes…"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setPair([])}>
            Reset
          </Button>
          <div className="text-[11px] opacity-70">Notes clear on refresh.</div>
        </div>
      </div>
    );
  }

  function renderWheel() {
    if (!allTenSelected) {
      return (
        <div className="flex items-center justify-center h-[600px]">
          <div className="text-center max-w-sm">
            <div className="text-lg font-semibold">Dominant themes</div>
            <div className="text-sm opacity-80 mt-1">
              Select your 10 themes to populate your wheel.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div ref={wheelRef} className="relative w-[600px] h-[600px]">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <filter id="segShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="2"
                floodOpacity="0.22"
              />
              <feDropShadow
                dx="0"
                dy="10"
                stdDeviation="12"
                floodOpacity="0.10"
              />
            </filter>
            <radialGradient id="gloss" cx="30%" cy="20%" r="70%">
              <stop offset="0%" stopColor="white" stopOpacity="0.35" />
              <stop offset="55%" stopColor="white" stopOpacity="0.10" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          {selected.map((themeKey, idx) => {
            if (!themeKey) return null;
            const s0 = strengthByKey.get(themeKey);
            const label = s0 ? withTrademark(s0.name) : themeKey;
            const start = idx * segmentAngle;
            const end = start + segmentAngle;
            const domain =
              s0?.domain ??
              (themeToDomain ? themeToDomain[themeKey] : undefined);

            // Use inline styles for proper color capture in PDF
            const fillColor = showDomainColours
              ? getStrengthColor(themeKey)
              : "#e5e5e5"; // neutral-200
            const strokeColor = showDomainColours
              ? "rgba(255, 255, 255, 0.7)"
              : "#d4d4d4"; // neutral-300

            const pathD = arcPath(cx, cy, rOuter, rInner, start, end);
            const labelPos = segmentMidpoint(
              cx,
              cy,
              (rOuter + rInner) / 2,
              start,
              end,
            );
            const isPicked = pair.includes(themeKey);

            return (
              <g key={`${themeKey}-${idx}`}>
                <path
                  d={pathD}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={2}
                  filter="url(#segShadow)"
                />
                <path
                  d={pathD}
                  fill="url(#gloss)"
                  opacity={showDomainColours ? 1 : 0.6}
                  pointerEvents="none"
                />
                {/* Big click target: easy selection */}
                <path
                  d={pathD}
                  fill="transparent"
                  stroke="transparent"
                  strokeWidth={28}
                  className="cursor-pointer"
                  onClick={() => togglePairPick(themeKey)}
                />
                {isPicked ? (
                  <path
                    d={pathD}
                    fill="transparent"
                    stroke="rgba(0, 0, 0, 0.35)"
                    strokeWidth={7}
                    pointerEvents="none"
                  />
                ) : null}
                {/* One-line label, unchanged font size */}
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="select-none"
                  style={{ fontSize: 11, fontWeight: 750 }}
                  fill={showDomainColours ? "white" : "#111"}
                  pointerEvents="none"
                >
                  {label}
                </text>
                {/* Rank */}
                <text
                  x={labelPos.x}
                  y={labelPos.y + 22}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="select-none"
                  style={{ fontSize: 12, fontWeight: 650 }}
                  fill={showDomainColours ? "white" : "#333"}
                  pointerEvents="none"
                >
                  #{idx + 1}
                </text>
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r={rInner - 20} fill="#ffffff" />
        </svg>
        {/* Centre panel - hidden during PDF capture */}
        {!isCapturing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className={`max-h-[350px] pointer-events-auto transition-all duration-300 ${
              !centre || centre.state === 'pick' ? 'w-[280px]' : 'w-[450px]'
            }`}
          >
            <Card className="rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border-neutral-200/80 bg-white/95 backdrop-blur-sm">
              <CardContent className="pt-4 pb-4 max-h-[350px] overflow-y-auto bg-gradient-to-b from-white to-neutral-50/30">
                {renderCentrePanel()}
              </CardContent>
            </Card>
          </div>
        </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="pt-5">
          <div className="text-xl font-semibold">Dominant themes</div>
          {/* Intro text (no ® in paragraph) */}
          <div className="text-sm opacity-80 leading-relaxed mt-2">
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
              By taking our top 10 dominant themes out of that linear order and
              placing them into a circle, we are invited to see them
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
          <div className="grid gap-6 mt-6 lg:grid-cols-2">
            {/* Left */}
            <div className="grid gap-4">
              <Picker selected={selected} onToggle={toggleSelect} max={10} />
              {selectedChips}
            </div>
            {/* Right */}
            <div className="flex flex-col gap-4 items-center pt-4">
              <div className="w-full max-w-[600px] grid gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm opacity-80">Domain colours</span>
                    <Switch
                      checked={showDomainColours}
                      onCheckedChange={setShowDomainColours}
                    />
                  </div>
                  <Button variant="outline" onClick={clearAll}>
                    Clear all
                  </Button>
                </div>
                {modeToggle}
              </div>
              {renderWheel()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
