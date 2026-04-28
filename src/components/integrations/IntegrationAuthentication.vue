<template>
  <Message size="small" severity="secondary" variant="simple">
    {{ m.authentication_for_integration() }}
  </Message>
  <Chip :label="authentication?.user?.name" :image="authentication?.user?.profileImageURL" />
</template>

<script setup lang="ts">
import Chip from 'primevue/chip'
import Message from 'primevue/message'

import type { IntegrationAuthentication } from '@/integrations/common'

import { m } from '@/paraglide/messages'

interface Props {
  authentication: IntegrationAuthentication
}

const { authentication } = defineProps<Props>()
</script>
