import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ChatListPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // 自分のチャットルームを取得
  const { data: rooms } = await supabase
    .from('chat_rooms')
    .select('*')
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .order('last_message_at', { ascending: false, nullsFirst: false })

  // 相手のプロフィールを取得
  const partnerIds = (rooms || []).map((room) =>
    room.user1_id === user.id ? room.user2_id : room.user1_id
  )

  const { data: partners } = partnerIds.length > 0
    ? await supabase
        .from('profiles')
        .select('id, name, region, is_foreigner')
        .in('id', partnerIds)
    : { data: [] }

  const partnersMap = new Map(
    (partners || []).map((p) => [p.id, p])
  )

  // 各ルームの最新メッセージを取得
  const roomIds = (rooms || []).map((r) => r.id)
  const { data: latestMessages } = roomIds.length > 0
    ? await supabase
        .from('messages')
        .select('room_id, content, created_at, sender_id, is_read')
        .in('room_id', roomIds)
        .order('created_at', { ascending: false })
    : { data: [] }

  // ルームごとの最新メッセージをマップ
  type LatestMessage = NonNullable<typeof latestMessages>[number]
  const latestMessageMap = new Map<string, LatestMessage>()
  for (const msg of latestMessages || []) {
    if (!latestMessageMap.has(msg.room_id)) {
      latestMessageMap.set(msg.room_id, msg)
    }
  }

  return (
    <div className="px-4 py-6">
      <h1 className="mb-4 text-xl font-bold text-gray-900">チャット</h1>

      {(!rooms || rooms.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-5xl mb-4">💬</div>
          <h2 className="text-lg font-semibold text-gray-700">チャットはまだありません</h2>
          <p className="mt-2 text-sm text-gray-500">マッチングするとチャットができます</p>
          <Link
            href="/matching"
            className="mt-4 rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-500"
          >
            マッチングへ
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {rooms.map((room) => {
            const partnerId = room.user1_id === user.id ? room.user2_id : room.user1_id
            const partner = partnersMap.get(partnerId)
            const lastMsg = latestMessageMap.get(room.id)
            const isUnread = lastMsg && lastMsg.sender_id !== user.id && !lastMsg.is_read

            return (
              <Link
                key={room.id}
                href={`/chat/${room.id}`}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 hover:bg-gray-50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-xl">
                  {partner?.is_foreigner ? '🌍' : '🗾'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {partner?.name || '不明なユーザー'}
                    </p>
                    {lastMsg && (
                      <span className="text-xs text-gray-400 shrink-0 ml-2">
                        {formatTime(lastMsg.created_at)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 truncate">
                      {lastMsg ? lastMsg.content : 'メッセージを送ってみましょう'}
                    </p>
                    {isUnread && (
                      <span className="ml-2 h-2 w-2 shrink-0 rounded-full bg-pink-500" />
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)

  if (diffHours < 1) return `${Math.max(1, Math.floor(diffMs / (1000 * 60)))}分前`
  if (diffHours < 24) return `${Math.floor(diffHours)}時間前`
  if (diffHours < 48) return '昨日'
  return `${date.getMonth() + 1}/${date.getDate()}`
}
