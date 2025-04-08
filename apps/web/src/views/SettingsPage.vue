<template>
  <div class="mx-auto mb-3 max-w-xl">
    <Tabs :value="active">
      <TabList>
        <Tab
          v-for="setting in settingsRoutes"
          :key="setting.name"
          :value="setting?.name?.toString() ?? ''"
        >
          <RouterLink
            v-if="setting.name"
            v-slot="{ href, navigate }"
            :to="{ name: setting.name }"
            custom
          >
            <a :href class="flex items-center gap-2 text-inherit" @click="navigate">
              <i :class="setting.meta?.icon"></i>
              <span>{{ routeTranslations[setting.name as RouteNameConstants]() }}</span>
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

import { allowedRoutes, RouteNameConstants, routeTranslations } from '@/router'

const route = useRoute()

const settingsRoutes =
  allowedRoutes.value.find((r) => r.name === RouteNameConstants.SETTINGS)?.children ?? []

const active = computed(() => route?.name?.toString() ?? '')
</script>
