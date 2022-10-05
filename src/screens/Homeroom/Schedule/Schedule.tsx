import React, { useContext, useEffect, useState } from 'react'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Button, Card } from '@mui/material'
import { Box } from '@mui/system'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import SignatureCanvas from 'react-signature-canvas'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
import {
  DEFAULT_OPT_OUT_FORM_DESCRIPTION,
  DEFAULT_OPT_OUT_FORM_TITLE,
  DEFAULT_TESTING_PREFERENCE_DESCRIPTION,
  DEFAULT_TESTING_PREFERENCE_TITLE,
  DEFUALT_DIPLOMA_QUESTION_DESCRIPTION,
  DEFUALT_DIPLOMA_QUESTION_TITLE,
  SNOWPACK_PUBLIC_S3_URL,
} from '@mth/constants'
import { MthRoute, MthTitle, OPT_TYPE } from '@mth/enums'
import { diplomaAnswerGql, diplomaQuestionForStudent, submitDiplomaAnswerGql } from '@mth/graphql/queries/diploma'
import { getSignatureInfoByStudentId } from '@mth/graphql/queries/user'
import { useAssessmentsBySchoolYearId, useQuestionBySlugAndRegion } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getSignatureFile } from '@mth/screens/Admin/EnrollmentPackets/services'
import { AssessmentType } from '@mth/screens/Admin/SiteManagement/EnrollmentSetting/TestingPreference/types'
import { UpdateStudentMutation } from '@mth/screens/Admin/UserProfile/services'
import { extractContent, gradeNum, gradeText } from '@mth/utils'
import { DiplomaSeeking } from './DiplomaSeeking'
import { HeaderComponent } from './HeaderComponent'
import { OptOutForm } from './OptOutForm'
import { StudentInfo } from './StudentInfo'
import { scheduleClassess } from './styles'
import { TestingPreference } from './TestingPreference'
import { ScheduleProps, StudentAssessment, StudentScheduleInfo, DiplomaQuestionType } from './types'

const Schedule: React.FC<ScheduleProps> = ({ studentId }) => {
  const { me } = useContext(UserContext)
  const history = useHistory()
  const students = me?.students
  const student = students?.filter((item) => Number(item.student_id) == Number(studentId))?.at(0)
  const [studentInfo, setStudentInfo] = useState<StudentScheduleInfo>()
  const [step, setStep] = useState<string>(MthTitle.STEP_TESTING_PREFERENCE)
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
  const [activeDiplomaSeeking, setActiveDiplomaSeeking] = useState<boolean>(false)
  const [diplomaQuestion, setDiplomaQuestion] = useState<DiplomaQuestionType>({
    title: '',
    description: '',
  })
  const [isDiplomaError, setIsDiplomaError] = useState<boolean>(false)

  const [diplomaOptions, setDiplomaOptions] = useState<RadioGroupOption[]>([
    {
      option_id: 1,
      label: 'Yes',
      value: false,
    },
    {
      option_id: 2,
      label: 'No',
      value: false,
    },
  ])

  const { loading: diplomaLoading, data: diplomaData } = useQuery(diplomaQuestionForStudent, {
    variables: {
      diplomaQuestionInput: {
        schoolYearId: Number(student?.current_school_year_status?.school_year_id),
        grades: gradeNum(student),
      },
    },
    skip: !student || !studentId || step !== MthTitle.STEP_DIPLOMA_SEEKING,
    fetchPolicy: 'network-only',
  })

  const {
    loading: diplomaAnswerLoading,
    data: diplomaAnswerData,
    refetch: diplomaAnswerRefetch,
  } = useQuery(diplomaAnswerGql, {
    variables: {
      diplomaAnswerInput: {
        schoolYearId: Number(student?.current_school_year_status?.school_year_id),
        studentId: studentId,
      },
    },
    skip: !student || !studentId || step !== MthTitle.STEP_DIPLOMA_SEEKING,
    fetchPolicy: 'network-only',
  })

  const { decideSpecialEduData, loadedDecideSpecialEdu } = useQuestionBySlugAndRegion(
    studentId,
    'meta_special_education',
  )

  const [saveDiplomaAnswer] = useMutation(submitDiplomaAnswerGql)

  const submitDiplomaAnswer = async (options: RadioGroupOption[]) => {
    const answerOption = options.find((item: RadioGroupOption) => item.value === true)
    const answer = answerOption?.option_id === 1 ? 1 : 0
    await saveDiplomaAnswer({
      variables: {
        saveDiplomaAnswerInput: {
          answer: answer,
          studentId: studentId,
          schoolYearId: Number(student?.current_school_year_status?.school_year_id),
        },
      },
    })
    diplomaAnswerRefetch()
  }

  const { assessments, loading, schoolYear } = useAssessmentsBySchoolYearId(
    Number(student?.current_school_year_status?.school_year_id),
  )

  const { loading: signatureInfoLoading, data: signatureData } = useQuery(getSignatureInfoByStudentId, {
    variables: {
      studentId: studentId,
    },
    skip: studentId ? false : true,
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
        const answerOb = diplomaOptions.find((item: RadioGroupOption) => item.value === true)
        if (!answerOb) {
          invalid = true
        }
        return invalid
      default:
        return true
    }
  }

  const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
    const res: Response = await fetch(dataUrl)
    const blob: Blob = await res.blob()
    return new File([blob], fileName, { type: 'image/png' })
  }

  const uploadSignature = async (file: File) => {
    const bodyFormData = new FormData()
    bodyFormData.append('file', file)
    bodyFormData.append('region', me?.userRegion?.at(-1)?.regionDetail?.name || 'Arizona')
    bodyFormData.append('year', moment(new Date()).format('YYYY'))
    fetch(SNOWPACK_PUBLIC_S3_URL, {
      method: 'POST',
      body: bodyFormData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('JWT')}`,
      },
    }).then((res) => {
      res.json().then(async ({ data }) => {
        await updateStudent({
          variables: {
            updateStudentInput: {
              student_id: studentId,
              opt_out_form_signature_file_id: Number(data.file.file_id),
            },
          },
        })
        setSignatureFileId(Number(data.file.file_id))
      })
    })
  }

  const handleSaveSignatureFile = async () => {
    if (signatureRef && !signatureRef.isEmpty()) {
      const file = await dataUrlToFile(signatureRef?.getTrimmedCanvas()?.toDataURL('image/png') || '', 'signature')
      if (file) uploadSignature(file)
    }
  }

  const handleNextStep = () => {
    switch (step) {
      case MthTitle.STEP_TESTING_PREFERENCE:
        if (!isInvalid()) {
          if (hasReasonRequired()) setStep(MthTitle.STEP_OPT_OUT_FORM)
          else if (activeDiplomaSeeking) setStep(MthTitle.STEP_DIPLOMA_SEEKING)
          else setStep('')
        }
        break
      case MthTitle.STEP_OPT_OUT_FORM:
        handleSaveSignatureFile()
        if (!isInvalid()) {
          if (activeDiplomaSeeking) setStep(MthTitle.STEP_DIPLOMA_SEEKING)
          else setStep('')
        }
        break
      case MthTitle.STEP_DIPLOMA_SEEKING:
        if (!isInvalid()) {
          // next schedule step
          setStep(MthTitle.SCHEDULE)
          setIsDiplomaError(false)
        } else {
          setIsDiplomaError(true)
        }
        break
    }
  }

  const handleBack = () => {
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
        handleSaveSignatureFile()
        if (activeTestingPreference) setStep(MthTitle.STEP_TESTING_PREFERENCE)
        else history.push(MthRoute.DASHBOARD)
        break
      case MthTitle.SCHEDULE:
        setStep(MthTitle.STEP_DIPLOMA_SEEKING)
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
    if (student) {
      setStudentInfo({
        name: `${student.person?.first_name} ${student.person?.last_name}`,
        grade: gradeText(student),
        schoolDistrict: student?.packets?.at(-1)?.school_district || '',
        specialEd: '',
      })
    }
  }, [student])

  useEffect(() => {
    if (!loading && assessments && schoolYear) {
      setActiveTestingPreference(schoolYear?.testing_preference)
      if (schoolYear?.testing_preference) setStep(MthTitle.STEP_TESTING_PREFERENCE)
      else if (schoolYear?.diploma_seeking) setStep(MthTitle.STEP_DIPLOMA_SEEKING)
      else setStep('')
      setActiveDiplomaSeeking(schoolYear?.diploma_seeking)
      setTestingPreferenceTitle(schoolYear?.testing_preference_title || DEFAULT_TESTING_PREFERENCE_TITLE)
      setTestingPreferenceDescription(
        schoolYear?.testing_preference_description || DEFAULT_TESTING_PREFERENCE_DESCRIPTION,
      )
      setOptOutFormTitle(schoolYear?.opt_out_form_title || DEFAULT_OPT_OUT_FORM_TITLE)
      setOptOutFormDescription(schoolYear?.opt_out_form_description || DEFAULT_OPT_OUT_FORM_DESCRIPTION)
      setAvailableAssessments(
        assessments?.filter(
          (assessment) =>
            assessment?.grades?.includes(`${student?.grade_levels?.at(-1)?.grade_level}`) && !assessment?.is_archived,
        ),
      )
    }
  }, [assessments, loading, schoolYear])

  useEffect(() => {
    if (signatureFileId) {
      getSignatureFileUrl({
        variables: {
          fileId: signatureFileId,
        },
      })
    }
  }, [signatureFileId])

  useEffect(() => {
    if (!signatureFileUrlLoading && signatureFileData?.signatureFile?.signedUrl) {
      setSignatureFileUrl(signatureFileData?.signatureFile?.signedUrl)
    }
  }, [signatureFileUrlLoading, signatureFileData])

  useEffect(() => {
    if (loadedDecideSpecialEdu) {
      if (studentInfo) setStudentInfo({ ...studentInfo, specialEd: decideSpecialEduData.label || '' })
    }
  }, [loadedDecideSpecialEdu, decideSpecialEduData])

  useEffect(() => {
    setIsDiplomaError(false)
    if (!diplomaLoading) {
      if (diplomaData && diplomaData.getDiplomaQuestionForStudent) {
        setDiplomaQuestion({
          title: diplomaData.getDiplomaQuestionForStudent.title,
          description: extractContent(diplomaData.getDiplomaQuestionForStudent.description),
        })
      } else {
        setDiplomaQuestion({
          title: DEFUALT_DIPLOMA_QUESTION_TITLE,
          description: DEFUALT_DIPLOMA_QUESTION_DESCRIPTION.replace(
            '%REGION_NAME%',
            me?.userRegion?.at(-1)?.regionDetail?.name || '',
          ),
        })
      }
    }
  }, [diplomaLoading, diplomaData])

  useEffect(() => {
    if (!diplomaAnswerLoading) {
      if (diplomaAnswerData && diplomaAnswerData.getDiplomaAnswer) {
        setDiplomaOptions([
          {
            option_id: 1,
            label: 'Yes',
            value: 1 === diplomaAnswerData.getDiplomaAnswer.answer,
          },
          {
            option_id: 2,
            label: 'No',
            value: 0 === diplomaAnswerData.getDiplomaAnswer.answer,
          },
        ])
      }
    }
  }, [diplomaAnswerLoading, diplomaAnswerData])

  return (
    <Card sx={{ margin: 4, padding: 4 }}>
      <Box sx={scheduleClassess.container}>
        <HeaderComponent title={MthTitle.SCHEDULE} handleBack={handleBack} />
        <StudentInfo studentInfo={studentInfo} />
        {step == MthTitle.STEP_TESTING_PREFERENCE && (
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
        {step == MthTitle.STEP_OPT_OUT_FORM && (
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
        {step == MthTitle.STEP_DIPLOMA_SEEKING && (
          <DiplomaSeeking
            diplomaQuestion={diplomaQuestion}
            options={diplomaOptions}
            setOptions={submitDiplomaAnswer}
            isError={isDiplomaError}
          />
        )}
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button onClick={() => handleNextStep()} variant='contained' sx={scheduleClassess.button}>
            {'Next'}
          </Button>
        </Box>
      </Box>
    </Card>
  )
}

export default Schedule
