import { getPayloadClient } from './payload'

type AppSettings = {
  livekit_api_key?: string
  livekit_api_secret?: string
  livekit_url?: string
  smtp_host?: string
  smtp_port?: number
  smtp_user?: string
  smtp_pass?: string
  staff_email?: string
  socket_port?: number
  max_call_participants?: number
}

let cache: AppSettings | null = null

export async function getSettings(): Promise<AppSettings> {
  if (cache) return cache
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'settings', limit: 1 })
  cache = (docs[0] as AppSettings) || {}
  return cache
}

export function clearSettingsCache() {
  cache = null
}
