import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StatCard from '@/components/dashboard/StatCard'
import MenuLink from '@/components/dashboard/MenuLink'
import ProfilePrompt from '@/components/dashboard/ProfilePrompt'
import SafetyNotice from '@/components/dashboard/SafetyNotice'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { count: matchCount } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })
    .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
    .eq('status', 'matched')

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

      {!isProfileComplete && <ProfilePrompt />}

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard value={matchCount || 0} label="マッチ数" gradient="from-pink-500 to-pink-600" />
        <StatCard value={unreadCount || 0} label="未読メッセージ" gradient="from-purple-500 to-purple-600" />
      </div>

      <div className="space-y-3">
        <MenuLink href="/matching" icon="💕" title="マッチングを始める" description="新しい人と出会おう" />
        <MenuLink href="/chat" icon="💬" title="チャット" description="マッチした相手と会話しよう" />
        <MenuLink href="/profile" icon="👤" title="プロフィール" description="自分の情報を編集" />
      </div>

      <SafetyNotice />
    </div>
  )
}
