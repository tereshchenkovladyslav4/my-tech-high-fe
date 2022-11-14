export type Classes = {
  class_id: number
  className: string
  teacher: string
  students: number
  ungraded: string
  additionalTeacher: string
}

export type Master = {
  id: number
  master: string
  classesCount: number
  classes?: Classes[]
  // Temp fields
}

export type ClassessProps = {
  classes: Classes[] | undefined
}
