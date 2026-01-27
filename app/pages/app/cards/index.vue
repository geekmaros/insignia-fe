<script setup lang="ts">
definePageMeta({
  layout: 'app'
})
</script>

<template>
  <main>
    <UDashboardSidebarCollapse />

    <UDashboardSidebarToggle />

    All Cards proposed page

    <UButton to="/app/cards/new">
      Add New Card
    </UButton>
  </main>
</template>

<style scoped>

</style>
