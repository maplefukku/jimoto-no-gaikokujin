'use client'

interface ChatMessageProps {
  content: string
  createdAt: string
  isMine: boolean
}

function formatMessageTime(dateString: string): string {
  const date = new Date(dateString)
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
}

export default function ChatMessage({ content, createdAt, isMine }: ChatMessageProps) {
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-3 py-2 ${
          isMine
            ? 'bg-pink-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        <p className={`mt-1 text-xs ${isMine ? 'text-pink-200' : 'text-gray-400'}`}>
          {formatMessageTime(createdAt)}
        </p>
      </div>
    </div>
  )
}
