// Theme name with a small registered-trademark mark.
export function TM({ children }) {
  return (
    <>
      {children}
      <span className="mark">®</span>
    </>
  );
}

// Segmented 1–10 scale used by every activity: dots up to the chosen value are filled.
// value 0 means not rated yet.
export function DotScale({ value, onChange, labelledBy, low, high }) {
  return (
    <div className="dot-scale">
      <div className="dots" role="radiogroup" aria-labelledby={labelledBy}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} out of 10`}
            className={n <= value ? "on" : ""}
            onClick={() => onChange(n)}
          />
        ))}
      </div>
      <b>{value ? `${value}/10` : "–/10"}</b>
      {low && (
        <small className="dot-ends">
          <span>{low}</span>
          <span>{high}</span>
        </small>
      )}
    </div>
  );
}

export function ThemeChip({ theme, children }) {
  return (
    <span className="chip" style={{ "--accent": theme.colour }}>
      <TM>{theme.name}</TM>
      {children}
    </span>
  );
}

export function PageHeader({ eyebrow, title, sub, children }) {
  return (
    <header className="page-head">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {children && <div className="page-head-actions no-print">{children}</div>}
    </header>
  );
}

// Header shown only on printed one-page PDFs.
export function PrintHeader({ activity, title, participant, intro }) {
  return (
    <>
      <div className="print-only print-head">
        <div className="print-brand">Strengths Exploration Hub</div>
        <div className="eyebrow">{activity}</div>
        <h1>{title}</h1>
        {participant && !intro && <p className="print-name">{participant}</p>}
        {!intro && <p>A strengths-based summary from the coaching conversation.</p>}
      </div>
      {/* Outside .print-head so the tile spans the full width, like the bottom reflection tile. */}
      {intro && (
        <div className="print-only panel print-intro-tile">
          {participant && <p className="print-name">{participant},</p>}
          <p>{intro}</p>
        </div>
      )}
    </>
  );
}
