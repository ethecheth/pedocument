import prisma from '../../../../lib/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

async function getPageWithVersions(slug: string) {
  return prisma.wikiPage.findUnique({
    where: { slug },
    include: {
      versions: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })
}

export default async function HistoryPage({ params }: Props) {
  const { slug } = await params
  const page = await getPageWithVersions(slug)
  if (!page) notFound()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/wiki" className="hover:text-blue-600 transition-colors">All Pages</Link>
          <span>/</span>
          <Link href={`/wiki/${page.slug}`} className="hover:text-blue-600 transition-colors">{page.title}</Link>
          <span>/</span>
          <span className="text-gray-900">History</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Version History</h1>
        <p className="text-gray-600 mt-1">Track changes and restore previous versions</p>
      </div>

      {/* Current Version */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Current Version</h2>
          <p className="text-sm text-gray-600">
            Last updated: {format(page.updatedAt, 'PPpp')}
          </p>
        </div>
        <div className="p-6">
          <Link 
            href={`/wiki/${page.slug}`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Current Version
          </Link>
        </div>
      </div>

      {/* Version History */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Previous Versions</h2>
          <p className="text-sm text-gray-600 mt-1">
            {page.versions.length} version{page.versions.length !== 1 ? 's' : ''} available
          </p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {page.versions.map((version: any, index: number) => (
            <div key={version.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Version {page.versions.length - index}</h3>
                  <p className="text-sm text-gray-600">
                    {format(version.createdAt, 'PPpp')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {index === 0 && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                      Latest
                    </span>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-3">
                  {version.content.length > 200 
                    ? `${version.content.substring(0, 200)}...` 
                    : version.content
                  }
                </div>
              </div>
              
              <div className="flex gap-3">
                <Link
                  href={`/wiki/${page.slug}?version=${version.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View This Version
                </Link>
                {index > 0 && (
                  <Link
                    href={`/wiki/edit/${page.slug}?restore=${version.id}`}
                    className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Restore This Version
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back to Page */}
      <div className="flex gap-3">
        <Link
          href={`/wiki/${page.slug}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Page
        </Link>
        <Link
          href="/wiki"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          All Pages
        </Link>
      </div>
    </div>
  )
} 