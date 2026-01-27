import { createError } from 'nuxt/app'
import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

export interface UseApiOptions<R extends NitroFetchRequest = NitroFetchRequest>
  extends Omit<NitroFetchOptions<R>, 'baseURL'> {
  withAuth?: boolean
}

interface NormalizedFetchError {
  statusCode?: number
  response?: {
    status?: number
    _data?: {
      message?: string
    }
  }
  data?: {
    message?: string
  }
  message?: string
}

export async function useApi<T>(
  path: string,
  { withAuth = true, ...options }: UseApiOptions = {}
) {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie<string | null>('insignia_token')

  const baseURL = config.public.apiBaseUrl
  if (!baseURL) {
    throw new Error('Missing public.apiBaseUrl')
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers as Record<string, string> | undefined)
  }

  if (withAuth && tokenCookie.value) {
    headers.Authorization = `Bearer ${tokenCookie.value}`
  }

  try {
    return await $fetch<T>(path, {
      baseURL,
      ...options,
      headers
    })
  } catch (error: unknown) {
    const e = error as NormalizedFetchError
    const statusCode
      = e.statusCode
        || e.response?.status
        || 500

    const message
      = e.data?.message
        || e.response?._data?.message
        || e.message
        || 'Unexpected error'

    // 🔑 HANDLE 401 HERE — redirect & surface error to caller
    if (statusCode === 401) {
      tokenCookie.value = null

      if (import.meta.client) {
        await navigateTo('/auth/login')
      }

      throw createError({
        statusCode,
        statusMessage: message || 'Unauthorized'
      })
    }

    // All other errors → error.vue
    throw createError({
      statusCode,
      statusMessage: message
    })
  }
}
