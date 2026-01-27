<script setup lang="ts">
import { computed } from 'vue'
import type { Period, Range } from '~/types'
import type { Card } from '@/types/cards'
import { listMyCards } from '@/services/cards.service'

interface DashboardStat {
  title: string
  icon: string
  value: string | number
  description: string
}

const props = defineProps<{
  period: Period
  range: Range
}>()

const {
  data: cards,
  pending,
  error
} = await useAsyncData<Card[]>('dashboard-cards', () => listMyCards(), {
  default: () => [],
  watch: [() => props.period, () => props.range]
})

const formatDate = (value?: string | null) => {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
  } catch {
    return '—'
  }
}

const hasNoCards = computed(() => !pending.value && !error.value && ((cards.value?.length ?? 0) === 0))

const stats = computed<DashboardStat[]>(() => {
  const list = cards.value ?? []
  const totalCards = list.length
  const activeCards = list.filter(card => card.isActive).length
  const publicCards = list.filter(card => card.isPublic).length
  const newestCard = list.reduce<string | null>((latest, card) => {
    if (!card.createdAt) return latest
    if (!latest) return card.createdAt
    return new Date(card.createdAt) > new Date(latest) ? card.createdAt : latest
  }, null)

  return [
    {
      title: 'Cards Created',
      value: totalCards,
      description: 'Total cards created on your account.'
    },
    {
      title: 'Active Cards',
      value: activeCards,
      description: 'Cards currently active and usable.'
    },
    {
      title: 'Public Cards',
      value: publicCards,
      description: 'Cards visible to anyone with the link.'
    },
    {
      title: 'Last Card Created',
      icon: 'i-lucide-calendar-plus',
      value: formatDate(newestCard),
      description: newestCard ? 'Most recent card creation date.' : 'Create a card to see activity.'
    }
  ]
})
</script>

<template>
  <div class="space-y-4">
    <UAlert
      v-if="error"
      color="error"
      title="Unable to load stats"
      :description="error.message || 'Please try again later.'"
      icon="i-lucide-alert-triangle"
    />

    <div
      v-else-if="pending"
      class="grid gap-4 sm:gap-6 lg:grid-cols-4"
    >
      <USkeleton
        v-for="n in 4"
        :key="n"
        class="h-28 rounded-2xl"
      />
    </div>

    <UAlert
      v-if="hasNoCards"
      color="primary"
      title="No cards yet"
      description="Create your first digital card to see these stats grow."
      icon="i-lucide-info"
    />

    <UPageGrid
      class="lg:grid-cols-4 gap-4 sm:gap-6"
    >
      <UPageCard
        v-for="(stat, index) in stats"
        :key="index"
        :title="stat.title"
        :ui="{
          container: 'gap-y-1.5 ',
          wrapper: 'items-start',
          leading: 'p-2.5 rounded-[16px] bg-primary/5 text-primary flex-col',
          title: 'font-medium text-gray-950 text-sm uppercase'
        }"
        class="hover:z-1 hover:border-primary border border-[#E7E7E7] rounded-[16px]"
      >
        <div class="flex items-center gap-3">
          <UIcon
            :name="stat.icon"
            class="text-xl"
          />
          <span class="text-2xl font-semibold text-gray-950">
            {{ stat.value }}
          </span>
        </div>
        <p class="text-xs text-gray-500">
          {{ stat.description }}
        </p>
      </UPageCard>
    </UPageGrid>
  </div>
</template>
