<script setup lang="ts">
import { computed, watch, watchEffect } from 'vue'
import type { z } from 'zod'
import { cardSchema } from '~/schema/card.schema'
import { getMyCard, updateCard } from '@/services/cards.service'
import { replaceLinks } from '@/services/cardLinks.service'
import { updateCardAppearance } from '@/services/cardAppearance.service'
import { resolveErrorMessage } from '~/utils/resolveErrorMessage'
import type { CardPreviewData, CardTemplate, SelectedLinkOption } from '~/types/card'
import { ADD_LINK_DATA } from '~/components/Cards/addLinkData'

definePageMeta({
  layout: 'app'
})

type CardFormState = z.infer<typeof cardSchema>

const route = useRoute()
const router = useRouter()
const toast = useToast()

const cardId = computed(() => String(route.params.id ?? ''))
const selectedLinks = ref<SelectedLinkOption[]>([])
const cardTemplate = ref<CardTemplate>('classic')
const DEFAULT_ACCENT = '#0F172A'
const previewState = ref<CardPreviewData>({
  basic: {},
  customization: {
    accentColor: DEFAULT_ACCENT
  }
})

const customizeCardRef = ref<{
  getStateSnapshot: () => CardFormState
  setStateSnapshot: (next: Partial<CardFormState>) => void
} | null>(null)
const isSaving = ref(false)
const hasInvalidLinks = ref(false)

const { data: cardData, pending, error, refresh } = await useAsyncData('card-edit', () => getMyCard(cardId.value), {
  watch: [cardId]
})

const resolveLinkMeta = (type: string) => {
  return ADD_LINK_DATA.find(option => option.value === type)
}

const lastHydratedState = ref<{ cardId: string, updatedAt?: string | null } | null>(null)

watch(cardId, () => {
  lastHydratedState.value = null
})

watchEffect(() => {
  const card = cardData.value
  const customizeCard = customizeCardRef.value
  if (!card || !customizeCard) return

  const previous = lastHydratedState.value
  const cardUpdatedAt = card.updatedAt ?? null
  const shouldHydrate
    = !previous
      || previous.cardId !== cardId.value
      || previous.updatedAt !== cardUpdatedAt

  if (!shouldHydrate) return

  lastHydratedState.value = {
    cardId: cardId.value,
    updatedAt: cardUpdatedAt
  }

  const snapshot: Partial<CardFormState> = {
    basic: {
      name: card.displayName ?? '',
      prefix: card.prefix ?? '',
      suffix: card.suffix ?? '',
      accreditation: card.accreditation ?? '',
      title: card.title ?? '',
      department: card.department ?? '',
      company: card.company ?? '',
      headline: card.headline ?? ''
    },
    links: (card.links ?? []).map((link, index) => ({
      id: link.id,
      type: link.type,
      label: link.label ?? '',
      value: link.value,
      position: link.position ?? index
    })),
    customization: {
      template: (card.appearance?.theme as CardTemplate) || 'classic',
      color: card.appearance?.config?.accentColor || '',
      logo: card.appearance?.logoUrl || '',
      profileImage: card.appearance?.config?.profileImage || ''
    }
  }

  customizeCard.setStateSnapshot(snapshot)

  selectedLinks.value = (card.links ?? []).map((link) => {
    const meta = resolveLinkMeta(link.type)
    return {
      id: String(link.id ?? crypto.randomUUID()),
      persistedId: typeof link.id === 'number' ? link.id : undefined,
      label: meta?.label ?? (link.label || link.type),
      icon: meta?.icon ?? 'i-links-link',
      value: link.type,
      placeholder: meta?.placeholder ?? 'https://example.com'
    }
  })

  cardTemplate.value = (card.appearance?.theme as CardTemplate) || 'classic'
  previewState.value = {
    basic: {
      name: card.displayName,
      title: card.title,
      company: card.company
    },
    customization: {
      accentColor: card.appearance?.config?.accentColor || DEFAULT_ACCENT
    }
  }
})

const previewCard = computed<CardPreviewData>(() => ({
  basic: previewState.value.basic,
  customization: {
    accentColor: previewState.value.customization?.accentColor || DEFAULT_ACCENT
  },
  links: selectedLinks.value
}))

function handleSelectedLinksUpdate(links: SelectedLinkOption[]) {
  selectedLinks.value = links
}

function handleRemoveLink(id: string | number) {
  const removeKey = String(id)
  selectedLinks.value = selectedLinks.value.filter(link => link.id !== removeKey)
}

function handleTemplateChange(template: CardTemplate) {
  cardTemplate.value = template
}

function handlePreviewChange(next: CardPreviewData) {
  previewState.value = {
    basic: next.basic,
    customization: {
      accentColor: next.customization?.accentColor || DEFAULT_ACCENT
    }
  }
}

function handleInvalidLinks() {
  hasInvalidLinks.value = true
}

function handleLinksValid() {
  hasInvalidLinks.value = false
}

async function handleSave() {
  if (isSaving.value) return
  const instance = customizeCardRef.value

  if (!instance) {
    toast.add({
      title: 'Unable to save',
      description: 'Please try again after the form loads.',
      color: 'error'
    })
    return
  }

  await nextTick()

  const snapshot = instance.getStateSnapshot()
  const parsed = cardSchema.safeParse(snapshot)

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]
    toast.add({
      title: 'Incomplete card details',
      description: firstIssue?.message ?? 'Fill out the required fields to continue.',
      color: 'error'
    })
    return
  }

  const { basic, links, customization } = parsed.data

  const parsePersistedId = (id?: string | number) => {
    if (typeof id === 'number') {
      return id
    }

    if (typeof id === 'string') {
      const numeric = Number(id)
      if (!Number.isNaN(numeric)) {
        return numeric
      }
    }

    return undefined
  }

  const cardPayload = {
    displayName: basic.name.trim(),
    title: basic.title?.trim() || undefined,
    prefix: basic.prefix?.trim() || undefined,
    suffix: basic.suffix?.trim() || undefined,
    accreditation: basic.accreditation?.trim() || undefined,
    department: basic.department?.trim() || undefined,
    company: basic.company?.trim() || undefined,
    headline: basic.headline?.trim() || undefined
  }

  const formattedLinks = links
    .map((link, index) => ({
      id: parsePersistedId(link.id),
      type: link.type,
      label: link.label?.trim() || undefined,
      value: link.value?.trim() || '',
      position: index
    }))
    .filter(link => link.value.length > 0)

  if (hasInvalidLinks.value || (!formattedLinks.length && links.length > 0)) {
    toast.add({
      title: 'Missing link details',
      description: 'Please enter the URL for each selected link before saving.',
      color: 'error'
    })
    hasInvalidLinks.value = true
    isSaving.value = false
    return
  }

  const appearanceConfig: Record<string, string> = {}
  if (customization.color) {
    appearanceConfig.accentColor = customization.color
  }
  if (customization.profileImage) {
    appearanceConfig.profileImage = customization.profileImage
  }

  const appearancePayload = {
    theme: customization.template,
    logoUrl: customization.logo || undefined,
    config: Object.keys(appearanceConfig).length ? appearanceConfig : undefined
  }

  try {
    isSaving.value = true
    await updateCard(cardId.value, cardPayload)

    await replaceLinks(cardId.value, formattedLinks)

    await updateCardAppearance(cardId.value, appearancePayload)

    toast.add({
      title: 'Card updated',
      description: 'Changes saved successfully.',
      color: 'success'
    })

    await router.push(`/app/cards/${cardId.value}`)
  } catch (err) {
    const message = resolveErrorMessage(err, 'Unable to update card. Please try again.')

    toast.add({
      title: 'Save failed',
      description: message,
      color: 'error'
    })
  } finally {
    isSaving.value = false
  }
}

const items = computed(() => [
  {
    label: 'Card Management',
    to: '/app/cards'
  },
  {
    label: cardData.value?.displayName ?? 'Card Details',
    to: `/app/cards/${cardId.value}`
  },
  {
    label: 'Edit Card',
    to: `/app/cards/${cardId.value}/edit`
  }
])
</script>

<template>
  <UDashboardPanel
    id="card-edit"
    class="bg-white md:p-3"
    :ui="{ body: 'p-0 md:p-0 mt-4 border border-[#E7E7E7] rounded-[16px]' }"
  >
    <template #header>
      <UDashboardNavbar
        class="border border-[#E7E7E7] rounded-[16px]"
        :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <UButton
            to="/app/cards"
            variant="outline"
            square
          >
            <UIcon
              name="i-custom-arrow-left"
              class="text-gray-950"
              size="lg"
            />
          </UButton>

          <UBreadcrumb
            class="ml-1"
            :items="items"
          />
        </template>

        <template #right>
          <UButton
            color="primary"
            variant="solid"
            class="text-gray-950"
            size="lg"
            label="Save Changes"
            :loading="isSaving"
            :disabled="isSaving || pending || !!error"
            @click="handleSave"
          />

          <UButton
            color="neutral"
            variant="outline"
            class="text-gray-950"
            size="lg"
            icon="i-lucide-eye"
            :to="`/app/cards/${cardId}`"
            label="View Card"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div
        v-if="error"
        class="p-6"
      >
        <UAlert
          color="error"
          title="Unable to load card"
          :description="error?.message || 'Please try again later.'"
          icon="i-lucide-alert-triangle"
        />
      </div>

      <div
        v-else-if="pending"
        class="p-6 space-y-4"
      >
        <USkeleton class="h-32 rounded-2xl" />
        <USkeleton class="h-48 rounded-2xl" />
      </div>

      <UPageGrid
        v-else
        class="gap-0 items-start grid-cols-1 xl:grid-cols-[430px_minmax(0,1fr)_430px]"
      >
        <CardsAddLinks
          :selected-links="selectedLinks"
          @update:selected-links="handleSelectedLinksUpdate"
        />

        <UPageCard
          class="rounded-none flex flex-col h-full"
          :ui="{
            container: 'px-0 sm:px-0 h-full',
            header: 'font-medium text-gray-950 text-sm capitalize border-b border-[#e7e7e7] w-full px-6 pb-3',
            body: 'px-3 w-full '
          }"
        >
          <template #header>
            <span class="text-sm font-medium text-gray-900">Live Preview</span>
          </template>

          <template #body>
            <CardsCardPreview
              class="w-full max-w-sm"
              :template="cardTemplate"
              :card="previewCard"
            />
          </template>
        </UPageCard>
        <CardsCustomizeCard
          ref="customizeCardRef"
          :selected-links="selectedLinks"
          @remove-link="handleRemoveLink"
          @template-change="handleTemplateChange"
          @preview-change="handlePreviewChange"
          @invalid-links-detected="handleInvalidLinks"
          @links-valid="handleLinksValid"
        />
      </UPageGrid>
    </template>
  </UDashboardPanel>
</template>

<style scoped>

</style>
