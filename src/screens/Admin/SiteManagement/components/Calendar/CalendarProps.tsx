export type CalendarProps = {
  date: string | Date | undefined
  label: string
  minDate?: Date | undefined
  maxDate?: Date | undefined
  handleChange: (value: Date | null) => void
}
