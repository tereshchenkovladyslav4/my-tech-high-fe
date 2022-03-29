import { FunctionComponent } from 'react'

type AnnouncmentItemProps = {
  title: string
  subtitle: string
  onClose: () => void
}

export type AnnouncmentTemplateType = FunctionComponent<AnnouncmentItemProps>
