# GitHub Repository Search

GitHubのリポジトリを検索・閲覧できるWebアプリケーションです。

## 技術スタック

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Vitest + Testing Library** (テスト)

## セットアップ

```bash
npm install
npm run dev
```

http://localhost:3000 でアクセスできます。

### 環境変数（任意）

GitHub APIのレートリミット（未認証: 10回/分）を緩和するため、Personal Access Tokenを設定できます。

```bash
# .env.local
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

## 機能

- **リポジトリ検索**: キーワード入力でGitHub APIを使ったリポジトリ検索
- **検索結果一覧**: リポジトリ名、オーナーアイコン、説明、言語、Star数を表示
- **リポジトリ詳細ページ**: リポジトリ名、オーナーアイコン、言語、Star数、Watcher数、Fork数、Issue数を表示
- **ページネーション**: 検索結果のページ切り替え
- **ダークモード対応**: OSの設定に連動

## コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run start    # プロダクションサーバー起動
npm run lint     # ESLint実行
npm test         # テスト実行
npm run test:watch  # テストをウォッチモードで実行
```

## テスト

Vitest + React Testing Libraryによるテストを実装しています。

```bash
npm test
```

### テスト対象

| 対象 | テスト内容 |
|------|-----------|
| `lib/github.ts` | API呼び出し、パラメータ検証、エラーハンドリング（レートリミット、バリデーションエラー、404） |
| `SearchForm` | レンダリング、入力バリデーション、フォーム送信、空クエリの防止 |
| `RepositoryCard` | リポジトリ情報の表示、リンク生成、null値の処理 |
| `Pagination` | ページ番号生成、現在ページのハイライト、前後ボタン、GitHub API上限（1000件）の考慮 |

## アーキテクチャ

```
app/
  page.tsx                          # 検索トップページ（Server Component）
  layout.tsx                        # ルートレイアウト
  error.tsx                         # エラーバウンダリ
  not-found.tsx                     # 404ページ
  repositories/[owner]/[repo]/
    page.tsx                        # リポジトリ詳細ページ（Server Component）
components/
  search-form.tsx                   # 検索フォーム（Client Component）
  search-results.tsx                # 検索結果表示（Server Component）
  repository-card.tsx               # リポジトリカード
  pagination.tsx                    # ページネーション（Client Component）
lib/
  github.ts                        # GitHub API クライアント
  types.ts                         # 型定義
```

## 工夫した点・こだわりポイント

### 1. Server ComponentsとClient Componentsの適切な分離

検索結果の取得やリポジトリ詳細の取得はServer Componentsで行い、ユーザーインタラクションが必要な検索フォームのみClient Componentとして実装しました。これにより、JavaScriptバンドルサイズを最小限に抑えつつ、必要な箇所でのみクライアントサイドの機能を利用しています。

### 2. Suspenseによるストリーミングレンダリング

検索結果の表示に`Suspense`を使用し、データ取得中はスケルトンUIを表示します。`key`属性にクエリとページを含めることで、パラメータ変更時に適切にSuspense境界がリセットされます。

### 3. プロダクション品質のエラーハンドリング

- GitHub API のレートリミット (403)、バリデーションエラー (422)、404 を個別にハンドリング
- `error.tsx` によるグローバルエラーバウンダリ
- `not-found.tsx` による404ページ
- 型安全な `GitHubApiError` クラスによるエラー管理

### 4. GitHub API上限への対応

GitHub Search APIは最大1000件までしか結果を返さないため、ページネーションでその上限を考慮しています。

### 5. アクセシビリティ

- 適切な`aria-label`と`aria-current`属性の付与
- キーボードナビゲーション対応
- セマンティックなHTML構造

### 6. レスポンシブデザインとダークモード

- Tailwind CSSのユーティリティクラスによるレスポンシブ対応
- `prefers-color-scheme`メディアクエリによるOSのダークモード設定への連動
- 統計情報のグリッドはモバイルで2列、デスクトップで4列表示

### 7. パフォーマンス最適化

- `next/image`によるオーナーアイコンの最適化
- `revalidate: 60`による適切なキャッシュ戦略
- `useTransition`によるノンブロッキングなページ遷移

## AI利用レポート

本プロジェクトの開発にはAI（Claude Code - Claude Opus 4.6）を利用しました。

### 利用方法

1. **要件整理とアーキテクチャ設計**: ワイヤーフレームと仕様書を基に、Next.js App Routerのベストプラクティスに沿ったファイル構成とコンポーネント設計を行いました。

2. **コード実装**: 以下の実装をAIが支援しました:
   - GitHub API クライアント (`lib/github.ts`) - エラーハンドリング、型定義を含む
   - UIコンポーネント群 - 検索フォーム、リポジトリカード、ページネーション、検索結果表示
   - ページコンポーネント - トップページ、詳細ページ、エラーページ、404ページ
   - Next.js設定 - 画像ドメイン許可設定など

3. **テストコード作成**: Vitest + React Testing Libraryを使用したユニットテストの作成。GitHub APIクライアントのモック、コンポーネントのレンダリングテスト、ユーザーインタラクションのテストを実装しました。

4. **ビルド検証**: 実装後のビルド成功確認とテスト実行による品質検証を行いました。

### AIの活用で特に効果的だった点

- Server ComponentsとClient Componentsの境界設計における最新のNext.js 16パターンの適用
- 包括的なエラーハンドリングパターンの実装
- テストコードの網羅的な作成（29テストケース）
- TypeScriptの型安全性を維持したコード全体の一貫性

### 人間が判断・レビューした点

- ワイヤーフレームの解釈とUI設計方針
- コンポーネントの粒度と責務分離の妥当性確認
- 最終的なコード品質のレビュー
