import { useRef, useState } from "react";
import { RotateCcw, Save, Download, X } from "lucide-react";
import { BALCONY_BASEMENT } from "@/data/balconyBasement";
import questions from "@/data/theme-questions.json";
import { PageHeader, PrintHeader, TM } from "@/lib/themes";

const KNOB = 84; // knob height in px, matches .knob in CSS
const clamp = (v) => Math.round(Math.min(100, Math.max(0, v)));

export default function SoundDesk({ themes, participant }) {
  const desk = themes.slice(0, 5);
  const [levels, setLevels] = useState({});
  const [info, setInfo] = useState(null);
  const [note, setNote] = useState("");
  const [mixes, setMixes] = useState([]);
  const level = (k) => levels[k] ?? 50;
  const setLevel = (k, v) => setLevels((p) => ({ ...p, [k]: clamp(v) }));

  const saveMix = () => {
    setMixes((m) => [
      ...m,
      {
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        levels: desk.map((t) => [t, level(t.key)]),
        note: note.trim(),
      },
    ]);
    setNote("");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Activity"
        title="Sound Desk"
        sub="Mix your themes like a live sound desk. Drag each theme up or down to show how loudly it is playing right now. Double-click a theme for a reminder."
      >
        <button className="btn" onClick={() => setLevels({})}>
          <RotateCcw size={15} /> Reset levels
        </button>
      </PageHeader>
      <PrintHeader activity="Sound Desk" title="My strengths mix" participant={participant} />

      <section className="desk no-print">
        {desk.map((t) => (
          <Channel
            key={t.key}
            theme={t}
            value={level(t.key)}
            onChange={(v) => setLevel(t.key, v)}
            onInfo={() => setInfo(t)}
          />
        ))}
      </section>

      {info && (
        <div className="popover no-print" role="dialog" style={{ "--accent": info.colour }}>
          <button className="icon-btn" aria-label="Close" onClick={() => setInfo(null)}>
            <X size={16} />
          </button>
          <h3>
            <TM>{info.name}</TM>
          </h3>
          <p>{info.blurb}</p>
          {questions[info.key]?.[0] && (
            <p className="popover-q">
              <b>Coaching question</b>
              {questions[info.key][0]}
            </p>
          )}
        </div>
      )}

      <section className="panel desk-notes">
        <div>
          <h2>What do you notice about this mix?</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Which themes are loud right now? Which would you like to dial up, and what would that change?"
          />
          <div className="row-end no-print">
            <button className="btn" onClick={saveMix}>
              <Save size={15} /> Save mix as note
            </button>
            <button className="btn primary" onClick={() => window.print()}>
              <Download size={15} /> Download PDF
            </button>
          </div>
        </div>
      </section>

      {/* Current mix, shown on print so the PDF always has content. */}
      <section className="print-only">
        <MixCard title="Current mix" levels={desk.map((t) => [t, level(t.key)])} note={note} />
      </section>

      {mixes.length > 0 && (
        <section className="saved-mixes">
          <h2>Saved mixes</h2>
          <div className="grid-2">
            {mixes.map((m, i) => (
              <MixCard key={i} title={`Mix ${i + 1} · ${m.time}`} levels={m.levels} note={m.note} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Channel({ theme, value, onChange, onInfo }) {
  const ref = useRef(null);

  const fromPointer = (clientY) => {
    const r = ref.current.getBoundingClientRect();
    onChange(100 - ((clientY - r.top - KNOB / 2) / (r.height - KNOB)) * 100);
  };

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    fromPointer(e.clientY);
  };

  const onKeyDown = (e) => {
    const step = { ArrowUp: 5, ArrowRight: 5, ArrowDown: -5, ArrowLeft: -5 }[e.key];
    if (step) {
      e.preventDefault();
      onChange(value + step);
    }
    if (e.key === "Enter") onInfo();
  };

  const watch = value >= 85 && BALCONY_BASEMENT[theme.key]?.basement;

  return (
    <div className="channel" style={{ "--accent": theme.colour }}>
      <div className="ch-label">Dial up</div>
      <div
        className="fader"
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={(e) => e.buttons === 1 && fromPointer(e.clientY)}
      >
        <div className="rail" />
        <div className="rail-fill" style={{ height: `calc((100% - ${KNOB}px) * ${value / 100})` }} />
        <div
          className="knob"
          role="slider"
          tabIndex={0}
          aria-label={theme.name}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          style={{ top: `calc((100% - ${KNOB}px) * ${(100 - value) / 100})` }}
          onDoubleClick={onInfo}
          onKeyDown={onKeyDown}
        >
          <TM>{theme.name}</TM>
        </div>
      </div>
      <div className="ch-label">Dial down</div>
      <div className="ch-level">{value}</div>
      <div className={`ch-watch ${watch ? "show" : ""}`}>
        {watch && (
          <>
            <b>Turned right up?</b> Watch for: {watch.toLowerCase()}.
          </>
        )}
      </div>
    </div>
  );
}

function MixCard({ title, levels, note }) {
  return (
    <article className="card mix-card">
      <h3>{title}</h3>
      {levels.map(([t, v]) => (
        <div key={t.key} className="mix-row">
          <span>
            <TM>{t.name}</TM>
          </span>
          <span className="bar">
            <i style={{ width: `${v}%`, background: t.colour }} />
          </span>
          <span className="num">{v}</span>
        </div>
      ))}
      {note && <p className="mix-note">{note}</p>}
    </article>
  );
}
