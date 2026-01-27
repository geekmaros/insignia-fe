import { useApi } from '@/composables/useApi'
import type { CardLink } from '@/types/cards'

export interface LinkPayload {
  type: CardLink['type']
  label: string
  url: string
  order?: number
}

export function addLink(cardId: string, payload: LinkPayload) {
  return useApi<CardLink>(`/cards/${cardId}/links`, {
    method: 'POST',
    body: payload
  })
}

export function updateLink(cardId: string, linkId: string, payload: Partial<LinkPayload>) {
  return useApi<CardLink>(`/cards/${cardId}/links/${linkId}`, {
    method: 'PATCH',
    body: payload
  })
}

export function removeLink(cardId: string, linkId: string) {
  return useApi<void>(`/cards/${cardId}/links/${linkId}`, {
    method: 'DELETE'
  })
}

export function reorderLinks(cardId: string, orderedIds: string[]) {
  return useApi<CardLink[]>(`/cards/${cardId}/links/reorder`, {
    method: 'POST',
    body: { orderedIds }
  })
}
