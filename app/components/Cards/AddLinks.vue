<script setup lang="ts">
import { ADD_LINK_DATA } from '~/components/Cards/addLinkData'
</script>

<template>
  <UPageCard
    class="rounded-none h-full"
    :ui="{
      container: 'px-0 sm:px-0 h-full',
      header: 'font-medium text-gray-950 text-sm capitalize border-b border-[#e7e7e7] w-full px-6 pb-3'

    }"
  >
    <template #header>
      <span>Add Links to Card</span>
    </template>
    <template #body>
      <div
        v-for="(link, index) in ADD_LINK_DATA"
        :key="`link-${index}`"
        class="card-link-option"
      >
        <UIcon
          :name="link.icon"
          class="size-5"
        />

        <span>{{ link.label }}</span>
      </div>
    </template>
  </upagecard>
</template>

<style scoped>

</style>
