import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { cloneDeep } from 'lodash'
import { Prompt, useHistory } from 'react-router-dom'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { SuccessModal } from '@mth/components/SuccessModal/SuccessModal'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { CourseType, MthColor, MthRoute, MthTitle, SchedulePeriodStatus, ScheduleStatus } from '@mth/enums'
import { saveScheduleMutation } from '@mth/graphql/mutation/schedule'
import { saveSchedulePeriodMutation } from '@mth/graphql/mutation/schedule-period'
import { getAllScheduleBuilderQuery } from '@mth/graphql/queries/schedule-builder'
import { useStudentSchedulePeriods } from '@mth/hooks'
import { SEMESTER_TYPE } from '@mth/screens/Admin/Curriculum/types'
import { scheduleBuilderClasses } from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/styles'
import { mthButtonClasses } from '@mth/styles/button.style'
import { ScheduleBuilderProps, ScheduleData } from '../types'
import { RequestUpdatesModal } from './RequestUpdatesModal'
import { ScheduleEditor } from './ScheduleEditor'

const ScheduleBuilder: React.FC<ScheduleBuilderProps> = ({
  studentId,
  studentName,
  selectedYear,
  showSecondSemester = false,
  showUnsavedModal = false,
  splitEnrollment = false,
  isUpdatePeriodRequested,
  setIsUpdatePeriodRequested,
  setScheduleStatus,
  isChanged,
  setIsChanged,
  onWithoutSaved,
  reduceFundsEnabled,
}) => {
  const history = useHistory()
  const [isDraftSaved, setIsDraftSaved] = useState<boolean>(false)
  const [isValid, setIsValid] = useState<boolean>(false)
  const [showSubmitSuccessModal, setShowSubmitSuccessModal] = useState<boolean>(false)
  const [showRequestUpdatesModal, setShowRequestUpdatesModal] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [parentTooltip, setParentTooltip] = useState<string>()
  const [showNoChangesModal, setShowNoChangesModal] = useState<boolean>(false)

  const {
    scheduleData,
    hasSecondSemester,
    setScheduleData,
    secondScheduleData,
    setSecondScheduleData,
    studentScheduleId,
    setStudentScheduleId,
    studentScheduleStatus,
    hasUnlockedPeriods,
    refetch,
  } = useStudentSchedulePeriods(studentId, selectedYear, showSecondSemester)

  const { loading: scheduleBuilderSettingLoading, data: scheduleBuilderSettingData } = useQuery(
    getAllScheduleBuilderQuery,
    {
      variables: { schoolYearId: selectedYear },
      skip: !selectedYear,
      fetchPolicy: 'network-only',
    },
  )

  const [submitScheduleBuilder] = useMutation(saveScheduleMutation)
  const [saveDraft] = useMutation(saveSchedulePeriodMutation)

  const handleSave = async (kind: ScheduleStatus, directly = false) => {
    if (showSecondSemester && kind !== ScheduleStatus.UPDATES_REQUESTED && !directly) {
      const unchangedCnt = secondScheduleData.filter(
        (item) =>
          (item.FirstSemesterSchedule?.Period?.semester !== SEMESTER_TYPE.NONE ||
            item.FirstSemesterSchedule.Title?.always_unlock ||
            item.FirstSemesterSchedule.Course?.always_unlock) &&
          item.schedulePeriodStatus != SchedulePeriodStatus.NO_UPDATES &&
          item.FirstSemesterSchedule?.Period?.id == item.Period?.id &&
          item.FirstSemesterSchedule?.Subject?.subject_id == item.Subject?.subject_id &&
          item.FirstSemesterSchedule?.Title?.title_id == item.Title?.title_id &&
          item.FirstSemesterSchedule?.CourseType == item.CourseType &&
          item.FirstSemesterSchedule?.Provider?.id == item.Provider?.id &&
          item.FirstSemesterSchedule?.Course?.id == item.Course?.id &&
          item.FirstSemesterSchedule?.ThirdParty?.providerName == item.ThirdParty?.providerName &&
          item.FirstSemesterSchedule?.ThirdParty?.courseName == item.ThirdParty?.courseName &&
          item.FirstSemesterSchedule?.ThirdParty?.phoneNumber == item.ThirdParty?.phoneNumber &&
          item.FirstSemesterSchedule?.ThirdParty?.specificCourseWebsite == item.ThirdParty?.specificCourseWebsite &&
          JSON.stringify(item.FirstSemesterSchedule?.ThirdParty?.additionalWebsite) ==
            JSON.stringify(item.ThirdParty?.additionalWebsite) &&
          item.FirstSemesterSchedule?.OnSiteSplitEnrollment?.districtSchool ==
            item.OnSiteSplitEnrollment?.districtSchool &&
          item.FirstSemesterSchedule?.OnSiteSplitEnrollment?.schoolDistrictName ==
            item.OnSiteSplitEnrollment?.schoolDistrictName &&
          item.FirstSemesterSchedule?.OnSiteSplitEnrollment?.courseName == item.OnSiteSplitEnrollment?.courseName &&
          item.FirstSemesterSchedule?.CustomBuiltDescription == item.CustomBuiltDescription &&
          item.FirstSemesterSchedule?.CustomBuiltDescription == item.standardResponseOptions,
      ).length
      if (unchangedCnt) {
        setShowNoChangesModal(true)
        return
      }
    }

    const data = showSecondSemester ? secondScheduleData : scheduleData
    if (data?.length) {
      const submitResponse = await submitScheduleBuilder({
        variables: {
          createScheduleInput: {
            SchoolYearId: Number(selectedYear),
            StudentId: Number(studentId),
            status: kind,
            schedule_id: studentScheduleId,
            is_second_semester: showSecondSemester,
          },
        },
      })
      if (submitResponse) {
        const scheduleId = submitResponse.data?.createOrUpdateSchedule?.schedule_id
        setStudentScheduleId(scheduleId)

        const response = await saveDraft({
          variables: {
            createSchedulePeriodInput: {
              param: data?.map((item) => ({
                CourseId: Number(item?.Course?.id),
                PeriodId: Number(item?.Period?.id),
                ProviderId: Number(item?.Course?.Provider?.id),
                ScheduleId: Number(scheduleId),
                SubjectId: Number(item?.Subject?.subject_id),
                TitleId: Number(item?.Title?.title_id),
                course_type: item?.CourseType,
                custom_build_description: item?.CustomBuiltDescription,
                osse_course_name: item?.OnSiteSplitEnrollment?.courseName,
                osse_district_school: item?.OnSiteSplitEnrollment?.districtSchool,
                osse_school_district_name: item?.OnSiteSplitEnrollment?.schoolDistrictName,
                schedule_period_id: item?.schedulePeriodId,
                tp_additional_specific_course_website: item?.ThirdParty?.additionalWebsite
                  ? JSON.stringify(item.ThirdParty.additionalWebsite)
                  : '',
                tp_course_name: item?.ThirdParty?.courseName,
                tp_phone_number: item?.ThirdParty?.phoneNumber,
                tp_provider_name: item?.ThirdParty?.providerName,
                tp_specific_course_website: item?.ThirdParty?.specificCourseWebsite,
                status:
                  kind === ScheduleStatus.RESUBMITTED &&
                  item.schedulePeriodStatus === SchedulePeriodStatus.UPDATE_REQUIRED
                    ? SchedulePeriodStatus.RESUBMITTED
                    : item.schedulePeriodStatus || null,
              })),
            },
          },
        })

        if (response) {
          switch (kind) {
            case ScheduleStatus.DRAFT:
            case ScheduleStatus.UPDATES_REQUIRED:
              if (!directly) setIsDraftSaved(true)
              break
            case ScheduleStatus.SUBMITTED:
              setShowSubmitSuccessModal(true)
              break
            case ScheduleStatus.UPDATES_REQUESTED:
              history.push(MthRoute.DASHBOARD)
              return
          }
          setIsChanged(false)
          setIsEditMode(false)
          data.map((x) => (x.editable = false))
          if (showSecondSemester) {
            setSecondScheduleData(cloneDeep(data))
          } else {
            setScheduleData(cloneDeep(data))
          }
          refetch()
        }
      }
    }
  }

  const handleRequestUpdates = async (periodIds: number[]) => {
    if (studentScheduleStatus === ScheduleStatus.ACCEPTED) {
      const data = showSecondSemester ? secondScheduleData : scheduleData
      data
        .filter((item) => periodIds.includes(item.period))
        .map((item) => (item.schedulePeriodStatus = SchedulePeriodStatus.UPDATE_REQUESTED))
      await handleSave(ScheduleStatus.UPDATES_REQUESTED)
    } else {
      setIsEditMode(true)
      setIsUpdatePeriodRequested(true)
      const data = showSecondSemester ? secondScheduleData : scheduleData
      data.map((item) => (item.editable = periodIds.includes(item.period)))
      if (showSecondSemester) {
        setSecondScheduleData(cloneDeep(data))
      } else {
        setScheduleData(cloneDeep(data))
      }
    }
  }

  const handleSecondSemSchedulePeriodStatusChange = async (
    schedule: ScheduleData,
    status: SchedulePeriodStatus | undefined,
  ) => {
    if (schedule) {
      const scheduleIdx = secondScheduleData.findIndex((item) => item?.Period?.id === schedule?.Period?.id)
      schedule.schedulePeriodStatus = status
      schedule.showButtonName =
        status === SchedulePeriodStatus.NO_UPDATES ? SchedulePeriodStatus.MAKE_UPDATES : SchedulePeriodStatus.NO_UPDATES
      secondScheduleData[scheduleIdx] = schedule
      setSecondScheduleData(cloneDeep(secondScheduleData))
      const data = secondScheduleData?.filter((item) => item?.showButtonName === SchedulePeriodStatus.NO_UPDATES)
      await handleSave(
        data?.length ? (hasSecondSemester ? studentScheduleStatus : ScheduleStatus.DRAFT) : ScheduleStatus.ACCEPTED,
        true,
      )
    }
  }

  useEffect(() => {
    if (scheduleData?.length) {
      let invalidCnt = 0
      scheduleData.map((item) => {
        if (item?.CourseType) {
          switch (item.CourseType) {
            case CourseType.CUSTOM_BUILT:
              if (!item.CustomBuiltDescription) invalidCnt++
              break
            case CourseType.MTH_DIRECT:
              if (!item.OnSiteSplitEnrollment && !item.Course) invalidCnt++
              break
            case CourseType.THIRD_PARTY_PROVIDER:
              if (!item.ThirdParty) invalidCnt++
              break
          }
        } else {
          if (!item?.Period || !!item?.Period?.Subjects?.length) invalidCnt++
        }
      })
      setIsValid(invalidCnt == 0)
    }
  }, [scheduleData])

  useEffect(() => {
    if (!scheduleBuilderSettingLoading && scheduleBuilderSettingData?.getScheduleBuilder) {
      setParentTooltip(scheduleBuilderSettingData.getScheduleBuilder?.parent_tooltip)
    }
  }, [scheduleBuilderSettingLoading, scheduleBuilderSettingData])

  useEffect(() => {
    setScheduleStatus(studentScheduleStatus)
  }, [studentScheduleStatus])

  return (
    <>
      {showSecondSemester && hasUnlockedPeriods && (
        <Typography sx={scheduleBuilderClasses.semesterTitle}>{MthTitle.FIRST_SEMESTER}</Typography>
      )}
      {(!showSecondSemester || (showSecondSemester && hasUnlockedPeriods)) && (
        <ScheduleEditor
          scheduleData={scheduleData}
          splitEnrollment={splitEnrollment}
          isEditMode={isEditMode && !showSecondSemester}
          scheduleStatus={showSecondSemester ? ScheduleStatus.ACCEPTED : studentScheduleStatus}
          parentTooltip={parentTooltip}
          setIsChanged={setIsChanged}
          setScheduleData={setScheduleData}
          reduceFundsEnabled={reduceFundsEnabled}
        />
      )}
      {showSecondSemester && hasUnlockedPeriods && (
        <Typography sx={{ ...scheduleBuilderClasses.semesterTitle, mt: 4 }}>{MthTitle.SECOND_SEMESTER}</Typography>
      )}
      {showSecondSemester && (
        <ScheduleEditor
          scheduleData={secondScheduleData}
          splitEnrollment={splitEnrollment && !!selectedYear?.ScheduleBuilder?.always_unlock}
          hasUnlockedPeriods={hasUnlockedPeriods}
          isEditMode={isEditMode || !studentScheduleStatus || studentScheduleStatus === ScheduleStatus.DRAFT}
          isSecondSemester={true}
          scheduleStatus={studentScheduleStatus}
          parentTooltip={parentTooltip}
          setIsChanged={setIsChanged}
          setScheduleData={setSecondScheduleData}
          handleSecondSemSchedulePeriodStatusChange={handleSecondSemSchedulePeriodStatusChange}
          reduceFundsEnabled={reduceFundsEnabled}
        />
      )}
      {showUnsavedModal && (
        <CustomModal
          title={MthTitle.UNSAVED_TITLE}
          description={MthTitle.UNSAVED_DESCRIPTION}
          cancelStr='Cancel'
          confirmStr='Yes'
          backgroundColor={MthColor.WHITE}
          onClose={() => onWithoutSaved(false)}
          onConfirm={() => onWithoutSaved(true)}
        />
      )}
      {showNoChangesModal && (
        <CustomModal
          title='Error'
          description='No changes were made.'
          subDescription={
            <Typography component='span'>
              Please select{' '}
              <Typography component='span' sx={{ fontWeight: '700' }}>
                No Changes
              </Typography>{' '}
              if you don’t intend to make updates.
            </Typography>
          }
          confirmStr='Ok'
          showCancel={false}
          backgroundColor={MthColor.WHITE}
          onClose={() => setShowNoChangesModal(false)}
          onConfirm={() => setShowNoChangesModal(false)}
        />
      )}
      {isDraftSaved && (
        <SuccessModal
          title='Saved'
          subtitle={
            <Paragraph size='large' color={MthColor.SYSTEM_01} textAlign='center'>
              {' '}
              Great start! <br /> Your student&apos;s schedule has been saved. <br /> Please return to submit the
              schedule before the deadline.
            </Paragraph>
          }
          btntitle='Ok'
          handleSubmit={() => setIsDraftSaved(false)}
        />
      )}
      {showSubmitSuccessModal && (
        <SuccessModal
          title='Success'
          subtitle={
            <Paragraph size='large' color={MthColor.SYSTEM_01} textAlign='center'>
              {`${studentName}'s schedule has been submitted successfully and is pending approval.`}
            </Paragraph>
          }
          btntitle='Done'
          handleSubmit={() => {
            setShowSubmitSuccessModal(false)
            window.location.assign(`${MthRoute.DASHBOARD}`)
          }}
        />
      )}
      {showRequestUpdatesModal && (
        <RequestUpdatesModal
          scheduleData={showSecondSemester ? secondScheduleData : scheduleData}
          isSecondSemester={showSecondSemester}
          setShowEditModal={setShowRequestUpdatesModal}
          onSave={handleRequestUpdates}
        />
      )}
      <Prompt
        when={!!isChanged}
        message={JSON.stringify({
          header: MthTitle.UNSAVED_TITLE,
          content: MthTitle.UNSAVED_DESCRIPTION,
        })}
      />
      {!!scheduleData?.length && (
        <Box sx={{ mt: 3 }}>
          {(!studentScheduleStatus ||
            studentScheduleStatus === ScheduleStatus.DRAFT ||
            studentScheduleStatus === ScheduleStatus.NOT_SUBMITTED ||
            studentScheduleStatus === ScheduleStatus.UPDATES_REQUIRED ||
            (isUpdatePeriodRequested &&
              (studentScheduleStatus === ScheduleStatus.SUBMITTED ||
                studentScheduleStatus === ScheduleStatus.RESUBMITTED))) &&
            (isValid ? (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingX: 6 }}>
                <Button
                  onClick={() =>
                    handleSave(
                      studentScheduleStatus === ScheduleStatus.UPDATES_REQUIRED
                        ? ScheduleStatus.UPDATES_REQUIRED
                        : studentScheduleStatus
                        ? studentScheduleStatus
                        : ScheduleStatus.DRAFT,
                    )
                  }
                  sx={mthButtonClasses.primary}
                >
                  {MthTitle.SAVE_DRAFT}
                </Button>
                <Button
                  onClick={() =>
                    handleSave(
                      studentScheduleStatus === ScheduleStatus.UPDATES_REQUIRED
                        ? ScheduleStatus.RESUBMITTED
                        : studentScheduleStatus === ScheduleStatus.RESUBMITTED
                        ? ScheduleStatus.RESUBMITTED
                        : ScheduleStatus.SUBMITTED,
                    )
                  }
                  sx={mthButtonClasses.dark}
                >
                  {studentScheduleStatus === ScheduleStatus.UPDATES_REQUIRED ||
                  studentScheduleStatus === ScheduleStatus.RESUBMITTED ||
                  studentScheduleStatus === ScheduleStatus.SUBMITTED
                    ? MthTitle.SUBMIT_UPDATES
                    : MthTitle.SUBMIT}
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'end', paddingX: 6 }}>
                <Button
                  onClick={() =>
                    handleSave(
                      studentScheduleStatus === ScheduleStatus.UPDATES_REQUIRED
                        ? ScheduleStatus.UPDATES_REQUIRED
                        : studentScheduleStatus
                        ? studentScheduleStatus
                        : ScheduleStatus.DRAFT,
                    )
                  }
                  sx={mthButtonClasses.primary}
                >
                  {MthTitle.SAVE_DRAFT}
                </Button>
              </Box>
            ))}
          {!isUpdatePeriodRequested &&
            (studentScheduleStatus === ScheduleStatus.SUBMITTED ||
              studentScheduleStatus === ScheduleStatus.ACCEPTED ||
              studentScheduleStatus === ScheduleStatus.RESUBMITTED) && (
              <Box sx={{ display: 'flex', justifyContent: 'end', paddingX: 6 }}>
                {!isEditMode ? (
                  <Button
                    onClick={() => {
                      setShowRequestUpdatesModal(true)
                    }}
                    sx={mthButtonClasses.orange}
                  >
                    {MthTitle.REQUEST_UPDATES}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSave(ScheduleStatus.SUBMITTED)}
                    sx={mthButtonClasses.dark}
                    disabled={!isValid}
                  >
                    {MthTitle.SUBMIT_UPDATES}
                  </Button>
                )}
              </Box>
            )}
        </Box>
      )}
    </>
  )
}

export default ScheduleBuilder
