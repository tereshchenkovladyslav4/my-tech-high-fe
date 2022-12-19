import React, { useState } from 'react'
import { Theme } from '@emotion/react'
import { withStyles } from '@material-ui/styles'
import DehazeIcon from '@mui/icons-material/Dehaze'
import { Box, Grid, IconButton, TextField, Tooltip } from '@mui/material'
import { SxProps } from '@mui/system'
import SignatureCanvas from 'react-signature-canvas'
import { SortableHandle } from 'react-sortable-hoc'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { QUESTION_TYPE } from '@mth/components/QuestionItem/QuestionItemProps'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { REIMBURSEMENT_FORM_TYPE_ITEMS } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { ReimbursementQuestion } from '@mth/models'

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

const Question: React.FC<QuestionProps> = ({ question }) => {
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
                placeholder={question.question}
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
              placeholder={question.question}
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
      case QUESTION_TYPE.TEXTFIELD: {
        return question.sortable ? (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <CssTextField
                name={question.question}
                label={question.question}
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
              name={question.question}
              label={question.question}
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

      case QUESTION_TYPE.INFORMATION: {
        return question.sortable ? (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              {question.slug === 'reimbursement_total_amount_requested' && (
                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                  <Subtitle fontWeight='700' color={MthColor.SYSTEM_02} sx={{ cursor: 'pointer', fontSize: '20px' }}>
                    {question.question}
                  </Subtitle>
                  <Subtitle fontWeight='700' color={MthColor.SYSTEM_02} sx={{ cursor: 'pointer', fontSize: '20px' }}>
                    {'$0.00'}
                  </Subtitle>
                </Box>
              )}
              {question.slug !== 'reimbursement_total_amount_requested' && (
                <Subtitle fontWeight='700' color={MthColor.SYSTEM_02} sx={{ cursor: 'pointer', fontSize: '18px' }}>
                  {question.question}
                </Subtitle>
              )}
              <DragHandle sx={{ right: '-90px', top: '-5px' }} />
            </Box>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Subtitle fontWeight='700' color={MthColor.SYSTEM_02} sx={{ cursor: 'pointer', fontSize: '18px' }}>
              {question.question}
            </Subtitle>
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

export default Question
