import { useRef, useState } from "react";
import { RotateCcw, Save, Download, ChevronLeft, Check } from "lucide-react";
import { BALCONY_BASEMENT } from "@/data/balconyBasement";
import { THEME_DESCRIPTIONS } from "@/data/themeDescriptions";
import { DotScale, PageHeader, PrintHeader, TM } from "@/lib/themes";
import { printPdf } from "@/lib/print";

const KNOB = 84; // knob height in px, matches .knob in CSS
const clamp = (v) => Math.round(Math.min(100, Math.max(0, v)));

// Guided reflection script. `rating` adds a 1–10 frequency scale, `followUp` an optional text prompt,
// and `adjust` a second "navigating frustration" step before moving on.
const QUESTIONS = [
  {
    q: "What do you love doing, both at work and in life?",
    fader: "Where is the volume set for each theme when you do this?",
    rating: "How often do you get to do this?",
  },
  {
    q: "Tell me about a recent success or accomplishment.",
    fader: "Where was the volume set for each theme in this success?",
    followUp: "Where could you use this approach again?",
  },
  {
    q: "What tends to frustrate you or drive you crazy?",
    fader: "Where is the volume set for each theme when this happens?",
    adjust: "How could you adjust your themes to handle this more positively next time?",
  },
  {
    q: "How do your strengths help you build relationships?",
    hint: "Think about friends, family or colleagues.",
    fader: "Where is the volume set for each theme in this example?",
  },
];
const blankDraft = { answer: "", noticed: "", followUp: "", rating: 0, note: "" };
const draftFrom = (a) => ({ ...blankDraft, ...a, note: a?.adjusted?.note ?? "" });

export default function SoundDesk({ themes, participant }) {
  const desk = themes.slice(0, 5);
  const [levels, setLevels] = useState({});
  const [info, setInfo] = useState(null);
  const [q, setQ] = useState(0);
  const [phase, setPhase] = useState("main"); // main | adjust (frustration second step)
  const [draft, setDraft] = useState(blankDraft);
  const [answers, setAnswers] = useState({});
  const [saves, setSaves] = useState(0); // bumps on each save to replay the status highlight
  const level = (k) => levels[k] ?? 50;
  const setLevel = (k, v) => setLevels((p) => ({ ...p, [k]: clamp(v) }));
  const Q = QUESTIONS[q];
  const snapshot = () => ({ levels, mix: desk.map((t) => ({ ...t, value: level(t.key) })) });

  // Each question keeps its own answer and fader mix; moving to a question restores it.
  const goTo = (i, nextPhase = "main") => {
    const a = answers[i];
    setQ(i);
    setPhase(nextPhase);
    setDraft(draftFrom(a));
    if (a) setLevels(nextPhase === "adjust" && a.adjusted ? a.adjusted.levels : a.levels);
  };

  const save = () => {
    if (phase === "adjust") {
      // Second frustration save: keep the original settings, store the adjusted ones beside them.
      setAnswers((p) => ({ ...p, [q]: { ...p[q], adjusted: { ...snapshot(), note: draft.note.trim() } } }));
    } else {
      const fields = {
        answer: draft.answer.trim(),
        noticed: draft.noticed.trim(),
        followUp: draft.followUp.trim(),
        rating: draft.rating,
      };
      setAnswers((p) => ({ ...p, [q]: { ...p[q], ...fields, ...snapshot() } }));
    }
    setSaves((n) => n + 1);

    if (Q.adjust && phase === "main") {
      // Same answer stays visible; the faders keep the saved mix as the starting point.
      const prev = answers[q]?.adjusted;
      setPhase("adjust");
      setDraft((d) => ({ ...d, note: prev?.note ?? "" }));
      if (prev) setLevels(prev.levels);
    } else if (q < QUESTIONS.length - 1) {
      const a = answers[q + 1];
      setQ(q + 1);
      setPhase("main");
      setDraft(draftFrom(a));
      if (a) setLevels(a.levels);
    }
  };

  const back = () =>
    phase === "adjust" ? goTo(q) : goTo(q - 1, QUESTIONS[q - 1].adjust ? "adjust" : "main");
  const field = (k) => ({ value: draft[k], onChange: (e) => setDraft((d) => ({ ...d, [k]: e.target.value })) });
  const saved = QUESTIONS.some((_, i) => answers[i]);

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
          <h2>{Q.q}</h2>
          {phase === "main" ? (
            <div className="form">
              <label>
                Your answer
                <textarea {...field("answer")} placeholder={Q.hint} />
              </label>
              <p className="fader-prompt">{Q.fader} Move the faders on the desk.</p>
              {Q.rating && (
                <div className="field">
                  <span id="sd-rating">{Q.rating} (optional)</span>
                  <DotScale
                    value={draft.rating || 0}
                    onChange={(rating) => setDraft((d) => ({ ...d, rating }))}
                    labelledBy="sd-rating"
                    low="1 = Rarely"
                    high="10 = Very often"
                  />
                </div>
              )}
              {Q.followUp && (
                <label>
                  {Q.followUp} (optional)
                  <textarea {...field("followUp")} />
                </label>
              )}
              <label>
                Anything else you noticed? (optional)
                <textarea {...field("noticed")} />
              </label>
              <Actions q={q} phase={phase} onBack={back} onSave={save} />
            </div>
          ) : (
            <div className="form">
              <div className="saved-answer">
                <div className="label">When frustration happens</div>
                <p>{draft.answer || "Not captured"}</p>
              </div>
              <h3 className="adjust-head">Navigating frustration next time</h3>
              <p className="fader-prompt">{Q.adjust} Adjust the faders on the desk.</p>
              <label>
                What would you do differently? (optional)
                <textarea {...field("note")} />
              </label>
              <Actions q={q} phase={phase} onBack={back} onSave={save} />
            </div>
          )}
          {saves > 0 && (
            <div key={saves} className="status flash" role="status">
              <Check size={14} /> Reflection saved. Scroll down to view your reflection summary and download the PDF.
            </div>
          )}
        </aside>
      </div>

      {/* Screen lists saved reflections; the PDF always shows all four questions. */}
      <section className={`saved-mixes ${saved ? "" : "print-only"}`}>
        <h2 className="no-print">My reflections</h2>
        {QUESTIONS.map((question, i) => (
          <Reflection key={i} n={i + 1} question={question} saved={answers[i]} />
        ))}
        <div className="row-end no-print">
          <button className="btn primary" onClick={() => printPdf(participant, "Sound Desk")}>
            <Download size={15} /> Download PDF
          </button>
        </div>
      </section>
    </div>
  );
}

function Actions({ q, phase, onBack, onSave }) {
  return (
    <div className="row-end">
      <button className="btn" disabled={q === 0 && phase === "main"} onClick={onBack}>
        <ChevronLeft size={15} /> Back
      </button>
      <button className="btn primary" onClick={onSave}>
        <Save size={15} /> Save reflection
      </button>
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

function MiniDesk({ mix, label }) {
  return (
    <figure className="mini-fig">
      <figcaption className="label">{label}</figcaption>
      <div className="mini-desk">
        {mix.map((t) => (
          <div key={t.key} className="mini-ch" style={{ "--accent": t.colour }}>
            <div className="mini-fader">
              <span className="mini-knob" style={{ top: `calc((100% - 12px) * ${(100 - t.value) / 100})` }} />
            </div>
            <span className="mini-name">
              <TM>{t.name}</TM>
            </span>
            <b>{t.value}</b>
          </div>
        ))}
      </div>
    </figure>
  );
}

// One card per question: question across the top, desk snapshot(s) left, answers right.
function Reflection({ n, question, saved }) {
  const adj = saved?.adjusted;
  const frustration = !!question.adjust;
  const rows = [
    [frustration ? "When frustration happens" : "Answer", saved?.answer || "Not captured"],
    saved?.rating > 0 && [question.rating, `${saved.rating}/10 (1 = Rarely, 10 = Very often)`],
    saved?.followUp && [question.followUp, saved.followUp],
    saved?.noticed && ["Anything else I noticed", saved.noticed],
    adj && ["Navigating frustration next time", adj.note || "No note captured."],
    // Adjusted mix listed as text so each question keeps a single desk picture.
    adj && ["Adjusted theme volumes", adj.mix.map((t) => `${t.name}® ${t.value}`).join(" · ")],
  ].filter(Boolean);
  return (
    <article className={`card reflection ${saved ? "" : "print-only"}`}>
      <h3>
        {n}. {question.q}
      </h3>
      <div className="reflection-body">
        <div className="mini-stack">
          {saved ? (
            <>
              <MiniDesk mix={saved.mix} label={frustration ? "When frustration happens" : "Theme volume"} />
            </>
          ) : (
            <div className="mini-desk dashed" />
          )}
        </div>
        <dl className="reflection-text">
          {rows.map(([k, v]) => (
            <div key={k}>
              <dt className="label">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
