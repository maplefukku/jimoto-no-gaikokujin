import Link from 'next/link'

export default function ProfilePrompt() {
  return (
    <Link href="/profile" className="mb-4 block rounded-xl bg-pink-50 border border-pink-200 p-4">
      <p className="text-sm font-medium text-pink-800">
        まずプロフィールを完成させましょう！
      </p>
      <p className="mt-1 text-xs text-pink-600">
        プロフィールを設定して、マッチングを始めましょう →
      </p>
    </Link>
  )
}
