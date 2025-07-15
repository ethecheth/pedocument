'use client'
import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
// import { MdxContent } from '../lib/mdx'
import { useDropzone } from 'react-dropzone'
import 'easymde/dist/easymde.min.css'

type Page = {
  id: string
  title: string
  slug: string
  content: string
}

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })

export default function Editor({ page, restoredContent }: { page?: Page; restoredContent?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [title, setTitle] = useState(page?.title || '')
  const [slug, setSlug] = useState(page?.slug || '')
  const [content, setContent] = useState(page?.content || restoredContent || '')
  const [preview, setPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Handle version restoration
  const restoreVersion = searchParams.get('restore')
  
  // Set restored content when component mounts
  useEffect(() => {
    if (restoredContent && !page) {
      setContent(restoredContent)
    }
  }, [restoredContent, page])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      if (file.type.startsWith('image/')) {
        const formData = new FormData()
        formData.append('file', file)
        
        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          })
          
          if (response.ok) {
            const { url } = await response.json()
            const imageMarkdown = `![${file.name}](${url})`
            setContent(prev => prev + '\n' + imageMarkdown)
          }
        } catch (error) {
          console.error('Upload error:', error)
          alert('Failed to upload image')
        }
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    }
  })

  const save = async () => {
    if (!title.trim() || !slug.trim()) {
      alert('Please fill in title and slug')
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch('/api/wiki', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: page?.id, title, slug, content })
      })
      
      if (res.ok) {
        router.push(`/wiki/${slug}`)
      } else {
        const error = await res.json()
        alert(error.error || 'Error saving')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Error saving')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{page ? 'Edit' : 'New'} Page</h1>
          <p className="text-gray-600 mt-1">
            {page ? 'Update your documentation' : 'Create new documentation'}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setPreview(!preview)} 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button 
            onClick={save} 
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save
              </>
            )}
          </button>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Page Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Enter page title..." 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                <input 
                  value={slug} 
                  onChange={e => setSlug(e.target.value)} 
                  placeholder="page-slug" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">URL-friendly identifier</p>
              </div>
            </div>
          </div>

          {/* Content Editor */}
          {!preview && (
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Content (Markdown/MDX)</h2>
                <p className="text-sm text-gray-600 mt-1">Write your content with full MDX support</p>
              </div>
              
              <div className="p-6">
                {/* Image Upload Area */}
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-lg p-6 mb-6 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <svg className="mx-auto h-8 w-8 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600">
                    {isDragActive ? 'Drop images here' : 'Drag & drop images here, or click to select'}
                  </p>
                </div>

                <SimpleMDE 
                  value={content} 
                  onChange={setContent} 
                  options={{ 
                    spellChecker: false,
                    placeholder: 'Write your content in Markdown/MDX...',
                    toolbar: [
                      'bold', 'italic', 'heading', '|',
                      'quote', 'unordered-list', 'ordered-list', '|',
                      'link', 'image', '|',
                      'preview', 'side-by-side', 'fullscreen', '|',
                      'guide'
                    ]
                  }} 
                />
              </div>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        {preview && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Preview</h2>
              <p className="text-sm text-gray-600 mt-1">Live preview of your content</p>
            </div>
            <div className="p-6">
              <div className="prose max-w-none">
                {/* <MdxContent code={content} /> */}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Version Restoration Notice */}
      {(restoreVersion || restoredContent) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Version Restoration</h3>
              <p className="text-sm text-yellow-700 mt-1">
                You are restoring content from a previous version. Make sure to review the content before saving.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
