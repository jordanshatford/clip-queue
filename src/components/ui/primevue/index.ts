// PrimeVue styles
import './tailwind.css'
import './base.css'

// PrimeVue Plugins
export { default as PrimeVue } from 'primevue/config'
export { default as ConfirmationService } from 'primevue/confirmationservice'
export { default as ToastService } from 'primevue/toastservice'
export { default as Tooltip } from 'primevue/tooltip'

// PrimeVue Components
export { default as Column } from 'primevue/column'

// PrimeVue Composables
export { useConfirm } from 'primevue/useconfirm'
export { useToast } from 'primevue/usetoast'

// Color Palettes
export { type ColorName, type ColorOption, colors, surfaces, setColorPalette } from './palettes'
