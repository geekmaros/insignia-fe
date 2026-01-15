export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
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
