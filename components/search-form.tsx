"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

const SORT_OPTIONS = [
  { value: "stars", label: "Star数" },
  { value: "forks", label: "Fork数" },
  { value: "updated", label: "更新日" },
  { value: "help-wanted-issues", label: "Help Wanted" },
  { value: "best-match", label: "関連度" },
] as const;

const PER_PAGE_OPTIONS = [10, 20, 30, 50] as const;

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "stars");
  const [perPage, setPerPage] = useState(searchParams.get("per_page") ?? "20");
  const [isPending, startTransition] = useTransition();

  const buildUrl = (overrides: Record<string, string> = {}) => {
    const q = overrides.q ?? query.trim();
    const s = overrides.sort ?? sort;
    const pp = overrides.per_page ?? perPage;
    const p = overrides.page ?? "1";
    return `/?q=${encodeURIComponent(q)}&page=${p}&sort=${s}&per_page=${pp}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    startTransition(() => {
      router.push(buildUrl({ page: "1" }));
    });
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    if (!query.trim()) return;
    startTransition(() => {
      router.push(buildUrl({ sort: newSort, page: "1" }));
    });
  };

  const handlePerPageChange = (newPerPage: string) => {
    setPerPage(newPerPage);
    if (!query.trim()) return;
    startTransition(() => {
      router.push(buildUrl({ per_page: newPerPage, page: "1" }));
    });
  };

  const selectClass =
    "h-9 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.25rem_center] bg-no-repeat focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 transition-all cursor-pointer";

  return (
    <div className="space-y-3 w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative flex gap-2">
        <div className="relative flex-1">
          <div className="relative flex items-center">
            <svg className="absolute left-4 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="リポジトリを検索..."
              aria-label="Search repositories"
              className="relative w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-base
                focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500
                dark:bg-gray-800/80 dark:border-gray-700 dark:text-white
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                transition-all"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending || !query.trim()}
          className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium
            hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
            transition-all duration-200 cursor-pointer"
        >
          {isPending ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : "検索"}
        </button>
      </form>

      {/* Sort & Per Page options */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-xs font-medium text-gray-500 dark:text-gray-400">
            並び替え
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className={selectClass}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="perPage" className="text-xs font-medium text-gray-500 dark:text-gray-400">
            表示件数
          </label>
          <select
            id="perPage"
            value={perPage}
            onChange={(e) => handlePerPageChange(e.target.value)}
            className={selectClass}
          >
            {PER_PAGE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}件</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
