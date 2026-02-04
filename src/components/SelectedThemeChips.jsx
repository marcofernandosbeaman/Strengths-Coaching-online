import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SelectedThemeChips(props) {
  const { title, items, onRemove } = props;
  if (!items.length) return null;
  
  return (
    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-3">
      {title ? (
        <div className="mb-2 text-sm font-semibold">{title}</div>
      ) : null}
      <div className="flex flex-wrap items-start gap-2">
        {items.map((it) => (
          <div
            key={it.key}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-black/10 bg-neutral-100 px-3 py-1 shadow-sm"
          >
            {it.badgeText ? (
              <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold opacity-80">
                {it.badgeText}
              </span>
            ) : null}
            <span className="text-sm font-medium leading-none text-neutral-900">
              {it.label}
            </span>
            {onRemove ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={() => onRemove(it.key)}
                aria-label={`Remove ${it.label}`}
                title="Remove"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
