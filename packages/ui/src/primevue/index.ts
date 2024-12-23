// PrimeVue styles
import './tailwind.css'
import './base.css'

// PrimeVue Plugins
export { default as PrimeVue } from 'primevue/config'
export { default as ConfirmationService } from 'primevue/confirmationservice'
export { default as ToastService } from 'primevue/toastservice'
export { default as Tooltip } from 'primevue/tooltip'

// PrimeVue Components
export { default as Button } from 'primevue/button'
export { default as Card } from 'primevue/card'
export { default as Chip } from 'primevue/chip'
export { default as Column } from 'primevue/column'
export { default as ConfirmDialog } from 'primevue/confirmdialog'
export { default as DataTable } from 'primevue/datatable'
export { default as Select } from 'primevue/select'
export { default as InputNumber } from 'primevue/inputnumber'
export { default as ToggleSwitch } from 'primevue/toggleswitch'
export { default as InputText } from 'primevue/inputtext'
export { default as IconField } from 'primevue/iconfield'
export { default as InputIcon } from 'primevue/inputicon'
export { default as InputGroup } from 'primevue/inputgroup'
export { default as InputGroupAddon } from 'primevue/inputgroupaddon'
export type { MenuItem } from 'primevue/menuitem'
export { default as Menubar } from 'primevue/menubar'
export { default as Message } from 'primevue/message'
export { default as MultiSelect } from 'primevue/multiselect'
export { default as Tab } from 'primevue/tab'
export { default as TabList } from 'primevue/tablist'
export { default as Tabs } from 'primevue/tabs'
export { default as Toast } from 'primevue/toast'

// PrimeVue Composables
export { useConfirm } from 'primevue/useconfirm'
export { useToast } from 'primevue/usetoast'

// Color Palettes
export { type ColorName, type ColorOption, colors, surfaces, setColorPalette } from './palettes'
