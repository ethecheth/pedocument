import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Wiki</h1>
      <Link href="/wiki" className="text-blue-600 underline">Go to Wiki</Link>
    </div>
  )
}
