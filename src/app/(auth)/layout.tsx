export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-pink-600">🌏 地元の外国人</h1>
          <p className="mt-2 text-sm text-gray-500">地元で外国人の友達を作ろう</p>
        </div>
        {children}
      </div>
    </div>
  )
}
