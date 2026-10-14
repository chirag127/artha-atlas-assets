import React, { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    pagefind?: {
      search: (query: string) => Promise<{
        results: Array<{
          id: string;
          data: () => Promise<{
            url: string;
            meta: { title: string };
            excerpt: string;
          }>;
        }>;
      }>;
    };
  }
}

interface SearchResultItem {
  url: string;
  title: string;
  excerpt: string;
}

export const SearchModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Execute Pagefind Search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        if (!window.pagefind) {
          const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
          // Dynamically import Pagefind from the build output
          try {
            window.pagefind = await import(/* @vite-ignore */ `${basePath}/pagefind/pagefind.js`);
          } catch (e) {
            console.warn('Pagefind static search bundle not yet generated in dev mode:', e);
          }
        }

        if (window.pagefind) {
          const searchResponse = await window.pagefind.search(query);
          const topResults = await Promise.all(
            searchResponse.results.slice(0, 8).map(async (r) => {
              const data = await r.data();
              return {
                url: data.url,
                title: data.meta.title || 'Research Document',
                excerpt: data.excerpt,
              };
            })
          );
          setResults(topResults);
        } else {
          // Fallback mock search for local development
          setResults([
            {
              url: `${import.meta.env.BASE_URL}articles/anatomy-of-p2p-lending-india`,
              title: 'The Anatomy of P2P Lending in India: Why Contractual Yield != Realised Return',
              excerpt: 'An independent empirical investigation into peer-to-peer alternative lending in India...',
            },
            {
              url: `${import.meta.env.BASE_URL}articles/sovereign-gold-bonds-definitive-guide`,
              title: 'The Definitive Guide to Sovereign Gold Bonds (SGB)',
              excerpt: 'Complete Section 47(viic) capital gains tax exemption and 2.50% annual coupon...',
            },
          ]);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1e2c44]/60 hover:bg-[#24344d] border border-[#24344d] text-slate-300 hover:text-white text-xs transition-all cursor-pointer shadow-sm"
        title="Search Articles & Assets (Cmd+K / Ctrl+K)"
      >
        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">Search platform...</span>
        <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-2xl rounded-3xl bg-[#162032] border border-[#24344d] shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-[#24344d] flex items-center gap-3 bg-[#111827]">
              <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search research articles, tax rules, calculators, or assets..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm md:text-base text-white placeholder-slate-500 focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white text-xs px-2 py-1">
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs border border-slate-700"
              >
                ESC
              </button>
            </div>

            {/* Results List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {loading && <div className="text-center py-8 text-xs text-slate-400">Searching index...</div>}

              {!loading && query && results.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                  <div className="text-3xl mb-2">🔍</div>
                  <div className="text-sm font-semibold text-slate-300">No matching research found</div>
                  <div className="text-xs text-slate-500 mt-1">Try searching for "P2P", "SGB", "Section 112A", "REIT", or "SIP"</div>
                </div>
              )}

              {!loading &&
                results.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    onClick={() => setIsOpen(false)}
                    className="block p-3.5 rounded-2xl hover:bg-[#1e2c44] border border-transparent hover:border-[#24344d] transition-all group"
                  >
                    <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                      <span>{r.title}</span>
                      <span className="text-xs text-slate-500">→</span>
                    </div>
                    <p
                      className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: r.excerpt }}
                    />
                  </a>
                ))}

              {!query && (
                <div className="p-4 text-xs text-slate-400 space-y-3">
                  <div className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">Popular Searches</div>
                  <div className="flex flex-wrap gap-2">
                    {['P2P Lending', 'SGB 100% Tax Free', 'Section 50AA', 'REIT Yield', 'NPS 80CCD(2)', 'Index Funds'].map(
                      (tag) => (
                        <button
                          key={tag}
                          onClick={() => setQuery(tag)}
                          className="px-2.5 py-1 rounded-lg bg-[#111827] hover:bg-[#1e2c44] border border-[#24344d] text-slate-300 text-xs transition-colors cursor-pointer"
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-[#0f172a] border-t border-[#24344d] text-[11px] text-slate-500 flex justify-between items-center">
              <span>Static search powered by Pagefind</span>
              <span>Zero external network queries</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchModal;
