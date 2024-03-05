import Button from 'primevue/button'
import Chips from 'primevue/chips'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import TabMenu from 'primevue/tabmenu'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    BButton: typeof Button
    DataTable: typeof DataTable
    DataTableColumn: typeof Column
    InputChips: typeof Chips
    InputNumber: typeof InputNumber
    InputSwitch: typeof InputSwitch
    InputText: typeof InputText
    MultiSelect: typeof MultiSelect
    TabMenu: typeof TabMenu
  }
}
