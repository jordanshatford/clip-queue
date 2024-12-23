import api from './api'
import auth from './auth'
import utils from './utils'

export * from './types'

export { default as TwitchChat } from './chat'

/**
 * Twitch logo SVG as a string.
 */
export const logo = `
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 2400 2800" style="enable-background:new 0 0 2400 2800;" xml:space="preserve">
    <title>Twitch</title>
    <style type="text/css">
      .st0{fill:#FFFFFF;}
      .st1{fill:#9146FF;}
    </style>
    <g>
      <polygon class="st0" points="2200,1300 1800,1700 1400,1700 1050,2050 1050,1700 600,1700 600,200 2200,200 	"/>
      <g>
        <g id="Layer_1-2">
          <path class="st1" d="M500,0L0,500v1800h600v500l500-500h400l900-900V0H500z M2200,1300l-400,400h-400l-350,350v-350H600V200h1600 V1300z"/>
          <rect x="1700" y="550" class="st1" width="200" height="600"/>
          <rect x="1150" y="550" class="st1" width="200" height="600"/>
        </g>
      </g>
    </g>
  </svg>
`

export default {
  logo,
  ...api,
  ...auth,
  ...utils
}
