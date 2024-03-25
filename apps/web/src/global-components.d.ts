import {
  Button,
  Card,
  Column,
  ConfirmDialog,
  DataTable,
  InputNumber,
  InputSwitch,
  InputText,
  Message,
  MultiSelect,
  TabMenu,
  Toast
} from '@cq/ui'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    BButton: typeof Button
    CCard: typeof Card
    ConfirmDialog: typeof ConfirmDialog
    DataTable: typeof DataTable
    DataTableColumn: typeof Column
    InputNumber: typeof InputNumber
    InputSwitch: typeof InputSwitch
    InputText: typeof InputText
    MessageAlert: typeof Message
    MultiSelect: typeof MultiSelect
    TabMenu: typeof TabMenu
    TToast: typeof Toast
  }
}
