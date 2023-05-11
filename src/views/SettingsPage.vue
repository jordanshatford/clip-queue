<template>
  <p class="cq-title">Settings</p>
  <BaseTabs v-model="selectedTab" :options="tabOptions" />
  <component :is="selectedView as any" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ChatBubbleLeftRightIcon,
  Cog8ToothIcon,
  HandRaisedIcon,
  QueueListIcon
} from '@/assets/icons'
import ChatSettings from '@/components/settings/ChatSettings.vue'
import QueueSettings from '@/components/settings/QueueSettings.vue'
import ModerationSettings from '@/components/settings/ModerationSettings.vue'
import OtherSettings from '@/components/settings/OtherSettings.vue'

enum TabOption {
  CHAT = 'Chat',
  QUEUE = 'Queue',
  MODERATION = 'Moderation',
  OTHER = 'Other'
}

const tabOptions = [
  {
    label: TabOption.CHAT,
    icon: ChatBubbleLeftRightIcon,
    view: ChatSettings
  },
  {
    label: TabOption.QUEUE,
    icon: QueueListIcon,
    view: QueueSettings
  },
  {
    label: TabOption.MODERATION,
    icon: HandRaisedIcon,
    view: ModerationSettings
  },
  {
    label: TabOption.OTHER,
    icon: Cog8ToothIcon,
    view: OtherSettings
  }
]
const selectedTab = ref(tabOptions[0].label)

const selectedView = computed(() => {
  return tabOptions.find((t) => t.label === selectedTab.value)?.view
})
</script>
