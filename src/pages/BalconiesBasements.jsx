import { useState } from "react";
import { Download, Sun, CloudRain } from "lucide-react";
import { BALCONY_BASEMENT } from "@/data/balconyBasement";
import { INVESTMENT_GUIDES } from "@/data/investmentGuides";
import { PageHeader, PrintHeader, TM } from "@/lib/themes";

const PLACES = ["Balcony", "In between", "Basement"];

export default function BalconiesBasements({ themes, participant }) {
  const [rows, setRows] = useState({});
  const row = (k) => rows[k] ?? { place: "", note: "" };
  const set = (k, patch) => setRows((r) => ({ ...r, [k]: { ...row(k), ...patch } }));

  return (
    <div>
      <PageHeader
        eyebrow="Activity"
        title="Balconies & Basements"
        sub="Every theme has a balcony, its mature and energising expression, and a basement, the overused or reactive version. The goal is not to fix basements, but to notice, name and lift."
      >
        <button className="btn primary" onClick={() => window.print()}>
          <Download size={15} /> Download PDF
        </button>
      </PageHeader>
      <PrintHeader activity="Balconies & Basements" title="Where my themes are today" participant={participant} />

      <div className="bb-list">
        {themes.map((t) => {
          const bb = BALCONY_BASEMENT[t.key];
          const r = row(t.key);
          return (
            <article key={t.key} className="card bb" style={{ "--accent": t.colour }}>
              <div className="bb-head">
                <h3>
                  <TM>{t.name}</TM>
                </h3>
                <div className="segmented" role="radiogroup" aria-label="Where is it today?">
                  {PLACES.map((p) => (
                    <button
                      key={p}
                      role="radio"
                      aria-checked={r.place === p}
                      className={r.place === p ? "on" : ""}
                      onClick={() => set(t.key, { place: r.place === p ? "" : p })}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
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
              <label className="field">
                What signals the slide, and what lifts it back to the balcony?
                <textarea
                  className="no-print"
                  value={r.note}
                  placeholder={INVESTMENT_GUIDES[t.key]?.[0]}
                  onChange={(e) => set(t.key, { note: e.target.value })}
                />
                <span className="print-only">{r.note || "Not captured"}</span>
              </label>
            </article>
          );
        })}
      </div>
    </div>
  );
}
