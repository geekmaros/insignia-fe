export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie<string | null>('insignia_token')
  const requiresAuth = to.path.startsWith('/dashboard') || to.path.startsWith('/cards') || to.path.startsWith('/admin')

  if (requiresAuth && !token.value) {
    return navigateTo('/auth/login')
  }

  if (to.path.startsWith('/auth') && token.value) {
    return navigateTo('/dashboard')
  }
})
