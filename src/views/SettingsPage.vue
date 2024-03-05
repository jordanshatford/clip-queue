<template>
  <p class="cq-title">Settings</p>
  <div class="mx-auto mb-3 max-w-xl">
    <TabMenu v-model:activeIndex="activeTabIndex" :model="tabs" />
  </div>
  <component :is="activeTabView" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ChatSettings from '@/components/settings/ChatSettings.vue'
import QueueSettings from '@/components/settings/QueueSettings.vue'
import ModerationSettings from '@/components/settings/ModerationSettings.vue'
import OtherSettings from '@/components/settings/OtherSettings.vue'

const tabs = ref([
  { label: 'Chat', icon: 'pi pi-comments', view: ChatSettings },
  { label: 'Queue', icon: 'pi pi-list', view: QueueSettings },
  { label: 'Moderation', icon: 'pi pi-flag', view: ModerationSettings },
  { label: 'Other', icon: 'pi pi-cog', view: OtherSettings }
])

const activeTabIndex = ref<number>(0)

const activeTabView = computed(() => {
  return tabs.value[activeTabIndex.value].view
})
</script>
