# GitHub Repository Search

GitHubのリポジトリを検索・閲覧できるWebアプリケーションです。

## 技術スタック

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Vitest + Testing Library** (テスト)
- **Google Gemini API** (AI要約機能)

## セットアップ

```bash
npm install
npm run dev
```

http://localhost:3000 でアクセスできます。

### 環境変数（任意）

```bash
# .env.local
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx    # GitHub APIレートリミット緩和用
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxx      # AI要約機能用（Google AI Studio）
```

## 機能

### 基本機能（課題要件）

- **リポジトリ検索**: キーワード入力でGitHub API (search/repositories) を使ったリポジトリ検索
- **検索結果一覧**: リポジトリ名、オーナーアイコン、説明文、言語、Star数、Fork数を表示
- **リポジトリ詳細ページ**: リポジトリ名、オーナーアイコン、言語、Star数、Watcher数、Fork数、Issue数を表示（モーダルではなく独立ページとして実装）
- **ページネーション**: 検索結果のページ切り替え（上下に配置）
- **テストコード**: Vitest + React Testing Libraryによる29テストケース

### 追加機能

- **AI要約機能**: Google Gemini APIを使ったリポジトリREADMEの自動要約（日本語）。詳細ページでボタンクリックで生成。思考中のOctocatアニメーション付き
- **ダークモード切り替え**: 手動トグルスイッチ（sun/moon アイコン）。ローカルストレージで設定保持、OS設定をデフォルトとして適用
- **並び替え**: Star数、Fork数、更新日、Help Wanted、関連度から選択可能
- **表示件数切り替え**: 10件、20件、30件、50件から選択可能
- **検索状態の保持**: 詳細ページから戻った際に検索キーワード、ページ、並び替え、表示件数を復元
- **カスタムセレクト**: ネイティブselectの代わりにカスタムドロップダウンUIを実装

## コマンド

```bash
npm run dev        # 開発サーバー起動
npm run build      # プロダクションビルド
npm run start      # プロダクションサーバー起動
npm run lint       # ESLint実行
npm test           # テスト実行
npm run test:watch # テストをウォッチモードで実行
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
  api/summarize/
    route.ts                        # AI要約APIエンドポイント
  repositories/[owner]/[repo]/
    page.tsx                        # リポジトリ詳細ページ（Server Component）
components/
  search-form.tsx                   # 検索フォーム（Client Component）
  search-results.tsx                # 検索結果表示（Server Component）
  repository-card.tsx               # リポジトリカード
  pagination.tsx                    # ページネーション（Client Component）
  ai-summary.tsx                    # AI要約コンポーネント（Client Component）
  custom-select.tsx                 # カスタムセレクト（Client Component）
  theme-toggle.tsx                  # ダークモード切り替え（Client Component）
lib/
  github.ts                        # GitHub API クライアント
  types.ts                         # 型定義
```

## 工夫した点・こだわりポイント

### 1. Server ComponentsとClient Componentsの適切な分離

検索結果の取得やリポジトリ詳細の取得はServer Componentsで行い、ユーザーインタラクションが必要な検索フォーム・ダークモード切り替え・AI要約のみClient Componentとして実装しました。これにより、JavaScriptバンドルサイズを最小限に抑えつつ、必要な箇所でのみクライアントサイドの機能を利用しています。

### 2. Suspenseによるストリーミングレンダリング

検索結果の表示に`Suspense`を使用し、データ取得中はスケルトンUIを表示します。`key`属性にクエリ・ページ・並び替え・表示件数を含めることで、パラメータ変更時に適切にSuspense境界がリセットされます。

### 3. プロダクション品質のエラーハンドリング

- GitHub API のレートリミット (403)、バリデーションエラー (422)、404 を個別にハンドリング
- `error.tsx` によるグローバルエラーバウンダリ
- `not-found.tsx` による404ページ
- 型安全な `GitHubApiError` クラスによるエラー管理
- AI要約APIのエラーはユーザーフレンドリーな日本語メッセージで表示

### 4. GitHub API上限への対応

GitHub Search APIは最大1000件までしか結果を返さないため、ページネーションでその上限を考慮しています。

### 5. アクセシビリティ

- 適切な`aria-label`、`aria-current`、`aria-expanded`属性の付与
- カスタムセレクトのキーボードナビゲーション対応（Enter/Space/Escape）
- セマンティックなHTML構造（`role="combobox"`, `role="listbox"`, `role="option"`）

### 6. レスポンシブデザインとダークモード

- Tailwind CSSのユーティリティクラスによるレスポンシブ対応
- クラスベースのダークモード切り替え（`localStorage`で設定保持）
- OS設定をデフォルトとして適用し、手動切り替えも可能
- 統計情報のグリッドはモバイルで2列、デスクトップで4列表示

### 7. パフォーマンス最適化

- `next/image`によるオーナーアイコンの最適化
- `revalidate: 60`による適切なキャッシュ戦略
- `useTransition`によるノンブロッキングなページ遷移

### 8. AI機能のUX

- READMEの要約はオンデマンド生成（ボタンクリック時のみAPI呼び出し）
- 思考中のOctocatアニメーションとローテーションメッセージで待ち時間を楽しく演出
- Markdown形式の要約結果をHTMLにレンダリング
- 外部SDKを使わずraw fetchでGemini APIを呼び出し、依存関係を最小化

### 9. 検索状態の完全保持

- 検索キーワード、ページ番号、並び替え、表示件数をすべてURLパラメータで管理
- 詳細ページへの遷移時にすべてのパラメータを引き継ぎ、戻る際に完全復元

## AI利用レポート

本プロジェクトの開発にはAI（Claude Code - Claude Opus 4.6）を利用しました。

### 利用方法

開発はAIとの対話形式で段階的に進めました。

1. **基本機能の実装**: 課題要件に基づき、検索機能・詳細ページ・ページネーション・テストコードの初期実装をAIが支援しました。

2. **機能追加（対話的に実施）**:
   - 検索状態の保持（戻るボタンで検索結果を復元）
   - AI要約機能（Gemini APIとの連携、READMEの取得・要約表示）
   - ダークモード切り替え
   - 並び替え・表示件数の選択機能
   - カスタムセレクトコンポーネント

3. **UI/UXの改善**: グラデーション、アニメーション、Octocatモチーフなど、モダンなデザインへの段階的なリファクタリング。

4. **テストコード**: Vitest + React Testing Libraryによる29テストケースの作成・更新。機能追加に合わせてテストも逐次修正。

5. **品質管理**: ESLint・ビルド・テストによる検証をAIが各ステップで実施。

### AIの活用で特に効果的だった点

- Next.js 16のServer Components / Client Componentsの適切な分離
- 包括的なエラーハンドリングパターンの実装
- テストコードの作成と機能変更に伴う更新
- TypeScriptの型安全性を維持したコード全体の一貫性

### 人間が判断・実施した点

- 追加機能の方針決定（AI要約、ダークモード、並び替えなど）
- 使用するAIサービス（Google Gemini）の選定
- UIデザインの方向性指示とレビュー
- Gemini APIモデルの選択（地域制限への対応）
- 最終的なコード品質の確認
