<script setup lang="ts">
import type { NuxtError } from '#app'
import { clearError } from '#app'
import { computed } from 'vue'
import { useRouter } from 'nuxt/app'

const props = defineProps<{
  error: NuxtError & { statusCode?: number }
}>()

// const router = useRouter()

const statusCode = computed(() =>
  props.error?.statusCode
  ?? props.error?.status
  ?? 500
)

const isNotFound = computed(() => statusCode.value === 404)
const isUnauthorized = computed(() => statusCode.value === 401)

const title = computed(() => {
  if (isNotFound.value) return 'This page took a detour'
  if (isUnauthorized.value) return 'Session expired'
  return 'We hit a snag'
})

const description = computed(() => {
  if (isNotFound.value) {
    return 'The page you were looking for does not exist. Let’s get you back on track.'
  }
  if (isUnauthorized.value) {
    return 'Your session has expired or you don’t have access to this page.'
  }
  return (
    props.error?.message
    || 'Something unexpected happened. Please try again.'
  )
})

function goToDashboard() {
  clearError({ redirect: '/app/dashboard' })
}

function goHome() {
  clearError({ redirect: '/' })
}

function retry() {
  clearError()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
    <div class="max-w-3xl w-full">
      <div
        class="rounded-[32px] bg-white border border-gray-100 shadow-lg shadow-gray-900/5 p-8 md:p-12 text-center space-y-8"
      >
        <!-- Error badge -->
        <div
          class="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600"
        >
          <span class="text-gray-950">Error {{ statusCode }}</span>
          <span class="h-1.5 w-1.5 rounded-full bg-primary" />
          <span>
            {{ isNotFound ? 'Page not found' : 'Something went wrong' }}
          </span>
        </div>

        <!-- Message -->
        <div class="space-y-4">
          <h1 class="text-3xl md:text-4xl font-semibold text-gray-950 leading-tight">
            {{ title }}
          </h1>
          <p class="text-base md:text-lg text-gray-600">
            {{ description }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <UButton
            v-if="isNotFound"
            size="xl"
            color="primary"
            class="w-full sm:w-auto font-semibold"
            @click="goToDashboard"
          >
            Back to dashboard
          </UButton>

          <UButton
            v-else
            size="xl"
            color="primary"
            class="w-full sm:w-auto font-semibold"
            @click="retry"
          >
            Try again
          </UButton>

          <UButton
            size="xl"
            variant="outline"
            class="w-full sm:w-auto font-semibold"
            @click="goHome"
          >
            Go home
          </UButton>
        </div>

        <!-- Support -->
        <div
          class="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-4 text-left flex flex-col gap-1 text-sm text-gray-600"
        >
          <p class="font-semibold text-gray-900">
            Need help?
          </p>
          <p>
            Contact our support team at
            <span class="text-primary font-semibold">
              support@insignia.dev
            </span>
            and share the error code above.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
