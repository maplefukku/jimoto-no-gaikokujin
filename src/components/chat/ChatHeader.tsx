'use client'

import Link from 'next/link'

interface ChatHeaderProps {
  partner: {
    id: string
    name: string
    region: string
    is_foreigner: boolean
  }
}

export default function ChatHeader({ partner }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
      <Link href="/chat" className="text-gray-400 hover:text-gray-600">
        ←
      </Link>
      <div className="flex items-center gap-2">
        <span className="text-xl">{partner.is_foreigner ? '🌍' : '🗾'}</span>
        <div>
          <p className="text-sm font-semibold text-gray-900">{partner.name}</p>
          {partner.region && (
            <p className="text-xs text-gray-500">{partner.region}</p>
          )}
        </div>
      </div>
    </div>
  )
}
