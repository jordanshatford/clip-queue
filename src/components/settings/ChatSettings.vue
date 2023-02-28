<template>
  <div>
    <div class="cq-form mb-2">
      <div class="cq-form-group mb-1">
        <label class="cq-form-group-label">Current in chat of:</label>
        <BaseInput type="text" disabled v-model="user.username" />
      </div>
    </div>
    <form @submit.prevent="onSubmit" @reset="onReset" :key="formKey" class="cq-form">
      <div class="cq-toggle-form-group">
        <label class="cq-form-group-label">Allow chat commands?</label>
        <BaseSwitch id="allowCommands" v-model="formSettings.allowCommands" />
      </div>
      <div>
        <label class="cq-form-group-label">Chat command prefix:</label>
        <BaseInput
          type="text"
          required
          @keydown.space.prevent
          maxlength="8"
          :disabled="!formSettings.allowCommands"
          v-model="formSettings.commandPrefix"
        />
        <div class="cq-text-subtle text-left pl-1 my-2">
          <label>The following commands are available to mods: </label>
          <ul class="list-disc pl-8">
            <li v-for="(item, key) in commands.help" :key="key">
              <span class="cq-text-subtle-semibold">{{ `${settings.commandPrefix}${key}` }}</span
              >: {{ item }}
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-3">
        <BaseButton class="mr-2" type="submit" :disabled="!settings.isModified(formSettings)"
          >Save</BaseButton
        >
        <BaseButton type="reset" variant="danger" :disabled="!settings.isModified(formSettings)"
          >Cancel</BaseButton
        >
      </div>
      <BaseAlert v-if="showSaveMsg" variant="success" class="mt-2">Save successful</BaseAlert>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSettings, type Settings } from '@/stores/settings'
import { useUser } from '@/stores/user'
import commands from '@/utils/commands'
import { clone } from '@/utils'

const user = useUser()
const settings = useSettings()

const showSaveMsg = ref(false)
const formKey = ref(1)
const formSettings = ref<Settings>(clone<Settings>(settings.$state))

function hideMsg() {
  showSaveMsg.value = false
}

function onReset() {
  formSettings.value = clone<Settings>(settings.$state)
  formKey.value += 1
}

function onSubmit() {
  showSaveMsg.value = true
  setTimeout(hideMsg, 2000)
  settings.update(formSettings.value)
  onReset()
}
</script>
