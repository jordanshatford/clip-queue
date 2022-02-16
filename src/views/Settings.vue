<template>
  <p class="cq-title">Settings</p>
  <div class="cq-card mx-auto p-2 max-w-lg mb-2">
    <v-formgroup>
      <v-button class="w-full" variant="danger" :disabled="queue.history.empty()" @click="queue.purge()">
        Purge History
      </v-button>
      <label class="cq-text-subtle">Purge all clips previously viewed allowing them to be resubmitted.</label>
    </v-formgroup>
  </div>
  <form @submit.prevent="onSubmit" @reset="onReset" :key="formKey">
    <div class="cq-card mx-auto p-2 max-w-lg">
      <v-formgroup label="Allow chat commands?" class="w-full flex justify-between pr-2 pb-0">
        <v-switch id="allowCommands" v-model="formSettings.allowCommands" />
      </v-formgroup>
      <v-formgroup v-if="formSettings.allowCommands" label="Chat command prefix:">
        <v-input type="text" required @keydown.space.prevent maxlength="8" v-model="formSettings.commandPrefix" />
        <div class="text-left pl-1 my-2 cq-text-subtle">
          <label>The following commands are available to mods: </label>
          <ul class="list-disc pl-8">
            <li v-for="(item, key) in commands.help" :key="key">
              <span class="cq-text-subtle-semibold">{{ `${settings.commandPrefix}${key}` }}</span
              >: {{ item }}
            </li>
          </ul>
        </div>
      </v-formgroup>
      <div>
        <v-formgroup label="Auto remove clips on moderation?" class="w-full flex justify-between pr-2 pb-0">
          <v-switch id="autoRemoveClips" v-model="formSettings.autoRemoveClips" />
        </v-formgroup>
        <div v-if="formSettings.autoRemoveClips" class="text-left pl-1 cq-text-subtle mb-2">
          <label>
            When a user has their chat message deleted, is timed out, or banned, then the clips they submitted will be
            removed.
          </label>
        </div>
      </div>
      <v-formgroup label="Send bot messages in chat?" class="w-full flex justify-between pr-2">
        <v-switch id="sendMsgsInChat" v-model="formSettings.sendMsgsInChat" />
      </v-formgroup>
      <div v-if="formSettings.sendMsgsInChat">
        <v-formgroup label="Queue open message" class="w-full flex justify-between pr-2 pb-0">
          <v-switch id="sendQueueOpenMsg" v-model="formSettings.sendQueueOpenMsg" />
        </v-formgroup>
        <v-formgroup v-if="formSettings.sendQueueOpenMsg" class="pt-0">
          <v-textarea required minlength="3" maxlength="500" v-model="formSettings.queueOpenMsg" />
        </v-formgroup>
        <v-formgroup label="Queue close message" class="w-full flex justify-between pr-2 pb-0">
          <v-switch id="sendQueueCloseMsg" v-model="formSettings.sendQueueCloseMsg" />
        </v-formgroup>
        <v-formgroup v-if="formSettings.sendQueueCloseMsg" class="pt-0">
          <v-textarea required minlength="3" maxlength="500" v-model="formSettings.queueCloseMsg" />
        </v-formgroup>
        <v-formgroup label="Current clip message" class="w-full flex justify-between pr-2 pb-0">
          <v-switch id="sendCurrentClipMsg" v-model="formSettings.sendCurrentClipMsg" />
        </v-formgroup>
        <div v-if="formSettings.sendCurrentClipMsg">
          <div class="text-left pl-1 mb-2 cq-text-subtle">
            <label>The following will be replaced in the message sent to chat:</label>
            <ul class="list-disc pl-8">
              <li><span class="cq-text-subtle-semibold">{url}</span>: url of the clip</li>
              <li><span class="cq-text-subtle-semibold">{title}</span>: title of the clip</li>
              <li><span class="cq-text-subtle-semibold">{channel}</span>: channel the clip is of</li>
              <li><span class="cq-text-subtle-semibold">{game}</span>: game in the clip</li>
              <li>
                <span class="cq-text-subtle-semibold">{submitter}</span>: chatter who submitted the clip (or reddit
                poster)
              </li>
            </ul>
          </div>
          <v-formgroup class="pt-0">
            <v-textarea required minlength="3" maxlength="500" v-model="formSettings.currentClipMsg" />
          </v-formgroup>
        </div>
      </div>
      <v-formgroup>
        <v-button class="mr-2" type="submit" :disabled="!settings.isModified(formSettings)">Save</v-button>
        <v-button class="mb-2" type="reset" variant="danger" :disabled="!settings.isModified(formSettings)"
          >Cancel</v-button
        >
      </v-formgroup>
      <v-alert v-if="showSaveMsg" variant="success">Save successful</v-alert>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useSettings, type Settings } from "@/stores/settings"
import { useQueue } from "@/stores/queue"
import commands from "@/utils/commands"

const queue = useQueue()
const settings = useSettings()

let showSaveMsg = ref(false)
let formKey = ref(1)
let formSettings = ref<Settings>(Object.assign({}, settings.$state))

function hideMsg() {
  showSaveMsg.value = false
}

function onReset() {
  formSettings.value = Object.assign({}, settings.$state)
  formKey.value += 1
}

function onSubmit() {
  showSaveMsg.value = true
  setTimeout(hideMsg, 2000)
  settings.update(formSettings.value)
  onReset()
}
</script>
