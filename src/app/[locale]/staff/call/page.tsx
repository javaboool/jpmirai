'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { VideoCallRoom } from '@/components/video/VideoCallRoom'
import { useRouter } from '@/i18n/navigation'

function StaffCallContent() {
  const params = useSearchParams()
  const token = params.get('token') || ''
  const roomName = params.get('room') || ''
  const router = useRouter()

  if (!token) return <p className="p-8 text-red-500">トークンがありません</p>

  return (
    <VideoCallRoom
      token={token}
      roomName={roomName}
      isStaff={true}
      onDisconnect={() => router.push('/staff')}
    />
  )
}

export default function StaffCallPage() {
  return (
    <Suspense fallback={<div className="p-8">接続中...</div>}>
      <StaffCallContent />
    </Suspense>
  )
}
