import { computed, unref } from 'vue'
import { sseEventSchema } from '@opencloud-eu/web-client/sse'
import { useAuthStore, useCapabilityStore } from '../piniaStores'

export function parseSseEventData(data: unknown) {
  if (typeof data !== 'string') {
    return null
  }
  try {
    const parsed = sseEventSchema.safeParse(JSON.parse(data))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

/** Only a signed-in user has an SSE stream. */
export function useIsSseEnabled() {
  const capabilityStore = useCapabilityStore()
  const authStore = useAuthStore()

  return computed(
    () =>
      Boolean(unref(capabilityStore.supportSSE)) &&
      Boolean(authStore.accessToken) &&
      !authStore.publicLinkContextReady
  )
}
