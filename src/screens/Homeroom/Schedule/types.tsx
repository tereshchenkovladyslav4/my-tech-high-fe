export type HeaderComponentProps = {
  title: string
}

export type StudentInfoProps = {
  name: string
  grade: string
  schoolDistrict: string
  specialEd: string
}

export type TestingPreferenceType = {
  id: number
  title: string
}

export type TestingPreferenceProps = {
  item?: TestingPreferenceType
}

export type DiplomaOption = {
  label: string
  value: boolean
}

export type DiplomaSeekingProps = {
  title: string
  description: string
  options: DiplomaOption[]
  setOptions: (value: DiplomaOption[]) => void
}
