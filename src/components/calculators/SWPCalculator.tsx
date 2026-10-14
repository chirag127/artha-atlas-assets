import React, { useState, useMemo } from 'react';
import { calculateSWP } from '../../lib/finance/formulas';

export const SWPCalculator: React.FC = () => {
  const [corpus, setCorpus] = useState<number>(10000000); // ₹1 Crore
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState<number>(60000);
  const [annualReturn, setAnnualReturn] = useState<number>(8.5);
  const [years, setYears] = useState<number>(25);
  const [inflationStepUp, setInflationStepUp] = useState<number>(6.0);

  const result = useMemo(() => {
    return calculateSWP(corpus, monthlyWithdrawal, annualReturn / 100, years, inflationStepUp / 100);
  }, [corpus, monthlyWithdrawal, annualReturn, years, inflationStepUp]);

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const isDepleted = result.depletedMonth !== null;

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-[#162032] border border-[#24344d] shadow-2xl text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#24344d]">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">🏖️</span>
            SWP & Retirement Cashflow Sustainability Simulator
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Simulate monthly living withdrawals, inflation escalation, and portfolio depletion risk across retirement.
          </p>
        </div>
        <div
          className={`px-3 py-1.5 rounded-full border text-xs font-semibold self-start md:self-auto ${
            isDepleted
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}
        >
          {isDepleted ? `⚠️ Depleted at Month ${result.depletedMonth}` : '✓ Portfolio Sustained'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Initial Corpus */}
          <div className="bg-[#111827]/80 p-5 rounded-2xl border border-[#24344d]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">Initial Retirement Corpus</label>
              <span className="font-mono font-bold text-blue-400">{formatINR(corpus)}</span>
            </div>
            <input
              type="range"
              min="1000000"
              max="100000000"
              step="500000"
              value={corpus}
              onChange={(e) => setCorpus(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>₹10 Lakhs</span>
              <span>₹1 Crore</span>
              <span>₹5 Crores</span>
              <span>₹10 Crores</span>
            </div>
          </div>

          {/* Monthly Withdrawal */}
          <div className="bg-[#111827]/80 p-5 rounded-2xl border border-[#24344d]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">Initial Monthly Withdrawal</label>
              <span className="font-mono font-bold text-blue-400">₹{monthlyWithdrawal.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="500000"
              step="5000"
              value={monthlyWithdrawal}
              onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>₹10,000</span>
              <span>₹50,000</span>
              <span>₹1 Lakh</span>
              <span>₹5 Lakhs</span>
            </div>
          </div>

          {/* Expected Portfolio Return */}
          <div className="bg-[#111827]/80 p-5 rounded-2xl border border-[#24344d]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">Portfolio Return Rate</label>
              <span className="font-mono font-bold text-blue-400">{annualReturn.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="4"
              max="16"
              step="0.5"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>6% (Conservative Debt)</span>
              <span>8.5% (Balanced)</span>
              <span>12% (Equity-heavy)</span>
            </div>
          </div>

          {/* Horizon & Inflation */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111827]/80 p-4 rounded-2xl border border-[#24344d]">
              <label className="text-xs text-slate-400 block mb-1">Horizon (Years)</label>
              <input
                type="number"
                min="5"
                max="50"
                value={years}
                onChange={(e) => setYears(Math.max(1, Number(e.target.value)))}
                className="w-full bg-[#1e2c44] border border-[#24344d] rounded-lg p-2 text-sm text-slate-200 font-mono"
              />
            </div>
            <div className="bg-[#111827]/80 p-4 rounded-2xl border border-[#24344d]">
              <label className="text-xs text-slate-400 block mb-1">Annual Inflation Step-Up %</label>
              <input
                type="number"
                min="0"
                max="12"
                step="0.5"
                value={inflationStepUp}
                onChange={(e) => setInflationStepUp(Number(e.target.value))}
                className="w-full bg-[#1e2c44] border border-[#24344d] rounded-lg p-2 text-sm text-slate-200 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#111827] border border-[#24344d]">
              <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">Total Withdrawn Cash</span>
              <span className="text-2xl md:text-3xl font-extrabold text-blue-400 font-mono">{formatINR(result.totalWithdrawn)}</span>
              <span className="text-xs text-slate-500 block mt-1">Received for Living Expenses</span>
            </div>
            <div
              className={`p-5 rounded-2xl border ${
                isDepleted
                  ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
              }`}
            >
              <span className="text-xs uppercase tracking-wider block mb-1">Remaining Final Corpus</span>
              <span className="text-2xl md:text-3xl font-extrabold font-mono">{formatINR(result.finalCorpus)}</span>
              <span className="text-xs opacity-75 block mt-1">
                {isDepleted ? `Exhausted in Year ${(result.depletedMonth! / 12).toFixed(1)}` : `At End of Year ${years}`}
              </span>
            </div>
          </div>

          {/* Depletion Alert if Applicable */}
          {isDepleted && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <strong className="block font-semibold">Portfolio Ruin Alert!</strong>
                At ₹{monthlyWithdrawal.toLocaleString('en-IN')}/month with {inflationStepUp}% annual step-up, your corpus will run out of money in Month {result.depletedMonth} (Year {(result.depletedMonth! / 12).toFixed(1)}). Consider reducing initial withdrawals or allocating a larger sleeve to growth assets.
              </div>
            </div>
          )}

          {/* Milestone Table */}
          <div className="bg-[#111827] rounded-2xl border border-[#24344d] p-4 overflow-hidden">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Withdrawal History</span>
              <span className="text-xs text-slate-500">5-Year Interval Samples</span>
            </div>
            <div className="max-h-48 overflow-y-auto text-xs font-mono space-y-1 pr-1">
              <div className="grid grid-cols-3 text-slate-400 font-semibold pb-1 border-b border-slate-800">
                <span>Year</span>
                <span>Annual Withdrawal</span>
                <span className="text-right">Corpus Balance</span>
              </div>
              {result.history.map((h) => (
                <div key={h.year} className="grid grid-cols-3 py-1 border-b border-slate-900/50">
                  <span className="text-slate-400">Year {h.year}</span>
                  <span className="text-slate-300">{formatINR(h.withdrawalAmount)}</span>
                  <span className={`text-right font-bold ${h.remainingCorpus > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatINR(h.remainingCorpus)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SWPCalculator;
