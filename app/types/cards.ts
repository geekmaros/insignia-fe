export type CardLinkType
  = | 'website'
    | 'instagram'
    | 'linkedin'
    | 'facebook'
    | 'x'
    | 'tiktok'
    | 'snapchat'
    | 'youtube'
    | 'whatsapp'
    | 'phone'
    | 'address'
    | 'link'

export interface CardLink {
  id: string
  type: CardLinkType
  label: string
  url: string
  order?: number
}

export interface CardAppearanceConfig {
  accentColor?: string
  backgroundColor?: string
  font?: string
  templateId?: string
  [key: string]: unknown
}

export interface CardAppearance {
  theme: string
  logoUrl?: string
  config?: CardAppearanceConfig
}

export interface Card {
  id: string
  name: string
  title: string
  company?: string
  email?: string
  phone?: string
  location?: string
  slug: string
  links: CardLink[]
  appearance?: CardAppearance
  createdAt?: string
  updatedAt?: string
}

export interface CardPayload {
  name: string
  title: string
  company?: string
  email?: string
  phone?: string
  location?: string
  description?: string
}

export interface CardFilters {
  search?: string
}
