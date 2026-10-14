import React, { useState, useMemo } from 'react';
import { calculateSIP, calculateRealReturn } from '../../lib/finance/formulas';

export const SIPCalculator: React.FC = () => {
  const [monthlyAmount, setMonthlyAmount] = useState<number>(15000);
  const [annualReturn, setAnnualReturn] = useState<number>(12.5);
  const [years, setYears] = useState<number>(15);
  const [stepUpPercent, setStepUpPercent] = useState<number>(0);
  const [inflationRate, setInflationRate] = useState<number>(6.0);

  // Compute SIP with step-up support
  const { investedAmount, nominalCorpus, estimatedReturns, realCorpus, yearlyData } = useMemo(() => {
    let currentMonthly = monthlyAmount;
    let totalInvested = 0;
    let corpus = 0;
    const monthlyRate = (annualReturn / 100) / 12;
    const data: Array<{ year: number; monthly: number; invested: number; total: number; returns: number }> = [];

    for (let y = 1; y <= years; y++) {
      if (y > 1 && stepUpPercent > 0) {
        currentMonthly = Math.round(currentMonthly * (1 + stepUpPercent / 100));
      }

      for (let m = 1; m <= 12; m++) {
        totalInvested += currentMonthly;
        corpus = (corpus + currentMonthly) * (1 + monthlyRate);
      }

      data.push({
        year: y,
        monthly: currentMonthly,
        invested: Math.round(totalInvested),
        total: Math.round(corpus),
        returns: Math.round(corpus - totalInvested),
      });
    }

    const realReturnRate = calculateRealReturn(annualReturn / 100, inflationRate / 100);
    // Real purchasing power of terminal corpus
    const inflationDiscount = Math.pow(1 + inflationRate / 100, years);
    const adjustedRealCorpus = Math.round(corpus / inflationDiscount);

    return {
      investedAmount: Math.round(totalInvested),
      nominalCorpus: Math.round(corpus),
      estimatedReturns: Math.round(corpus - totalInvested),
      realCorpus: adjustedRealCorpus,
      yearlyData: data,
    };
  }, [monthlyAmount, annualReturn, years, stepUpPercent, inflationRate]);

  // Formatter for Indian Rupees
  const formatINR = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const investedRatio = nominalCorpus > 0 ? (investedAmount / nominalCorpus) * 100 : 0;
  const returnsRatio = nominalCorpus > 0 ? (estimatedReturns / nominalCorpus) * 100 : 0;

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-[#162032] border border-[#24344d] shadow-2xl text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#24344d]">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">📈</span>
            SIP & Wealth Accumulation Calculator
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Simulate monthly compounding, annual salary step-ups, and inflation-adjusted real purchasing power.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold self-start md:self-auto">
          <span>✓ Inflation Adjusted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Monthly Investment */}
          <div className="bg-[#111827]/80 p-5 rounded-2xl border border-[#24344d]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">Monthly Contribution</label>
              <div className="flex items-center gap-1 font-mono font-bold text-emerald-400">
                <span>₹</span>
                <input
                  type="number"
                  min="500"
                  max="1000000"
                  step="500"
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(Math.max(500, Number(e.target.value)))}
                  className="w-24 bg-[#1e2c44] px-2 py-0.5 rounded text-right border border-[#24344d] focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <input
              type="range"
              min="1000"
              max="200000"
              step="1000"
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>₹1,000</span>
              <span>₹50,000</span>
              <span>₹1 Lakh</span>
              <span>₹2 Lakhs</span>
            </div>
          </div>

          {/* Expected Annual Return */}
          <div className="bg-[#111827]/80 p-5 rounded-2xl border border-[#24344d]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">Expected Annual Return (CAGR)</label>
              <span className="font-mono font-bold text-emerald-400">{annualReturn.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="4"
              max="25"
              step="0.5"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>4% (Debt)</span>
              <span>8% (Conservative)</span>
              <span>12.5% (Equity)</span>
              <span>18% (Aggressive)</span>
            </div>
          </div>

          {/* Horizon in Years */}
          <div className="bg-[#111827]/80 p-5 rounded-2xl border border-[#24344d]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">Investment Horizon</label>
              <span className="font-mono font-bold text-emerald-400">{years} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1 Yr</span>
              <span>10 Yrs</span>
              <span>20 Yrs</span>
              <span>30 Yrs</span>
              <span>40 Yrs</span>
            </div>
          </div>

          {/* Advanced Adjustments: Step-up & Inflation */}
          <div className="p-4 rounded-2xl bg-[#0f172a] border border-[#24344d]/60 space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Advanced Reality Adjustments</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Annual Step-Up %</label>
                <select
                  value={stepUpPercent}
                  onChange={(e) => setStepUpPercent(Number(e.target.value))}
                  className="w-full bg-[#1e2c44] border border-[#24344d] rounded-lg p-2 text-sm text-slate-200 focus:outline-none"
                >
                  <option value={0}>0% (Flat SIP)</option>
                  <option value={5}>+5% Every Year</option>
                  <option value={10}>+10% Every Year</option>
                  <option value={15}>+15% Every Year</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Inflation Drag Rate</label>
                <select
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-full bg-[#1e2c44] border border-[#24344d] rounded-lg p-2 text-sm text-slate-200 focus:outline-none"
                >
                  <option value={0}>0% (Nominal Only)</option>
                  <option value={5}>5.0% (RBI Target)</option>
                  <option value={6}>6.0% (India Average)</option>
                  <option value={7.5}>7.5% (Urban Lifestyle)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results & Visuals Column */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* Headline Numbers Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#111827] border border-[#24344d]">
              <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">Total Capital Invested</span>
              <span className="text-2xl md:text-3xl font-extrabold text-slate-200 font-mono">{formatINR(investedAmount)}</span>
              <span className="text-xs text-slate-500 block mt-1">Across {years * 12} Monthly Installments</span>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
              <span className="text-xs uppercase tracking-wider text-emerald-400 block mb-1">Estimated Returns</span>
              <span className="text-2xl md:text-3xl font-extrabold text-emerald-400 font-mono">+{formatINR(estimatedReturns)}</span>
              <span className="text-xs text-emerald-500/80 block mt-1">Pure Compounded Growth</span>
            </div>
          </div>

          {/* Main Total Highlight */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1e2c44] to-[#162032] border border-emerald-500/40 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-emerald-500/5 blur-2xl pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-2">
              <span className="text-sm font-semibold text-slate-300">Terminal Nominal Corpus</span>
              <span className="text-xs text-slate-400">At Year {years}</span>
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-white font-mono tracking-tight mb-4">
              {formatINR(nominalCorpus)}
            </div>

            {/* Proportion Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Principal: {investedRatio.toFixed(1)}%</span>
                <span className="text-emerald-400">Wealth Gain: {returnsRatio.toFixed(1)}%</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div style={{ width: `${investedRatio}%` }} className="bg-slate-400 transition-all duration-300" />
                <div style={{ width: `${returnsRatio}%` }} className="bg-emerald-500 transition-all duration-300" />
              </div>
            </div>

            {/* Real Purchasing Power Callout */}
            {inflationRate > 0 && (
              <div className="mt-4 pt-4 border-t border-[#24344d] flex items-center justify-between text-xs">
                <span className="text-slate-400">Real Purchasing Power in Today's Money ({inflationRate}% inflation):</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{formatINR(realCorpus)}</span>
              </div>
            )}
          </div>

          {/* Yearly Milestones Snapshot */}
          <div className="bg-[#111827] rounded-2xl border border-[#24344d] p-4 overflow-hidden">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Compounding Trajectory</span>
              <span className="text-xs text-slate-500">Yearly Milestones</span>
            </div>
            <div className="max-h-48 overflow-y-auto text-xs font-mono space-y-1 pr-1">
              <div className="grid grid-cols-4 text-slate-400 font-semibold pb-1 border-b border-slate-800">
                <span>Year</span>
                <span>Monthly</span>
                <span>Invested</span>
                <span className="text-right">Corpus</span>
              </div>
              {yearlyData.map((d) => (
                <div key={d.year} className="grid grid-cols-4 py-1 border-b border-slate-900/50 hover:bg-[#1e2c44]/50 transition-colors">
                  <span className="text-slate-400">Yr {d.year}</span>
                  <span className="text-slate-300">₹{d.monthly.toLocaleString('en-IN')}</span>
                  <span className="text-slate-400">{formatINR(d.invested)}</span>
                  <span className="text-right font-bold text-emerald-400">{formatINR(d.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SIPCalculator;
