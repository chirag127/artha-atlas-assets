# Testing & Quality Assurance Plan

## 1. Automated Testing Architecture

Testing is mandatory for all code, financial formulas, and tax algorithms. The suite includes:
- **Unit Tests (Vitest):** Validating financial mathematics, precision, and edge cases.
- **Taxation Tests (Vitest):** Validating Finance Act 2024 statutory thresholds and slab calculations.
- **Type Checking (Astro Check):** Ensuring strict TypeScript and content collection schema conformity.
- **Static Search Indexing (Pagefind):** Validating that all generated HTML files are indexed without errors.

---

## 2. Running Test Suites Locally

```bash
# Execute all Vitest unit tests synchronously
npm run test

# Run tests in watch mode during development
npm run test:watch

# Execute Astro type checking and content schema validation
npx astro check

# Execute full production build + search index verification
npm run build
```

---

## 3. Test Coverage Breakdown

### Financial Mathematics (`src/tests/unit/formulas.test.ts`)
- `calculateCAGR`: Verifies compounding over 1, 3, and 5 years; asserts zero return for unchanged capital; tests negative compounding.
- `calculateRealReturn`: Verifies Fisher equation vs nominal subtraction error.
- `calculateStepUpSIP`: Validates step-up compounding against known financial tables.
- `calculateBondMetrics`: Validates Macauley duration, modified duration, and price sensitivity.
- `calculateP2PRealisedReturn`: Verifies default haircut, platform collection fees, idle cash drag, and post-tax returns.
- `calculateRentalPropertyMetrics`: Validates net cap rate, leveraged mortgage equity IRR, and expense ratios.

### Statutory Taxation (`src/tests/unit/tax.test.ts`)
- Section 112A equity exemption (₹1.25 Lakh exemption limit and 12.5% rate).
- Section 111A equity short-term rate (20%).
- Section 50AA debt fund taxation (slab-rate treatment).
- Section 47(viic) Sovereign Gold Bond 100% redemption tax exemption.
- Real estate grandfathering dual-option under Finance (No. 2) Act 2024.
