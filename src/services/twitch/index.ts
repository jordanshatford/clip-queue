export * from "./types"
import api from "./api"
import auth from "./auth"

export default {
  ...api,
  ...auth,
}
