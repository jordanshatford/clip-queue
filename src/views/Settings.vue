<template>
  <div class="text-center">
    <p class="text-5xl font-extrabold text-purple-500 p-5">Settings</p>
    <form
      @submit.prevent="onSubmit"
      @reset="onReset"
      :key="formKey"
      class="bg-gray-100 dark:bg-gray-800 w-full max-w-lg mx-auto rounded-lg shadow-md p-2"
    >
      <v-form-group label="Chat command prefix:">
        <v-input type="text" required @keydown.space.prevent maxlength="3" v-model="formSettings.commandPrefix" />
      </v-form-group>
      <v-form-group label="Send bot messages in chat?" class="w-full flex justify-between pr-2">
        <v-switch id="sendMsgsInChat" v-model="formSettings.sendMsgsInChat" />
      </v-form-group>
      <div v-if="formSettings.sendMsgsInChat">
        <v-form-group label="Queue open message" class="w-full flex justify-between pr-2 pb-0">
          <v-switch id="sendQueueOpenMsg" v-model="formSettings.sendQueueOpenMsg" />
        </v-form-group>
        <v-form-group v-if="formSettings.sendQueueOpenMsg" class="pt-0">
          <v-textarea required minlength="3" maxlength="500" v-model="formSettings.queueOpenMsg" />
        </v-form-group>
        <v-form-group label="Queue close message" class="w-full flex justify-between pr-2 pb-0">
          <v-switch id="sendQueueCloseMsg" v-model="formSettings.sendQueueCloseMsg" />
        </v-form-group>
        <v-form-group v-if="formSettings.sendQueueCloseMsg" class="pt-0">
          <v-textarea required minlength="3" maxlength="500" v-model="formSettings.queueCloseMsg" />
        </v-form-group>
        <v-form-group label="Current clip message" class="w-full flex justify-between pr-2 pb-0">
          <v-switch id="sendCurrentClipMsg" v-model="formSettings.sendCurrentClipMsg" />
        </v-form-group>
        <div v-if="formSettings.sendCurrentClipMsg">
          <div class="text-left text-sm pl-1 mb-2 text-gray-400 dark:text-gray-500">
            <label> The following will be replaced in the message sent to chat: </label>
            <ul class="list-disc pl-8">
              <li>{url} : url of the clip</li>
              <li>{title} : title of the clip</li>
              <li>{channel} : channel the clip is of</li>
              <li>{game} : game in the clip</li>
              <li>{submitter} : chatter who submitted the clip (or reddit poster)</li>
            </ul>
          </div>
          <v-form-group class="pt-0">
            <v-textarea required minlength="3" maxlength="500" v-model="formSettings.currentClipMsg" />
          </v-form-group>
        </div>
      </div>
      <v-form-group>
        <v-button class="mr-2" type="submit" :disabled="formNotChanged">Save</v-button>
        <v-button class="mb-2" type="reset" variant="danger" :disabled="formNotChanged">Cancel</v-button>
      </v-form-group>
      <v-alert v-if="showSaveMsg" variant="success">Save successful</v-alert>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { settings } from "@/stores/settings";
import type { Settings } from "@/interfaces/settings";

let showSaveMsg = ref(false);
let formKey = ref(1);
let formSettings = ref<Settings>(Object.assign({}, settings.current));

const formNotChanged = computed(() => {
  return (
    formSettings.value.commandPrefix === settings.current.commandPrefix &&
    formSettings.value.sendMsgsInChat === settings.current.sendMsgsInChat &&
    formSettings.value.sendQueueOpenMsg === settings.current.sendQueueOpenMsg &&
    formSettings.value.queueOpenMsg === settings.current.queueOpenMsg &&
    formSettings.value.sendQueueCloseMsg === settings.current.sendQueueCloseMsg &&
    formSettings.value.queueCloseMsg === settings.current.queueCloseMsg &&
    formSettings.value.sendCurrentClipMsg === settings.current.sendCurrentClipMsg &&
    formSettings.value.currentClipMsg === settings.current.currentClipMsg
  );
});

function hideMsg() {
  showSaveMsg.value = false;
}

function onReset() {
  formSettings.value = Object.assign({}, settings.current);
  formKey.value += 1;
}

function onSubmit() {
  showSaveMsg.value = true;
  setTimeout(hideMsg, 2000);
  settings.update(formSettings.value);
  onReset();
}
</script>
