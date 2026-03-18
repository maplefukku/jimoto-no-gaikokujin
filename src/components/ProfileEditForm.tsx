'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { REGIONS, LANGUAGES, INTERESTS, GENDERS } from '@/lib/constants'
import InterestTagSelector from './InterestTagSelector'
import type { Profile } from '@/types/database'
import { useRouter } from 'next/navigation'

interface ProfileEditFormProps {
  profile: Profile
}

export default function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const [form, setForm] = useState({
    name: profile.name || '',
    age: profile.age || 18,
    gender: profile.gender || '',
    region: profile.region || '',
    city: profile.city || '',
    native_language: profile.native_language || '',
    learning_languages: profile.learning_languages || [],
    interests: profile.interests || [],
    bio: profile.bio || '',
    is_foreigner: profile.is_foreigner || false,
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        name: form.name,
        age: form.age,
        gender: form.gender,
        region: form.region,
        city: form.city,
        native_language: form.native_language,
        learning_languages: form.learning_languages,
        interests: form.interests,
        bio: form.bio,
        is_foreigner: form.is_foreigner,
      })
      .eq('id', profile.id)

    if (error) {
      setMessage('保存に失敗しました')
    } else {
      setMessage('プロフィールを保存しました！')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700">名前</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:ring-pink-500 focus:outline-none"
          placeholder="あなたの名前"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">年齢</label>
          <input
            type="number"
            required
            min={18}
            max={100}
            value={form.age}
            onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) || 18 })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:ring-pink-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">性別</label>
          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:ring-pink-500 focus:outline-none"
          >
            <option value="">選択してください</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={form.is_foreigner}
            onChange={(e) => setForm({ ...form, is_foreigner: e.target.checked })}
            className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
          />
          外国人です（日本在住の外国人の方はチェック）
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">都道府県</label>
        <select
          value={form.region}
          onChange={(e) => setForm({ ...form, region: e.target.value })}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:ring-pink-500 focus:outline-none"
        >
          <option value="">選択してください</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">市区町村</label>
        <input
          type="text"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:ring-pink-500 focus:outline-none"
          placeholder="例: 渋谷区"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">母国語</label>
        <select
          value={form.native_language}
          onChange={(e) => setForm({ ...form, native_language: e.target.value })}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:ring-pink-500 focus:outline-none"
        >
          <option value="">選択してください</option>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      <InterestTagSelector
        label="学習中の言語"
        options={LANGUAGES}
        selected={form.learning_languages}
        onChange={(learning_languages) => setForm({ ...form, learning_languages })}
      />

      <InterestTagSelector
        label="興味・趣味"
        options={INTERESTS}
        selected={form.interests}
        onChange={(interests) => setForm({ ...form, interests })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">自己紹介</label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:ring-pink-500 focus:outline-none"
          placeholder="自分について教えてください..."
        />
      </div>

      {message && (
        <p className={`text-sm ${message.includes('失敗') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 disabled:opacity-50"
      >
        {loading ? '保存中...' : 'プロフィールを保存'}
      </button>
    </form>
  )
}
