<template>
  <p class="cq-title">Settings</p>
  <BaseTabs v-model="selectedTab" :options="tabOptions" />
  <component :is="selectedView" />
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { ChatBubbleLeftRightIcon, Cog8ToothIcon, HandRaisedIcon, QueueListIcon } from "@heroicons/vue/24/outline"
import ChatSettings from "@/components/settings/ChatSettings.vue"
import QueueSettings from "@/components/settings/QueueSettings.vue"
import ModerationSettings from "@/components/settings/ModerationSettings.vue"
import OtherSettings from "@/components/settings/OtherSettings.vue"

enum TabOption {
  Chat = "Chat",
  Queue = "Queue",
  Moderation = "Moderation",
  Other = "Other",
}

const tabOptions = [
  {
    label: TabOption.Chat,
    icon: ChatBubbleLeftRightIcon,
    view: ChatSettings,
  },
  {
    label: TabOption.Queue,
    icon: QueueListIcon,
    view: QueueSettings,
  },
  {
    label: TabOption.Moderation,
    icon: HandRaisedIcon,
    view: ModerationSettings,
  },
  {
    label: TabOption.Other,
    icon: Cog8ToothIcon,
    view: OtherSettings,
  },
]
const selectedTab = ref(tabOptions[0].label)

const selectedView = computed(() => {
  return tabOptions.find((t) => t.label === selectedTab.value)?.view
})
</script>
