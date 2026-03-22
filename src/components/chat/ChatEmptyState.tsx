'use client'

interface EmptyStateProps {
  partnerName: string
}

export default function ChatEmptyState({ partnerName }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="text-sm text-gray-400">
        {partnerName}さんとのチャットが始まりました！<br />
        メッセージを送ってみましょう
      </p>
    </div>
  )
}
