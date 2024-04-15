import button from './button'
import card from './card'
import datatable from './datatable'
import dialog from './dialog'
import dropdown from './dropdown'
import global from './global'
import inputnumber from './inputnumber'
import inputswitch from './inputswitch'
import inputtext from './inputtext'
import message from './message'
import multiselect from './multiselect'
import paginator from './paginator'
import ripple from './ripple'
import tabmenu from './tabmenu'
import toast from './toast'
import tooltip from './tooltip'

export default {
  global,
  directives: {
    ripple,
    tooltip
  },

  //forms
  dropdown,
  inputnumber,
  inputtext,
  inputswitch,
  multiselect,

  //buttons
  button,

  //data
  paginator,
  datatable,

  //panels
  card,

  //file

  //menu
  tabmenu,

  //overlays
  dialog,

  //messages
  message,
  toast

  //media

  //misc
}
