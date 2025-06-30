import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { MDXProvider } from '@mdx-js/react'
import React from 'react'

export async function MdxContent({ code }: { code: string }) {
  const compiled = await evaluate(code, { ...runtime, Fragment: runtime.Fragment })
  const Content = compiled.default
  return (
    <MDXProvider>
      <Content />
    </MDXProvider>
  )
}
