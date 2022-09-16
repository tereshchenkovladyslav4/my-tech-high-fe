export type Provider = {
  id: number
  title: string
  reducesFunds: boolean | undefined
  multiplePeriods: boolean | undefined
  active: boolean
  courses?: Course[]
}

export type Course = {
  name: string
  grades: string
  diplomaSeeking: boolean
  reducesFunds: boolean
  semesterOnly: boolean
  limit: number
  subjects: string
  active: boolean
}

export type CoursesProps = {
  courses: Course[] | undefined
}
