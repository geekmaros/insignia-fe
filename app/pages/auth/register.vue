<script setup lang="ts">
import type * as z from 'zod'
import { storeToRefs } from 'pinia'
import { signupSchema } from '~/schema/auth.schema'
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const { loading } = storeToRefs(authStore)
const router = useRouter()

definePageMeta({
  layout: 'auth'
})

type Schema = z.output<typeof signupSchema>

const state = reactive<Partial<Schema>>({
  name: '',
  email: '',
  password: '',
  confirm_password: ''
})

const formErrors = ref<FormError[]>([])
const toast = useToast()

function resolveErrorMessage(error: unknown) {
  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object') {
    const { data, statusMessage, message } = error as {
      data?: { message?: string }
      statusMessage?: string
      message?: string
    }

    return data?.message || statusMessage || message || 'Unable to create account. Please try again.'
  }

  return 'Unable to create account. Please try again.'
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  formErrors.value = []

  try {
    await authStore.signup({
      name: event.data.name,
      email: event.data.email,
      password: event.data.password
    })

    toast.add({
      title: 'Account created',
      description: 'Redirecting you to the dashboard.',
      color: 'success'
    })

    await router.push('/dashboard')
  } catch (error) {
    const message = resolveErrorMessage(error)
    formErrors.value = [{ message }]

    toast.add({
      title: 'Registration failed',
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
        Get Insignia account
      </h1>
      <p class="auth-subtitle mb-4">
        Get started with creating professional ID cards for your team.
      </p>
      <p class="auth-link-text">
        Already have an account? <NuxtLink
          to="/auth/login"
          class="auth-link"
        >Login Here</NuxtLink>
      </p>
    </header>
    <main class="mt-10 ">
      <UForm
        :schema="signupSchema"
        :state="state"
        :errors="formErrors"
        class="space-y-2"
        @submit="onSubmit"
      >
        <UFormField
          label="Account Name"
          name="name"
          size="xl"
        >
          <UInput
            v-model="state.name"
            placeholder="John Doe"
            size="xl"
            class="w-full"
          />
        </UFormField>

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

        <UFormField
          label="Confirm Password"
          size="xl"
          name="confirm_password"
        >
          <UInput
            v-model="state.confirm_password"
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
            Create account
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
