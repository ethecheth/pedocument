import prisma from '../../../lib/prisma'
import { NextResponse } from 'next/server'

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
  const existing = await prisma.wikiPage.findUnique({ where: { slug } })
  if (existing && !id) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
  }
  const page = await prisma.wikiPage.upsert({
    where: { id: id ?? '' },
    update: { title, slug, content },
    create: { title, slug, content }
  })
  return NextResponse.json(page)
}
