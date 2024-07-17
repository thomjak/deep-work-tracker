<template>
  <div class="container mx-auto p-4 font-sans max-w-3xl">
    <h1 class="text-4xl font-bold mb-6 text-center">Deep Work Tracker</h1>
    <DeepWorkTracker />
  </div>
</template>

<script>
import DeepWorkTracker from './components/DeepWorkTracker.vue'

export default {
  name: 'App',
  components: {
    DeepWorkTracker
  }
}
</script>