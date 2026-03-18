import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // マッチ数を取得
  const { count: matchCount } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })
    .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
    .eq('status', 'matched')

  // 未読メッセージ数を取得
  const { count: unreadCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .neq('sender_id', user.id)
    .eq('is_read', false)

  const isProfileComplete = profile?.name && profile?.region

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          {profile?.name ? `こんにちは、${profile.name}さん` : 'ようこそ！'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">地元で新しい友達を見つけよう</p>
      </div>

      {!isProfileComplete && (
        <Link href="/profile" className="mb-4 block rounded-xl bg-pink-50 border border-pink-200 p-4">
          <p className="text-sm font-medium text-pink-800">
            まずプロフィールを完成させましょう！
          </p>
          <p className="mt-1 text-xs text-pink-600">
            プロフィールを設定して、マッチングを始めましょう →
          </p>
        </Link>
      )}

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 p-4 text-white">
          <p className="text-2xl font-bold">{matchCount || 0}</p>
          <p className="text-xs opacity-80">マッチ数</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white">
          <p className="text-2xl font-bold">{unreadCount || 0}</p>
          <p className="text-xs opacity-80">未読メッセージ</p>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href="/matching"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">💕</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">マッチングを始める</p>
              <p className="text-xs text-gray-500">新しい人と出会おう</p>
            </div>
          </div>
          <span className="text-gray-400">→</span>
        </Link>

        <Link
          href="/chat"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">💬</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">チャット</p>
              <p className="text-xs text-gray-500">マッチした相手と会話しよう</p>
            </div>
          </div>
          <span className="text-gray-400">→</span>
        </Link>

        <Link
          href="/profile"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">👤</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">プロフィール</p>
              <p className="text-xs text-gray-500">自分の情報を編集</p>
            </div>
          </div>
          <span className="text-gray-400">→</span>
        </Link>
      </div>

      <div className="mt-6 rounded-lg bg-yellow-50 border border-yellow-200 p-3">
        <p className="text-xs text-yellow-800">
          ⚠️ 初めて会う際は、カフェなどの公共の場所で会うことをお勧めします。安全に友達作りを楽しみましょう。
        </p>
      </div>
    </div>
  )
}
