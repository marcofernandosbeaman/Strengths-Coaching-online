import { useState } from "react";
import { Download } from "lucide-react";
import { THEME_DESCRIPTIONS } from "@/data/themeDescriptions";
import { PageHeader, PrintHeader, TM } from "@/lib/themes";
import { printPdf } from "@/lib/print";
import { listJoin } from "@/lib/themeData";

const LANES = [
  { id: "help", title: "How they might help", sub: "Create momentum or make progress easier.", colour: "#5b806e" },
  { id: "both", title: "How they might do both", sub: "Help or hinder depending on how they are used.", colour: "#a57a32" },
  { id: "hinder", title: "Where they might not help", sub: "Create a blind spot or slow progress.", colour: "#9b6470" },
];
const LANE_MAX = 5;

export default function StrengthsStrategy({ themes, participant }) {
  const [goal, setGoal] = useState("");
  const [rating, setRating] = useState({ importance: 5, motivation: 5 }); // 1–10
  const [lanes, setLanes] = useState({ help: [], both: [], hinder: [] }); // laneId -> themeKeys in the user's chosen order
  const [held, setHeld] = useState(null); // tap-to-place for touch screens
  const [info, setInfo] = useState(null); // theme shown in the description card (double-click)
  const [insight, setInsight] = useState("");
  const [action, setAction] = useState("");

  const byKey = Object.fromEntries(themes.map((t) => [t.key, t]));
  const inLane = (id) => lanes[id].map((k) => byKey[k]).filter(Boolean);
  // Moves a theme into a lane before `before` (or to the end), or back to the bank when lane is null.
  const place = (key, lane, before) => {
    if (!key || key === before) return;
    if (lane && !lanes[lane].includes(key) && lanes[lane].length >= LANE_MAX) return;
    setLanes((p) => {
      const n = Object.fromEntries(Object.entries(p).map(([id, keys]) => [id, keys.filter((k) => k !== key)]));
      if (lane) {
        const i = n[lane].indexOf(before);
        n[lane].splice(i < 0 ? n[lane].length : i, 0, key);
      }
      return n;
    });
    setHeld(null);
  };

  const names = (id) => listJoin(inLane(id).map((t) => t.name));
  const suggestion =
    [
      inLane("help").length && `${names("help")} may create momentum.`,
      inLane("both").length && `${names("both")} may need intentional use.`,
      inLane("hinder").length && `${names("hinder")} may be useful watch-outs.`,
    ]
      .filter(Boolean)
      .join(" ") || "As themes are placed, a starting summary appears here.";

  // Inside a lane, dropping (or tapping while holding) on a tile inserts before it.
  const tile = (t, lane) => (
    <button
      key={t.key}
      className={`tile ${held === t.key ? "held" : ""}`}
      style={{ "--accent": t.colour }}
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", t.key)}
      onDrop={(e) => {
        if (!lane) return;
        e.stopPropagation();
        place(e.dataTransfer.getData("text/plain"), lane, t.key);
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (lane && held && held !== t.key) place(held, lane, t.key);
        else setHeld(held === t.key ? null : t.key);
<<<<<<< HEAD
      }}
      // The two clicks pick up and put down the same tile, so a double-click only opens the description.
      onDoubleClick={(e) => {
        e.stopPropagation();
        setHeld(null);
        setInfo(t);
=======
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
      }}
    >
      <TM>{t.name}</TM>
    </button>
  );

  const dropProps = (lane) => ({
    onDragOver: (e) => e.preventDefault(),
    onDrop: (e) => place(e.dataTransfer.getData("text/plain"), lane),
    onClick: () => held && place(held, lane),
  });

  const placed = Object.values(lanes).flat();
  const bank = themes.filter((t) => !placed.includes(t.key));

  return (
    <div>
      <PageHeader
        eyebrow="Activity"
        title="Strengths Strategy"
        sub="Intentionally aim your strengths towards a current goal, opportunity or challenge."
      />
      <PrintHeader activity="Strengths Strategy" title="Aiming my strengths" participant={participant} />

      <section className="panel goal">
        <div className="goal-main">
          <div className="label">Current goal or challenge</div>
          <textarea
            className="goal-input no-print"
            rows={2}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Example: Prepare my team for an upcoming organisational change."
          />
          <p className="print-only goal-text">{goal || "Not captured"}</p>
        </div>
        <div className="goal-ratings">
          {[
            ["importance", "How important is this to you?"],
            ["motivation", "How motivated are you to take action?"],
          ].map(([k, q]) => (
<<<<<<< HEAD
            <div key={k} className="rating">
              <span id={`rating-${k}`}>{q}</span>
              {/* Segmented 1–10 scale: dots up to the chosen value are filled. */}
              <div className="dots" role="radiogroup" aria-labelledby={`rating-${k}`}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={rating[k] === n}
                    aria-label={`${n} out of 10`}
                    className={n <= rating[k] ? "on" : ""}
                    onClick={() => setRating((r) => ({ ...r, [k]: n }))}
                  />
                ))}
              </div>
              <b>{rating[k]}/10</b>
            </div>
=======
            <label key={k} className="rating">
              <span>{q}</span>
              <input
                className="no-print"
                type="range"
                min={1}
                max={10}
                value={rating[k]}
                onChange={(e) => setRating((r) => ({ ...r, [k]: +e.target.value }))}
              />
              <b>{rating[k]}/10</b>
            </label>
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
          ))}
        </div>
      </section>

      <div className="section-head no-print">
        <div>
          <h2>Aim your strengths</h2>
          <p>Drag each theme into a lane, or tap a theme then tap a lane. Drag within a lane to set the order.</p>
        </div>
        <span className="pill">
          {themes.length - bank.length} of {themes.length} explored
        </span>
      </div>
      {/* Same description card as the Sound Desk. */}
      <section
        className={`theme-card no-print ${info ? "show" : ""}`}
        style={{ "--accent": info?.colour }}
        aria-live="polite"
      >
        {info ? (
          <>
            <h3>
              <TM>{info.name}</TM>
            </h3>
            <p>{THEME_DESCRIPTIONS[info.key]}</p>
          </>
        ) : (
          <p className="muted">Double-click a theme to see its brief description.</p>
        )}
      </section>
      <section className={`bank no-print ${held ? "holding" : ""}`} {...dropProps(null)}>
        {bank.map((t) => tile(t))}
        {!bank.length && <span className="muted">All themes placed. Drag one back here to remove it.</span>}
      </section>

      <section className="lanes">
        {LANES.map((l) => (
          <article key={l.id} className="lane" style={{ "--lane": l.colour }}>
            <div className="lane-head">
              <h3>{l.title}</h3>
              <p>{l.sub}</p>
            </div>
            <div className={`dropzone ${held ? "target" : ""}`} {...dropProps(l.id)}>
              {inLane(l.id).map((t) => tile(t, l.id))}
              {!inLane(l.id).length && <span className="drop-hint">Drag up to five themes here</span>}
            </div>
          </article>
        ))}
      </section>

      <section className="grid-2 strategy-bottom">
        <article className="panel">
          <h3>Coaching insight</h3>
          <textarea
            className="no-print"
            value={insight}
            onChange={(e) => setInsight(e.target.value)}
            placeholder={suggestion}
          />
          <p className="print-only">{insight || suggestion}</p>
        </article>
        <article className="panel">
          <h3>One clear next step</h3>
          <textarea
            className="no-print"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            placeholder="Example: Use Strategic to map two possible pathways forward."
          />
          <p className="print-only">{action || "Not captured"}</p>
        </article>
      </section>
      <div className="row-end no-print">
        <button className="btn primary" onClick={() => printPdf(participant, "Strengths Strategy")}>
          <Download size={15} /> Create one-page PDF
        </button>
      </div>
    </div>
  );
}
