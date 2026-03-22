import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ChatEmptyList from '@/components/chat/ChatEmptyList'
import ChatRoomItem from '@/components/chat/ChatRoomItem'

export default async function ChatListPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: rooms } = await supabase
    .from('chat_rooms')
    .select('*')
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .order('last_message_at', { ascending: false, nullsFirst: false })

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

  const roomIds = (rooms || []).map((r) => r.id)
  const { data: latestMessages } = roomIds.length > 0
    ? await supabase
        .from('messages')
        .select('room_id, content, created_at, sender_id, is_read')
        .in('room_id', roomIds)
        .order('created_at', { ascending: false })
    : { data: [] }

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
        <ChatEmptyList />
      ) : (
        <div className="space-y-2">
          {rooms.map((room) => {
            const partnerId = room.user1_id === user.id ? room.user2_id : room.user1_id
            const partner = partnersMap.get(partnerId)
            const lastMsg = latestMessageMap.get(room.id)
            const isUnread = lastMsg && lastMsg.sender_id !== user.id && !lastMsg.is_read

            return (
              <ChatRoomItem
                key={room.id}
                roomId={room.id}
                partnerId={partnerId}
                partnerName={partner?.name}
                isForeigner={partner?.is_foreigner}
                lastMessageContent={lastMsg?.content}
                lastMessageTime={lastMsg?.created_at}
                isUnread={!!isUnread}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
