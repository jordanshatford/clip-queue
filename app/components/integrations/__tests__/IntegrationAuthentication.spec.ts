import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { authentication } from '@/integrations/twitch'

import IntegrationAuthentication from '../IntegrationAuthentication.vue'

describe('IntegrationAuthentication.vue', () => {
  const wrapper = shallowMount(IntegrationAuthentication, {
    props: {
      modelValue: authentication,
    },
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
