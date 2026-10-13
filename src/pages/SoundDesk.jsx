import { useRef, useState } from "react";
import { RotateCcw, Save, Download, ChevronLeft, Check } from "lucide-react";
import { BALCONY_BASEMENT } from "@/data/balconyBasement";
import { THEME_DESCRIPTIONS } from "@/data/themeDescriptions";
import { PageHeader, PrintHeader, TM } from "@/lib/themes";

const KNOB = 84; // knob height in px, matches .knob in CSS
const clamp = (v) => Math.round(Math.min(100, Math.max(0, v)));

const QUESTIONS = [
  "What do you love about your work?",
  "Tell me about a recent success or accomplishment.",
  "What frustrates you about your work?",
  "How do your strengths help you build relationships?",
];

export default function SoundDesk({ themes, participant }) {
  const desk = themes.slice(0, 5);
  const [levels, setLevels] = useState({});
  const [info, setInfo] = useState(null);
  const [q, setQ] = useState(0);
  const [draft, setDraft] = useState({ answer: "", followUp: "" });
  const [answers, setAnswers] = useState({});
  const level = (k) => levels[k] ?? 50;
  const setLevel = (k, v) => setLevels((p) => ({ ...p, [k]: clamp(v) }));

  // Each question keeps its own answer and fader mix; moving to a question restores it.
  const goTo = (i) => {
    const a = answers[i];
    setQ(i);
    setDraft({ answer: a?.answer ?? "", followUp: a?.followUp ?? "" });
    if (a) setLevels(a.levels);
  };

  const save = () => {
    setAnswers((p) => ({ ...p, [q]: {
        answer: draft.answer.trim(),
        followUp: draft.followUp.trim(),
        levels,
        mix: desk.map((t) => ({ ...t, value: level(t.key) })),
      },
    }));
    if (q < QUESTIONS.length - 1) {
      setQ(q + 1);
      setDraft({ answer: answers[q + 1]?.answer ?? "", followUp: answers[q + 1]?.followUp ?? "" });
      if (answers[q + 1]) setLevels(answers[q + 1].levels);
    }
  };

  const field = (k) => ({ value: draft[k], onChange: (e) => setDraft((d) => ({ ...d, [k]: e.target.value })) });
  const saved = Object.keys(answers).map(Number).sort((a, b) => a - b);

  return (
    <div className="sound-desk">
      <PageHeader
        eyebrow="Activity"
        title="Sound Desk"
        sub="Mix your themes like a live sound desk. Work through one question at a time and drag each theme up or down to show how loudly it plays in your answer. Double-click a theme to see its description."
      >
        <button className="btn" onClick={() => setLevels({})}>
          <RotateCcw size={15} /> Reset levels
        </button>
        <button className="btn primary" onClick={() => window.print()}>
          <Download size={15} /> Download PDF
        </button>
      </PageHeader>
      <PrintHeader activity="Sound Desk" title="My strengths mix" participant={participant} />

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
          <p className="muted">Double-click a theme on the desk to see its brief description.</p>
        )}
      </section>

      <div className="desk-split no-print">
        <section className="desk">
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

        <aside className="panel no-print">
          <div className="eyebrow">
            Guided reflection · {q + 1} of {QUESTIONS.length}
          </div>
          <h2>{QUESTIONS[q]}</h2>
          <p className="muted">Answer, then set the faders to show which themes play loudest here.</p>
          <div className="form">
            <label>
              Your answer
              <textarea {...field("answer")} />
            </label>
            <label>
              Reflection or follow-up (optional)
              <textarea {...field("followUp")} placeholder="What do you notice in the mix? What would you dial up?" />
            </label>
            <div className="row-end">
              <button className="btn" disabled={q === 0} onClick={() => goTo(q - 1)}>
                <ChevronLeft size={15} /> Back
              </button>
              <button className="btn primary" onClick={save}>
                <Save size={15} /> Save reflection
              </button>
            </div>
          </div>
          {answers[q] && (
            <div className="status">
              <Check size={14} /> Reflection saved.
            </div>
          )}
        </aside>
      </div>

      {/* Screen lists saved reflections; the PDF always shows all four questions. */}
      <section className={`saved-mixes ${saved.length ? "" : "print-only"}`}>
        <h2 className="no-print">My reflections</h2>
        {QUESTIONS.map((question, i) => (
          <Reflection key={i} n={i + 1} question={question} saved={answers[i]} />
        ))}
      </section>
    </div>
  );
}

function Channel({ theme, value, onChange, onInfo }) {
  const ref = useRef(null);
  const grab = useRef(0); // pointer offset from knob centre, so grabbing the knob does not jump it

  const fromPointer = (clientY) => {
    const r = ref.current.getBoundingClientRect();
    onChange(100 - ((clientY - grab.current - r.top - KNOB / 2) / (r.height - KNOB)) * 100);
  };

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    const knob = e.target.closest(".knob");
    if (knob) {
      const k = knob.getBoundingClientRect();
      grab.current = e.clientY - (k.top + k.height / 2);
    } else {
      grab.current = 0;
      fromPointer(e.clientY);
    }
    // Pointer capture retargets the dblclick to the fader, so onDoubleClick lives there.
    e.currentTarget.setPointerCapture(e.pointerId);
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
        onDoubleClick={onInfo}
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

function Reflection({ n, question, saved }) {
  return (
    <article className={`reflection ${saved ? "" : "print-only"}`}>
      {saved ? (
        <div className="mini-desk">
          {saved.mix.map((t) => (
            <div key={t.key} className="mini-ch" style={{ "--accent": t.colour }}>
              <div className="mini-fader">
                <span className="mini-knob" style={{ top: `calc((100% - 22px) * ${(100 - t.value) / 100})` }}>
                  <TM>{t.name}</TM>
                </span>
              </div>
              <b>{t.value}</b>
            </div>
          ))}
        </div>
      ) : (
        <div className="mini-desk dashed" />
      )}
      <div className="card">
        <h3>
          {n}. {question}
        </h3>
        <div className="label">Answer</div>
        <p>{saved?.answer || "Not captured"}</p>
        {saved?.followUp && (
          <>
            <div className="label">Reflection or follow-up</div>
            <p>{saved.followUp}</p>
          </>
        )}
      </div>
    </article>
  );
}
