import { describe, it, expect } from 'vitest';
import { INDIAN_TAX_RULES_REGISTRY, calculateInvestmentTax } from '../../lib/taxation/taxRules';

describe('Indian Taxation Rules - Finance (No. 2) Act 2024 Audit', () => {
  it('correctly applies listed equity STCG at 20% (Section 111A)', () => {
    // Bought for ₹1,00,000, sold for ₹1,50,000 after 6 months (STCG = ₹50,000)
    const result = calculateInvestmentTax({
      ruleId: 'listed_equity_shares',
      purchaseCost: 100000,
      saleValue: 150000,
      holdingPeriodMonths: 6,
      investorMarginalTaxRate: 0.312,
    });

    expect(result.isLongTerm).toBe(false);
    expect(result.applicableRate).toBe(0.20); // 20% post-July 2024
    // 50,000 * 20% = 10,000 + 4% cess = 10,400
    expect(result.taxPayable).toBe(10400);
    expect(result.netPostTaxGain).toBe(39600);
  });

  it('correctly applies listed equity LTCG at 12.5% with ₹1.25L exemption (Section 112A)', () => {
    // Bought for ₹2,00,000, sold for ₹4,00,000 after 18 months (LTCG = ₹2,00,000)
    const result = calculateInvestmentTax({
      ruleId: 'equity_oriented_mutual_funds',
      purchaseCost: 200000,
      saleValue: 400000,
      holdingPeriodMonths: 18,
      investorMarginalTaxRate: 0.312,
      otherLTCGRealisedThisYear: 0,
    });

    expect(result.isLongTerm).toBe(true);
    expect(result.applicableRate).toBe(0.125); // 12.5% post-July 2024
    // Exemption ₹1.25 Lakh => Taxable gain = 2,00,000 - 1,25,000 = 75,000
    expect(result.taxableGainAmount).toBe(75000);
    // 75,000 * 12.5% = 9,375 + 4% cess = 9,750
    expect(result.taxPayable).toBe(9750);
  });

  it('treats specified debt mutual funds under Section 50AA as slab-rate short-term gains', () => {
    // Held for 36 months, but Section 50AA overrides LTCG
    const result = calculateInvestmentTax({
      ruleId: 'debt_mutual_funds_specified',
      purchaseCost: 500000,
      saleValue: 600000,
      holdingPeriodMonths: 36,
      investorMarginalTaxRate: 0.30, // 30% slab
    });

    expect(result.isLongTerm).toBe(false); // No LTCG status
    expect(result.applicableRate).toBe(0.30);
    // 100,000 gain * 30% = 30,000 + 4% cess = 31,200
    expect(result.taxPayable).toBe(31200);
  });

  it('verifies PPF EEE tax exemption status', () => {
    const result = calculateInvestmentTax({
      ruleId: 'public_provident_fund',
      purchaseCost: 1500000,
      saleValue: 3000000,
      holdingPeriodMonths: 180,
      investorMarginalTaxRate: 0.312,
    });

    expect(result.taxPayable).toBe(0);
    expect(result.netPostTaxGain).toBe(1500000);
  });

  it('verifies Gold holding period harmonisation to 24 months and 12.5% LTCG', () => {
    const rule = INDIAN_TAX_RULES_REGISTRY['physical_gold_and_silver'];
    expect(rule.holdingPeriodForLongTermMonths).toBe(24);
    expect(rule.ltcgRate).toBe(0.125);
  });
});
