<template>
  <section
    class="auth-layout min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center md:justify-end p-4 md:p-0 md:pr-[150px]"
  >
    <div
      class="bg-white w-full max-w-[439px] shrink-0 rounded-2xl shadow-md pt-8 pb-8 px-8"
    >
      <header class="mb-10">
        <img
          class="mx-auto"
          src="~/assets/svg/logo/logo.svg"
          alt="site logo"
        >
      </header>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.auth-layout {
  background-image: url("~/assets/images/authbg.png");
}
</style>
