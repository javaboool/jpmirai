'use client'
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from '@livekit/components-react'
import '@livekit/components-styles'

type Props = {
  token: string
  onDisconnect: () => void
}

export function VideoCallRoom({ token, onDisconnect }: Props) {
  return (
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
  )
}
