import prisma from '../../../lib/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { MdxContent } from '../../../lib/mdx'
import Link from 'next/link'
import ExportButton from './ExportButton'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ version?: string }>
}

async function getPage(slug: string, versionId?: string) {
  if (versionId) {
    const version = await prisma.wikiVersion.findUnique({
      where: { id: versionId },
      include: { page: true }
    })
    return version ? { ...version.page, content: version.content } : null
  }
  
  return prisma.wikiPage.findUnique({ where: { slug } })
}

export default async function WikiPage({ params, searchParams }: Props) {
  const { slug } = await params
  const params_ = await searchParams
  const page = await getPage(slug, params_.version)
  if (!page) notFound()
  
  const isVersionView = !!params_.version

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link href="/wiki" className="hover:text-blue-600 transition-colors">All Pages</Link>
            <span>/</span>
            <span className="text-gray-900">{page.title}</span>
            {isVersionView && (
              <>
                <span>/</span>
                <span className="text-orange-600">Version View</span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{page.title}</h1>
          <p className="text-gray-600">
            Last updated {format(page.updatedAt, 'PPpp')}
            {isVersionView && ' (Viewing historical version)'}
          </p>
        </div>
        
        {!isVersionView && (
          <div className="flex gap-3">
            <ExportButton slug={page.slug} title={page.title} />
            <Link
              href={`/wiki/history/${page.slug}`}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
            </Link>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-8">
          <MdxContent code={page.content} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {!isVersionView ? (
          <>
            <Link
              href={`/wiki/edit/${page.slug}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Page
            </Link>
            <Link
              href="/wiki"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Wiki
            </Link>
          </>
        ) : (
          <>
            <Link
              href={`/wiki/${page.slug}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Current Version
            </Link>
            <Link
              href={`/wiki/history/${page.slug}`}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Back to History
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
