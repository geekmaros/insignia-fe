import { useApi } from '@/composables/useApi'
import type { CardAppearance } from '@/types/cards'

export type CardAppearancePayload = CardAppearance

export function updateCardAppearance(cardId: string, payload: CardAppearancePayload) {
  return useApi<CardAppearance>(`/cards/${cardId}/appearance`, {
    method: 'PUT',
    body: payload
  })
}
