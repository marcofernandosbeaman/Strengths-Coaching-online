// Theme name with a small registered-trademark mark.
export function TM({ children }) {
  return (
    <>
      {children}
      <span className="mark">®</span>
    </>
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
export function PrintHeader({ activity, title, participant }) {
  return (
    <div className="print-only print-head">
      <div className="eyebrow">{activity}</div>
      <h1>{title}</h1>
      <p>
        {participant ? `${participant} · ` : ""}A strengths-based summary from
        the coaching conversation.
      </p>
    </div>
  );
}
