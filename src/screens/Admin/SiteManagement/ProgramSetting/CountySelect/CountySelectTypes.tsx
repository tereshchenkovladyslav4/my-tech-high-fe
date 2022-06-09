export type CountyFileType = {
  name: string
  path: string
  file: File | undefined
}

export type CountySelectProps = {
  county: CountyFileType
  setCounty: (value: any) => void
  setCountyArray: (value: any) => void
  setIsChanged: (value: boolean) => void
}
