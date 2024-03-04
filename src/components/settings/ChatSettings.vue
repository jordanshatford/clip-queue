<template>
  <div>
    <div class="cq-form mb-2">
      <div class="cq-form-group mb-1">
        <label class="cq-form-group-label">Current in chat of:</label>
        <BaseInput type="text" disabled v-model="user.ctx.username" />
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
        <div class="cq-text-subtle my-2 pl-1 text-left">
          <label>The following commands are available to mods: </label>
          <ul class="list-disc pl-8">
            <li v-for="(help, command) in commands.help" :key="command">
              <code class="cq-text-subtle-semibold"
                >{{ `${settings.commandPrefix}${command}` }}{{ help.args?.length > 0 ? ' ' : ''
                }}{{ help.args?.map((arg) => `<${arg}>`).join(' ') }}</code
              >: {{ help.description }}
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
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useSettings, type Settings } from '@/stores/settings'
import { useUser } from '@/stores/user'
import commands from '@/utils/commands'
import { clone } from '@/utils'

const toast = useToast()
const user = useUser()
const settings = useSettings()

const formKey = ref(1)
const formSettings = ref<Settings>(clone<Settings>(settings.$state))

function onReset() {
  formSettings.value = clone<Settings>(settings.$state)
  formKey.value += 1
}

function onSubmit() {
  settings.update(formSettings.value)
  toast.success('Chat settings saved')
  onReset()
}
</script>
