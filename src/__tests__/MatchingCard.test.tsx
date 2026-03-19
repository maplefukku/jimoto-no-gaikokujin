import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import MatchingCard from '@/components/MatchingCard'
import type { Profile } from '@/types/database'

// モックプロフィール
const mockProfile: Profile = {
  id: 'test-id',
  email: 'test@example.com',
  name: 'テストユーザー',
  age: 25,
  gender: '男性',
  region: '東京都',
  city: '渋谷区',
  is_foreigner: false,
  native_language: '日本語',
  learning_languages: ['英語', '中国語'],
  interests: ['映画', '旅行', 'カフェ'],
  bio: 'テスト用の自己紹介文です。',
  avatar_url: null,
  created_at: '2026-03-19T00:00:00Z',
  updated_at: '2026-03-19T00:00:00Z',
}

const foreignerProfile: Profile = {
  ...mockProfile,
  id: 'foreigner-id',
  name: 'John Doe',
  is_foreigner: true,
  native_language: 'English',
  learning_languages: ['日本語'],
}

describe('MatchingCard', () => {
  it('プロフィール情報が正しく表示される', () => {
    render(
      <MatchingCard
        profile={mockProfile}
        onLike={vi.fn()}
        onSkip={vi.fn()}
      />
    )

    expect(screen.getByText('テストユーザー')).toBeInTheDocument()
    expect(screen.getByText(/25歳/)).toBeInTheDocument()
    expect(screen.getByText('東京都 渋谷区')).toBeInTheDocument()
    expect(screen.getByText('日本語')).toBeInTheDocument()
    expect(screen.getByText('テスト用の自己紹介文です。')).toBeInTheDocument()
  })

  it('学習中の言語が表示される', () => {
    render(
      <MatchingCard
        profile={mockProfile}
        onLike={vi.fn()}
        onSkip={vi.fn()}
      />
    )

    expect(screen.getByText('英語')).toBeInTheDocument()
    expect(screen.getByText('中国語')).toBeInTheDocument()
  })

  it('趣味・興味が表示される', () => {
    render(
      <MatchingCard
        profile={mockProfile}
        onLike={vi.fn()}
        onSkip={vi.fn()}
      />
    )

    expect(screen.getByText('映画')).toBeInTheDocument()
    expect(screen.getByText('旅行')).toBeInTheDocument()
    expect(screen.getByText('カフェ')).toBeInTheDocument()
  })

  it('日本人ユーザーは🗾アイコンが表示される', () => {
    render(
      <MatchingCard
        profile={mockProfile}
        onLike={vi.fn()}
        onSkip={vi.fn()}
      />
    )

    expect(screen.getByText('🗾')).toBeInTheDocument()
  })

  it('外国人ユーザーは🌍アイコンが表示される', () => {
    render(
      <MatchingCard
        profile={foreignerProfile}
        onLike={vi.fn()}
        onSkip={vi.fn()}
      />
    )

    expect(screen.getByText('🌍')).toBeInTheDocument()
  })

  it('いいねボタンとスキップボタンが表示される', () => {
    render(
      <MatchingCard
        profile={mockProfile}
        onLike={vi.fn()}
        onSkip={vi.fn()}
      />
    )

    expect(screen.getByText('スキップ')).toBeInTheDocument()
    expect(screen.getByText(/いいね/)).toBeInTheDocument()
  })

  it('いいねボタンをクリックするとonLikeが呼ばれる', async () => {
    const onLike = vi.fn()
    render(
      <MatchingCard
        profile={mockProfile}
        onLike={onLike}
        onSkip={vi.fn()}
      />
    )

    const likeButton = screen.getByText(/いいね/)
    likeButton.click()

    expect(onLike).toHaveBeenCalledTimes(1)
  })

  it('スキップボタンをクリックするとonSkipが呼ばれる', async () => {
    const onSkip = vi.fn()
    render(
      <MatchingCard
        profile={mockProfile}
        onLike={vi.fn()}
        onSkip={onSkip}
      />
    )

    const skipButton = screen.getByText('スキップ')
    skipButton.click()

    expect(onSkip).toHaveBeenCalledTimes(1)
  })
})
