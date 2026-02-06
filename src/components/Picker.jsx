import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { STRENGTHS } from "@/data/strengths";
import { withTrademark } from "@/lib/withTrademark";

export function Picker({ selected, onToggle, max = 5 }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => STRENGTHS.filter((s) => s.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );
  const isSelected = (k) => selected.includes(k);
  const canAddMore = selected.length < max;

  return (
    <Card className="rounded-2xl border-neutral-200">
      <CardContent className="space-y-3 pt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Search strengths"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
          {filtered.map((s) => {
            const selectedNow = isSelected(s.key);
            const disabled = !selectedNow && !canAddMore;
            return (
              <button
                key={s.key}
                onClick={() => onToggle(s.key)}
                disabled={disabled}
                className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-left transition active:scale-[.99] min-h-[42px] ${
                  selectedNow
                    ? "border-neutral-800 bg-neutral-900 text-white"
                    : "border-neutral-200 hover:bg-neutral-50"
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Checkbox checked={selectedNow} className={selectedNow ? "border-white shrink-0 mt-0.5" : "shrink-0 mt-0.5"} />
                <span className="text-sm leading-snug break-words">{withTrademark(s.name)}</span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          {selected.map((k) => {
            const s = STRENGTHS.find((x) => x.key === k);
            if (!s) return null;
            return (
              <Badge key={k} className="rounded-full px-3 py-1 text-xs" variant="secondary">
                {withTrademark(s.name)}
              </Badge>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

