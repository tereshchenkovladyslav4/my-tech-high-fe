export type UpdatesRequiredEmailProps = {
  emailFrom: string
  emailBody: string
  emailSubject: string
  setEmailFrom: (value: string) => void
  setEmailBody: (value: string) => void
  setEmailSubject: (value: string) => void
  handleCancelAction: () => void
  handleSendAction: (from: string, subject: string, body: string) => void
}
