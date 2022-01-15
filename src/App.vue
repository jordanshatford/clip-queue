<template>
  <div class="min-h-screen h-full dark:bg-gray-900">
    <div class="h-full">
      <Nav />
      <main class="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-5">
        <router-view />
      </main>
    </div>
  </div>
  <Footer />
</template>

<script lang="ts">
import Nav from "@/layout/Nav.vue";
import Footer from "./layout/Footer.vue";
import { defineComponent } from "vue";
import { theme } from "@/stores/theme";

export default defineComponent({
  components: {
    Nav,
    Footer,
  },
  setup() {
    theme.getDefault();
  },
});
</script>
