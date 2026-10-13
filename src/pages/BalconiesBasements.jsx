import { useState } from "react";
import { ArrowLeft, Download, Sun, CloudRain } from "lucide-react";
import { BALCONY_BASEMENT } from "@/data/balconyBasement";
import { INVESTMENT_GUIDES } from "@/data/investmentGuides";
import { PageHeader, PrintHeader, TM } from "@/lib/themes";

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
    <div>
      <PageHeader
        eyebrow="Activity"
        title="Balconies & Basements"
        sub="Every theme has a balcony, its mature and energising expression, and a basement, the overused or reactive version. The goal is not to fix basements, but to notice, name and lift."
      >
        {stage === "summary" && (
          <button className="btn" onClick={() => setStage("explore")}>
            <ArrowLeft size={15} /> Back to themes
          </button>
        )}
      </PageHeader>
      <PrintHeader activity="Balconies & Basements" title="Where my themes are today" participant={participant} />

      {stage === "explore" && (
        <div className="no-print">
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
          </section>
        </div>
      )}

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
      </section>
    </div>
  );
}

function BalconyBasement({ bb }) {
  return (
    <div className="bb-cols">
      <div className="bb-col balcony">
        <div className="label">
          <Sun size={13} /> Balcony · at best
        </div>
        <p>{bb.balcony}</p>
      </div>
      <div className="bb-col basement">
        <div className="label">
          <CloudRain size={13} /> Basement · when overused
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
