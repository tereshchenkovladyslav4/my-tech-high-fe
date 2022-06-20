export type CalendarProps = {
  date: string | Date | undefined
  label: string
  handleChange: (value: Date | null) => void
}
