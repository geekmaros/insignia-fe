<script setup lang="ts">
import { computed } from 'vue'
import type { Card } from '@/types/cards'
import { getMyCard } from '@/services/cards.service'

definePageMeta({
  layout: 'app'
})

const route = useRoute()
const cardId = computed(() => String(route.params.id ?? ''))

const {
  data: card,
  pending,
  error,
  refresh
} = await useAsyncData<Card>('app-card-detail', () => getMyCard(cardId.value), {
  watch: [cardId]
})

const sortedLinks = computed(() => {
  if (!card.value?.links?.length) return []
  return [...card.value.links].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
})

const formatDateTime = (value?: string) => {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value))
  } catch {
    return '—'
  }
}
</script>

<template>
  <UDashboardPanel
    id="card-detail"
    class="bg-white md:p-3"
  >
    <template #header>
      <UDashboardNavbar
        :title="card?.displayName || 'Card Details'"
        class="border border-[#E7E7E7] rounded-[16px]"
        :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <UButton
            to="/app/cards"
            variant="ghost"
            icon="i-lucide-arrow-left"
            label="Back to cards"
          />
        </template>

        <template #right>
          <UButton
            :to="`/app/cards/${cardId}/edit`"
            icon="i-lucide-pencil"
            label="Edit Card"
            :disabled="pending || !!error"
          />
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide-refresh-cw"
            :loading="pending"
            @click="refresh"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6">
        <UAlert
          v-if="error"
          color="error"
          title="Unable to load card"
          :description="error?.message || 'Please try again later.'"
          icon="i-lucide-alert-triangle"
        />

        <div
          v-else-if="pending || !card"
          class="space-y-4"
        >
          <USkeleton class="h-32 rounded-2xl" />
          <USkeleton class="h-48 rounded-2xl" />
        </div>

        <div
          v-else
          class="space-y-6"
        >
          <UCard class="border border-[#E7E7E7] rounded-[16px]">
            <div class="flex flex-wrap items-start justify-between gap-6">
              <div class="space-y-1">
                <p class="text-sm font-medium uppercase text-gray-500">Card Owner</p>
                <h1 class="text-3xl font-semibold text-gray-950">{{ card.displayName }}</h1>
                <p class="text-sm text-gray-600">{{ card.title || 'No title provided' }}</p>
                <p class="text-sm text-gray-600">{{ card.company || 'No company provided' }}</p>
              </div>

              <div class="space-y-2 text-sm text-gray-600">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-gray-500">Slug:</span>
                  <code class="rounded bg-gray-100 px-2 py-1 text-xs">{{ card.slug }}</code>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-medium text-gray-500">Status:</span>
                  <div class="flex gap-2">
                    <UBadge
                      :color="card.isActive ? 'success' : 'neutral'"
                      variant="subtle"
                    >
                      {{ card.isActive ? 'Active' : 'Inactive' }}
                    </UBadge>
                    <UBadge
                      :color="card.isPublic ? 'primary' : 'neutral'"
                      variant="subtle"
                    >
                      {{ card.isPublic ? 'Public' : 'Private' }}
                    </UBadge>
                  </div>
                </div>
                <p>
                  <span class="font-medium text-gray-500">Created:</span> {{ formatDateTime(card.createdAt) }}
                </p>
                <p>
                  <span class="font-medium text-gray-500">Updated:</span> {{ formatDateTime(card.updatedAt) }}
                </p>
              </div>
            </div>
          </UCard>

          <UCard class="border border-[#E7E7E7] rounded-[16px]">
            <template #header>
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-gray-900">Links</span>
                <UBadge
                  color="neutral"
                  variant="subtle"
                >
                  {{ sortedLinks.length }} configured
                </UBadge>
              </div>
            </template>

            <div
              v-if="sortedLinks.length"
              class="space-y-2"
            >
              <div
                v-for="link in sortedLinks"
                :key="link.id"
                class="flex flex-col rounded-lg border border-[#E7E7E7] px-4 py-3 text-sm"
              >
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-gray-900 capitalize">{{ link.type }}</span>
                  <span class="text-xs text-gray-500">Position {{ (link.position ?? 0) + 1 }}</span>
                </div>
                <p class="text-gray-600">
                  {{ link.label || 'No label provided' }}
                </p>
                <p class="font-mono text-xs text-primary truncate">
                  {{ link.value }}
                </p>
              </div>
            </div>

            <p
              v-else
              class="text-sm text-gray-500"
            >
              No links configured yet.
            </p>
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<style scoped>

</style>
