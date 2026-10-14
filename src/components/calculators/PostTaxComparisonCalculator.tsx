import React, { useState, useMemo } from 'react';
import { INDIAN_TAX_RULES_REGISTRY, calculateInvestmentTax } from '../../lib/taxation/taxRules';

export const PostTaxComparisonCalculator: React.FC = () => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(500000); // ₹5 Lakhs
  const [holdingMonths, setHoldingMonths] = useState<number>(36); // 3 Years
  const [marginalTaxRate, setMarginalTaxRate] = useState<number>(0.312); // 30% slab + 4% cess

  // Asset return assumptions for fair comparison
  const assetScenarios = [
    {
      ruleId: 'listed_equity_shares',
      name: 'Listed Equity / Equity Index Fund',
      assumedCagr: 0.125,
      icon: '📈',
    },
    {
      ruleId: 'arbitrage_mutual_fund',
      name: 'Arbitrage Mutual Fund',
      assumedCagr: 0.072,
      icon: '⚖️',
    },
    {
      ruleId: 'bank_fixed_deposits',
      name: 'Bank Fixed Deposit',
      assumedCagr: 0.072,
      icon: '🏦',
    },
    {
      ruleId: 'debt_mutual_funds_specified',
      name: 'Specified Debt Mutual Fund (Sec 50AA)',
      assumedCagr: 0.072,
      icon: '📄',
    },
    {
      ruleId: 'sovereign_gold_bonds',
      name: 'Sovereign Gold Bond (SGB)',
      assumedCagr: 0.105, // Gold price + 2.5% coupon
      icon: '✨',
    },
    {
      ruleId: 'reits_and_invits',
      name: 'Commercial REIT (Listed)',
      assumedCagr: 0.11,
      icon: '🏢',
    },
  ];

  const results = useMemo(() => {
    const years = holdingMonths / 12;

    return assetScenarios.map((asset) => {
      // Calculate terminal gross value
      const terminalValue = Math.round(investmentAmount * Math.pow(1 + asset.assumedCagr, years));
      const grossGain = terminalValue - investmentAmount;

      let taxResult;
      try {
        taxResult = calculateInvestmentTax({
          ruleId: asset.ruleId,
          purchaseCost: investmentAmount,
          saleValue: terminalValue,
          holdingPeriodMonths: holdingMonths,
          investorMarginalTaxRate: marginalTaxRate,
        });
      } catch (err) {
        // Fallback for custom rules
        taxResult = {
          grossGain,
          isLongTerm: holdingMonths > 12,
          applicableRate: 0.2,
          taxableGainAmount: grossGain,
          taxPayable: Math.round(grossGain * 0.2),
          netPostTaxProceeds: terminalValue - Math.round(grossGain * 0.2),
          netPostTaxGain: grossGain - Math.round(grossGain * 0.2),
          effectiveTaxRateOnGain: 0.2,
          statutoryReference: 'Section 111A/112',
        };
      }

      // Net realized post-tax CAGR
      const postTaxCAGR =
        taxResult.netPostTaxProceeds > investmentAmount && years > 0
          ? Math.pow(taxResult.netPostTaxProceeds / investmentAmount, 1 / years) - 1
          : 0;

      return {
        ...asset,
        terminalValue,
        grossGain,
        taxPayable: taxResult.taxPayable,
        netProceeds: taxResult.netPostTaxProceeds,
        netGain: taxResult.netPostTaxGain,
        effectiveTaxRate: taxResult.effectiveTaxRateOnGain * 100,
        postTaxCAGR: postTaxCAGR * 100,
        statutorySection: taxResult.statutoryReference,
      };
    });
  }, [investmentAmount, holdingMonths, marginalTaxRate]);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-[#162032] border border-[#24344d] shadow-2xl text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#24344d]">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">🏛️</span>
            Post-Tax Asset Comparison Radar (Finance Act 2024)
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Compare actual net take-home wealth across major Indian investment vehicles under current statutory tax provisions.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold self-start md:self-auto">
          Updated AY 2025-26
        </div>
      </div>

      {/* Inputs Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-5 rounded-2xl bg-[#111827] border border-[#24344d]">
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Investment Capital</label>
          <input
            type="number"
            min="10000"
            max="10000000"
            step="50000"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(Math.max(10000, Number(e.target.value)))}
            className="w-full bg-[#1e2c44] border border-[#24344d] rounded-lg p-2 font-mono text-emerald-400 font-bold focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Holding Duration (Months)</label>
          <input
            type="number"
            min="1"
            max="120"
            value={holdingMonths}
            onChange={(e) => setHoldingMonths(Math.max(1, Number(e.target.value)))}
            className="w-full bg-[#1e2c44] border border-[#24344d] rounded-lg p-2 font-mono text-slate-200 font-bold focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Your Income Tax Slab</label>
          <select
            value={marginalTaxRate}
            onChange={(e) => setMarginalTaxRate(Number(e.target.value))}
            className="w-full bg-[#1e2c44] border border-[#24344d] rounded-lg p-2 text-sm text-slate-200 focus:outline-none"
          >
            <option value={0}>0% Slab (Below threshold)</option>
            <option value={0.208}>20% Slab + Cess (20.8%)</option>
            <option value={0.312}>30% Slab + Cess (31.2%)</option>
            <option value={0.39}>Highest Surcharge Slab (39.0%)</option>
          </select>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm font-mono border-collapse">
          <thead>
            <tr className="border-b border-[#24344d] text-slate-400 text-xs uppercase tracking-wider">
              <th className="py-3 px-4">Investment Vehicle</th>
              <th className="py-3 px-4">Gross Nominal Gain</th>
              <th className="py-3 px-4 text-rose-400">Tax Payable</th>
              <th className="py-3 px-4 text-emerald-400">Net Take-Home Cash</th>
              <th className="py-3 px-4">Effective Tax</th>
              <th className="py-3 px-4">Post-Tax CAGR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#24344d]/50">
            {results.map((r) => (
              <tr key={r.ruleId} className="hover:bg-[#111827]/60 transition-colors">
                <td className="py-4 px-4 font-sans font-medium text-slate-200 flex items-center gap-2">
                  <span className="text-lg">{r.icon}</span>
                  <div>
                    <div>{r.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{r.statutorySection}</div>
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-300">+{formatINR(r.grossGain)}</td>
                <td className="py-4 px-4 text-rose-400 font-semibold">
                  {r.taxPayable > 0 ? `-${formatINR(r.taxPayable)}` : '₹0 (Tax Free)'}
                </td>
                <td className="py-4 px-4 text-emerald-400 font-extrabold">{formatINR(r.netProceeds)}</td>
                <td className="py-4 px-4 text-slate-400">{r.effectiveTaxRate.toFixed(1)}%</td>
                <td className="py-4 px-4 text-white font-bold">{r.postTaxCAGR.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-slate-900/60 border border-[#24344d] text-xs text-slate-400 flex items-center justify-between">
        <span>💡 Notice how Arbitrage Funds deliver vastly higher take-home returns than Bank Fixed Deposits for the 30% slab due to equity capital gains taxation.</span>
      </div>
    </div>
  );
};

export default PostTaxComparisonCalculator;
