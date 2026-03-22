'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message } from '@/types/database'
import ChatHeader from './chat/ChatHeader'
import ChatMessage from './chat/ChatMessage'
import ChatInput from './chat/ChatInput'
import ChatEmptyState from './chat/ChatEmptyState'
import SafetyNotice from './chat/SafetyNotice'

interface ChatWindowProps {
  roomId: string
  currentUserId: string
  partner: {
    id: string
    name: string
    region: string
    is_foreigner: boolean
  }
  initialMessages: Message[]
}

export default function ChatWindow({
  roomId,
  currentUserId,
  partner,
  initialMessages,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, supabase])

  async function handleSend(content: string) {
    if (sending) return

    setSending(true)

    const { error } = await supabase.from('messages').insert({
      room_id: roomId,
      sender_id: currentUserId,
      content,
      is_read: false,
    })

    if (!error) {
      await supabase
        .from('chat_rooms')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', roomId)
    }

    setSending(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <ChatHeader partner={partner} />

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {messages.length === 0 ? (
          <ChatEmptyState partnerName={partner.name} />
        ) : (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              content={msg.content}
              createdAt={msg.created_at}
              isMine={msg.sender_id === currentUserId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <SafetyNotice />
      <ChatInput onSend={handleSend} disabled={sending} />
    </div>
  )
}
