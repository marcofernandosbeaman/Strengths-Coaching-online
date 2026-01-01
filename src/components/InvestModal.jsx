import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getStrengthColor } from "@/utils/strengthUtils";
import { INVESTMENT_GUIDES } from "@/data/investmentGuides";

export function InvestModal({ open, onClose, items }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl border border-neutral-200">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">Invest in Your Selected Strengths</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="max-h-[70vh] overflow-auto p-5 space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-neutral-600">Select up to five strengths to see practical ways to invest in them.</p>
          ) : (
            items.map((s) => (
              <Card key={s.key} className="rounded-2xl border-neutral-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-1 h-3 w-3 rounded-full" style={{ background: getStrengthColor(s.key) }} />
                    <div className="flex-1">
                      <div className="font-semibold">{s.name}</div>
                      {INVESTMENT_GUIDES[s.key]?.length ? (
                        <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                          {INVESTMENT_GUIDES[s.key].map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-neutral-600">Coming soon. Specific investment ideas for this theme will be added next.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        <div className="px-5 py-4 border-t flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={onClose} className="rounded-2xl">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

