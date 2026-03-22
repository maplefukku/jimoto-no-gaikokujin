import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ChatWindow from '../components/ChatWindow'
import type { Message } from '../types/database'

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn()

// Mock supabase client
const mockInsert = vi.fn(() => Promise.resolve({ error: null }))
const mockUpdateEq = vi.fn(() => Promise.resolve({ error: null }))
const mockUpdate = vi.fn(() => ({ eq: mockUpdateEq }))
const mockFrom = vi.fn((table: string) => {
  if (table === 'messages') return { insert: mockInsert }
  if (table === 'chat_rooms') return { update: mockUpdate }
  return {}
})
const mockSubscribe = vi.fn(() => ({ id: 'test-channel' }))
const mockOn = vi.fn(() => ({ subscribe: mockSubscribe }))
const mockChannel = vi.fn(() => ({ on: mockOn }))
const mockRemoveChannel = vi.fn()

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
    channel: mockChannel,
    removeChannel: mockRemoveChannel,
  })),
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockPartner = {
  id: 'partner-1',
  name: 'Alice',
  region: '東京都',
  is_foreigner: true,
}

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    room_id: 'room-1',
    sender_id: 'user-1',
    content: 'こんにちは！',
    created_at: '2024-01-01T10:00:00Z',
    is_read: true,
  },
  {
    id: 'msg-2',
    room_id: 'room-1',
    sender_id: 'partner-1',
    content: 'Hello!',
    created_at: '2024-01-01T10:01:00Z',
    is_read: true,
  },
]

describe('ChatWindow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders partner name in header', () => {
    render(
      <ChatWindow
        roomId="room-1"
        currentUserId="user-1"
        partner={mockPartner}
        initialMessages={[]}
      />
    )

    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('renders partner region in header', () => {
    render(
      <ChatWindow
        roomId="room-1"
        currentUserId="user-1"
        partner={mockPartner}
        initialMessages={[]}
      />
    )

    expect(screen.getByText('東京都')).toBeInTheDocument()
  })

  it('shows empty state when no messages', () => {
    render(
      <ChatWindow
        roomId="room-1"
        currentUserId="user-1"
        partner={mockPartner}
        initialMessages={[]}
      />
    )

    expect(screen.getByText(/Aliceさんとのチャットが始まりました/)).toBeInTheDocument()
  })

  it('renders initial messages', () => {
    render(
      <ChatWindow
        roomId="room-1"
        currentUserId="user-1"
        partner={mockPartner}
        initialMessages={mockMessages}
      />
    )

    expect(screen.getByText('こんにちは！')).toBeInTheDocument()
    expect(screen.getByText('Hello!')).toBeInTheDocument()
  })

  it('renders safety notice', () => {
    render(
      <ChatWindow
        roomId="room-1"
        currentUserId="user-1"
        partner={mockPartner}
        initialMessages={[]}
      />
    )

    expect(screen.getByText(/初めて会う際は公共の場所で/)).toBeInTheDocument()
  })

  it('renders message input and send button', () => {
    render(
      <ChatWindow
        roomId="room-1"
        currentUserId="user-1"
        partner={mockPartner}
        initialMessages={[]}
      />
    )

    expect(screen.getByPlaceholderText('メッセージを入力...')).toBeInTheDocument()
    expect(screen.getByText('送信')).toBeInTheDocument()
  })

  it('sends message on form submit', async () => {
    render(
      <ChatWindow
        roomId="room-1"
        currentUserId="user-1"
        partner={mockPartner}
        initialMessages={[]}
      />
    )

    const input = screen.getByPlaceholderText('メッセージを入力...')
    fireEvent.change(input, { target: { value: 'テストメッセージ' } })
    fireEvent.click(screen.getByText('送信'))

    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('messages')
      expect(mockInsert).toHaveBeenCalledWith({
        room_id: 'room-1',
        sender_id: 'user-1',
        content: 'テストメッセージ',
        is_read: false,
      })
    })
  })

  it('updates chat room last_message_at after sending', async () => {
    render(
      <ChatWindow
        roomId="room-1"
        currentUserId="user-1"
        partner={mockPartner}
        initialMessages={[]}
      />
    )

    const input = screen.getByPlaceholderText('メッセージを入力...')
    fireEvent.change(input, { target: { value: 'テスト' } })
    fireEvent.click(screen.getByText('送信'))

    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('chat_rooms')
      expect(mockUpdate).toHaveBeenCalled()
      expect(mockUpdateEq).toHaveBeenCalledWith('id', 'room-1')
    })
  })

  it('does not send empty messages', () => {
    render(
      <ChatWindow
        roomId="room-1"
        currentUserId="user-1"
        partner={mockPartner}
        initialMessages={[]}
      />
    )

    const sendButton = screen.getByText('送信')
    expect(sendButton).toBeDisabled()
  })

  it('subscribes to realtime channel on mount', () => {
    render(
      <ChatWindow
        roomId="room-1"
        currentUserId="user-1"
        partner={mockPartner}
        initialMessages={[]}
      />
    )

    expect(mockChannel).toHaveBeenCalledWith('room-room-1')
    expect(mockOn).toHaveBeenCalled()
    expect(mockSubscribe).toHaveBeenCalled()
  })

  it('shows foreigner icon for foreign partner', () => {
    render(
      <ChatWindow
        roomId="room-1"
        currentUserId="user-1"
        partner={mockPartner}
        initialMessages={[]}
      />
    )

    expect(screen.getByText('🌍')).toBeInTheDocument()
  })

  it('shows Japanese icon for local partner', () => {
    render(
      <ChatWindow
        roomId="room-1"
        currentUserId="user-1"
        partner={{ ...mockPartner, is_foreigner: false }}
        initialMessages={[]}
      />
    )

    expect(screen.getByText('🗾')).toBeInTheDocument()
  })
})
