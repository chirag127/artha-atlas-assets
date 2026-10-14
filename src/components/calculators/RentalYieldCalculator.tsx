import React, { useState, useMemo } from 'react';
import { calculateRentalPropertyMetrics } from '../../lib/finance/formulas';

export const RentalYieldCalculator: React.FC = () => {
  const [purchasePrice, setPurchasePrice] = useState<number>(10000000); // ₹1 Crore
  const [stampDutyPercent, setStampDutyPercent] = useState<number>(7.0); // 7%
  const [furnishingCost, setFurnishingCost] = useState<number>(400000); // ₹4 Lakhs
  const [monthlyRent, setMonthlyRent] = useState<number>(30000); // ₹30,000
  const [vacancyMonths, setVacancyMonths] = useState<number>(1.0); // 1 month vacancy
  const [annualPropertyTax, setAnnualPropertyTax] = useState<number>(15000);
  const [annualMaintenance, setAnnualMaintenance] = useState<number>(40000);

  // Mortgage Inputs
  const [loanPercent, setLoanPercent] = useState<number>(50); // 50% LTV
  const [loanRate, setLoanRate] = useState<number>(8.5); // 8.5%
  const [loanTenure, setLoanTenure] = useState<number>(15); // 15 years
  const [appreciationRate, setAppreciationRate] = useState<number>(5.5); // 5.5% annual
  const [holdingYears, setHoldingYears] = useState<number>(10); // 10 years

  const analysis = useMemo(() => {
    const stampDutyAmount = purchasePrice * (stampDutyPercent / 100);
    const vacancyRate = vacancyMonths / 12;
    const loanAmount = purchasePrice * (loanPercent / 100);

    return calculateRentalPropertyMetrics(
      purchasePrice,
      stampDutyAmount,
      furnishingCost,
      monthlyRent,
      annualPropertyTax,
      annualMaintenance,
      vacancyRate,
      loanAmount,
      loanRate / 100,
      loanTenure,
      appreciationRate / 100,
      holdingYears
    );
  }, [
    purchasePrice,
    stampDutyPercent,
    furnishingCost,
    monthlyRent,
    vacancyMonths,
    annualPropertyTax,
    annualMaintenance,
    loanPercent,
    loanRate,
    loanTenure,
    appreciationRate,
    holdingYears,
  ]);

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-[#162032] border border-[#24344d] shadow-2xl text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#24344d]">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">🏢</span>
            Real Estate Yield & Leveraged IRR Model
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Hand-calculate true net rental yields, acquisition friction, mortgage interest drag, and leveraged equity IRR.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold self-start md:self-auto">
          Cap Rate & Debt Service
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* Purchase Price */}
          <div className="bg-[#111827]/80 p-4 rounded-2xl border border-[#24344d]">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">Base Agreement Price</label>
              <span className="font-mono font-bold text-indigo-400">{formatINR(purchasePrice)}</span>
            </div>
            <input
              type="range"
              min="2500000"
              max="50000000"
              step="500000"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Monthly Rent */}
          <div className="bg-[#111827]/80 p-4 rounded-2xl border border-[#24344d]">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">Expected Monthly Rent</label>
              <span className="font-mono font-bold text-slate-200">₹{monthlyRent.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="250000"
              step="2000"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Stamp Duty & Interiors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111827]/80 p-3 rounded-xl border border-[#24344d]">
              <label className="text-xs text-slate-400 block mb-1">Stamp & Reg %</label>
              <input
                type="number"
                min="3"
                max="10"
                step="0.5"
                value={stampDutyPercent}
                onChange={(e) => setStampDutyPercent(Number(e.target.value))}
                className="w-full bg-[#1e2c44] border border-[#24344d] rounded p-1.5 text-sm font-mono text-slate-200"
              />
            </div>
            <div className="bg-[#111827]/80 p-3 rounded-xl border border-[#24344d]">
              <label className="text-xs text-slate-400 block mb-1">Interiors & Fix (₹)</label>
              <input
                type="number"
                min="50000"
                max="5000000"
                step="50000"
                value={furnishingCost}
                onChange={(e) => setFurnishingCost(Number(e.target.value))}
                className="w-full bg-[#1e2c44] border border-[#24344d] rounded p-1.5 text-sm font-mono text-slate-200"
              />
            </div>
          </div>

          {/* Loan Details */}
          <div className="p-4 rounded-2xl bg-[#0f172a] border border-[#24344d] space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Home Loan Leverage</h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Loan LTV %</label>
                <input
                  type="number"
                  min="0"
                  max="80"
                  step="5"
                  value={loanPercent}
                  onChange={(e) => setLoanPercent(Number(e.target.value))}
                  className="w-full bg-[#1e2c44] border border-[#24344d] rounded p-1 text-xs font-mono text-slate-200"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Interest Rate %</label>
                <input
                  type="number"
                  min="6"
                  max="14"
                  step="0.25"
                  value={loanRate}
                  onChange={(e) => setLoanRate(Number(e.target.value))}
                  className="w-full bg-[#1e2c44] border border-[#24344d] rounded p-1 text-xs font-mono text-slate-200"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Tenure (Yrs)</label>
                <input
                  type="number"
                  min="5"
                  max="30"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="w-full bg-[#1e2c44] border border-[#24344d] rounded p-1 text-xs font-mono text-slate-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* Yields Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#111827] border border-[#24344d]">
              <span className="text-xs text-slate-400 block mb-1">Gross Rental Yield</span>
              <span className="text-2xl font-bold font-mono text-slate-300">{(analysis.grossRentalYield * 100).toFixed(2)}%</span>
              <span className="text-[10px] text-slate-500 block mt-1">Rent / Purchase Price</span>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30">
              <span className="text-xs text-indigo-400 block mb-1">Net Realized Yield</span>
              <span className="text-2xl font-bold font-mono text-indigo-400">{(analysis.netRentalYield * 100).toFixed(2)}%</span>
              <span className="text-[10px] text-indigo-500/80 block mt-1">NOI / Total All-in Cost</span>
            </div>
          </div>

          {/* Leveraged Equity IRR Highlight */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1e2c44] to-[#162032] border border-indigo-500/40">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">10-Year Leveraged Equity IRR</span>
              <span className="text-xs text-slate-400">Holding Period: {holdingYears} Yrs</span>
            </div>
            <div className="text-4xl font-extrabold text-white font-mono mb-2">
              {(analysis.projectedLeveragedIRR * 100).toFixed(2)}%
            </div>
            <div className="text-xs text-slate-400 flex justify-between pt-2 border-t border-[#24344d]">
              <span>Initial Equity Invested: <strong className="text-slate-200">{formatINR(analysis.equityInvested)}</strong></span>
              <span>Total Equity Multiple: <strong className="text-emerald-400">{analysis.equityMultiple}x</strong></span>
            </div>
          </div>

          {/* Cashflow & EMI Breakdown */}
          <div className="bg-[#111827] rounded-2xl border border-[#24344d] p-4 text-xs font-mono space-y-2">
            <div className="flex justify-between text-slate-300 pb-2 border-b border-slate-800">
              <span>Total Capital Outlay (All-in):</span>
              <span className="font-bold">{formatINR(analysis.totalAcquisitionCost)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Monthly Bank Home Loan EMI:</span>
              <span className="text-rose-400">{formatINR(analysis.monthlyEMI)}/mo</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Annual Net Operating Income (NOI):</span>
              <span className="text-emerald-400">+{formatINR(analysis.annualNetOperatingIncome)}/yr</span>
            </div>
            <div className="flex justify-between text-slate-200 pt-2 border-t border-slate-800 font-semibold">
              <span>Annual Pre-Tax Cash Flow (NOI - Debt):</span>
              <span className={analysis.annualPreTaxCashflow >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {analysis.annualPreTaxCashflow >= 0 ? '+' : ''}{formatINR(analysis.annualPreTaxCashflow)}/yr
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalYieldCalculator;
