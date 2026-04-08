"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    startTransition(() => {
      router.push(`/?q=${encodeURIComponent(trimmed)}&page=1`);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-2xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="リポジトリ名を入力してください"
        aria-label="Search repositories"
        className="flex-1 h-12 px-4 rounded-lg border border-gray-300 bg-white text-base
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          dark:bg-gray-800 dark:border-gray-600 dark:text-white
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          transition-shadow"
      />
      <button
        type="submit"
        disabled={isPending || !query.trim()}
        className="h-12 px-6 rounded-lg bg-blue-600 text-white font-medium
          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors cursor-pointer"
      >
        {isPending ? "検索中..." : "検索"}
      </button>
    </form>
  );
}
