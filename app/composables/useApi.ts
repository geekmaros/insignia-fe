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
    const normalizedError = error as NormalizedFetchError
    const statusCode
      = normalizedError.statusCode
        || normalizedError.response?.status
        || 500
    const statusMessage
      = normalizedError.data?.message
        || normalizedError.response?._data?.message
        || normalizedError.message
        || 'Unexpected error'

    throw createError({
      statusCode,
      statusMessage
    })
  }
}
