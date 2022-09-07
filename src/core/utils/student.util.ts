import { Person } from '@mth/screens/HomeroomStudentProfile/Student/types'

export const getProfilePhoto = (person: Person): string => {
  if (!person.photo) return 'image'

  const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
  return s3URL + person.photo
}
