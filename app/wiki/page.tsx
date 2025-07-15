import Link from 'next/link'
import { format } from 'date-fns'
import prisma from '../../lib/prisma'

async function getPages() {
  return prisma.wikiPage.findMany({ 
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: {
        select: { versions: true }
      }
    }
  })
}

export default async function WikiList() {
  const pages = await getPages()
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Pages</h1>
          <p className="text-gray-600 mt-1">Manage your documentation</p>
        </div>
        <Link 
          href="/wiki/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Page
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search pages..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All Pages</option>
            <option>Recently Updated</option>
            <option>Most Versions</option>
          </select>
        </div>
      </div>

      {/* Pages Grid */}
      {pages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-semibold mb-2">No pages yet</h2>
          <p className="text-gray-600 mb-6">Create your first wiki page to get started</p>
          <Link 
            href="/wiki/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create First Page
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page: any) => (
            <div key={page.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Link 
                    href={`/wiki/${page.slug}`} 
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 group-hover:text-blue-600"
                  >
                    {page.title}
                  </Link>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                    v{page._count.versions + 1}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {page.content.substring(0, 120)}...
                </p>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>Updated {format(page.updatedAt, 'MMM d, yyyy')}</span>
                </div>
                
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Link 
                    href={`/wiki/${page.slug}`}
                    className="flex-1 text-center bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    View
                  </Link>
                  <Link 
                    href={`/wiki/edit/${page.slug}`}
                    className="flex-1 text-center bg-gray-50 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <Link 
                    href={`/wiki/history/${page.slug}`}
                    className="flex-1 text-center bg-gray-50 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    History
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Showing {pages.length} pages</span>
          <span>Total versions: {pages.reduce((sum: number, page: any) => sum + page._count.versions, 0)}</span>
        </div>
      </div>
    </div>
  )
}
