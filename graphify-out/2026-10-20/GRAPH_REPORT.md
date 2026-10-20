# Graph Report - Strengths-Coaching-online  (2026-10-20)

## Corpus Check
- 30 files · ~16,750 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 181 nodes · 303 edges · 15 communities (12 shown, 1 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `47cd02a7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- BalconiesBasements.jsx
- package.json
- Communication.jsx
- devDependencies
- dependencies
- Soundboard Updates – Developer Handover
- Home.jsx
- investmentGuides.js
- React + Vite
- App.jsx
- scripts
- SoundDesk.jsx
- ThemeDynamics.jsx

## God Nodes (most connected - your core abstractions)
1. `printPdf()` - 13 edges
2. `react` - 12 edges
3. `Soundboard Updates – Developer Handover` - 11 edges
4. `lucide-react` - 9 edges
5. `TM()` - 9 edges
6. `PageHeader()` - 7 edges
7. `PrintHeader()` - 7 edges
8. `scripts` - 5 edges
9. `App()` - 5 edges
10. `validCount()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `App()` --indirect_call--> `getTheme()`  [INFERRED]
  src/App.jsx → src/lib/themeData.js
- `Communication()` --calls--> `printPdf()`  [EXTRACTED]
  src/pages/Communication.jsx → src/lib/print.js
- `SoundDesk()` --calls--> `printPdf()`  [EXTRACTED]
  src/pages/SoundDesk.jsx → src/lib/print.js
- `App()` --calls--> `useLocalStorage()`  [EXTRACTED]
  src/App.jsx → src/hooks/useLocalStorage.js
- `App()` --calls--> `validCount()`  [EXTRACTED]
  src/App.jsx → src/lib/themeData.js

## Import Cycles
- None detected.

## Communities (15 total, 1 thin omitted)

### Community 0 - "BalconiesBasements.jsx"
Cohesion: 0.15
Nodes (19): printPdf(), listJoin(), DotScale(), PageHeader(), PrintHeader(), TM(), BalconiesBasements(), blankRow (+11 more)

### Community 1 - "package.json"
Cohesion: 0.08
Nodes (27): name, private, type, version, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks (+19 more)

### Community 3 - "Communication.jsx"
Cohesion: 0.18
Nodes (9): COMMUNICATION_STYLES, ThemeChip(), blank(), Communication(), FIELD, FIELD_LABEL, HINTS, PLACEHOLDERS (+1 more)

### Community 4 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, postcss (+6 more)

### Community 5 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, framer-motion, html-to-image, jspdf, lucide-react, @radix-ui/react-dialog, @radix-ui/react-select, @radix-ui/react-switch (+5 more)

### Community 6 - "Soundboard Updates – Developer Handover"
Cohesion: 0.17
Nodes (11): Files to add, Files to update, Global design decisions, Overview of changes, PDF export dependencies, Reusable selection chips component, Small suggestion (recommended), Soundboard Updates – Developer Handover (+3 more)

### Community 7 - "Home.jsx"
Cohesion: 0.18
Nodes (11): lucide-react, STRENGTHS, DOMAIN_COLORS, DOMAIN_LABELS, THEME_TO_DOMAIN, BY_KEY, MAX_THEMES, LOGO_TYPES (+3 more)

### Community 10 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 11 - "App.jsx"
Cohesion: 0.16
Nodes (12): react, @supabase/supabase-js, App(), PAGES, AuthGate(), useLocalStorage(), authEnabled, signOut() (+4 more)

### Community 12 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

### Community 13 - "SoundDesk.jsx"
Cohesion: 0.19
Nodes (7): BALCONY_BASEMENT, THEME_DESCRIPTIONS, blankDraft, clamp(), draftFrom(), QUESTIONS, SoundDesk()

### Community 14 - "ThemeDynamics.jsx"
Cohesion: 0.67
Nodes (5): blank, crust(), polar(), wedge(), Wheel()

## Knowledge Gaps
- **81 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+76 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 102 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.jsx` to `BalconiesBasements.jsx`, `package.json`, `Communication.jsx`, `Home.jsx`, `SoundDesk.jsx`, `ThemeDynamics.jsx`?**
  _High betweenness centrality (0.238) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `Home.jsx` to `BalconiesBasements.jsx`, `package.json`, `Communication.jsx`, `App.jsx`, `SoundDesk.jsx`, `ThemeDynamics.jsx`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _81 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `BalconiesBasements.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1452991452991453 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07816091954022988 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._