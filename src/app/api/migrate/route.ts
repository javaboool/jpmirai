import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const maxDuration = 60

export async function GET() {
  try {
    const payload = await getPayload({ config })
    await payload.db.migrate()
    return NextResponse.json({ ok: true, message: 'Migration complete' })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
