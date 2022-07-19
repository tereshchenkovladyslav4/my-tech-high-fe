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
  isChanged,
  setIsDelete,
  isDelete,
}: PageContentProps) {
  const programSettingList: CommonSelectType[] = [
    {
      name: 'State',
      component: (
        <StateSelect
          stateName={stateSelectItem?.stateName}
          setIsChanged={setIsChanged}
          isChanged={isChanged}
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
          isChanged={isChanged}
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
          isChanged={isChanged}
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
          setIsDelete={setIsDelete}
          isDelete={isDelete}
          isChanged={isChanged}
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
          setIsDelete={setIsDelete}
          isDelete={isDelete}
          isChanged={isChanged}
        />
      ),
    },
    {
      name: 'Grades',
      component: (
          <GradesSelect grades={gradesItem?.grades} setGrades={gradesItem?.setGrades} isChanged={isChanged} setIsChanged={setIsChanged} />
      ),
    },
    {
      name: 'Birthday Cut-off',
      component: (
        <BirthDateCutOffSelect
          birthDate={birthDayCutItem?.birthDate}
          setBirthDate={birthDayCutItem?.setBirthDate}
          setIsChanged={setIsChanged}
          isChanged={isChanged}
        />
      ),
    },
    {
      name: 'Special Ed',
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
      name: 'Enrollment Packets',
      component: (
        <EnrollPacketSelect enroll={enrollItem?.enroll} setEnroll={enrollItem?.setEnroll} isChanged={isChanged} setIsChanged={setIsChanged} />
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
