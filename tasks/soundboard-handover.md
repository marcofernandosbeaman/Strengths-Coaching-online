# Soundboard Updates – Developer Handover

This document contains all agreed changes, instructions, and code for the Soundboard project.
It is written for direct use in GitHub as a handover reference.

---

## Overview of changes

- Consistent theme selection UI across Soundboard, Dominant Themes, and Balconies & Basements
- No overlapping theme labels
- Added ® symbol to all theme labels
- Larger Dominant Themes wheel so all labels fit on one line
- Two-theme exploration with Coach notes and Client explore modes
- Session-only notes with PDF export

---

## Global design decisions

- All theme selection displays use wrapping chips
- Chips have a light grey background (not white-on-white)
- Notes are session-only for confidentiality
- PDF export includes wheel, explored pairs, and notes

---

## Files to add

/components/SelectedThemeChips.tsx  
/lib/withTrademark.ts  
/data/theme-traits.json  
/docs/soundboard-handover.md  

---

## Files to update

/components/DominantThemesTab.tsx  
/components/BalconiesBasementsTab.tsx  
/components/SoundboardTab.tsx  
/components/StrengthsCommunicationTab.tsx  

---

## Reusable selection chips component

File: /components/SelectedThemeChips.tsx

```tsx
"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Chip = {
  key: string;
  label: string;
  badgeText?: string;
};

export function SelectedThemeChips(props: {
  title?: string;
  items: Chip[];
  onRemove?: (key: string) => void;
}) {
  const { title, items, onRemove } = props;

  if (!items.length) return null;

  return (
    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-3">
      {title && <div className="mb-2 text-sm font-semibold">{title}</div>}

      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <div
            key={it.key}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-neutral-100 px-3 py-1 shadow-sm"
          >
            {it.badgeText && (
              <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold">
                {it.badgeText}
              </span>
            )}

            <span className="text-sm font-medium">{it.label}</span>

            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onRemove(it.key)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Trademark helper

File: /lib/withTrademark.ts

```ts
export const withTrademark = (name: string) => `${name}®`;
```

---

## PDF export dependencies

```bash
npm i jspdf html-to-image
```

---

## Testing checklist

- No overlapping theme labels
- Chips wrap correctly
- ® appears on all theme labels
- Wheel labels fit on one line
- Notes clear on refresh
- PDF downloads successfully

---

## Suggested GitHub usage (recommended)

To keep intent and decisions clear over time, we recommend:

- Link this document in any related Pull Request description, for example:
  > “Implementation guided by `/docs/soundboard-handover.md`”
- Optionally reference it in the main README under a Development or Docs section:
  > “See `/docs/soundboard-handover.md` for Dominant Themes and Balconies & Basements design and behaviour decisions.”

This ensures future contributors understand **why** the UI behaves as it does, not just how.

---

## Small suggestion (recommended)

To keep intent clear over time (and make PR reviews easier), please do both:

1. **Link this handover in every related PR description**, for example:

   - “Implementation notes: see `/docs/soundboard-handover.md`”

2. **Reference this handover from your README** (or a docs index), for example:

   - “For feature implementation details and UI rules, see `/docs/soundboard-handover.md`.”

This helps future changes stay consistent with the agreed design, even months later.

