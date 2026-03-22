'use client'

export default function NoMoreCandidates() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-5xl mb-4">😊</div>
      <h2 className="text-lg font-semibold text-gray-700">今日の候補はこれで全部です</h2>
      <p className="mt-2 text-sm text-gray-500">また後でチェックしてみてください</p>
    </div>
  )
}
