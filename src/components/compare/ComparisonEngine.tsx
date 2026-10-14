import React, { useState, useMemo } from 'react';
import assetsData from '../../data/assets.json';
import categoriesData from '../../data/categories.json';

export const ComparisonEngine: React.FC = () => {
  // Currently selected asset IDs to compare
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([
    'bank_fixed_deposit',
    'arbitrage_mutual_fund',
    'sovereign_gold_bond',
    'commercial_reit',
  ]);

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pinnedOnly, setPinnedOnly] = useState<boolean>(false);

  // Quick comparison presets
  const presets = [
    {
      name: 'Safe Cash vs Tax-Efficient Arbitrage',
      ids: ['bank_fixed_deposit', 'sfb_fixed_deposit', 'treasury_bills', 'arbitrage_mutual_fund'],
    },
    {
      name: 'Physical Gold vs Gold ETF vs SGB',
      ids: ['sovereign_gold_bond', 'gold_etf'],
    },
    {
      name: 'Direct Real Estate vs Commercial REIT',
      ids: ['direct_residential_property', 'commercial_reit'],
    },
    {
      name: 'Alternative Credit vs AAA Bonds',
      ids: ['corporate_bonds_aaa', 'government_securities_gsec', 'p2p_lending_portfolio'],
    },
    {
      name: 'Passive Index vs Smart-Beta Momentum',
      ids: ['nifty_50_index_fund', 'momentum_factor_fund', 'nifty_smallcap_250'],
    },
  ];

  // Available comparison dimensions (20+ attributes)
  const dimensions = [
    { key: 'structure', label: 'Legal Structure & Vehicle' },
    { key: 'economicExposure', label: 'Underlying Economic Exposure' },
    { key: 'historicalNominalReturn', label: 'Historical Nominal Return' },
    { key: 'historicalRealReturn', label: 'Historical Real Return (Inflation Adj)' },
    { key: 'expectedReturnAssumption', label: 'Long-Term Expected Return' },
    { key: 'returnVariability', label: 'Return Volatility Profile' },
    { key: 'maxDrawdown', label: 'Maximum Historical Drawdown' },
    { key: 'creditRisk', label: 'Credit & Default Risk' },
    { key: 'marketRisk', label: 'Market & Systematic Risk' },
    { key: 'liquidity', label: 'Liquidity & Redemptions' },
    { key: 'lockIn', label: 'Lock-In / Minimum Tenure' },
    { key: 'minInvestment', label: 'Minimum Capital Required' },
    { key: 'fees', label: 'Expense Ratio & Friction Fees' },
    { key: 'taxOnIncome', label: 'Taxation of Income / Dividends' },
    { key: 'taxOnGains', label: 'Capital Gains Taxation (LTCG/STCG)' },
    { key: 'tdsDetails', label: 'TDS / TCS Regulations' },
    { key: 'regulatoryFramework', label: 'Statutory Regulator' },
    { key: 'investorEligibility', label: 'Investor Eligibility' },
    { key: 'complexity', label: 'Complexity Level' },
    { key: 'transparency', label: 'Valuation Transparency' },
    { key: 'diversification', label: 'Diversification Attribute' },
    { key: 'permanentLossRisk', label: 'Permanent Loss Probability' },
    { key: 'suitabilityHorizon', label: 'Ideal Investment Horizon' },
  ];

  const handleToggleAsset = (id: string) => {
    if (selectedAssetIds.includes(id)) {
      if (selectedAssetIds.length > 1) {
        setSelectedAssetIds(selectedAssetIds.filter((item) => item !== id));
      }
    } else {
      if (selectedAssetIds.length < 6) {
        setSelectedAssetIds([...selectedAssetIds, id]);
      }
    }
  };

  const selectedAssets = useMemo(() => {
    return assetsData.filter((a) => selectedAssetIds.includes(a.id));
  }, [selectedAssetIds]);

  const filteredAvailableAssets = useMemo(() => {
    return assetsData.filter((a) => {
      const matchesCat = categoryFilter === 'all' || a.categoryId === categoryFilter;
      const matchesSearch =
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.structure.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [categoryFilter, searchQuery]);

  // CSV Export handler
  const handleExportCSV = () => {
    const headers = ['Dimension', ...selectedAssets.map((a) => `"${a.name}"`)];
    const rows = dimensions.map((d) => {
      const values = selectedAssets.map((a) => `"${(a as Record<string, string>)[d.key] || 'N/A'}"`);
      return [`"${d.label}"`, ...values].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `artha_atlas_comparison_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Export handler
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(selectedAssets, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `artha_atlas_comparison_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Presets & Controls Header */}
      <div className="p-6 rounded-3xl bg-[#162032] border border-[#24344d] space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>⚡</span> Curated Comparison Presets
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Click any preset to immediately populate the comparison matrix.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl bg-[#1e2c44] hover:bg-[#24344d] border border-[#24344d] text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <span>📥</span> Export CSV
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-xl bg-[#1e2c44] hover:bg-[#24344d] border border-[#24344d] text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <span>📦</span> Export JSON
            </button>
          </div>
        </div>

        {/* Preset Badges */}
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => setSelectedAssetIds(p.ids)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#111827] hover:bg-emerald-950/40 hover:border-emerald-500/40 border border-[#24344d] text-slate-300 hover:text-emerald-300 transition-all cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Selection Drawer */}
      <div className="p-6 rounded-3xl bg-[#111827] border border-[#24344d] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-200">Select Assets to Compare (Max 6):</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
              {selectedAssetIds.length} Selected
            </span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search asset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1e2c44] border border-[#24344d] rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#1e2c44] border border-[#24344d] rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">All 13 Categories</option>
              {categoriesData.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Asset Chips */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#24344d]">
          {filteredAvailableAssets.map((asset) => {
            const isSelected = selectedAssetIds.includes(asset.id);
            return (
              <button
                key={asset.id}
                onClick={() => handleToggleAsset(asset.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-[#1e2c44]/80 text-slate-300 hover:bg-[#24344d] border border-[#24344d]'
                }`}
              >
                <span>{isSelected ? '✓' : '+'}</span>
                <span>{asset.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Comparison Matrix */}
      <div className="rounded-3xl bg-[#162032] border border-[#24344d] shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#111827] border-b border-[#24344d]">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 w-64 sticky left-0 bg-[#111827] z-10 border-r border-[#24344d]">
                  Comparison Dimension
                </th>
                {selectedAssets.map((asset) => (
                  <th key={asset.id} className="py-4 px-6 text-sm font-bold text-white min-w-[240px] align-top">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-emerald-400">{asset.name}</span>
                      {selectedAssets.length > 1 && (
                        <button
                          onClick={() => handleToggleAsset(asset.id)}
                          className="text-slate-500 hover:text-rose-400 text-xs px-1.5 py-0.5 rounded hover:bg-rose-500/10 transition-colors"
                          title="Remove from comparison"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#24344d]/60 text-xs text-slate-300">
              {dimensions.map((dim, idx) => (
                <tr key={dim.key} className={idx % 2 === 0 ? 'bg-[#162032]' : 'bg-[#111827]/40'}>
                  <td className="py-3 px-6 font-semibold text-slate-300 sticky left-0 bg-inherit z-10 border-r border-[#24344d]">
                    {dim.label}
                  </td>
                  {selectedAssets.map((asset) => (
                    <td key={asset.id} className="py-3 px-6 leading-relaxed">
                      {(asset as Record<string, string>)[dim.key] || 'N/A'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonEngine;
