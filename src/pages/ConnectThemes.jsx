import { useState } from "react";
import { Download, RotateCcw } from "lucide-react";
import traits from "@/data/theme-traits.json";
import { PageHeader, PrintHeader, TM } from "@/lib/themes";
import { listJoin } from "@/lib/themeData";

const ROUNDS = {
  bring: { title: "What do your themes bring?", heading: "What they bring", done: "You’ve connected what your themes bring.", doneCopy: "Each theme contributes something distinct to how you work, relate and create impact.", next: "Continue to What I Need" },
  need: { title: "What do your themes need?", heading: "What they need", done: "You’ve connected what your themes need.", doneCopy: "Understanding these needs helps each theme contribute at its best.", next: "View my summary" },
};
const CONFETTI = ["#8f3fb0", "#f36c21", "#1678c8", "#159268", "#d5aa3b"];

const statement = (key, round) => {
  const t = traits[key];
  const s = round === "bring" ? `Brings ${t.brings}.` : `Needs ${listJoin(t.likes)}.`;
  return s;
};
// Stable pseudo-random order per round, so switching pages mid-game keeps the layout.
const hash = (str) => [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0);
const shuffled = (themes, seed) => [...themes].sort((a, b) => hash(a.key + seed) - hash(b.key + seed));

export default function ConnectThemes({ themes, participant }) {
  const [round, setRound] = useState("bring");
  const [phase, setPhase] = useState("play"); // play | between | summary
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrong, setWrong] = useState(null);
  const [message, setMessage] = useState({ text: "Select a theme to begin.", tone: "" });
  const [reflection, setReflection] = useState("");
  const [seed, setSeed] = useState(() => String(Math.random()));
  const order = shuffled(themes, seed);

  const startRound = (r) => {
    setRound(r);
    setSeed(String(Math.random()));
    setPhase("play");
    setMatched([]);
    setSelected(null);
    setMessage({ text: "Select a theme to begin.", tone: "" });
  };

  const chooseStatement = (t, el) => {
    if (!selected || matched.includes(t.key)) return;
    if (selected === t.key) {
      const next = [...matched, t.key];
      setMatched(next);
      setSelected(null);
      setMessage({ text: "Connected", tone: "success" });
      confetti(el);
      if (next.length === themes.length) setTimeout(() => setPhase(round === "bring" ? "between" : "summary"), 650);
    } else {
      setWrong([selected, t.key]);
      setMessage({ text: "Not quite. Have another look.", tone: "error" });
      setTimeout(() => {
        setWrong(null);
        setSelected(null);
      }, 420);
    }
  };

  const stepClass = (i) => {
    const cur = phase === "summary" ? 2 : round === "bring" ? 0 : 1;
    return i === cur ? "active" : i < cur ? "done" : "";
  };

  return (
    <div>
      <PageHeader
        eyebrow="Activity"
        title="Connect With Your Themes"
        sub="Match each theme with what it brings and what it needs to be at its best."
      />
      <PrintHeader activity="Connect With Your Themes" title="What my themes bring and need" participant={participant} />

      <div className="steps no-print">
        {["What I Bring", "What I Need", "My Summary"].map((s, i) => (
          <div key={s} className={`step ${stepClass(i)}`}>
            <b>
              {i + 1}. {s}
            </b>
          </div>
        ))}
      </div>

      {phase === "play" && (
        <section className="no-print">
          <div className="section-head">
            <div>
              <h2>{ROUNDS[round].title}</h2>
              <p>The participant chooses each match. Click a theme, then its statement.</p>
            </div>
            <span className="pill">
              {matched.length} of {themes.length} connected
            </span>
          </div>
          <div className={`match-msg ${message.tone}`}>{message.text}</div>
          <div className="match-area">
            <div>
              <div className="label">My themes</div>
              <div className="match-list">
                {themes.map((t) => (
                  <button
                    key={t.key}
                    className={`match theme ${selected === t.key ? "selected" : ""} ${matched.includes(t.key) ? "matched" : ""} ${wrong?.[0] === t.key ? "shake" : ""}`}
                    style={{ "--accent": t.colour }}
                    onClick={() => {
                      if (matched.includes(t.key)) return;
                      setSelected(t.key);
                      setMessage({ text: "Now choose the matching statement.", tone: "" });
                    }}
                  >
                    <TM>{t.name}</TM>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="label">{ROUNDS[round].heading}</div>
              <div className="match-list">
                {order.map((t) => (
                  <button
                    key={t.key}
                    className={`match statement ${matched.includes(t.key) ? "matched" : ""} ${wrong?.[1] === t.key ? "shake" : ""}`}
                    onClick={(e) => chooseStatement(t, e.currentTarget)}
                  >
                    {statement(t.key, round)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {phase === "between" && (
        <section className="panel round-done no-print">
          <h2>{ROUNDS[round].done}</h2>
          <p>{ROUNDS[round].doneCopy}</p>
          <button className="btn primary" onClick={() => startRound("need")}>
            {ROUNDS.bring.next}
          </button>
        </section>
      )}

      <section className={phase === "summary" ? "" : "print-only"}>
        <div className="section-head no-print">
          <div>
            <h2>You’ve connected with your themes.</h2>
            <p>A clearer view of what your themes contribute and what they need to perform at their best.</p>
          </div>
        </div>
        <div className="summary-table">
          <div className="summary-row head">
            <div>Theme</div>
            <div>What I bring</div>
            <div>What I need</div>
          </div>
          {themes.map((t) => (
            <div key={t.key} className="summary-row">
              <div className="summary-theme" style={{ "--accent": t.colour }}>
                <TM>{t.name}</TM>
              </div>
              <div>{statement(t.key, "bring")}</div>
              <div>{statement(t.key, "need")}</div>
            </div>
          ))}
        </div>
        <label className="panel field reflection">
          What stands out to you about what your themes bring and need?
          <textarea
            className="no-print"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Capture the participant’s reflection here..."
          />
          <span className="print-only">{reflection || "Not captured"}</span>
        </label>
        <div className="row-end no-print">
          <button className="btn" onClick={() => startRound("bring")}>
            <RotateCcw size={15} /> Play again
          </button>
          <button className="btn primary" onClick={() => window.print()}>
            <Download size={15} /> Download one-page PDF
          </button>
        </div>
      </section>
    </div>
  );
}

function confetti(el) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = el.getBoundingClientRect();
  for (let i = 0; i < 16; i++) {
    const p = document.createElement("i");
    p.className = "confetti";
    Object.assign(p.style, {
      left: `${r.left + r.width / 2}px`,
      top: `${r.top + r.height / 2}px`,
      background: CONFETTI[i % CONFETTI.length],
    });
    p.style.setProperty("--x", `${(Math.random() - 0.5) * 150}px`);
    p.style.setProperty("--y", `${40 + Math.random() * 100}px`);
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}
