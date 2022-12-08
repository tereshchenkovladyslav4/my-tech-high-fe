export type MthTimePickerProps = {
  time?: string | Date | undefined
  label?: string
  size?: 'small' | 'medium' | undefined
  handleChange: (value: string | null) => void
}
