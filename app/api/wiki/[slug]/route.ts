import prisma from '../../../../lib/prisma'
import { NextResponse } from 'next/server'

interface Params {
  params: { slug: string }
}

export async function GET(req: Request, { params }: Params) {
  const page = await prisma.wikiPage.findUnique({ where: { slug: params.slug } })
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(page)
}
