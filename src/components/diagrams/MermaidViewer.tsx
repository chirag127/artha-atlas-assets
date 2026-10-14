import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidViewerProps {
  chart: string;
  id?: string;
  className?: string;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart, id, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const isDark = document.documentElement.classList.contains('dark') || !document.documentElement.classList.contains('light');

    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      themeVariables: {
        darkMode: isDark,
        background: isDark ? '#162032' : '#ffffff',
        primaryColor: isDark ? '#1e2c44' : '#e0f2fe',
        primaryTextColor: isDark ? '#f8fafc' : '#0f172a',
        primaryBorderColor: isDark ? '#10b981' : '#0284c7',
        lineColor: isDark ? '#64748b' : '#94a3b8',
        secondaryColor: isDark ? '#0f172a' : '#f1f5f9',
        tertiaryColor: isDark ? '#111827' : '#f8fafc',
      },
    });

    const uniqueId = id || `mermaid-${Math.random().toString(36).substring(2, 9)}`;

    mermaid
      .render(uniqueId, chart.trim())
      .then(({ svg }) => {
        if (isMounted) {
          setSvgContent(svg);
          setError(null);
        }
      })
      .catch((err) => {
        console.warn('Mermaid rendering warning:', err);
        if (isMounted) {
          setError('Diagram rendering fallback: ' + (err.message || 'Syntax parsing'));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [chart, id]);

  if (error) {
    return (
      <div className="my-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-sm font-mono overflow-x-auto">
        <div className="font-semibold mb-2">Diagram Source (Syntax Fallback):</div>
        <pre className="whitespace-pre-wrap">{chart}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`my-6 p-6 rounded-2xl bg-[#162032]/60 dark:bg-[#162032]/60 border border-[#24344d] overflow-x-auto flex justify-center items-center shadow-lg transition-all ${className}`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default MermaidViewer;
