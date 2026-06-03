import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const maxDuration = 60

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const db = payload.db as any

    // Import pushDevSchema directly
    const { pushDevSchema } = await import('@payloadcms/drizzle')
    await pushDevSchema(db)

    return NextResponse.json({ ok: true, message: 'Schema pushed successfully' })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
