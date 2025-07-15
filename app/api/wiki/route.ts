import prisma from '../../../lib/prisma'
import { NextResponse } from 'next/server'

// Slug validation function
function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

// Basic content sanitization
function sanitizeContent(content: string): string {
  // Remove potentially dangerous HTML tags
  return content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

export async function GET() {
  const pages = await prisma.wikiPage.findMany({ orderBy: { updatedAt: 'desc' } })
  return NextResponse.json(pages)
}

export async function POST(request: Request) {
  const data = await request.json()
  const { id, title, slug, content } = data
  
  if (!title || !slug) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Validate slug format
  if (!isValidSlug(slug)) {
    return NextResponse.json({ 
      error: 'Invalid slug format. Use only lowercase letters, numbers, and hyphens' 
    }, { status: 400 })
  }

  // Sanitize content
  const sanitizedContent = sanitizeContent(content)

  const existing = await prisma.wikiPage.findUnique({ where: { slug } })
  if (existing && !id) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
  }

  try {
    // If updating an existing page, save the current version first
    if (id && existing) {
      await prisma.wikiVersion.create({
        data: {
          pageId: id,
          content: existing.content
        }
      })
    }

    // Upsert the page
    const page = await prisma.wikiPage.upsert({
      where: { id: id ?? '' },
      update: { title, slug, content: sanitizedContent },
      create: { title, slug, content: sanitizedContent }
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error saving page:', error)
    return NextResponse.json({ error: 'Failed to save page' }, { status: 500 })
  }
}
