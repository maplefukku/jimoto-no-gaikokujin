'use client'

import type { Profile } from '@/types/database'

interface MatchingCardProps {
  profile: Profile
  onLike: () => void
  onSkip: () => void
}

export default function MatchingCard({ profile, onLike, onSkip }: MatchingCardProps) {
  return (
    <div className="rounded-2xl bg-white shadow-lg overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-6 text-center">
        <div className="mx-auto h-24 w-24 rounded-full bg-pink-200 flex items-center justify-center text-4xl">
          {profile.is_foreigner ? '🌍' : '🗾'}
        </div>
        <h2 className="mt-3 text-xl font-bold text-gray-900">{profile.name || '名前未設定'}</h2>
        <p className="text-sm text-gray-600">
          {profile.age}歳 {profile.gender && `・ ${profile.gender}`}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {profile.region} {profile.city}
        </p>
      </div>

      <div className="p-4 space-y-3">
        {profile.native_language && (
          <div>
            <span className="text-xs font-medium text-gray-500">母国語</span>
            <p className="text-sm text-gray-800">{profile.native_language}</p>
          </div>
        )}

        {profile.learning_languages.length > 0 && (
          <div>
            <span className="text-xs font-medium text-gray-500">学習中</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {profile.learning_languages.map((lang) => (
                <span key={lang} className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.interests.length > 0 && (
          <div>
            <span className="text-xs font-medium text-gray-500">趣味・興味</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {profile.interests.map((interest) => (
                <span key={interest} className="rounded-full bg-pink-100 px-2 py-0.5 text-xs text-pink-700">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.bio && (
          <div>
            <span className="text-xs font-medium text-gray-500">自己紹介</span>
            <p className="mt-1 text-sm text-gray-700">{profile.bio}</p>
          </div>
        )}
      </div>

      <div className="flex border-t border-gray-100">
        <button
          onClick={onSkip}
          className="flex-1 py-3 text-center text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
        >
          スキップ
        </button>
        <button
          onClick={onLike}
          className="flex-1 py-3 text-center text-sm font-semibold text-pink-600 hover:bg-pink-50 border-l border-gray-100 transition-colors"
        >
          いいね ❤️
        </button>
      </div>
    </div>
  )
}
