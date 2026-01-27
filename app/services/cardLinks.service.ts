import { useApi } from '@/composables/useApi'
import type { CardLink } from '@/types/cards'

export interface LinkPayload {
  id?: number
  type: CardLink['type']
  label?: string
  value: string
  position?: number
}

export function addLink(cardId: string, payload: LinkPayload) {
  return useApi<CardLink>(`/cards/${cardId}/links`, {
    method: 'POST',
    body: payload
  })
}

export function replaceLinks(cardId: string, links: LinkPayload[]) {
  return useApi<CardLink[]>(`/cards/${cardId}/links`, {
    method: 'PUT',
    body: { links }
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

export function reorderLinks(cardId: string, orderedLinkIds: number[]) {
  return useApi<CardLink[]>(`/cards/${cardId}/links/reorder`, {
    method: 'PATCH',
    body: { orderedLinkIds }
  })
}
