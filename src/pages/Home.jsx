import { useRef, useState } from "react";
import { ArrowRight, ImagePlus, Info, Search, X } from "lucide-react";
import { STRENGTHS } from "@/data/strengths";
import { TM } from "@/lib/themes";
import { MAX_THEMES, validCount } from "@/lib/themeData";

const WHY = [
  {
    title: "Donald Clifton",
    quote: "“What would happen if we studied what is right with people instead of what’s wrong with people?”",
    by: "Donald O. Clifton",
    role: "Founder of Strengths Psychology",
    colour: "#5b806e",
  },
  {
    title: "You Are Unique",
    stat: "1 in 33.3 million",
    text: "The chance of someone sharing your exact Top 5 strengths in the same order.",
    tag: "Your strengths profile is uniquely yours.",
    colour: "#8f3fb0",
  },
  {
    title: "More Engaged",
    stat: "6×",
    unit: "more likely",
    text: "People who use their strengths every day are six times more likely to be engaged at work.",
    tag: "Strengths drive engagement and performance.",
    colour: "#f36c21",
  },
  {
    title: "Better Quality of Life",
    stat: "3×",
    unit: "more likely",
    text: "People who focus on and use their strengths daily are three times more likely to report an excellent quality of life.",
    tag: "Play to your strengths, not just performance.",
    colour: "#1678c8",
  },
];

export default function Home({
  themes,
  selected,
  setSelected,
  participant,
  setParticipant,
  logo,
  setLogo,
  go,
  pages,
}) {
  const n = selected.length;
  const ok = validCount(n);
  const firstActivity = pages.find((p) => p.desc)?.id;

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-text">
          <div className="eyebrow">Strengths Exploration Hub</div>
          <h1>Let’s explore your strengths.</h1>
          <p>
            Choose your themes once, then move freely between activities that help
            you understand, apply and talk about what makes you strong.
          </p>
          <label className="name-field">
            <span>Participant name</span>
            <input
              value={participant}
              onChange={(e) => setParticipant(e.target.value)}
              placeholder="Optional, appears on downloads"
            />
          </label>
        </div>

        <div className="select-row">
          <div className="select-box">
            <h2>Select your themes</h2>
            <p className="muted">
              Choose 1 theme, or 5 to {MAX_THEMES} themes in the order they appear in your report.
            </p>
            <ThemeSearch selected={selected} setSelected={setSelected} />
          </div>

          {/* Separate box so the selection stays visible while the dropdown is open. */}
          <div className="select-box selected-box">
            <h2>Your selected themes</h2>
            <div className="tray">
              {themes.length === 0 && (
                <span className="tray-empty">
                  <Info size={14} /> No themes selected yet.
                </span>
              )}
              {themes.map((t, i) => (
                <span key={t.key} className="tray-chip" style={{ "--accent": t.colour }}>
                  <b>{i + 1}</b>
                  <TM>{t.name}</TM>
                  <button
                    aria-label={`Remove ${t.name}`}
                    onClick={() => setSelected((p) => p.filter((k) => k !== t.key))}
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
              {themes.length > 0 && (
                <button className="link" onClick={() => setSelected([])}>
                  Clear all
                </button>
              )}
            </div>
            <div className="select-foot">
              <span className={`select-count ${n && !ok ? "warn" : ""}`} aria-live="polite">
                {n === 0
                  ? `0 of ${MAX_THEMES} selected`
                  : ok
                    ? `${n} selected, ready to explore`
                    : `${n} selected. Choose 1 theme, or 5 to ${MAX_THEMES}.`}
              </span>
              <button className="btn primary" disabled={!ok} onClick={() => go(firstActivity)}>
                Start exploring <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <LogoUpload logo={logo} setLogo={setLogo} />

      <section className="panel why">
        <h2>Why Strengths Matter</h2>
        <p className="muted">A few powerful insights to inspire your strengths journey.</p>
        <div className="why-grid">
          {WHY.map((c) => (
            <article key={c.title} className="card why-card" style={{ "--accent": c.colour }}>
              <div className="rule-accent" />
              <h3>{c.title}</h3>
              {c.quote ? (
                <>
                  <p className="why-quote">{c.quote}</p>
                  <p className="why-by">
                    <b>{c.by}</b>
                    {c.role}
                  </p>
                </>
              ) : (
                <>
                  <p className="why-stat">{c.stat}</p>
                  {c.unit && <p className="why-unit">{c.unit}</p>}
                  <p className="why-text">{c.text}</p>
                  <p className="why-tag">{c.tag}</p>
                </>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

// Searchable list of all 34 themes; picking one appends it in report order.
function ThemeSearch({ selected, setSelected }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const full = selected.length >= MAX_THEMES;
  const matches = STRENGTHS.filter(
    (s) => !selected.includes(s.key) && s.name.toLowerCase().includes(q.trim().toLowerCase())
  );

  const add = (key) => {
    if (full) return;
    setSelected((p) => [...p, key]);
    setQ("");
  };

  return (
    <div
      className="theme-search"
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
    >
      <Search size={15} />
      <input
        role="combobox"
        aria-expanded={open}
        aria-controls="theme-options"
        value={q}
        disabled={full}
        placeholder={full ? `${MAX_THEMES} themes selected` : "Search or select a CliftonStrengths theme…"}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && matches[0]) add(matches[0].key);
          if (e.key === "Escape") setOpen(false);
        }}
      />
      {open && !full && (
        <ul id="theme-options" role="listbox">
          {matches.map((s) => (
            <li key={s.key}>
              <button
                type="button"
                role="option"
                aria-selected={false}
                onMouseDown={(e) => e.preventDefault()} // keep focus in the input so the list stays open
                onClick={() => add(s.key)}
              >
                <TM>{s.name}</TM>
              </button>
            </li>
          ))}
          {!matches.length && <li className="muted">No matching themes.</li>}
        </ul>
      )}
    </div>
  );
}

const LOGO_MAX = 480; // px, longest side; keeps the stored image small
const LOGO_TYPES = ["image/png", "image/jpeg"];

// Shrink an image file to a PNG data URL so it fits in browser storage.
function readLogo(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, LOGO_MAX / Math.max(img.naturalWidth || LOGO_MAX, img.naturalHeight || LOGO_MAX));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round((img.naturalWidth || LOGO_MAX) * scale);
      canvas.height = Math.round((img.naturalHeight || LOGO_MAX) * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("unreadable"));
    };
    img.src = url;
  });
}

function LogoUpload({ logo, setLogo }) {
  const input = useRef(null);
  const [error, setError] = useState("");

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!LOGO_TYPES.includes(file.type)) {
      setError("Please choose a JPEG or PNG file.");
      return;
    }
    try {
      setLogo(await readLogo(file));
      setError("");
    } catch {
      setError("That file could not be read. Please try another JPEG or PNG.");
    }
  };

  return (
    <section className="panel logo-upload">
      <div>
        <h2>Your image or logo</h2>
        <p className="muted">
          Upload a JPEG or PNG. It appears top right on your PDF downloads and is kept for your next visit.
        </p>
        {error && <p className="logo-error">{error}</p>}
        {logo && (
          <div className="logo-actions">
            <button type="button" className="link" onClick={() => input.current.click()}>
              Replace
            </button>
            <button type="button" className="link" onClick={() => setLogo("")}>
              Remove
            </button>
          </div>
        )}
      </div>
      <button
        type="button"
        className={`logo-drop ${logo ? "has-logo" : ""}`}
        onClick={() => input.current.click()}
      >
        {logo ? (
          <img src={logo} alt="Uploaded logo" />
        ) : (
          <>
            <ImagePlus size={22} strokeWidth={1.6} />
            <span>Upload image or logo</span>
            <small>JPEG or PNG</small>
          </>
        )}
      </button>
      <input ref={input} type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg" hidden onChange={onFile} />
    </section>
  );
}
