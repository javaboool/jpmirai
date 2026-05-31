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

const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

let cache: AppSettings | null = null
let cacheTime = 0

export async function getSettings(): Promise<AppSettings> {
  const now = Date.now()
  if (cache && now - cacheTime < CACHE_TTL_MS) return cache
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'settings', limit: 1 })
  cache = (docs[0] as AppSettings) || {}
  cacheTime = now
  return cache
}

export function clearSettingsCache() {
  cache = null
  cacheTime = 0
}
