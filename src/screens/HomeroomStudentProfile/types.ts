export enum StudentProfilePage {
  STUDENT = 'student',
  HOMEROOM = 'homeroom',
  RESOURCES = 'resources',
}

export type StudentProfileItem = {
  type: StudentProfilePage
  label: string
}

export type StudentNavProps = {
  nav: StudentProfilePage
  setNav: (value: StudentProfilePage) => void
}
