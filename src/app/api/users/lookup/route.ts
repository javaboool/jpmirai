import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { auth } from '@clerk/nextjs/server'

export async function GET(req: NextRequest) {
  let userId: string | null = null
  try { userId = (await auth()).userId } catch {}
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const q = req.nextUrl.searchParams.get('q') || ''
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'user-profiles',
    limit: 20,
  })

  const results = (docs as any[])
    .filter(u =>
      !q ||
      u.name?.toLowerCase().includes(q.toLowerCase()) ||
      u.clerk_user_id?.toLowerCase().includes(q.toLowerCase())
    )
    .map(u => ({ clerk_user_id: u.clerk_user_id, name: u.name || u.clerk_user_id }))

  return NextResponse.json({ users: results })
}
