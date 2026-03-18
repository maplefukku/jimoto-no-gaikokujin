# PROMPT.md: 地元の外国人 (Jimoto no Gaikokujin)

## アプリ概要
海外に行かずに、地元で外国人の友達を作るマッチングアプリ

## 技術スタック
- Next.js 14 (App Router)
- Supabase (Auth, Database, Realtime)
- Tailwind CSS
- TypeScript

## MVP機能 (P0必須)
1. プロフィール登録 (名前、年齢、地域、言語、興味タグ)
2. 地域ベース検索 (市区町村レベル)
3. タグベースマッチング
4. プロフィール閲覧
5. 「いいね」送信
6. マッチング成立 (相互いいね)
7. 簡易チャット (マッチング後)

## 実装指示

### 1. Supabaseセットアップ
- `src/lib/supabase/client.ts` (ブラウザ用)
- `src/lib/supabase/server.ts` (サーバー用)
- 環境変数の型定義

### 2. データベーススキーマ (Supabase SQL)
以下のテーブルを作成:
- `profiles` (ユーザープロフィール)
- `matches` (マッチング状態)
- `chat_rooms` (チャットルーム)
- `messages` (メッセージ)

### 3. ページ構成
```
src/app/
├── (auth)/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── layout.tsx
├── (main)/
│   ├── dashboard/page.tsx
│   ├── matching/page.tsx
│   ├── chat/page.tsx
│   ├── profile/page.tsx
│   └── layout.tsx
├── api/
│   ├── users/
│   ├── matching/
│   └── chat/
├── layout.tsx
└── page.tsx (ランディングページ)
```

### 4. 主要コンポーネント
- `MatchingCard` - 候補者カード
- `MatchingSwiper` - スワイプUI
- `ChatWindow` - チャット表示
- `ProfileEditForm` - プロフィール編集
- `InterestTagSelector` - タグ選択

### 5. 認証フロー
- Supabase Auth (email/password)
- Google OAuth (オプション)
- Middleware で保護されたルート

### 6. マッチングロジック
- 地域で近い順に表示
- タグが一致する相手を優先
- 相互いいねでマッチング成立

### 7. チャット機能
- Supabase Realtime でリアルタイム通信
- マッチング成立者のみチャット可能

## 重要なポイント
- モバイルファーストでデザイン
- 日本語UI
- 初回対面は公共場所推奨の警告を常時表示
- 18歳以上限定

## テスト
- 基本的な動作確認
- ユーザー登録→プロフィール作成→マッチング→チャットのフロー確認

## 最終ゴール
- `npm run build` が成功すること
- `npm run dev` でアプリが動作すること
- Vercelにデプロイ可能な状態

---

**参照ドキュメント**:
- PRD: /Users/fukku/.opengoat/workspaces/dev-pdm/output/prd_1.md
- Architecture: /Users/fukku/.opengoat/workspaces/dev-architect/output/architecture_1.md

**実装方針**: MVPとして動作する最小限の機能を実装する。完璧より動くものを優先。
