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
        <v-input type="text" required @keydown.space.prevent maxlength="3" v-model="formSettings.chatCommandPrefix" />
      </v-form-group>
      <v-form-group label="Send bot messages in chat?" class="w-full flex justify-between pr-2">
        <v-switch v-model="formSettings.sendMessagesInChat" />
      </v-form-group>
      <v-form-group v-if="formSettings.sendMessagesInChat" label="Queue open message:">
        <v-textarea required minlength="3" maxlength="500" v-model="formSettings.queueOpenMessage" />
      </v-form-group>
      <v-form-group v-if="formSettings.sendMessagesInChat" label="Queue close message:">
        <v-textarea required minlength="3" maxlength="500" v-model="formSettings.queueCloseMessage" />
      </v-form-group>
      <v-form-group>
        <v-button class="mr-2" type="submit" :disabled="formNotChanged">Save</v-button>
        <v-button class="mb-2" type="reset" variant="danger" :disabled="formNotChanged">Cancel</v-button>
      </v-form-group>
      <v-alert v-if="showSaveMsg" variant="success"> Save successful </v-alert>
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
    formSettings.value.chatCommandPrefix === settings.current.chatCommandPrefix &&
    formSettings.value.sendMessagesInChat === settings.current.sendMessagesInChat &&
    formSettings.value.queueOpenMessage === settings.current.queueOpenMessage &&
    formSettings.value.queueCloseMessage === settings.current.queueCloseMessage
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
