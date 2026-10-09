import { useState } from "react";
import { Download } from "lucide-react";
import { PageHeader, PrintHeader, TM } from "@/lib/themes";
import { listJoin } from "@/lib/themeData";

const LANES = [
  { id: "help", title: "How they might help", sub: "Create momentum or make progress easier.", colour: "#5b806e" },
  { id: "both", title: "How they might do both", sub: "Help or hinder depending on how they are used.", colour: "#a57a32" },
  { id: "hinder", title: "Where they might not help", sub: "Create a blind spot or slow progress.", colour: "#9b6470" },
];
const LANE_MAX = 5;

export default function StrengthsStrategy({ themes, participant }) {
  const [goal, setGoal] = useState("");
  const [placed, setPlaced] = useState({}); // themeKey -> laneId
  const [held, setHeld] = useState(null); // tap-to-place for touch screens
  const [insight, setInsight] = useState("");
  const [action, setAction] = useState("");

  const inLane = (id) => themes.filter((t) => placed[t.key] === id);
  const place = (key, lane) => {
    if (!key) return;
    if (lane && placed[key] !== lane && inLane(lane).length >= LANE_MAX) return;
    setPlaced((p) => {
      const n = { ...p };
      if (lane) n[key] = lane;
      else delete n[key];
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

  const tile = (t) => (
    <button
      key={t.key}
      className={`tile ${held === t.key ? "held" : ""}`}
      style={{ "--accent": t.colour }}
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", t.key)}
      onClick={(e) => {
        e.stopPropagation();
        setHeld(held === t.key ? null : t.key);
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

  const bank = themes.filter((t) => !placed[t.key]);

  return (
    <div>
      <PageHeader
        eyebrow="Activity"
        title="Strengths Strategy"
        sub="Intentionally aim your strengths towards a current goal, opportunity or challenge."
      />
      <PrintHeader activity="Strengths Strategy" title="Aiming my strengths" participant={participant} />

      <section className="panel goal">
        <div className="label">Current goal or challenge</div>
        <textarea
          className="goal-input no-print"
          rows={2}
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Example: Prepare my team for an upcoming organisational change."
        />
        <p className="print-only goal-text">{goal || "Not captured"}</p>
      </section>

      <div className="section-head no-print">
        <div>
          <h2>Aim your strengths</h2>
          <p>Drag each theme into a lane, or tap a theme then tap a lane.</p>
        </div>
        <span className="pill">
          {themes.length - bank.length} of {themes.length} explored
        </span>
      </div>
      <section className={`bank no-print ${held ? "holding" : ""}`} {...dropProps(null)}>
        {bank.map(tile)}
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
              {inLane(l.id).map(tile)}
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
        <button className="btn primary" onClick={() => window.print()}>
          <Download size={15} /> Create one-page PDF
        </button>
      </div>
    </div>
  );
}
