import { useRef, useState, useEffect } from "react";
import { BALCONY_BASEMENT } from "@/data/balconyBasement";

export function DeskFader({ themeKey, value, onChange, color, label, blurb }) {
  const height = 320;
  const width = 120;
  const handleHeight = 88;
  const trackRef = useRef(null);
  const dragging = useRef(false);
  const [showInfo, setShowInfo] = useState(false);

  const clampVal = (v) => Math.min(100, Math.max(0, v));
  const posFromVal = (v) => {
    const range = height - handleHeight;
    return range - (v / 100) * range;
  };
  const valFromPos = (y) => {
    const range = height - handleHeight;
    return clampVal(100 - (y / range) * 100);
  };

  const setFromEvent = (clientY) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const range = height - handleHeight;
    const raw = clientY - rect.top - handleHeight / 2;
    const y = Math.min(Math.max(0, raw), range);
    onChange(valFromPos(y));
  };

  const onMouseDown = (e) => {
    dragging.current = true;
    setFromEvent(e.clientY);
    const onMouseMove = (ev) => {
      if (!dragging.current) return;
      setFromEvent(ev.clientY);
    };
    const onMouseUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp") onChange(clampVal(value + 2));
    if (e.key === "ArrowDown") onChange(clampVal(value - 2));
    if (e.key === "Home") onChange(0);
    if (e.key === "End") onChange(100);
  };

  useEffect(() => {
    const range = height - handleHeight;
    [0, 25, 50, 75, 100].forEach((v) => {
      const y = posFromVal(v);
      const back = valFromPos(y);
      console.assert(Math.abs(back - v) < 0.001, `Fader mapping mismatch for ${v}: got ${back}`);
    });
  }, []);

  const tooLoud = value >= 95;
  const centreX = width / 2;

  return (
    <div className="w-full flex justify-center">
      <div className="relative" style={{ height, width }}>
        <div
          ref={trackRef}
          className="absolute inset-0 cursor-pointer"
          onMouseDown={onMouseDown}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(value)}
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          <svg width={width} height={height} className="absolute inset-0">
            <defs>
              <linearGradient id="trackGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2b2b2b" />
                <stop offset="50%" stopColor="#1a1a1a" />
                <stop offset="100%" stopColor="#0f0f0f" />
              </linearGradient>
              <filter id="tickShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="1" stdDeviation="0.6" floodColor="#000" floodOpacity="0.5" />
              </filter>
            </defs>
            <rect x={(width - 4) / 2} y={0} width={4} height={height} rx={2} fill="url(#trackGrad)" />
            {Array.from({ length: 21 }).map((_, i) => {
              const y = (i / 20) * height;
              const major = i % 4 === 0;
              const len = major ? 30 : 18;
              const shadeLeft = major ? "#fafafa" : "#e5e5e5";
              const shadeRight = major ? "#0b0b0b" : "#1a1a1a";
              return (
                <g key={i} filter="url(#tickShadow)">
                  <line x1={centreX - len} y1={y} x2={centreX - 2} y2={y} stroke={shadeLeft} strokeWidth={1.5} />
                  <line x1={centreX + 2} y1={y} x2={centreX + len} y2={y} stroke={shadeRight} strokeWidth={1.5} />
                </g>
              );
            })}
            <line x1={centreX - 10} y1={height / 2} x2={centreX + 10} y2={height / 2} stroke="#FFD700" strokeWidth={3} />
          </svg>

          <div
            className="absolute left-1/2 -translate-x-1/2 w-[160px] h-[88px] rounded-2xl text-white font-medium cursor-grab active:cursor-grabbing text-center flex flex-col items-center justify-center select-none border border-white/25 shadow-[inset_0_3px_1px_rgba(255,255,255,0.8),inset_0_-6px_2px_rgba(0,0,0,0.55),0_14px_22px_rgba(0,0,0,0.55)]"
            style={{ top: posFromVal(value), background: color }}
            onDoubleClick={() => setShowInfo((v) => !v)}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{ background: "radial-gradient(circle at 50% 20%, rgba(255,255,255,0.6), rgba(255,255,255,0) 70%)" }}
            />
            <div className="text-xs font-bold leading-tight text-center px-2 truncate w-full">{label}</div>
            {tooLoud && (
              <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-56 rounded-xl border bg-red-50 p-3 text-xs text-red-800 shadow-lg">
                ⚠️ Blind spot: {BALCONY_BASEMENT[themeKey]?.basement || "May become overused."}
              </div>
            )}
            {showInfo && (
              <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-56 rounded-xl border bg-white p-3 text-xs text-neutral-700 shadow-lg">
                {blurb}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

