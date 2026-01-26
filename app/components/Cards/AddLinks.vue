<script setup lang="ts">
import { computed } from 'vue'
import { ADD_LINK_DATA } from '~/components/Cards/addLinkData'
import type { AddLinkOption } from '~/components/Cards/addLinkData'
import type { SelectedLinkOption } from '~/types/card'

type LinkOption = AddLinkOption

const props = defineProps<{
  selectedLinks?: SelectedLinkOption[]
}>()

const emit = defineEmits<{
  (event: 'update:selected-links', links: SelectedLinkOption[]): void
}>()

const selectedLinks = computed(() => props.selectedLinks ?? [])

function toggleLink(link: LinkOption) {
  emit('update:selected-links', [
    ...selectedLinks.value,
    {
      ...link,
      id: crypto.randomUUID()
    }
  ])
}

function isSelected(value: LinkOption['value']) {
  return selectedLinks.value.some(link => link.value === value)
}
</script>

<template>
  <UPageCard
    class="rounded-none h-full"
    :ui="{
      container: 'px-0 sm:px-0 h-full',
      header: 'font-medium text-gray-950 text-sm capitalize border-b border-[#e7e7e7] w-full px-6 pb-3',
      body: 'px-6'

    }"
  >
    <template #header>
      <span>Add Links to Card</span>
    </template>
    <template #body>
      <div class="grid grid-cols-4 gap-4 w-full justify-items-center items-center">
        <div
          v-for="(link, index) in ADD_LINK_DATA"
          :key="`link-${index}`"
          class="card-link-option w-[84.5px] hover:bg-primary/20 bg-white hover: rounded-[12px] px-2 py-3 flex flex-col items-center justify-center space-y-3 cursor-pointer transition-all border border-transparent"
          :class="{
            'ring-1 ring-primary border-gray-950 bg-primary/20': isSelected(link.value)
          }"
          role="button"
          :aria-pressed="isSelected(link.value)"
          tabindex="0"
          @click="toggleLink(link)"
        >
          <UIcon
            :name="link.icon"
            class="size-5"
          />

          <span class="font-medium capitalize text-gray-900 text-xs">{{ link.label }}</span>
        </div>
      </div>
    </template>
  </UPageCard>
</template>

<style scoped>

</style>
