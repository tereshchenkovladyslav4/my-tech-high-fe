import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Button, Card } from '@mui/material'
import { Box } from '@mui/system'
import { useHistory, useLocation } from 'react-router-dom'
import SignatureCanvas from 'react-signature-canvas'
import BGSVG from '@mth/assets/AdminApplicationBG.svg'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
import {
  DEFAULT_OPT_OUT_FORM_DESCRIPTION,
  DEFAULT_OPT_OUT_FORM_TITLE,
  DEFAULT_TESTING_PREFERENCE_DESCRIPTION,
  DEFAULT_TESTING_PREFERENCE_TITLE,
} from '@mth/constants'
import { FileCategory, MthRoute, MthTitle, OPT_TYPE, ScheduleStatus } from '@mth/enums'
import { diplomaQuestionForStudent, submitDiplomaAnswerGql } from '@mth/graphql/queries/diploma'
import { getSignatureInfoByStudentId } from '@mth/graphql/queries/user'
import {
  useActiveScheduleSchoolYears,
  useAssessmentsBySchoolYearId,
  useDiplomaSeekingOptionsByStudentIdAndSchoolYearId,
  useStudentInfo,
} from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getSignatureFile } from '@mth/screens/Admin/EnrollmentPackets/services'
import { AssessmentType } from '@mth/screens/Admin/SiteManagement/EnrollmentSetting/TestingPreference/types'
import { UpdateStudentMutation } from '@mth/screens/Admin/UserProfile/services'
import { uploadFile } from '@mth/services'
import { mthButtonClasses } from '@mth/styles/button.style'
import { calculateGrade, dataUrlToFile, extractContent, getRegionCode } from '@mth/utils'
import { defaultReduceFunds } from '@mth/utils/default-reduce-funds.util'
import { DiplomaSeeking } from './DiplomaSeeking'
import { HeaderComponent } from './HeaderComponent'
import { OptOutForm } from './OptOutForm'
import { ScheduleBuilder } from './ScheduleBuilder'
import { StudentInfo } from './StudentInfo'
import { scheduleClasses } from './styles'
import { TestingPreference } from './TestingPreference'
import { DiplomaQuestionType, ScheduleProps, StudentAssessment, StudentScheduleInfo } from './types'

const Schedule: React.FC<ScheduleProps> = ({ studentId }) => {
  const { me } = useContext(UserContext)
  const { search } = useLocation()
  const queryParams = new URLSearchParams(search)
  const backTo = queryParams.get('backTo')
  const history = useHistory()
  const student = useMemo(
    () => me?.students?.filter((item) => Number(item.student_id) == Number(studentId))?.at(0),
    [me?.students, studentId],
  )
  const [studentInfo, setStudentInfo] = useState<StudentScheduleInfo>()
  const [step, setStep] = useState<string>()
  const [availableAssessments, setAvailableAssessments] = useState<AssessmentType[]>([])
  const [studentAssessments, setStudentAssessments] = useState<StudentAssessment[]>([])
  const [testingPreferenceTitle, setTestingPreferenceTitle] = useState<string>('')
  const [signatureRef, setSignatureRef] = useState<SignatureCanvas | null>(null)
  const [testingPreferenceDescription, setTestingPreferenceDescription] = useState<string>('')
  const [invalidationTP, setInvalidationTP] = useState<number[]>([])
  const [optOutFormTitle, setOptOutFormTitle] = useState<string>('')
  const [optOutFormDescription, setOptOutFormDescription] = useState<string>('')
  const [invalidationOF, setInvalidationOF] = useState<boolean>(false)
  const [signatureName, setSignatureName] = useState<string>('')
  const [signatureFileId, setSignatureFileId] = useState<number>(0)
  const [signatureFileUrl, setSignatureFileUrl] = useState<string>('')
  const [activeTestingPreference, setActiveTestingPreference] = useState<boolean>(false)
  const [diplomaQuestion, setDiplomaQuestion] = useState<DiplomaQuestionType | undefined>()
  const [isDiplomaError, setIsDiplomaError] = useState<boolean>(false)
  const [scheduleStatus, setScheduleStatus] = useState<ScheduleStatus>()
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [showUnsavedModal, setShowUnsavedModal] = useState<boolean>(false)
  const [isUpdatePeriodRequested, setIsUpdatePeriodRequested] = useState<boolean>(false)
  const { studentInfo: studentInfoData } = useStudentInfo(+studentId)

  const {
    selectedYearId,
    setSelectedYearId,
    selectedYear,
    schoolYears,
    dropdownItems: schoolYearItems,
  } = useActiveScheduleSchoolYears(studentId)

  const isSplitEnrollment = useMemo(() => {
    const student_grade_level = student?.grade_levels?.length ? student?.grade_levels[0]?.grade_level : undefined
    const split_enrollment = selectedYear?.ScheduleBuilder?.split_enrollment
    const split_enrollment_grades = selectedYear?.ScheduleBuilder?.split_enrollment_grades?.split(',')
    return Boolean(split_enrollment && split_enrollment_grades?.includes(String(student_grade_level)))
  }, [selectedYear, student])

  const reduceFundsEnabled = useMemo(() => {
    return !!defaultReduceFunds(selectedYear)
  }, [selectedYear])

  const { diplomaOptions, diplomaAnswerRefetch } = useDiplomaSeekingOptionsByStudentIdAndSchoolYearId(
    selectedYearId || 0,
    studentId,
    !student || !studentId || !selectedYearId,
  )

  const { loading: diplomaLoading, data: diplomaData } = useQuery(diplomaQuestionForStudent, {
    variables: {
      schoolYearId: selectedYearId,
      studentId: studentId,
    },
    skip: !selectedYearId || !studentId,
    fetchPolicy: 'network-only',
  })

  const [saveDiplomaAnswer] = useMutation(submitDiplomaAnswerGql)

  const submitDiplomaAnswer = async (options: RadioGroupOption[]) => {
    const answerOption = options.find((item: RadioGroupOption) => item.value)
    const answer = answerOption?.option_id === 1 ? 1 : 0
    await saveDiplomaAnswer({
      variables: {
        saveDiplomaAnswerInput: {
          answer: answer,
          studentId: studentId,
          schoolYearId: selectedYearId,
        },
      },
    })
    await diplomaAnswerRefetch()
  }

  const { loading: assessmentsLoading, assessments } = useAssessmentsBySchoolYearId(selectedYearId)

  const { loading: signatureInfoLoading, data: signatureData } = useQuery(getSignatureInfoByStudentId, {
    variables: {
      studentId: studentId,
    },
    skip: !studentId,
    fetchPolicy: 'network-only',
  })

  const [getSignatureFileUrl, { loading: signatureFileUrlLoading, data: signatureFileData }] = useLazyQuery(
    getSignatureFile,
    {
      fetchPolicy: 'network-only',
    },
  )

  const [updateStudent] = useMutation(UpdateStudentMutation)

  const hasReasonRequired = () => {
    for (const assessment of availableAssessments) {
      const studentAssessment = studentAssessments
        ?.filter((item) => item?.assessmentId == assessment?.assessment_id)
        ?.at(-1)
      if (studentAssessment) {
        for (const option of assessment?.Options) {
          if (option.method == OPT_TYPE.OPT_OUT && option.option_id == studentAssessment.optionId) {
            return true
          }
        }
      }
    }
    return false
  }

  const showDiplomaSeeking = () => {
    return !!selectedYear?.diploma_seeking && !!diplomaQuestion
  }

  const isInvalid = () => {
    let invalid = false
    switch (step) {
      case MthTitle.STEP_TESTING_PREFERENCE:
        const tempArr: number[] = []
        availableAssessments?.map((assessment) => {
          const studentAssessment = studentAssessments?.filter(
            (item) => item?.assessmentId == assessment?.assessment_id,
          )
          if (!studentAssessment?.length) {
            invalid = true
            tempArr.push(assessment?.assessment_id)
          }
        })
        if (invalid) {
          setInvalidationTP(tempArr)
        }
        return invalid
      case MthTitle.STEP_OPT_OUT_FORM:
        availableAssessments?.map((assessment) => {
          const studentAssessment = studentAssessments
            ?.filter((item) => item?.assessmentId == assessment?.assessment_id)
            ?.at(-1)
          const option = assessment?.Options?.filter((item) => item?.option_id == studentAssessment?.optionId)?.at(-1)
          if (
            option?.method == OPT_TYPE.OPT_OUT &&
            ((option?.require_reason && !studentAssessment?.assessmentOptionOutText) ||
              !signatureName ||
              (signatureRef && signatureRef.isEmpty()))
          )
            invalid = true
          setInvalidationOF(true)
        })
        return invalid
      case MthTitle.STEP_DIPLOMA_SEEKING:
        const answerOb = diplomaOptions.find((item: RadioGroupOption) => item.value)
        if (!answerOb) {
          invalid = true
        }
        return invalid
      default:
        return true
    }
  }

  const uploadSignature = async (file: File) => {
    uploadFile(
      file,
      FileCategory.SIGNATURE,
      getRegionCode(me?.userRegion?.at(-1)?.regionDetail?.name || 'Arizona'),
    ).then(async (res) => {
      if (res.success && res.data?.file?.file_id) {
        await updateStudent({
          variables: {
            updateStudentInput: {
              student_id: studentId,
              opt_out_form_signature_file_id: Number(res.data?.file.file_id),
            },
          },
        })
        setSignatureFileId(Number(res.data?.file.file_id))
      }
    })
  }

  const handleSaveSignatureFile = async () => {
    if (signatureRef && !signatureRef.isEmpty()) {
      const file = await dataUrlToFile(signatureRef?.getTrimmedCanvas()?.toDataURL('image/png') || '', 'signature')
      if (file) await uploadSignature(file)
    }
  }

  const handleWithoutSaved = (isYes: boolean) => {
    setShowUnsavedModal(false)
    if (isYes) {
      setIsChanged(false)
      if (backTo) {
        setTimeout(() => {
          history.push(backTo)
        }, 300)
        return
      }
      if (showDiplomaSeeking()) setStep(MthTitle.STEP_DIPLOMA_SEEKING)
      else setStep(MthTitle.STEP_OPT_OUT_FORM)
    }
  }

  const handleNextStep = async () => {
    switch (step) {
      case MthTitle.STEP_TESTING_PREFERENCE:
        if (!isInvalid()) {
          if (hasReasonRequired()) setStep(MthTitle.STEP_OPT_OUT_FORM)
          else if (showDiplomaSeeking()) setStep(MthTitle.STEP_DIPLOMA_SEEKING)
          else setStep(MthTitle.STEP_SCHEDULE_BUILDER)
        }
        break
      case MthTitle.STEP_OPT_OUT_FORM:
        await handleSaveSignatureFile()
        if (!isInvalid()) {
          if (showDiplomaSeeking()) setStep(MthTitle.STEP_DIPLOMA_SEEKING)
          else setStep(MthTitle.STEP_SCHEDULE_BUILDER)
        }
        break
      case MthTitle.STEP_DIPLOMA_SEEKING:
        if (!isInvalid()) {
          // next schedule step
          setStep(MthTitle.STEP_SCHEDULE_BUILDER)
          setIsDiplomaError(false)
        } else {
          setIsDiplomaError(true)
        }
        break
    }
  }

  const handleBack = async () => {
    switch (step) {
      case MthTitle.STEP_TESTING_PREFERENCE:
        history.push(MthRoute.DASHBOARD)
        break
      case MthTitle.STEP_DIPLOMA_SEEKING:
        if (activeTestingPreference) {
          setInvalidationOF(false)
          if (hasReasonRequired()) setStep(MthTitle.STEP_OPT_OUT_FORM)
          else setStep(MthTitle.STEP_TESTING_PREFERENCE)
        } else history.push(MthRoute.DASHBOARD)
        break
      case MthTitle.STEP_OPT_OUT_FORM:
        await handleSaveSignatureFile()
        if (activeTestingPreference) setStep(MthTitle.STEP_TESTING_PREFERENCE)
        else history.push(MthRoute.DASHBOARD)
        break
      case MthTitle.STEP_SCHEDULE_BUILDER:
        if (isChanged) {
          setShowUnsavedModal(true)
        } else {
          if (backTo) history.push(backTo)
          else if (showDiplomaSeeking()) setStep(MthTitle.STEP_DIPLOMA_SEEKING)
          else if (activeTestingPreference) setStep(MthTitle.STEP_TESTING_PREFERENCE)
          else history.push(MthRoute.DASHBOARD)
        }
        break
      default:
        setStep(MthTitle.STEP_TESTING_PREFERENCE)
    }
  }

  const resetSignature = () => {
    signatureRef?.clear()
    setSignatureFileUrl('')
  }

  useEffect(() => {
    if (!signatureInfoLoading && signatureData) {
      setSignatureName(signatureData?.student?.opt_out_form_signature_name)
      setSignatureFileId(signatureData?.student?.opt_out_form_signature_file_id)
    }
  }, [signatureInfoLoading, signatureData])

  useEffect(() => {
    if (studentInfoData) {
      const specialEdOptions = studentInfoData.current_school_year_status?.special_ed_options?.split(',')
      let studentSpecialEd = ''
      specialEdOptions?.map((item, index) => {
        if (index == student?.special_ed) {
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
    if (!assessmentsLoading && assessments && selectedYear) {
      const filteredAssessments = assessments?.filter(
        (assessment) =>
          assessment?.grades?.includes(`${student?.grade_levels?.at(-1)?.grade_level}`) && !assessment?.is_archived,
      )
      setActiveTestingPreference(selectedYear?.testing_preference && !!filteredAssessments?.length)
      if (backTo) setStep(MthTitle.STEP_SCHEDULE_BUILDER)
      else if (selectedYear?.testing_preference && filteredAssessments?.length)
        setStep(MthTitle.STEP_TESTING_PREFERENCE)
      else if (selectedYear?.diploma_seeking) setStep(MthTitle.STEP_DIPLOMA_SEEKING)
      else setStep(MthTitle.STEP_SCHEDULE_BUILDER)
      setTestingPreferenceTitle(selectedYear?.testing_preference_title || DEFAULT_TESTING_PREFERENCE_TITLE)
      setTestingPreferenceDescription(
        selectedYear?.testing_preference_description || DEFAULT_TESTING_PREFERENCE_DESCRIPTION,
      )
      setOptOutFormTitle(selectedYear?.opt_out_form_title || DEFAULT_OPT_OUT_FORM_TITLE)
      setOptOutFormDescription(selectedYear?.opt_out_form_description || DEFAULT_OPT_OUT_FORM_DESCRIPTION)
      setAvailableAssessments(filteredAssessments)
    }
  }, [assessments, assessmentsLoading, selectedYear, backTo])

  useEffect(() => {
    if (signatureFileId) {
      getSignatureFileUrl({
        variables: {
          fileId: signatureFileId,
        },
      }).then(() => {})
    }
  }, [signatureFileId])

  useEffect(() => {
    if (!signatureFileUrlLoading && signatureFileData?.signatureFile?.signedUrl) {
      setSignatureFileUrl(signatureFileData?.signatureFile?.signedUrl)
    }
  }, [signatureFileUrlLoading, signatureFileData])

  useEffect(() => {
    setIsDiplomaError(false)
    if (!diplomaLoading) {
      if (diplomaData && diplomaData.getDiplomaQuestionForStudent) {
        setDiplomaQuestion({
          title: diplomaData.getDiplomaQuestionForStudent.title,
          description: extractContent(diplomaData.getDiplomaQuestionForStudent.description),
        })
      }
    }
  }, [diplomaLoading, diplomaData])

  return (
    <Card sx={{ margin: 4, padding: 4 }}>
      <Box
        sx={{
          ...scheduleClasses.container,
          backgroundImage: step == MthTitle.STEP_SCHEDULE_BUILDER ? '' : `url(${BGSVG})`,
        }}
      >
        <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
          <HeaderComponent
            scheduleStatus={scheduleStatus}
            isUpdatePeriodRequested={isUpdatePeriodRequested}
            title={MthTitle.SCHEDULE}
            handleBack={handleBack}
          />
          {step === MthTitle.STEP_SCHEDULE_BUILDER && (
            <DropDown
              dropDownItems={schoolYearItems}
              placeholder={'Select Year'}
              defaultValue={selectedYearId}
              borderNone={true}
              setParentValue={(val) => {
                setSelectedYearId(Number(val))
              }}
            />
          )}
        </Box>
        <StudentInfo studentInfo={studentInfo} />
        {step === MthTitle.STEP_TESTING_PREFERENCE && (
          <TestingPreference
            studentId={Number(studentId)}
            invalidationTP={invalidationTP}
            assessmentItems={availableAssessments}
            testingPreferenceTitle={testingPreferenceTitle}
            testingPreferenceDescription={testingPreferenceDescription}
            studentAssessments={studentAssessments}
            setStudentAssessments={setStudentAssessments}
          />
        )}
        {step === MthTitle.STEP_OPT_OUT_FORM && (
          <OptOutForm
            studentId={Number(studentId)}
            invalidationOF={invalidationOF}
            assessmentItems={availableAssessments}
            optOutFormTitle={optOutFormTitle}
            optOutFormDescription={optOutFormDescription}
            studentAssessments={studentAssessments}
            signatureRef={signatureRef}
            signatureFileUrl={signatureFileUrl}
            setStudentAssessments={setStudentAssessments}
            signatureName={signatureName}
            setSignatureRef={setSignatureRef}
            resetSignature={resetSignature}
            setSignatureName={setSignatureName}
          />
        )}
        {step === MthTitle.STEP_DIPLOMA_SEEKING && !!diplomaQuestion && (
          <DiplomaSeeking
            diplomaQuestion={diplomaQuestion}
            options={diplomaOptions}
            setOptions={submitDiplomaAnswer}
            isError={isDiplomaError}
          />
        )}
        {step === MthTitle.STEP_SCHEDULE_BUILDER && (
          <ScheduleBuilder
            studentId={studentId}
            studentName={student?.person?.first_name || ''}
            selectedYear={selectedYearId}
            showSecondSemester={
              selectedYear?.ScheduleStatus === ScheduleStatus.ACCEPTED && !!selectedYear?.IsSecondSemesterOpen
            }
            isUpdatePeriodRequested={isUpdatePeriodRequested}
            splitEnrollment={isSplitEnrollment}
            showUnsavedModal={showUnsavedModal}
            setScheduleStatus={setScheduleStatus}
            setIsUpdatePeriodRequested={setIsUpdatePeriodRequested}
            isChanged={isChanged}
            setIsChanged={setIsChanged}
            onWithoutSaved={handleWithoutSaved}
            reduceFundsEnabled={reduceFundsEnabled}
          />
        )}
        {step !== MthTitle.SCHEDULE && (
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button onClick={() => handleNextStep()} sx={mthButtonClasses.primary}>
              Next
            </Button>
          </Box>
        )}
      </Box>
    </Card>
  )
}

export default Schedule
