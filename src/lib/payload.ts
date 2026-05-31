import { getPayload } from 'payload'
import config from '../../payload.config'

let payloadCache: Awaited<ReturnType<typeof getPayload>> | null = null

export async function getPayloadClient() {
  if (!payloadCache) {
    payloadCache = await getPayload({ config })
  }
  return payloadCache
}
