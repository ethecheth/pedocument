import './globals.css'
import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { FiPlus, FiBookOpen, FiHome, FiClock, FiSearch, FiMenu } from 'react-icons/fi'

export const metadata: Metadata = {
  title: 'PE Document Wiki',
  description: 'A modern wiki system for documentation',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
              <Link href="/" className="flex items-center space-x-3">
                <div className="text-2xl">📚</div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">PE Document</h1>
                  <p className="text-sm text-gray-500">Wiki System</p>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                <Link 
                  href="/" 
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <FiHome className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                
                <Link 
                  href="/wiki" 
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <FiBookOpen className="w-5 h-5" />
                  <span>All Pages</span>
                </Link>
                
                <Link 
                  href="/wiki/new" 
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <FiPlus className="w-5 h-5" />
                  <span>New Page</span>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Pages</span>
                    <span className="font-medium">-</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Recent Updates</span>
                    <span className="font-medium">-</span>
                  </div>
                </div>
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Built with Next.js & Prisma
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FiBookOpen className="w-5 h-5" />
                    Documentation
                  </h2>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <FiSearch className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <FiMenu className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
