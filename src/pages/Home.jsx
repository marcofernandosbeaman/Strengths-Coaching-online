import { ArrowRight, X } from "lucide-react";
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
        <div className="eyebrow">
          <TM>CliftonStrengths</TM> Exploration Hub
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
