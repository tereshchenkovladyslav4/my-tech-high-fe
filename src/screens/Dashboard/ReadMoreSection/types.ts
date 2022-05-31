import { FunctionComponent } from 'react'

export type ReadMoreSectionProps = {
  inProp: boolean
  setSectionName: (value: React.SetStateAction<string>) => void
}
