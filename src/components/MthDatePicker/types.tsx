export type MthDatePickerProps = {
  date: string | Date | undefined
  label: string
  dateFormat?: string
  minDate?: string | Date
  maxDate?: string | Date
  handleChange: (value: string | null) => void
}
