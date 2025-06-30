'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { MdxContent } from '../lib/mdx'

type Page = {
  id: string
  title: string
  slug: string
  content: string
}

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })

export default function Editor({ page }: { page?: Page }) {
  const router = useRouter()
  const [title, setTitle] = useState(page?.title || '')
  const [slug, setSlug] = useState(page?.slug || '')
  const [content, setContent] = useState(page?.content || '')
  const [preview, setPreview] = useState(false)

  const save = async () => {
    const res = await fetch('/api/wiki', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: page?.id, title, slug, content })
    })
    if (res.ok) router.push(`/wiki/${slug}`)
    else alert('Error saving')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{page ? 'Edit' : 'New'} Page</h1>
        <button onClick={() => setPreview(!preview)} className="underline">
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>
      <div className="space-y-2">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="border p-2 w-full" />
        <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="Slug" className="border p-2 w-full" />
        {preview ? (
          // @ts-expect-error Async Server Component
          <MdxContent code={content} />
        ) : (
          <SimpleMDE value={content} onChange={setContent} options={{ spellChecker: false }} />
        )}
      </div>
      <button onClick={save} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
    </div>
  )
}
