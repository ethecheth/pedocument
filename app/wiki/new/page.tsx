import Editor from '../../../components/Editor'
import prisma from '../../../lib/prisma'
import { notFound } from 'next/navigation'

interface Props {
  searchParams: Promise<{ restore?: string }>
}

export default async function NewPage({ searchParams }: Props) {
  const params = await searchParams
  
  // If restoring from a version, get the version content
  let restoredContent = ''
  if (params.restore) {
    const version = await prisma.wikiVersion.findUnique({
      where: { id: params.restore },
      include: { page: true }
    })
    
    if (version) {
      restoredContent = version.content
    } else {
      notFound()
    }
  }

  return <Editor restoredContent={restoredContent} />
}
