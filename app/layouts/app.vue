<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import NotificationSlideover from '~/components/NotificationSlideover.vue'

const route = useRoute()
const toast = useToast()

const open = ref(false)

const links = [[
  {
    label: 'Start Creating',
    type: 'label',
    class: 'side-bar-link-label'
  },
  {
    label: 'Dashboard Overview',
    class: 'side-menu-link mb-3 data-active:font-semibold',
    icon: 'i-custom-dashboard',
    to: '/app/dashboard',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Cards Management',
    class: 'side-menu-link data-active:font-semibold ',
    icon: 'i-custom-card',
    to: '/app/cards',
    // badge: '4',
    onSelect: () => {
      open.value = false
    }
  }
], [
  {
    label: 'General',
    type: 'label',
    class: 'side-bar-link-label'
  },
  {
    label: 'Contacts',
    class: 'side-menu-link mb-3 data-active:font-semibold ',
    icon: 'i-custom-contact',
    to: '/app/contacts',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Backgrounds',
    class: 'side-menu-link mb-3 data-active:font-semibold ',
    icon: 'i-custom-background',
    to: '/app/background',
    // badge: '4',
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Email Signature',
    class: 'side-menu-link mb-3 data-active:font-semibold ',
    icon: 'i-custom-email',
    to: '/app/email-signature',
    // badge: '4',
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Settings',
    class: 'side-menu-link data-active:font-semibold',
    icon: 'i-custom-cog',
    to: '/app/settings',
    // badge: '4',
    onSelect: () => {
      open.value = false
    }
  }
], [
  {
    label: 'Other Tools',
    type: 'label',
    class: 'side-bar-link-label'
  },
  {
    label: 'Affiliate Program',
    class: 'side-menu-link mb-3 data-active:font-semibold',
    icon: 'i-custom-affiliate',
    to: '/app/affiliates',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Get Premium',
    class: 'side-menu-link data-active:font-semibold ',
    icon: 'i-custom-premium',
    to: '/app/premium',
    // badge: '4',
    onSelect: () => {
      open.value = false
    }
  }
], [{
  label: 'Help & Support',
  icon: 'i-lucide-info',
  to: 'https://github.com/nuxt-ui-templates/dashboard',
  target: '_blank'
}]] satisfies NavigationMenuItem[][]

const groups = computed(() => [{
  id: 'links',
  label: 'Go to',
  items: links.flat()
}, {
  id: 'code',
  label: 'Code',
  items: [{
    id: 'source',
    label: 'View page source',
    icon: 'i-simple-icons-github',
    to: `https://github.com/nuxt-ui-templates/dashboard/blob/main/app/pages${route.path === '/' ? '/index' : route.path}.vue`,
    target: '_blank'
  }]
}])

onMounted(async () => {
  const cookie = useCookie('cookie-consent')
  if (cookie.value === 'accepted') {
    return
  }

  toast.add({
    title: 'We use first-party cookies to enhance your experience on our website.',
    duration: 0,
    close: false,
    actions: [{
      label: 'Accept',
      color: 'neutral',
      variant: 'outline',
      onClick: () => {
        cookie.value = 'accepted'
      }
    }, {
      label: 'Opt out',
      color: 'neutral',
      variant: 'ghost'
    }]
  })
})
</script>

<template>
  <UDashboardGroup
    unit="rem"
  >
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-[#fafafa]"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <header class="flex flex-col w-full">
          <div class="flex items-center justify-between">
            <NuxtLink
              v-if="!collapsed"
              to="/app/dashboard"
            >
              <img
                src="@/assets/svg/logo/logo.svg"
                alt="App Logo"
              >
            </NuxtLink>

            <div class="collaps-wwrapper bg-primary rounded-[12px] ">
              <UDashboardSidebarCollapse
                icon="i-custom-drawer"
                class="text-gray-950"
              />
            </div>
          </div>
          <TeamsMenu
            class="w-full shrink-0 hidden"
            :collapsed="collapsed"
          />
        </header>
      </template>

      <template #default="{ collapsed }">
        <!--        <UDashboardSearchButton -->
        <!--          :collapsed="collapsed" -->
        <!--          class="bg-transparent ring-default" -->
        <!--        /> -->

        <div>
          <UNavigationMenu
            :collapsed="collapsed"
            :items="links[0]"
            orientation="vertical"
            tooltip
            popover
            variant="pill"
            class="mb-5"
          />

          <UNavigationMenu
            :collapsed="collapsed"
            :items="links[1]"
            orientation="vertical"
            tooltip
            popover
            class="mb-5"
          />

          <UNavigationMenu
            :collapsed="collapsed"
            :items="links[2]"
            orientation="vertical"
            tooltip
            popover
          />
        </div>

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[3]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UsersMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />

    <NotificationSlideover />
  </UDashboardGroup>
</template>
