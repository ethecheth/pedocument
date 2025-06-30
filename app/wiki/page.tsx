import Link from 'next/link'
import { format } from 'date-fns'
import prisma from '../../lib/prisma'

async function getPages() {
  return prisma.wikiPage.findMany({ orderBy: { updatedAt: 'desc' } })
}

export default async function WikiList() {
  const pages = await getPages()
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Wiki Pages</h1>
      <Link href="/wiki/new" className="text-blue-600 underline">New Page</Link>
      <ul className="space-y-2 mt-4">
        {pages.map(p => (
          <li key={p.id} className="border p-2 rounded">
            <Link href={`/wiki/${p.slug}`} className="font-semibold text-blue-600">
              {p.title}
            </Link>
            <p className="text-sm text-gray-600">{format(p.updatedAt, 'PPpp')}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
