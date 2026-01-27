export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    },
    toast: {
      variants: {
        color: {
          success: {
            root: 'bg-green-100 dark:bg-green-950 focus-visible:ring-success',
            icon: 'text-success'
          },
          error: {
            root: 'bg-red-100 dark:bg-red-950 focus-visible:ring-error',
            icon: 'text-error'
          }
          // Add others as needed
        }
      }
    },
    navigationMenu: {
      compoundVariants: [
        {
          variant: 'pill',
          active: true,
          highlight: false,
          class: {
            link: 'before:bg-elevated bg-white text-gray-950',
            linkLeadingIcon: 'text-gray-950'
          }
        },
        {
          disabled: false,
          active: false,
          variant: 'pill',
          class: {
            link: [
              'hover:text-highlighted text-gray-800 hover:bg-primary/20',
              'transition-colors'
            ],
            linkLeadingIcon: [
              'group-hover:text-default text-gray-800',
              'transition-colors'
            ]
          }
        }
      ]
    }
  }
})
