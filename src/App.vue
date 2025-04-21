<script setup>
import navbar from './components/navbar.vue'
import Footer from './components/footer.vue'

if (!localStorage.getItem('device-id')) {
  const randomId = crypto.randomUUID()
  localStorage.setItem('device-id', randomId)
}


</script>

<template>
  <main>
    <navbar />
    <RouterView />
    <Footer />
  </main>
</template>

<style scoped></style>
