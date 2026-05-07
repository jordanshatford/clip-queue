<template>
  <div class="flex items-center gap-2">
    <Button
      v-if="!user.isLoggedIn"
      icon="pi pi-twitch"
      :label="m.login()"
      size="small"
      @click="() => user.redirect()"
    >
    </Button>
    <Button
      v-else
      @click="toggleMenu"
      variant="text"
      class="flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-surface-100 dark:hover:bg-surface-800"
    >
      <Avatar :image="user.details?.profileImageURL" shape="circle" />
      <span class="text-sm font-medium">{{ user.details?.name }}</span>
      <i class="pi pi-chevron-down text-xs"></i>
    </Button>
    <Menu ref="menu" :model="items" popup>
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </template>
    </Menu>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'

import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import { useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

import { m } from '@/paraglide/messages'
import { useUser } from '@/stores/user'

const router = useRouter()

const menu = useTemplateRef<InstanceType<typeof Menu>>('menu')

const user = useUser()

const items: MenuItem[] = [
  {
    label: m.logout(),
    icon: 'pi pi-sign-out',
    command: async () => {
      await user.logout()
      await router.push('/')
    },
  },
]

function toggleMenu(event: PointerEvent): void {
  menu.value?.toggle(event)
}
</script>
