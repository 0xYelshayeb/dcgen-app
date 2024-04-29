import { colors } from './colors'

export const Checkbox = {
  baseStyle: ({ colorMode }: { colorMode: string }) => ({
    icon: {
      color: colors.icWhite,
    },
    control: {
      border: '1px',
      borderColor: colorMode === 'dark' ? colors.icWhite : colors.black,
      borderRadius: '8px',
    },
    label: {
      color: colorMode === 'dark' ? colors.icWhite : colors.black,
    },
  }),
}
