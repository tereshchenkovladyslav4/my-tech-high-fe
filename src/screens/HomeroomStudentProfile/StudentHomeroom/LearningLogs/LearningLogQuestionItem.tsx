import React from 'react'
import { Box, Button, Grid, TextField } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { FormError } from '@mth/components/FormError'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { CheckBoxListVM, MthCheckboxList } from '@mth/components/MthCheckboxList'
import { MthRadioGroup } from '@mth/components/MthRadioGroup'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { QuestionTypes } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { LearningLogQuestion } from '@mth/models'
import SubjectQuestion from '@mth/screens/Admin/HomeRoom/LearningLogs/Master/AssignmentQuestion/SubjectQuestion'
import { mthButtonClasses } from '@mth/styles/button.style'
import { extractContent } from '@mth/utils/string.util'

type LearningLogQuestionItemProps = {
  question: LearningLogQuestion
  schoolYearId: number
  showError: boolean
  handleChangeValue: (question: LearningLogQuestion) => void
}

export const LearningLogQuestionItem: React.FC<LearningLogQuestionItemProps> = ({
  question,
  showError,
  schoolYearId,
  handleChangeValue,
}) => {
  const renderQuestionItem = () => {
    switch (question.type) {
      case QuestionTypes.TEXTBOX:
        return (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <TextField
                name={extractContent(question.question)}
                label={extractContent(question.question)}
                placeholder='Entry'
                fullWidth
                focused
                className='MthFormField'
                value={question?.answer}
                onChange={(event) => handleChangeValue({ ...question, answer: event?.target?.value })}
                InputLabelProps={{ shrink: true }}
                error={showError && question?.required && !question.answer}
                helperText={showError && question?.required && !question.answer && 'Required'}
              />
            </Box>
          </Grid>
        )
      case QuestionTypes.DROPDOWN:
        return (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <DropDown
                dropDownItems={question?.Options as DropDownItem[]}
                placeholder={extractContent(question.question)}
                labelTop
                defaultValue={question?.answer as string}
                setParentValue={(value) => handleChangeValue({ ...question, answer: value })}
                size='medium'
                sx={{ m: 0 }}
                error={{
                  error: showError && question?.required && !question?.answer,
                  errorMsg: 'Required',
                }}
              />
            </Box>
          </Grid>
        )
      case QuestionTypes.AGREEMENT:
        return (
          <Grid item xs={12}>
            <Box sx={{ width: '100%', position: 'relative' }}>
              <MthCheckbox
                label={extractContent(question?.question)}
                checked={!!question?.answer}
                onChange={(e) => handleChangeValue({ ...question, answer: e.target.checked })}
              />
              {showError && question?.required && question?.answer == undefined && <FormError error={'Required'} />}
            </Box>
          </Grid>
        )
      case QuestionTypes.INFORMATION:
        return (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <Subtitle fontWeight='700' color={MthColor.SYSTEM_02} sx={{ cursor: 'pointer', fontSize: '18px' }}>
                {extractContent(question.question)}
              </Subtitle>
            </Box>
          </Grid>
        )
      case QuestionTypes.UPLOAD:
        return (
          <Grid item xs={12}>
            <Box>
              <Subtitle fontWeight='600' sx={{ cursor: 'pointer', fontSize: '14px', paddingY: 1 }}>
                {extractContent(question?.question)}
              </Subtitle>
              <MthBulletEditor
                setValue={(val) => handleChangeValue({ ...question, answer: val })}
                value={question.answer as string}
              />
              <Button
                data-testid='upload-button'
                sx={{ ...mthButtonClasses.roundDarkGray, padding: '8px 16px', height: 'unset', marginTop: 3 }}
              >
                Upload File(MAXIMUM OF 20MB)
              </Button>
              {showError && question?.required && question?.answer == undefined && <FormError error={'Required'} />}
            </Box>
          </Grid>
        )
      case QuestionTypes.MULTIPLE_CHOSE:
        return (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <Subtitle fontWeight='600' sx={{ cursor: 'pointer', fontSize: '14px', paddingY: 1 }}>
                {`${extractContent(question?.question)} *`}
              </Subtitle>
              <MthRadioGroup
                ariaLabel='learning-log-questions'
                options={
                  question?.answer
                    ? JSON.parse(question?.answer as string)
                    : question?.Options
                    ? (question?.Options as RadioGroupOption[])
                        ?.filter((item: RadioGroupOption) => item?.label)
                        ?.map(
                          (option: RadioGroupOption, index) =>
                            ({
                              label: option?.label,
                              value: false,
                              action: option.action || 1,
                              option_id: option.option_id || index,
                            } as RadioGroupOption),
                        )
                    : []
                }
                handleChangeOption={(values) => handleChangeValue({ ...question, answer: JSON.stringify(values) })}
                isError={showError && question?.required && !question.answer}
              />
            </Box>
          </Grid>
        )
      case QuestionTypes.CHECK_BOX: {
        return (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <MthCheckboxList
                title={extractContent(question?.question)}
                values={question?.answer ? JSON.parse(question.answer as string) : []}
                setValues={(values: string[]) => handleChangeValue({ ...question, answer: JSON.stringify(values) })}
                checkboxLists={
                  question?.Options
                    ? (question?.Options as DropDownItem[])
                        ?.filter((item) => item?.label)
                        ?.map(
                          (option) =>
                            ({
                              label: option?.label,
                              value: `${option?.value}`,
                              action: option.action || 1,
                            } as CheckBoxListVM),
                        )
                    : []
                }
                haveSelectAll={false}
                showError={showError && question?.required && !question.answer}
                error={'Required'}
              />
            </Box>
          </Grid>
        )
      }
      case QuestionTypes.SUBJECT_QUESTION:
        return (
          <Grid item xs={12}>
            <Box>
              <SubjectQuestion question={question} schoolYearId={schoolYearId} />
            </Box>
          </Grid>
        )

      default:
        return null
    }
  }

  return (
    <>
      {renderQuestionItem()}
      {question.Validations?.includes('can_upload') && (
        <Grid item xs={12}>
          <Button sx={{ ...mthButtonClasses.roundDarkGray, padding: '8px 16px', height: 'unset', marginTop: 3 }}>
            Upload File(MAXIMUM OF 20MB)
          </Button>
        </Grid>
      )}
    </>
  )
}
