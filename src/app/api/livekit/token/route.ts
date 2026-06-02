import { NextRequest, NextResponse } from 'next/server'
import { AccessToken } from 'livekit-server-sdk'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  let userId: string | null = null
  try { userId = (await auth()).userId } catch {}
  const { roomName, participantName } = await req.json()

  if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    return NextResponse.json({ error: 'LiveKit not configured' }, { status: 500 })
  }

  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: userId || participantName,
    name: participantName,
  })
  at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true })

  const token = await at.toJwt()
  return NextResponse.json({ token })
}
