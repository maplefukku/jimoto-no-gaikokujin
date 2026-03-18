import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ChatWindow from '@/components/ChatWindow'

export default async function ChatRoomPage(props: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // ルーム情報を取得
  const { data: room } = await supabase
    .from('chat_rooms')
    .select('*')
    .eq('id', roomId)
    .single()

  if (!room) notFound()

  // 自分がメンバーか確認
  if (room.user1_id !== user.id && room.user2_id !== user.id) {
    notFound()
  }

  const partnerId = room.user1_id === user.id ? room.user2_id : room.user1_id

  // 相手のプロフィールを取得
  const { data: partner } = await supabase
    .from('profiles')
    .select('id, name, region, is_foreigner')
    .eq('id', partnerId)
    .single()

  // 既存メッセージを取得
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
    .limit(100)

  // 未読メッセージを既読にする
  await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('room_id', roomId)
    .neq('sender_id', user.id)
    .eq('is_read', false)

  return (
    <ChatWindow
      roomId={roomId}
      currentUserId={user.id}
      partner={partner || { id: partnerId, name: '不明', region: '', is_foreigner: false }}
      initialMessages={messages || []}
    />
  )
}
