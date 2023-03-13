import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import BaseTable from '../BaseTable.vue'

describe('BaseTable.vue', () => {
  const wrapper = shallowMount(BaseTable, {
    props: {
      columns: [{ key: 'test', title: 'Test' }],
      rows: [{ test: 'Something' }]
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
