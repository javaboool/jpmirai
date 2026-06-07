'use client'
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from '@livekit/components-react'
import '@livekit/components-styles'
import { InviteUserPanel } from './InviteUserPanel'

type Props = {
  token: string
  roomName?: string
  isStaff?: boolean
  onDisconnect: () => void
}

export function VideoCallRoom({ token, roomName, isStaff, onDisconnect }: Props) {
  return (
    <div className="relative h-screen">
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!}
        connect={true}
        onDisconnected={onDisconnect}
        className="h-screen"
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
      {isStaff && roomName && (
        <InviteUserPanel roomName={roomName} />
      )}
    </div>
  )
}
