<script setup lang="ts">
import RightNavMenuItem from '~/components/Dashboard/RightNavMenuItem.vue'

definePageMeta({
  layout: 'app'
})
</script>

<template>
  <UDashboardPanel
    id="dashboard-index"
    class="bg-white md:p-3"
  >
    <template #header>
      <UDashboardNavbar
        title="Dashboard Overview"
        class="border border-[#E7E7E7] rounded-[16px]"
        :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <!--          <UDashboardSidebarToggle /> -->
        </template>

        <template #right>
          <RightNavMenuItem />
        </template>
      </UDashboardNavbar>
    </template>
  </UDashboardPanel>
</template>

<style scoped>

</style>
