export default {
  root: {
    class: [
      //Shape
      'rounded-md',
      'shadow-md',

      //Color
      'bg-surface-100 dark:bg-surface-800',
      'text-surface-700 dark:text-surface-0'
    ]
  },
  body: {
    class: 'p-3'
  },
  title: {
    class: 'text-base font-bold mb-1'
  },
  subtitle: {
    class: [
      //Font
      'font-normal',

      //Spacing
      'mb-1',

      //Color
      'text-surface-600 dark:text-surface-0/60'
    ]
  },
  content: {
    class: 'py-2' // Vertical padding.
  },
  footer: {
    class: 'pt-2' // Top padding.
  }
}
