// PrimeVue styles
import './tailwind.css'
import './base.css'

// PrimeVue Plugins
export { default as PrimeVue } from 'primevue/config'
export { default as ConfirmationService } from 'primevue/confirmationservice'
export { default as ToastService } from 'primevue/toastservice'

// PrimeVue Components
export { default as Button } from 'primevue/button'
export { default as Card } from 'primevue/card'
export { default as Column } from 'primevue/column'
export { default as ConfirmDialog } from 'primevue/confirmdialog'
export { default as DataTable } from 'primevue/datatable'
export { default as Dropdown } from 'primevue/dropdown'
export { default as InputNumber } from 'primevue/inputnumber'
export { default as InputSwitch } from 'primevue/inputswitch'
export { default as InputText } from 'primevue/inputtext'
export type { MenuItem } from 'primevue/menuitem'
export { default as Menubar } from 'primevue/menubar'
export { default as Message } from 'primevue/message'
export { default as MultiSelect } from 'primevue/multiselect'
export { default as TabMenu } from 'primevue/tabmenu'
export { default as Toast } from 'primevue/toast'

// PrimeVue Composables
export { useConfirm } from 'primevue/useconfirm'
export { useToast } from 'primevue/usetoast'

// Color Palettes
export { type ColorOption, colors, surfaces, setColorPalette } from './palettes'
