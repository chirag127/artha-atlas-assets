/**
 * ArthaAtlas India - Statutory Taxation & After-Tax Returns Engine
 * Formulated under Indian Income Tax Act, 1961, comprehensively updated
 * for the Finance (No. 2) Act, 2024 (enacted August 2024, applicable for AY 2025-26).
 */

export interface TaxRule {
  id: string;
  assetClass: string;
  instrumentName: string;
  holdingPeriodForLongTermMonths: number;
  stcgRate: number; // Decimal (e.g. 0.20 for 20%)
  ltcgRate: number; // Decimal (e.g. 0.125 for 12.5%)
  ltcgExemptionLimit: number; // e.g. 125000 for ₹1.25 Lakh
  indexationBenefitAvailable: boolean;
  statutorySection: string;
  incomeTaxHead: 'Capital Gains' | 'Income from Other Sources' | 'Business & Profession' | 'Exempt';
  tdsApplicable: boolean;
  tdsSection?: string;
  tdsRate?: number;
  tdsThreshold?: number;
  effectiveFrom: string;
  officialSourceUrl: string;
  notes: string;
}

export const INDIAN_TAX_RULES_REGISTRY: Record<string, TaxRule> = {
  listed_equity_shares: {
    id: 'listed_equity_shares',
    assetClass: 'Equities',
    instrumentName: 'Listed Indian Equity Shares (STT Paid)',
    holdingPeriodForLongTermMonths: 12,
    stcgRate: 0.2, // 20% under Section 111A
    ltcgRate: 0.125, // 12.5% under Section 112A
    ltcgExemptionLimit: 125000, // ₹1,25,000 per financial year
    indexationBenefitAvailable: false,
    statutorySection: 'Section 111A, Section 112A',
    incomeTaxHead: 'Capital Gains',
    tdsApplicable: false,
    effectiveFrom: '2024-07-23',
    officialSourceUrl: 'https://incometaxindia.gov.in/Acts/Finance%20Acts/2024/Finance_Act_2024_No_2.pdf',
    notes: 'Finance (No. 2) Act 2024 hiked STCG from 15% to 20% and LTCG from 10% to 12.5%, while expanding annual LTCG exemption to ₹1.25 Lakh.',
  },
  equity_oriented_mutual_funds: {
    id: 'equity_oriented_mutual_funds',
    assetClass: 'Mutual Funds',
    instrumentName: 'Equity Mutual Funds & Equity ETFs (>65% Domestic Equity)',
    holdingPeriodForLongTermMonths: 12,
    stcgRate: 0.2,
    ltcgRate: 0.125,
    ltcgExemptionLimit: 125000,
    indexationBenefitAvailable: false,
    statutorySection: 'Section 111A, Section 112A',
    incomeTaxHead: 'Capital Gains',
    tdsApplicable: false,
    effectiveFrom: '2024-07-23',
    officialSourceUrl: 'https://incometaxindia.gov.in/Acts/Finance%20Acts/2024/Finance_Act_2024_No_2.pdf',
    notes: 'Applicable to funds holding minimum 65% in domestic equities. IDCW dividends are taxed at slab with 10% TDS under Section 194K if exceeding ₹5,000.',
  },
  debt_mutual_funds_specified: {
    id: 'debt_mutual_funds_specified',
    assetClass: 'Mutual Funds',
    instrumentName: 'Specified Debt Mutual Funds (<=35% Equity, acquired post 1-Apr-2023)',
    holdingPeriodForLongTermMonths: 0, // No LTCG benefit exists
    stcgRate: -1, // Taxed at investor income slab rate
    ltcgRate: -1, // Taxed at investor income slab rate
    ltcgExemptionLimit: 0,
    indexationBenefitAvailable: false,
    statutorySection: 'Section 50AA',
    incomeTaxHead: 'Capital Gains',
    tdsApplicable: false,
    effectiveFrom: '2023-04-01',
    officialSourceUrl: 'https://incometaxindia.gov.in/Acts/Finance%20Acts/2023/Finance_Act_2023.pdf',
    notes: 'Section 50AA treats gains as short-term capital gains taxed at the investor marginal slab rate regardless of holding period.',
  },
  hybrid_mutual_funds_conservative: {
    id: 'hybrid_mutual_funds_conservative',
    assetClass: 'Mutual Funds',
    instrumentName: 'Hybrid Mutual Funds (35% to 65% Equity, e.g. Conservative Hybrid / Multi-Asset)',
    holdingPeriodForLongTermMonths: 24,
    stcgRate: -1, // Slab rate
    ltcgRate: 0.125, // 12.5% flat without indexation post Finance Act 2024
    ltcgExemptionLimit: 0,
    indexationBenefitAvailable: false,
    statutorySection: 'Section 112',
    incomeTaxHead: 'Capital Gains',
    tdsApplicable: false,
    effectiveFrom: '2024-07-23',
    officialSourceUrl: 'https://incometaxindia.gov.in/Acts/Finance%20Acts/2024/Finance_Act_2024_No_2.pdf',
    notes: 'Holding period harmonised to 24 months. Taxed at 12.5% without indexation if held over 24 months.',
  },
  bank_fixed_deposits: {
    id: 'bank_fixed_deposits',
    assetClass: 'Fixed Income',
    instrumentName: 'Bank Fixed Deposits & Recurring Deposits',
    holdingPeriodForLongTermMonths: 0,
    stcgRate: -1, // Slab rate
    ltcgRate: -1, // Slab rate
    ltcgExemptionLimit: 0,
    indexationBenefitAvailable: false,
    statutorySection: 'Section 56(2)',
    incomeTaxHead: 'Income from Other Sources',
    tdsApplicable: true,
    tdsSection: 'Section 194A',
    tdsRate: 0.1, // 10% (20% without PAN)
    tdsThreshold: 40000, // ₹40,000 for regular, ₹50,000 for Senior Citizens under Sec 80TTB
    effectiveFrom: '2024-04-01',
    officialSourceUrl: 'https://www.incometax.gov.in/',
    notes: 'Interest is taxed each year on accrual basis at full marginal slab rate. Senior citizens can claim up to ₹50,000 deduction under Section 80TTB in old/new regime.',
  },
  p2p_lending_interest: {
    id: 'p2p_lending_interest',
    assetClass: 'Alternative Credit',
    instrumentName: 'Peer-to-Peer (P2P) Lending Returns',
    holdingPeriodForLongTermMonths: 0,
    stcgRate: -1, // Slab rate
    ltcgRate: -1, // Slab rate
    ltcgExemptionLimit: 0,
    indexationBenefitAvailable: false,
    statutorySection: 'Section 56(2)',
    incomeTaxHead: 'Income from Other Sources',
    tdsApplicable: false, // Generally not deducted by platforms unless configured
    effectiveFrom: '2024-04-01',
    officialSourceUrl: 'https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=11137',
    notes: 'CRITICAL RISK: Interest is fully taxed at marginal rate. Bad debt/defaulted principal cannot be easily offset against interest income for non-business retail investors.',
  },
  physical_gold_and_silver: {
    id: 'physical_gold_and_silver',
    assetClass: 'Commodities',
    instrumentName: 'Physical Gold, Bars, Jewelry & Physical Silver',
    holdingPeriodForLongTermMonths: 24,
    stcgRate: -1, // Slab rate
    ltcgRate: 0.125, // 12.5% flat without indexation
    ltcgExemptionLimit: 0,
    indexationBenefitAvailable: false,
    statutorySection: 'Section 112',
    incomeTaxHead: 'Capital Gains',
    tdsApplicable: false,
    effectiveFrom: '2024-07-23',
    officialSourceUrl: 'https://incometaxindia.gov.in/Acts/Finance%20Acts/2024/Finance_Act_2024_No_2.pdf',
    notes: 'Holding period reduced from 36 to 24 months. Tax rate reduced from 20% (with indexation) to 12.5% without indexation.',
  },
  sovereign_gold_bonds: {
    id: 'sovereign_gold_bonds',
    assetClass: 'Commodities',
    instrumentName: 'Sovereign Gold Bonds (SGB)',
    holdingPeriodForLongTermMonths: 12,
    stcgRate: -1, // Slab rate if sold on exchange < 12m
    ltcgRate: 0.125, // 12.5% if sold on exchange after 12m
    ltcgExemptionLimit: 0,
    indexationBenefitAvailable: false,
    statutorySection: 'Section 47(viic), Section 112',
    incomeTaxHead: 'Capital Gains',
    tdsApplicable: false,
    effectiveFrom: '2024-07-23',
    officialSourceUrl: 'https://rbi.org.in/Scripts/FAQView.aspx?Id=109',
    notes: 'Redemption through RBI window at maturity (8 years) or early redemption windows (from year 5) is 100% TAX FREE for individuals under Section 47(viic). Semi-annual 2.50% interest is taxable at slab rate.',
  },
  real_estate_property: {
    id: 'real_estate_property',
    assetClass: 'Real Estate',
    instrumentName: 'Residential & Commercial Real Estate (Land & Building)',
    holdingPeriodForLongTermMonths: 24,
    stcgRate: -1, // Slab rate
    ltcgRate: 0.125, // 12.5% without indexation (or 20% with indexation grandfathering for pre-23-Jul-2024 acquisitions)
    ltcgExemptionLimit: 0,
    indexationBenefitAvailable: true, // Grandfathered option for properties acquired prior to 23 July 2024
    statutorySection: 'Section 48, Section 54, Section 54EC',
    incomeTaxHead: 'Capital Gains',
    tdsApplicable: true,
    tdsSection: 'Section 194-IA',
    tdsRate: 0.01, // 1% TDS if sale value >= ₹50 Lakhs
    tdsThreshold: 5000000,
    effectiveFrom: '2024-07-23',
    officialSourceUrl: 'https://incometaxindia.gov.in/Acts/Finance%20Acts/2024/Finance_Act_2024_No_2.pdf',
    notes: 'Holding period 24 months. Finance Act 2024 amendment grants individuals/HUFs the option to compute tax at 20% with indexation if property was acquired prior to July 23, 2024 and resulting tax is lower.',
  },
  reits_and_invits: {
    id: 'reits_and_invits',
    assetClass: 'Real Estate & Infrastructure',
    instrumentName: 'Real Estate Investment Trusts (REITs) & InvITs',
    holdingPeriodForLongTermMonths: 12,
    stcgRate: 0.2, // 20% post Finance Act 2024
    ltcgRate: 0.125, // 12.5% post Finance Act 2024 (>₹1.25 Lakh exemption sharing with equities)
    ltcgExemptionLimit: 125000,
    indexationBenefitAvailable: false,
    statutorySection: 'Section 111A, Section 112A, Section 115UA, Section 56(2)(xii)',
    incomeTaxHead: 'Capital Gains',
    tdsApplicable: true,
    effectiveFrom: '2024-07-23',
    officialSourceUrl: 'https://www.sebi.gov.in/legal/regulations/sep-2024/securities-and-exchange-board-of-india-real-estate-investment-trusts-regulations-2014-last-amended-on-september-24-2024-_87063.html',
    notes: 'Distributions are three-part: Interest (taxable at slab), Dividend (tax-exempt if SPV under Sec 115BAA or taxable), and Repayment of Debt (taxable under Sec 56(2)(xii)). Unit sales follow equity LTCG/STCG rules.',
  },
  public_provident_fund: {
    id: 'public_provident_fund',
    assetClass: 'Government Savings',
    instrumentName: 'Public Provident Fund (PPF)',
    holdingPeriodForLongTermMonths: 180, // 15 years
    stcgRate: 0,
    ltcgRate: 0,
    ltcgExemptionLimit: 0,
    indexationBenefitAvailable: false,
    statutorySection: 'Section 10(11), Section 80C',
    incomeTaxHead: 'Exempt',
    tdsApplicable: false,
    effectiveFrom: '1968-07-01',
    officialSourceUrl: 'https://www.indiapost.gov.in/Financial/Pages/Content/Post-Office-Saving-Schemes.aspx',
    notes: 'Complete EEE Status: Contributions eligible for deduction up to ₹1.5 Lakh under 80C (Old Regime), interest is 100% tax-free, and maturity amount is 100% tax-free.',
  },
  national_pension_system: {
    id: 'national_pension_system',
    assetClass: 'Retirement',
    instrumentName: 'National Pension System (NPS Tier I)',
    holdingPeriodForLongTermMonths: 0,
    stcgRate: 0,
    ltcgRate: 0,
    ltcgExemptionLimit: 0,
    indexationBenefitAvailable: false,
    statutorySection: 'Section 10(12A), Section 80CCD(1), Section 80CCD(1B), Section 80CCD(2)',
    incomeTaxHead: 'Capital Gains',
    tdsApplicable: false,
    effectiveFrom: '2024-04-01',
    officialSourceUrl: 'https://npstrust.org.in/',
    notes: 'At age 60: 60% lump sum is 100% tax-exempt. Mandatory 40% annuity purchase is not taxed at entry, but regular annuity pension received is taxed at slab rate.',
  },
  international_us_equities: {
    id: 'international_us_equities',
    assetClass: 'International',
    instrumentName: 'Foreign Listed Equities (US Stocks via LRS route)',
    holdingPeriodForLongTermMonths: 24, // Treated as unlisted security in India
    stcgRate: -1, // Slab rate
    ltcgRate: 0.125, // 12.5% flat without indexation
    ltcgExemptionLimit: 0,
    indexationBenefitAvailable: false,
    statutorySection: 'Section 112, Section 206C(1G)',
    incomeTaxHead: 'Capital Gains',
    tdsApplicable: true,
    tdsSection: 'TCS Section 206C(1G)',
    tdsRate: 0.2, // 20% TCS on remittances exceeding ₹7 Lakhs per FY
    tdsThreshold: 700000,
    effectiveFrom: '2024-07-23',
    officialSourceUrl: 'https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=10198',
    notes: 'Holding period 24 months. LTCG is 12.5%. 25% US dividend withholding tax is creditable against Indian tax liability via Form 67 (DTAA Article 25). 20% LRS TCS applies above ₹7 Lakhs (claimable in ITR).',
  },
};

/**
 * Calculates after-tax capital gains outcome for an investment
 */
export interface TaxCalculationInput {
  ruleId: string;
  purchaseCost: number;
  saleValue: number;
  holdingPeriodMonths: number;
  investorMarginalTaxRate: number; // e.g. 0.312 for 30% + 4% cess
  otherLTCGRealisedThisYear?: number; // to factor ₹1.25L exemption
}

export interface TaxCalculationResult {
  grossGain: number;
  isLongTerm: boolean;
  applicableRate: number;
  taxableGainAmount: number;
  taxPayable: number;
  netPostTaxProceeds: number;
  netPostTaxGain: number;
  effectiveTaxRateOnGain: number;
  statutoryReference: string;
}

export function calculateInvestmentTax(input: TaxCalculationInput): TaxCalculationResult {
  const rule = INDIAN_TAX_RULES_REGISTRY[input.ruleId];
  if (!rule) {
    throw new Error(`Tax rule with id '${input.ruleId}' not found in registry.`);
  }

  const grossGain = input.saleValue - input.purchaseCost;
  if (grossGain <= 0) {
    return {
      grossGain,
      isLongTerm: input.holdingPeriodMonths > rule.holdingPeriodForLongTermMonths,
      applicableRate: 0,
      taxableGainAmount: 0,
      taxPayable: 0,
      netPostTaxProceeds: input.saleValue,
      netPostTaxGain: grossGain,
      effectiveTaxRateOnGain: 0,
      statutoryReference: rule.statutorySection,
    };
  }

  const isLongTerm =
    rule.holdingPeriodForLongTermMonths > 0 && input.holdingPeriodMonths > rule.holdingPeriodForLongTermMonths;

  let applicableRate = 0;
  let taxableGainAmount = grossGain;

  if (rule.incomeTaxHead === 'Exempt') {
    applicableRate = 0;
    taxableGainAmount = 0;
  } else if (isLongTerm) {
    applicableRate = rule.ltcgRate === -1 ? input.investorMarginalTaxRate : rule.ltcgRate;

    // Apply LTCG exemption (e.g. ₹1.25 Lakh for listed equity)
    if (rule.ltcgExemptionLimit > 0) {
      const remainingExemption = Math.max(0, rule.ltcgExemptionLimit - (input.otherLTCGRealisedThisYear || 0));
      taxableGainAmount = Math.max(0, grossGain - remainingExemption);
    }
  } else {
    // Short-term
    applicableRate = rule.stcgRate === -1 ? input.investorMarginalTaxRate : rule.stcgRate;
  }

  // Health and Education Cess is 4% on tax
  const baseTax = taxableGainAmount * applicableRate;
  const taxWithCess = baseTax * 1.04;
  const netPostTaxGain = grossGain - taxWithCess;
  const netPostTaxProceeds = input.purchaseCost + netPostTaxGain;

  return {
    grossGain: Math.round(grossGain),
    isLongTerm,
    applicableRate,
    taxableGainAmount: Math.round(taxableGainAmount),
    taxPayable: Math.round(taxWithCess),
    netPostTaxProceeds: Math.round(netPostTaxProceeds),
    netPostTaxGain: Math.round(netPostTaxGain),
    effectiveTaxRateOnGain: grossGain > 0 ? Math.round((taxWithCess / grossGain) * 1000) / 1000 : 0,
    statutoryReference: rule.statutorySection,
  };
}
