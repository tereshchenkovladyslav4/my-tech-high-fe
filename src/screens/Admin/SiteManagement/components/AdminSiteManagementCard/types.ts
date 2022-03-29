import { FunctionComponent } from 'react'

type AdminSiteManagementCardProps = {
  title: string
  link: string
  img: string
  subTitle: string
}

export type AdminSiteManagementCardTemplateType = FunctionComponent<AdminSiteManagementCardProps>
