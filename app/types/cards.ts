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
  id: number
  type: CardLinkType
  label?: string
  value: string
  position?: number
  isActive?: boolean
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
  id: number
  displayName: string
  title?: string
  company?: string
  prefix?: string
  suffix?: string
  accreditation?: string
  department?: string
  headline?: string
  slug: string
  links: CardLink[]
  appearance?: CardAppearance
  isPublic?: boolean
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CardPayload {
  displayName: string
  slug: string
  title?: string
  prefix?: string
  suffix?: string
  accreditation?: string
  department?: string
  company?: string
  headline?: string
  isPublic?: boolean
  isActive?: boolean
}

export interface CardFilters {
  search?: string
}
