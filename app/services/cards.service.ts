import { useApi } from '@/composables/useApi'
import type { Card, CardPayload } from '@/types/cards'

export function listMyCards(params?: Record<string, any>) {
  return useApi<Card[]>('/cards', {
    method: 'GET',
    query: params
  })
}

export function getMyCard(id: string) {
  return useApi<Card>(`/cards/${id}`)
}

export function createCard(payload: CardPayload) {
  return useApi<Card>('/cards', {
    method: 'POST',
    body: payload
  })
}

export function updateCard(id: string, payload: Partial<CardPayload>) {
  return useApi<Card>(`/cards/${id}`, {
    method: 'PATCH',
    body: payload
  })
}

export function deleteCard(id: string) {
  return useApi<void>(`/cards/${id}`, {
    method: 'DELETE'
  })
}

export function getPublicCard(slug: string) {
  return useApi<Card>(`/cards/public/${slug}`, {
    withAuth: false
  })
}
