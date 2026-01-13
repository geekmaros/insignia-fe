import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/auth'

export function useCurrentUser() {
  const authStore = useAuthStore()
  const { user, isAuthenticated } = storeToRefs(authStore)

  return {
    user,
    isAuthenticated,
    fetchCurrentUser: authStore.fetchProfile
  }
}
