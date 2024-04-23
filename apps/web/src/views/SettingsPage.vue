<template>
  <div class="mx-auto mb-3 max-w-xl">
    <TabMenu :model="tabs" :active-index="activeIndex">
      <template #item="{ item, props }">
        <RouterLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
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

import { TabMenu } from '@cq/ui'

import { RouteNameConstants, routes, toAllowedMenuItems } from '@/router'

const route = useRoute()

const settingChildren = routes.find((r) => r.name === RouteNameConstants.SETTINGS)?.children ?? []
const tabs = toAllowedMenuItems(settingChildren)

const activeIndex = computed(() => {
  return tabs.findIndex((tab) => tab.route.name === route?.name)
})
</script>
