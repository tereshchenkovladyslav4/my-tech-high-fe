import { MthRoute } from '@mth/enums'

export type PageHeaderProps = {
  title: string
  to?: string | MthRoute
  onBack?: () => void
}
