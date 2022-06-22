import React from 'react'
import { PageContentProps } from './PageContentProps'
import { StateSelect } from '../StateSelect'
import { StateLogo } from '../StateLogo'
import { ProgramSelect } from '../ProgramSelect'
import { CountySelect } from '../CountySelect'
import { SchoolDistrictSelect } from '../SchoolDistrictSelect'
import { GradesSelect } from '../GradesSelect'
import { BirthDateCutOffSelect } from '../BirthDateCutOffSelect'
import { SpecialEdSelect } from '../SpecialEdSelect'
import EnrollPacketSelect from '../EnrollmentPackets/EnrollmentPacketSelect'
import { CommonSelect } from '../../components/CommonSelect'
import { CommonSelectType } from '../../types'

export default function PageContent({
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
}: PageContentProps) {
  const programSettingList: CommonSelectType[] = [
    {
      name: 'State',
      component: (
        <StateSelect
          stateName={stateSelectItem?.stateName}
          setIsChanged={setIsChanged}
          setIsInvalidStateName={stateSelectItem?.setIsInvalidStateName}
          stateInvalid={stateSelectItem?.stateInvalid}
          setStateInvalid={stateSelectItem?.setStateInvalid}
          newStateName={stateSelectItem?.newStateName}
          setNewStateName={stateSelectItem?.setNewStateName}
        />
      ),
    },
    {
      name: 'State Logo',
      component: (
        <StateLogo
          stateLogo={stateLogoItem?.stateLogo}
          setStateLogo={stateLogoItem?.setStateLogo}
          setIsChanged={setIsChanged}
          stateLogoFile={stateLogoItem?.stateLogoFile}
          setStateLogoFile={stateLogoItem?.setStateLogoFile}
        />
      ),
    },
    {
      name: 'Program',
      component: (
        <ProgramSelect
          program={programItem?.program}
          setProgram={programItem?.setProgram}
          setIsChanged={setIsChanged}
        />
      ),
    },
    {
      name: 'Counties',
      component: (
        <CountySelect
          county={countyItem?.county}
          setCounty={countyItem?.setCounty}
          setCountyArray={countyItem?.setCountyArray}
          setIsChanged={setIsChanged}
        />
      ),
    },
    {
      name: 'School Districts',
      component: (
        <SchoolDistrictSelect
          schoolDistrict={schoolDistrictItem?.schoolDistrict}
          setSchoolDistrict={schoolDistrictItem?.setSchoolDistrict}
          setSchoolDistrictArray={schoolDistrictItem?.setSchoolDistrictArray}
          setIsChanged={setIsChanged}
        />
      ),
    },
    {
      name: 'Grades',
      component: (
        <GradesSelect grades={gradesItem?.grades} setGrades={gradesItem?.setGrades} setIsChanged={setIsChanged} />
      ),
    },
    {
      name: 'Birthday Cut-off',
      component: (
        <BirthDateCutOffSelect
          birthDate={birthDayCutItem?.birthDate}
          setBirthDate={birthDayCutItem?.setBirthDate}
          setIsChanged={setIsChanged}
        />
      ),
    },
    {
      name: 'Special Ed',
      component: (
        <SpecialEdSelect
          specialEd={specialEdItem?.specialEd}
          setSpecialEd={specialEdItem?.setSpecialEd}
          specialEdOptions = {specialEdItem?.specialEdOptions}
          setSpecialEdOptions = {specialEdItem?.setSpecialEdOptions}
          setIsChanged={setIsChanged}
        />
      ),
    },
    {
      name: 'Enrollment Packets',
      component: (
        <EnrollPacketSelect enroll={enrollItem?.enroll} setEnroll={enrollItem?.setEnroll} setIsChanged={setIsChanged} />
      ),
    },
  ]

  return (
    <>
      {programSettingList?.map((programSetting, index) => (
        <CommonSelect index={index} selectItem={programSetting} />
      ))}
    </>
  )
}
