import { FunctionComponent, ReactNode } from 'react'

type TableProps = {
  tableHeaders?: Array<string>
  tableBody: Array<Record<string | number, string | number | ReactNode>>
}

export type TableTemplateType = FunctionComponent<TableProps>
