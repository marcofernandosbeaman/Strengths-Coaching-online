import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, Upload, Shuffle, RotateCcw } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STRENGTHS } from "@/data/strengths";
import { COMMUNICATION_STYLES } from "@/data/communicationStyles";
import { BALCONY_BASEMENT } from "@/data/balconyBasement";
import { THEME_TO_DOMAIN } from "@/data/themeDomains";
import { getStrengthColor, getThemeColourClass } from "@/utils/strengthUtils";
import { clamp } from "@/utils/strengthUtils";
import { generateCombinedInvestment } from "@/utils/investmentUtils";
import { Picker } from "./Picker";
import { DeskChannel } from "./DeskChannel";
import { EmptyState } from "./EmptyState";
import { InvestModal } from "./InvestModal";
import { DominantThemesTab } from "./DominantThemesTab";

export default function CliftonStrengthsSoundboard() {
  const [mode, setMode] = useLocalStorage("csb:mode", "soundboard");
  const [selected, setSelected] = useLocalStorage("csb:selected", [
    "maximizer",
    "connectedness",
    "belief",
    "adaptability",
    "empathy"
  ]);
  const [levels, setLevels] = useLocalStorage("csb:levels", {});
  const [showInvest, setShowInvest] = useState(false);

  useEffect(() => {
    setLevels((prev) => {
      const next = { ...prev };
      selected.forEach((k) => {
        if (typeof next[k] !== "number") next[k] = 50;
      });
      return next;
    });
  }, [selected, setLevels]);

  useEffect(() => {
    try {
      const keys = STRENGTHS.map((s) => s.key);
      console.assert(keys.length === 34, `Expected 34 strengths, found ${keys.length}`);
      console.assert(new Set(keys).size === keys.length, "Duplicate theme keys found");
      console.assert(keys.every((k) => k in COMMUNICATION_STYLES), "Missing COMMUNICATION_STYLES entries");
      console.assert(keys.every((k) => k in BALCONY_BASEMENT), "Missing BALCONY_BASEMENT entries");
      console.assert(selected.length <= 5, "Selected more than 5 strengths");
      console.assert(keys.every((k) => getStrengthColor(k) !== "#999"), "Missing domain colour mapping for some keys");
    } catch {}
  }, []);

  const toggleSelect = (key) => {
    setSelected((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= 5) return prev;
      return [...prev, key];
    });
  };

  const setLevel = (key, v) => setLevels((prev) => ({ ...prev, [key]: clamp(v) }));

  const reset = () =>
    setLevels((prev) => {
      const next = { ...prev };
      selected.forEach((k) => (next[k] = 50));
      return next;
    });

  const randomise = () =>
    setLevels((prev) => {
      const next = { ...prev };
      selected.forEach((k) => (next[k] = Math.floor(Math.random() * 101)));
      return next;
    });

  const exportJSON = () => {
    const payload = {
      selected,
      levels: Object.fromEntries(selected.map((k) => [k, levels[k] ?? 50]))
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "strengths-soundboard.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        if (Array.isArray(data.selected) && typeof data.levels === "object") {
          const safeSelected = data.selected.filter((k) => STRENGTHS.some((s) => s.key === k)).slice(0, 5);
          setSelected(safeSelected);
          setLevels((prev) => ({ ...prev, ...data.levels }));
        }
      } catch {}
    };
    input.click();
  };

  const selectedDefs = selected.map((k) => STRENGTHS.find((s) => s.key === k)).filter(Boolean);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-neutral-50">
      <style>{`
        .watermark[open]::before { content: ""; position: absolute; inset: 0; background-image: url('/mnt/data/edfbe3f6-50ad-438a-a6f9-51a8b950f8cf.png'); background-size: cover; background-position: center; opacity: 0.3; pointer-events: none; }
      `}</style>

      <div className="mx-auto max-w-7xl p-6 md:p-10">
        <InvestModal
          open={showInvest}
          onClose={() => setShowInvest(false)}
          items={selectedDefs.map((d) => ({ key: d.key, name: d.name }))}
        />
        <header className="mb-6">
          <motion.h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            CliftonStrengths Soundboard
          </motion.h1>
          <p className="text-neutral-600 mt-2 max-w-2xl">
            Select up to five strengths, then mix the levels like a live sound desk. Click a track or drag the coloured label to set the level. Arrow keys work for fine control.
          </p>
        </header>

        <Tabs defaultValue={mode} onValueChange={setMode} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="soundboard">Soundboard</TabsTrigger>
            <TabsTrigger value="dominant">Dominant themes</TabsTrigger>
            <TabsTrigger value="comm">🗣️ Strengths & Communication</TabsTrigger>
            <TabsTrigger value="bb">Balconies & Basements</TabsTrigger>
          </TabsList>
          <TabsContent value="soundboard">
            <div className="mb-3 flex flex-col gap-2">
              <Button className="rounded-2xl w-fit" onClick={() => setShowInvest(true)}>
                💡 Invest in Your Strengths
              </Button>
              {selected.length > 0 && (
                <Card className="rounded-2xl border-neutral-200 max-w-xl">
                  <CardContent className="p-3">
                    <div className="text-xs font-semibold mb-1">Combined investment focus for your current mix</div>
                    <pre className="whitespace-pre-wrap text-xs text-neutral-700">{generateCombinedInvestment(selected)}</pre>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Picker selected={selected} onToggle={toggleSelect} />
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button variant="secondary" onClick={reset} className="rounded-2xl">
                    <RotateCcw className="h-4 w-4 mr-2" /> Reset levels
                  </Button>
                  <Button variant="secondary" onClick={randomise} className="rounded-2xl">
                    <Shuffle className="h-4 w-4 mr-2" /> Randomise
                  </Button>
                  <Button variant="outline" onClick={exportJSON} className="rounded-2xl">
                    <Download className="h-4 w-4 mr-2" /> Export JSON
                  </Button>
                  <Button variant="outline" onClick={importJSON} className="rounded-2xl">
                    <Upload className="h-4 w-4 mr-2" /> Import JSON
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-2">
                {
              selectedDefs.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                  {selectedDefs.map((s) => (
                    <motion.div key={s.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <DeskChannel
                        themeKey={s.key}
                        name={s.name}
                        blurb={s.blurb}
                        color={getStrengthColor(s.key)}
                        value={levels[s.key] ?? 50}
                        onChange={(v) => setLevel(s.key, v)}
                        onRemove={() => toggleSelect(s.key)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dominant">
            <DominantThemesTab
              strengths={STRENGTHS}
              themeToDomain={THEME_TO_DOMAIN}
              getThemeColourClass={getThemeColourClass}
            />
          </TabsContent>

          <TabsContent value="comm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Picker selected={selected} onToggle={toggleSelect} />
              </div>
              <div className="lg:col-span-2">
              <div>
                <details className="relative overflow-hidden rounded-xl border border-neutral-200 watermark">
                  <summary className="relative cursor-pointer font-semibold z-10 px-3 py-2 bg-white/60 backdrop-blur-sm">
                    🗣️ What It Means & How to Use (click to expand)
                  </summary>
                  <div className="relative z-10 p-3 text-sm text-neutral-700 space-y-2 bg-white/70">
                    <p>The way you prefer to communicate is not random, it is strongly influenced by your CliftonStrengths.</p>
                    <p>
                      Each of your themes brings its own natural style. Some people like conversations to be logical and structured, others prefer emotional connection or big ideas, and some want to get straight to action.
                    </p>
                    <p>None of these are right or wrong, they are simply different defaults.</p>
                    <p className="mt-2">
                      In this activity, you will explore how your strengths show up in communication, what helps you express yourself at your best, and what makes it harder. The goal is not to fix anything, it is to understand your natural style so you can communicate with more confidence, and let others know how to get the best from you.
                    </p>
                  </div>
                </details>

                <div className="space-y-3 mt-2">
                  {selectedDefs.length === 0 ? (
                    <EmptyState />
                  ) : (
                    selectedDefs.map((s) => (
                      <Card
                        key={s.key}
                        className="rounded-2xl overflow-hidden text-white border border-white/25 shadow-[inset_0_3px_1px_rgba(255,255,255,0.8),inset_0_-6px_2px_rgba(0,0,0,0.55),0_14px_22px_rgba(0,0,0,0.35)]"
                        style={{ background: getStrengthColor(s.key) }}
                      >
                        <CardContent className="py-4 relative">
                          <div
                            className="pointer-events-none absolute inset-0 rounded-2xl"
                            style={{ background: "radial-gradient(circle at 50% 15%, rgba(255,255,255,0.55), rgba(255,255,255,0) 65%)" }}
                          />
                          <div className="text-base font-bold leading-tight">{s.name}</div>
                          <p className="text-sm opacity-95 mt-1">{COMMUNICATION_STYLES[s.key] ?? "No communication style available."}</p>
                          <div className="mt-3 text-xs text-white/90">
                            <ul className="list-disc list-inside space-y-1">
                              <li>When do you communicate best with this theme?</li>
                              <li>What might others need from you to connect well?</li>
                              <li>How could you flex your style for different settings?</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bb">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Picker selected={selected} onToggle={toggleSelect} />
              </div>
              <div className="lg:col-span-2">
              <div className="space-y-3">
                {selectedDefs.length === 0 ? (
                  <EmptyState />
                ) : (
                  <>
                    <details className="transition-all duration-300 overflow-hidden bg-neutral-100 border border-neutral-200 rounded-xl p-3 text-sm text-neutral-700">
                      <summary className="cursor-pointer font-semibold">🔍 What it Means & 🎯 Why It Matters (click to expand)</summary>
                      <ul className="list-disc list-inside mt-2 mb-2">
                        <li>
                          <strong>Balcony</strong> - Mature, helpful, energising expression of a strength.
                          <br />
                          <em>Empathy (Balcony): You sense how others feel and help them feel understood.</em>
                        </li>
                        <li>
                          <strong>Basement</strong> - Overused or reactive version of that same strength.
                          <br />
                          <em>Empathy (Basement): You absorb everyone's feelings and get emotionally drained.</em>
                        </li>
                      </ul>
                      <strong>Why It Matters</strong>
                      <ul className="list-disc list-inside mt-1 mb-2">
                        <li>
                          <strong>Frequency</strong> - Are you overusing it?
                        </li>
                        <li>
                          <strong>Context</strong> - Is it the right strength in this moment?
                        </li>
                        <li>
                          <strong>Maturity</strong> - Are you using it intentionally or on autopilot?
                        </li>
                      </ul>
                      <strong>The goal is not to fix your basements. It is to:</strong>
                      <ul className="list-disc list-inside mt-1">
                        <li>Notice when you have slipped into one</li>
                        <li>Name it without judgement</li>
                        <li>Pull it back up to the balcony</li>
                      </ul>
                    </details>

                    {selectedDefs.map((s) => (
                      <Card
                        key={s.key}
                        className="rounded-2xl overflow-hidden text-white border border-white/25 shadow-[inset_0_3px_1px_rgba(255,255,255,0.8),inset_0_-6px_2px_rgba(0,0,0,0.55),0_14px_22px_rgba(0,0,0,0.35)]"
                        style={{ background: getStrengthColor(s.key) }}
                      >
                        <CardContent className="py-4 relative">
                          <div
                            className="pointer-events-none absolute inset-0 rounded-2xl"
                            style={{ background: "radial-gradient(circle at 50% 15%, rgba(255,255,255,0.55), rgba(255,255,255,0) 65%)" }}
                          />
                          <div className="text-base font-bold leading-tight">{s.name}</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 border-t border-white/30 pt-3">
                            <div className="bg-black/20 rounded-xl p-3 order-1">
                              <div className="text-xs font-semibold bg-red-200/20 text-red-800 rounded px-1">
                                ⚠️ Basement <span className="italic">(When overused)</span>
                              </div>
                              <p className="text-sm opacity-95">{BALCONY_BASEMENT[s.key]?.basement ?? "—"}</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-3 order-2">
                              <div className="text-xs font-semibold bg-yellow-200/20 text-yellow-800 rounded px-1">
                                ☀️ Balcony <span className="italic">(At best)</span>
                              </div>
                              <p className="text-sm opacity-95">{BALCONY_BASEMENT[s.key]?.balcony ?? "—"}</p>
                            </div>
                          </div>
                          <div className="mt-3 text-xs text-white/90">
                            <ul className="list-disc list-inside space-y-1">
                              <li>When does this strength serve you most, and when does it get in your way?</li>
                              <li>What signals tell you when you are edging into the basement?</li>
                              <li>Who helps you stay in the balcony version of this strength?</li>
                              <li>No judgement, just awareness. Where are you today?</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}
              </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

