interface StatCardProps {
  value: number
  label: string
  gradient: string
}

export default function StatCard({ value, label, gradient }: StatCardProps) {
  return (
    <div className={`rounded-xl bg-gradient-to-br p-4 text-white ${gradient}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs opacity-80">{label}</p>
    </div>
  )
}
