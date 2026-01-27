<script setup lang="ts">
definePageMeta({
  layout: false
})

const authStore = useAuthStore()

if (!authStore.isAuthenticated) {
  await navigateTo('/auth/login', { replace: true })
} else {
  if (!authStore.user) {
    await authStore.fetchProfile()
  }
  await navigateTo('/app/dashboard', { replace: true })
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
    Redirecting…
  </div>
</template>
