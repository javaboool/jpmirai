import { RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import { importMap } from './importMap'
import { serverFunction } from './serverFunction'
import '@payloadcms/next/css'

type Args = {
  children: React.ReactNode
}

export default async function Layout({ children }: Args) {
  return RootLayout({
    config: Promise.resolve(config),
    importMap,
    serverFunction: serverFunction as any,
    children,
  })
}

export { metadata } from '@payloadcms/next/layouts'
