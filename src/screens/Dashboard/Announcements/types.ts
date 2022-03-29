import { FunctionComponent } from 'react'

type AnnnouncementProps = {
  expandAnnouncments: (value: React.SetStateAction<boolean>) => void
}
export type AnnouncementTemplateType = FunctionComponent<AnnnouncementProps>
