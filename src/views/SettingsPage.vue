<template>
  <p class="cq-title">Settings</p>
  <SettingsTabs v-model="selectedTab" :options="tabOptions" />
  <div v-if="selectedTab === TabOption.Chat">
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
      <div v-if="formSettings.allowCommands">
        <label class="cq-form-group-label">Chat command prefix:</label>
        <BaseInput type="text" required @keydown.space.prevent maxlength="8" v-model="formSettings.commandPrefix" />
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
          <BaseSwitch id="autoRemoveClips" v-model="formSettings.autoRemoveClips" />
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
        <BaseSwitch id="sendMsgsInChat" v-model="formSettings.sendMsgsInChat" />
      </div>
      <div v-if="formSettings.sendMsgsInChat">
        <div class="cq-toggle-form-group">
          <label class="cq-form-group-label">Queue open message</label>
          <BaseSwitch id="sendQueueOpenMsg" v-model="formSettings.sendQueueOpenMsg" />
        </div>
        <div v-if="formSettings.sendQueueOpenMsg" class="cq-form-group pt-0">
          <BaseTextArea required minlength="3" maxlength="500" v-model="formSettings.queueOpenMsg" />
        </div>
        <div class="cq-toggle-form-group">
          <label class="cq-form-group-label">Queue close message</label>
          <BaseSwitch id="sendQueueCloseMsg" v-model="formSettings.sendQueueCloseMsg" />
        </div>
        <div v-if="formSettings.sendQueueCloseMsg" class="cq-form-group pt-0">
          <BaseTextArea required minlength="3" maxlength="500" v-model="formSettings.queueCloseMsg" />
        </div>
        <div class="cq-toggle-form-group">
          <label class="cq-form-group-label">Current clip message</label>
          <BaseSwitch id="sendCurrentClipMsg" v-model="formSettings.sendCurrentClipMsg" />
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
            <BaseTextArea required minlength="3" maxlength="500" v-model="formSettings.currentClipMsg" />
          </div>
        </div>
      </div>
      <div class="mt-2">
        <BaseButton class="mr-2" type="submit" :disabled="!settings.isModified(formSettings)">Save</BaseButton>
        <BaseButton type="reset" variant="danger" :disabled="!settings.isModified(formSettings)">Cancel</BaseButton>
      </div>
      <BaseAlert v-if="showSaveMsg" variant="success" class="mt-2">Save successful</BaseAlert>
    </form>
  </div>
  <div v-else-if="selectedTab === TabOption.Queue">
    <form @submit.prevent="onSubmitQSettings" @reset="onResetQSettings" :key="formKey" class="cq-form">
      <div class="cq-toggle-form-group">
        <label class="cq-form-group-label">Limit Queue Size?</label>
        <BaseSwitch id="allowCommands" v-model="formQueueSettings.isLimited" />
      </div>
      <div>
        <label class="cq-form-group-label">Limit:</label>
        <BaseInput
          type="number"
          required
          :min="1"
          v-model="formQueueSettings.limit"
          :disabled="!formQueueSettings.isLimited"
        />
        <div class="cq-text-subtle text-left pl-1 my-2">
          <label>Clips will be ignored when queue limit is reached.</label>
        </div>
      </div>
      <div class="mt-3">
        <BaseButton class="mr-2" type="submit" :disabled="!isQueueSettingsModified">Save</BaseButton>
        <BaseButton type="reset" variant="danger" :disabled="!isQueueSettingsModified">Cancel</BaseButton>
      </div>
      <BaseAlert v-if="showSaveMsg" variant="success" class="mt-2">Save successful</BaseAlert>
    </form>
  </div>
  <div v-else-if="selectedTab === TabOption.Other">
    <div class="cq-form mb-2">
      <BaseButton
        class="w-full"
        variant="danger"
        :disabled="!settings.isModified(DEFAULT_SETTING)"
        @click="resetSettingsToDefault()"
      >
        Reset Settings
      </BaseButton>
      <label class="cq-text-subtle"> Reset settings back to their initial values. </label>
    </div>
    <div class="cq-form mt-2">
      <BaseButton class="w-full" variant="danger" :disabled="queue.history.empty()" @click="queue.purge()">
        Purge History
      </BaseButton>
      <label class="cq-text-subtle">Purge all clips previously viewed allowing them to be resubmitted.</label>
    </div>
    <div class="cq-form mt-2">
      <BaseButton class="w-full" variant="danger" :disabled="clipFinder.cacheEmpty" @click="clipFinder.$reset()">
        Purge Cache
      </BaseButton>
      <label class="cq-text-subtle">
        Twitch clips submitted are cached for future use, this clears all cached clip information.
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { ChatBubbleLeftRightIcon, Cog8ToothIcon, QueueListIcon } from "@heroicons/vue/24/outline"
import { useSettings, type Settings, DEFAULT_SETTING } from "@/stores/settings"
import { useQueue } from "@/stores/queue"
import { useUser } from "@/stores/user"
import { useClipFinder } from "@/stores/clip-finder"
import commands from "@/utils/commands"
import SettingsTabs from "@/components/SettingsTabs.vue"

const user = useUser()
const queue = useQueue()
const settings = useSettings()
const clipFinder = useClipFinder()

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

const showSaveMsg = ref(false)
const formKey = ref(1)
const formSettings = ref<Settings>(Object.assign({}, settings.$state))
const formQueueSettings = ref({ isLimited: queue.upcoming.limit !== null, limit: queue.upcoming.limit })

const isQueueSettingsModified = computed<boolean>(() => {
  const sameLimitValue = queue.upcoming.limit === formQueueSettings.value.limit
  const sameBeingLimited =
    (queue.upcoming.limit !== null && formQueueSettings.value.isLimited) ||
    (queue.upcoming.limit === null && !formQueueSettings.value.isLimited)
  if (sameLimitValue && sameBeingLimited) {
    return false
  }
  return true
})

function hideMsg() {
  showSaveMsg.value = false
}

function resetSettingsToDefault() {
  settings.update(DEFAULT_SETTING)
  onReset()
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

function onResetQSettings() {
  formQueueSettings.value = Object.assign({}, { isLimited: queue.upcoming.limit !== null, limit: queue.upcoming.limit })
  formKey.value += 1
}

function onSubmitQSettings() {
  showSaveMsg.value = true
  setTimeout(hideMsg, 2000)
  if (formQueueSettings.value.isLimited) {
    queue.upcoming.limit = formQueueSettings.value.limit
  } else {
    queue.upcoming.limit = null
  }
  onResetQSettings()
}
</script>
