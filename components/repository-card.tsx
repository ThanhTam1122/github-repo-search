import Image from "next/image";
import Link from "next/link";
import { GitHubRepository } from "@/lib/types";

interface RepositoryCardProps {
  repository: GitHubRepository;
  query: string;
  page: number;
  sort: string;
  perPage: number;
}

export function RepositoryCard({ repository, query, page, sort, perPage }: RepositoryCardProps) {
  return (
    <Link
      href={`/repositories/${repository.owner.login}/${repository.name}?q=${encodeURIComponent(query)}&page=${page}&sort=${sort}&per_page=${perPage}`}
      className="flex items-center gap-4 p-5 rounded-xl border border-gray-200/80
        bg-white/60 backdrop-blur-sm
        hover:border-purple-300 hover:bg-white hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-0.5
        dark:border-gray-700/50 dark:bg-gray-900/60
        dark:hover:border-purple-600 dark:hover:bg-gray-900/80 dark:hover:shadow-purple-500/10
        transition-all duration-200 group"
      style={{ animation: "fade-in-up 0.3s ease-out both" }}
    >
      <div className="relative">
        <Image
          src={repository.owner.avatar_url}
          alt={`${repository.owner.login}'s avatar`}
          width={48}
          height={48}
          className="rounded-full shrink-0 ring-2 ring-gray-100 dark:ring-gray-700 group-hover:ring-purple-200 dark:group-hover:ring-purple-800 transition-all"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent dark:group-hover:from-purple-400 dark:group-hover:to-pink-400 truncate transition-all">
          {repository.full_name}
        </h3>
        {repository.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
            {repository.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-2 text-xs">
          {repository.language && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              {repository.language}
            </span>
          )}
          <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
            <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {repository.stargazers_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {repository.forks_count.toLocaleString()}
          </span>
        </div>
      </div>
      <svg
        className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-purple-400 transition-all shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        style={{ animation: "none" }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
