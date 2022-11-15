import React, { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Button, Card, Grid } from '@mui/material'
import { Box } from '@mui/system'
import { Prompt, useHistory } from 'react-router-dom'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { DropDownItem } from '@mth/components/DropDown/types'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
import { SuccessModal } from '@mth/components/SuccessModal/SuccessModal'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { SCHEDULE_STATUS_OPTIONS, SPECIAL_EDUCATIONS } from '@mth/constants'
import { MthColor, MthTitle, ScheduleStatus } from '@mth/enums'
import { saveScheduleMutation, sendEmailUpdateRequired } from '@mth/graphql/mutation/schedule'
import { saveSchedulePeriodMutation } from '@mth/graphql/mutation/schedule-period'
import { useCurrentSchoolYearByRegionId, useStudentSchedulePeriods } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { ScheduleEditor } from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/ScheduleEditor'
import { StudentScheduleInfo } from '@mth/screens/Homeroom/Schedule/types'
import { StudentType } from '@mth/screens/HomeroomStudentProfile/Student/types'
import { gradeText } from '@mth/utils'
import { ENROLLMENT_SCHEDULE } from '../../../../utils/constants'
import { getStudentDetail } from '../../UserProfile/services'
import Header from './Header/Header'
import { RequireUpdateModal } from './RequireUpdateModal'
import { ScheduleHistory } from './ScheduleHistory'
import { ScheduleUpdatesRequiredEmail } from './ScheduleUpdatesRequriedEmail'
import StudentInfo from './StudentInfo/StudentInfo'
import { scheduleBuilderClass } from './styles'
import { UpdateRequiredPeriods } from './UpdateRequiredPeroids'

type ScheduleBuilderProps = {
  studentId: number
}

const ScheduleBuilder: React.FC<ScheduleBuilderProps> = ({ studentId }) => {
  const { me } = useContext(UserContext)
  const history = useHistory()
  const [studentInfo, setStudentInfo] = useState<StudentScheduleInfo>()
  const [selectedYear, setSelectedYear] = useState<number>(0)
  const [scheduleStatus, setScheduleStatus] = useState<DropDownItem>()
  const [isDraftSaved, setIsDraftSaved] = useState<boolean>(false)
  const [showSubmitSuccessModal, setShowSubmitSuccessModal] = useState<boolean>(false)
  const [showRequireUpdateModal, setShowRequireUpdateModal] = useState<boolean>(false)
  const [periodItems, setPeriodItems] = useState<CheckBoxListVM[]>([])
  const [requireUpdatePeriods, setRequireUpdatePeriods] = useState<string[]>([])
  const [splitEnrollment, setSplitEnrollment] = useState<boolean>(false)
  const [isChanged, setIsChanged] = useState(false)
  const [showUnsavedModal, setShowUnsavedModal] = useState<boolean>(false)
  const [showReset, setShowReset] = useState(false)

  const { loading: studentInfoLoading, data: studentInfoData } = useQuery(getStudentDetail, {
    variables: {
      student_id: studentId,
    },
    fetchPolicy: 'network-only',
  })

  const { data: currentSchoolYear, loading: currentSchoolYearLoading } = useCurrentSchoolYearByRegionId(
    me?.selectedRegionId || 0,
  )

  const { scheduleData, studentScheduleId, studentScheduleStatus, setScheduleData, setStudentScheduleId, refetch } =
    useStudentSchedulePeriods(studentId, selectedYear)

  const [submitScheduleBuilder] = useMutation(saveScheduleMutation)
  const [saveDraft] = useMutation(saveSchedulePeriodMutation)
  const [sendEmail] = useMutation(sendEmailUpdateRequired)

  const handleSave = async (status: ScheduleStatus) => {
    if (scheduleData?.length) {
      const submitResponse = await submitScheduleBuilder({
        variables: {
          createScheduleInput: {
            SchoolYearId: Number(selectedYear),
            StudentId: Number(studentId),
            status: status,
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
              param: scheduleData?.map((item) => {
                return status === ScheduleStatus.NOT_SUBMITTED
                  ? {
                      CourseId: null,
                      PeriodId: Number(item?.Period?.id),
                      ProviderId: null,
                      ScheduleId: Number(scheduleId),
                      SubjectId: null,
                      TitleId: null,
                      course_type: null,
                      custom_build_description: null,
                      osse_coures_name: null,
                      osse_district_school: null,
                      osse_school_district_name: null,
                      schedule_period_id: item?.schedulePeriodId,
                      tp_addtional_specific_course_website: null,
                      tp_course_name: null,
                      tp_phone_number: null,
                      tp_provider_name: null,
                      tp_specific_course_website: null,
                      update_required: item?.updateRequired,
                    }
                  : {
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
                      update_required: item?.updateRequired,
                    }
              }),
            },
          },
        })

        if (response) {
          switch (status) {
            case ScheduleStatus.DRAFT:
              setIsDraftSaved(true)
              refetch()
              break
            case ScheduleStatus.SUBMITTED:
              setShowSubmitSuccessModal(true)
              refetch()
              break
          }
        }
      }
      setIsChanged(false)
      handleBack()
    }
  }

  const handleYearDropDown = (year: number) => {
    setSelectedYear(year)
  }

  const updateScheduleStatus = async (num: string) => {
    const newStatus = SCHEDULE_STATUS_OPTIONS.find((item) => item.value === num) as DropDownItem
    if (newStatus?.value === ScheduleStatus.UPDATES_REQUIRED) {
      setShowRequireUpdateModal(true)
    }
    setScheduleStatus(newStatus)
  }

  const handleBack = () => {
    if (isChanged) setShowUnsavedModal(true)
    else history.push(ENROLLMENT_SCHEDULE)
  }

  const handleSchedule = (status: ScheduleStatus) => {
    if (status === ScheduleStatus.ACCEPTED) {
      setShowRequireUpdateModal(true)
    } else if (status === ScheduleStatus.SUBMITTED || status === ScheduleStatus.RESUBMITTED) {
      handleSave(ScheduleStatus.ACCEPTED)
    } else if (status === ScheduleStatus.UPDATES_REQUESTED) {
      handleSave(ScheduleStatus.UPDATES_REQUIRED)
    }
  }

  const handleSaveChanges = () => {
    setIsChanged(false)
  }

  const handleCancelUpdates = () => {
    setScheduleData(
      scheduleData?.map((item) => ({
        ...item,
        updateRequired: false,
      })),
    )
    setScheduleStatus(SCHEDULE_STATUS_OPTIONS.find((item) => item.value === studentScheduleStatus) as DropDownItem)
    setRequireUpdatePeriods([])
  }

  const handleResetSchedule = () => {
    setShowReset(true)
  }

  const handleRequireUpdate = (periods: string[]) => {
    setRequireUpdatePeriods(periods)
    setShowRequireUpdateModal(false)
  }

  const handlePeriodUpdateRequired = (periodId: string) => {
    setRequireUpdatePeriods([
      ...scheduleData
        ?.filter((item) => item?.updateRequired)
        ?.map((item) => {
          return `${item?.Period?.id}`
        }),
      periodId,
    ])
    setScheduleStatus(
      SCHEDULE_STATUS_OPTIONS.find((item) => item.value === ScheduleStatus.UPDATES_REQUIRED) as DropDownItem,
    )
  }

  const handlePeriodUpdateEmail = (periodId: string) => {
    if (requireUpdatePeriods.some((pid) => pid === periodId)) {
      handleCancelUpdates()
    } else {
      setRequireUpdatePeriods([periodId])
      setScheduleStatus(
        SCHEDULE_STATUS_OPTIONS.find((item) => item.value === ScheduleStatus.UPDATES_REQUIRED) as DropDownItem,
      )
    }
  }

  const handleEmailSend = async (from: string, subject: string, body: string) => {
    await sendEmail({
      variables: {
        updateRequiredEmail: {
          body: body,
          from: from,
          subject: subject,
          student_id: studentId,
          region_id: Number(me?.selectedRegionId),
        },
      },
    })
    handleSave(ScheduleStatus.UPDATES_REQUIRED)
  }

  useEffect(() => {
    if (!studentInfoLoading && studentInfoData) {
      const student: StudentType = studentInfoData?.student
      setStudentInfo({
        name: `${student?.person?.first_name} ${student?.person?.last_name}`,
        grade: gradeText(student),
        schoolDistrict: student?.packets?.at(-1)?.school_district || '',
        specialEd: `${SPECIAL_EDUCATIONS.find((item) => item.value == student?.special_ed)?.label}`,
      })
    }
  }, [studentInfoLoading, studentInfoData])

  useEffect(() => {
    if (!currentSchoolYearLoading && currentSchoolYear) {
      setSelectedYear(currentSchoolYear.school_year_id)
      setSplitEnrollment(currentSchoolYear?.ScheduleBuilder?.split_enrollment)
    }
  }, [currentSchoolYear, currentSchoolYearLoading])

  useEffect(() => {
    if (studentScheduleStatus) {
      setScheduleStatus(SCHEDULE_STATUS_OPTIONS.find((item) => item.value === studentScheduleStatus) as DropDownItem)
    }
  }, [studentScheduleStatus])

  useEffect(() => {
    if (scheduleData?.length) {
      setPeriodItems(
        scheduleData.map((item) => ({
          label: `Period ${item?.period} - ${item?.Title?.name} - ${
            item?.Title?.CourseTypes?.find((courseType) => courseType?.value === item?.CourseType)?.label
          }`,
          value: `${item?.Period?.id}`,
        })),
      )
    }
  }, [scheduleData])

  useEffect(() => {
    if (requireUpdatePeriods) {
      setScheduleData(
        scheduleData.map((item) => ({
          ...item,
          updateRequired: requireUpdatePeriods.includes(`${item?.Period?.id}`) ? true : false,
        })),
      )
      if (requireUpdatePeriods.length == 0)
        setScheduleStatus(SCHEDULE_STATUS_OPTIONS.find((item) => item.value === studentScheduleStatus) as DropDownItem)
    }
  }, [requireUpdatePeriods])

  return (
    <>
      <Card sx={scheduleBuilderClass.main}>
        <Prompt
          when={isChanged}
          message={JSON.stringify({
            header: MthTitle.UNSAVED_TITLE,
            content: MthTitle.UNSAVED_DESCRIPTION,
          })}
        />
        <Header
          title={MthTitle.SCHEDULE}
          selectedYear={selectedYear}
          scheduleStatus={scheduleStatus}
          onSelectYear={handleYearDropDown}
          handleBack={handleBack}
        />
        <StudentInfo
          studentInfo={studentInfo}
          scheduleStatus={scheduleStatus}
          onUpdateScheduleStatus={updateScheduleStatus}
        />
        <ScheduleEditor
          scheduleData={scheduleData}
          splitEnrollment={splitEnrollment}
          scheduleStatus={studentScheduleStatus}
          isAdmin={true}
          isEditMode={true}
          isUpdatePeriodRequired={requireUpdatePeriods?.length ? true : false}
          setIsChanged={setIsChanged}
          setScheduleData={setScheduleData}
          handlePeriodUpdateEmail={handlePeriodUpdateEmail}
          handlePeriodUpdateRequired={handlePeriodUpdateRequired}
        />
        <Box sx={scheduleBuilderClass.submit}>
          {!requireUpdatePeriods.length ? (
            <>
              <Button
                variant='contained'
                sx={{
                  background: `${
                    scheduleStatus?.value == ScheduleStatus.ACCEPTED
                      ? MthColor.ORANGE_GRADIENT
                      : MthColor.GREEN_GRADIENT
                  }`,
                }}
                onClick={() => handleSchedule(scheduleStatus?.value as ScheduleStatus)}
              >
                {scheduleStatus?.value == ScheduleStatus.ACCEPTED
                  ? 'Require Updates'
                  : scheduleStatus?.value == ScheduleStatus.UPDATES_REQUESTED
                  ? 'Allow Updates'
                  : MthTitle.ACCEPT}
              </Button>
              <Button
                variant='contained'
                sx={{
                  background:
                    scheduleStatus?.value == ScheduleStatus.UPDATES_REQUESTED
                      ? MthColor.BLACK_GRADIENT
                      : MthColor.LIGHTGRAY,
                  color: scheduleStatus?.value == ScheduleStatus.UPDATES_REQUESTED ? MthColor.WHITE : MthColor.BLACK,
                }}
                onClick={() => {
                  if (scheduleStatus?.value == ScheduleStatus.UPDATES_REQUESTED) handleSave(ScheduleStatus.ACCEPTED)
                  else handleSaveChanges()
                }}
              >
                {scheduleStatus?.value == ScheduleStatus.UPDATES_REQUESTED
                  ? 'Revert to Accepted'
                  : MthTitle.SAVE_CHANGES}
              </Button>
            </>
          ) : (
            scheduleStatus?.value === ScheduleStatus.ACCEPTED && (
              <Button
                variant='contained'
                sx={{ background: MthColor.BLACK_GRADIENT }}
                onClick={() => handleCancelUpdates()}
              >
                Cancel Updates
              </Button>
            )
          )}

          <Button variant='text' sx={{ fontWeight: 700, fontSize: '14px' }} onClick={() => handleResetSchedule()}>
            Reset Schedule
          </Button>
        </Box>
        <ScheduleHistory studentId={studentId} schoolYearId={selectedYear} />
        {showRequireUpdateModal && (
          <RequireUpdateModal
            periodItems={periodItems}
            handleCancelAction={() => {
              setShowRequireUpdateModal(false)
              setScheduleStatus(
                SCHEDULE_STATUS_OPTIONS.find((item) => item.value === studentScheduleStatus) as DropDownItem,
              )
            }}
            handleRequireUpdates={handleRequireUpdate}
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
        {showReset && (
          <CustomModal
            title={'Reset Schedule'}
            description={'Are you sure you want to reset this schedule?'}
            confirmStr='Reset'
            cancelStr='Cancel'
            onClose={() => {
              setShowReset(false)
            }}
            onConfirm={() => {
              setShowReset(false)
              handleSave(ScheduleStatus.NOT_SUBMITTED)
            }}
            backgroundColor='white'
          />
        )}
        {showUnsavedModal && (
          <CustomModal
            title={MthTitle.UNSAVED_TITLE}
            description={MthTitle.UNSAVED_DESCRIPTION}
            cancelStr='Cancel'
            confirmStr='Yes'
            backgroundColor={MthColor.WHITE}
            onClose={() => setShowUnsavedModal(false)}
            onConfirm={() => {
              setShowUnsavedModal(false)
              setIsChanged(false)
            }}
          />
        )}
        {showSubmitSuccessModal && (
          <SuccessModal
            title='Success'
            subtitle={
              <Paragraph size='large' color={MthColor.SYSTEM_01} textAlign='center'>
                {`${studentInfo?.name}'s schedule has been submitted successfully and is pending approval.`}
              </Paragraph>
            }
            btntitle='Done'
            handleSubmit={() => setShowSubmitSuccessModal(false)}
          />
        )}
      </Card>
      {!!requireUpdatePeriods?.length && (
        <Card sx={{ ...scheduleBuilderClass.main, paddingLeft: '30px' }}>
          <Subtitle size='medium' textAlign='left' fontWeight='700'>
            Update Required
          </Subtitle>
          <Box sx={{ width: '100%' }}>
            <Grid container justifyContent='start'>
              <Grid item xs={7} sx={{ textAlign: 'left', marginTop: 'auto', marginBottom: 'auto' }}>
                <ScheduleUpdatesRequiredEmail
                  handleCancelAction={handleCancelUpdates}
                  handleSendAction={handleEmailSend}
                />
              </Grid>
              <Grid item xs={5}>
                <UpdateRequiredPeriods
                  scheduleData={scheduleData}
                  requireUpdatePeriods={requireUpdatePeriods}
                  setRequiredUpdatePeriods={setRequireUpdatePeriods}
                />
              </Grid>
            </Grid>
          </Box>
        </Card>
      )}
    </>
  )
}

export default ScheduleBuilder
