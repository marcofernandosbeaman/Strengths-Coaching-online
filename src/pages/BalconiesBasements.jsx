import { useState } from "react";
import { ArrowLeft, Check, Download, ListChecks, Sun, Sunset } from "lucide-react";
import { BALCONY_BASEMENT } from "@/data/balconyBasement";
import { DotScale, PageHeader, PrintHeader, TM } from "@/lib/themes";
import { printPdf } from "@/lib/print";

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

  return (
    <div className="bb-page">
      <PageHeader
        eyebrow="Activity"
        title="Balconies & Basements"
        sub="Every strength has a balcony, how it looks at its best, and a basement, how it can show up under pressure. Notice where each of your top five is operating right now."
      >
        {actions}
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
          </section>
        </div>
      )}

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
      </section>
    </div>
  );
}

// 1–10, Basement on the left to Balcony on the right. Unrated until the user touches it.
function Rating({ value, onChange }) {
  return (
    <div className="bb-rating">
      <span id="bb-rating" className="bb-question">Where is this strength operating most often right now?</span>
      <DotScale
        value={value || 0}
        onChange={onChange}
        labelledBy="bb-rating"
        low="1 = Mostly Basement"
        high="10 = Mostly Balcony"
      />
      <p className="bb-current">Current Rating: {value ? `${value}/10` : "Not rated yet"}</p>
    </div>
  );
}

function BalconyBasement({ bb }) {
  return (
    <div className="bb-cols">
      <div className="bb-col balcony">
        <div className="label">
          <Sun size={13} /> Balcony · best self
        </div>
        <p>{bb.balcony}</p>
      </div>
      <div className="bb-col basement">
        <div className="label">
          <Sunset size={13} /> Basement · under pressure
        </div>
        <p>{bb.basement}</p>
      </div>
    </div>
  );
}
