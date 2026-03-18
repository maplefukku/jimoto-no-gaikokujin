import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileEditForm from '@/components/ProfileEditForm'
import type { Profile } from '@/types/database'
import LogoutButton from '@/components/LogoutButton'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // プロフィールがまだない場合はデフォルト値を使用
  const defaultProfile: Profile = {
    id: user.id,
    email: user.email || '',
    name: '',
    age: 18,
    gender: '',
    region: '',
    city: '',
    native_language: '',
    learning_languages: [],
    interests: [],
    bio: '',
    avatar_url: null,
    is_foreigner: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">プロフィール編集</h1>
        <LogoutButton />
      </div>
      <ProfileEditForm profile={profile || defaultProfile} />
    </div>
  )
}
