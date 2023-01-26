import React from 'react'
import { useMutation } from '@apollo/client'
import { TextField } from '@mui/material'
import { Box } from '@mui/system'
import SignatureCanvas from 'react-signature-canvas'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { DEFAULT_REASON } from '@mth/constants'
import { MthColor, OPT_TYPE } from '@mth/enums'
import { updateStudentAssessmentMutation } from '@mth/graphql/mutation/assessment'
import TestingPreferenceInformation from '@mth/screens/Admin/SiteManagement/EnrollmentSetting/TestingPreference/TestingPreferenceInformation'
import { UpdateStudentMutation } from '@mth/screens/Admin/UserProfile/services'
import { extractContent } from '@mth/utils'
import { OptOutFormProps } from '../types'
import { optOutFormClassess } from './styles'

const OptOutForm: React.FC<OptOutFormProps> = ({
  studentId,
  assessmentItems,
  optOutFormTitle,
  optOutFormDescription,
  invalidationOF,
  studentAssessments,
  signatureName,
  signatureRef,
  signatureFileUrl,
  setSignatureRef,
  resetSignature,
  setSignatureName,
  setStudentAssessments,
}) => {
  const [submitSave, {}] = useMutation(updateStudentAssessmentMutation)
  const [updateStudent] = useMutation(UpdateStudentMutation)

  const handleChangeSignatureName = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    await updateStudent({
      variables: {
        updateStudentInput: {
          student_id: studentId,
          opt_out_form_signature_name: e?.target?.value,
        },
      },
    })
    setSignatureName(e?.target?.value)
  }

  const handleChangeValue = async (value: string, assessmentId: number, optionId: number) => {
    const response = await submitSave({
      variables: {
        studentAssessmentInput: {
          AssessmentId: Number(assessmentId),
          OptionId: Number(optionId),
          StudentId: Number(studentId),
          out_text: value,
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

  const renderItems = () => {
    return assessmentItems?.map((assessmentItem, index) => {
      const studentAssessment = studentAssessments
        ?.filter((item) => item?.assessmentId == assessmentItem?.assessment_id)
        ?.at(-1)
      if (studentAssessment && assessmentItem?.Options?.length) {
        const selectedOption = assessmentItem?.Options?.filter(
          (option) => option?.method == OPT_TYPE.OPT_OUT && option?.option_id == studentAssessment?.optionId,
        )?.at(-1)
        return (
          selectedOption && (
            <Box key={index} sx={{ marginTop: 4 }}>
              <Subtitle sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 700 }}>
                {assessmentItem?.test_name}
              </Subtitle>
              {selectedOption.require_reason && (
                <>
                  <Paragraph size={'large'} sx={{ paddingY: 1 }}>
                    {extractContent(selectedOption.reason) || DEFAULT_REASON}
                  </Paragraph>
                  <TextField
                    name='title'
                    placeholder='Entry'
                    fullWidth
                    defaultValue={studentAssessment.assessmentOptionOutText}
                    sx={{ my: 1 }}
                    onChange={(e) =>
                      handleChangeValue(e?.target?.value, assessmentItem?.assessment_id, selectedOption.option_id || 0)
                    }
                    error={invalidationOF && !studentAssessment.assessmentOptionOutText}
                  />
                  {invalidationOF && !studentAssessment.assessmentOptionOutText && (
                    <Subtitle sx={optOutFormClassess.formError}>{'Required'}</Subtitle>
                  )}
                </>
              )}
            </Box>
          )
        )
      } else {
        return <></>
      }
    })
  }

  return (
    <>
      <Box sx={optOutFormClassess.main}>
        <TestingPreferenceInformation information={{ title: optOutFormTitle, description: optOutFormDescription }} />
        {renderItems()}
      </Box>
      <Box sx={optOutFormClassess.signBox}>
        <Paragraph size={'large'} sx={{ paddingY: 1, textAlign: 'center' }}>
          {'Type full legal parent name and provide a digital signature below:'}
        </Paragraph>
        <TextField
          name='title'
          defaultValue={signatureName}
          placeholder='Entry'
          fullWidth
          sx={{ my: 1 }}
          onChange={(e) => handleChangeSignatureName(e)}
          error={invalidationOF && !signatureName}
          helperText={invalidationOF && !signatureName && 'Required'}
        />
        <Paragraph size={'large'} sx={{ paddingY: 1, textAlign: 'center' }}>
          {'Signature (use the mouse to sign):'}
        </Paragraph>
        <Box
          sx={{
            borderBottom:
              invalidationOF && signatureRef?.isEmpty()
                ? `1px solid ${MthColor.ERROR_RED}`
                : `1px solid ${MthColor.BLACK}`,
            mx: 'auto',
            width: 500,
            textAlign: 'center',
          }}
        >
          {signatureFileUrl ? (
            <img src={signatureFileUrl} alt='signature' style={{ width: 'auto' }} />
          ) : (
            <SignatureCanvas
              canvasProps={{ width: 500, height: 100 }}
              ref={(ref) => {
                setSignatureRef(ref)
              }}
            />
          )}
        </Box>
        <Paragraph
          size='medium'
          sx={{ textDecoration: 'underline', cursor: 'pointer', textAlign: 'center' }}
          onClick={() => resetSignature()}
        >
          Reset
        </Paragraph>
      </Box>
    </>
  )
}

export default OptOutForm
