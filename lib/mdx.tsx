import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import React from 'react'

export async function MdxContent({ code }: { code: string }) {
  try {
    const compiled = await evaluate(code, { 
      ...runtime, 
      Fragment: runtime.Fragment,
      jsx: runtime.jsx,
      jsxs: runtime.jsxs
    })
    const Content = compiled.default
    return <Content />
  } catch (error) {
    console.error('MDX compilation error:', error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error rendering content</p>
        <pre className="text-sm text-red-600 mt-2">{code}</pre>
      </div>
    )
  }
}
