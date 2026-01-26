export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie<string | null>('insignia_token')
  const requiresAuth = to.path.startsWith('/app/dashboard') || to.path.startsWith('/app/cards') || to.path.startsWith('/admin')

  if (requiresAuth && !token.value) {
    return navigateTo('/auth/login')
  }

  if (to.path.startsWith('/auth') && token.value) {
    // fetch uer profile

    return navigateTo('/app/dashboard')
  }
})
