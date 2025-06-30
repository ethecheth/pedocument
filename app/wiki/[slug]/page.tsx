import prisma from '../../../lib/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { MdxContent } from '../../../lib/mdx'

interface Props {
  params: { slug: string }
}

async function getPage(slug: string) {
  return prisma.wikiPage.findUnique({ where: { slug } })
}

export default async function WikiPage({ params }: Props) {
  const page = await getPage(params.slug)
  if (!page) notFound()
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{page.title}</h1>
      <p className="text-sm text-gray-600">Updated {format(page.updatedAt, 'PPpp')}</p>
      {/* @ts-expect-error Server Component */}
      <MdxContent code={page.content} />
      <p>
        <a href={`/wiki/edit/${page.slug}`} className="text-blue-600 underline">Edit</a>
      </p>
    </div>
  )
}
