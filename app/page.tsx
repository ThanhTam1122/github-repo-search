import { Suspense } from "react";
import { SearchForm } from "@/components/search-form";
import { SearchResults } from "@/components/search-results";

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const page = Math.max(1, Number(params.page) || 1);

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            GitHub Repository Search
          </h1>
          <Suspense>
            <SearchForm />
          </Suspense>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-6 w-full">
        {query ? (
          <Suspense
            key={`${query}-${page}`}
            fallback={<SearchResultsSkeleton />}
          >
            <SearchResults query={query} page={page} />
          </Suspense>
        ) : (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-lg">キーワードを入力してリポジトリを検索</p>
          </div>
        )}
      </main>
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse"
        >
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
