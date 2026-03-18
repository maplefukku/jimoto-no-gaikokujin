'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import MatchingCard from './MatchingCard'
import type { Profile } from '@/types/database'
import { useRouter } from 'next/navigation'

interface MatchingSwiperProps {
  candidates: Profile[]
  currentUserId: string
}

export default function MatchingSwiper({ candidates, currentUserId }: MatchingSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [matchedUser, setMatchedUser] = useState<Profile | null>(null)
  const router = useRouter()

  const handleLike = useCallback(async () => {
    const target = candidates[currentIndex]
    if (!target) return

    const supabase = createClient()

    // いいねを送信
    const { error: likeError } = await supabase
      .from('matches')
      .insert({ from_user_id: currentUserId, to_user_id: target.id, status: 'pending' })

    if (likeError) {
      // already liked - skip
    }

    // 相互いいねチェック
    const { data: mutual } = await supabase
      .from('matches')
      .select('*')
      .eq('from_user_id', target.id)
      .eq('to_user_id', currentUserId)
      .eq('status', 'pending')
      .single()

    if (mutual) {
      // マッチング成立！
      await supabase.from('matches').update({ status: 'matched' }).eq('id', mutual.id)
      await supabase
        .from('matches')
        .update({ status: 'matched' })
        .eq('from_user_id', currentUserId)
        .eq('to_user_id', target.id)

      // チャットルーム作成
      const [id1, id2] = [currentUserId, target.id].sort()
      await supabase
        .from('chat_rooms')
        .upsert({ user1_id: id1, user2_id: id2 }, { onConflict: 'user1_id,user2_id' })

      setMatchedUser(target)
    }

    setCurrentIndex((i) => i + 1)
  }, [candidates, currentIndex, currentUserId])

  const handleSkip = useCallback(() => {
    setCurrentIndex((i) => i + 1)
  }, [])

  if (matchedUser) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-pink-600 mb-2">マッチング成立！</h2>
        <p className="text-gray-600 mb-6">
          {matchedUser.name}さんとマッチしました！
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => { setMatchedUser(null) }}
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

  if (currentIndex >= candidates.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-5xl mb-4">😊</div>
        <h2 className="text-lg font-semibold text-gray-700">今日の候補はこれで全部です</h2>
        <p className="mt-2 text-sm text-gray-500">また後でチェックしてみてください</p>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto">
      <MatchingCard
        profile={candidates[currentIndex]}
        onLike={handleLike}
        onSkip={handleSkip}
      />
      <p className="mt-3 text-center text-xs text-gray-400">
        {currentIndex + 1} / {candidates.length}
      </p>
    </div>
  )
}
