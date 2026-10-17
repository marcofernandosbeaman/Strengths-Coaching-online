<<<<<<< HEAD
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Download, X } from "lucide-react";
=======
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
import { COMMUNICATION_STYLES } from "@/data/communicationStyles";
import { PageHeader, PrintHeader, ThemeChip, TM } from "@/lib/themes";
import { printPdf } from "@/lib/print";

const SCENARIOS = [
  {
    name: "With People I Know",
    short: "Comfort and familiarity",
    q: [
      "Which three themes most influence how you communicate when you feel comfortable with the people around you?",
      "What does your communication naturally look or sound like?",
      "What might others need more or less of from you?",
      "Which strength could you dial up to make the conversation more effective?",
    ],
  },
  {
    name: "In Meetings",
    short: "Contributing and listening",
    q: [
      "Which three themes most influence how you participate in meetings?",
      "How do these themes affect how you contribute, listen, process ideas or make decisions?",
      "When might your usual meeting style be less helpful?",
      "Which strength could you dial up before or during an important meeting?",
    ],
  },
  {
    name: "Presenting or Influencing",
    short: "Clarity and impact",
    q: [
      "Which three themes most influence how you prepare and deliver an important message?",
      "What helps you gain attention, explain ideas or influence the audience?",
      "What could reduce the clarity or impact of your message?",
      "Which strength could you dial up to make the message clearer and more compelling?",
    ],
  },
  {
    name: "Under Pressure",
    short: "Urgency and challenge",
    q: [
      "Which three themes become most visible when communication feels urgent, uncertain or difficult?",
      "What do these themes help you contribute?",
      "What communication behaviour do you need to watch for?",
      "Which strength could help you communicate more deliberately under pressure?",
    ],
  },
];

const HINTS = [
  "Select up to three themes. The coach records the participant’s choices.",
  "Capture the participant’s own words.",
  "Capture the participant’s own words.",
  "Choose a theme to dial up, then capture how it will be used.",
];
const PLACEHOLDERS = [
  "",
  "I brainstorm, think aloud and use another person as a sounding board to sharpen my ideas.",
  "Thinking aloud may make my message sound unfinished when the audience needs a clear recommendation.",
  "Before an important meeting, I will refine the strongest point and prepare the clearest wording.",
];
const FIELD = [null, "describe", "watch", "strategy"];
const FIELD_LABEL = [null, "How this shows up", "Possible watch-out", "How will you use it?"];

const blank = () => SCENARIOS.map(() => ({ themes: [], describe: "", watch: "", dial: [], strategy: "" }));

export default function Communication({ themes, participant }) {
  const [stage, setStage] = useState("cards"); // cards | explore | summary
  const [state, setState] = useState(blank);
  const [si, setSi] = useState(0);
  const [step, setStep] = useState(0);
<<<<<<< HEAD
  const [peek, setPeek] = useState(null); // theme whose description card is open on the question screen
  const [showAll, setShowAll] = useState(false); // theme cards: first five, rest tucked underneath
  const beforeClick = useRef(null); // selection before the first click of a possible double-click
=======
  const [peek, setPeek] = useState(null); // { theme, x, y } for the double-click description card
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
  const x = state[si];
  const name = (k) => themes.find((t) => t.key === k);

  const update = (patch) =>
    setState((s) => s.map((row, i) => (i === si ? { ...row, ...patch } : row)));

  const togglePick = (k) => {
    const list = step === 0 ? "themes" : "dial";
    const max = step === 0 ? 3 : 1;
    const cur = x[list];
    update({
      [list]: cur.includes(k) ? cur.filter((y) => y !== k) : max === 1 ? [k] : cur.length < max ? [...cur, k] : cur,
    });
  };

  const complete = (r) => r.themes.length && r.describe && r.watch && r.dial.length && r.strategy;
  const next = () => (step < 3 ? setStep(step + 1) : si < 3 ? (setSi(si + 1), setStep(0)) : setStage("summary"));
  const back = () => (step > 0 ? setStep(step - 1) : si > 0 && (setSi(si - 1), setStep(3)));

  return (
    <div>
      <PageHeader
        eyebrow="Activity"
        title="Strengths & Communication"
        sub="First understand how each theme communicates, then explore how your style changes across different situations."
      >
        {stage !== "cards" && (
          <button className="btn" onClick={() => setStage("cards")}>
            <ArrowLeft size={15} /> Theme cards
          </button>
        )}
      </PageHeader>
      <PrintHeader activity="Strengths & Communication" title="My Communication Strategy" participant={participant} />

      {stage === "cards" && (
        <div className="no-print">
          <div className="section-head">
            <div>
              <h2>Your communication themes</h2>
              <p>Read and compare how each of your themes shapes the way you communicate.</p>
            </div>
            <span className="pill">Stage 1 of 2 · Explore</span>
          </div>
          <div className="comm-grid">
<<<<<<< HEAD
            {(showAll ? themes : themes.slice(0, 5)).map((t) => (
=======
            {themes.map((t) => (
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
              <CommCard key={t.key} theme={t} />
            ))}
          </div>
          {themes.length > 5 && (
            <button
              className={`comm-more ${showAll ? "open" : ""}`}
              aria-expanded={showAll}
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>
                  Show fewer <ChevronUp size={14} />
                </>
              ) : (
                <>
                  Show {themes.length - 5} more themes <ChevronDown size={14} />
                </>
              )}
            </button>
          )}
          <div className="panel launch">
            <div>
              <h3>Explore your communication in different situations</h3>
              <p>
                Your communication may shift depending on the people, purpose and pressure involved.
                Explore four scenarios to notice what comes naturally, what to watch for and which
                strengths you could intentionally dial up.
              </p>
            </div>
            <button className="btn primary" onClick={() => setStage("explore")}>
              Explore my communication style <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {stage === "explore" && (
        <div className="no-print">
          <div className="scenario-tabs">
            {SCENARIOS.map((s, i) => (
              <button
                key={s.name}
                className={`scenario ${i === si ? "active" : ""} ${complete(state[i]) ? "complete" : ""}`}
                onClick={() => {
                  setSi(i);
                  setStep(0);
                }}
              >
                <b>
                  {i + 1}. {s.name}
                </b>
                <small>{s.short}</small>
              </button>
            ))}
          </div>
          <section className="workspace">
            <article className="panel">
              <div className="stepbar">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={`dot ${i <= step ? "active" : ""}`}>
                    {i + 1}
                  </span>
                ))}
              </div>
              <h2 className="question">{SCENARIOS[si].q[step]}</h2>
              <p className="muted">{HINTS[step]} Double-click a theme to see how it communicates.</p>
              {(step === 0 || step === 3) && (
                <>
                  <div className="pick-grid">
                    {themes.map((t) => (
                      <button
                        key={t.key}
                        className={`pick-tile ${(step === 0 ? x.themes : x.dial).includes(t.key) ? "on" : ""}`}
                        style={{ "--accent": t.colour }}
<<<<<<< HEAD
                        onClick={(e) => {
                          if (e.detail > 1) return; // second click of a double-click
                          beforeClick.current = { themes: x.themes, dial: x.dial };
                          togglePick(t.key);
                        }}
                        // Double-click opens or closes the description and undoes the first click's toggle,
                        // so the selection is unchanged.
                        onDoubleClick={() => {
                          if (beforeClick.current) update(beforeClick.current);
                          setPeek(peek?.key === t.key ? null : t);
=======
                        // Second click of a double-click is ignored so it does not undo the first.
                        onClick={(e) => e.detail < 2 && togglePick(t.key)}
                        onDoubleClick={(e) => {
                          const r = e.currentTarget.getBoundingClientRect();
                          setPeek({ theme: t, x: r.left, y: r.bottom + 8 });
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
                        }}
                      >
                        <TM>{t.name}</TM>
                      </button>
                    ))}
                  </div>
                  {step === 0 && <div className="counter">{x.themes.length} of 3 selected</div>}
<<<<<<< HEAD
                  {peek && (
                    <div className="peek">
                      <button className="peek-close" aria-label="Close description" onClick={() => setPeek(null)}>
                        <X size={15} />
                      </button>
                      <CommCard theme={peek} aria-live="polite" />
                    </div>
                  )}
=======
                  {peek && <Peek {...peek} onClose={() => setPeek(null)} />}
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
                </>
              )}
              {step > 0 && (
                <label className="field">
                  {FIELD_LABEL[step]}
                  <textarea
                    value={x[FIELD[step]]}
                    placeholder={PLACEHOLDERS[step]}
                    onChange={(e) => update({ [FIELD[step]]: e.target.value })}
                  />
                </label>
              )}
              <div className="row-between">
                <button className="btn" onClick={back} style={{ visibility: si || step ? "visible" : "hidden" }}>
                  Back
                </button>
                <button className="btn primary" onClick={next}>
                  {si === 3 && step === 3 ? "View my strategy" : step === 3 ? "Next scenario" : "Continue"}
                </button>
              </div>
            </article>
            <aside className="panel preview">
              <h3>{SCENARIOS[si].name}</h3>
              <p className="muted">Responses build the strategy as you go.</p>
              <Preview label="Natural themes">
                <div className="chips">
                  {x.themes.map((k) => <ThemeChip key={k} theme={name(k)} />)}
                  {!x.themes.length && <span className="muted">Not selected</span>}
                </div>
              </Preview>
              <Preview label="How this shows up">{x.describe || "Not captured yet."}</Preview>
              <Preview label="Possible watch-out">{x.watch || "Not captured yet."}</Preview>
              <Preview label="Dial up">
                <div className="chips">
                  {x.dial.map((k) => <ThemeChip key={k} theme={name(k)} />)}
                </div>
                {x.strategy || "Strategy not captured yet."}
              </Preview>
            </aside>
          </section>
        </div>
      )}

      <section className={stage === "summary" ? "" : "print-only"}>
        <div className="section-head no-print">
          <div>
            <h2>My Communication Strategy</h2>
            <p>How I communicate naturally and what I can intentionally dial up.</p>
          </div>
        </div>
        <div className="grid-2">
          {SCENARIOS.map((s, i) => {
            const r = state[i];
            const names = (ks) => ks.map((k) => name(k)?.name + "®").join(" · ");
            return (
              <article key={s.name} className="card">
                <h3>
                  {i + 1}. {s.name}
                </h3>
                <div className="label">I naturally use</div>
                <p>{names(r.themes) || "Not selected"}</p>
                <div className="label">This looks like</div>
                <p>{r.describe || "Not captured"}</p>
                <div className="label">Watch-out</div>
                <p>{r.watch || "Not captured"}</p>
                <div className="label">I will dial up</div>
                <p>
                  {names(r.dial) || "Not selected"}
                  {r.strategy && ` – ${r.strategy}`}
                </p>
              </article>
            );
          })}
        </div>
        <div className="row-end no-print">
          <button
            className="btn"
            onClick={() => {
              setState(blank());
              setSi(0);
              setStep(0);
              setStage("cards");
            }}
          >
            Start again
          </button>
          <button className="btn primary" onClick={() => printPdf(participant, "Strengths & Communication")}>
            <Download size={15} /> Download one-page PDF
          </button>
        </div>
      </section>
    </div>
  );
}

function Preview({ label, children }) {
  return (
    <div className="preview-card">
      <div className="label">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function CommCard({ theme: t, ...rest }) {
  return (
    <article className="card accent-card" style={{ "--accent": t.colour }} {...rest}>
      <h3>
        <TM>{t.name}</TM>
      </h3>
      <p className="short">{t.blurb}</p>
      <div className="rule-accent" />
      <div className="label">How I communicate</div>
      <p className="quote">{COMMUNICATION_STYLES[t.key]}</p>
    </article>
  );
}

<<<<<<< HEAD
=======
// Floating description card under the double-clicked tile; closes on outside click, scroll or Escape.
function Peek({ theme, x, y, onClose }) {
  useEffect(() => {
    const close = (e) => (e.type !== "keydown" || e.key === "Escape") && onClose();
    const t = setTimeout(() => document.addEventListener("click", close));
    window.addEventListener("keydown", close);
    window.addEventListener("scroll", close, true);
    return () => {
      clearTimeout(t);
      document.removeEventListener("click", close);
      window.removeEventListener("keydown", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [theme, onClose]);
  return (
    <CommCard
      theme={theme}
      className="card accent-card peek"
      role="dialog"
      aria-label={theme.name}
      style={{ "--accent": theme.colour, left: Math.min(x, window.innerWidth - 300), top: y }}
    />
  );
}
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
