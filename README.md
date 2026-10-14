# ArthaAtlas India (अर्थएटलस)

[![Quality & Verification Audit](https://github.com/chirag127/artha-atlas-assets/actions/workflows/quality.yml/badge.svg)](https://github.com/chirag127/artha-atlas-assets/actions/workflows/quality.yml)
[![Deploy to GitHub Pages](https://github.com/chirag127/artha-atlas-assets/actions/workflows/deploy.yml/badge.svg)](https://github.com/chirag127/artha-atlas-assets/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Astro](https://img.shields.io/badge/Astro-7.x-orange.svg)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-cyan.svg)](https://tailwindcss.com)

> **"Explore Every Asset. Understand Every Risk. Build Better Wealth."**
>
> India's Independent, Static-First Investment Research Platform, High-Return Asset Deconstruction, Taxation Engine, and Asset Allocation Laboratory.

Live Production URL: **[https://chirag127.github.io/artha-atlas-assets/](https://chirag127.github.io/artha-atlas-assets/)**  
Future Custom Domain: **`arthaatlas.in`**

---

## 🏛️ What is ArthaAtlas India?

ArthaAtlas India is not a promotional finance blog or generic affiliate comparison website. It is an open, client-side, research-driven financial encyclopedia designed to help Indian retail investors, HNIs, and family offices make rational, risk-underwritten capital allocation decisions.

### Core Capabilities

1. **Taxonomy of Wealth (13 Core Asset Classes):**
   Complete architectural coverage across Cash & Deposits, Listed Equities, Mutual Funds & ETFs, Bonds & Credit, P2P Lending, Gold & Silver, Real Estate & REITs, International Equities (LRS), Retirement & Sovereign Savings (EPF/PPF/NPS), Life & Term Insurance, Alternative Investment Funds (AIFs/PE/VC), Advanced Derivatives & Hedging, and Productive Operating MSME Businesses.
2. **High-Return Opportunity Research Programme:**
   A dedicated framework evaluating P2P lending defaults, small-cap survivorship bias, private credit illiquidity, leveraged real estate IRRs, and operating business ROIC vs. passive stock returns.
3. **Statutory Tax Centre (Finance Act 2024 Enacted):**
   Models the revised capital gains tax regime effective 23 July 2024:
   - Section 112A (12.5% LTCG on equities & equity MFs > ₹1.25 Lakh)
   - Section 111A (20% STCG on equities)
   - Section 50AA (Debt funds with &le;35% equity taxed at income slab rates)
   - Section 47(viic) (100% tax exemption on RBI maturity redemption of Sovereign Gold Bonds)
   - Section 112 grandfathering option for pre-July 2024 immovable property
   - Section 194A / 194K TDS withholding and Section 206C(1G) 20% LRS TCS
4. **Interactive Asset Allocation Laboratory:**
   12 pre-configured strategic model portfolios (Emergency Reserves, Balanced Growth, Aggressive Growth, High-Return Alternatives, Inflation Resilience, Retirement Decumulation, etc.) with customizable asset weight sliders, real inflation drag modeling, rebalancing bands, and Monte Carlo probability distributions.
5. **Multi-Dimensional Comparison Engine:**
   Compare 35+ Indian investment instruments side-by-side across 25+ parameters: historical return distributions, volatility, maximum drawdown, liquidity locks, ticket sizes, tax classifications, and failure modes. Export to CSV or JSON.
6. **Financial Mathematics Suite:**
   Client-side precision calculators for Step-Up SIP (with purchasing power preservation), SWP Retirement Depletion, P2P Realised Return & Default Waterfall, and Property Rental Yield & Leveraged Equity IRR.
7. **Static Full-Text Search:**
   Powered by Pagefind. Indexes the entire encyclopedia statically at build time. Zero server requests, instant search with keyboard shortcuts (`Cmd+K` / `Ctrl+K`).
8. **100% Client-Side Privacy:**
   No financial data, portfolio figures, or entered assumptions ever leave your browser. Zero tracking telemetry, zero ads, zero paywalls.

---

## 🛠️ Technology Stack

- **Framework:** [Astro 7.3](https://astro.build) (Static Site Generation `output: 'static'`)
- **Interactive Islands:** [React 19](https://react.dev)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite`
- **Typography & Math:** [KaTeX](https://katex.org) via `remark-math` and `rehype-katex`
- **Diagrams:** [Mermaid](https://mermaid.js.org) for decision trees and default waterfalls
- **Data Tables:** [TanStack Table v8](https://tanstack.com/table)
- **Search Engine:** [Pagefind 1.5](https://pagefind.app)
- **Unit Testing:** [Vitest 5.0](https://vitest.dev)
- **Deployment:** GitHub Pages via GitHub Actions

---

## 🚀 Quick Start & Local Development

### Prerequisites

- Node.js `v22.x` or `v24.x`
- npm `v10.x` or `v11.x`

### Installation

```bash
# Clone the repository
git clone https://github.com/chirag127/artha-atlas-assets.git
cd artha-atlas-assets

# Install dependencies
npm install

# Run financial math and tax unit tests
npm run test

# Validate TypeScript & Content Schemas
npm run lint

# Start local Astro development server
npm run dev
```

Visit `http://localhost:4321/artha-atlas-assets/` in your browser.

### Production Build & Search Indexing

```bash
# Build static HTML and generate Pagefind search index
npm run build

# Preview production build locally
npm run preview
```

---

## 🧪 Automated Testing Suite

All financial mathematics and statutory tax calculations are independently validated via Vitest unit tests:

```bash
npm run test
```

Test coverage includes:
- **Compounded Annual Growth Rate (CAGR):** Standard compounding, sub-annual intervals, and negative return distributions.
- **Fisher Real Return Equation:** Purchasing power degradation at various inflation rates.
- **Step-Up SIP & SWP:** Exact annuity formulas, step-up contribution growth, and monthly corpus depletion.
- **Internal Rate of Return (IRR & XIRR):** Newton-Raphson numerical convergence for irregular cash flows.
- **Bond Duration & Convexity:** Macauley duration, modified duration, and price volatility approximation.
- **P2P Realised Return Waterfall:** Principal loss defaults, platform collection costs, recovery timing, idle cash drag, and slab income tax.
- **Property Cap Rate & Equity IRR:** Gross rental yield, net operating income, mortgage amortization, and leveraged resale proceeds.
- **Finance Act 2024 Taxation:** Section 112A equity exemption, Section 50AA slab treatment on debt MFs, Section 47(viic) SGB exemption, and real estate indexation grandfathering.

---

## 📖 Editorial Standards & Roadmap

ArthaAtlas maintains an open editorial roadmap of **300+ planned research studies** across 13 distinct series:
- Series 01: Indian Investing Foundations
- Series 02: P2P Lending: Returns, Defaults, and Recovery
- Series 03: Gold, Silver, and Commodity Strategies
- Series 04: Indian Investment Taxation & Wealth Architecture
- Series 05: Real Estate, REITs, and Fractional Property
- Series 06: Bonds, Credit Instruments, and Fixed Income
- Series 07: Equity Investing and Factor Strategies
- Series 08: Retirement and Sovereign Savings Products
- Series 09: Insurance and Wealth Protection Mechanics
- Series 10: International Diversification & Currency Dynamics
- Series 11: Alternative Investments & Private Markets
- Series 12: Derivatives, Hedging, and Advanced Quantitative Strategies
- Series 13: Productive Operating Assets & Business Ownership

See [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) and [src/data/seriesRoadmap.json](src/data/seriesRoadmap.json) for the full editorial syllabus.

---

## 👤 Author & Support

- **Author & Researcher:** Chirag Singhal
- **Email:** [chirag@oriz.in](mailto:chirag@oriz.in)
- **Facebook:** [singhal127](https://facebook.com/singhal127)
- **Reader Support:** [Buy Me a Coffee](https://buymeacoffee.com/chirag127)

*If this independent research platform helped you navigate Indian investments or saved you from high-friction investment traps, consider supporting ongoing hosting and data verification.*

---

## ⚖️ Legal Disclaimer

*ArthaAtlas India is an educational and quantitative research project created by Chirag Singhal. Neither Chirag Singhal nor ArthaAtlas India is registered with the Securities and Exchange Board of India (SEBI) as a Research Analyst or Investment Adviser under SEBI (Investment Advisers) Regulations, 2013. Nothing on this website constitutes personalized financial advice, investment advice, tax counsel, or solicitation. All securities and alternative investments involve substantial risk of loss. Always consult a fee-only SEBI-registered financial advisor and a qualified tax professional before committing capital.*

---

## 📄 License

Distributed under the [MIT License](LICENSE).
