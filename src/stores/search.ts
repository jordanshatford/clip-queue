import { defineStore } from 'pinia'

export const useSearch = defineStore('search', {
  state: () => ({
    size: 50,
    term: '',
    loading: false
  })
})
