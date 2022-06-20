export type SchoolDistrictFileType = {
  name: string
  path: string
  file: File | undefined
}

export type SchoolDistrictSelectProps = {
  schoolDistrict: SchoolDistrictFileType | null
  setSchoolDistrict: (value: any) => void
  setSchoolDistrictArray: (value: any) => void
  setIsChanged: (value: boolean) => void
}
