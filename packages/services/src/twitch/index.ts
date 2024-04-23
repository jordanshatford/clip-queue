import api from './api'
import auth from './auth'
import utils from './utils'

export * from './types'

export { default as TwitchChat } from './chat'

export default {
  ...api,
  ...auth,
  ...utils
}
