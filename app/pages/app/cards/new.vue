<script setup lang="ts">
import { computed } from 'vue'
import type { CardPreviewData, CardTemplate, SelectedLinkOption } from '~/types/card'

definePageMeta({
  layout: 'app'
})

const selectedLinks = ref<SelectedLinkOption[]>([])
const cardTemplate = ref<CardTemplate>('classic')
const DEFAULT_ACCENT = '#0F172A'
const previewState = ref<CardPreviewData>({
  basic: {},
  customization: {
    accentColor: DEFAULT_ACCENT
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
            header: 'border-b border-[#E7E7E7] px-6 py-4',
            body: 'p-6 flex justify-center'
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
