import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProfileEditForm from '../components/ProfileEditForm'
import type { Profile } from '../types/database'

// Mock dependencies
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  })),
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    refresh: vi.fn(),
  })),
}))

const mockProfile: Profile = {
  id: 'test-id',
  email: 'test@example.com',
  name: 'Test User',
  age: 25,
  gender: '男性',
  region: '東京都',
  city: '渋谷区',
  native_language: '日本語',
  learning_languages: ['英語'],
  interests: ['音楽', '映画'],
  bio: 'テストユーザーです',
  is_foreigner: false,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
}

describe('ProfileEditForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form with profile data', () => {
    render(<ProfileEditForm profile={mockProfile} />)
    
    expect(screen.getByLabelText('名前')).toHaveValue('Test User')
    expect(screen.getByLabelText('年齢')).toHaveValue(25)
    expect(screen.getByLabelText('市区町村')).toHaveValue('渋谷区')
  })

  it('allows name input change', () => {
    render(<ProfileEditForm profile={mockProfile} />)
    
    const nameInput = screen.getByLabelText('名前')
    fireEvent.change(nameInput, { target: { value: 'New Name' } })
    
    expect(nameInput).toHaveValue('New Name')
  })

  it('allows age input change', () => {
    render(<ProfileEditForm profile={mockProfile} />)
    
    const ageInput = screen.getByLabelText('年齢')
    fireEvent.change(ageInput, { target: { value: '30' } })
    
    expect(ageInput).toHaveValue(30)
  })

  it('renders submit button', () => {
    render(<ProfileEditForm profile={mockProfile} />)
    
    expect(screen.getByRole('button', { name: /プロフィールを保存/ })).toBeInTheDocument()
  })

  it('shows loading state on submit', async () => {
    render(<ProfileEditForm profile={mockProfile} />)
    
    const submitButton = screen.getByRole('button', { name: /プロフィールを保存/ })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('保存中...')).toBeInTheDocument()
    })
  })

  it('renders checkbox for foreigner status', () => {
    render(<ProfileEditForm profile={mockProfile} />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('allows checkbox toggle', () => {
    render(<ProfileEditForm profile={mockProfile} />)
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    
    expect(checkbox).toBeChecked()
  })

  it('renders bio textarea', () => {
    render(<ProfileEditForm profile={mockProfile} />)
    
    const bioTextarea = screen.getByLabelText('自己紹介')
    expect(bioTextarea).toHaveValue('テストユーザーです')
  })
})
