export * from './types'
import api from './api'
import auth from './auth'
import utils from './utils'
export { default as TwitchChat } from './chat'

export default {
  ...api,
  ...auth,
  ...utils
}
