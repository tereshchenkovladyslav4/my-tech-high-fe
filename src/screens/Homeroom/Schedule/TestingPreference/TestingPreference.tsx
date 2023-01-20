import React, { useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Box } from '@mui/system'
import { MthRadioGroup } from '@mth/components/MthRadioGroup'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { OPT_TYPE } from '@mth/enums'
import { updateStudentAssessmentMutation } from '@mth/graphql/mutation/assessment'
import { getStudentAssessmentsByStudentId } from '@mth/graphql/queries/assessment'
import TestingPreferenceInformation from '@mth/screens/Admin/SiteManagement/EnrollmentSetting/TestingPreference/TestingPreferenceInformation'
import { extractContent } from '@mth/utils'
import { TestingPreferenceProps } from '../types'
import { testingPrefrenceClassess } from './styles'

const TestingPreference: React.FC<TestingPreferenceProps> = ({
  studentId,
  assessmentItems,
  testingPreferenceTitle,
  testingPreferenceDescription,
  invalidationTP,
  studentAssessments,
  setStudentAssessments,
}) => {
  const { loading: studentAssessmentLoading, data: studentAssessmentsData } = useQuery(
    getStudentAssessmentsByStudentId,
    {
      variables: {
        studentId: Number(studentId),
      },
      skip: Number(studentId) ? false : true,
      fetchPolicy: 'network-only',
    },
  )
  const [submitSave, {}] = useMutation(updateStudentAssessmentMutation)
  const handleChangeOptions = async (assessmentId: number, options: RadioGroupOption[]) => {
    if (options) {
      const response = await submitSave({
        variables: {
          studentAssessmentInput: {
            AssessmentId: Number(assessmentId),
            OptionId: options?.filter((option) => option.value)?.at(0)?.option_id,
            StudentId: Number(studentId),
            out_text: '',
          },
        },
      })
      if (response) {
        const studentAssessment = response.data?.createOrUpdateStudentAssessment
        setStudentAssessments([
          ...studentAssessments.filter((item) => item.assessmentId != Number(studentAssessment?.AssessmentId)),
          {
            assessmentId: studentAssessment?.AssessmentId,
            assessmentOptionId: studentAssessment?.assessment_option_id,
            optionId: studentAssessment?.OptionId,
            assessmentOptionOutText: studentAssessment?.out_text,
          },
        ])
      }
    }
  }

  const checkValue = (option_id: number | undefined) => {
    if (option_id) return studentAssessments?.filter((item) => item?.optionId == option_id)?.length ? true : false
    else return false
  }

  useEffect(() => {
    if (!studentAssessmentLoading && studentAssessmentsData?.getStudentAssessmentsByStudentId) {
      setStudentAssessments(
        studentAssessmentsData?.getStudentAssessmentsByStudentId?.map(
          (assessment: { AssessmentId: number; assessment_option_id: number; OptionId: number; out_text: string }) => ({
            assessmentId: assessment?.AssessmentId,
            assessmentOptionId: assessment?.assessment_option_id,
            optionId: assessment?.OptionId,
            assessmentOptionOutText: assessment?.out_text,
          }),
        ),
      )
    }
  }, [studentAssessmentLoading, studentAssessmentsData])

  return (
    <Box sx={testingPrefrenceClassess.main}>
      <TestingPreferenceInformation
        information={{ title: testingPreferenceTitle, description: testingPreferenceDescription }}
      />
      {assessmentItems?.map((assessmentItem, index) => (
        <Box key={index} sx={{ marginTop: 4 }}>
          <Subtitle sx={testingPrefrenceClassess.formError}>
            {invalidationTP?.length > 0 && invalidationTP.includes(assessmentItem.assessment_id) && 'Response Required'}
          </Subtitle>
          <MthRadioGroup
            ariaLabel={`testing_preference_${index}`}
            title={assessmentItem?.test_name}
            description={extractContent(assessmentItem?.information)}
            options={assessmentItem?.Options?.map((option) => ({
              option_id: option?.option_id || 0,
              label: option?.label,
              value: checkValue(option?.option_id),
              color: option?.method == OPT_TYPE?.OPT_OUT ? '#ccc' : '#000',
            }))}
            handleChangeOption={(options) => handleChangeOptions(assessmentItem?.assessment_id, options)}
          />
        </Box>
      ))}
    </Box>
  )
}

export default TestingPreference
