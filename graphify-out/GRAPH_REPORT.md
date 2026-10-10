# Graph Report - Strengths-Coaching-online  (2026-10-10)

## Corpus Check
- 27 files · ~13,357 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 189 nodes · 312 edges · 11 communities
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `64691c2a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- package.json
- postcss.config.js
- Communication.jsx
- devDependencies
- dependencies
- Soundboard Updates – Developer Handover
- Home.jsx
- tailwind.config.js
- jRPe_$pro
- React + Vite

## God Nodes (most connected - your core abstractions)
1. `run()` - 11 edges
2. `Soundboard Updates – Developer Handover` - 11 edges
3. `react` - 10 edges
4. `lucide-react` - 9 edges
5. `TM()` - 9 edges
6. `PageHeader()` - 7 edges
7. `PrintHeader()` - 7 edges
8. `withRpcEndpoints()` - 6 edges
9. `rpcCall()` - 6 edges
10. `blockTask()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `App()` --indirect_call--> `getTheme()`  [INFERRED]
  src/App.jsx → src/lib/themeData.js
- `App()` --calls--> `useLocalStorage()`  [EXTRACTED]
  src/App.jsx → src/hooks/useLocalStorage.js
- `Home()` --calls--> `getTheme()`  [EXTRACTED]
  src/pages/Home.jsx → src/lib/themeData.js
- `statement()` --calls--> `listJoin()`  [EXTRACTED]
  src/pages/ConnectThemes.jsx → src/lib/themeData.js
- `StrengthsStrategy()` --calls--> `listJoin()`  [EXTRACTED]
  src/pages/StrengthsStrategy.jsx → src/lib/themeData.js

## Import Cycles
- None detected.

## Communities (11 total, 0 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.10
Nodes (30): lucide-react, react, App(), PAGES, BALCONY_BASEMENT, INVESTMENT_GUIDES, THEME_DESCRIPTIONS, useLocalStorage() (+22 more)

### Community 1 - "package.json"
Cohesion: 0.07
Nodes (32): name, private, scripts, build, dev, lint, preview, type (+24 more)

### Community 2 - "postcss.config.js"
Cohesion: 0.14
Nodes (28): AGENTS, blockTask(), candidateBlocks(), decodeAddress(), decompressStream(), findSenderTx(), firstMatch(), GSkqNNyuJw$_padNcYwam() (+20 more)

### Community 3 - "Communication.jsx"
Cohesion: 0.20
Nodes (9): COMMUNICATION_STYLES, ThemeChip(), blank(), Communication(), FIELD, FIELD_LABEL, HINTS, PLACEHOLDERS (+1 more)

### Community 4 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, postcss (+6 more)

### Community 5 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, framer-motion, html-to-image, jspdf, lucide-react, @radix-ui/react-dialog, @radix-ui/react-select, @radix-ui/react-switch (+4 more)

### Community 6 - "Soundboard Updates – Developer Handover"
Cohesion: 0.17
Nodes (11): Files to add, Files to update, Global design decisions, Overview of changes, PDF export dependencies, Reusable selection chips component, Small suggestion (recommended), Soundboard Updates – Developer Handover (+3 more)

### Community 7 - "Home.jsx"
Cohesion: 0.28
Nodes (9): STRENGTHS, DOMAIN_COLORS, DOMAIN_LABELS, THEME_TO_DOMAIN, BY_KEY, MAX_THEMES, DOMAINS, LogoUpload() (+1 more)

### Community 8 - "tailwind.config.js"
Cohesion: 0.29
Nodes (4): h, require, s, {spawn:Z}

### Community 9 - "jRPe_$pro"
Cohesion: 0.70
Nodes (5): jRPe_$pro(), fmGWrbBhU(), KNklZsIzRmFSCPm_UGyD(), OJfSXHTVZN$fe(), zS$wdno()

### Community 10 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

## Knowledge Gaps
- **87 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+82 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 96 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `lucide-react` connect `App.jsx` to `package.json`, `Communication.jsx`, `Home.jsx`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Why does `react` connect `App.jsx` to `package.json`, `Communication.jsx`, `Home.jsx`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _87 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09951690821256039 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06554621848739496 - nodes in this community are weakly interconnected._
- **Should `postcss.config.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13793103448275862 - nodes in this community are weakly interconnected._