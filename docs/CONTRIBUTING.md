# Contributing to ArthaAtlas India

We welcome research contributions, factual corrections, and mathematical enhancements to ArthaAtlas India.

## 1. Ground Rules

- **Zero Promotional / Sponsored Submissions:** We strictly reject affiliate links, PR releases, and promotional reviews for financial platforms or products.
- **Primary Source Obligation:** Every statutory claim or regulatory statement must cite an official publication from the Income Tax Department, SEBI, RBI, AMFI, or other statutory authorities.
- **Client-Side Privacy:** No contribution may introduce client-tracking scripts, third-party analytics telemetry, or backend data collectors.

---

## 2. Contribution Workflow

1. Fork the repository: `https://github.com/chirag127/artha-atlas-assets`.
2. Create a feature branch: `git checkout -b feature/new-research-article`.
3. If adding an article, place it in `src/content/articles/` as an `.mdx` file conforming to the schema in `docs/CONTENT_GUIDE.md`.
4. Run validation checks:
   ```bash
   npm run test
   npx astro check
   npm run build
   ```
5. Commit your changes with descriptive messages:
   ```bash
   git commit -m "docs(tax): add analysis of Section 194DA TDS rules"
   ```
6. Push to your branch and submit a Pull Request against `main`.

---

## 3. Reporting Errors & Vulnerabilities

Please report errors or security vulnerabilities directly to:
- **Email:** [chirag@oriz.in](mailto:chirag@oriz.in)
- **Policy:** See the [Correction Policy](https://chirag127.github.io/artha-atlas-assets/corrections) for our 48-72 hour review SLA.
