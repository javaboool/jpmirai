import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const maxDuration = 60

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const db = payload.db as any
    const drizzleInstance = db.drizzle
    const schema = db.schema

    if (!drizzleInstance || !schema) {
      return NextResponse.json({ ok: false, error: 'No drizzle instance found' }, { status: 500 })
    }

    const { pushSchema } = await import('drizzle-kit/api')
    const result = await pushSchema(schema, drizzleInstance)
    await result.apply()

    return NextResponse.json({ ok: true, message: 'Schema pushed successfully' })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
