<script setup lang="ts">
import type { InputProps } from '@nuxt/ui'

defineProps<{
  modelValue: string | number | undefined
  label?: string
} & InputProps>()

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()
</script>

<template>
  <div
    class="relative w-full"
    v-bind="$attrs"
  >
    <UInput
      :model-value="modelValue"
      placeholder=" "
      :ui="{ base: 'peer' }"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <!-- Floating Label -->
      <label
        v-if="label"
        class="pointer-events-none absolute left-0 -top-2.5
             text-highlighted text-xs font-medium px-1.5 transition-all
             peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs
             peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed
             peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal"
      >
        <span class="inline-flex bg-default px-1">
          {{ label }}
        </span>
      </label>

      <!-- Forward ALL slots -->
      <template
        v-for="(_, name) in $slots"
        #[name]="slotProps"
      >
        <slot
          :name="name"
          v-bind="slotProps"
        />
      </template>
    </UInput>
  </div>
</template>
