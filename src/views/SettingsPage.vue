<template>
  <div class="mx-auto mb-3 max-w-xl">
    <TabMenu :model="tabs" :active-index="activeIndex">
      <template #item="{ item, props }">
        <RouterLink v-if="item.route" v-slot="{ href, navigate }" :to="{ name: item.route }" custom>
          <a :href="href" v-bind="props.action" @click="navigate">
            <span v-bind="props.icon"></span>
            <span v-bind="props.label">{{ item.label }}</span>
          </a>
        </RouterLink>
      </template>
    </TabMenu>
  </div>
  <RouterView />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { RouteNameConstants } from '@/router'

const route = useRoute()

const tabs = [
  { label: 'Chat', icon: 'pi pi-comments', route: RouteNameConstants.SETTINGS_CHAT },
  { label: 'Queue', icon: 'pi pi-list', route: RouteNameConstants.SETTINGS_QUEUE },
  { label: 'Other', icon: 'pi pi-cog', route: RouteNameConstants.SETTINGS_OTHER }
]

const activeIndex = computed(() => {
  return tabs.findIndex((tab) => tab.route === route?.name)
})
</script>
