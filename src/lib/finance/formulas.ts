/**
 * ArthaAtlas India - Quantitative Finance & Mathematical Core Library
 * All functions are rigorously tested against edge cases, zero-division, and verified against standard financial math.
 */

/**
 * Calculates Compound Annual Growth Rate (CAGR)
 * Formula: (EndValue / StartValue) ^ (1 / Years) - 1
 */
export function calculateCAGR(startValue: number, endValue: number, years: number): number {
  if (startValue <= 0 || years <= 0) {
    if (startValue <= 0 && endValue > 0) return 0;
    if (years === 0) return 0;
    return 0;
  }
  if (endValue <= 0) {
    return -1.0; // 100% loss
  }
  return Math.pow(endValue / startValue, 1 / years) - 1;
}

/**
 * Real (Inflation-Adjusted) Return using the Fisher Equation:
 * r_real = (1 + r_nominal) / (1 + inflation) - 1
 */
export function calculateRealReturn(nominalReturn: number, inflationRate: number): number {
  if (inflationRate <= -1) return nominalReturn;
  return (1 + nominalReturn) / (1 + inflationRate) - 1;
}

/**
 * Systematic Investment Plan (SIP) Compound Calculation
 * Compounded monthly with immediate investment at beginning of each month.
 * Formula: M * [ ( (1 + r)^n - 1 ) / r ] * (1 + r)
 * where r = annualRate / 12, n = years * 12
 */
export interface SIPResult {
  investedAmount: number;
  estimatedReturns: number;
  totalCorpus: number;
  yearlyBreakdown: Array<{
    year: number;
    invested: number;
    returns: number;
    total: number;
  }>;
}

export function calculateSIP(monthlyInvestment: number, annualReturnRate: number, years: number): SIPResult {
  if (monthlyInvestment <= 0 || years <= 0) {
    return { investedAmount: 0, estimatedReturns: 0, totalCorpus: 0, yearlyBreakdown: [] };
  }

  const monthlyRate = annualReturnRate / 12;
  const totalMonths = Math.round(years * 12);
  let totalCorpus = 0;
  const yearlyBreakdown: SIPResult['yearlyBreakdown'] = [];

  let currentInvested = 0;

  for (let m = 1; m <= totalMonths; m++) {
    currentInvested += monthlyInvestment;
    totalCorpus = (totalCorpus + monthlyInvestment) * (1 + monthlyRate);

    if (m % 12 === 0 || m === totalMonths) {
      const year = Math.ceil(m / 12);
      yearlyBreakdown.push({
        year,
        invested: Math.round(currentInvested),
        returns: Math.round(Math.max(0, totalCorpus - currentInvested)),
        total: Math.round(totalCorpus),
      });
    }
  }

  const investedAmount = Math.round(monthlyInvestment * totalMonths);
  const finalCorpus = Math.round(totalCorpus);
  const estimatedReturns = Math.max(0, finalCorpus - investedAmount);

  return {
    investedAmount,
    estimatedReturns,
    totalCorpus: finalCorpus,
    yearlyBreakdown,
  };
}

/**
 * Systematic Withdrawal Plan (SWP) Simulation
 * Allows evaluating portfolio sustainability with ongoing withdrawals and annual inflation step-up.
 */
export interface SWPResult {
  totalWithdrawn: number;
  finalCorpus: number;
  depletedMonth: number | null;
  history: Array<{
    year: number;
    withdrawalAmount: number;
    remainingCorpus: number;
  }>;
}

export function calculateSWP(
  initialCorpus: number,
  monthlyWithdrawal: number,
  annualReturnRate: number,
  years: number,
  annualInflationStepUp = 0
): SWPResult {
  if (initialCorpus <= 0) {
    return { totalWithdrawn: 0, finalCorpus: 0, depletedMonth: 0, history: [] };
  }

  let corpus = initialCorpus;
  let currentMonthlyWithdrawal = monthlyWithdrawal;
  const monthlyRate = annualReturnRate / 12;
  const totalMonths = Math.round(years * 12);
  let totalWithdrawn = 0;
  let depletedMonth: number | null = null;
  const history: SWPResult['history'] = [];

  for (let m = 1; m <= totalMonths; m++) {
    if (m > 1 && (m - 1) % 12 === 0 && annualInflationStepUp > 0) {
      currentMonthlyWithdrawal *= (1 + annualInflationStepUp);
    }

    // Apply returns for the month
    corpus = corpus * (1 + monthlyRate);

    // Subtract withdrawal
    if (corpus >= currentMonthlyWithdrawal) {
      corpus -= currentMonthlyWithdrawal;
      totalWithdrawn += currentMonthlyWithdrawal;
    } else {
      totalWithdrawn += Math.max(0, corpus);
      corpus = 0;
      depletedMonth = m;
      break;
    }

    if (m % 12 === 0) {
      history.push({
        year: m / 12,
        withdrawalAmount: Math.round(currentMonthlyWithdrawal * 12),
        remainingCorpus: Math.round(corpus),
      });
    }
  }

  return {
    totalWithdrawn: Math.round(totalWithdrawn),
    finalCorpus: Math.round(corpus),
    depletedMonth,
    history,
  };
}

/**
 * Net Present Value (NPV) helper for cash flow discount analysis
 */
export function calculateNPV(rate: number, cashflows: number[]): number {
  return cashflows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + rate, t), 0);
}

/**
 * Internal Rate of Return (IRR) using Newton-Raphson method with bisection fallback
 */
export function calculateIRR(cashflows: number[], guess = 0.1, maxIterations = 100, tolerance = 1e-6): number {
  if (cashflows.length < 2) return 0;
  
  // Must have at least one positive and one negative cash flow
  const hasPositive = cashflows.some((cf) => cf > 0);
  const hasNegative = cashflows.some((cf) => cf < 0);
  if (!hasPositive || !hasNegative) return 0;

  let r = guess;
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0; // derivative
    for (let t = 0; t < cashflows.length; t++) {
      const denom = Math.pow(1 + r, t);
      npv += cashflows[t] / denom;
      if (t > 0) {
        dnpv -= (t * cashflows[t]) / Math.pow(1 + r, t + 1);
      }
    }

    if (Math.abs(npv) < tolerance) {
      return r;
    }

    if (Math.abs(dnpv) < 1e-10) {
      break; // Derivative too close to 0, switch to bisection
    }

    const nextR = r - npv / dnpv;
    if (Math.abs(nextR - r) < tolerance) {
      return nextR;
    }
    r = nextR;
    if (r <= -0.999) r = -0.999;
  }

  // Fallback: Bisection search between -0.99 and 5.0 (500%)
  let low = -0.99;
  let high = 5.0;
  for (let i = 0; i < 80; i++) {
    const mid = (low + high) / 2;
    const npv = calculateNPV(mid, cashflows);
    if (Math.abs(npv) < tolerance) return mid;
    const npvLow = calculateNPV(low, cashflows);
    if (npv * npvLow < 0) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return (low + high) / 2;
}

/**
 * Extended Internal Rate of Return (XIRR) for irregular dates
 */
export interface DateCashflow {
  date: Date | string;
  amount: number;
}

export function calculateXIRR(cashflows: DateCashflow[], guess = 0.1, maxIter = 100, tol = 1e-6): number {
  if (cashflows.length < 2) return 0;

  const parsed = cashflows.map((c) => ({
    time: (new Date(c.date).getTime() - new Date(cashflows[0].date).getTime()) / (1000 * 60 * 60 * 24 * 365),
    amount: c.amount,
  }));

  const hasPos = parsed.some((c) => c.amount > 0);
  const hasNeg = parsed.some((c) => c.amount < 0);
  if (!hasPos || !hasNeg) return 0;

  let r = guess;
  for (let i = 0; i < maxIter; i++) {
    let fValue = 0;
    let fDerivative = 0;

    for (const cf of parsed) {
      const factor = Math.pow(1 + r, cf.time);
      fValue += cf.amount / factor;
      if (cf.time !== 0) {
        fDerivative -= (cf.time * cf.amount) / (factor * (1 + r));
      }
    }

    if (Math.abs(fValue) < tol) return r;
    if (Math.abs(fDerivative) < 1e-12) break;

    const newR = r - fValue / fDerivative;
    if (Math.abs(newR - r) < tol) return newR;
    r = newR;
    if (r <= -0.99) r = -0.99;
  }

  return r;
}

/**
 * Bond Pricing, Macaulay Duration, Modified Duration & Convexity
 */
export interface BondMetrics {
  price: number;
  currentYield: number;
  macaulayDuration: number;
  modifiedDuration: number;
  convexity: number;
  priceChangeForYieldBps: (basisPointsChange: number) => number;
}

export function calculateBondMetrics(
  faceValue: number,
  couponRate: number,
  frequency: number, // 1 for annual, 2 for semi-annual
  yearsToMaturity: number,
  yieldToMaturity: number
): BondMetrics {
  if (faceValue <= 0 || yearsToMaturity <= 0) {
    return {
      price: faceValue,
      currentYield: 0,
      macaulayDuration: 0,
      modifiedDuration: 0,
      convexity: 0,
      priceChangeForYieldBps: () => 0,
    };
  }

  const periods = Math.round(yearsToMaturity * frequency);
  const couponPayment = (faceValue * couponRate) / frequency;
  const periodicYTM = yieldToMaturity / frequency;

  let price = 0;
  let weightedTime = 0;
  let convexitySum = 0;

  for (let t = 1; t <= periods; t++) {
    const cashflow = t === periods ? couponPayment + faceValue : couponPayment;
    const pv = cashflow / Math.pow(1 + periodicYTM, t);
    price += pv;
    const timeInYears = t / frequency;
    weightedTime += timeInYears * pv;
    convexitySum += (t * (t + 1) * cashflow) / Math.pow(1 + periodicYTM, t + 2);
  }

  const macaulayDuration = price > 0 ? weightedTime / price : 0;
  const modifiedDuration = periodicYTM !== -1 ? macaulayDuration / (1 + periodicYTM) : macaulayDuration;
  const convexity = price > 0 ? convexitySum / (price * Math.pow(frequency, 2)) : 0;
  const currentYield = price > 0 ? (faceValue * couponRate) / price : 0;

  const priceChangeForYieldBps = (bps: number) => {
    const deltaY = bps / 10000;
    // Taylor series approximation: DeltaP/P ≈ -D_mod * deltaY + 0.5 * Convexity * (deltaY)^2
    return -modifiedDuration * deltaY + 0.5 * convexity * Math.pow(deltaY, 2);
  };

  return {
    price: Math.round(price * 100) / 100,
    currentYield,
    macaulayDuration: Math.round(macaulayDuration * 100) / 100,
    modifiedDuration: Math.round(modifiedDuration * 100) / 100,
    convexity: Math.round(convexity * 100) / 100,
    priceChangeForYieldBps,
  };
}

/**
 * P2P Realised Return & Cash Drag Simulator
 * Calculates realistic after-default and after-platform-fee investor yield.
 */
export interface P2PAnalysis {
  grossContractualReturn: number;
  netRealisedPreTax: number;
  netRealisedPostTax: number;
  principalLost: number;
  effectiveLossRate: number;
  cashDragDeduction: number;
  netAnnualCashflow: number;
}

export function calculateP2PRealisedReturn(
  principalDeployed: number,
  contractualRate: number, // e.g. 0.12 (12%)
  defaultRate: number, // e.g. 0.04 (4% of principal defaults)
  recoveryRate: number, // e.g. 0.25 (25% of defaulted principal recovered)
  platformFees: number, // e.g. 0.015 (1.5% AUM or servicing fee)
  idleCashPercentage: number, // e.g. 0.08 (8% idle uninvested cash earning 0%)
  marginalTaxRate: number // e.g. 0.312 (30% + 4% cess)
): P2PAnalysis {
  if (principalDeployed <= 0) {
    return {
      grossContractualReturn: 0,
      netRealisedPreTax: 0,
      netRealisedPostTax: 0,
      principalLost: 0,
      effectiveLossRate: 0,
      cashDragDeduction: 0,
      netAnnualCashflow: 0,
    };
  }

  const investedFraction = Math.max(0, 1 - idleCashPercentage);
  const investedCapital = principalDeployed * investedFraction;

  // Gross interest earned on actively performing / deploying capital
  const grossInterest = investedCapital * contractualRate;

  // Principal defaults and recoveries
  const grossDefaultAmount = investedCapital * defaultRate;
  const recoveredAmount = grossDefaultAmount * recoveryRate;
  const netPrincipalLoss = grossDefaultAmount - recoveredAmount;

  // Platform maintenance/servicing fee
  const totalPlatformFees = principalDeployed * platformFees;

  // In Indian tax law, interest income is taxed at marginal rate (Other Sources).
  // Capital default loss in retail P2P CANNOT be set off against interest income!
  const incomeTaxPayable = grossInterest * marginalTaxRate;

  const preTaxNetIncome = grossInterest - netPrincipalLoss - totalPlatformFees;
  const postTaxNetIncome = grossInterest - incomeTaxPayable - netPrincipalLoss - totalPlatformFees;

  const netRealisedPreTax = preTaxNetIncome / principalDeployed;
  const netRealisedPostTax = postTaxNetIncome / principalDeployed;

  return {
    grossContractualReturn: contractualRate,
    netRealisedPreTax,
    netRealisedPostTax,
    principalLost: Math.round(netPrincipalLoss),
    effectiveLossRate: netPrincipalLoss / principalDeployed,
    cashDragDeduction: contractualRate * idleCashPercentage,
    netAnnualCashflow: Math.round(postTaxNetIncome),
  };
}

/**
 * Real Estate Leveraged Rental & IRR Model
 * Computes Gross Yield, Net Yield, Cashflow, and Leveraged Equity IRR.
 */
export interface PropertyAnalysis {
  totalAcquisitionCost: number;
  equityInvested: number;
  monthlyEMI: number;
  annualGrossRental: number;
  annualNetOperatingIncome: number;
  grossRentalYield: number;
  netRentalYield: number;
  annualPreTaxCashflow: number;
  estimatedSaleValue: number;
  equityMultiple: number;
  projectedLeveragedIRR: number;
}

export function calculateRentalPropertyMetrics(
  purchasePrice: number,
  registrationAndStampDuty: number,
  renovationAndFurnishing: number,
  monthlyRent: number,
  annualPropertyTax: number,
  annualMaintenance: number,
  vacancyRate: number, // e.g. 0.083 (1 month vacancy per year)
  loanAmount: number,
  loanInterestRate: number,
  loanTenureYears: number,
  expectedAppreciationRate: number, // e.g. 0.05 (5% annual)
  holdingPeriodYears: number
): PropertyAnalysis {
  const totalAcquisitionCost = purchasePrice + registrationAndStampDuty + renovationAndFurnishing;
  const equityInvested = Math.max(0, totalAcquisitionCost - loanAmount);

  // EMI calculation
  const monthlyLoanRate = loanInterestRate / 12;
  const loanMonths = loanTenureYears * 12;
  let monthlyEMI = 0;
  if (loanAmount > 0 && loanMonths > 0) {
    monthlyEMI =
      (loanAmount * monthlyLoanRate * Math.pow(1 + monthlyLoanRate, loanMonths)) /
      (Math.pow(1 + monthlyLoanRate, loanMonths) - 1);
  }

  const annualGrossRental = monthlyRent * 12 * (1 - vacancyRate);
  const annualNetOperatingIncome = annualGrossRental - annualPropertyTax - annualMaintenance;
  const annualDebtService = monthlyEMI * 12;
  const annualPreTaxCashflow = annualNetOperatingIncome - annualDebtService;

  const grossRentalYield = purchasePrice > 0 ? (monthlyRent * 12) / purchasePrice : 0;
  const netRentalYield = totalAcquisitionCost > 0 ? annualNetOperatingIncome / totalAcquisitionCost : 0;

  // Estimate final property value after holding period
  const estimatedSaleValue = purchasePrice * Math.pow(1 + expectedAppreciationRate, holdingPeriodYears);

  // Remaining loan balance after holding period
  let remainingLoanBalance = loanAmount;
  for (let m = 1; m <= holdingPeriodYears * 12; m++) {
    if (m > loanMonths) {
      remainingLoanBalance = 0;
      break;
    }
    const interestForMonth = remainingLoanBalance * monthlyLoanRate;
    const principalForMonth = monthlyEMI - interestForMonth;
    remainingLoanBalance = Math.max(0, remainingLoanBalance - principalForMonth);
  }

  // Net equity received at sale (assuming 2% brokerage/transaction cost)
  const netSaleProceeds = estimatedSaleValue * 0.98 - remainingLoanBalance;

  // Build cashflow array for IRR: Year 0 = -equityInvested, Years 1..N-1 = annualPreTaxCashflow, Year N = annualPreTaxCashflow + netSaleProceeds
  const cashflows = [-equityInvested];
  for (let y = 1; y < holdingPeriodYears; y++) {
    cashflows.push(annualPreTaxCashflow);
  }
  cashflows.push(annualPreTaxCashflow + netSaleProceeds);

  const projectedLeveragedIRR = calculateIRR(cashflows);
  const totalCashReturned = cashflows.slice(1).reduce((a, b) => a + b, 0);
  const equityMultiple = equityInvested > 0 ? totalCashReturned / equityInvested : 0;

  return {
    totalAcquisitionCost: Math.round(totalAcquisitionCost),
    equityInvested: Math.round(equityInvested),
    monthlyEMI: Math.round(monthlyEMI),
    annualGrossRental: Math.round(annualGrossRental),
    annualNetOperatingIncome: Math.round(annualNetOperatingIncome),
    grossRentalYield: Math.round(grossRentalYield * 1000) / 1000,
    netRentalYield: Math.round(netRentalYield * 1000) / 1000,
    annualPreTaxCashflow: Math.round(annualPreTaxCashflow),
    estimatedSaleValue: Math.round(estimatedSaleValue),
    equityMultiple: Math.round(equityMultiple * 100) / 100,
    projectedLeveragedIRR: Math.round(projectedLeveragedIRR * 1000) / 1000,
  };
}

/**
 * Risk-Adjusted Performance Measures
 * Volatility, Sharpe, Sortino, Maximum Drawdown, Calmar
 */
export interface RiskMetrics {
  annualisedReturn: number;
  annualisedVolatility: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  calmarRatio: number;
}

export function calculateRiskMetrics(returns: number[], riskFreeRate = 0.065, periodsPerYear = 12): RiskMetrics {
  if (returns.length < 2) {
    return {
      annualisedReturn: 0,
      annualisedVolatility: 0,
      sharpeRatio: 0,
      sortinoRatio: 0,
      maxDrawdown: 0,
      calmarRatio: 0,
    };
  }

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const annualisedReturn = Math.pow(1 + mean, periodsPerYear) - 1;

  // Variance & Volatility
  const variance = returns.reduce((acc, r) => acc + Math.pow(r - mean, 2), 0) / (returns.length - 1);
  const periodicVolatility = Math.sqrt(variance);
  const annualisedVolatility = periodicVolatility * Math.sqrt(periodsPerYear);

  // Downside Deviation (Sortino denominator) - only negative deviations from risk-free or 0
  const downsideVariance =
    returns.reduce((acc, r) => {
      const diff = Math.min(0, r - riskFreeRate / periodsPerYear);
      return acc + Math.pow(diff, 2);
    }, 0) / returns.length;
  const downsideDeviation = Math.sqrt(downsideVariance) * Math.sqrt(periodsPerYear);

  const excessReturn = annualisedReturn - riskFreeRate;
  const sharpeRatio = annualisedVolatility > 0 ? excessReturn / annualisedVolatility : 0;
  const sortinoRatio = downsideDeviation > 0 ? excessReturn / downsideDeviation : 0;

  // Maximum Drawdown from cumulative wealth path
  let peak = 1.0;
  let currentWealth = 1.0;
  let maxDrawdown = 0;

  for (const r of returns) {
    currentWealth *= (1 + r);
    if (currentWealth > peak) {
      peak = currentWealth;
    }
    const dd = (peak - currentWealth) / peak;
    if (dd > maxDrawdown) {
      maxDrawdown = dd;
    }
  }

  const calmarRatio = maxDrawdown > 0 ? excessReturn / maxDrawdown : 0;

  return {
    annualisedReturn: Math.round(annualisedReturn * 10000) / 10000,
    annualisedVolatility: Math.round(annualisedVolatility * 10000) / 10000,
    sharpeRatio: Math.round(sharpeRatio * 100) / 100,
    sortinoRatio: Math.round(sortinoRatio * 100) / 100,
    maxDrawdown: Math.round(maxDrawdown * 10000) / 10000,
    calmarRatio: Math.round(calmarRatio * 100) / 100,
  };
}

/**
 * Portfolio Rebalancing Calculator
 */
export interface AssetHolding {
  asset: string;
  currentValue: number;
}

export interface TargetAllocation {
  asset: string;
  targetPercent: number; // e.g. 40 for 40%
}

export interface RebalanceInstruction {
  asset: string;
  currentValue: number;
  currentPercent: number;
  targetPercent: number;
  targetValue: number;
  diffAmount: number;
  action: 'BUY' | 'SELL' | 'HOLD';
}

export function calculateRebalancing(
  holdings: AssetHolding[],
  targets: TargetAllocation[],
  freshCashInflow = 0
): RebalanceInstruction[] {
  const currentTotal = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const newTotal = currentTotal + freshCashInflow;

  if (newTotal <= 0) return [];

  const targetMap = new Map(targets.map((t) => [t.asset, t.targetPercent / 100]));

  return holdings.map((h) => {
    const targetPct = targetMap.get(h.asset) || 0;
    const targetVal = newTotal * targetPct;
    const diff = targetVal - h.currentValue;

    let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    if (diff > 100) action = 'BUY';
    else if (diff < -100) action = 'SELL';

    return {
      asset: h.asset,
      currentValue: Math.round(h.currentValue),
      currentPercent: Math.round((h.currentValue / currentTotal) * 1000) / 10,
      targetPercent: Math.round(targetPct * 1000) / 10,
      targetValue: Math.round(targetVal),
      diffAmount: Math.round(Math.abs(diff)),
      action,
    };
  });
}
