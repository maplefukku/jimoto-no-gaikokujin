'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { REGIONS, LANGUAGES, INTERESTS, GENDERS } from '@/lib/constants'
import InterestTagSelector from './InterestTagSelector'
import InputField from './ui/InputField'
import SelectField from './ui/SelectField'
import TextareaField from './ui/TextareaField'
import CheckboxField from './ui/CheckboxField'
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

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

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
      <InputField
        label="名前"
        required
        value={form.name}
        onChange={(e) => updateField('name', e.target.value)}
        placeholder="あなたの名前"
      />

      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="年齢"
          type="number"
          required
          min={18}
          max={100}
          value={form.age}
          onChange={(e) => updateField('age', parseInt(e.target.value) || 18)}
        />
        <SelectField
          label="性別"
          options={GENDERS}
          value={form.gender}
          onChange={(e) => updateField('gender', e.target.value)}
        />
      </div>

      <CheckboxField
        label="外国人です（日本在住の外国人の方はチェック）"
        checked={form.is_foreigner}
        onChange={(e) => updateField('is_foreigner', e.target.checked)}
      />

      <SelectField
        label="都道府県"
        options={REGIONS}
        value={form.region}
        onChange={(e) => updateField('region', e.target.value)}
      />

      <InputField
        label="市区町村"
        value={form.city}
        onChange={(e) => updateField('city', e.target.value)}
        placeholder="例: 渋谷区"
      />

      <SelectField
        label="母国語"
        options={LANGUAGES}
        value={form.native_language}
        onChange={(e) => updateField('native_language', e.target.value)}
      />

      <InterestTagSelector
        label="学習中の言語"
        options={LANGUAGES}
        selected={form.learning_languages}
        onChange={(learning_languages) => updateField('learning_languages', learning_languages)}
      />

      <InterestTagSelector
        label="興味・趣味"
        options={INTERESTS}
        selected={form.interests}
        onChange={(interests) => updateField('interests', interests)}
      />

      <TextareaField
        label="自己紹介"
        value={form.bio}
        onChange={(e) => updateField('bio', e.target.value)}
        rows={3}
        placeholder="自分について教えてください..."
      />

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
