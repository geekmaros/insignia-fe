<script setup lang="ts">
import { computed } from 'vue'
import type { CardPreviewData } from '~/types/card'

const props = defineProps<{
  card: CardPreviewData
}>()

const basic = computed(() => props.card.basic ?? {})
const links = computed(() => props.card.links ?? [])
const accent = computed(() => props.card.customization?.accentColor ?? '#111827')
</script>

<template>
  <div class="w-full rounded-[32px] bg-black text-white overflow-hidden shadow-2xl min-h-[280px]">
    <div class="p-6 flex flex-col gap-6">
      <div>
        <p class="text-xs uppercase tracking-[0.35em] text-white/50 mb-2">
          insignia id
        </p>
        <h2 class="text-3xl font-semibold">
          {{ basic.name || 'Your Name' }}
        </h2>
        <p class="text-base text-white/70">
          {{ basic.title || 'Professional Title' }}
        </p>
      </div>

      <div class="bg-white text-black rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.4em] text-gray-500">
            company
          </p>
          <p class="text-lg font-semibold">
            {{ basic.company || 'Company Inc.' }}
          </p>
        </div>
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center text-white"
          :style="{ backgroundColor: accent }"
        >
          <span class="font-semibold text-lg">
            {{ (basic.name || 'IN')[0] ?? 'I' }}
          </span>
        </div>
      </div>

      <div class="flex flex-wrap gap-3">
        <div
          v-for="link in links"
          :key="link.id"
          class="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
          :style="{ backgroundColor: accent + '1a', color: accent }"
        >
          <UIcon
            :name="link.icon"
            class="text-base"
          />
          <span class="capitalize">{{ link.label }}</span>
        </div>
        <p
          v-if="!links.length"
          class="text-xs text-white/60"
        >
          Add links to showcase them here.
        </p>
      </div>
    </div>
  </div>
</template>
