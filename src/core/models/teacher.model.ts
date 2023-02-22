export type Teacher = {
  classId: number
  firstName?: string
  lastName?: string
  user_id: number
  ungradedLogs: number
  avatarUrl?: string
}

export type HomeroomTeacher = {
  teacher: Teacher
}
