<template>
  <div class="min-h-screen h-full dark:bg-gray-900">
    <div class="h-full">
      <Nav />
      <main class="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <router-view />
      </main>
    </div>
  </div>
  <Footer />
</template>

<script lang="ts">
import Nav from "@/components/Nav.vue";
import Footer from "./components/Footer.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    Nav,
    Footer,
  },
});
</script>
