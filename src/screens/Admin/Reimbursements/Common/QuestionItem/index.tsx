import React, { useState } from 'react'
import { Theme } from '@emotion/react'
import { withStyles } from '@material-ui/styles'
import DehazeIcon from '@mui/icons-material/Dehaze'
import { Box, Grid, IconButton, TextField, Tooltip } from '@mui/material'
import { SxProps } from '@mui/system'
import SignatureCanvas from 'react-signature-canvas'
import { SortableHandle } from 'react-sortable-hoc'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
import { MthRadioGroup } from '@mth/components/MthRadioGroup'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
import { QUESTION_TYPE } from '@mth/components/QuestionItem/QuestionItemProps'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { REIMBURSEMENT_FORM_TYPE_ITEMS } from '@mth/constants'
import { AdditionalQuestionAction, MthColor } from '@mth/enums'
import { ReimbursementQuestion } from '@mth/models'
import { extractContent } from '@mth/utils'

type QuestionProps = {
  question: ReimbursementQuestion
  setIsChanged: (value: boolean) => void
}

const DragHandle = SortableHandle(({ sx }: { sx?: SxProps<Theme> }) => (
  <Tooltip title='Move'>
    <IconButton
      sx={
        sx
          ? { position: 'absolute', top: '10px', marginLeft: '50px', ...sx }
          : { position: 'absolute', top: '10px', marginLeft: '50px' }
      }
    >
      <DehazeIcon />
    </IconButton>
  </Tooltip>
))

const CssTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderWidth: '1px !important',
        borderColor: 'black',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#333333',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#333333',
    },
  },
})(TextField)

export const QuestionItem: React.FC<QuestionProps> = ({ question }) => {
  const [signatureRef, setSignatureRef] = useState<SignatureCanvas | null>(null)

  const resetSignature = () => {
    signatureRef?.clear()
  }

  const renderQuestion = (question: ReimbursementQuestion) => {
    switch (question.type) {
      case QUESTION_TYPE.DROPDOWN: {
        return question.sortable ? (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <DropDown
                dropDownItems={question.slug == 'reimbursement_form_type' ? REIMBURSEMENT_FORM_TYPE_ITEMS : []}
                placeholder={extractContent(question.question)}
                labelTop
                defaultValue={question.slug == 'reimbursement_form_type' ? question.reimbursement_form_type : ''}
                setParentValue={() => {}}
                size='medium'
                sx={{ m: 0 }}
              />
              <DragHandle />
            </Box>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <DropDown
              dropDownItems={question.slug == 'reimbursement_form_type' ? REIMBURSEMENT_FORM_TYPE_ITEMS : []}
              placeholder={extractContent(question.question)}
              labelTop
              defaultValue={question.slug == 'reimbursement_form_type' ? question.reimbursement_form_type : ''}
              setParentValue={() => {}}
              size='medium'
              sx={{ m: 0 }}
            />
          </Grid>
        )
      }
      case QUESTION_TYPE.SIGNATURE: {
        return (
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: 'left',
                marginX: 'auto',
                paddingY: 5,
                width: '500px',
              }}
            >
              <Paragraph size={'large'} sx={{ paddingY: 1, textAlign: 'center' }}>
                {'Type full legal parent name and provide a digital signature below:'}
              </Paragraph>
              <Box sx={{ position: 'relative' }}>
                <TextField
                  name='title'
                  defaultValue={''}
                  placeholder='Entry'
                  fullWidth
                  sx={{ my: 1 }}
                  onChange={() => {}}
                />
                <DragHandle sx={{ marginLeft: '100px' }} />
              </Box>

              <Paragraph size={'large'} sx={{ paddingY: 1, textAlign: 'center' }}>
                {'Signature (use the mouse to sign):'}
              </Paragraph>
              <Box
                sx={{
                  borderBottom: `1px solid ${MthColor.BLACK}`,
                  mx: 'auto',
                  width: 500,
                  textAlign: 'center',
                }}
              >
                <SignatureCanvas
                  canvasProps={{ width: 500, height: 100 }}
                  ref={(ref) => {
                    setSignatureRef(ref)
                  }}
                />
              </Box>
              <Paragraph
                size='medium'
                sx={{ textDecoration: 'underline', cursor: 'pointer', textAlign: 'center' }}
                onClick={() => resetSignature()}
              >
                Reset
              </Paragraph>
            </Box>
          </Grid>
        )
      }
      case QUESTION_TYPE.TEXTBOX: {
        return question.sortable ? (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <CssTextField
                name={extractContent(question.question)}
                label={extractContent(question.question)}
                placeholder='Entry'
                fullWidth
                focused
                value={''}
                onChange={() => {}}
                InputLabelProps={{ shrink: true }}
              />
              <DragHandle />
            </Box>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <CssTextField
              name={extractContent(question.question)}
              label={extractContent(question.question)}
              placeholder='Entry'
              fullWidth
              focused
              value={''}
              onChange={() => {}}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        )
      }
      case QUESTION_TYPE.TEXTFIELD: {
        return question.sortable ? (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <Subtitle fontWeight='600' sx={{ cursor: 'pointer', fontSize: '14px', paddingY: 1 }}>
                {extractContent(question?.question)}
              </Subtitle>
              <MthBulletEditor value={''} setValue={() => {}} />
              <DragHandle sx={{ right: '-90px', top: '0px' }} />
            </Box>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <Subtitle fontWeight='600' sx={{ cursor: 'pointer', fontSize: '14px', paddingY: 1 }}>
                {extractContent(question?.question)}
              </Subtitle>
              <MthBulletEditor value={''} setValue={() => {}} />
            </Box>
          </Grid>
        )
      }
      case QUESTION_TYPE.INFORMATION: {
        return question.sortable ? (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              {question.slug === 'reimbursement_total_amount_requested' && (
                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                  <Subtitle fontWeight='700' color={MthColor.SYSTEM_02} sx={{ cursor: 'pointer', fontSize: '20px' }}>
                    {extractContent(question.question)}
                  </Subtitle>
                  <Subtitle fontWeight='700' color={MthColor.SYSTEM_02} sx={{ cursor: 'pointer', fontSize: '20px' }}>
                    {'$0.00'}
                  </Subtitle>
                </Box>
              )}
              {question.slug !== 'reimbursement_total_amount_requested' && (
                <Subtitle fontWeight='700' color={MthColor.SYSTEM_02} sx={{ cursor: 'pointer', fontSize: '18px' }}>
                  {extractContent(question.question)}
                </Subtitle>
              )}
              <DragHandle sx={{ right: '-90px', top: '-5px' }} />
            </Box>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Subtitle fontWeight='700' color={MthColor.SYSTEM_02} sx={{ cursor: 'pointer', fontSize: '18px' }}>
              {extractContent(question.question)}
            </Subtitle>
          </Grid>
        )
      }
      case QUESTION_TYPE.MULTIPLECHOICES: {
        return question.sortable ? (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <Subtitle fontWeight='600' sx={{ cursor: 'pointer', fontSize: '14px', paddingY: 1 }}>
                {extractContent(question?.question)}
              </Subtitle>
              <MthRadioGroup
                ariaLabel='reimbursement-questions'
                options={
                  question?.Options
                    ? question?.Options?.filter((item) => item?.label)?.map(
                        (option) =>
                          ({
                            label: option?.label,
                            value: false,
                            action: option.action || AdditionalQuestionAction.CONTINUE_TO_NEXT,
                          } as RadioGroupOption),
                      )
                    : []
                }
                handleChangeOption={() => {}}
              />
              <DragHandle sx={{ right: '-90px', top: '0px' }} />
            </Box>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <Subtitle fontWeight='600' sx={{ cursor: 'pointer', fontSize: '14px', paddingY: 1 }}>
                {extractContent(question?.question)}
              </Subtitle>
              <MthRadioGroup
                ariaLabel='reimbursement-questions'
                options={
                  question?.Options
                    ? question?.Options?.filter((item) => item?.label)?.map(
                        (option) =>
                          ({
                            label: option?.label,
                            value: false,
                            action: option.action || AdditionalQuestionAction.CONTINUE_TO_NEXT,
                          } as RadioGroupOption),
                      )
                    : []
                }
                handleChangeOption={() => {}}
              />
            </Box>
          </Grid>
        )
      }
      case QUESTION_TYPE.CHECKBOX: {
        return question.sortable ? (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <MthCheckboxList
                title={extractContent(question?.question)}
                values={[]}
                setValues={() => {}}
                checkboxLists={
                  question?.Options
                    ? question?.Options?.filter((item) => item?.label)?.map(
                        (option) =>
                          ({
                            label: option?.label,
                            value: option?.value,
                            action: option.action || AdditionalQuestionAction.CONTINUE_TO_NEXT,
                          } as CheckBoxListVM),
                      )
                    : []
                }
                haveSelectAll={false}
              />
              <DragHandle sx={{ right: '-90px', top: '0px' }} />
            </Box>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <MthCheckboxList
                title={extractContent(question?.question)}
                values={[]}
                setValues={() => {}}
                checkboxLists={
                  question?.Options
                    ? question?.Options?.filter((item) => item?.label)?.map(
                        (option) =>
                          ({
                            label: option?.label,
                            value: option?.value,
                            action: option.action || AdditionalQuestionAction.CONTINUE_TO_NEXT,
                          } as CheckBoxListVM),
                      )
                    : []
                }
                haveSelectAll={false}
              />
            </Box>
          </Grid>
        )
      }
      default:
        return (
          <>
            <Box sx={{ display: 'none' }}>
              <DragHandle />
            </Box>
          </>
        )
    }
  }

  return <>{renderQuestion(question)}</>
}
