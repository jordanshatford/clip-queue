import { config } from "@vue/test-utils"
import { beforeAll } from "vitest"

beforeAll(() => {
  config.global.stubs = [
    "router-view",
    "router-link",
    "v-icon",
    "v-input",
    "v-textarea",
    "v-switch",
    "v-alert",
    "v-form-group",
    "v-button",
    "v-progress-bar",
  ]
})
