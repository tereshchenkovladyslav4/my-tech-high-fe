import { CountyFileType } from '../CountySelect/CountySelectTypes'
import { StateLogoFileType } from '../ImageCropper/ImageCropper'
import { SchoolDistrictFileType } from '../SchoolDistrictSelect/SchoolDistrictSelectTypes'
import { FileDeleted, ProgramSettingChanged } from '../types'

export type PageContentProps = {
  stateSelectItem: {
    stateName: string
    setIsInvalidStateName: (value: boolean) => void
    stateInvalid: boolean
    setStateInvalid: (value: boolean) => void
    newStateName: string
    setNewStateName: (value: string) => void
    setIsStateChanged?: (value: boolean) => void
    setIsDelete?: (value: boolean) => void
    isDelete?: boolean
    isChanged?: boolean
  }
  scheduleItem: {
    schedule: boolean
    diplomaSeeking: boolean
    testingPreference: boolean
    setSchedule: (value: boolean) => void
    setDiplomaSeeking: (value: boolean) => void
    setTestingPreference: (value: boolean) => void
  }
  stateLogoItem: {
    stateLogo: string
    setStateLogo: (value: string) => void
    stateLogoFile: StateLogoFileType | null
    setStateLogoFile: (value: StateLogoFileType) => void
  }
  programItem: {
    program: string
    setProgram: (value: string) => void
  }
  countyItem: {
    county: CountyFileType | null
    setCounty: (value: CountyFileType) => void
    setCountyArray: (value: Array<{ county_name: string }>) => void
  }
  schoolDistrictItem: {
    schoolDistrict: SchoolDistrictFileType | null
    setSchoolDistrict: (value: SchoolDistrictFileType) => void
    setSchoolDistrictArray: (value: Array<{ school_district_name: string; school_district_code: string }>) => void
  }
  gradesItem: {
    grades: string
    setGrades: (value: string) => void
  }
  birthDayCutItem: {
    birthDate: string
    setBirthDate: (value: string) => void
  }
  specialEdItem: {
    specialEd: boolean
    setSpecialEd: (value: boolean) => void
    specialEdOptions: Array<{ option_value: string }>
    setSpecialEdOptions: (value: Array<{ option_value: string }>) => void
  }
  enrollItem: {
    enroll: boolean
    setEnroll: (value: boolean) => void
  }
  isChanged: ProgramSettingChanged
  setIsChanged: (value: ProgramSettingChanged) => void
  isDelete: FileDeleted
  setIsDelete: (value: FileDeleted) => void
}
