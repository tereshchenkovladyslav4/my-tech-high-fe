import React, { useContext, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Button, Card, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { cloneDeep } from 'lodash'
import { Prompt, useHistory, useLocation } from 'react-router-dom'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { DropDownItem } from '@mth/components/DropDown/types'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/types'
import { SuccessModal } from '@mth/components/SuccessModal/SuccessModal'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { SCHEDULE_STATUS_OPTIONS } from '@mth/constants'
import { MthColor, MthRoute, MthTitle, SchedulePeriodStatus, ScheduleStatus } from '@mth/enums'
import {
  saveScheduleMutation,
  sendUpdatesAllowedEmailMutation,
  sendUpdatesRequiredEmailMutation,
} from '@mth/graphql/mutation/schedule'
import { saveSchedulePeriodMutation } from '@mth/graphql/mutation/schedule-period'
import { useActiveScheduleSchoolYears, useStudentInfo, useStudentSchedulePeriods } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { ScheduleEditor } from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/ScheduleEditor'
import { scheduleBuilderClasses } from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/styles'
import { ScheduleData, StudentScheduleInfo } from '@mth/screens/Homeroom/Schedule/types'
import { calculateGrade } from '@mth/utils'
import { SEMESTER_TYPE } from '../../Curriculum/types'
import Header from './Header/Header'
import { RequireUpdateModal } from './RequireUpdateModal'
import { ScheduleHistory } from './ScheduleHistory'
import StudentInfo from './StudentInfo/StudentInfo'
import { scheduleBuilderClass } from './styles'
import { UpdatesRequired } from './UpdatesRequried'

type ScheduleBuilderProps = {
  studentId: number
}

const ScheduleBuilder: React.FC<ScheduleBuilderProps> = ({ studentId }) => {
  const { me } = useContext(UserContext)
  const { search } = useLocation()
  const queryParams = new URLSearchParams(search)
  const viewonly = queryParams.get('viewonly') == 'true'
  const defaultSchoolYearId = Number(queryParams.get('defaultSchoolYear') || 0)
  const history = useHistory()
  const [studentInfo, setStudentInfo] = useState<StudentScheduleInfo>()
  const [scheduleStatus, setScheduleStatus] = useState<DropDownItem>()
  const [isDraftSaved, setIsDraftSaved] = useState<boolean>(false)
  const [showSubmitSuccessModal, setShowSubmitSuccessModal] = useState<boolean>(false)
  const [showRequireUpdateModal, setShowRequireUpdateModal] = useState<boolean>(false)
  const [periodItems, setPeriodItems] = useState<CheckBoxListVM[]>([])
  const [requireUpdatePeriods, setRequireUpdatePeriods] = useState<string[]>([])
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [showUnsavedModal, setShowUnsavedModal] = useState<boolean>(false)
  const [showReset, setShowReset] = useState<boolean>(false)
  const [isLockedKey, setIsLockedKey] = useState<boolean>(true)
  const [isSecondSemesterLockedKey, setIsSecondSemesterLockedKey] = useState<boolean>(false)

  const { studentInfo: studentInfoData } = useStudentInfo(+studentId)

  const {
    selectedYearId,
    setSelectedYearId,
    selectedYear,
    schoolYears,
    dropdownItems: schoolYearItems,
  } = useActiveScheduleSchoolYears(studentId, defaultSchoolYearId)

  const {
    scheduleData,
    hasSecondSemester,
    setScheduleData,
    secondScheduleData,
    setSecondScheduleData,
    studentScheduleId,
    setStudentScheduleId,
    studentScheduleStatus,
    firstSemesterScheduleId,
    hasUnlockedPeriods,
    refetch,
  } = useStudentSchedulePeriods(studentId, selectedYearId, false, isLockedKey)

  const [submitScheduleBuilder] = useMutation(saveScheduleMutation)
  const [saveDraft] = useMutation(saveSchedulePeriodMutation)
  const [sendUpdatesRequiredEmail] = useMutation(sendUpdatesRequiredEmailMutation)
  const [sendUpdatesAllowedEmail] = useMutation(sendUpdatesAllowedEmailMutation)

  const handleSave = async (
    status: ScheduleStatus,
    clickedAcceptAsSecondSemester = false,
    clickedSaveChange = false,
  ) => {
    const data = hasSecondSemester ? secondScheduleData : scheduleData
    if (data?.length) {
      const submitResponse = await submitScheduleBuilder({
        variables: {
          createScheduleInput: {
            SchoolYearId: Number(selectedYearId),
            StudentId: Number(studentId),
            status: status,
            schedule_id:
              !clickedAcceptAsSecondSemester &&
              hasSecondSemester &&
              !hasUnlockedPeriods &&
              status === ScheduleStatus.ACCEPTED
                ? firstSemesterScheduleId
                : studentScheduleId,
            is_second_semester:
              !clickedAcceptAsSecondSemester &&
              hasSecondSemester &&
              !hasUnlockedPeriods &&
              status === ScheduleStatus.ACCEPTED
                ? false
                : hasSecondSemester,
            is_sending_email:
              status === ScheduleStatus.ACCEPTED ? scheduleStatus?.value === studentScheduleStatus : false,
          },
        },
      })

      if (submitResponse) {
        const scheduleId = submitResponse.data?.createOrUpdateSchedule?.schedule_id
        setStudentScheduleId(scheduleId)
        const response = await saveDraft({
          variables: {
            createSchedulePeriodInput: {
              param: data?.map((item) => {
                return status === ScheduleStatus.NOT_SUBMITTED && !clickedSaveChange
                  ? {
                      CourseId: null,
                      PeriodId: null,
                      ProviderId: null,
                      ScheduleId: Number(scheduleId),
                      SubjectId: null,
                      TitleId: null,
                      course_type: null,
                      custom_build_description: null,
                      osse_course_name: null,
                      osse_district_school: null,
                      osse_school_district_name: null,
                      schedule_period_id: item?.schedulePeriodId,
                      tp_additional_specific_course_website: null,
                      tp_course_name: null,
                      tp_phone_number: null,
                      tp_provider_name: null,
                      tp_specific_course_website: null,
                      status: item?.schedulePeriodStatus,
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
                        status === ScheduleStatus.UPDATES_REQUIRED &&
                        item?.schedulePeriodStatus === SchedulePeriodStatus.UPDATE_REQUESTED
                          ? SchedulePeriodStatus.UPDATE_REQUIRED
                          : status === ScheduleStatus.ACCEPTED
                          ? null
                          : item?.schedulePeriodStatus,
                    }
              }),
            },
          },
        })

        if (response) {
          if (hasSecondSemester) {
            setSecondScheduleData(cloneDeep(data))
          } else {
            setScheduleData(cloneDeep(data))
          }
        }
      }
      setIsChanged(false)
      if (status !== ScheduleStatus.NOT_SUBMITTED && !clickedSaveChange) {
        setTimeout(() => {
          history.push(MthRoute.ENROLLMENT_SCHEDULE.toString())
        }, 300)
      }
      if (status === ScheduleStatus.NOT_SUBMITTED || clickedSaveChange) {
        refetch()
      }
    }
  }

  const updateScheduleStatus = async (num: string) => {
    const newStatus = SCHEDULE_STATUS_OPTIONS.find((item) => item.value === num) as DropDownItem
    if (newStatus?.value === ScheduleStatus.UPDATES_REQUIRED) {
      setShowRequireUpdateModal(true)
    } else {
      setIsChanged(true)
    }
    setScheduleStatus(newStatus)
  }

  const handleSchedule = (status: ScheduleStatus, clickedAcceptAsSecondSemester = false) => {
    if (status === ScheduleStatus.ACCEPTED) {
      setShowRequireUpdateModal(true)
    } else if (status === ScheduleStatus.SUBMITTED || status === ScheduleStatus.RESUBMITTED) {
      setTimeout(() => handleSave(ScheduleStatus.ACCEPTED, clickedAcceptAsSecondSemester), 300)
    } else if (status === ScheduleStatus.UPDATES_REQUESTED) {
      handleSendUpdatesAllowedEmail()
      handleSave(ScheduleStatus.UPDATES_REQUIRED)
    }
  }

  const handleSaveChanges = () => {
    if (isChanged) {
      setIsChanged(false)
      handleSave(scheduleStatus?.value as ScheduleStatus, false, true)
    }
  }

  const handleCancelUpdates = () => {
    if (hasSecondSemester)
      setSecondScheduleData(
        secondScheduleData?.map((item) => ({
          ...item,
          schedulePeriodStatus: item.originalSchedulePeriodStatus,
          standardResponseOptions: '',
        })),
      )
    else
      setScheduleData(
        scheduleData?.map((item) => ({
          ...item,
          schedulePeriodStatus: item.originalSchedulePeriodStatus,
          standardResponseOptions: '',
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
    if (
      studentScheduleStatus !== ScheduleStatus.ACCEPTED &&
      studentScheduleStatus !== ScheduleStatus.UPDATES_REQUESTED
    ) {
      const data = hasSecondSemester ? secondScheduleData : scheduleData
      setRequireUpdatePeriods([
        ...data
          ?.filter((item) => item?.schedulePeriodStatus === SchedulePeriodStatus.UPDATE_REQUIRED)
          ?.map((item) => {
            return `${item?.Period?.id}`
          }),
        periodId,
      ])
      setScheduleStatus(
        SCHEDULE_STATUS_OPTIONS.find((item) => item.value === ScheduleStatus.UPDATES_REQUIRED) as DropDownItem,
      )
    }
  }

  const handlePeriodUpdateEmail = (periodId: string) => {
    const data = hasSecondSemester ? secondScheduleData : scheduleData
    if (requireUpdatePeriods.some((pid) => pid === periodId)) {
      const periodIds = requireUpdatePeriods.filter((obj) => obj !== periodId)
      if (periodIds.length > 0) {
        setRequireUpdatePeriods(periodIds)
      } else {
        handleCancelUpdates()
      }
    } else {
      setRequireUpdatePeriods([
        ...data
          ?.filter((item) => item?.schedulePeriodStatus === SchedulePeriodStatus.UPDATE_REQUIRED)
          ?.map((item) => {
            return `${item?.Period?.id}`
          }),
        periodId,
      ])
      setScheduleStatus(
        SCHEDULE_STATUS_OPTIONS.find((item) => item.value === ScheduleStatus.UPDATES_REQUIRED) as DropDownItem,
      )
    }
  }

  const handleEmailSend = async (from: string, subject: string, body: string) => {
    await sendUpdatesRequiredEmail({
      variables: {
        updateRequiredEmail: {
          body: body,
          from: from,
          subject: subject,
          student_id: studentId,
          region_id: Number(me?.selectedRegionId),
          schedule_id: studentScheduleId,
        },
      },
    })
    await handleSave(ScheduleStatus.UPDATES_REQUIRED)
  }

  const handleSendUpdatesAllowedEmail = async () => {
    await sendUpdatesAllowedEmail({
      variables: {
        updatesAllowedEmail: {
          student_id: studentId,
          region_id: Number(me?.selectedRegionId),
          schedule_id: studentScheduleId,
        },
      },
    })
  }

  const handleSecondSemSchedulePeriodStatusChange = async (
    schedule: ScheduleData,
    status: SchedulePeriodStatus | undefined,
  ) => {
    if (schedule) {
      setSecondScheduleData(
        secondScheduleData?.map((item) => {
          if (item?.Period?.id == schedule.Period?.id)
            return {
              ...item,
              schedulePeriodStatus: status,
            }
          else return { ...item }
        }),
      )
      const data = secondScheduleData?.filter(
        (item) => item?.Period?.id == schedule.Period?.id && item?.showButtonName === SchedulePeriodStatus.NO_UPDATES,
      )
      await handleSave(data?.length ? studentScheduleStatus : ScheduleStatus.ACCEPTED)
    }
  }

  useEffect(() => {
    if (studentInfoData) {
      const specialEdOptions = studentInfoData.current_school_year_status?.special_ed_options?.split(',')
      let studentSpecialEd = ''
      specialEdOptions?.map((item, index) => {
        if (index == studentInfoData.special_ed) {
          studentSpecialEd = item
        }
      })
      setStudentInfo({
        name: `${studentInfoData.person?.first_name} ${studentInfoData.person?.last_name}`,
        grade: calculateGrade(studentInfoData, schoolYears, selectedYear),
        schoolDistrict: studentInfoData.person?.address?.school_district || '',
        specialEd: studentSpecialEd,
        schoolOfEnrollment: studentInfoData.currentSoe?.find((item) => item?.school_year_id === selectedYearId)?.partner
          ?.name,
      })
    }
  }, [studentInfoData, schoolYears, selectedYear])

  useEffect(() => {
    setScheduleStatus(
      (SCHEDULE_STATUS_OPTIONS.find((item) => item.value === studentScheduleStatus) ||
        SCHEDULE_STATUS_OPTIONS.find((item) => item.value === ScheduleStatus.NOT_SUBMITTED)) as DropDownItem,
    )
  }, [studentScheduleStatus])

  useEffect(() => {
    if (scheduleData?.length || secondScheduleData?.length) {
      const filteredScheduleData = secondScheduleData.filter(
        (item) => item.FirstSemesterSchedule?.Period?.semester !== SEMESTER_TYPE.NONE,
      )
      const data = hasSecondSemester
        ? filteredScheduleData.length > 0
          ? filteredScheduleData
          : secondScheduleData
        : scheduleData

      setPeriodItems(
        data.map((item) => ({
          label: `Period ${item?.period} - ${item?.Title?.name} - ${
            item?.Title?.CourseTypes?.find((courseType) => courseType?.value === item?.CourseType)?.label
          }`,
          value: `${item?.Period?.id}`,
        })),
      )
    }
  }, [scheduleData, hasSecondSemester, hasUnlockedPeriods, secondScheduleData])

  useEffect(() => {
    if (requireUpdatePeriods) {
      if (hasSecondSemester)
        setSecondScheduleData(
          secondScheduleData.map((item) => ({
            ...item,
            editable: requireUpdatePeriods.includes(`${item?.Period?.id}`) ? true : item.editable,
            schedulePeriodStatus: requireUpdatePeriods.includes(`${item?.Period?.id}`)
              ? SchedulePeriodStatus.UPDATE_REQUIRED
              : item.schedulePeriodStatus === SchedulePeriodStatus.UPDATE_REQUIRED
              ? item.originalSchedulePeriodStatus
              : item.schedulePeriodStatus,
          })),
        )
      else
        setScheduleData(
          scheduleData.map((item) => ({
            ...item,
            editable: requireUpdatePeriods.includes(`${item?.Period?.id}`) ? true : item.editable,
            schedulePeriodStatus: requireUpdatePeriods.includes(`${item?.Period?.id}`)
              ? SchedulePeriodStatus.UPDATE_REQUIRED
              : item.schedulePeriodStatus === SchedulePeriodStatus.UPDATE_REQUIRED
              ? item.originalSchedulePeriodStatus
              : item.schedulePeriodStatus,
          })),
        )
      if (requireUpdatePeriods.length == 0)
        setScheduleStatus(SCHEDULE_STATUS_OPTIONS.find((item) => item.value === studentScheduleStatus) as DropDownItem)
    }
  }, [requireUpdatePeriods])

  return (
    <>
      <Card sx={scheduleBuilderClass.main}>
        {!viewonly && (
          <Prompt
            when={isChanged}
            message={JSON.stringify({
              header: MthTitle.UNSAVED_TITLE,
              content: MthTitle.UNSAVED_DESCRIPTION,
            })}
          />
        )}
        <Header
          title={MthTitle.SCHEDULE}
          scheduleStatus={scheduleStatus}
          schoolYearItems={schoolYearItems}
          selectedYearId={selectedYearId}
          setSelectedYearId={setSelectedYearId}
          handleBack={() => {
            if (isChanged) setShowUnsavedModal(true)
            else history.push(MthRoute.ENROLLMENT_SCHEDULE.toString())
          }}
          viewonly={viewonly}
        />
        <StudentInfo
          viewonly={viewonly}
          studentInfo={studentInfo}
          scheduleStatus={scheduleStatus}
          onUpdateScheduleStatus={updateScheduleStatus}
        />
        {hasSecondSemester && hasUnlockedPeriods && (
          <Typography sx={{ ...scheduleBuilderClasses.semesterTitle, marginTop: 3 }}>
            {MthTitle.FIRST_SEMESTER}
          </Typography>
        )}
        {(!hasSecondSemester || (hasSecondSemester && hasUnlockedPeriods)) && (
          <ScheduleEditor
            scheduleData={scheduleData}
            splitEnrollment={!!selectedYear?.ScheduleBuilder?.split_enrollment}
            scheduleStatus={hasSecondSemester ? ScheduleStatus.ACCEPTED : studentScheduleStatus}
            selectedScheduleStatus={scheduleStatus?.value as ScheduleStatus}
            isAdmin={true}
            isEditMode={!hasSecondSemester && !viewonly}
            viewonly={viewonly}
            isUpdatePeriodRequired={!!requireUpdatePeriods?.length}
            setIsChanged={setIsChanged}
            setScheduleData={setScheduleData}
            handlePeriodUpdateEmail={handlePeriodUpdateEmail}
            handlePeriodUpdateRequired={handlePeriodUpdateRequired}
            isLockedKey={isLockedKey}
            setIsLockedKey={(value: boolean) => {
              setIsLockedKey(value)
              refetch()
            }}
          />
        )}

        {hasSecondSemester && hasUnlockedPeriods && (
          <Typography sx={{ ...scheduleBuilderClasses.semesterTitle, mt: 4 }}>{MthTitle.SECOND_SEMESTER}</Typography>
        )}
        {hasSecondSemester && (
          <ScheduleEditor
            scheduleData={secondScheduleData}
            splitEnrollment={!!selectedYear?.ScheduleBuilder?.split_enrollment}
            isAdmin={true}
            isEditMode={!viewonly}
            viewonly={viewonly}
            hasUnlockedPeriods={hasUnlockedPeriods}
            selectedScheduleStatus={scheduleStatus?.value as ScheduleStatus}
            isSecondSemester={true}
            scheduleStatus={studentScheduleStatus}
            setIsChanged={setIsChanged}
            setScheduleData={setSecondScheduleData}
            handleSecondSemSchedulePeriodStatusChange={handleSecondSemSchedulePeriodStatusChange}
            isLockedKey={isSecondSemesterLockedKey}
            setIsLockedKey={(value: boolean) => {
              setIsSecondSemesterLockedKey(value)
              refetch()
            }}
          />
        )}
        {!viewonly && studentScheduleStatus && studentScheduleStatus !== ScheduleStatus.DRAFT && (
          <Box sx={scheduleBuilderClass.submit}>
            {!requireUpdatePeriods.length ? (
              <>
                {studentScheduleStatus !== ScheduleStatus.UPDATES_REQUIRED && (
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
                )}
                {hasSecondSemester && !hasUnlockedPeriods && scheduleStatus?.value == ScheduleStatus.RESUBMITTED && (
                  <Button
                    variant='contained'
                    sx={{
                      width: '200px !important',
                      background: `${MthColor.ORANGE_GRADIENT}`,
                    }}
                    onClick={() => {
                      handleSchedule(scheduleStatus?.value as ScheduleStatus, true)
                    }}
                  >
                    {MthTitle.ACCEPT_AS_SECOND_SEMESTER}
                  </Button>
                )}
                <Button
                  variant='contained'
                  sx={{
                    background:
                      scheduleStatus?.value === ScheduleStatus.UPDATES_REQUESTED
                        ? MthColor.BLACK_GRADIENT
                        : MthColor.LIGHTGRAY,
                    color: scheduleStatus?.value === ScheduleStatus.UPDATES_REQUESTED ? MthColor.WHITE : MthColor.BLACK,
                    marginLeft: studentScheduleStatus === ScheduleStatus.UPDATES_REQUIRED ? 25 : 0,
                  }}
                  onClick={() => {
                    if (scheduleStatus?.value === ScheduleStatus.UPDATES_REQUESTED) handleSave(ScheduleStatus.ACCEPTED)
                    else handleSaveChanges()
                  }}
                >
                  {scheduleStatus?.value === ScheduleStatus.UPDATES_REQUESTED
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
        )}
        {!viewonly &&
          studentScheduleStatus !== ScheduleStatus.NOT_SUBMITTED &&
          studentScheduleStatus !== ScheduleStatus.SUBMITTED && (
            <ScheduleHistory
              studentId={studentId}
              schoolYearId={selectedYearId || 0}
              isSecondSemester={hasSecondSemester && hasUnlockedPeriods}
              refetchSchedule={refetch}
            />
          )}
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
              setTimeout(() => {
                history.push(MthRoute.ENROLLMENT_SCHEDULE.toString())
              }, 300)
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
      {!viewonly && !!requireUpdatePeriods?.length && (
        <UpdatesRequired
          studentId={studentId}
          scheduleData={hasSecondSemester ? secondScheduleData : scheduleData}
          requireUpdatePeriods={requireUpdatePeriods}
          setScheduleData={hasSecondSemester ? setSecondScheduleData : setScheduleData}
          handleCancelUpdates={handleCancelUpdates}
          handleEmailSend={handleEmailSend}
          setRequireUpdatePeriods={setRequireUpdatePeriods}
        />
      )}
    </>
  )
}

export default ScheduleBuilder
