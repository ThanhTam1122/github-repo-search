import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          ページが見つかりません
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          お探しのリポジトリは存在しないか、アクセスできません。
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm transition-colors"
        >
          トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
