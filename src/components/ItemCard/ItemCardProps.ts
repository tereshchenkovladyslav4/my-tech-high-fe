export interface ItemCardProps {
  title: string
  subTitle: string
  img: string
  link: string
  isLink?: boolean
  action?: boolean
  hasTitle?: boolean
  onClick?: () => void
}
