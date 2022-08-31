import React from 'react'
import { MthTitle } from '@mth/enums'
import { CommonSelect } from '../../components/CommonSelect'
import { CommonSelectType } from '../../types'
import { BirthDateCutOffSelect } from '../BirthDateCutOffSelect'
import { CountySelect } from '../CountySelect'
import { EnrollPacketSelect } from '../EnrollmentPackets/EnrollmentPacketSelect'
import { GradesSelect } from '../GradesSelect'
import { ProgramSelect } from '../ProgramSelect'
import { SchoolDistrictSelect } from '../SchoolDistrictSelect'
import { SpecialEdSelect } from '../SpecialEdSelect'
import { StateLogo } from '../StateLogo'
import { StateSelect } from '../StateSelect'
import { PageContentProps } from './PageContentProps'

export const PageContent: React.FC<PageContentProps> = ({
  stateSelectItem,
  stateLogoItem,
  programItem,
  countyItem,
  schoolDistrictItem,
  gradesItem,
  birthDayCutItem,
  specialEdItem,
  enrollItem,
  setIsChanged,
  isChanged,
  setIsDelete,
  isDelete,
}) => {
  const programSettingList: CommonSelectType[] = [
    {
      name: MthTitle.STATE,
      component: (
        <StateSelect
          stateName={stateSelectItem?.stateName}
          setIsInvalidStateName={stateSelectItem?.setIsInvalidStateName}
          stateInvalid={stateSelectItem?.stateInvalid}
          setStateInvalid={stateSelectItem?.setStateInvalid}
          newStateName={stateSelectItem?.newStateName}
          setNewStateName={stateSelectItem?.setNewStateName}
        />
      ),
    },
    {
      name: MthTitle.STATE_LOGO,
      component: (
        <StateLogo
          stateLogo={stateLogoItem?.stateLogo}
          setStateLogo={stateLogoItem?.setStateLogo}
          setIsChanged={setIsChanged}
          isChanged={isChanged}
          stateLogoFile={stateLogoItem?.stateLogoFile}
          setStateLogoFile={stateLogoItem?.setStateLogoFile}
        />
      ),
    },
    {
      name: MthTitle.PROGRAM,
      component: (
        <ProgramSelect
          program={programItem?.program}
          setProgram={programItem?.setProgram}
          setIsChanged={setIsChanged}
          isChanged={isChanged}
        />
      ),
    },
    {
      name: MthTitle.COUNTIES,
      component: (
        <CountySelect
          county={countyItem?.county}
          setCounty={countyItem?.setCounty}
          setCountyArray={countyItem?.setCountyArray}
          setIsChanged={setIsChanged}
          setIsDelete={setIsDelete}
          isDelete={isDelete}
          isChanged={isChanged}
        />
      ),
    },
    {
      name: MthTitle.SCHOOL_DISTRICTS,
      component: (
        <SchoolDistrictSelect
          schoolDistrict={schoolDistrictItem?.schoolDistrict}
          setSchoolDistrict={schoolDistrictItem?.setSchoolDistrict}
          setSchoolDistrictArray={schoolDistrictItem?.setSchoolDistrictArray}
          setIsChanged={setIsChanged}
          setIsDelete={setIsDelete}
          isDelete={isDelete}
        />
      ),
    },
    {
      name: MthTitle.GRADES,
      component: (
        <GradesSelect
          grades={gradesItem?.grades}
          setGrades={gradesItem?.setGrades}
          isChanged={isChanged}
          setIsChanged={setIsChanged}
        />
      ),
    },
    {
      name: MthTitle.BIRTHDAY_CUT_OFF,
      component: (
        <BirthDateCutOffSelect birthDate={birthDayCutItem?.birthDate} setBirthDate={birthDayCutItem?.setBirthDate} />
      ),
    },
    {
      name: MthTitle.SPECIAL_ED,
      component: (
        <SpecialEdSelect
          specialEd={specialEdItem?.specialEd}
          setSpecialEd={specialEdItem?.setSpecialEd}
          specialEdOptions={specialEdItem?.specialEdOptions}
          setSpecialEdOptions={specialEdItem?.setSpecialEdOptions}
          setIsChanged={setIsChanged}
          isChanged={isChanged}
        />
      ),
    },
    {
      name: MthTitle.ENROLLMENT_PACKETS,
      component: (
        <EnrollPacketSelect
          enroll={enrollItem?.enroll}
          setEnroll={enrollItem?.setEnroll}
          isChanged={isChanged}
          setIsChanged={setIsChanged}
        />
      ),
    },
  ]

  return (
    <>
      {programSettingList?.map((programSetting, index) => (
        <CommonSelect key={index} index={index} selectItem={programSetting} />
      ))}
    </>
  )
}
