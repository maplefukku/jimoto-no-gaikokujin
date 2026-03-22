import Link from 'next/link'

export default function ChatEmptyList() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-5xl mb-4">💬</div>
      <h2 className="text-lg font-semibold text-gray-700">チャットはまだありません</h2>
      <p className="mt-2 text-sm text-gray-500">マッチングするとチャットができます</p>
      <Link
        href="/matching"
        className="mt-4 rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-500"
      >
        マッチングへ
      </Link>
    </div>
  )
}
