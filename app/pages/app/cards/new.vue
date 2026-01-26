<script setup lang="ts">
import type { AddLinkOption } from '~/components/Cards/addLinkData'

definePageMeta({
  layout: 'app'
})

type SelectedLinkOption = AddLinkOption & { id: string }

const selectedLinks = ref<SelectedLinkOption[]>([])

function handleSelectedLinksUpdate(links: SelectedLinkOption[]) {
  selectedLinks.value = links
}

function handleRemoveLink(id: string) {
  selectedLinks.value = selectedLinks.value.filter(link => link.id !== id)
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

        <!--        Presentation ID card section -->
        <UPageCard
          title="Tailwind CSS"
          class="rounded-none"
        />
        <CardsCustomizeCard
          :selected-links="selectedLinks"
          @remove-link="handleRemoveLink"
        />
      </UPageGrid>
    </template>
  </UDashboardPanel>
</template>

<style scoped>

</style>
