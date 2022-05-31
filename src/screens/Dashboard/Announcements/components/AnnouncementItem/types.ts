import { FunctionComponent } from 'react'

type AnnouncmentItemProps = {
  title: string
  subtitle: string
  onClose: () => void
  setSectionName: (value: React.SetStateAction<string>) => void
}

export type AnnouncmentTemplateType = FunctionComponent<AnnouncmentItemProps>
