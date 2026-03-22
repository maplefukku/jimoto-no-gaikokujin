import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import MatchingSwiper from '../components/MatchingSwiper'
import type { Profile } from '../types/database'

// Mock supabase client
const mockSingle = vi.fn(() => Promise.resolve({ data: null }))
const mockSelectEq3 = vi.fn(() => ({ single: mockSingle }))
const mockSelectEq2 = vi.fn(() => ({ eq: mockSelectEq3 }))
const mockSelectEq1 = vi.fn(() => ({ eq: mockSelectEq2 }))
const mockSelect = vi.fn(() => ({ eq: mockSelectEq1 }))
const mockInsert = vi.fn(() => Promise.resolve({ error: null }))
const mockUpdateEq: ReturnType<typeof vi.fn> = vi.fn(function () { return { eq: mockUpdateEq, then: (r: (v: unknown) => void) => Promise.resolve({ error: null }).then(r) } })
const mockUpdate = vi.fn(() => ({ eq: mockUpdateEq }))
const mockUpsert = vi.fn(() => Promise.resolve({ error: null }))

const mockFrom = vi.fn((table: string) => {
  if (table === 'matches') {
    return {
      insert: mockInsert,
      select: mockSelect,
      update: mockUpdate,
    }
  }
  if (table === 'chat_rooms') {
    return { upsert: mockUpsert }
  }
  return {}
})

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
  })),
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

const mockCandidates: Profile[] = [
  {
    id: 'candidate-1',
    email: 'alice@example.com',
    name: 'Alice',
    age: 28,
    gender: '女性',
    region: '東京都',
    city: '渋谷区',
    native_language: '英語',
    learning_languages: ['日本語'],
    interests: ['音楽', '料理'],
    bio: 'Hi, I love Japan!',
    avatar_url: null,
    is_foreigner: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 'candidate-2',
    email: 'bob@example.com',
    name: 'Bob',
    age: 32,
    gender: '男性',
    region: '大阪府',
    city: '大阪市',
    native_language: 'フランス語',
    learning_languages: ['日本語', '英語'],
    interests: ['映画'],
    bio: 'Bonjour!',
    avatar_url: null,
    is_foreigner: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
]

describe('MatchingSwiper', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSingle.mockResolvedValue({ data: null })
  })

  it('renders first candidate', () => {
    render(<MatchingSwiper candidates={mockCandidates} currentUserId="user-1" />)

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText(/28歳/)).toBeInTheDocument()
  })

  it('shows progress indicator', () => {
    render(<MatchingSwiper candidates={mockCandidates} currentUserId="user-1" />)

    expect(screen.getByText('1 / 2')).toBeInTheDocument()
  })

  it('moves to next candidate on skip', () => {
    render(<MatchingSwiper candidates={mockCandidates} currentUserId="user-1" />)

    fireEvent.click(screen.getByText('スキップ'))

    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('2 / 2')).toBeInTheDocument()
  })

  it('shows no more candidates after skipping all', () => {
    render(<MatchingSwiper candidates={mockCandidates} currentUserId="user-1" />)

    fireEvent.click(screen.getByText('スキップ'))
    fireEvent.click(screen.getByText('スキップ'))

    expect(screen.getByText('今日の候補はこれで全部です')).toBeInTheDocument()
  })

  it('shows no more candidates when list is empty', () => {
    render(<MatchingSwiper candidates={[]} currentUserId="user-1" />)

    expect(screen.getByText('今日の候補はこれで全部です')).toBeInTheDocument()
  })

  it('inserts match on like', async () => {
    render(<MatchingSwiper candidates={mockCandidates} currentUserId="user-1" />)

    fireEvent.click(screen.getByText('いいね ❤️'))

    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('matches')
      expect(mockInsert).toHaveBeenCalledWith({
        from_user_id: 'user-1',
        to_user_id: 'candidate-1',
        status: 'pending',
      })
    })
  })

  it('checks for mutual match after like', async () => {
    render(<MatchingSwiper candidates={mockCandidates} currentUserId="user-1" />)

    fireEvent.click(screen.getByText('いいね ❤️'))

    await waitFor(() => {
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockSelectEq1).toHaveBeenCalledWith('from_user_id', 'candidate-1')
      expect(mockSelectEq2).toHaveBeenCalledWith('to_user_id', 'user-1')
      expect(mockSelectEq3).toHaveBeenCalledWith('status', 'pending')
    })
  })

  it('moves to next candidate after like (no mutual match)', async () => {
    render(<MatchingSwiper candidates={mockCandidates} currentUserId="user-1" />)

    fireEvent.click(screen.getByText('いいね ❤️'))

    await waitFor(() => {
      expect(screen.getByText('Bob')).toBeInTheDocument()
    })
  })

  it('shows match success on mutual match', async () => {
    mockSingle.mockResolvedValueOnce({ data: { id: 'match-99', from_user_id: 'candidate-1', to_user_id: 'user-1', status: 'pending' } })

    render(<MatchingSwiper candidates={mockCandidates} currentUserId="user-1" />)

    fireEvent.click(screen.getByText('いいね ❤️'))

    await waitFor(() => {
      expect(screen.getByText('マッチング成立！')).toBeInTheDocument()
      expect(screen.getByText('Aliceさんとマッチしました！')).toBeInTheDocument()
    })
  })

  it('creates chat room on mutual match', async () => {
    mockSingle.mockResolvedValueOnce({ data: { id: 'match-99', from_user_id: 'candidate-1', to_user_id: 'user-1', status: 'pending' } })

    render(<MatchingSwiper candidates={mockCandidates} currentUserId="user-1" />)

    fireEvent.click(screen.getByText('いいね ❤️'))

    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('chat_rooms')
      expect(mockUpsert).toHaveBeenCalled()
    })
  })

  it('can continue swiping after match success', async () => {
    mockSingle.mockResolvedValueOnce({ data: { id: 'match-99', from_user_id: 'candidate-1', to_user_id: 'user-1', status: 'pending' } })

    render(<MatchingSwiper candidates={mockCandidates} currentUserId="user-1" />)

    fireEvent.click(screen.getByText('いいね ❤️'))

    await waitFor(() => {
      expect(screen.getByText('マッチング成立！')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('続ける'))

    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('renders like and skip buttons', () => {
    render(<MatchingSwiper candidates={mockCandidates} currentUserId="user-1" />)

    expect(screen.getByText('いいね ❤️')).toBeInTheDocument()
    expect(screen.getByText('スキップ')).toBeInTheDocument()
  })
})
