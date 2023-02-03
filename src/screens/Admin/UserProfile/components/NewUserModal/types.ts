export type NewModalProps = {
  visible: boolean
  handleModem: (status?: boolean) => void
  students?: unknown[]
  data?: unknown
  ParentEmailValue: string
}

export interface ApolloError {
  title: string
  severity: string
  flag: boolean
}
