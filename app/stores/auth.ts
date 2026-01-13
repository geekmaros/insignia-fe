import { defineStore } from 'pinia'

import { useApi } from '@/composables/useApi'
import type { AuthResponse, AuthUser, LoginPayload, SignupPayload } from '@/types/auth.type'

export const useAuthStore = defineStore('auth', () => {
  const tokenCookie = useCookie<string | null>('insignia_token', {
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  })

  const accessToken = ref<string | null>(tokenCookie.value || null)
  const user = ref<AuthUser | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => Boolean(accessToken.value))

  watch(accessToken, (next) => {
    tokenCookie.value = next
  })

  async function login(payload: LoginPayload) {
    loading.value = true
    try {
      const response = await useApi<AuthResponse>('/auth/login', {
        method: 'POST',
        body: payload,
        withAuth: false
      })

      accessToken.value = response.accessToken
      user.value = response.user

      return response
    } finally {
      loading.value = false
    }
  }

  async function signup(payload: SignupPayload) {
    loading.value = true
    try {
      const response = await useApi<AuthResponse>('/auth/signup', {
        method: 'POST',
        body: payload,
        withAuth: false
      })

      accessToken.value = response.accessToken
      user.value = response.user

      return response
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    if (!accessToken.value) {
      return null
    }

    loading.value = true
    try {
      const profile = await useApi<AuthUser>('/auth/me')
      user.value = profile
      return profile
    } finally {
      loading.value = false
    }
  }

  function logout() {
    accessToken.value = null
    user.value = null
    if (import.meta.client) {
      navigateTo('/auth/login')
    }
  }

  return {
    accessToken,
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    fetchProfile
  }
})
