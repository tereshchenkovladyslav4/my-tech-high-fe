export enum CurriculumType {
  NONE = 'none',
  HOMEROOM_RESOURCES = 'homeroom-resources',
}

export type CurriculumItem = {
  id: number
  title: string
  subtitle: string
  img: string
  isLink: boolean
  type: CurriculumType
  action?: boolean
}
