<script setup lang="ts">
import type * as z from 'zod'
import { storeToRefs } from 'pinia'
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import { useAuthStore } from '~/stores/auth'
import { signInSchema } from '~/schema/auth.schema'
import { resolveErrorMessage } from '~/utils/resolveErrorMessage'

definePageMeta({
  layout: 'auth'
})

type Schema = z.output<typeof signInSchema>

const authStore = useAuthStore()
const { loading } = storeToRefs(authStore)
const router = useRouter()

const state = reactive<Partial<Schema>>({
  email: '',
  password: ''
})

const toast = useToast()
const formErrors = ref<FormError[]>([])

async function onSubmit(event: FormSubmitEvent<Schema>) {
  formErrors.value = []

  try {
    await authStore.login({
      email: event.data.email,
      password: event.data.password
    })

    // toast.add({
    //   title: 'Welcome back',
    //   description: 'Taking you to your dashboard.',
    //   color: 'success'
    // })

    await router.push('/app/dashboard')
  } catch (error) {
    const message = resolveErrorMessage(error, 'Unable to sign in. Please check your credentials.')
    formErrors.value = [{ message }]

    toast.add({
      title: 'Login failed',
      description: message,
      color: 'error'
    })
  }
}
</script>

<template>
  <section>
    <header class="max-w-[327px] w-full mx-auto">
      <h1 class="auth-title mb-1">
        Access your account
      </h1>
      <p class="auth-subtitle mb-4">
        Please enter your email and password to sign to account dashboard
      </p>
      <p class="auth-link-text">
        Don't have an account? <NuxtLink
          to="/auth/register"
          class="auth-link"
        >Create an account</NuxtLink>
      </p>
    </header>
    <main class="mt-10 ">
      <UForm
        :schema="signInSchema"
        :state="state"
        :errors="formErrors"
        class="space-y-2"
        @submit="onSubmit"
      >
        <UFormField
          label="Email"
          size="xl"
          name="email"
        >
          <UInput
            v-model="state.email"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Password"
          size="xl"
          name="password"
        >
          <UInput
            v-model="state.password"
            type="password"
            class="w-full"
          />
        </UFormField>

        <div class="button-wrappers mt-10 space-y-2">
          <UButton
            class="font-semibold w-full text-gray-950 text-center flex items-center justify-center cursor-pointer"
            type="submit"
            size="xl"
            :loading="loading"
            :disabled="loading"
          >
            Sign in
          </UButton>

          <UButton
            class="font-semibold w-full  text-gray-950 text-center flex items-center justify-center cursor-pointer "
            size="xl"
            variant="outline"
            icon="i-custom-google"
          >
            Sign up with Google
          </UButton>
        </div>
      </UForm>
    </main>
  </section>
</template>

<style scoped>

</style>
