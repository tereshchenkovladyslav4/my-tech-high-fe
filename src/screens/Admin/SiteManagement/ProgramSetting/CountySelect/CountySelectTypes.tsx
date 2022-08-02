export type CountyFileType = {
  name: string
  path: string
  file: File | undefined
}

export type CountySelectProps = {
  county: CountyFileType | null
  setCounty: (value: unknown) => void
  setCountyArray: (value: unknown) => void
  setIsChanged: (value: boolean) => void
  setIsDelete: (value: unknown) => void
  isDelete: unknown
  isChanged: unknown
}
