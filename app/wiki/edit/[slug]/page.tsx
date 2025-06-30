import Editor from '../../../../components/Editor'
import prisma from '../../../../lib/prisma'

interface Props { params: Promise<{ slug: string }> }

async function getPage(slug: string) {
  return prisma.wikiPage.findUnique({ where: { slug } })
}

export default async function EditPage({ params }: Props) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return <div>Not found</div>
  return <Editor page={page} />
}
