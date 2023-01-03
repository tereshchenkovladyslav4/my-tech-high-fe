import { MthRoute } from '@mth/enums'

export type AdminEnrolmentCardProps = {
  title: string
  link: string | MthRoute
  img: string
  fullTitle?: string
  disabled?: boolean
  showTitle?: boolean
}
