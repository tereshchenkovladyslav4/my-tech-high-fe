export type ApplicationModalProps = {
  title?: string
  subtitle?: string
  btntitle?: string
  handleModem: () => void
  handleSubmit: (data: unknown) => void
  data: unknown
  schoolYears?: unknown[]
  handleRefetch: () => void
}

export type ApplicationEmailModalProps = {
  handleModem: () => void
  data: unknown[]
  handleSubmit: () => void
}
