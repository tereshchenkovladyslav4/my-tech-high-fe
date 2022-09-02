import { FileDeleted, ProgramSettingChanged } from '../types'

export type CountyFileType = {
  name: string
  path: string
  file: File | undefined | null
}

export type CountySelectProps = {
  county: CountyFileType | null
  setCounty: (value: CountyFileType) => void
  setCountyArray: (value: { county_name: string }[]) => void
  setIsChanged: (value: ProgramSettingChanged) => void
  setIsDelete: (value: FileDeleted) => void
  isDelete: FileDeleted
  isChanged: ProgramSettingChanged
}
