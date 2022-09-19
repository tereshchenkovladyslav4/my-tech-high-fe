export type Subject = {
  id: number
  name: string
  periods: string
  active: boolean
  priority: number
  titles?: Title[]
}

export type Title = {
  name: string
  grades: string
  diplomaSeeking: boolean
  customBuilt: boolean
  thirdParty: boolean
  splitEnrollment: boolean
  semesterOnly: boolean
  active: boolean
}

export type TitlesProps = {
  titles: Title[] | undefined
}
