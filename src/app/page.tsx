import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-pink-50 via-white to-purple-50 px-4 py-12">
        <div className="max-w-sm text-center">
          <div className="text-6xl mb-4">🌏</div>
          <h1 className="text-3xl font-bold text-gray-900">
            地元の外国人
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            海外に行かずに、<br />地元で外国人の友達を作ろう
          </p>

          <div className="mt-8 space-y-3">
            <Link
              href="/signup"
              className="block w-full rounded-xl bg-pink-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-pink-500"
            >
              無料で始める
            </Link>
            <Link
              href="/login"
              className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              ログイン
            </Link>
          </div>

          <div className="mt-12 space-y-4">
            <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
              <div className="text-2xl mb-2">🗾</div>
              <h3 className="text-sm font-semibold text-gray-900">地域ベースマッチング</h3>
              <p className="mt-1 text-xs text-gray-500">あなたの地元にいる外国人を見つけよう</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
              <div className="text-2xl mb-2">🏷️</div>
              <h3 className="text-sm font-semibold text-gray-900">趣味でつながる</h3>
              <p className="mt-1 text-xs text-gray-500">共通の趣味や興味を持つ人を優先表示</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
              <div className="text-2xl mb-2">💬</div>
              <h3 className="text-sm font-semibold text-gray-900">リアルタイムチャット</h3>
              <p className="mt-1 text-xs text-gray-500">マッチした相手とすぐにチャット開始</p>
            </div>
          </div>

          <p className="mt-8 text-xs text-gray-400">
            18歳以上の方のみご利用いただけます
          </p>
        </div>
      </div>
    </div>
  )
}
