import { describe, it, expect } from 'vitest';
import {
  calculateCAGR,
  calculateRealReturn,
  calculateSIP,
  calculateSWP,
  calculateIRR,
  calculateXIRR,
  calculateBondMetrics,
  calculateP2PRealisedReturn,
  calculateRentalPropertyMetrics,
  calculateRiskMetrics,
  calculateRebalancing,
} from '../../lib/finance/formulas';

describe('Financial Mathematics - CAGR & Real Returns', () => {
  it('calculates standard CAGR accurately', () => {
    // 100,000 grows to 200,000 in 5 years => ~14.8698%
    const cagr = calculateCAGR(100000, 200000, 5);
    expect(cagr).toBeCloseTo(0.148698, 4);
  });

  it('handles negative growth and zero years edge cases', () => {
    expect(calculateCAGR(100000, 50000, 1)).toBeCloseTo(-0.5, 4);
    expect(calculateCAGR(100000, 0, 5)).toBe(-1.0);
    expect(calculateCAGR(0, 100000, 5)).toBe(0);
    expect(calculateCAGR(100000, 200000, 0)).toBe(0);
  });

  it('calculates Fisher Real Return correctly', () => {
    // 12% nominal return, 6% inflation => (1 + 0.12) / (1 + 0.06) - 1 = 1.12 / 1.06 - 1 ≈ 5.6603%
    const real = calculateRealReturn(0.12, 0.06);
    expect(real).toBeCloseTo(0.056603, 4);
  });
});

describe('SIP and SWP Calculations', () => {
  it('computes 10-year monthly SIP accurately', () => {
    // ₹10,000 monthly, 12% annual return, 10 years (120 months)
    const result = calculateSIP(10000, 0.12, 10);
    expect(result.investedAmount).toBe(1200000);
    // Standard advance monthly SIP formula yield: ~23,23,391
    expect(result.totalCorpus).toBeGreaterThan(2300000);
    expect(result.totalCorpus).toBeLessThan(2350000);
    expect(result.estimatedReturns).toBe(result.totalCorpus - result.investedAmount);
    expect(result.yearlyBreakdown.length).toBe(10);
  });

  it('handles SWP depletion correctly', () => {
    // ₹10 Lakh corpus, withdrawing ₹1 Lakh monthly at 6% return will deplete in ~11 months
    const swp = calculateSWP(1000000, 100000, 0.06, 5);
    expect(swp.depletedMonth).not.toBeNull();
    expect(swp.depletedMonth).toBeLessThanOrEqual(12);
    expect(swp.finalCorpus).toBe(0);
  });
});

describe('IRR and XIRR Calculations', () => {
  it('calculates annual project IRR accurately', () => {
    // Year 0: -100, Year 1: 20, Year 2: 30, Year 3: 50, Year 4: 40
    const cashflows = [-100, 20, 30, 50, 40];
    const irr = calculateIRR(cashflows);
    // NPV at irr should be approximately 0
    expect(irr).toBeGreaterThan(0.12);
    expect(irr).toBeLessThan(0.15);
  });

  it('calculates XIRR with irregular dates', () => {
    const dates = [
      { date: '2023-01-01', amount: -100000 },
      { date: '2023-07-01', amount: -50000 },
      { date: '2024-01-01', amount: 175000 },
    ];
    const xirr = calculateXIRR(dates);
    expect(xirr).toBeGreaterThan(0.15);
    expect(xirr).toBeLessThan(0.35);
  });
});

describe('Bond Duration & Sensitivity', () => {
  it('calculates duration, modified duration and price sensitivity for 10-year G-Sec', () => {
    // Face Value 1000, Coupon 7.10% semi-annual, 10 years, YTM 7.10% (trading at par)
    const bond = calculateBondMetrics(1000, 0.071, 2, 10, 0.071);
    expect(bond.price).toBeCloseTo(1000, 0);
    expect(bond.currentYield).toBeCloseTo(0.071, 3);
    expect(bond.modifiedDuration).toBeGreaterThan(6.5);
    expect(bond.modifiedDuration).toBeLessThan(7.5);

    // If yield rises 50 bps (+0.0050), bond price drops approx (-ModifiedDuration * 0.005)
    const priceChange = bond.priceChangeForYieldBps(50);
    expect(priceChange).toBeLessThan(0);
    expect(priceChange).toBeCloseTo(-0.035, 1);
  });
});

describe('P2P Realised Return Simulator', () => {
  it('correctly models default losses, platform fee, and uninvested cash drag', () => {
    // ₹10 Lakhs at 12% advertised contractual rate
    // 4% default, 25% recovery, 1.5% fee, 8% idle cash, 31.2% tax rate
    const p2p = calculateP2PRealisedReturn(1000000, 0.12, 0.04, 0.25, 0.015, 0.08, 0.312);
    expect(p2p.grossContractualReturn).toBe(0.12);
    // Realised pre-tax return must be significantly lower than 12%
    expect(p2p.netRealisedPreTax).toBeLessThan(0.09);
    expect(p2p.netRealisedPreTax).toBeGreaterThan(0.05);
    // Post-tax return is further compressed by non-offsetable capital losses
    expect(p2p.netRealisedPostTax).toBeLessThan(p2p.netRealisedPreTax);
    expect(p2p.principalLost).toBe(30000 * (1 - 0.08)); // (10L * 0.92) * 0.04 * 0.75 = 27600
  });
});

describe('Real Estate Leveraged Rental & IRR', () => {
  it('computes gross vs net rental yield and leveraged equity IRR', () => {
    // ₹1 Crore property, ₹7 Lakh stamp duty/reg, ₹3 Lakh furnishing
    // Rent ₹30,000/mo, ₹15,000 property tax, ₹25,000 maintenance
    // 50% home loan at 8.5% for 15 years
    const prop = calculateRentalPropertyMetrics(
      10000000,
      700000,
      300000,
      30000,
      15000,
      25000,
      0.0833, // 1 month vacancy
      5000000,
      0.085,
      15,
      0.05,
      10
    );

    expect(prop.totalAcquisitionCost).toBe(11000000);
    expect(prop.equityInvested).toBe(6000000);
    // Gross rental yield on Indian residential is typically 2.5% to 3.8%
    expect(prop.grossRentalYield).toBeCloseTo(0.036, 2);
    expect(prop.netRentalYield).toBeLessThan(prop.grossRentalYield);
    expect(prop.monthlyEMI).toBeGreaterThan(45000);
  });
});

describe('Risk Metrics & Drawdown', () => {
  it('computes Sharpe, Sortino, and Maximum Drawdown', () => {
    // Monthly returns sequence simulating an equity strategy with a dip
    const returns = [0.03, 0.02, -0.05, -0.04, 0.06, 0.02, -0.01, 0.04, 0.01, 0.03, -0.02, 0.05];
    const risk = calculateRiskMetrics(returns, 0.065, 12);

    expect(risk.annualisedReturn).toBeGreaterThan(0.1);
    expect(risk.annualisedVolatility).toBeGreaterThan(0.05);
    expect(risk.maxDrawdown).toBeGreaterThan(0.08); // cumulative drop from dip
    expect(risk.sharpeRatio).toBeGreaterThan(0);
  });
});

describe('Portfolio Rebalancing Engine', () => {
  it('generates rebalancing instructions matching target weights', () => {
    const holdings = [
      { asset: 'Indian Large Cap', currentValue: 700000 },
      { asset: 'G-Sec Debt', currentValue: 200000 },
      { asset: 'Sovereign Gold', currentValue: 100000 },
    ];
    const targets = [
      { asset: 'Indian Large Cap', targetPercent: 50 },
      { asset: 'G-Sec Debt', targetPercent: 30 },
      { asset: 'Sovereign Gold', targetPercent: 20 },
    ];

    const instructions = calculateRebalancing(holdings, targets, 0);
    const largeCap = instructions.find((i) => i.asset === 'Indian Large Cap')!;
    const debt = instructions.find((i) => i.asset === 'G-Sec Debt')!;
    const gold = instructions.find((i) => i.asset === 'Sovereign Gold')!;

    expect(largeCap.action).toBe('SELL');
    expect(largeCap.diffAmount).toBe(200000);
    expect(debt.action).toBe('BUY');
    expect(debt.diffAmount).toBe(100000);
    expect(gold.action).toBe('BUY');
    expect(gold.diffAmount).toBe(100000);
  });
});
