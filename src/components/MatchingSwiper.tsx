'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import MatchingCard from './MatchingCard'
import MatchSuccess from './matching/MatchSuccess'
import NoMoreCandidates from './matching/NoMoreCandidates'
import type { Profile } from '@/types/database'

interface MatchingSwiperProps {
  candidates: Profile[]
  currentUserId: string
}

export default function MatchingSwiper({ candidates, currentUserId }: MatchingSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [matchedUser, setMatchedUser] = useState<Profile | null>(null)

  const handleLike = useCallback(async () => {
    const target = candidates[currentIndex]
    if (!target) return

    const supabase = createClient()

    await supabase
      .from('matches')
      .insert({ from_user_id: currentUserId, to_user_id: target.id, status: 'pending' })

    const { data: mutual } = await supabase
      .from('matches')
      .select('*')
      .eq('from_user_id', target.id)
      .eq('to_user_id', currentUserId)
      .eq('status', 'pending')
      .single()

    if (mutual) {
      await supabase.from('matches').update({ status: 'matched' }).eq('id', mutual.id)
      await supabase
        .from('matches')
        .update({ status: 'matched' })
        .eq('from_user_id', currentUserId)
        .eq('to_user_id', target.id)

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
      <MatchSuccess
        matchedUser={matchedUser}
        onContinue={() => setMatchedUser(null)}
      />
    )
  }

  if (currentIndex >= candidates.length) {
    return <NoMoreCandidates />
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
