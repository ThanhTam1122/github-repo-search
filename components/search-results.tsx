import { searchRepositories } from "@/lib/github";
import { RepositoryCard } from "./repository-card";
import { Pagination } from "./pagination";

interface SearchResultsProps {
  query: string;
  page: number;
}

export async function SearchResults({ query, page }: SearchResultsProps) {
  const result = await searchRepositories(query, page);

  if (result.total_count === 0) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        <p className="text-lg font-medium">検索結果が見つかりませんでした</p>
        <p className="mt-2 text-sm">別のキーワードで検索してみてください。</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {result.total_count.toLocaleString()} 件のリポジトリが見つかりました
      </p>

      <div className="space-y-3">
        {result.items.map((repo) => (
          <RepositoryCard key={repo.id} repository={repo} query={query} page={page} />
        ))}
      </div>

      <Pagination
        query={query}
        currentPage={page}
        totalCount={result.total_count}
      />
    </div>
  );
}
