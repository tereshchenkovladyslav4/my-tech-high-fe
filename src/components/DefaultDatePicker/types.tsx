export type DefaultDatePickerProps = {
  date?: string | Date | undefined
  label?: string
  format?: string
  handleChange: (value: string | Date | null) => void
}
