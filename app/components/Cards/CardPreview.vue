<script setup lang="ts">
import { computed, markRaw } from 'vue'
import ClassicCard from '~/components/Cards/Preview/ClassicCard.vue'
import MinimalCard from '~/components/Cards/Preview/MinimalCard.vue'
import BoldCard from '~/components/Cards/Preview/BoldCard.vue'
import type { CardPreviewData, CardTemplate } from '~/types/card'

const props = defineProps<{
  template?: CardTemplate
  card: CardPreviewData
}>()

const variants: Record<CardTemplate, any> = {
  classic: markRaw(ClassicCard),
  minimal: markRaw(MinimalCard),
  bold: markRaw(BoldCard)
}

const activeComponent = computed(() => variants[props.template ?? 'classic'])
</script>

<template>
  <component
    :is="activeComponent"
    :card="card"
  />
</template>
