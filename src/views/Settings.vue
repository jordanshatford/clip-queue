<template>
  <p class="cq-title">Settings</p>
  <div class="cq-form mb-2">
    <v-button class="w-full" variant="danger" :disabled="queue.history.empty()" @click="queue.purge()">
      Purge History
    </v-button>
    <label class="cq-text-subtle">Purge all clips previously viewed allowing them to be resubmitted.</label>
  </div>
  <form @submit.prevent="onSubmit" @reset="onReset" :key="formKey" class="cq-form">
    <div class="cq-toggle-form-group">
      <label class="cq-form-group-label">Allow chat commands?</label>
      <v-switch id="allowCommands" v-model="formSettings.allowCommands" />
    </div>
    <div v-if="formSettings.allowCommands">
      <label class="cq-form-group-label">Chat command prefix:</label>
      <v-input type="text" required @keydown.space.prevent maxlength="8" v-model="formSettings.commandPrefix" />
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
    <div>
      <div class="cq-toggle-form-group">
        <label class="cq-form-group-label">Auto remove clips on moderation?</label>
        <v-switch id="autoRemoveClips" v-model="formSettings.autoRemoveClips" />
      </div>
      <div v-if="formSettings.autoRemoveClips" class="text-left pl-1 cq-text-subtle mb-2">
        <label>
          When a user has their chat message deleted, is timed out, or banned, then the clips they submitted will be
          removed.
        </label>
      </div>
    </div>
    <div class="cq-toggle-form-group">
      <label class="cq-form-group-label">Send bot messages in chat?</label>
      <v-switch id="sendMsgsInChat" v-model="formSettings.sendMsgsInChat" />
    </div>
    <div v-if="formSettings.sendMsgsInChat">
      <div class="cq-toggle-form-group">
        <label class="cq-form-group-label">Queue open message</label>
        <v-switch id="sendQueueOpenMsg" v-model="formSettings.sendQueueOpenMsg" />
      </div>
      <div v-if="formSettings.sendQueueOpenMsg" class="cq-form-group pt-0">
        <v-textarea required minlength="3" maxlength="500" v-model="formSettings.queueOpenMsg" />
      </div>
      <div class="cq-toggle-form-group">
        <label class="cq-form-group-label">Queue close message</label>
        <v-switch id="sendQueueCloseMsg" v-model="formSettings.sendQueueCloseMsg" />
      </div>
      <div v-if="formSettings.sendQueueCloseMsg" class="cq-form-group pt-0">
        <v-textarea required minlength="3" maxlength="500" v-model="formSettings.queueCloseMsg" />
      </div>
      <div class="cq-toggle-form-group">
        <label class="cq-form-group-label">Current clip message</label>
        <v-switch id="sendCurrentClipMsg" v-model="formSettings.sendCurrentClipMsg" />
      </div>
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
        <div class="cq-form-group pt-0">
          <v-textarea required minlength="3" maxlength="500" v-model="formSettings.currentClipMsg" />
        </div>
      </div>
    </div>
    <div class="mt-2">
      <v-button class="mr-2" type="submit" :disabled="!settings.isModified(formSettings)">Save</v-button>
      <v-button type="reset" variant="danger" :disabled="!settings.isModified(formSettings)">Cancel</v-button>
    </div>
    <v-alert v-if="showSaveMsg" variant="success">Save successful</v-alert>
  </form>
  <div class="cq-form mt-2">
    <v-button class="w-full" variant="danger" :disabled="clipFinder.cacheEmpty" @click="clipFinder.$reset()">
      Purge Cache
    </v-button>
    <label class="cq-text-subtle">
      Twitch clips submitted are cached for future use, this clears all cached clip information.
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useSettings, type Settings } from "@/stores/settings"
import { useQueue } from "@/stores/queue"
import { useClipFinder } from "@/stores/clip-finder"
import commands from "@/utils/commands"

const queue = useQueue()
const settings = useSettings()
const clipFinder = useClipFinder()

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
