<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { isNotificationsSlideoverOpen } = useDashboard()

const items = [[{
  label: 'New mail',
  icon: 'i-lucide-send',
  to: '/inbox'
}, {
  label: 'New customer',
  icon: 'i-lucide-user-plus',
  to: '/customers'
}]] satisfies DropdownMenuItem[][]
</script>

<template>
  <UTooltip
    text="Notifications"
    :shortcuts="['N']"
  >
    <UButton
      color="neutral"
      variant="outline"
      square
      @click="isNotificationsSlideoverOpen = true"
    >
      <UChip
        color="error"
        inset
      >
        <UIcon
          name="i-custom-notification"
          class="size-5 shrink-0"
        />
      </UChip>
    </UButton>
  </UTooltip>

  <UDropdownMenu
    arrow
    :items="items"
    :ui="{
      content: 'w-48'
    }"
  >
    <UButton
      color="neutral"
      variant="outline"
    >
      <UAvatar
        icon="i-custom-user"
        src="https://github.com/benjamincanac.png"
        size="md"
      />
      <div class="profile-name flex flex-col items-start ">
        <span class="font-semibold text-gray-950 text-base">
          Abdulrasaq Mustapha
        </span>
        <span class="text-gray-600  text-xs">geekmaros@gmail.com</span>
      </div>
    </UButton>
  </UDropdownMenu>
</template>

<style scoped>

</style>
