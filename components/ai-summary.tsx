"use client";

import { useState } from "react";

function markdownToHtml(md: string): string {
  return md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n/g, "<br />");
}

interface AiSummaryProps {
  owner: string;
  repo: string;
}

export function AiSummary({ owner, repo }: AiSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "要約の生成に失敗しました。");
        return;
      }

      setSummary(data.summary);
    } catch {
      setError("要約の生成に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
        AI要約
      </h2>

      {!summary && !isLoading && !error && (
        <button
          onClick={handleSummarize}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 font-medium text-sm transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AIでREADMEを要約する
        </button>
      )}

      {isLoading && (
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          AIが要約を生成中...
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">
          <p>{error}</p>
          <button
            onClick={handleSummarize}
            className="mt-2 text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
          >
            再試行
          </button>
        </div>
      )}

      {summary && (
        <div
          className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4 prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(summary) }}
        />
      )}
    </div>
  );
}
