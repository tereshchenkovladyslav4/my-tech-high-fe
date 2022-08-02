import { FunctionComponent } from 'react'

type Account = {
  handleIsFormChange: () => void
}

export type AccountTemplateType = FunctionComponent<Account>
