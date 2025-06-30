import Editor from '../../../../components/Editor'
import prisma from '../../../../lib/prisma'

interface Props { params: { slug: string } }

async function getPage(slug: string) {
  return prisma.wikiPage.findUnique({ where: { slug } })
}

export default async function EditPage({ params }: Props) {
  const page = await getPage(params.slug)
  if (!page) return <div>Not found</div>
  return <Editor page={page} />
}
