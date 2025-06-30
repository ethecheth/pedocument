import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  try {
    const page = await prisma.wikiPage.findUnique({
      where: { slug }
    })

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // Create MDX content with frontmatter
    const mdxContent = `---
title: "${page.title}"
slug: "${page.slug}"
updatedAt: "${page.updatedAt.toISOString()}"
---

${page.content}`

    // Return the file as a download
    return new NextResponse(mdxContent, {
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': `attachment; filename="${page.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mdx"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Failed to export page' }, { status: 500 })
  }
} 