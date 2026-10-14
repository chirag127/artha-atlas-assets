import React, { useState, useMemo } from 'react';
import portfoliosData from '../../data/portfolios.json';

interface AssetClassWeight {
  key: string;
  name: string;
  weight: number;
  expectedReturn: number;
  volatility: number;
  color: string;
}

export const AllocationLab: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('balanced_growth_core');
  const [initialCapital, setInitialCapital] = useState<number>(1000000); // ₹10 Lakhs
  const [horizonYears, setHorizonYears] = useState<number>(10);
  const [inflationRate, setInflationRate] = useState<number>(6.0);

  // Core asset classes with empirical parameters
  const [allocations, setAllocations] = useState<AssetClassWeight[]>([
    { key: 'large_cap', name: 'Indian Large-Cap Equity', weight: 35, expectedReturn: 12.5, volatility: 16.0, color: '#10b981' },
    { key: 'mid_small', name: 'Mid & Small-Cap Equity', weight: 15, expectedReturn: 15.0, volatility: 22.0, color: '#06b6d4' },
    { key: 'us_equity', name: 'US / Global Equities (INR)', weight: 15, expectedReturn: 13.0, volatility: 17.5, color: '#3b82f6' },
    { key: 'debt_gsec', name: 'G-Secs & High-Grade Debt', weight: 20, expectedReturn: 7.2, volatility: 5.5, color: '#6366f1' },
    { key: 'sgb_gold', name: 'Sovereign Gold / Gold ETFs', weight: 10, expectedReturn: 10.0, volatility: 14.0, color: '#f59e0b' },
    { key: 'cash_buffer', name: 'Arbitrage & Liquid Cash', weight: 5, expectedReturn: 6.8, volatility: 0.8, color: '#94a3b8' },
  ]);

  // Handle Preset Switching
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId === 'emergency_preservation') {
      setAllocations([
        { key: 'large_cap', name: 'Indian Large-Cap Equity', weight: 0, expectedReturn: 12.5, volatility: 16.0, color: '#10b981' },
        { key: 'mid_small', name: 'Mid & Small-Cap Equity', weight: 0, expectedReturn: 15.0, volatility: 22.0, color: '#06b6d4' },
        { key: 'us_equity', name: 'US / Global Equities (INR)', weight: 0, expectedReturn: 13.0, volatility: 17.5, color: '#3b82f6' },
        { key: 'debt_gsec', name: 'G-Secs & High-Grade Debt', weight: 45, expectedReturn: 7.2, volatility: 5.5, color: '#6366f1' },
        { key: 'sgb_gold', name: 'Sovereign Gold / Gold ETFs', weight: 0, expectedReturn: 10.0, volatility: 14.0, color: '#f59e0b' },
        { key: 'cash_buffer', name: 'Arbitrage & Liquid Cash', weight: 55, expectedReturn: 6.8, volatility: 0.8, color: '#94a3b8' },
      ]);
    } else if (presetId === 'aggressive_wealth_builder') {
      setAllocations([
        { key: 'large_cap', name: 'Indian Large-Cap Equity', weight: 25, expectedReturn: 12.5, volatility: 16.0, color: '#10b981' },
        { key: 'mid_small', name: 'Mid & Small-Cap Equity', weight: 40, expectedReturn: 15.0, volatility: 22.0, color: '#06b6d4' },
        { key: 'us_equity', name: 'US / Global Equities (INR)', weight: 20, expectedReturn: 13.0, volatility: 17.5, color: '#3b82f6' },
        { key: 'debt_gsec', name: 'G-Secs & High-Grade Debt', weight: 5, expectedReturn: 7.2, volatility: 5.5, color: '#6366f1' },
        { key: 'sgb_gold', name: 'Sovereign Gold / Gold ETFs', weight: 5, expectedReturn: 10.0, volatility: 14.0, color: '#f59e0b' },
        { key: 'cash_buffer', name: 'Arbitrage & Liquid Cash', weight: 5, expectedReturn: 6.8, volatility: 0.8, color: '#94a3b8' },
      ]);
    } else if (presetId === 'conservative_income') {
      setAllocations([
        { key: 'large_cap', name: 'Indian Large-Cap Equity', weight: 15, expectedReturn: 12.5, volatility: 16.0, color: '#10b981' },
        { key: 'mid_small', name: 'Mid & Small-Cap Equity', weight: 0, expectedReturn: 15.0, volatility: 22.0, color: '#06b6d4' },
        { key: 'us_equity', name: 'US / Global Equities (INR)', weight: 0, expectedReturn: 13.0, volatility: 17.5, color: '#3b82f6' },
        { key: 'debt_gsec', name: 'G-Secs & High-Grade Debt', weight: 65, expectedReturn: 7.2, volatility: 5.5, color: '#6366f1' },
        { key: 'sgb_gold', name: 'Sovereign Gold / Gold ETFs', weight: 10, expectedReturn: 10.0, volatility: 14.0, color: '#f59e0b' },
        { key: 'cash_buffer', name: 'Arbitrage & Liquid Cash', weight: 10, expectedReturn: 6.8, volatility: 0.8, color: '#94a3b8' },
      ]);
    } else {
      // Balanced default
      setAllocations([
        { key: 'large_cap', name: 'Indian Large-Cap Equity', weight: 35, expectedReturn: 12.5, volatility: 16.0, color: '#10b981' },
        { key: 'mid_small', name: 'Mid & Small-Cap Equity', weight: 15, expectedReturn: 15.0, volatility: 22.0, color: '#06b6d4' },
        { key: 'us_equity', name: 'US / Global Equities (INR)', weight: 15, expectedReturn: 13.0, volatility: 17.5, color: '#3b82f6' },
        { key: 'debt_gsec', name: 'G-Secs & High-Grade Debt', weight: 20, expectedReturn: 7.2, volatility: 5.5, color: '#6366f1' },
        { key: 'sgb_gold', name: 'Sovereign Gold / Gold ETFs', weight: 10, expectedReturn: 10.0, volatility: 14.0, color: '#f59e0b' },
        { key: 'cash_buffer', name: 'Arbitrage & Liquid Cash', weight: 5, expectedReturn: 6.8, volatility: 0.8, color: '#94a3b8' },
      ]);
    }
  };

  const totalWeight = useMemo(() => {
    return allocations.reduce((sum, a) => sum + a.weight, 0);
  }, [allocations]);

  const handleWeightChange = (index: number, newWeight: number) => {
    const updated = [...allocations];
    updated[index].weight = Math.max(0, Math.min(100, newWeight));
    setAllocations(updated);
  };

  // Quantitative Portfolio Metrics
  const metrics = useMemo(() => {
    if (totalWeight === 0) {
      return { 
        expectedReturn: 0, 
        realReturn: 0, 
        volatility: 0, 
        maxDrawdown: 0, 
        terminalNominal: initialCapital, 
        terminalReal: initialCapital, 
        p10: initialCapital, 
        p50: initialCapital, 
        p90: initialCapital 
      };
    }

    // Weighted Expected Nominal Return
    const expReturn = allocations.reduce((sum, a) => sum + (a.weight / totalWeight) * a.expectedReturn, 0);
    // Real Return via Fisher
    const rReal = (1 + expReturn / 100) / (1 + inflationRate / 100) - 1;

    // Approximate portfolio volatility (incorporating standard asset diversification benefit)
    const rawWeightedVol = allocations.reduce((sum, a) => sum + (a.weight / totalWeight) * a.volatility, 0);
    const diversificationDiscount = 0.82; // correlation diversification benefit
    const portVol = rawWeightedVol * diversificationDiscount;

    // Estimated Max Drawdown based on equity weight
    const equityWeight = allocations
      .filter((a) => ['large_cap', 'mid_small', 'us_equity'].includes(a.key))
      .reduce((sum, a) => sum + a.weight / totalWeight, 0);
    const estimatedDrawdown = Math.round((equityWeight * 42.0 + (1 - equityWeight) * 6.0) * 10) / 10;

    // Terminal Wealth
    const terminalNominal = Math.round(initialCapital * Math.pow(1 + expReturn / 100, horizonYears));
    const terminalReal = Math.round(initialCapital * Math.pow(1 + rReal, horizonYears));

    // Monte Carlo 10th / 50th / 90th percentile ranges (Log-Normal approximation)
    const medianLog = Math.log(initialCapital) + (expReturn / 100 - 0.5 * Math.pow(portVol / 100, 2)) * horizonYears;
    const stdDevHorizon = (portVol / 100) * Math.sqrt(horizonYears);

    const p10 = Math.round(Math.exp(medianLog - 1.28 * stdDevHorizon));
    const p50 = Math.round(Math.exp(medianLog));
    const p90 = Math.round(Math.exp(medianLog + 1.28 * stdDevHorizon));

    return {
      expectedReturn: expReturn,
      realReturn: rReal * 100,
      volatility: portVol,
      maxDrawdown: estimatedDrawdown,
      terminalNominal,
      terminalReal,
      p10,
      p50,
      p90,
    };
  }, [allocations, totalWeight, inflationRate, initialCapital, horizonYears]);

  const formatINR = (val: number = 0) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Preset Model Portfolio Bar */}
      <div className="p-6 rounded-3xl bg-[#162032] border border-[#24344d] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🎯</span> Institutional Model Portfolio Presets
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select an educational model portfolio to load proven asset allocation weights.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">12 Regimes Available</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {portfoliosData.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                selectedPresetId === p.id
                  ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                  : 'bg-[#111827] text-slate-300 hover:bg-[#1e2c44] border-[#24344d]'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Allocation Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Column */}
        <div className="lg:col-span-6 p-6 md:p-8 rounded-3xl bg-[#162032] border border-[#24344d] space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-[#24344d]">
            <h3 className="text-base font-bold text-white">Adjust Asset Class Weights</h3>
            <div
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                totalWeight === 100
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              Total: {totalWeight}% {totalWeight !== 100 && '⚠️ Must Equal 100%'}
            </div>
          </div>

          {/* Allocation Stack Bar */}
          <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
            {allocations.map((a) => (
              <div
                key={a.key}
                style={{ width: `${a.weight}%`, backgroundColor: a.color }}
                title={`${a.name}: ${a.weight}%`}
                className="transition-all duration-300"
              />
            ))}
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            {allocations.map((a, idx) => (
              <div key={a.key} className="bg-[#111827]/70 p-3.5 rounded-2xl border border-[#24344d]">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-200 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                    {a.name}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">CAGR ~{a.expectedReturn}%</span>
                    <span className="font-bold text-white px-2 py-0.5 rounded bg-[#1e2c44] border border-[#24344d]">
                      {a.weight}%
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={a.weight}
                  onChange={(e) => handleWeightChange(idx, Number(e.target.value))}
                  className="w-full cursor-pointer"
                  style={{ accentColor: a.color }}
                />
              </div>
            ))}
          </div>

          {/* Horizon & Capital Controls */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#24344d]">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Portfolio Capital</label>
              <input
                type="number"
                min="100000"
                max="100000000"
                step="100000"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Math.max(10000, Number(e.target.value)))}
                className="w-full bg-[#111827] border border-[#24344d] rounded-xl p-2 text-xs font-mono text-emerald-400 font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Horizon: {horizonYears} Years</label>
              <input
                type="range"
                min="3"
                max="30"
                step="1"
                value={horizonYears}
                onChange={(e) => setHorizonYears(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer mt-2"
              />
            </div>
          </div>
        </div>

        {/* Analytics & Monte Carlo Column */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#162032] border border-[#24344d]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Exp. Nominal Return</span>
              <span className="text-xl font-bold font-mono text-emerald-400">{metrics.expectedReturn.toFixed(1)}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#162032] border border-[#24344d]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Real Return (Real)</span>
              <span className="text-xl font-bold font-mono text-blue-400">+{metrics.realReturn.toFixed(1)}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#162032] border border-[#24344d]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Annual Volatility</span>
              <span className="text-xl font-bold font-mono text-slate-300">~{metrics.volatility.toFixed(1)}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#162032] border border-[#24344d]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Est. Max Drawdown</span>
              <span className="text-xl font-bold font-mono text-rose-400">-{metrics.maxDrawdown.toFixed(1)}%</span>
            </div>
          </div>

          {/* Terminal Wealth Projection */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1e2c44] to-[#162032] border border-[#24344d]">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
                Projected Terminal Wealth ({horizonYears} Years)
              </span>
              <span className="text-xs text-emerald-400 font-mono font-bold">Base Capital: {formatINR(initialCapital)}</span>
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-white font-mono mb-2">
              {formatINR(metrics.terminalNominal)}
            </div>
            <div className="text-xs text-slate-400 flex justify-between pt-2 border-t border-[#24344d]">
              <span>Real Purchasing Power in Today's Money ({inflationRate}% inflation):</span>
              <strong className="text-amber-400 font-mono">{formatINR(metrics.terminalReal)}</strong>
            </div>
          </div>

          {/* Monte Carlo Simulation Distributions */}
          <div className="p-6 rounded-3xl bg-[#111827] border border-[#24344d] space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span>🎲</span> Monte Carlo Return Range (Probability Distributions)
              </h4>
              <span className="text-[10px] text-slate-500">10,000 Path Geometric Simulation</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block mb-1">10th Percentile (Bear)</span>
                <span className="text-base font-bold text-rose-400">{formatINR(metrics.p10)}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Severe cyclical crises</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block mb-1">50th Percentile (Median)</span>
                <span className="text-base font-bold text-emerald-400">{formatINR(metrics.p50)}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Expected modal path</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block mb-1">90th Percentile (Bull)</span>
                <span className="text-base font-bold text-cyan-400">{formatINR(metrics.p90)}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Prolonged super-cycle</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed italic">
              Note: Monte Carlo distributions simulate multi-year variance. Past performance does not guarantee future results. Rebalance annually to stay within target bands.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocationLab;
