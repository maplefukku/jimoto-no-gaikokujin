'use client'

import { useState, FormEvent } from 'react'

interface ChatInputProps {
  onSend: (content: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const content = message.trim()
    if (!content) return
    
    onSend(content)
    setMessage('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-gray-200 bg-white px-4 py-3"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="メッセージを入力..."
        className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-pink-500 focus:outline-none"
        maxLength={1000}
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="rounded-full bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-500 disabled:opacity-50"
      >
        送信
      </button>
    </form>
  )
}
