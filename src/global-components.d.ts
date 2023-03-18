import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import BaseTag from '@/components/ui/BaseTag.vue'
import BaseTextArea from '@/components/ui/BaseTextArea.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseMultiTagSelect from '@/components/ui/BaseMultiTagSelect.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import BaseTable from '@/components/ui/BaseTable.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    BaseInput: typeof BaseInput
    BaseSwitch: typeof BaseSwitch
    BaseTabs: typeof BaseTabs
    BaseTag: typeof BaseTag
    BaseTextArea: typeof BaseTextArea
    BaseButton: typeof BaseButton
    BaseMultiTagSelect: typeof BaseMultiTagSelect
    BasePagination: typeof BasePagination
    BaseTable: typeof BaseTable
  }
}
