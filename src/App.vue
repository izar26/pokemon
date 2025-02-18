<script setup>
import navbar from './components/navbar.vue'
import Footer from './components/footer.vue'
</script>

<template>
  <main>
    <navbar />
    <RouterView />
    <Footer />
  </main>
</template>

<style scoped></style>
