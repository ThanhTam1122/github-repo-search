import { Suspense } from "react";
import { SearchForm } from "@/components/search-form";
import { SearchResults } from "@/components/search-results";
import { validatePerPage, validateSort } from "@/lib/github";

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string; sort?: string; per_page?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const page = Math.max(1, Number(params.page) || 1);
  const sort = validateSort(params.sort ?? "stars");
  const perPage = validatePerPage(Number(params.per_page) || 20);

  return (
    <div className="flex-1 flex flex-col">
      <header className="relative overflow-hidden border-b border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-purple-950/20 dark:to-gray-900">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-purple-200/20 dark:bg-purple-800/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-pink-200/20 dark:bg-pink-800/10 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white dark:border-gray-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
                GitHub Repository Search
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Discover amazing open source projects
              </p>
            </div>
          </div>
          <Suspense>
            <SearchForm />
          </Suspense>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-6 w-full">
        {query ? (
          <Suspense
            key={`${query}-${page}-${sort}-${perPage}`}
            fallback={<SearchResultsSkeleton />}
          >
            <SearchResults query={query} page={page} sort={sort} perPage={perPage} />
          </Suspense>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="relative inline-block mb-6">
        {/* Floating octocat */}
        <svg
          className="w-24 h-24 text-purple-300 dark:text-purple-700"
          fill="currentColor"
          viewBox="0 0 24 24"
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        {/* Sparkles around octocat */}
        <svg className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24" style={{ animation: "float 2s ease-in-out infinite 0.5s" }}>
          <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
        <svg className="absolute -bottom-1 -left-3 w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 24 24" style={{ animation: "float 2.5s ease-in-out infinite 1s" }}>
          <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      </div>
      <p className="text-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
        キーワードを入力してリポジトリを検索
      </p>
      <p className="text-sm text-gray-400 dark:text-gray-600 mt-2">
        例: react, tensorflow, next.js, rust
      </p>
      <div className="flex justify-center gap-2 mt-4">
        {["react", "vue", "svelte"].map((tag) => (
          <span key={tag} className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-5 rounded-xl border border-gray-200/80 dark:border-gray-700/50 animate-pulse bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 shrink-0" />
          <div className="flex-1 space-y-2.5">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-full w-1/3" />
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-full w-2/3" />
            <div className="flex gap-3">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
