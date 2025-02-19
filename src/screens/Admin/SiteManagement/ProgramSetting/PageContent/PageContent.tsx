import React from 'react'
import { CommonSelect } from '@mth/components/CommonSelect'
import { MthTitle } from '@mth/enums'
import { DirectOrdersSelect } from '@mth/screens/Admin/SiteManagement/ProgramSetting/DirectOrders/DirectOrdersSelect'
import { LearningLogsSelect } from '@mth/screens/Admin/SiteManagement/ProgramSetting/LearningLogs/LearningLogsSelect'
import { ReimbursementsSelect } from '@mth/screens/Admin/SiteManagement/ProgramSetting/Reimbursements/ReimbursementsSelect'
import { CommonSelectType } from '../../types'
import { BirthDateCutOffSelect } from '../BirthDateCutOffSelect'
import { CountySelect } from '../CountySelect'
import { EnrollPacketSelect } from '../EnrollmentPackets/EnrollmentPacketSelect'
import { GradesSelect } from '../GradesSelect'
import { ProgramSelect } from '../ProgramSelect'
import { Schedules } from '../Schedules'
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
  scheduleItem,
  learningLogItem,
  reimbursementsItem,
  directOrdersItem,
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
    {
      name: MthTitle.SCHEDULES,
      component: (
        <Schedules
          schedule={scheduleItem.schedule}
          diplomaSeeking={scheduleItem.diplomaSeeking}
          testingPreference={scheduleItem.testingPreference}
          isChanged={isChanged}
          setSchedule={scheduleItem.setSchedule}
          setDiplomaSeeking={scheduleItem.setDiplomaSeeking}
          setTestingPreference={scheduleItem.setTestingPreference}
          setIsChanged={setIsChanged}
        />
      ),
    },
    {
      name: MthTitle.LEARNING_LOGS,
      component: (
        <LearningLogsSelect
          learningLogs={learningLogItem.learningLogs}
          learningLogsFirstSecondSemesters={learningLogItem.learningLogsFirstSecondSemesters}
          isChanged={isChanged}
          setLearningLogs={learningLogItem.setLearningLogs}
          setLearningLogsFirstSecondSemesters={learningLogItem.setLearningLogsFirstSecondSemesters}
          setIsChanged={setIsChanged}
        />
      ),
    },
    {
      name: MthTitle.REIMBURSEMENTS,
      component: (
        <ReimbursementsSelect
          reimbursements={reimbursementsItem.reimbursements}
          requireSoftware={reimbursementsItem.requireSoftware}
          isChanged={isChanged}
          setReimbursements={reimbursementsItem.setReimbursements}
          setRequireSoftware={reimbursementsItem.setRequireSoftware}
          setIsChanged={setIsChanged}
        />
      ),
    },
    {
      name: MthTitle.DIRECT_ORDERS,
      component: (
        <DirectOrdersSelect
          reimbursements={reimbursementsItem.reimbursements}
          directOrders={directOrdersItem.directOrders}
          isChanged={isChanged}
          setDirectOrders={directOrdersItem.setDirectOrders}
          setIsChanged={setIsChanged}
        />
      ),
    },
  ]

  return (
    <>
      {programSettingList?.map((programSetting, index) => (
        <CommonSelect
          key={index}
          index={index}
          selectItem={programSetting}
          verticalDividHeight={programSetting.name == MthTitle.STATE_LOGO ? '160px' : 'auto'}
        />
      ))}
    </>
  )
}
