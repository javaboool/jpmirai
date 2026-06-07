import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { auth } from '@clerk/nextjs/server'

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const email = req.nextUrl.searchParams.get('email')
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'user-profiles',
    where: { clerk_user_id: { exists: true } },
    limit: 100,
  })

  // Match by name or clerk_user_id (simple search)
  const match = docs.find((u: any) =>
    u.name?.toLowerCase().includes(email.toLowerCase()) ||
    u.clerk_user_id === email
  )

  if (!match) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  return NextResponse.json({ clerk_user_id: (match as any).clerk_user_id, name: (match as any).name })
}
