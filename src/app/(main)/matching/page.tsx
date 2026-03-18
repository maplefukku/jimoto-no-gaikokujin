import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MatchingSwiper from '@/components/MatchingSwiper'

export default async function MatchingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // 自分のプロフィールを取得
  const { data: myProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!myProfile) redirect('/profile')

  // 既にいいね済み or マッチ済みのユーザーIDを取得
  const { data: existingMatches } = await supabase
    .from('matches')
    .select('to_user_id')
    .eq('from_user_id', user.id)

  const excludeIds = [
    user.id,
    ...(existingMatches?.map((m) => m.to_user_id) || []),
  ]

  // 候補者取得: 同じ地域優先、タグマッチ
  let query = supabase
    .from('profiles')
    .select('*')
    .not('id', 'in', `(${excludeIds.join(',')})`)
    .neq('name', '')
    .limit(20)

  // 外国人は日本人を、日本人は外国人を優先
  if (myProfile.is_foreigner) {
    query = query.order('is_foreigner', { ascending: true })
  } else {
    query = query.order('is_foreigner', { ascending: false })
  }

  const { data: candidates } = await query

  return (
    <div className="px-4 py-6">
      <h1 className="mb-4 text-xl font-bold text-gray-900">マッチング</h1>
      <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 p-3">
        <p className="text-xs text-yellow-800">
          ⚠️ 初めて会う際は、カフェなどの公共の場所で会うことをお勧めします。
        </p>
      </div>
      <MatchingSwiper
        candidates={candidates || []}
        currentUserId={user.id}
      />
    </div>
  )
}
