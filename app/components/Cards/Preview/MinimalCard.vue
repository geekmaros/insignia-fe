<script setup lang="ts">
import { computed } from 'vue'
import type { CardPreviewData } from '~/types/card'

const props = defineProps<{
  card: CardPreviewData
}>()

const basic = computed(() => props.card.basic ?? {})
const links = computed(() => props.card.links ?? [])

const initials = computed(() => {
  const name = basic.value.name ?? ''
  const parts = name.split(' ').filter(Boolean)
  return parts.slice(0, 2).map(part => part[0]?.toUpperCase() ?? '').join('') || 'IN'
})
</script>

<template>
  <div class="w-full rounded-[24px] border border-gray-200 bg-white p-6 space-y-6 shadow-sm min-h-[260px]">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-semibold text-base">
        {{ initials }}
      </div>
      <div>
        <h3 class="text-lg font-semibold text-gray-900">
          {{ basic.name || 'Your Name' }}
        </h3>
        <p class="text-sm text-gray-500">
          {{ basic.title || 'Professional Title' }}
        </p>
      </div>
    </div>

    <div class="space-y-3">
      <p class="text-xs uppercase tracking-widest text-gray-400">
        company
      </p>
      <p class="text-base font-medium text-gray-900">
        {{ basic.company || 'Company Inc.' }}
      </p>
    </div>

    <div class="border-t border-dashed border-gray-200 pt-4">
      <p class="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">
        quick links
      </p>
      <div
        v-if="links.length"
        class="flex flex-wrap gap-3"
      >
        <div
          v-for="link in links"
          :key="link.id"
          class="flex items-center gap-2 text-sm text-gray-700 border border-gray-200 rounded-full px-3 py-1.5"
        >
          <UIcon
            :name="link.icon"
            class="text-base text-gray-500"
          />
          <span class="capitalize">{{ link.label }}</span>
        </div>
      </div>
      <p
        v-else
        class="text-xs text-gray-400"
      >
        Add links to see them here.
      </p>
    </div>
  </div>
</template>
