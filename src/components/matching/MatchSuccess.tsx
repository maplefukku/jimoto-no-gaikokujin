'use client'

import type { Profile } from '@/types/database'
import { useRouter } from 'next/navigation'

interface MatchSuccessProps {
  matchedUser: Profile
  onContinue: () => void
}

export default function MatchSuccess({ matchedUser, onContinue }: MatchSuccessProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-pink-600 mb-2">マッチング成立！</h2>
      <p className="text-gray-600 mb-6">
        {matchedUser.name}さんとマッチしました！
      </p>
      <div className="flex gap-3">
        <button
          onClick={onContinue}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          続ける
        </button>
        <button
          onClick={() => router.push('/chat')}
          className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-500"
        >
          チャットへ
        </button>
      </div>
    </div>
  )
}
