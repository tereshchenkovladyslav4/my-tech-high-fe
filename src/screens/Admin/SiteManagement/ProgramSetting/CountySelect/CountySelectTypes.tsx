export type CountyFileType = {
  name: string
  path: string
  file: File | undefined
}

export type CountySelectProps = {
  county: CountyFileType | null
  setCounty: (value: CountyFileType) => void
  setCountyArray: (value: CountyFileType[]) => void
  setIsChanged: (value: boolean) => void
  setIsDelete: (value: boolean) => void
  isDelete: boolean
  isChanged: boolean
}
