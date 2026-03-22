import Link from 'next/link'

interface MenuLinkProps {
  href: string
  icon: string
  title: string
  description: string
}

export default function MenuLink({ href, icon, title, description }: MenuLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <span className="text-gray-400">→</span>
    </Link>
  )
}
