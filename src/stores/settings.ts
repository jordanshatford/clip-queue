import { defineStore } from "pinia"
import { deepEqual } from "@/utils"

export interface Settings {
  allowCommands: boolean
  commandPrefix: string
}

export const DEFAULTS: Settings = {
  allowCommands: true,
  commandPrefix: "!cq",
}

export const useSettings = defineStore("settings", {
  persist: {
    key: "settings",
  },
  state: (): Settings => ({ ...DEFAULTS }),
  getters: {
    isModified: (state) => {
      return (settings: Settings) => {
        /* eslint-disable @typescript-eslint/no-explicit-any*/
        return !deepEqual((state as any).$state, settings)
      }
    },
  },
  actions: {
    update(settings: Settings) {
      this.$patch(settings)
    },
  },
})
