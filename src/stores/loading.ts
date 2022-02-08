import { reactive } from "vue"
import config from "@/assets/config"

const { availableSubreddits } = config.Reddit
const availableSubredditsLoading = availableSubreddits.reduce((ac, a) => ({ ...ac, [a]: false }), {})

const loadingObj: Record<string, boolean> = { ...availableSubredditsLoading }
const state = reactive<Record<string, boolean>>(loadingObj)

function setLoading(name: string, value: boolean): void {
  state[name] = value
}

export const loading = {
  state,
  setLoading,
}
