import { RichText } from '@payloadcms/richtext-lexical/react'

type Props = { content: unknown }

export function RichTextRenderer({ content }: Props) {
  if (!content) return null
  return <RichText data={content as any} />
}
