<template>
  <p class="cq-title">Settings</p>
  <SettingsTabs v-model="selectedTab" :options="tabOptions" />
  <ChatSettings v-if="selectedTab === TabOption.Chat" />
  <QueueSettings v-else-if="selectedTab === TabOption.Queue" />
  <OtherSettings v-else-if="selectedTab === TabOption.Other" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { ChatBubbleLeftRightIcon, Cog8ToothIcon, QueueListIcon } from "@heroicons/vue/24/outline"
import SettingsTabs from "@/components/SettingsTabs.vue"
import ChatSettings from "@/components/settings/ChatSettings.vue"
import QueueSettings from "@/components/settings/QueueSettings.vue"
import OtherSettings from "@/components/settings/OtherSettings.vue"

enum TabOption {
  Chat = "Chat",
  Queue = "Queue",
  Other = "Other",
}

const tabOptions = [
  {
    label: TabOption.Chat,
    icon: ChatBubbleLeftRightIcon,
  },
  {
    label: TabOption.Queue,
    icon: QueueListIcon,
  },
  {
    label: TabOption.Other,
    icon: Cog8ToothIcon,
  },
]
const selectedTab = ref(tabOptions[0].label)
</script>
