<script setup lang="ts">
import { computed } from 'vue'
import type { Card } from '@/types/cards'
import { listMyCards } from '@/services/cards.service'

definePageMeta({
  layout: 'app'
})

const {
  data: cards,
  pending,
  error,
  refresh
} = await useAsyncData<Card[]>('app-cards', () => listMyCards(), {
  default: () => []
})

const cardItems = computed(() => cards.value ?? [])

const formatDate = (value?: string | null) => {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(value))
  } catch {
    return '—'
  }
}
</script>

<template>
  <UDashboardPanel
    id="cards-index"
    class="bg-white md:p-3"
  >
    <template #header>
      <UDashboardNavbar
        title="Card Management"
        class="border border-[#E7E7E7] rounded-[16px]"
        :ui="{ right: 'gap-3' }"
      >
        <template #right>
          <UButton
            to="/app/cards/new"
            color="primary"
            size="lg"
            icon="i-lucide-plus"
            label="Create Card"
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
      <div class="space-y-4">
        <UAlert
          v-if="error"
          color="error"
          title="Unable to load cards"
          :description="error.message || 'Please try again later.'"
          icon="i-lucide-alert-triangle"
        />

        <div
          v-else-if="pending"
          class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <USkeleton
            v-for="n in 6"
            :key="n"
            class="h-36 rounded-2xl"
          />
        </div>

        <div
          v-else-if="!cardItems.length"
          class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E7E7E7] py-16 text-center space-y-3"
        >
          <UIcon
            name="i-lucide-id-card"
            class="text-4xl text-gray-400"
          />
          <p class="text-lg font-semibold text-gray-900">No cards yet</p>
          <p class="text-sm text-gray-500">Create a digital card to share with your contacts.</p>
          <UButton
            to="/app/cards/new"
            color="primary"
          >
            Create your first card
          </UButton>
        </div>

        <div
          v-else
          class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <NuxtLink
            v-for="card in cardItems"
            :key="card.id"
            :to="`/app/cards/${card.id}`"
            class="rounded-2xl border border-[#E7E7E7] p-4 hover:border-primary focus-visible:ring-2 focus-visible:ring-primary transition"
          >
            <div class="flex items-center justify-between gap-2">
              <div>
                <p class="text-lg font-semibold text-gray-950">{{ card.displayName }}</p>
                <p class="text-sm text-gray-500">{{ card.title || 'No title' }}</p>
              </div>

              <div class="flex flex-col items-end gap-1">
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

            <div class="mt-4 space-y-2 text-sm text-gray-600">
              <p class="truncate">
                <span class="font-medium text-gray-500">Slug:</span> {{ card.slug }}
              </p>
              <p v-if="card.company">
                <span class="font-medium text-gray-500">Company:</span> {{ card.company }}
              </p>
            </div>

            <div class="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>Last updated {{ formatDate(card.updatedAt) }}</span>
              <span class="inline-flex items-center gap-1 font-medium text-primary">
                View
                <UIcon name="i-lucide-arrow-up-right" />
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<style scoped>

</style>
