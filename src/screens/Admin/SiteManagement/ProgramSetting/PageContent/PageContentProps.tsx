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
  }
  stateLogoItem: {
    stateLogo: string
    setStateLogo: (value: string) => void
    stateLogoFile: StateLogoFileType
    setStateLogoFile: (value: StateLogoFileType) => void
  }
  programItem: {
    program: string
    setProgram: (value: string) => void
  }
  countyItem: {
    county: CountyFileType
    setCounty: (value: CountyFileType) => void
    setCountyArray: (value: Array<any>) => void
  }
  schoolDistrictItem: {
    schoolDistrict: SchoolDistrictFileType
    setSchoolDistrict: (value: SchoolDistrictFileType) => void
    setSchoolDistrictArray: (value: Array<any>) => void
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
  }
  enrollItem: {
    enroll: boolean
    setEnroll: (value: boolean) => void
  }
  setIsChanged: (value: boolean) => void
}
