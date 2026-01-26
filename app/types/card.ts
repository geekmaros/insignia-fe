import type { AddLinkOption } from '~/components/Cards/addLinkData'

export type CardTemplate = 'classic' | 'minimal' | 'bold'

export type SelectedLinkOption = AddLinkOption & { id: string }

export interface CardPreviewBasic {
  name?: string
  title?: string
  company?: string
}

export interface CardPreviewCustomization {
  accentColor?: string
}

export interface CardPreviewData {
  basic?: CardPreviewBasic
  customization?: CardPreviewCustomization
  links?: SelectedLinkOption[]
}
