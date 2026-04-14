import { useCallback, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { STRENGTHS } from "@/data/strengths";
import { getStrengthColor } from "@/utils/strengthUtils";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Picker } from "./Picker";
import { SelectedThemeChips } from "./SelectedThemeChips";
import { withTrademark } from "@/lib/withTrademark";

const GOAL_LEN = 10;
const HELP_LEN = 3;
const HINDER_LEN = 3;
const MAX_STRENGTHS = 10;
const DND_TYPE = "application/x-challenge-slot";

const emptyGoal = () => Array(GOAL_LEN).fill(null);
const emptyHelp = () => Array(HELP_LEN).fill(null);
const emptyHinder = () => Array(HINDER_LEN).fill(null);

const initialBoard = () => ({
  goal: emptyGoal(),
  help: emptyHelp(),
  hinder: emptyHinder(),
});

function collectKeys(goal, help, hinder) {
  const out = new Set();
  [...goal, ...help, ...hinder].forEach((k) => {
    if (k) out.add(k);
  });
  return [...out];
}

function removeKeyFromZones(goal, help, hinder, key) {
  const g = goal.map((k) => (k === key ? null : k));
  const h = help.map((k) => (k === key ? null : k));
  const hi = hinder.map((k) => (k === key ? null : k));
  return [g, h, hi];
}

function strengthDef(key) {
  return STRENGTHS.find((s) => s.key === key);
}

function SlotTile({
  zone,
  index,
  sKey,
  spotlight,
  setSpotlight,
  onDragStart,
  onDragOver,
  onDrop,
}) {
  const s = strengthDef(sKey);
  if (!s) return null;

  const color = getStrengthColor(s.key);
  const isLit =
    spotlight &&
    spotlight.zone === zone &&
    spotlight.index === index;

  return (
    <div
      className="relative min-h-[80px] flex items-center justify-center"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, zone, index)}
    >
      <div
        role="button"
        tabIndex={0}
        draggable
        onDragStart={(e) => onDragStart(e, zone, index)}
        onDoubleClick={() =>
          setSpotlight((prev) =>
            prev && prev.zone === zone && prev.index === index
              ? null
              : { zone, index }
          )
        }
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setSpotlight((prev) =>
              prev && prev.zone === zone && prev.index === index
                ? null
                : { zone, index }
            );
          }
        }}
        className="relative w-full max-w-[160px] h-[80px] rounded-2xl text-white font-medium cursor-grab active:cursor-grabbing text-center flex flex-col items-center justify-center select-none border border-white/25 shadow-[inset_0_3px_1px_rgba(255,255,255,0.8),inset_0_-6px_2px_rgba(0,0,0,0.55),0_10px_18px_rgba(0,0,0,0.35)]"
        style={{ background: color }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "radial-gradient(circle at 50% 20%, rgba(255,255,255,0.55), rgba(255,255,255,0) 70%)",
          }}
        />
        <span className="relative text-xs font-bold leading-tight text-center px-2 line-clamp-3">
          {withTrademark(s.name)}
        </span>
      </div>
      {isLit && (
        <div className="absolute left-1/2 top-[calc(100%+6px)] z-20 w-[min(100%,280px)] -translate-x-1/2 rounded-xl border border-neutral-200 bg-white p-3 text-left text-xs text-neutral-700 shadow-lg">
          {s.blurb}
        </div>
      )}
    </div>
  );
}

function EmptySlot({ zone, index, onDragOver, onDrop, compact }) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, zone, index)}
      className={`flex min-h-[80px] items-center justify-center ${compact ? "py-3" : ""}`}
    >
      <div className="flex h-[80px] w-full max-w-[160px] items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/90 px-2 text-center text-xs text-neutral-400 transition-colors hover:border-neutral-300 hover:bg-neutral-100/90">
        Drop here
      </div>
    </div>
  );
}

export function ChallengeToClarityTab() {
  const [board, setBoard] = useLocalStorage("csb:challengeBoard", initialBoard());
  const goalSlots = board.goal ?? emptyGoal();
  const helpSlots = board.help ?? emptyHelp();
  const hinderSlots = board.hinder ?? emptyHinder();
  const [spotlight, setSpotlight] = useState(null);

  const setZones = useCallback((patch) => {
    setBoard((prev) => {
      const base = {
        goal: [...(prev.goal ?? emptyGoal())],
        help: [...(prev.help ?? emptyHelp())],
        hinder: [...(prev.hinder ?? emptyHinder())],
      };
      return patch(base);
    });
  }, [setBoard]);

  const placedKeys = useMemo(() => {
    const keys = collectKeys(goalSlots, helpSlots, hinderSlots);
    const order = new Map(STRENGTHS.map((s, i) => [s.key, i]));
    return [...keys].sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));
  }, [goalSlots, helpSlots, hinderSlots]);

  const placedDefs = useMemo(
    () =>
      placedKeys
        .map((k) => STRENGTHS.find((s) => s.key === k))
        .filter(Boolean),
    [placedKeys]
  );

  const readSlot = useCallback(
    (zone, index) => {
      if (zone === "goal") return goalSlots[index];
      if (zone === "help") return helpSlots[index];
      return hinderSlots[index];
    },
    [goalSlots, helpSlots, hinderSlots]
  );

  const handlePickerToggle = useCallback(
    (key) => {
      setSpotlight(null);
      setZones((b) => {
        if (collectKeys(b.goal, b.help, b.hinder).includes(key)) {
          const [g, h, hi] = removeKeyFromZones(b.goal, b.help, b.hinder, key);
          return { goal: g, help: h, hinder: hi };
        }
        if (collectKeys(b.goal, b.help, b.hinder).length >= MAX_STRENGTHS) {
          return b;
        }
        const emptyGoalIdx = b.goal.findIndex((k) => k == null);
        if (emptyGoalIdx === -1) return b;
        const goal = [...b.goal];
        goal[emptyGoalIdx] = key;
        return { ...b, goal };
      });
    },
    [setZones]
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDragStart = useCallback((e, zone, index) => {
    const key = readSlot(zone, index);
    if (!key) {
      e.preventDefault();
      return;
    }
    try {
      e.dataTransfer.setData(DND_TYPE, JSON.stringify({ zone, index }));
      e.dataTransfer.effectAllowed = "move";
    } catch {
      e.dataTransfer.setData("text/plain", JSON.stringify({ zone, index }));
    }
  }, [readSlot]);

  const onDrop = useCallback(
    (e, destZone, destIndex) => {
      e.preventDefault();
      setSpotlight(null);
      let raw;
      try {
        raw = e.dataTransfer.getData(DND_TYPE) || e.dataTransfer.getData("text/plain");
      } catch {
        return;
      }
      if (!raw) return;
      let payload;
      try {
        payload = JSON.parse(raw);
      } catch {
        return;
      }
      const { zone: srcZone, index: srcIndex } = payload;
      if (srcZone == null || srcIndex == null) return;
      if (srcZone === destZone && srcIndex === destIndex) return;

      setZones((b) => {
        const goal = [...b.goal];
        const help = [...b.help];
        const hinder = [...b.hinder];
        const read = (z, i) => {
          if (z === "goal") return goal[i];
          if (z === "help") return help[i];
          return hinder[i];
        };
        const write = (z, i, k) => {
          if (z === "goal") goal[i] = k;
          else if (z === "help") help[i] = k;
          else hinder[i] = k;
        };
        const srcKey = read(srcZone, srcIndex);
        if (!srcKey) return b;
        const destKey = read(destZone, destIndex);
        if (!destKey) {
          write(destZone, destIndex, srcKey);
          write(srcZone, srcIndex, null);
        } else {
          write(destZone, destIndex, srcKey);
          write(srcZone, srcIndex, destKey);
        }
        return { goal, help, hinder };
      });
    },
    [setZones]
  );

  const removePlaced = useCallback(
    (key) => {
      handlePickerToggle(key);
    },
    [handlePickerToggle]
  );

  const renderSlot = (zone, index, compact) => {
    const key =
      zone === "goal"
        ? goalSlots[index]
        : zone === "help"
          ? helpSlots[index]
          : hinderSlots[index];

    if (!key) {
      return (
        <EmptySlot
          key={`${zone}-${index}`}
          zone={zone}
          index={index}
          onDragOver={onDragOver}
          onDrop={onDrop}
          compact={compact}
        />
      );
    }

    return (
      <SlotTile
        key={`${zone}-${index}-${key}`}
        zone={zone}
        index={index}
        sKey={key}
        spotlight={spotlight}
        setSpotlight={setSpotlight}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
      />
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Picker
          selected={placedKeys}
          onToggle={handlePickerToggle}
          max={MAX_STRENGTHS}
        />
        {placedDefs.length > 0 && (
          <div className="mt-4">
            <SelectedThemeChips
              title="Themes on the board"
              items={placedDefs.map((s) => ({
                key: s.key,
                label: withTrademark(s.name),
              }))}
              onRemove={removePlaced}
            />
          </div>
        )}
        <p className="mt-3 text-xs text-neutral-500 leading-relaxed">
          Choose up to ten themes. New picks fill the Goal grid in order. Drag
          tiles into Help or Hinder. Double-click a tile for the short
          description (same as the soundboard).
        </p>
      </div>

      <div className="lg:col-span-2 space-y-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
          Challenge to clarity
        </h2>

        <Card className="rounded-2xl border-neutral-200 shadow-sm">
          <CardContent className="space-y-6 p-5 md:p-6">
            <section>
              <h3 className="mb-3 text-center text-sm font-semibold tracking-tight text-neutral-800">
                Goal
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 md:gap-3">
                {Array.from({ length: GOAL_LEN }, (_, i) => renderSlot("goal", i, false))}
              </div>
            </section>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="mb-3 text-center text-sm font-semibold tracking-tight text-emerald-900">
                  Help
                </h3>
                <div className="flex flex-col gap-2 md:gap-3">
                  {Array.from({ length: HELP_LEN }, (_, i) =>
                    renderSlot("help", i, true)
                  )}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-center text-sm font-semibold tracking-tight text-rose-900">
                  Hinder
                </h3>
                <div className="flex flex-col gap-2 md:gap-3">
                  {Array.from({ length: HINDER_LEN }, (_, i) =>
                    renderSlot("hinder", i, true)
                  )}
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
