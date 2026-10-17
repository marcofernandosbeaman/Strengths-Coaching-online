# Graph Report - Strengths-Coaching-online  (2026-10-16)

## Corpus Check
- 30 files · ~16,510 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 180 nodes · 299 edges · 14 communities (11 shown, 1 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9ab88b12`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ConnectThemes.jsx
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
- `App()` --calls--> `validCount()`  [EXTRACTED]
  src/App.jsx → src/lib/themeData.js
- `BalconiesBasements()` --calls--> `printPdf()`  [EXTRACTED]
  src/pages/BalconiesBasements.jsx → src/lib/print.js
- `Communication()` --calls--> `printPdf()`  [EXTRACTED]
  src/pages/Communication.jsx → src/lib/print.js
- `SoundDesk()` --calls--> `printPdf()`  [EXTRACTED]
  src/pages/SoundDesk.jsx → src/lib/print.js

## Import Cycles
- None detected.

## Communities (14 total, 1 thin omitted)

### Community 0 - "ConnectThemes.jsx"
Cohesion: 0.17
Nodes (20): lucide-react, printPdf(), listJoin(), PageHeader(), PrintHeader(), ThemeChip(), TM(), CONFETTI (+12 more)

### Community 1 - "package.json"
Cohesion: 0.08
Nodes (27): name, private, type, version, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks (+19 more)

### Community 3 - "Communication.jsx"
Cohesion: 0.20
Nodes (8): COMMUNICATION_STYLES, blank(), Communication(), FIELD, FIELD_LABEL, HINTS, PLACEHOLDERS, SCENARIOS

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
Nodes (12): STRENGTHS, DOMAIN_COLORS, DOMAIN_LABELS, THEME_TO_DOMAIN, BY_KEY, MAX_THEMES, validCount(), Home() (+4 more)

### Community 10 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 11 - "App.jsx"
Cohesion: 0.17
Nodes (10): react, @supabase/supabase-js, App(), PAGES, AuthGate(), useLocalStorage(), authEnabled, signOut() (+2 more)

### Community 12 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

### Community 13 - "SoundDesk.jsx"
Cohesion: 0.12
Nodes (12): BALCONY_BASEMENT, THEME_DESCRIPTIONS, BalconiesBasements(), blankRow, COACHING, explored(), QUESTIONS, blankDraft (+4 more)

## Knowledge Gaps
- **81 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+76 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 102 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.jsx` to `ConnectThemes.jsx`, `package.json`, `Communication.jsx`, `Home.jsx`, `SoundDesk.jsx`?**
  _High betweenness centrality (0.238) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `ConnectThemes.jsx` to `package.json`, `Communication.jsx`, `Home.jsx`, `App.jsx`, `SoundDesk.jsx`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _81 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07816091954022988 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `SoundDesk.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11688311688311688 - nodes in this community are weakly interconnected._