import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { News } from './src/collections/News'
import { Messages } from './src/collections/Messages'
import { Notices } from './src/collections/Notices'
import { Media } from './src/collections/Media'
import { Users } from './src/collections/Users'
import { Settings } from './src/collections/Settings'
import { UserProfiles } from './src/collections/UserProfiles'
import { ConsultationLogs } from './src/collections/ConsultationLogs'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: { user: Users.slug },
  collections: [News, Messages, Notices, Media, Users, Settings, UserProfiles, ConsultationLogs],
  editor: lexicalEditor({}),
  localization: {
    locales: [
      { label: '日本語', code: 'ja' },
      { label: 'English', code: 'en' },
      { label: '中文', code: 'zh' },
    ],
    defaultLocale: 'ja',
    fallback: true,
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      ssl: process.env.DATABASE_URI?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 60000,
      max: 3,
    },
    push: true,
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  upload: {
    limits: { fileSize: 5000000 },
  },
})
