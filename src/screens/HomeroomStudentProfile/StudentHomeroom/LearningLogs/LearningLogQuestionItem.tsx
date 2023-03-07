import React from 'react'
import { Box, Button, Grid, TextField } from '@mui/material'
import { useFlag } from '@unleash/proxy-client-react'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { FormError } from '@mth/components/FormError'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { CheckBoxListVM, MthCheckboxList } from '@mth/components/MthCheckboxList'
import { MthRadioGroup } from '@mth/components/MthRadioGroup'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { EPIC_STORY_1183, EPIC_STORY_1184, QuestionTypes } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { LearningLogQuestion } from '@mth/models'
import SubjectQuestion from '@mth/screens/Admin/HomeRoom/LearningLogs/Master/AssignmentQuestion/SubjectQuestion'
import { mthButtonClasses } from '@mth/styles/button.style'
import { extractContent } from '@mth/utils/string.util'
import { IndependentQuestionItem } from './IndependentQuestionItem'

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
  const epicStory1183 = useFlag(EPIC_STORY_1183)
  const epicStory1184 = useFlag(EPIC_STORY_1184)
  const renderQuestionItem = () => {
    switch (question.type) {
      case QuestionTypes.TEXTBOX:
        return epicStory1184 ? (
          <Box sx={{ position: 'relative' }}>
            <Subtitle
              fontWeight='600'
              sx={{
                cursor: 'pointer',
                fontSize: '14px',
                paddingY: 1,
                color: showError && question?.required && !question.answer ? MthColor.RED : '',
              }}
            >
              {`${extractContent(question.question)} ${question?.required ? '*' : ''}`}
            </Subtitle>
            <MthBulletEditor
              value={question?.answer as string}
              setValue={(value) => handleChangeValue({ ...question, answer: value })}
              error={showError && question?.required && !question.answer}
            />
            {showError && question?.required && question?.answer == undefined && <FormError error={'Required'} />}
          </Box>
        ) : (
          <Box sx={{ position: 'relative' }}>
            <TextField
              name={extractContent(question.question)}
              label={`${extractContent(question.question)} ${question?.required ? '*' : ''}`}
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
        )
      case QuestionTypes.DROPDOWN:
        return (
          <Box sx={{ position: 'relative' }}>
            <Subtitle
              fontWeight='700'
              color={showError && question?.required && !question?.answer ? MthColor.RED : MthColor.SYSTEM_02}
              sx={{ cursor: 'pointer', fontSize: '18px' }}
            >
              {`${extractContent(question.question)} ${question?.required ? '*' : ''}`}
            </Subtitle>
            <DropDown
              dropDownItems={question?.Options as DropDownItem[]}
              placeholder={'Select'}
              defaultValue={question?.answer as string}
              setParentValue={(value) => handleChangeValue({ ...question, answer: value })}
              size='medium'
              sx={{ m: 0, mt: 2 }}
              error={{
                error: showError && question?.required && !question?.answer,
                errorMsg: 'Required',
              }}
            />
          </Box>
        )
      case QuestionTypes.AGREEMENT:
        return (
          <Box sx={{ width: '100%', position: 'relative' }}>
            <MthCheckbox
              label={`${extractContent(question.question)} ${question?.required ? '*' : ''}`}
              checked={!!question?.answer}
              onChange={(e) => handleChangeValue({ ...question, answer: e.target.checked })}
              labelSx={{
                color: showError && question?.required && question?.answer == undefined ? MthColor.RED : MthColor.BLACK,
              }}
            />
            {showError && question?.required && question?.answer == undefined && <FormError error={'Required'} />}
          </Box>
        )
      case QuestionTypes.INFORMATION:
        return (
          <Box sx={{ position: 'relative' }}>
            <Subtitle fontWeight='700' color={MthColor.SYSTEM_02} sx={{ cursor: 'pointer', fontSize: '18px' }}>
              {`${extractContent(question.question)}`}
            </Subtitle>
          </Box>
        )
      case QuestionTypes.UPLOAD:
        return (
          <Box>
            <Subtitle
              fontWeight='600'
              sx={{
                cursor: 'pointer',
                fontSize: '14px',
                paddingY: 1,
                color: showError && question?.required && question?.answer == undefined ? MthColor.RED : MthColor.BLACK,
              }}
            >
              {`${extractContent(question.question)} ${question?.required ? '*' : ''}`}
            </Subtitle>
            <Button
              data-testid='upload-button'
              sx={{ ...mthButtonClasses.roundDarkGray, padding: '8px 16px', height: 'unset', marginTop: 3 }}
            >
              Upload File(MAXIMUM OF 20MB)
            </Button>
            {showError && question?.required && question?.answer == undefined && <FormError error={'Required'} />}
          </Box>
        )
      case QuestionTypes.MULTIPLE_CHOSE:
        return (
          <Box sx={{ position: 'relative' }}>
            <Subtitle
              fontWeight='600'
              sx={{
                cursor: 'pointer',
                fontSize: '14px',
                paddingY: 1,
                color: showError && question?.required && !question.answer ? MthColor.RED : MthColor.BLACK,
              }}
            >
              {`${extractContent(question.question)} ${question?.required ? '*' : ''}`}
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
        )
      case QuestionTypes.CHECK_BOX: {
        return (
          <Box sx={{ position: 'relative' }}>
            <MthCheckboxList
              title={`${extractContent(question.question)} ${question?.required ? '*' : ''}`}
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
              error='Required'
            />
          </Box>
        )
      }
      case QuestionTypes.SUBJECT_QUESTION:
        return (
          <Box>
            {epicStory1183 && (
              <SubjectQuestion
                question={question}
                schoolYearId={schoolYearId}
                showError={showError}
                handleChangeValue={handleChangeValue}
              />
            )}
          </Box>
        )

      case QuestionTypes.INDEPENDENT_QUESTION:
        return (
          epicStory1183 && (
            <IndependentQuestionItem
              question={question}
              schoolYearId={schoolYearId}
              showError={showError}
              handleChangeValue={handleChangeValue}
            />
          )
        )

      default:
        return null
    }
  }

  return (
    <>
      <Grid item xs={12}>
        {renderQuestionItem()}
      </Grid>
      {question.Validations?.includes('can_upload') && (
        <Grid item xs={12} sx={{ paddingLeft: question?.parent_slug ? '50px' : 0 }}>
          <Button sx={{ ...mthButtonClasses.roundDarkGray, padding: '8px 16px', height: 'unset', marginTop: 3 }}>
            Upload File(MAXIMUM OF 20MB)
          </Button>
        </Grid>
      )}
    </>
  )
}
