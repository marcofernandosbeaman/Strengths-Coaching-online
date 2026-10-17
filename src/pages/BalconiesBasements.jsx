import { useState } from "react";
<<<<<<< HEAD
import { ArrowLeft, Check, Download, ListChecks, Sun, Sunset } from "lucide-react";
=======
import { ArrowLeft, Download, Sun, CloudRain } from "lucide-react";
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
import { BALCONY_BASEMENT } from "@/data/balconyBasement";
import { PageHeader, PrintHeader, TM } from "@/lib/themes";
import { printPdf } from "@/lib/print";

<<<<<<< HEAD
const QUESTIONS = [
  ["why", "What makes you choose that number?"],
  ["working", "What's working well?"],
  ["trip", "What tends to trip this strength into the basement?"],
  ["stay", "What helps this strength stay in, or return to, the balcony?"],
];
const HELPERS_Q = "Which of your other strengths might help regulate this one?";
const COACHING = [
  ["closest", "Which strength is currently operating closest to its balcony?"],
  ["attention", "Which strengths may need more attention right now?"],
  ["patterns", "What patterns do you notice?"],
  ["regulates", "Which strength seems to regulate others most often?"],
  ["action", "What insight or action do you want to take forward? (optional)"],
];
const blankRow = { rating: 0, why: "", working: "", trip: "", stay: "", helpers: [] }; // rating 0 = not rated
const explored = (r) => r && (r.rating || r.helpers.length || QUESTIONS.some(([k]) => r[k].trim()));

export default function BalconiesBasements({ themes: allThemes, participant }) {
  const themes = allThemes.slice(0, 5); // Top 5
  const [stage, setStage] = useState("explore"); // explore | summary
  const [rows, setRows] = useState({}); // themeKey -> answers; kept while moving between themes and tabs
  const [coaching, setCoaching] = useState({});
  const [current, setCurrent] = useState(themes[0]?.key);

  if (!themes.length) return null;
  const t = themes.find((x) => x.key === current) ?? themes[0];
  const r = rows[t.key] ?? blankRow;
  const set = (patch) => setRows((p) => ({ ...p, [t.key]: { ...(p[t.key] ?? blankRow), ...patch } }));
  const done = themes.filter((x) => explored(rows[x.key]));
  const others = themes.filter((x) => x.key !== t.key);

  const actions = (
    <>
      {stage === "explore" ? (
        <button className="btn" onClick={() => setStage("summary")}>
          <ListChecks size={15} /> View Summary
        </button>
      ) : (
        <button className="btn" onClick={() => setStage("explore")}>
          <ArrowLeft size={15} /> Back to themes
        </button>
      )}
      <button
        className="btn primary"
        disabled={!done.length}
        title={done.length ? "" : "Explore at least one theme first"}
        onClick={() => printPdf(participant, "Balconies & Basements")}
      >
        <Download size={15} /> Download PDF
      </button>
    </>
  );
=======
const PLACES = ["Balcony", "In between", "Basement"];
const STEPS = [
  (n) => `Where is ${n} today?`,
  (n) => `What signals that ${n} is starting to slide into the basement?`,
  (n) => `What lifts ${n} back to the balcony?`,
];
const HINTS = [
  "Read the balcony and basement, then choose where this theme is playing right now.",
  "Capture the participant’s own words: behaviours, feelings or reactions others might notice.",
  "Capture one practical way to bring this theme back to its best.",
];

export default function BalconiesBasements({ themes, participant }) {
  const [stage, setStage] = useState("explore"); // explore | summary
  const [rows, setRows] = useState({});
  const [tab, setTi] = useState(0);
  const [step, setStep] = useState(0);
  const row = (k) => rows[k] ?? { place: "", signal: "", lift: "" };
  const set = (k, patch) => setRows((r) => ({ ...r, [k]: { ...row(k), ...patch } }));
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9

  if (!themes.length) return null;
  const ti = Math.min(tab, themes.length - 1); // themes can shrink on Home
  const t = themes[ti];
  const r = row(t.key);
  const bb = BALCONY_BASEMENT[t.key];
  const last = ti === themes.length - 1;
  const complete = (x) => x.place && x.signal && x.lift;

  const next = () =>
    step < 2 ? setStep(step + 1) : last ? setStage("summary") : (setTi(ti + 1), setStep(0));
  const back = () => (step > 0 ? setStep(step - 1) : ti > 0 && (setTi(ti - 1), setStep(2)));

  return (
    <div className="bb-page">
      <PageHeader
        eyebrow="Activity"
        title="Balconies & Basements"
        sub="Every strength has a balcony, how it looks at its best, and a basement, how it can show up under pressure. Notice where each of your top five is operating right now."
      >
<<<<<<< HEAD
        {actions}
=======
        {stage === "summary" && (
          <button className="btn" onClick={() => setStage("explore")}>
            <ArrowLeft size={15} /> Back to themes
          </button>
        )}
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
      </PageHeader>
      <PrintHeader activity="Balconies & Basements" title="Where my strengths are operating" participant={participant} />
      {/* PDF only: two introduction boxes directly under the participant's name. Wording from the client slide. */}
      <div className="print-only bb-intro">
        <p>
          Every strength has a balcony and a basement. On the balcony, your strength is at its best, creating value
          for you and those around you. The basement is how that same strength may appear when it is overused,
          misunderstood or less suited to the situation. Neither defines who you are. Recognising both helps you
          understand the full expression of your strengths.
        </p>
        <p>
          Greater awareness gives you greater choice. As you recognise your patterns and what brings them out, you
          can pause and consider what the moment needs. You might adjust how strongly you use a strength, draw on
          another strength for balance or seek a trusted perspective. It isn’t about getting it right every time but
          responding with growing awareness and intention.
        </p>
      </div>

      {stage === "explore" && (
        <div className="no-print">
<<<<<<< HEAD
          <div className="bb-tabs" role="tablist" aria-label="Your top five strengths">
            {themes.map((x) => {
              const xr = rows[x.key];
              return (
                <button
                  key={x.key}
                  role="tab"
                  aria-selected={x.key === t.key}
                  className={`scenario bb-tab ${x.key === t.key ? "active" : ""} ${explored(xr) ? "complete" : ""}`}
                  style={{ "--accent": x.colour }}
                  onClick={() => setCurrent(x.key)}
                >
                  <b>
                    <TM>{x.name}</TM>
                  </b>
                  <small>{xr?.rating ? `${xr.rating}/10` : explored(xr) ? "In progress" : "Not started"}</small>
                </button>
              );
            })}
          </div>

          <section className="bb-workspace">
            <article className="panel bb-left" style={{ "--accent": t.colour }}>
              <h2 className="bb-name">
                <TM>{t.name}</TM>
              </h2>
              <Rating value={r.rating} onChange={(rating) => set({ rating })} />
              <BalconyBasement bb={BALCONY_BASEMENT[t.key]} />
            </article>

            <article className="panel bb-right form">
              {QUESTIONS.map(([k, q]) => (
                <label key={k}>
                  {q}
                  <textarea value={r[k]} onChange={(e) => set({ [k]: e.target.value })} />
                </label>
              ))}
              <fieldset className="helpers">
                <legend>{HELPERS_Q}</legend>
                <p className="muted">Choose any that apply.</p>
                <div className="helper-list">
                  {others.map((o) => {
                    const on = r.helpers.includes(o.key);
                    return (
                      <button
                        key={o.key}
                        type="button"
                        role="checkbox"
                        aria-checked={on}
                        className={`pick-tile ${on ? "on" : ""}`}
                        style={{ "--accent": o.colour }}
                        onClick={() =>
                          set({ helpers: on ? r.helpers.filter((k) => k !== o.key) : [...r.helpers, o.key] })
                        }
                      >
                        <TM>{o.name}</TM>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              {explored(r) && (
                <div className="status">
                  <Check size={14} /> Saved. Move to another strength, or view your summary at any time.
                </div>
              )}
            </article>
=======
          <div className="scenario-tabs bb-tabs">
            {themes.map((x, i) => (
              <button
                key={x.key}
                className={`scenario ${i === ti ? "active" : ""} ${complete(row(x.key)) ? "complete" : ""}`}
                onClick={() => {
                  setTi(i);
                  setStep(0);
                }}
              >
                <b>
                  {i + 1}. <TM>{x.name}</TM>
                </b>
                <small>{row(x.key).place || "Not started"}</small>
              </button>
            ))}
          </div>
          <section className="workspace">
            <article className="panel">
              <div className="stepbar">
                {[0, 1, 2].map((i) => (
                  <span key={i} className={`dot ${i <= step ? "active" : ""}`}>
                    {i + 1}
                  </span>
                ))}
              </div>
              <h2 className="question">{STEPS[step](`${t.name}®`)}</h2>
              <p className="muted">{HINTS[step]}</p>
              {step === 0 && (
                <>
                  <BalconyBasement bb={bb} />
                  <div className="pick-grid bb-places" role="radiogroup" aria-label="Where is it today?">
                    {PLACES.map((p) => (
                      <button
                        key={p}
                        role="radio"
                        aria-checked={r.place === p}
                        className={`pick-tile ${r.place === p ? "on" : ""}`}
                        style={{ "--accent": t.colour }}
                        onClick={() => set(t.key, { place: r.place === p ? "" : p })}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {step > 0 && (
                <label className="field">
                  {step === 1 ? "Signals of the slide" : "What lifts it"}
                  <textarea
                    value={step === 1 ? r.signal : r.lift}
                    placeholder={step === 1 ? bb.basement : INVESTMENT_GUIDES[t.key]?.[0]}
                    onChange={(e) => set(t.key, { [step === 1 ? "signal" : "lift"]: e.target.value })}
                  />
                </label>
              )}
              <div className="row-between">
                <button className="btn" onClick={back} style={{ visibility: ti || step ? "visible" : "hidden" }}>
                  Back
                </button>
                <button className="btn primary" onClick={next}>
                  {step < 2 ? "Continue" : last ? "View my summary" : "Next theme"}
                </button>
              </div>
            </article>
            <aside className="panel preview" style={{ "--accent": t.colour }}>
              <h3>
                <TM>{t.name}</TM>
              </h3>
              <p className="muted">Responses build the summary as you go.</p>
              <Preview label="Where it is today">{r.place || "Not selected"}</Preview>
              <Preview label="Signals of the slide">{r.signal || "Not captured yet."}</Preview>
              <Preview label="What lifts it">{r.lift || "Not captured yet."}</Preview>
            </aside>
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
          </section>
        </div>
      )}

<<<<<<< HEAD
      {/* Summary on screen; the PDF always prints it with the latest answers. */}
      <section className={stage === "summary" ? "" : "print-only"}>
        <div className="bb-summary">
          <article className="panel">
            <h2>Summary</h2>
            {done.length ? (
              <table className="bb-table">
                <thead>
                  <tr>
                    <th>Theme</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {done.map((x) => (
                    <tr key={x.key} style={{ "--accent": x.colour }}>
                      <td>
                        <TM>{x.name}</TM>
                      </td>
                      <td>{rows[x.key].rating ? `${rows[x.key].rating}/10` : "Not rated"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="muted">No strengths explored yet. Choose a strength to start.</p>
            )}
            <p className="muted bb-scale">1 = Mostly Basement · 10 = Mostly Balcony</p>
          </article>

          <article className="panel form bb-coaching">
            <h2>Coaching reflection</h2>
            {COACHING.map(([k, q]) => (
              <label key={k}>
                {q}
                <textarea
                  className="no-print"
                  value={coaching[k] ?? ""}
                  onChange={(e) => setCoaching((c) => ({ ...c, [k]: e.target.value }))}
                />
                <span className="print-only reflection-answer">
                  {coaching[k]?.trim() || (k === "action" ? "None added" : "Not captured")}
                </span>
              </label>
            ))}
          </article>
        </div>

        {done.length > 0 && (
          <div className="bb-reflections">
            <h2 className="no-print">My strength reflections</h2>
            {done.map((x) => {
              const s = rows[x.key];
              return (
                <article key={x.key} className="card bb-section" style={{ "--accent": x.colour }}>
                  <div className="bb-head">
                    <h3>
                      <TM>{x.name}</TM>
                    </h3>
                    <span className="pill">Current Rating: {s.rating ? `${s.rating}/10` : "Not rated"}</span>
                  </div>
                  <BalconyBasement bb={BALCONY_BASEMENT[x.key]} />
                  <dl className="bb-answers">
                    {QUESTIONS.map(([k, q]) => (
                      <div key={k}>
                        <dt className="label">{q}</dt>
                        <dd>{s[k].trim() || "Not captured"}</dd>
                      </div>
                    ))}
                    <div>
                      <dt className="label">{HELPERS_Q}</dt>
                      <dd>
                        {s.helpers.length
                          ? themes
                              .filter((o) => s.helpers.includes(o.key))
                              .map((o) => `${o.name}®`)
                              .join(" · ")
                          : "None selected"}
                      </dd>
                    </div>
                  </dl>
                </article>
              );
            })}
          </div>
        )}
        <div className="row-end no-print">{actions}</div>
=======
      <section className={stage === "summary" ? "" : "print-only"}>
        <div className="section-head no-print">
          <div>
            <h2>Where my themes are today</h2>
            <p>What signals the slide, and what lifts each theme back to the balcony.</p>
          </div>
        </div>
        <div className="bb-list">
          {themes.map((x) => {
            const s = row(x.key);
            return (
              <article key={x.key} className="card bb" style={{ "--accent": x.colour }}>
                <div className="bb-head">
                  <h3>
                    <TM>{x.name}</TM>
                  </h3>
                  {s.place && <span className="pill">{s.place}</span>}
                </div>
                <BalconyBasement bb={BALCONY_BASEMENT[x.key]} />
                <div className="label">Signals of the slide</div>
                <p>{s.signal || "Not captured"}</p>
                <div className="label">What lifts it</div>
                <p>{s.lift || "Not captured"}</p>
              </article>
            );
          })}
        </div>
        <div className="row-end no-print">
          <button
            className="btn"
            onClick={() => {
              setRows({});
              setTi(0);
              setStep(0);
              setStage("explore");
            }}
          >
            Start again
          </button>
          <button className="btn primary" onClick={() => window.print()}>
            <Download size={15} /> Download PDF
          </button>
        </div>
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
      </section>
    </div>
  );
}

<<<<<<< HEAD
// 1–10, Basement on the left to Balcony on the right. Unrated until the user touches it.
function Rating({ value, onChange }) {
  const pick = (e) => onChange(+e.currentTarget.value);
  return (
    <div className="bb-rating">
      <label htmlFor="bb-rating">Where is this strength operating most often right now?</label>
      <input
        id="bb-rating"
        type="range"
        min={1}
        max={10}
        step={1}
        value={value || 5}
        className={value ? "" : "unset"}
        onChange={pick}
        onClick={pick}
        aria-valuetext={value ? `${value} out of 10` : "Not rated"}
      />
      <div className="bb-ends">
        <span>
          <b>1 = Mostly Basement</b>
          Mostly operating from the Basement
        </span>
        <span>
          <b>10 = Mostly Balcony</b>
          Mostly operating from the Balcony
        </span>
      </div>
      <p className="bb-current">Current Rating: {value ? `${value}/10` : "Not rated yet"}</p>
    </div>
  );
}

=======
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
function BalconyBasement({ bb }) {
  return (
    <div className="bb-cols">
      <div className="bb-col balcony">
        <div className="label">
<<<<<<< HEAD
          <Sun size={13} /> Balcony · best self
=======
          <Sun size={13} /> Balcony · at best
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
        </div>
        <p>{bb.balcony}</p>
      </div>
      <div className="bb-col basement">
        <div className="label">
<<<<<<< HEAD
          <Sunset size={13} /> Basement · under pressure
=======
          <CloudRain size={13} /> Basement · when overused
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
        </div>
        <p>{bb.basement}</p>
      </div>
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
