import Link from 'next/link'

interface ChatRoomItemProps {
  roomId: string
  partnerId: string
  partnerName: string | undefined
  isForeigner: boolean | undefined
  lastMessageContent: string | undefined
  lastMessageTime: string | undefined
  isUnread: boolean
}

export default function ChatRoomItem({
  roomId,
  partnerName,
  isForeigner,
  lastMessageContent,
  lastMessageTime,
  isUnread,
}: ChatRoomItemProps) {
  return (
    <Link
      href={`/chat/${roomId}`}
      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 hover:bg-gray-50"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-xl">
        {isForeigner ? '🌍' : '🗾'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {partnerName || '不明なユーザー'}
          </p>
          {lastMessageTime && (
            <span className="text-xs text-gray-400 shrink-0 ml-2">
              {formatTime(lastMessageTime)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 truncate">
            {lastMessageContent || 'メッセージを送ってみましょう'}
          </p>
          {isUnread && (
            <span className="ml-2 h-2 w-2 shrink-0 rounded-full bg-pink-500" />
          )}
        </div>
      </div>
    </Link>
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
