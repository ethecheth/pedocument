import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { versionId, pageId } = await request.json()

    if (!versionId || !pageId) {
      return NextResponse.json({ error: 'Version ID and Page ID are required' }, { status: 400 })
    }

    // Get the version content
    const version = await prisma.wikiVersion.findUnique({
      where: { id: versionId },
      include: { page: true }
    })

    if (!version) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    if (version.pageId !== pageId) {
      return NextResponse.json({ error: 'Version does not belong to this page' }, { status: 400 })
    }

    // Save current content as a new version
    const currentPage = await prisma.wikiPage.findUnique({
      where: { id: pageId }
    })

    if (currentPage) {
      await prisma.wikiVersion.create({
        data: {
          pageId,
          content: currentPage.content
        }
      })
    }

    // Update the page with the restored content
    const updatedPage = await prisma.wikiPage.update({
      where: { id: pageId },
      data: { content: version.content }
    })

    return NextResponse.json(updatedPage)
  } catch (error) {
    console.error('Restore error:', error)
    return NextResponse.json({ error: 'Failed to restore version' }, { status: 500 })
  }
} 