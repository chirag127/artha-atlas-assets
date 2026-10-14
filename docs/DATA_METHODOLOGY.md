# Data Integrity & Quantitative Methodology

## 1. Zero-Fabrication Pledge

ArthaAtlas India enforces a strict data hierarchy. We do not invent return distributions, fabricate historical track records, or synthesize fictional market quotes.

### Data Hierarchy
1. **Primary Legislative Acts & Circulars:** The Income Tax Act 1961, Finance Acts as gazetted by the Ministry of Law & Justice, SEBI Master Circulars, and RBI Notifications.
2. **Official Regulator Disclosures:** SEBI SCORES, RBI NBFC-P2P register, DICGC insured bank schedules, PFRDA NPS Trust reports, and IRDAI public disclosures.
3. **Primary Exchange & Association Series:** National Stock Exchange of India (NSE), BSE India historical indices, AMFI mutual fund categorisation schedules.
4. **Peer-Reviewed & Academic Finance:** Empirical studies on factor investing, momentum premia, and survivorship bias in emerging markets.

---

## 2. Quantitative Financial Formulations

### 2.1 Compounded Annual Growth Rate (CAGR)
$$\text{CAGR} = \left(\frac{V_{\text{final}}}{V_{\text{initial}}}\right)^{\frac{1}{n}} - 1$$

Where:
- $V_{\text{initial}}$ is the initial investment capital.
- $V_{\text{final}}$ is the terminal value.
- $n$ is the investment horizon in exact years ($\Delta \text{days} / 365.25$).

### 2.2 Fisher Real Return Equation
$$r_{\text{real}} = \frac{1 + r_{\text{nominal}}}{1 + \pi} - 1$$

Where:
- $r_{\text{nominal}}$ is the gross or net nominal return rate.
- $\pi$ is the expected headline Consumer Price Inflation (CPI).

### 2.3 Step-Up Systematic Investment Plan (SIP)
For an initial monthly contribution $P_0$, annual step-up rate $s$, monthly return $r_m = (1+r)^{1/12}-1$, the corpus after $Y$ years ($N = 12Y$ months) is:
$$V_N = \sum_{y=1}^{Y} P_0 (1+s)^{y-1} \sum_{m=1}^{12} (1 + r_m)^{N - (12(y-1) + m) + 1}$$

### 2.4 Bond Duration & Interest Rate Sensitivity
Macauley Duration:
$$D_{\text{mac}} = \frac{\sum_{t=1}^T \frac{t \cdot C}{(1+y)^t} + \frac{T \cdot M}{(1+y)^T}}{P}$$

Modified Duration:
$$D_{\text{mod}} = \frac{D_{\text{mac}}}{1 + \frac{y}{k}}$$

Price percentage change approximation:
$$\frac{\Delta P}{P} \approx -D_{\text{mod}} \cdot \Delta y + \frac{1}{2} C_{\text{onv}} \cdot (\Delta y)^2$$

### 2.5 Alternative Credit & P2P Realised Return Waterfall
$$\text{Realised Return} = \frac{\sum \text{Interest Received} - \text{Principal Defaults} + \text{Net Recoveries} - \text{Platform Fees} - \text{Cash Drag}}{\text{Total Capital Deployed}}$$

Where:
- $\text{Cash Drag}$ models idle capital in platform escrow earning non-compounding interest.
- $\text{Net Recoveries} = \text{Gross Recoveries} \times (1 - \text{Collection Fee})$.

---

## 3. Maintenance & Update Protocol

1. **Quarterly Source Audit:** Re-verify all URLs and regulatory thresholds cited in `src/data/sources.json`.
2. **Annual Finance Bill Revision:** Update `src/lib/taxation/taxRules.ts` each year upon the presentation and enactment of the Union Budget Finance Bill.
3. **Changelog Commits:** All modifications must be documented in a signed Git commit with the corresponding legislative citation.
