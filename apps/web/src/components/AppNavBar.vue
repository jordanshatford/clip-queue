<template>
  <Menubar :model="items" class="sticky top-0 z-40 mx-auto sm:px-16 md:px-20 lg:px-32">
    <template #start>
      <RouterLink
        :to="{ name: RouteNameConstants.HOME }"
        class="mr-2 flex flex-shrink-0 items-center"
      >
        <img class="aspect-square w-12" src="/icon.png" />
      </RouterLink>
    </template>
    <template #item="{ item, props, hasSubmenu }">
      <RouterLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
        <a :href="href" v-bind="props.action" @click="navigate">
          <span :class="item.icon"></span>
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </RouterLink>
      <a v-else :href="item.url" :target="item.target" v-bind="props.action">
        <span :class="item.icon"></span>
        <span class="ml-2">{{ item.label }}</span>
        <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2"></span>
      </a>
    </template>
    <template #end>
      <div class="flex items-center gap-2">
        <AppThemeToggle />
        <Button
          icon="pi pi-twitch"
          :label="user.isLoggedIn ? 'Logout' : 'Login'"
          size="small"
          @click="() => handleAuthButtonClick()"
        >
        </Button>
      </div>
    </template>
  </Menubar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Menubar } from '@cq/ui'
import { useUser } from '@/stores/user'
import { RouteNameConstants, routes, toAllowedMenuItems } from '@/router'
import AppThemeToggle from '@/components/AppThemeToggle.vue'

const user = useUser()
const router = useRouter()

const items = computed(() => toAllowedMenuItems(routes, true))

async function handleAuthButtonClick() {
  if (user.isLoggedIn) {
    user.logout()
    await router.push({ name: RouteNameConstants.HOME })
  } else {
    user.redirect()
  }
}
</script>
