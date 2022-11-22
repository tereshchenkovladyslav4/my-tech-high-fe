export type Classes = {
  class_id: number
  className: string
  teacher: string
  students: number
  ungraded: string
  additionalTeacher: string
}

export type Master = {
  master_id?: number
  master_name?: string
  classesCount?: number
  classes?: Classes[]
  schoolYear?: number
  // Temp fields
}

export type ClassessProps = {
  classes: Classes[] | undefined
}
