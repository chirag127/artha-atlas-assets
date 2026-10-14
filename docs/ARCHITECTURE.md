# Architecture & Technical Design

## 1. Architectural Philosophy

ArthaAtlas India is architected as an **independent, zero-cost, static-first web platform**. It requires zero commercial server infrastructure, zero database instances, and zero paid third-party APIs.

### Core Tenets
1. **Static Pre-Rendering (SSG):** All 32+ MDX research articles, 13 category deep-dives, series curriculum pages, glossary indices, and comparison datasets are pre-rendered into static HTML at build time by Astro.
2. **Selective Hydration (React Islands):** Client-side JavaScript is restricted strictly to interactive calculator engines (`SIPCalculator`, `SWPCalculator`, `P2PRealisedReturnCalculator`, `RentalYieldCalculator`, `PostTaxComparisonCalculator`), the `ComparisonEngine`, the `AllocationLab`, and the `SearchModal`.
3. **Subpath & Custom Domain Compatibility:** Fully supports deployment under GitHub Pages repository subpaths (`/artha-atlas-assets/`) via `import.meta.env.BASE_URL` routing, and cleanly transitions to the custom domain `arthaatlas.in` when configured.
4. **Deterministic Client-Side Privacy:** No investment values, net worth assumptions, or calculator inputs ever escape the browser context.

---

## 2. Directory Layout & Module Boundaries

```
artha-atlas-assets/
├── .github/
│   └── workflows/
│       ├── deploy.yml            # Automated GitHub Pages CI/CD
│       └── quality.yml           # PR TypeCheck & Unit Test audit
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── allocation/           # Asset allocation laboratory island
│   │   ├── calculators/          # Financial mathematical models (SIP, SWP, P2P, Rental, Tax)
│   │   ├── compare/              # TanStack Table comparison matrix
│   │   ├── diagrams/             # Client-side Mermaid diagrams with dark/light themes
│   │   ├── layout/               # Header, Footer, and theme toggling
│   │   └── search/               # Pagefind search modal island
│   ├── content/
│   │   └── articles/             # 32+ Flagship MDX research studies
│   ├── data/
│   │   ├── assets.json           # 35+ Investable asset parameter profiles
│   │   ├── categories.json       # 13 Asset category definitions
│   │   ├── glossary.json         # Financial & tax statutory definitions
│   │   ├── portfolios.json       # 12 Strategic model asset allocations
│   │   ├── seriesRoadmap.json    # 300+ Curated research series syllabus
│   │   └── sources.json          # Primary source register (SEBI, RBI, ITD, etc.)
│   ├── layouts/
│   │   ├── BaseLayout.astro      # Master layout with SEO & OpenGraph tags
│   │   └── ArticleLayout.astro   # Research study layout with TOC, KaTeX, & citations
│   ├── lib/
│   │   ├── finance/
│   │   │   └── formulas.ts       # Shared financial mathematics engine
│   │   └── taxation/
│   │       └── taxRules.ts       # Statutory tax engine (Finance Act 2024)
│   ├── pages/                    # Astro file-based routing
│   ├── styles/
│   │   └── global.css            # Tailwind v4 & KaTeX typography rules
│   └── tests/
│       └── unit/                 # Vitest mathematical test suites
├── docs/                         # Developer & researcher documentation
├── astro.config.mjs              # Astro 7 & Vite configuration
├── package.json                  # Dependency manifests
└── tsconfig.json                 # Strict TypeScript configuration
```

---

## 3. Technology Selection & Rationale

| Layer | Selection | Justification |
| :--- | :--- | :--- |
| **Site Generator** | **Astro 7.3** | Best-in-class SSG performance, native MDX content collections, and zero runtime JS baseline. |
| **Styling** | **Tailwind CSS v4** | Instant Vite build integration via `@tailwindcss/vite`, CSS-variable theming, minimal bundle footprint. |
| **Interactivity** | **React 19 Islands** | Declarative state management for complex calculators and sliders without global framework overhead. |
| **Mathematics** | **KaTeX + remark-math** | Fast, server-rendered LaTeX equations without browser font flashing or math rendering delays. |
| **Diagrams** | **Mermaid 12.2** | Text-based declarative flowcharts and decision trees with graceful client-side error handling. |
| **Search Engine** | **Pagefind 1.5** | Static full-text search indexing generated post-build. 100% serverless with sub-millisecond retrieval. |
| **Data Tables** | **TanStack Table v8** | Headless table engine supporting sorting, filtering, column toggling, and CSV/JSON export. |
| **Unit Testing** | **Vitest 5.0** | Ultra-fast native ESM test runner sharing the exact same TypeScript compiler setup. |

---

## 4. Financial Calculation Architecture

All financial logic resides in `src/lib/finance/formulas.ts` as pure, stateless functions. Every function is accompanied by unit tests in `src/tests/unit/formulas.test.ts` validating:
- Edge conditions ($r = 0$, negative compounding, terminal horizons).
- Numerical convergence of Newton-Raphson approximations for IRR and XIRR.
- Accurate discounting of credit default recovery cascades and platform friction.

---

## 5. Taxation Engine Architecture

The tax system in `src/lib/taxation/taxRules.ts` models **Tax as Data**. It encapsulates:
1. Applicable statutory sections under the Income Tax Act, 1961.
2. Enacted amendments from the Finance (No. 2) Act, 2024.
3. Holding duration thresholds (12 months for equities, 24 months for unlisted/real estate).
4. Marginal slab taxes vs. special concessional rates.
5. Indexation grandfathering clauses for pre-July 2024 real estate acquisitions.
