import React, { useState, useEffect, useContext, FunctionComponent, ReactElement } from 'react'
import DehazeIcon from '@mui/icons-material/Dehaze'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EditIcon from '@mui/icons-material/Edit'
import {
  Box,
  Checkbox,
  IconButton,
  outlinedInputClasses,
  Radio,
  TextField,
  Grid,
  FormGroup,
  FormControl,
  FormControlLabel,
  Tooltip,
} from '@mui/material'
import { useFormikContext } from 'formik'
import { SortableHandle } from 'react-sortable-hoc'
import { v4 as uuidv4 } from 'uuid'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, QUESTION_TYPE } from '@mth/enums'
import { CustomModal } from '../components/CustomModal/CustomModals'
import { ProgramYearContext } from '../provider/ProgramYearProvider'
import { AddNewQuestionModal } from './AddNewQuestion'
import { TabContext } from './TabContextProvider'
import { EnrollmentQuestion, EnrollmentQuestionTab } from './types'

type EnrollmentQuestionItemProps = {
  item: EnrollmentQuestion[]
  group: string
  mainQuestion?: boolean
}

const DragHandle = SortableHandle(() => (
  <Tooltip title='Move'>
    <IconButton>
      <DehazeIcon />
    </IconButton>
  </Tooltip>
))

export const EnrollmentQuestionItem: FunctionComponent<EnrollmentQuestionItemProps> = ({
  item,
  group,
  mainQuestion = false,
}) => {
  const tabName = useContext(TabContext)
  const { values, setValues } = useFormikContext<EnrollmentQuestionTab[]>()
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [questionItems, setQuestionItems] = useState<Array<unknown>>([<Grid key={uuidv4()}></Grid>])

  useEffect(() => {
    if (item) {
      setQuestionItems(
        item.map((i) => {
          return { ...i, isEnable: false }
        }),
      )
    } else {
      setQuestionItems([<Grid key={uuidv4()}></Grid>])
    }
  }, [item])

  const handleAdditionalAction = (slug, value) => {
    let index = 1000
    const updateQuestionItems = questionItems.map((q) => {
      if (q.additional_question === slug) {
        index = q.order
        return { ...q, isEnable: value }
      } else {
        if (value) {
          return q
        } else {
          if (q.order > index) {
            return { ...q, isEnable: false }
          } else {
            return q
          }
        }
      }
    })
    setQuestionItems(updateQuestionItems)
  }

  return (
    <>
      <Grid item xs={6}>
        {questionItems.map((q, index): ReactElement | undefined => {
          if ((q.additional_question && q.isEnable) || !q.additional_question) {
            if (q.type === QUESTION_TYPE.AGREEMENT) {
              return (
                <Grid key={index}>
                  <FormControl required name='acknowledge' component='fieldset' variant='standard'>
                    <FormGroup>
                      {/* <FormGroup style={{ width: '50%' }}> */}
                      <FormControlLabel
                        control={<Checkbox />}
                        label={
                          <Paragraph sx={{ fontSize: '16px' }}>
                            <p dangerouslySetInnerHTML={{ __html: q.question }}></p>
                          </Paragraph>
                        }
                      />
                    </FormGroup>
                  </FormControl>
                  {!q.additional_question && !mainQuestion && (
                    <Box sx={{ marginTop: 1, height: '40px', display: 'inline-flex' }}>
                      <Tooltip title='Edit'>
                        <IconButton onClick={() => setShowEditDialog(true)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title='Delete'>
                        <IconButton onClick={() => setShowDeleteDialog(true)}>
                          <DeleteForeverOutlinedIcon />
                        </IconButton>
                      </Tooltip>

                      <DragHandle />
                    </Box>
                  )}
                </Grid>
              )
            } else if (q.type === QUESTION_TYPE.INFORMATION) {
              return (
                <Box key={index} display='flex' alignItems='center' width={'100%'}>
                  <Paragraph sx={{ fontSize: '16px' }}>
                    <p dangerouslySetInnerHTML={{ __html: q.question }}></p>
                  </Paragraph>
                  {!q.additional_question && !mainQuestion && (
                    <Box display='inline-flex' height='40px'>
                      <Tooltip title='Edit'>
                        <IconButton onClick={() => setShowEditDialog(true)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title='Delete'>
                        <IconButton onClick={() => setShowDeleteDialog(true)}>
                          <DeleteForeverOutlinedIcon />
                        </IconButton>
                      </Tooltip>

                      <DragHandle />
                    </Box>
                  )}
                </Box>
              )
            } else {
              return (
                <Grid key={index}>
                  <Box
                    display='flex'
                    alignItems='center'
                    width={'100%'}
                    marginTop={q.additional_question ? '20px' : '0px'}
                  >
                    <Subtitle fontWeight='500'>{q.question}</Subtitle>
                    {!q.additional_question && !mainQuestion && (
                      <Box display='inline-flex' height='40px'>
                        <Tooltip title='Edit'>
                          <IconButton onClick={() => setShowEditDialog(true)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title='Delete'>
                          <IconButton onClick={() => setShowDeleteDialog(true)}>
                            <DeleteForeverOutlinedIcon />
                          </IconButton>
                        </Tooltip>

                        <DragHandle />
                      </Box>
                    )}
                  </Box>
                  <Box alignItems='center' width={'100%'}>
                    <Item question={q} setAdditionalQuestion={(slug, value) => handleAdditionalAction(slug, value)} />
                  </Box>
                </Grid>
              )
            }
          } else {
            return undefined
          }
        })}
        {showEditDialog && (
          <AddNewQuestionModal
            onClose={() => setShowEditDialog(false)}
            editItem={item}
            group={group}
            isNewQuestion={false}
          />
        )}
        {showDeleteDialog && (
          <CustomModal
            title='Delete Question'
            description='Are you sure you want to delete this question?'
            confirmStr='Delete'
            onClose={() => setShowDeleteDialog(false)}
            onConfirm={() => {
              setShowDeleteDialog(false)
              const newValues = values.map((v) => {
                if (v.tab_name === tabName) {
                  const newGroups = v.groups.map((g) =>
                    g.group_name === group
                      ? {
                          ...g,
                          questions: g.questions
                            .filter((q) => q.question !== item[0].question)
                            .sort((a, b) => a.order - b.order)
                            .map((item, index) => {
                              return { ...item, order: index + 1 }
                            }),
                        }
                      : g,
                  )
                  // v.groups = newGroups
                  return { ...v, groups: newGroups }
                }
                return v
              })
              setValues(newValues)
              // deleteQuestion({ variables: { id: item.id } })
            }}
          />
        )}
      </Grid>
    </>
  )
}
function Item({
  question: q,
  setAdditionalQuestion,
}: {
  question: EnrollmentQuestion
  setAdditionalQuestion: (slug: string, flag: boolean) => void
}) {
  const [selectedOption, setSelectedOption] = useState([])
  const { setProgramYear } = useContext(ProgramYearContext)
  useEffect(() => {
    setSelectedOption([])
  }, [q])
  function onChange(value: string | number) {
    if (q.type !== QUESTION_TYPE.TEXTFIELD) {
      const selected_option = q.options.filter((option) => option.value == value)
      if (selected_option.length > 0 && selected_option[0].action === 2) {
        if (q.type === QUESTION_TYPE.CHECKBOX) {
          if (selectedOption.indexOf(value) > -1) {
            setAdditionalQuestion(q.slug, false)
          } else {
            setAdditionalQuestion(q.slug, true)
          }
        } else {
          setAdditionalQuestion(q.slug, true)
        }
      } else {
        if (q.type !== QUESTION_TYPE.CHECKBOX) {
          setAdditionalQuestion(q.slug, false)
        }
      }
      if (q.type === QUESTION_TYPE.CHECKBOX) {
        if (selectedOption.indexOf(value) > -1) {
          setSelectedOption(selectedOption.filter((s) => s !== value))
        } else {
          setSelectedOption([...selectedOption, value])
        }
      } else {
        setSelectedOption([value])
      }
    }
    if (q.slug === 'program_year') {
      setProgramYear(value)
    }
  }
  if (q.type === QUESTION_TYPE.DROPDOWN) {
    return (
      <DropDown
        sx={{
          margin: '0 !important',
          width: '99%',
          maxWidth: '99%',
          [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: MthColor.SYSTEM_07,
          },
        }}
        labelTop
        defaultValue={selectedOption}
        dropDownItems={q.options || []}
        setParentValue={(v) => onChange(v as string)}
        size='small'
      />
    )
  } else if (q.type === QUESTION_TYPE.TEXTFIELD) {
    return (
      <TextField
        size='small'
        sx={{
          maxWidth: '99%',
          width: '99%',

          [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: MthColor.SYSTEM_07,
          },
        }}
        InputLabelProps={{
          style: { color: MthColor.SYSTEM_05 },
        }}
        variant='outlined'
        fullWidth
        focused
      />
    )
  } else if (q.type === QUESTION_TYPE.CHECKBOX) {
    return (
      <FormControl required component='fieldset' variant='standard' sx={{ width: '99%', maxWidth: '99%' }}>
        <FormGroup style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          <Grid container>
            {(q.options ?? []).map((o, index) => (
              <Grid item xs={q.options.length > 3 ? 6 : 12} key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedOption.indexOf(o.value) > -1 ? true : false}
                      onClick={() => onChange(o.value)}
                    />
                  }
                  label={o.label}
                />
                {o.label === 'Other' && (
                  <TextField
                    size='small'
                    sx={{
                      maxWidth: '50%',

                      [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                        {
                          borderColor: MthColor.SYSTEM_07,
                        },
                    }}
                    InputLabelProps={{
                      style: { color: MthColor.SYSTEM_05 },
                    }}
                    variant='outlined'
                    fullWidth
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </FormGroup>
      </FormControl>
    )
  } else if (q.type === QUESTION_TYPE.MULTIPLECHOICES) {
    return (
      <FormControl required component='fieldset' variant='standard' sx={{ width: '99%', maxWidth: '99%' }}>
        <FormGroup style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          <Grid container>
            {(q.options ?? []).map((o, index) => (
              <Grid item xs={q.options.length > 3 ? 6 : 12} key={index}>
                <FormControlLabel
                  control={<Radio checked={selectedOption[0] === o.value} onClick={() => onChange(o.value)} />}
                  label={o.label}
                />
              </Grid>
            ))}
          </Grid>
        </FormGroup>
      </FormControl>
    )
  } else if (q.type === QUESTION_TYPE.CALENDAR) {
    return (
      <TextField
        size='small'
        sx={{
          width: '99%',
          minWidth: '99%',

          [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: MthColor.SYSTEM_07,
          },
        }}
        InputLabelProps={{
          style: { color: MthColor.SYSTEM_05 },
        }}
        variant='outlined'
        onChange={() => {}}
        focused
        type='date'
      />
    )
  }
  return null
}
