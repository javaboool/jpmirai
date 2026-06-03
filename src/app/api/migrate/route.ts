import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export const maxDuration = 60

export async function GET() {
  try {
    const payload = await getPayloadClient()
    await payload.db.drizzle.execute('SELECT 1')
    return NextResponse.json({ ok: true, message: 'DB connected and schema pushed' })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
