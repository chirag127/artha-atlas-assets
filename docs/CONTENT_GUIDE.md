# Content Creation & Editorial Guide

## 1. Writing for ArthaAtlas India

Every research study published on ArthaAtlas India must adhere to institutional research standards:

### Structural Requirements
Every substantial research article should contain:
1. **Title & Summary:** Concise, descriptive headline and high-signal executive overview.
2. **Metadata Frontmatter:** Accurate category, series ID, reading time, publication date, and last reviewed date.
3. **Prerequisites & Definitions:** Clarity on prerequisite knowledge.
4. **Step-by-Step Mechanics:** How the asset works, how money is made, and how capital is lost.
5. **Mathematical Formulations:** Standard KaTeX notation for financial equations (`$$` blocks).
6. **Regulatory Architecture:** Primary regulator jurisdiction and statutory protections.
7. **Taxation Section:** Exact statutory section citations (e.g. Section 112A, Section 50AA) under current Finance Acts.
8. **Drawdown & Failure Cases:** Stress-test analysis during market panics or illiquidity.
9. **Practical Due-Diligence Checklist:** Actionable filters for investors.
10. **Primary Citations:** Links to official documents and circulars.

---

## 2. MDX Schema Definition

Articles are stored in `src/content/articles/` with the `.mdx` extension. The frontmatter must strictly follow this schema:

```yaml
---
title: "Anatomy of Peer-to-Peer (P2P) Lending in India"
summary: "Deconstructing headline 12-14% returns against default rates, platform collection cuts, and cash drag."
publishDate: "2026-03-15"
lastReviewedDate: "2026-10-14"
author: "Chirag Singhal"
category: "p2p-lending"
series: "p2p-lending-returns-defaults"
readingTime: "12 min"
tags: ["p2p", "alternative-credit", "nbfc-p2p", "rbi-regulations"]
status: "published"
featured: true
---
```

---

## 3. Embedding Interactive Components

You can embed interactive calculators and Mermaid diagrams directly in MDX articles:

```mdx
import SIPCalculator from '../../components/calculators/SIPCalculator';
import MermaidViewer from '../../components/diagrams/MermaidViewer';

### Interactive Step-Up SIP Calculator

<SIPCalculator client:load />

### Structural Capital Flow

<MermaidViewer 
  client:load 
  chart={`
    flowchart TD
      A[Investor Capital] --> B[Escrow Account]
      B --> C[Borrower Disbursal]
      C --> D[Principal + Interest Repayment]
  `} 
/>
```
