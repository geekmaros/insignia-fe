<script setup lang="ts">
import { sub } from 'date-fns'
import type { Period, Range } from '~/types'
import RightNavMenuItem from '~/components/Dashboard/RightNavMenuItem.vue'
import PeriodSelect from '~/components/Dashboard/PeriodSelect.vue'
import DateRangePicker from '~/components/Dashboard/DateRangePicker.vue'

definePageMeta({
  layout: 'app'
})

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
const period = ref<Period>('daily')
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

      <UDashboardToolbar class="mt-2 border-b-0 px-4 sm:px-0">
        <template #left>
          <PeriodSelect
            v-model="period"
            class="md:w-[326px]"
            :range="range"
          />
        </template>

        <template #right>
          <DateRangePicker v-model="range" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <DashboardHomeStats
        :period="period"
        :range="range"
      />
    </template>
  </UDashboardPanel>
</template>

<style scoped>

</style>
