import React, { useState, useMemo } from 'react';
import { calculateP2PRealisedReturn } from '../../lib/finance/formulas';

export const P2PRealisedReturnCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState<number>(500000); // ₹5 Lakhs
  const [contractualRate, setContractualRate] = useState<number>(12.0); // 12%
  const [defaultRate, setDefaultRate] = useState<number>(4.5); // 4.5% default
  const [recoveryRate, setRecoveryRate] = useState<number>(20.0); // 20% recovered
  const [platformFees, setPlatformFees] = useState<number>(1.5); // 1.5%
  const [idleCash, setIdleCash] = useState<number>(8.0); // 8% idle
  const [taxRate, setTaxRate] = useState<number>(31.2); // 30% slab + 4% cess

  const analysis = useMemo(() => {
    return calculateP2PRealisedReturn(
      principal,
      contractualRate / 100,
      defaultRate / 100,
      recoveryRate / 100,
      platformFees / 100,
      idleCash / 100,
      taxRate / 100
    );
  }, [principal, contractualRate, defaultRate, recoveryRate, platformFees, idleCash, taxRate]);

  // Pre-calculated comparison scenarios
  const scenarios = useMemo(() => {
    const opt = calculateP2PRealisedReturn(principal, 0.13, 0.025, 0.35, 0.0125, 0.04, taxRate / 100);
    const base = calculateP2PRealisedReturn(principal, 0.12, 0.045, 0.20, 0.015, 0.08, taxRate / 100);
    const stress = calculateP2PRealisedReturn(principal, 0.11, 0.10, 0.10, 0.0175, 0.14, taxRate / 100);

    return { opt, base, stress };
  }, [principal, taxRate]);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-[#162032] border border-[#24344d] shadow-2xl text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#24344d]">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">⚖️</span>
            P2P Realised Return & Default Simulator
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Quantify the reality gap between advertised headline interest and actual realised returns after defaults, uninvested cash drag, and slab taxes.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold self-start md:self-auto">
          ⚠️ Non-Offsetable Bad Debt Loss
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* Principal */}
          <div className="bg-[#111827]/80 p-4 rounded-2xl border border-[#24344d]">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">Principal Deployed</label>
              <span className="font-mono font-bold text-amber-400">{formatINR(principal)}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="5000000"
              step="50000"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Advertised Rate */}
          <div className="bg-[#111827]/80 p-4 rounded-2xl border border-[#24344d]">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">Gross Advertised Rate</label>
              <span className="font-mono font-bold text-slate-200">{contractualRate.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="8"
              max="24"
              step="0.5"
              value={contractualRate}
              onChange={(e) => setContractualRate(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Default Rate */}
          <div className="bg-[#111827]/80 p-4 rounded-2xl border border-[#24344d]">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">Expected Borrower Default Rate</label>
              <span className="font-mono font-bold text-rose-400">{defaultRate.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="0.5"
              value={defaultRate}
              onChange={(e) => setDefaultRate(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Recovery Rate */}
          <div className="bg-[#111827]/80 p-4 rounded-2xl border border-[#24344d]">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">Recovery Rate on Defaulted Loans</label>
              <span className="font-mono font-bold text-slate-200">{recoveryRate.toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={recoveryRate}
              onChange={(e) => setRecoveryRate(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Cash Drag & Platform Fee */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111827]/80 p-3 rounded-xl border border-[#24344d]">
              <label className="text-xs text-slate-400 block mb-1">Idle Cash Drag %</label>
              <input
                type="number"
                min="0"
                max="30"
                step="1"
                value={idleCash}
                onChange={(e) => setIdleCash(Number(e.target.value))}
                className="w-full bg-[#1e2c44] border border-[#24344d] rounded p-1.5 text-sm font-mono text-slate-200"
              />
            </div>
            <div className="bg-[#111827]/80 p-3 rounded-xl border border-[#24344d]">
              <label className="text-xs text-slate-400 block mb-1">Your Tax Bracket</label>
              <select
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full bg-[#1e2c44] border border-[#24344d] rounded p-1.5 text-sm font-mono text-slate-200"
              >
                <option value={0}>0% Slab</option>
                <option value={20.8}>20% Slab</option>
                <option value={31.2}>30% Slab (31.2%)</option>
                <option value={39}>Surcharge Slab (39%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* Main Visual Yield Comparison */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111827] to-[#1e2c44] border border-[#24344d] space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-wider text-slate-400">Yield Breakdown</span>
              <span className="text-xs text-amber-400">On {formatINR(principal)}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-[#24344d]">
              <div>
                <span className="text-xs text-slate-500 block">Gross Contractual</span>
                <span className="text-xl font-bold font-mono text-slate-300">{(contractualRate).toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Realised Pre-Tax</span>
                <span className="text-xl font-bold font-mono text-amber-400">{(analysis.netRealisedPreTax * 100).toFixed(2)}%</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Realised Post-Tax</span>
                <span className="text-xl font-bold font-mono text-emerald-400">{(analysis.netRealisedPostTax * 100).toFixed(2)}%</span>
              </div>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Principal Permanently Lost:</span>
                <span className="font-mono text-rose-400 font-semibold">{formatINR(analysis.principalLost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Annual Cash Drag Erosion:</span>
                <span className="font-mono text-amber-400">{(analysis.cashDragDeduction * 100).toFixed(2)}% yield loss</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 font-semibold text-slate-200">
                <span>Net Annual Take-Home Cash:</span>
                <span className="font-mono text-emerald-400 text-sm">{formatINR(analysis.netAnnualCashflow)}</span>
              </div>
            </div>
          </div>

          {/* Scenario Comparison Table */}
          <div className="bg-[#111827] rounded-2xl border border-[#24344d] p-4 overflow-hidden">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Economic Stress Test Scenarios
            </h4>
            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              {/* Optimistic */}
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                <span className="font-bold text-emerald-400 block mb-1">Optimistic</span>
                <div className="text-slate-400">Defaults: 2.5%</div>
                <div className="text-slate-400">Idle Cash: 4.0%</div>
                <div className="mt-2 text-sm font-extrabold text-emerald-300">
                  +{(scenarios.opt.netRealisedPostTax * 100).toFixed(2)}% Net
                </div>
              </div>

              {/* Base */}
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20">
                <span className="font-bold text-amber-400 block mb-1">Base Case</span>
                <div className="text-slate-400">Defaults: 4.5%</div>
                <div className="text-slate-400">Idle Cash: 8.0%</div>
                <div className="mt-2 text-sm font-extrabold text-amber-300">
                  +{(scenarios.base.netRealisedPostTax * 100).toFixed(2)}% Net
                </div>
              </div>

              {/* Stressed */}
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20">
                <span className="font-bold text-rose-400 block mb-1">Stressed</span>
                <div className="text-slate-400">Defaults: 10.0%</div>
                <div className="text-slate-400">Idle Cash: 14.0%</div>
                <div className="mt-2 text-sm font-extrabold text-rose-400">
                  {(scenarios.stress.netRealisedPostTax * 100).toFixed(2)}% Net
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default P2PRealisedReturnCalculator;
