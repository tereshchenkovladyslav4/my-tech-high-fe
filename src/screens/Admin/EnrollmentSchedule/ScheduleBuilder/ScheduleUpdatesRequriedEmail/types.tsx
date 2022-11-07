export type ScheduleUpdatesRequiredEmailProps = {
  handleCancelAction: () => void
  handleSendAction: (from: string, subject: string, body: string) => void
}
