import { FunctionComponent, ReactNode } from 'react'

type DataRowProps = {
  label: ReactNode
  value: ReactNode
  backgroundColor?: string
}

export type DataRowTemplateType = FunctionComponent<DataRowProps>
