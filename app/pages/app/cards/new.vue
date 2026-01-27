<script setup lang="ts">
import { computed } from 'vue'
import type { z } from 'zod'
import { cardSchema } from '~/schema/card.schema'
import { createCard } from '@/services/cards.service'
import { addLink } from '@/services/cardLinks.service'
import { updateCardAppearance } from '@/services/cardAppearance.service'
import { resolveErrorMessage } from '~/utils/resolveErrorMessage'
import type { CardPreviewData, CardTemplate, SelectedLinkOption } from '~/types/card'

definePageMeta({
  layout: 'app'
})

type CardFormState = z.infer<typeof cardSchema>

const selectedLinks = ref<SelectedLinkOption[]>([])
const cardTemplate = ref<CardTemplate>('classic')
const DEFAULT_ACCENT = '#0F172A'
const previewState = ref<CardPreviewData>({
  basic: {},
  customization: {
    accentColor: DEFAULT_ACCENT
  }
})

const customizeCardRef = ref<{ getStateSnapshot: () => CardFormState } | null>(null)
const isPublishing = ref(false)
const toast = useToast()
const router = useRouter()

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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function handlePublish() {
  if (isPublishing.value) return
  const instance = customizeCardRef.value

  if (!instance) {
    toast.add({
      title: 'Unable to publish',
      description: 'Please try again after the form loads.',
      color: 'error'
    })
    return
  }

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
  const finalSlug = slugify(basic.name) || `card-${Date.now()}`

  const cardPayload = {
    displayName: basic.name.trim(),
    title: basic.title?.trim() || undefined,
    slug: finalSlug,
    prefix: basic.prefix?.trim() || undefined,
    suffix: basic.suffix?.trim() || undefined,
    accreditation: basic.accreditation?.trim() || undefined,
    department: basic.department?.trim() || undefined,
    company: basic.company?.trim() || undefined,
    headline: basic.headline?.trim() || undefined,
    isPublic: true,
    isActive: true
  }

  const linkPayloads = links
    .map((link, index) => ({
      id: typeof link.id === 'number' ? link.id : undefined,
      type: link.type,
      label: link.label?.trim() || undefined,
      value: link.value?.trim() || '',
      position: index
    }))
    .filter(link => link.value.length > 0)

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
    isPublishing.value = true
    const card = await createCard(cardPayload)
    const cardId = String(card.id)

    if (linkPayloads.length) {
      await Promise.all(
        linkPayloads.map(link =>
          addLink(cardId, {
            type: link.type,
            label: link.label,
            value: link.value,
            position: link.position
          })
        )
      )
    }

    await updateCardAppearance(cardId, appearancePayload)

    toast.add({
      title: 'Card published',
      description: 'Redirecting you to your cards.',
      color: 'success'
    })

    await router.push('/app/cards')
  } catch (error) {
    const message = resolveErrorMessage(error, 'Unable to publish card. Please try again.')

    toast.add({
      title: 'Card creation failed',
      description: message,
      color: 'error'
    })
  } finally {
    isPublishing.value = false
  }
}

const items = ref([
  {
    label: 'Card Management',
    to: '/app/cards'
  },
  {
    label: 'Create New Card',
    to: '/app/cards/new'
  }
])
</script>

<template>
  <UDashboardPanel
    id="card-new"
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
            label="Publish Card"
            :loading="isPublishing"
            :disabled="isPublishing"
            @click="handlePublish"
          />

          <UButton
            color="neutral"
            variant="outline"
            class="text-gray-950"
            size="lg"
            icon="i-lucide-eye"
            label="Preview Card"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template
      #body
    >
      <UPageGrid class="gap-0 h-full">
        <CardsAddLinks
          :selected-links="selectedLinks"
          @update:selected-links="handleSelectedLinksUpdate"
        />

        <UPageCard
          class="rounded-none flex flex-col"
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
        />
      </UPageGrid>
    </template>
  </UDashboardPanel>
</template>

<style scoped>

</style>
