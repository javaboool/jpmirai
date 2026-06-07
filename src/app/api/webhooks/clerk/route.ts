import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { getPayloadClient } from '@/lib/payload'

type ClerkUserEvent = {
  type: 'user.created' | 'user.updated' | 'user.deleted'
  data: {
    id: string
    first_name?: string
    last_name?: string
    email_addresses?: { email_address: string }[]
    public_metadata?: { role?: string }
  }
}

export async function POST(req: NextRequest) {
  let secret = process.env.CLERK_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'CLERK_WEBHOOK_SECRET not set' }, { status: 500 })
  }
  // Ensure whsec_ prefix
  if (!secret.startsWith('whsec_')) {
    secret = `whsec_${secret}`
  }

  const svixId = req.headers.get('svix-id')
  const svixTimestamp = req.headers.get('svix-timestamp')
  const svixSignature = req.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const body = await req.text()
  const wh = new Webhook(secret)

  let event: ClerkUserEvent
  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkUserEvent
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const payload = await getPayloadClient()
  const { type, data } = event

  if (type === 'user.created') {
    const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || 'User'
    const role = (data.public_metadata?.role as 'user' | 'staff' | 'admin') || 'user'

    await payload.create({
      collection: 'user-profiles',
      data: {
        clerk_user_id: data.id,
        name,
        role,
      },
    })
  }

  if (type === 'user.updated') {
    const { docs } = await payload.find({
      collection: 'user-profiles',
      where: { clerk_user_id: { equals: data.id } },
      limit: 1,
    })

    const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || 'User'
    const role = (data.public_metadata?.role as 'user' | 'staff' | 'admin') || 'user'

    if (docs[0]) {
      await payload.update({
        collection: 'user-profiles',
        id: docs[0].id,
        data: { name, role },
      })
    } else {
      // Upsert: create if not exists
      await payload.create({
        collection: 'user-profiles',
        data: { clerk_user_id: data.id, name, role },
      })
    }
  }

  if (type === 'user.deleted') {
    const { docs } = await payload.find({
      collection: 'user-profiles',
      where: { clerk_user_id: { equals: data.id } },
      limit: 1,
    })
    if (docs[0]) {
      await payload.delete({
        collection: 'user-profiles',
        id: docs[0].id,
      })
    }
  }

  return NextResponse.json({ received: true })
}
