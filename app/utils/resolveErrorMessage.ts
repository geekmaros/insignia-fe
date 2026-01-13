export interface NormalizedError {
  data?: {
    message?: string
  }
  statusMessage?: string
  message?: string
}

export function resolveErrorMessage(error: unknown, fallback = 'Unable to process your request. Please try again.') {
  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object') {
    const { data, statusMessage, message } = error as NormalizedError
    return data?.message || statusMessage || message || fallback
  }

  return fallback
}
