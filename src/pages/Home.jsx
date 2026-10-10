import { useRef, useState } from "react";
import { ArrowRight, ImagePlus, X } from "lucide-react";
import { STRENGTHS } from "@/data/strengths";
import { DOMAIN_COLORS, DOMAIN_LABELS } from "@/data/themeDomains";
import { TM } from "@/lib/themes";
import { getTheme, MAX_THEMES } from "@/lib/themeData";

const DOMAINS = Object.keys(DOMAIN_COLORS);

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
  const toggle = (key) =>
    setSelected((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : prev.length < MAX_THEMES
          ? [...prev, key]
          : prev
    );

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-text">
          <div className="eyebrow">
            Strengths Exploration Hub
          </div>
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
        <LogoUpload logo={logo} setLogo={setLogo} />
      </section>

      <section className="panel picker">
        <div className="section-head">
          <div>
            <div className="step-num">Step 1</div>
            <h2>Choose your themes</h2>
            <p>
              Select up to {MAX_THEMES} themes in the order they appear in your
              report. Activities that work best with five use your top five.
            </p>
          </div>
          <span className="pill">
            {selected.length} of {MAX_THEMES} selected
          </span>
        </div>

        <div className="tray">
          {themes.length === 0 && (
            <span className="tray-empty">Your selected themes appear here.</span>
          )}
          {themes.map((t, i) => (
            <span
              key={t.key}
              className="tray-chip"
              style={{ "--accent": t.colour }}
            >
              <b>{i + 1}</b>
              <TM>{t.name}</TM>
              <button aria-label={`Remove ${t.name}`} onClick={() => toggle(t.key)}>
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

        <div className="domains">
          {DOMAINS.map((d) => (
            <div key={d} className="domain" style={{ "--accent": DOMAIN_COLORS[d] }}>
              <h3>{DOMAIN_LABELS[d]}</h3>
              {STRENGTHS.filter((s) => getTheme(s.key).domain === d).map((s) => {
                const rank = selected.indexOf(s.key);
                const full = rank < 0 && selected.length >= MAX_THEMES;
                return (
                  <button
                    key={s.key}
                    className={`pick ${rank >= 0 ? "on" : ""}`}
                    disabled={full}
                    onClick={() => toggle(s.key)}
                    title={s.blurb}
                  >
                    <TM>{s.name}</TM>
                    {rank >= 0 && <b>{rank + 1}</b>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      <section className="activities">
        <div className="section-head">
          <div>
            <div className="step-num">Step 2</div>
            <h2>Choose an activity</h2>
            <p>Each activity builds a one-page summary to download.</p>
          </div>
        </div>
        <div className="activity-grid">
          {pages
            .filter((p) => p.desc)
            .map(({ id, label, icon: Icon, desc }) => (
              <button key={id} className="activity-card" onClick={() => go(id)}>
                <span className="activity-icon">
                  <Icon size={20} strokeWidth={1.6} />
                </span>
                <h3>{label}</h3>
                <p>{desc}</p>
                <span className="activity-go">
                  {themes.length ? "Start" : "Choose themes first"}{" "}
                  <ArrowRight size={14} />
                </span>
              </button>
            ))}
        </div>
      </section>
    </div>
  );
}

const LOGO_MAX = 480; // px, longest side; keeps the stored image small

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
    try {
      setLogo(await readLogo(file));
      setError("");
    } catch {
      setError("That file could not be read. Try a PNG, JPG or SVG.");
    }
  };

  return (
    <div className="logo-upload">
      <div className="label">Your logo</div>
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
            <span>Upload logo</span>
          </>
        )}
      </button>
      <input ref={input} type="file" accept="image/*" hidden onChange={onFile} />
      <p className="muted">
        {error || (logo ? "Appears top right on every PDF." : "PNG, JPG or SVG. Appears top right on every PDF.")}
      </p>
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
  );
}
