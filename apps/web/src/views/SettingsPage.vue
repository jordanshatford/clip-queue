<template>
  <div class="mx-auto mb-3 max-w-xl">
    <Tabs :value="active">
      <TabList>
        <Tab v-for="tab in tabs" :key="tab.label?.toString()" :value="tab.route.name">
          <RouterLink v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
            <a :href="href" class="flex items-center gap-2 text-inherit" @click="navigate">
              <i :class="tab.icon"></i>
              <span>{{ tab.label }}</span>
            </a>
          </RouterLink>
        </Tab>
      </TabList>
    </Tabs>
  </div>
  <RouterView />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { Tab, TabList, Tabs } from '@cq/ui'

import { RouteNameConstants, routes, toAllowedMenuItems } from '@/router'

const route = useRoute()

const settingChildren = routes.find((r) => r.name === RouteNameConstants.SETTINGS)?.children ?? []
const tabs = toAllowedMenuItems(settingChildren)

const active = computed(() => route?.name?.toString() ?? '')
</script>
