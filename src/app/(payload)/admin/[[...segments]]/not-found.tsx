import { NotFoundPage } from '@payloadcms/next/views'
import config from '@payload-config'
import { importMap } from '../../importMap'

type Args = {
  params: Promise<{ segments: string[] }>
}

export default function NotFound({ params }: Args) {
  return NotFoundPage({
    config,
    params,
    searchParams: Promise.resolve({}),
    importMap,
  })
}
