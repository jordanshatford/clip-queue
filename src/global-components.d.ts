import Button from 'primevue/button'
import Card from 'primevue/card'
import Chips from 'primevue/chips'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import DataTable from 'primevue/datatable'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import MultiSelect from 'primevue/multiselect'
import Panel from 'primevue/panel'
import TabMenu from 'primevue/tabmenu'
import Toast from 'primevue/toast'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    BButton: typeof Button
    CCard: typeof Card
    ConfirmDialog: typeof ConfirmDialog
    DataTable: typeof DataTable
    DataTableColumn: typeof Column
    InputChips: typeof Chips
    InputNumber: typeof InputNumber
    InputSwitch: typeof InputSwitch
    InputText: typeof InputText
    MessageAlert: typeof Message
    MultiSelect: typeof MultiSelect
    PPanel: typeof Panel
    TabMenu: typeof TabMenu
    TToast: typeof Toast
  }
}
