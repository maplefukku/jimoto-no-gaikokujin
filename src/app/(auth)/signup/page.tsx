'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import InputField from '@/components/ui/InputField'
import CheckboxField from '@/components/ui/CheckboxField'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [ageConfirm, setAgeConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      return
    }

    if (!ageConfirm) {
      setError('18歳以上であることを確認してください')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError('登録に失敗しました。もう一度お試しください。')
      setLoading(false)
      return
    }

    router.push('/profile')
    router.refresh()
  }

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <InputField
        label="メールアドレス"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="example@email.com"
      />

      <InputField
        label="パスワード"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="6文字以上"
      />

      <InputField
        label="パスワード（確認）"
        type="password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="パスワードを再入力"
      />

      <CheckboxField
        label="18歳以上であることを確認します"
        checked={ageConfirm}
        onChange={(e) => setAgeConfirm(e.target.checked)}
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 disabled:opacity-50"
      >
        {loading ? '登録中...' : '新規登録'}
      </button>

      <p className="text-center text-sm text-gray-500">
        既にアカウントをお持ちの方は{' '}
        <Link href="/login" className="font-semibold text-pink-600 hover:text-pink-500">
          ログイン
        </Link>
      </p>
    </form>
  )
}
