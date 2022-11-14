import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { Prompt } from 'react-router-dom'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { SuccessModal } from '@mth/components/SuccessModal/SuccessModal'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { CourseType, MthColor, MthTitle, ScheduleStatus } from '@mth/enums'
import { saveScheduleMutation } from '@mth/graphql/mutation/schedule'
import { saveSchedulePeriodMutation } from '@mth/graphql/mutation/schedule-period'
import { getAllScheduleBuilderQuery } from '@mth/graphql/queries/schedule-builder'
import { useStudentSchedulePeriods } from '@mth/hooks'
import { mthButtonClasses } from '@mth/styles/button.style'
import { ScheduleBuilderProps } from '../types'
import { RequestUpdatesModal } from './RequestUpdatesModal'
import { ScheduleEditor } from './ScheduleEditor'

const ScheduleBuilder: React.FC<ScheduleBuilderProps> = ({
  studentId,
  studentName,
  selectedYear,
  showUnsavedModal = false,
  splitEnrollment = false,
  diplomaSeekingPath,
  setIsChanged,
  onWithoutSaved,
}) => {
  const [isDraftSaved, setIsDraftSaved] = useState<boolean>(false)
  const [showSubmitBtn, setShowSubmitBtn] = useState<boolean>(false)
  const [showSubmitSuccessModal, setShowSubmitSuccessModal] = useState<boolean>(false)
  const [showRequestUpdatesModal, setShowRequestUpdatesModal] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [parentTooltip, setParentTooltip] = useState<string>()

  const { scheduleData, studentScheduleId, studentScheduleStatus, setScheduleData, setStudentScheduleId, refetch } =
    useStudentSchedulePeriods(studentId, selectedYear, diplomaSeekingPath)

  const { loading: scheduleBuilderSettingLoading, data: scheduleBuilderSettingData } = useQuery(
    getAllScheduleBuilderQuery,
    {
      variables: { schoolYearId: selectedYear },
      fetchPolicy: 'network-only',
    },
  )

  const [submitScheduleBuilder] = useMutation(saveScheduleMutation)
  const [saveDraft] = useMutation(saveSchedulePeriodMutation)

  const handleSave = async (kind: ScheduleStatus) => {
    if (scheduleData?.length) {
      const submitResponse = await submitScheduleBuilder({
        variables: {
          createScheduleInput: {
            SchoolYearId: Number(selectedYear),
            StudentId: Number(studentId),
            status: kind,
            schedule_id: studentScheduleId,
          },
        },
      })
      if (submitResponse) {
        const scheduleId = submitResponse.data?.createOrUpdateSchedule?.schedule_id
        setStudentScheduleId(scheduleId)
        const response = await saveDraft({
          variables: {
            createSchedulePeriodInput: {
              param: scheduleData?.map((item) => ({
                CourseId: Number(item?.Course?.id),
                PeriodId: Number(item?.Period?.id),
                ProviderId: Number(item?.Course?.Provider?.id),
                ScheduleId: Number(scheduleId),
                SubjectId: Number(item?.Subject?.subject_id),
                TitleId: Number(item?.Title?.title_id),
                course_type: item?.CourseType,
                custom_build_description: item?.CustomBuiltDescription,
                osse_coures_name: item?.OnSiteSplitEnrollment?.courseName,
                osse_district_school: item?.OnSiteSplitEnrollment?.districtSchool,
                osse_school_district_name: item?.OnSiteSplitEnrollment?.schoolDistrictName,
                schedule_period_id: item?.schedulePeriodId,
                tp_addtional_specific_course_website: item?.ThirdParty?.additionalWebsite
                  ? JSON.stringify(item.ThirdParty.additionalWebsite)
                  : '',
                tp_course_name: item?.ThirdParty?.courseName,
                tp_phone_number: item?.ThirdParty?.phoneNumber,
                tp_provider_name: item?.ThirdParty?.providerName,
                tp_specific_course_website: item?.ThirdParty?.specificCourseWebsite,
              })),
            },
          },
        })

        if (response) {
          switch (kind) {
            case ScheduleStatus.DRAFT:
              setIsDraftSaved(true)
              setIsChanged(false)
              setIsEditMode(false)
              scheduleData.map((x) => (x.editable = false))
              setScheduleData(JSON.parse(JSON.stringify(scheduleData)))
              refetch()
              break
            case ScheduleStatus.SUBMITTED:
              setShowSubmitSuccessModal(true)
              setIsChanged(false)
              setIsEditMode(false)
              scheduleData.map((x) => (x.editable = false))
              setScheduleData(JSON.parse(JSON.stringify(scheduleData)))
              refetch()
              break
          }
        }
      }
    }
  }

  const startEdit = (periodIds: number[]) => {
    setIsEditMode(true)
    scheduleData.map((item) => (item.editable = periodIds.includes(item.period)))
    setScheduleData(JSON.parse(JSON.stringify(scheduleData)))
  }

  useEffect(() => {
    if (scheduleData?.length) {
      let isInvalid = false
      scheduleData.map((item) => {
        if (item?.CourseType) {
          switch (item.CourseType) {
            case CourseType.CUSTOM_BUILT:
              if (!item.CustomBuiltDescription) isInvalid = true
              break
            case CourseType.MTH_DIRECT:
              if (!item.OnSiteSplitEnrollment && !item.Course) isInvalid = true
              break
            case CourseType.THIRD_PARTY_PROVIDER:
              if (!item.ThirdParty) isInvalid = true
              break
          }
        } else {
          isInvalid = true
        }
      })
      setShowSubmitBtn(!isInvalid)
    }
  }, [scheduleData])

  useEffect(() => {
    if (!scheduleBuilderSettingLoading && scheduleBuilderSettingData?.getScheduleBuilder) {
      setParentTooltip(scheduleBuilderSettingData.getScheduleBuilder?.parent_tooltip)
    }
  }, [scheduleBuilderSettingLoading, scheduleBuilderSettingData])

  return (
    <>
      <ScheduleEditor
        scheduleData={scheduleData}
        splitEnrollment={splitEnrollment}
        isEditMode={isEditMode}
        scheduleStatus={studentScheduleStatus}
        parentTooltip={parentTooltip}
        setIsChanged={setIsChanged}
        setScheduleData={setScheduleData}
      />
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
          handleSubmit={() => setShowSubmitSuccessModal(false)}
        />
      )}
      {showRequestUpdatesModal && (
        <RequestUpdatesModal
          scheduleData={scheduleData}
          setShowEditModal={setShowRequestUpdatesModal}
          onSave={startEdit}
        />
      )}
      <Prompt
        when={showUnsavedModal}
        message={JSON.stringify({
          header: MthTitle.UNSAVED_TITLE,
          content: MthTitle.UNSAVED_DESCRIPTION,
        })}
      />
      <Box sx={{ mt: 3 }}>
        {(isEditMode || !studentScheduleStatus || studentScheduleStatus === ScheduleStatus.DRAFT) &&
          (showSubmitBtn ? (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingX: 6 }}>
              <Button onClick={() => handleSave(ScheduleStatus.DRAFT)} sx={mthButtonClasses.primary}>
                {MthTitle.SAVE_DRAFT}
              </Button>
              <Button onClick={() => handleSave(ScheduleStatus.SUBMITTED)} sx={mthButtonClasses.dark}>
                {isEditMode ? MthTitle.SUBMIT_UPDATES : MthTitle.SUBMIT}
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'end', paddingX: 6 }}>
              <Button onClick={() => handleSave(ScheduleStatus.DRAFT)} sx={mthButtonClasses.primary}>
                {MthTitle.SAVE_DRAFT}
              </Button>
            </Box>
          ))}
        {studentScheduleStatus === ScheduleStatus.SUBMITTED && !isEditMode && (
          <Box sx={{ display: 'flex', justifyContent: 'end', paddingX: 6 }}>
            <Button onClick={() => setShowRequestUpdatesModal(true)} sx={mthButtonClasses.orange}>
              {MthTitle.REQUEST_UPDATES}
            </Button>
          </Box>
        )}
      </Box>
    </>
  )
}

export default ScheduleBuilder
