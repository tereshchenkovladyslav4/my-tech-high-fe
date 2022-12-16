import { FileDeleted, ProgramSettingChanged } from '../types'

export type CountyFileType = {
  name: string
  path: string
  file: File | undefined | null
}

export type CountyArrayItem = { county_name: string }

export type CountySelectProps = {
  county: CountyFileType | null
  setCounty: (value: CountyFileType) => void
  setCountyArray: (value: CountyArrayItem[]) => void
  setIsChanged: (value: ProgramSettingChanged) => void
  setIsDelete: (value: FileDeleted) => void
  isDelete: FileDeleted
  isChanged: ProgramSettingChanged
}
