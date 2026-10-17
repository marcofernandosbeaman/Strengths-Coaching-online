import { useState } from "react";
import { Download, Check } from "lucide-react";
import { PageHeader, PrintHeader, ThemeChip, TM } from "@/lib/themes";
import { printPdf } from "@/lib/print";

const MAX_PICK = 5;
const C = 236; // wheel centre in the 472 viewBox
const polar = (r, a) => ({
  x: C + r * Math.cos(((a - 90) * Math.PI) / 180),
  y: C + r * Math.sin(((a - 90) * Math.PI) / 180),
});
const wedge = (s, e) => {
  const [a, b, c, d] = [polar(218, s), polar(218, e), polar(86, e), polar(86, s)];
  const big = e - s > 180 ? 1 : 0;
  return `M ${a.x} ${a.y} A 218 218 0 ${big} 1 ${b.x} ${b.y} L ${c.x} ${c.y} A 86 86 0 ${big} 0 ${d.x} ${d.y} Z`;
};
const crust = (s, e) => {
  const [a, b] = [polar(218, s + 1.2), polar(218, e - 1.2)];
  return `M ${a.x} ${a.y} A 218 218 0 0 1 ${b.x} ${b.y}`;
};

const blank = { notice: "", possible: "", name: "" };

<<<<<<< HEAD
export default function ThemeDynamics({ themes: allThemes, participant }) {
  const [size, setSize] = useState(10); // Top 5 or Top 10 wheel; only offered with more than five themes
  const themes = allThemes.slice(0, allThemes.length > 5 ? size : 5);
=======
export default function ThemeDynamics({ themes, participant }) {
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
  const [picked, setPicked] = useState([]);
  const [form, setForm] = useState(blank);
  const [packages, setPackages] = useState([]);
  const [reminder, setReminder] = useState(null);
  const [saved, setSaved] = useState(false);
  const field = (k) => ({
    value: form[k],
    onChange: (e) => setForm((f) => ({ ...f, [k]: e.target.value })),
  });

  const pickedThemes = themes.filter((t) => picked.includes(t.key)); // drops picks outside a Top 5 wheel
  const toggle = (k) => {
    setSaved(false);
    setPicked((p) =>
      p.includes(k) ? p.filter((x) => x !== k) : p.length < MAX_PICK ? [...p, k] : p
    );
  };

  const save = () => {
    if (!pickedThemes.length || !form.name.trim() || !form.possible.trim()) {
      alert("Select at least one theme, name the package and capture what becomes possible.");
      return;
    }
    setPackages((p) => [...p, { ...form, themes: pickedThemes }]);
    setPicked([]);
    setForm(blank);
    setSaved(true);
  };

  return (
    <div className="theme-dynamics">
      <PageHeader
        eyebrow="Activity"
        title="Theme Dynamics"
        sub="Explore how your themes work together, complement one another and contribute to success."
      />
      <PrintHeader activity="Theme Dynamics" title="My explored theme packages" participant={participant} />

<<<<<<< HEAD
      {themes.length >= 2 && (
        <div className="print-only print-wheel">
          <Wheel themes={themes} picked={[]}>
            <b>Theme package</b>
            <span>Top {themes.length}</span>
          </Wheel>
        </div>
      )}

=======
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
      <section className="split no-print">
        <article className="panel">
          <div className="section-head">
            <div>
              <h2>Your theme package</h2>
              <p>Select up to five slices. Double-click a slice for a short reminder.</p>
            </div>
            <div className="wheel-tools">
              {allThemes.length > 5 && (
                <div className="segmented" role="radiogroup" aria-label="Wheel size">
                  {[5, 10].map((n) => (
                    <button
                      key={n}
                      role="radio"
                      aria-checked={size === n}
                      className={size === n ? "on" : ""}
                      onClick={() => setSize(n)}
                    >
                      Top {n}
                    </button>
                  ))}
                </div>
              )}
              <span className="pill">
                {pickedThemes.length} of {MAX_PICK} selected
              </span>
            </div>
          </div>
          {themes.length < 2 ? (
            <p className="muted">Choose at least two themes on Home to use the wheel.</p>
          ) : (
            <div className="wheel-wrap">
              <Wheel themes={themes} picked={picked} onToggle={toggle} onInfo={setReminder}>
<<<<<<< HEAD
                <b>{pickedThemes.length ? "Theme package" : "Your themes"}</b>
                <span>
                  {pickedThemes.length
                    ? `${pickedThemes.length} selected`
=======
                <b>{picked.length ? "Theme package" : "Your themes"}</b>
                <span>
                  {picked.length
                    ? `${picked.length} selected`
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
                    : "Select themes to explore how they work together."}
                </span>
              </Wheel>
            </div>
          )}
          <div className="hint">
            {reminder ? (
              <>
                <b>
                  <TM>{reminder.name}</TM>
                </b>{" "}
                {reminder.blurb}
              </>
            ) : (
              <>
                <b>Theme reminder:</b> double-click any theme to see its brief
                description.
              </>
            )}
          </div>
        </article>

        <aside className="panel">
          <h2>Explore the combination</h2>
          <p className="muted">Coaching questions appear once themes are selected.</p>
          {picked.length === 0 ? (
            <div className="dashed">Select themes from the wheel to explore them as a package.</div>
          ) : (
            <div className="form">
              <div className="chips">
                {pickedThemes.map((t) => (
                  <ThemeChip key={t.key} theme={t} />
                ))}
              </div>
              <label>
                What do you notice about these themes as a package?
                <textarea {...field("notice")} />
              </label>
              <label>
                What becomes possible when they work together?
                <textarea {...field("possible")} />
              </label>
              <label>
                What would you call this package?
                <input {...field("name")} placeholder="Example: Ideas Into Impact" />
              </label>
              <div className="row-end">
                <button
                  className="btn"
                  onClick={() => {
                    setPicked([]);
                    setForm(blank);
                  }}
                >
                  Reset
                </button>
                <button className="btn primary" onClick={save}>
                  Save theme package
                </button>
              </div>
            </div>
          )}
          {saved && (
            <div className="status">
              <Check size={14} /> Package saved. Explore another combination.
            </div>
          )}
        </aside>
      </section>

      <section className="saved-packages">
        <h2 className="no-print">Saved theme packages</h2>
        {packages.length === 0 ? (
          <div className="dashed no-print">No theme packages saved yet.</div>
        ) : (
          <div className="package-list">
            {packages.map((p, i) => (
              <article
                key={i}
                className="card package"
                style={{
                  "--bar": `linear-gradient(90deg, ${p.themes.map((t) => t.colour).join(", ")}${p.themes.length === 1 ? `, ${p.themes[0].colour}` : ""})`,
                }}
              >
                <Wheel themes={themes} picked={p.themes.map((t) => t.key)} mini />
                <h3>{p.name}</h3>
                <div className="combo">
                  {p.themes.map((t, j) => (
                    <span key={t.key}>
                      {j > 0 && " • "}
                      <TM>{t.name}</TM>
                    </span>
                  ))}
                </div>
                <div className="label">What I notice</div>
                <p>{p.notice || "Not captured"}</p>
                <div className="label">What becomes possible</div>
                <p>{p.possible}</p>
              </article>
            ))}
          </div>
        )}
        {packages.length > 0 && (
          <div className="download-bar no-print">
            <p>Download all saved theme packages as a one-page summary.</p>
<<<<<<< HEAD
            <button className="btn primary" onClick={() => printPdf(participant, "Theme Dynamics")}>
=======
            <button className="btn primary" onClick={() => window.print()}>
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
              <Download size={15} /> Download session PDF
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

<<<<<<< HEAD
// Theme wheel: coloured outer edge on every slice, white centre circle drawn in the SVG so it
// stays exactly centred at any size or zoom; the HTML label sits inside the same square.
function Wheel({ themes, picked, onToggle, onInfo, children }) {
  const span = 360 / Math.max(themes.length, 1);
  return (
    <div className={`wheel ${themes.length > 6 ? "dense" : ""}`}>
=======
// Interactive theme wheel; `mini` renders a static snapshot of a saved package (used on cards and in the PDF).
function Wheel({ themes, picked, onToggle, onInfo, mini, children }) {
  const span = 360 / Math.max(themes.length, 1);
  return (
    <div className={`wheel ${themes.length > 6 ? "dense" : ""} ${mini ? "mini" : ""}`} aria-hidden={mini || undefined}>
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
      <svg viewBox="0 0 472 472">
        {themes.map((t, i) => {
          const s = i * span;
          const p = polar(152, s + span / 2);
          return (
            <g
              key={t.key}
              className={`slice ${picked.includes(t.key) ? "selected" : ""}`}
              onClick={onToggle && (() => onToggle(t.key))}
              onDoubleClick={onInfo && (() => onInfo(t))}
            >
              <path className="wedge" d={wedge(s, s + span)} />
              <path className="crust" d={crust(s, s + span)} stroke={t.colour} />
              <text x={p.x} y={p.y + 4}>
                {t.name}®
              </text>
            </g>
          );
        })}
<<<<<<< HEAD
        <circle className="hub" cx={C} cy={C} r={80} />
      </svg>
      <div className="wheel-centre">{children}</div>
=======
      </svg>
      {!mini && <div className="wheel-centre">{children}</div>}
>>>>>>> b68bc504439f9419961c190acd5a30e4ba42cfa9
    </div>
  );
}
