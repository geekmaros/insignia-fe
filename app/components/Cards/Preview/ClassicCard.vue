<script setup lang="ts">
import { computed } from 'vue'
import type { CardPreviewData } from '~/types/card'

const props = defineProps<{
  card: CardPreviewData
}>()

const basic = computed(() => props.card.basic ?? {})
const links = computed(() => props.card.links ?? [])
const accent = computed(() => props.card.customization?.accentColor ?? '#0F172A')
</script>

<template>
  <div
    class="w-full rounded-[28px] p-6 text-white shadow-xl min-h-[280px] flex flex-col justify-between bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
    :style="{
      backgroundImage: `linear-gradient(135deg, ${accent} 0%, #1f2937 100%)`
    }"
  >
    <div>
      <p class="text-xs uppercase tracking-[0.3em] text-white/60">
        digital identity
      </p>
      <h2 class="text-2xl font-semibold mt-4">
        {{ basic.name || 'Your Name' }}
      </h2>
      <p class="text-sm text-white/70">
        {{ basic.title || 'Professional Title' }}
      </p>
    </div>

    <div class="mt-10 flex items-end justify-between gap-6">
      <div>
        <p class="text-xs uppercase text-white/50">
          company
        </p>
        <p class="text-base font-medium">
          {{ basic.company || 'Company Inc.' }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2 justify-end">
        <span
          v-for="link in links"
          :key="link.id"
          class="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white text-lg"
        >
          <UIcon
            :name="link.icon"
            class="text-base"
          />
        </span>
        <span
          v-if="!links.length"
          class="text-xs text-white/60"
        >
          Add links to preview
        </span>
      </div>
    </div>
  </div>
</template>
