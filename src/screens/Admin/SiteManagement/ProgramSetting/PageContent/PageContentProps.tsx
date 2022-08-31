import { CountyFileType } from '../CountySelect/CountySelectTypes'
import { StateLogoFileType } from '../ImageCropper/ImageCropper'
import { SchoolDistrictFileType } from '../SchoolDistrictSelect/SchoolDistrictSelectTypes'

export type PageContentProps = {
  stateSelectItem: {
    stateName: string
    setIsInvalidStateName: (value: boolean) => void
    stateInvalid: boolean
    setStateInvalid: (value: boolean) => void
    newStateName: string
    setNewStateName: (value: string) => void
    setIsStateChanged: (value: boolean) => void
    setIsDelete: (value: boolean) => void
    isDelete: boolean
    isChanged: boolean
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
    setCountyArray: (value: Array<CountyFileType>) => void
  }
  schoolDistrictItem: {
    schoolDistrict: SchoolDistrictFileType | null
    setSchoolDistrict: (value: SchoolDistrictFileType) => void
    setSchoolDistrictArray: (value: Array<SchoolDistrictFileType>) => void
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
    speicalEdOptions: Array<unknown>
    setSpecialEdOptions: (value: Array<unknown>) => void
  }
  enrollItem: {
    enroll: boolean
    setEnroll: (value: boolean) => void
  }
  isChanged: boolean
  setIsChanged: (value: boolean) => void
  isDelete: boolean
  setIsDelete: (value: boolean) => void
}
