export type SchoolDistrictFileType = {
  name: string
  path: string
  file: File | undefined
}

export type SchoolDistrictSelectProps = {
  schoolDistrict: SchoolDistrictFileType
  setSchoolDistrict: (value: any) => void
  setSchoolDistrictArray: (value: any) => void
  handleSchoolDistrictInfoDelete: () => void
  setIsChanged: (value: boolean) => void
}
