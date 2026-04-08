"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { CustomSelect } from "./custom-select";

const SORT_OPTIONS = [
  { value: "stars", label: "Star数" },
  { value: "forks", label: "Fork数" },
  { value: "updated", label: "更新日" },
  { value: "help-wanted-issues", label: "Help Wanted" },
  { value: "best-match", label: "関連度" },
];

const PER_PAGE_OPTIONS = [
  { value: "10", label: "10件" },
  { value: "20", label: "20件" },
  { value: "30", label: "30件" },
  { value: "50", label: "50件" },
];

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
        <CustomSelect
          id="sort"
          label="並び替え"
          options={SORT_OPTIONS}
          value={sort}
          onChange={handleSortChange}
        />
        <CustomSelect
          id="perPage"
          label="表示件数"
          options={PER_PAGE_OPTIONS}
          value={perPage}
          onChange={handlePerPageChange}
        />
      </div>
    </div>
  );
}
