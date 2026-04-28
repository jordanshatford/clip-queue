<template>
  <Message size="small" severity="secondary" variant="simple"
    >The following is the current authentication for the integration.</Message
  >
  <Chip :label="authentication?.user?.name" :image="authentication?.user?.profileImageURL" />
</template>

<script setup lang="ts">
import Chip from 'primevue/chip'
import Message from 'primevue/message'

import type { IntegrationAuthentication } from '@/integrations/common'

interface Props {
  authentication: IntegrationAuthentication
}

const { authentication } = defineProps<Props>()
</script>
