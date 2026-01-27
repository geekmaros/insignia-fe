<script setup lang="ts">
import { computed, toRef, useTemplateRef } from 'vue'
import type { RadioGroupItem, TabsItem } from '@nuxt/ui'
import { useSortable } from '@vueuse/integrations/useSortable'

import type { z } from 'zod'
import { cardSchema } from '~/schema/card.schema'
import type { CardPreviewData, CardTemplate, SelectedLinkOption } from '~/types/card'

const el = useTemplateRef('el')

const items = ref<TabsItem[]>([
  {
    label: 'Basic Details',
    slot: 'basic'
  },
  {
    label: 'Links',
    slot: 'links'
  },
  {
    label: 'Customization',
    slot: 'customization'
  }
])

const templateOptions = ref<RadioGroupItem[]>([
  { label: 'Classic', value: 'classic' },
  { label: 'Minimal', value: 'minimal' },
  { label: 'Bold', value: 'bold' }
])

type Schema = z.infer<typeof cardSchema>
type LinkState = Schema['links'][number]
type LinkEntry = { link: LinkState, meta: SelectedLinkOption }

const props = defineProps<{
  selectedLinks?: SelectedLinkOption[]
}>()

const emit = defineEmits<{
  (event: 'remove-link', id: string | number): void
  (event: 'template-change', template: CardTemplate): void
  (event: 'preview-change', preview: CardPreviewData): void
  (event: 'invalid-links-detected'): void
  (event: 'links-valid'): void
}>()

const selectedLinkOptions = computed<SelectedLinkOption[]>(() => props.selectedLinks ?? [])

const state = reactive<Schema>({
  basic: {
    name: '',
    prefix: '',
    suffix: '',
    accreditation: '',
    title: '',
    department: '',
    company: '',
    headline: ''
  },
  links: [],
  customization: {
    template: 'classic',
    color: '',
    logo: '',
    profileImage: ''
  }
})

const linkEntries = computed<LinkEntry[]>(() => {
  const metaMap = new Map(selectedLinkOptions.value.map(meta => [meta.value, meta]))
  if (!Array.isArray(state.links)) {
    return []
  }

  return state.links
    .map((link) => {
      const meta = metaMap.get(link.type)
      if (!meta) return null
      return { link, meta }
    })
    .filter((entry): entry is LinkEntry => Boolean(entry))
})

const removeLink = (entry: LinkEntry) => {
  const removeId = entry.link.id ?? entry.link.type
  const removeKey = String(removeId)

  const index = state.links.findIndex(link => String(link.id ?? link.type) === removeKey)
  if (index !== -1) {
    state.links.splice(index, 1)
  }

  emit('remove-link', removeId)
}

watch(
  selectedLinkOptions,
  (linkOptions = []) => {
    const existingById = new Map(
      state.links.map(link => [String(link.id ?? link.type), link])
    )

    const nextLinks = linkOptions.map((option, index) => {
      const key = String(option.id ?? option.value)
      const existing = existingById.get(key)

      if (existing) {
        return {
          ...existing,
          position: index
        }
      }

      return {
        id: option.persistedId ?? option.id ?? option.value,
        type: option.value,
        label: '',
        value: '',
        position: index
      }
    })

    state.links.splice(0, state.links.length, ...nextLinks)
  },
  { immediate: true, deep: true } // ✅ THIS
)

const linksValid = ref(true)

watch(
  () => state.links,
  (currentLinks) => {
    const hasEmpty = currentLinks.some(link => !link.value?.trim())
    if (hasEmpty !== linksValid.value) {
      linksValid.value = !hasEmpty

      if (hasEmpty) {
        emit('invalid-links-detected')
      }
      else {
        emit('links-valid')
      }
    }
  },
  { deep: true }
)

const templateFallback: CardTemplate = 'classic'

const previewData = computed<CardPreviewData>(() => ({
  basic: {
    name: state.basic.name,
    title: state.basic.title,
    company: state.basic.company
  },
  customization: {
    accentColor: state.customization.color
  }
}))

watch(
  previewData,
  preview => emit('preview-change', preview),
  { deep: true, immediate: true }
)

watch(
  () => state.customization.template,
  (template) => {
    const normalized = (template === 'minimal' || template === 'bold' || template === 'classic')
      ? template
      : templateFallback
    emit('template-change', normalized)
  },
  { immediate: true }
)
const linksRef = toRef(state, 'links')
const { start, stop } = useSortable(el, linksRef, {
  handle: '.cursor-move',
  animation: 150,
  onEnd: () => {
    linksRef.value = linksRef.value.map((link, index) => ({
      ...link,
      position: index
    }))
  }
})

watch(el, (element) => {
  if (element) {
    start()
  } else {
    stop()
  }
}, { immediate: true })

const getStateSnapshot = () => ({
  basic: { ...state.basic },
  links: state.links.map(link => ({ ...link })),
  customization: { ...state.customization }
})

const setStateSnapshot = (next: Partial<Schema>) => {
  if (next.basic) {
    Object.assign(state.basic, next.basic)
  }

  if (Array.isArray(next.links)) {
    state.links.splice(0, state.links.length, ...next.links.map(link => ({ ...link })))
  }

  if (next.customization) {
    Object.assign(state.customization, next.customization)
  }
}

defineExpose({
  getStateSnapshot,
  setStateSnapshot
})
</script>

<template>
  <UPageCard
    class="rounded-none lg:h-full lg:overflow-y-auto"
    :ui="{
      container: 'px-0 sm:px-0 h-full',
      header: 'font-medium text-gray-950 text-sm capitalize border-b border-[#e7e7e7] w-full px-6 pb-3',
      body: 'px-6s w-full '

    }"
  >
    <template #header>
      <span>Customize Card Elements</span>
    </template>

    <template #body>
      <UForm
        :schema="cardSchema"
        :state="state"
      >
        <UTabs
          :items="items"
          class="w-full"
        >
          <template #basic>
            <div class="px-4 pt-3 space-y-3 ">
              <UFormField
                label="Name"
                size="xl"
                class="text-sm"
                name="basic.name"
              >
                <UInput
                  v-model="state.basic.name"
                  placeholder="Name on card"
                  class="w-full text-sm"
                />
              </UFormField>

              <UFormField
                label="Prefix"
                size="xl"
                class="text-sm"
                name="basic.prefix"
              >
                <UInput
                  v-model="state.basic.prefix"
                  placeholder="Mr., Mrs., Dr."
                  class="w-full placeholder:text-xs"
                />
              </UFormField>
              <UFormField
                label="Suffix"
                size="xl"
                class="text-sm"
                name="basic.suffix"
              >
                <UInput
                  v-model="state.basic.suffix"
                  placeholder="Jr., Sr., PhD"
                  class="w-full placeholder:text-xs"
                />
              </UFormField>
              <UFormField
                label="Accreditation"
                size="xl"
                class="text-sm"
                name="basic.accreditation"
              >
                <UInput
                  v-model="state.basic.accreditation"
                  placeholder="PMP, CFA, RN"
                  class="w-full placeholder:text-xs"
                />
              </UFormField>
              <UFormField
                label="Title"
                size="xl"
                class="text-sm"
                name="basic.title"
              >
                <UInput
                  v-model="state.basic.title"
                  placeholder="Software Engineer"
                  class="w-full placeholder:text-xs"
                />
              </UFormField>
              <UFormField
                label="Department"
                size="xl"
                class="text-sm"
                name="basic.department"
              >
                <UInput
                  v-model="state.basic.department"
                  placeholder="Engineering"
                  class="w-full placeholder:text-xs"
                />
              </UFormField>
              <UFormField
                label="Company"
                size="xl"
                class="text-sm"
                name="basic.company"
              >
                <UInput
                  v-model="state.basic.company"
                  placeholder="Insignia Inc. Google Inc etc"
                  class="w-full placeholder:text-xs"
                />
              </UFormField>
              <UFormField
                label="Headline"
                size="xl"
                class="text-sm"
                name="basic.headline"
              >
                <UTextarea
                  v-model="state.basic.headline"
                  placeholder="Building secure digital identity cards"
                  class="w-full placeholder:text-xs"
                />
              </UFormField>
            </div>
          </template>

          <template #links>
            <div class="px-4 pt-3 space-y-2">
              <p
                v-if="!selectedLinkOptions.length"
                class="text-sm text-gray-500"
              >
                Select a link from the Add Links panel to configure it.
              </p>

              <div
                v-else
                ref="el"
                class="space-y-2"
              >
                <div
                  v-for="entry in linkEntries"
                  :key="entry.link.id ?? entry.link.type"
                  class="flex flex-col bg-white border border-[#e7e7e7] rounded-[12px] px-3 py-2 text-sm"
                >
                  <div class="header flex flex-1 justify-between items-center">
                    <div class="left flex items-center space-x-2">
                      <UIcon
                        name="i-custom-drag"
                        class="cursor-move"
                      />

                      <svg
                        width="1"
                        height="20"
                        viewBox="0 0 1 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line
                          x1="0.25"
                          y1="1.09278e-08"
                          x2="0.249999"
                          y2="20"
                          stroke="#E7E7E7"
                          stroke-width="0.5"
                        />
                      </svg>

                      <UIcon
                        :name="entry.meta.icon"
                        size="sm"
                        class="text-xl text-gray-600"
                      />

                      <span class="text-sm text-gray-600 font-medium capitalize ">{{ entry.meta.label }}</span>
                    </div>
                    <div class="right">
                      <UButton
                        color="error"
                        variant="ghost"
                        icon="i-custom-remove"
                        class="cursor-pointer"
                        @click="removeLink(entry)"
                      />
                    </div>
                  </div>
                  <div class="flex flex-col gap-2 mt-1">
                    <UInput
                      v-model="entry.link.value"
                      :placeholder="entry.meta.placeholder"
                      class="flex-1 placeholder:text-xs"
                    />
                    <UInput
                      v-model="entry.link.label"
                      :placeholder="`Label`"
                      class="placeholder:text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template #customization>
            <div class="px-4 pt-3 space-y-3 ">
              <UFormField
                label="Template"
                size="xl"
                class="text-sm"
                name="customization.template"
              >
                <URadioGroup
                  v-model="state.customization.template"
                  :items="templateOptions"
                  placeholder="Select a template"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="Accent Color"
                size="xl"
                class="text-sm"
                name="customization.color"
              >
                <!--                <UInput -->
                <!--                  v-model="state.customization.color" -->
                <!--                  placeholder="#121212" -->
                <!--                  class="w-full placeholder:text-xs" -->
                <!--                /> -->
                <UColorPicker v-model="state.customization.color" />
              </UFormField>

              <UFormField
                label="Logo URL"
                size="xl"
                class="text-sm"
                name="customization.logo"
              >
                <UInput
                  v-model="state.customization.logo"
                  placeholder="https://example.com/logo.png"
                  class="w-full placeholder:text-xs"
                />
              </UFormField>

              <UFormField
                label="Profile Image URL"
                size="xl"
                class="text-sm"
                name="customization.profileImage"
              >
                <UInput
                  v-model="state.customization.profileImage"
                  placeholder="https://example.com/profile.png"
                  class="w-full placeholder:text-xs"
                />
              </UFormField>
            </div>
          </template>
        </UTabs>
      </UForm>
    </template>
  </UPageCard>
</template>

<style scoped>

</style>
