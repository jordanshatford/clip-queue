export * from "./types"
import api from "./api"
import auth from "./auth"
export { default as TwitchChat } from "./chat"

export default {
  ...api,
  ...auth,
}
