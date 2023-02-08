import React, { useContext, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { makeStyles, Theme } from '@material-ui/core/styles'
import {
  Alert,
  Box,
  Button,
  Grid,
  inputLabelClasses,
  List,
  outlinedInputClasses,
  Stack,
  Typography,
} from '@mui/material'
import { Form, Formik } from 'formik'
import _ from 'lodash'
import moment from 'moment'
import { Prompt } from 'react-router-dom'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import { CustomConfirmModal } from '@mth/components/CustomConfirmModal/CustomConfirmModal'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { QuestionModal } from '@mth/components/QuestionItem/AddNewQuestion'
import { DefaultQuestionModal } from '@mth/components/QuestionItem/AddNewQuestion/DefaultQuestionModal'
import { SelectDefaultCustomQuestionModal } from '@mth/components/QuestionItem/AddNewQuestion/SelectDefaultCustomQuestionModal'
import { QuestionItem } from '@mth/components/QuestionItem/QuestionItem'
import {
  defaultQuestions,
  HasAdditionalQuestion,
  Question,
  ValidationType,
} from '@mth/components/QuestionItem/QuestionItemProps'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { isEmail, isNumber } from '@mth/constants'
import { MthColor, MthTitle, QUESTION_TYPE, WithdrawalStatus } from '@mth/enums'
import { deleteQuestionMutation, saveQuestionsMutation } from '@mth/graphql/mutation/question'
import { saveWithdrawalMutation } from '@mth/graphql/mutation/withdrawal'
import { getQuestionsByRegionQuery } from '@mth/graphql/queries/question'
import { getSchoolYearsByRegionId } from '@mth/graphql/queries/school-year'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { siteManagementClassess } from '@mth/screens/Admin/SiteManagement/styles'
import CircleIcon from './CircleIcon'

const additionalStyles = makeStyles((theme: Theme) => ({
  mainContent: {
    [theme.breakpoints.down('xs')]: {
      padding: '1rem 0.5rem',
    },
    padding: '1rem 2.5rem',
  },
  mainStackContent: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
    width: '50%',
    margin: 'auto',
  },
  submitButton: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginLeft: '0px',
    },
    width: '40%',
    margin: 'auto',
    marginTop: '16px',
    maginLeft: 'calc(25% + 60px)',
  },
  header: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  titleBox: {
    [theme.breakpoints.down('xs')]: {
      marginBottom: '24px',
      display: 'none',
    },
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  actionButtons: {
    [theme.breakpoints.down('xs')]: {
      float: 'none',
      marginBottom: '8px',
      width: '100%',
    },
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    float: 'right',
  },
  dropdown: {
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: MthColor.SYSTEM_07,
      borderWidth: '2px',
    },
    [`& .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: MthColor.SYSTEM_07,
      borderWidth: '2px',
    },
    [`& .${inputLabelClasses.root}.${inputLabelClasses.focused}`]: {
      transform: 'translate(14px, -11px) scale(1)',
    },
    [`& .${inputLabelClasses.root}.${inputLabelClasses.shrink}`]: {
      transform: 'translate(14px, -11px) scale(1)',
    },
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline} span`]: {
      fontSize: 16,
    },
  },
}))

//	Possible Question Types List
const QuestionTypes = [
  {
    value: QUESTION_TYPE.DROPDOWN,
    label: 'Drop Down',
  },
  {
    value: QUESTION_TYPE.TEXTFIELD,
    label: 'Text Field',
  },
  {
    value: QUESTION_TYPE.CHECKBOX,
    label: 'Checkbox',
  },
  {
    value: QUESTION_TYPE.AGREEMENT,
    label: 'Agreement',
  },
  {
    value: QUESTION_TYPE.MULTIPLECHOICES,
    label: 'Multiple Choices',
  },
  {
    value: QUESTION_TYPE.INFORMATION,
    label: 'Information',
  },
]

const Withdrawal: React.FC<{
  action?: (page: string) => void
  handleChange?: (flag: boolean) => void
  region: number
  studentId?: number
}> = ({ action, handleChange, region, studentId }) => {
  const signature = useRef<SignaturePad | undefined>(undefined)
  const { me } = useContext(UserContext)
  const isEditable = (): boolean => {
    return !!me?.level && me.level <= 2
  }
  const classes = additionalStyles()

  const SortableItem = SortableElement(QuestionItem)

  const filterAdditionalQuestions = (items: Question[]) => {
    return items.filter((item) => {
      if (!item.additionalQuestion) return true
      const parentQuestion = items.find((x) => x.slug == item.additionalQuestion)
      if (!parentQuestion?.response) return false
      return !!parentQuestion.options?.find(
        (option) =>
          option.action == HasAdditionalQuestion.YES &&
          (option.value == parentQuestion.response || parentQuestion.response.toString().indexOf(option.value) > -1),
      )
    })
  }

  const filterCustomQuestions = (items: Question[]) => {
    return filterAdditionalQuestions(items.filter((item) => !item.mainQuestion))
  }

  const questionSortList = (values: Question[]) => {
    return filterCustomQuestions(values).map((v) => {
      const arr = [v]
      let current = v
      let child
      while ((child = values.find((x) => x.additionalQuestion == current.slug))) {
        arr.push(child)
        current = child
      }
      return arr
    })
  }

  const SortableListContainer = SortableContainer(({ questionsList }: { questionsList: Question[][] }) => {
    return (
      <List sx={{ width: '100%', py: 0 }}>
        {questionsList.map((questions, index) => (
          <SortableItem
            index={index}
            key={index}
            questions={questions}
            questionTypes={QuestionTypes}
            additionalQuestionTypes={QuestionTypes}
            hasAction={isEditable()}
          />
        ))}
      </List>
    )
  })

  //	questions state on the page
  const [questions, setQuestions] = useState<Question[]>([])
  //	Flag State which indicates to show the Question Type Selection Modal (Choose between Default and Custom)
  const [openSelectQuestionType, setOpenSelectQuestionType] = useState(false)
  //	Flag State which indicates to show the cancel confirmation modal
  const [cancelModal, setCancelModal] = useState(false)
  //	Flag State which indicates Questions saved Success Message
  const [successAlert, setSuccessAlert] = useState(false)
  //	Flag State which indicates if the Form has values changed. true => Form has values changed. false => No
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false)

  const [schoolYearList, setSchoolYearList] = useState<DropDownItem[]>([])
  const [activeSchoolYearId, setActiveSchoolYearId] = useState<string>('')
  const [midActiveSchoolYearId, setMidActiveSchoolYearId] = useState<boolean>(false)

  const [futureYearList, setFutureYearList] = useState<DropDownItem[]>([])

  const { loading: schoolLoading, data: schoolYearData } = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: region,
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!schoolLoading && schoolYearData?.getSchoolYearsByRegionId) {
      const tempSchoolYearList: DropDownItem[] = []
      const futureSchoolYearList: DropDownItem[] = []
      const yearList = schoolYearData.getSchoolYearsByRegionId.sort((a, b) => (a.date_begin > b.date_begin ? 1 : -1))
      for (let i = 0; i < yearList.length; i++) {
        const item = yearList[i]
        tempSchoolYearList.push({
          label: moment(item.date_begin).format('YYYY') + '-' + moment(item.date_end).format('YY'),
          value: item.school_year_id + '',
        })
        if (moment().format('YYYY-MM-DD') < item.date_end) {
          futureSchoolYearList.push({
            label: moment(item.date_begin).format('YYYY') + '-' + moment(item.date_end).format('YY'),
            value: item.school_year_id + '',
          })
        }

        if (item.midyear_application === 1) {
          tempSchoolYearList.push({
            label: moment(item.date_begin).format('YYYY') + '-' + moment(item.date_end).format('YY') + ' Mid-Year',
            value: item.school_year_id + '-mid',
          })
          if (moment().format('YYYY-MM-DD') < item.date_end) {
            futureSchoolYearList.push({
              label: moment(item.date_begin).format('YYYY') + '-' + moment(item.date_end).format('YY') + ' Mid-Year',
              value: item.school_year_id + '-mid',
            })
          }
        }
        if (
          moment().format('YYYY-MM-DD') > item.date_begin &&
          moment().format('YYYY-MM-DD') < item.date_end &&
          isEditable()
        ) {
          setActiveSchoolYearId(item.school_year_id + '')
        }
      }
      setSchoolYearList(tempSchoolYearList)
      setFutureYearList(futureSchoolYearList)
    }
  }, [schoolYearData])

  //	Select Questions Query from the Database
  const { data: questionsData } = useQuery(getQuestionsByRegionQuery, {
    variables: {
      withdrawQuestionInput: {
        school_year_id: parseInt(activeSchoolYearId),
        mid_year: midActiveSchoolYearId,
        section: 'quick-link-withdrawal',
        regionId: region,
      },
    },
    fetchPolicy: 'network-only',
    skip: !activeSchoolYearId,
  })

  //	Insert(Update) Questions Mutation into the Database
  const [saveQuestions] = useMutation(saveQuestionsMutation)
  //	Delete Question Mutation from the Database
  const [deleteQuestion] = useMutation(deleteQuestionMutation)
  const [openAddQuestion, setOpenAddQuestion] = useState('')
  //	The Question Item which is currently editing
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([])
  //	Submit withdrawal responses mutation into the database
  const [submitResponses] = useMutation(saveWithdrawalMutation)

  //	This state helps for the validation check run when submit only
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSelectDefaultQuestions = (selected: string) => {
    const question = defaultQuestions.find((x) => x.question == selected)
    if (!question) return

    const newDefaultQuestion: Question = {
      id: -1,
      region_id: region,
      section: 'quick-link-withdrawal',
      type: question.type,
      sequence: 3,
      question: question.question,
      defaultQuestion: true,
      additionalQuestion: '',
      mainQuestion: false,
      validation: question.validation || 0,
      slug: question.slug,
      options: [],
      required: false,
      response: '',
    }
    setCurrentQuestions([newDefaultQuestion])
    setOpenAddQuestion('new')
  }

  const onChangeHandler = (flag: boolean): void => {
    if (handleChange) handleChange(flag)
  }

  const onActionHandler = (page: string): void => {
    if (action) action(page)
  }

  // Submit withdrawal form data for the parent
  const submitWithdrawalForm = async (values: Question[]) => {
    const offset = new Date().getTimezoneOffset()
    const date_effective = offset < 0 ? values[1].response + 'T00:00:00.000Z' : values[1].response + 'T24:00:00.000Z'
    const signatureQuestion = values[values?.length - 1]

    const response = JSON.stringify(
      filterCustomQuestions(values).concat([
        {
          ...signatureQuestion,
          response: {
            name: values[values?.length - 1].response,
            signature: signature?.current?.toDataURL(),
          },
        },
      ]),
    )

    const { data } = await submitResponses({
      variables: {
        withdrawalInput: {
          withdrawal: {
            StudentId: +values[0].response,
            date: new Date().toISOString(),
            date_effective: new Date(date_effective || '').toISOString(),
            response,
            status: studentId ? WithdrawalStatus.WITHDRAWN : WithdrawalStatus.REQUESTED,
          },
        },
      },
    })
    if (data && data.saveWithdrawal) {
      //	TODO : Redirect to the previous page, show error message if error returns.
    }

    setUnsavedChanges(false)
    onChangeHandler(false)
    onActionHandler('')
  }

  // Submit withdrawal questions for the admin
  const saveWithdrawalQuestions = async (values: Question[]) => {
    const newQuestions: Question[] = []
    //	Move additional questions behind the parent question
    for (let i = 0; i < values.length; i++) {
      if (values[i].additionalQuestion === '') {
        newQuestions.push(values[i])
        values.splice(i, 1)
        i--
      }
    }
    let length = newQuestions.length
    while (true) {
      for (let i = 0; i < values.length; i++) {
        const parentIndex = newQuestions.findIndex((q) => q.slug === values[i].additionalQuestion)
        if (parentIndex >= 0) {
          newQuestions.splice(parentIndex + 1, 0, values[i])
          values.splice(i, 1)
          i--
        }
      }
      if (length == newQuestions.length) break
      length = newQuestions.length
    }

    questions
      .filter((x) => !x.mainQuestion)
      .forEach((q) => {
        if (!newQuestions.find((v) => v.id === q.id)) {
          deleteQuestion({ variables: { questionId: q.id } })
        }
      })

    for (let i = 0; i < newQuestions.length; i++) {
      if (newQuestions[i].id < 0) newQuestions[i].id = 0
      newQuestions[i].sequence = i + 1
    }

    const { data } = await saveQuestions({
      variables: {
        questionsInput: newQuestions.map((v) => {
          return {
            question: {
              id: Number(v.id),
              region_id: v.region_id,
              section: v.section,
              sequence: v.sequence,
              slug: v.slug,
              type: v.type,
              question: v.question,
              validation: v.validation,
              mainQuestion: v.mainQuestion ? 1 : 0,
              defaultQuestion: v.defaultQuestion ? 1 : 0,
              options: JSON.stringify(v.options),
              required: v.required ? 1 : 0,
              additionalQuestion: v.additionalQuestion,
              school_year_id: parseInt(activeSchoolYearId),
              mid_year: midActiveSchoolYearId,
            },
          }
        }),
      },
    })

    if (data.saveQuestions) {
      onActionHandler('')
    } else {
      console.error(data)
    }
  }

  //	Read existing questions from the database and show, Initialize Unsaved flag state to false
  useEffect(() => {
    if (questionsData?.questionsByRegion) {
      if (!questionsData.questionsByRegion.length) {
        //  Initial questions for admin
        if (isEditable()) {
          setQuestions([
            {
              id: -1,
              region_id: region,
              section: 'quick-link-withdrawal',
              type: QUESTION_TYPE.DROPDOWN,
              sequence: 0,
              question: 'Student',
              options: [],
              mainQuestion: true,
              defaultQuestion: false,
              slug: 'student',
              validation: 0,
              required: true,
              additionalQuestion: '',
              response: studentId || '',
              studentId: studentId,
            },
            {
              id: -2,
              region_id: region,
              section: 'quick-link-withdrawal',
              type: QUESTION_TYPE.CALENDAR,
              sequence: 1,
              question: 'Effective Withdraw Date',
              options: [],
              mainQuestion: true,
              defaultQuestion: false,
              slug: 'effective_withdraw_date',
              validation: 0,
              required: true,
              additionalQuestion: '',
              response: '',
            },
            {
              id: -3,
              region_id: region,
              section: 'quick-link-withdrawal',
              type: QUESTION_TYPE.SIGNATURE,
              sequence: 3,
              question: 'Type full legal parent name and provide a digital signature below.',
              options: [],
              mainQuestion: true,
              defaultQuestion: false,
              slug: 'signature',
              validation: 0,
              required: true,
              additionalQuestion: '',
              response: '',
            },
          ])
        } else {
          setQuestions([])
        }
      } else {
        const students = me?.students
          ?.filter(
            (item) =>
              item.current_school_year_status.school_year_id === parseInt(activeSchoolYearId + '') &&
              item.current_school_year_status.midyear_application === midActiveSchoolYearId &&
              [0, 1].includes(item.status[0].status), // 0: pending, 1: active
          )
          .map((student) => ({
            label: student.person.first_name,
            value: student.student_id,
          }))

        setQuestions(
          questionsData.questionsByRegion.map(
            (v: {
              options: string
              mainQuestion: number
              defaultQuestion: number
              required: number
              question: string
              slug: string
            }) => {
              if (isEditable()) {
                return {
                  ...v,
                  options: JSON.parse(v.options),
                  mainQuestion: v.mainQuestion == 1,
                  defaultQuestion: v.defaultQuestion == 1,
                  required: v.required == 1,
                  response: (v.question === 'Student' && studentId) || '',
                  studentId: studentId,
                }
              } else {
                if (v.slug !== 'student') {
                  return {
                    ...v,
                    options: JSON.parse(v.options),
                    mainQuestion: v.mainQuestion == 1,
                    defaultQuestion: v.defaultQuestion == 1,
                    required: v.required == 1,
                    response: (v.question === 'Student' && studentId) || '',
                    studentId: studentId,
                  }
                } else {
                  return {
                    ...v,
                    options: students,
                    mainQuestion: v.mainQuestion == 1,
                    defaultQuestion: v.defaultQuestion == 1,
                    required: v.required == 1,
                    response: (v.question === 'Student' && studentId) || '',
                    studentId: studentId,
                  }
                }
              }
            },
          ),
        )
      }
      setUnsavedChanges(false)
    }
  }, [questionsData])

  //	Remove Success Message after 5 seconds when showed
  useEffect(() => {
    if (successAlert) {
      setTimeout(() => setSuccessAlert(false), 5000)
    }
  }, [successAlert])

  return (
    <Grid className={classes.mainContent}>
      {
        <Formik
          initialValues={questions}
          enableReinitialize={true}
          validate={(values: Question[]): { [key: string]: string } | undefined | void => {
            let isEqual
            if (isEditable()) {
              isEqual = _.isEqual(values, questions)
            } else {
              //	Parent
              //	Compare response only (Except Student:index=0)
              isEqual = !values.find((item, index) => index && item.response != questions[index].response)
            }
            if (isEqual === unsavedChanges) {
              setUnsavedChanges(!unsavedChanges)
              onChangeHandler(!unsavedChanges)
            }

            if (!isEditable() && isSubmitting) {
              //	Check validation on parent side only
              const errors: { [key: string]: string } = {}
              filterAdditionalQuestions(values).forEach((val) => {
                if (val.required && !val.response) {
                  if (val.slug == 'signature') errors[val.id + 'entry'] = 'Required'
                  else errors[val.id] = 'Required'
                } else if (val.validation && !!val.response) {
                  if (val.validation == ValidationType.NUMBER) {
                    if (!isNumber.test(val.response.toString())) errors[val.id] = 'Please enter numbers only.'
                  } else if (val.validation == ValidationType.EMAIL) {
                    if (!isEmail.test(val.response.toString())) errors[val.id] = 'Please enter valid email address.'
                  }
                }

                if (val.slug == 'signature' && signature?.current?.isEmpty()) {
                  errors[val.id + 'signature'] = 'Required.'
                }
              })

              return errors
            }
            return undefined
          }}
          onSubmit={async (values, formikBag) => {
            setIsSubmitting(true)
            formikBag
              .validateForm()
              .then(async (res) => {
                if (Object.keys(res).length > 0) {
                  return
                }

                if (!isEditable()) {
                  // Parent
                  await submitWithdrawalForm(values)
                } else {
                  // Admin
                  await saveWithdrawalQuestions(values)
                }
              })
              .catch((err) => {
                console.error(err)
              })
          }}
        >
          {({ values, setValues }) => (
            <Form name={'WithdrawalForm'}>
              <Box sx={siteManagementClassess.base}>
                <Box className={classes.header}>
                  <Box className={classes.titleBox}>
                    <Typography sx={{ fontWeight: 700, fontSize: 20, ml: 1, mr: 2 }}>Withdraw</Typography>
                    {isEditable() && (
                      <DropDown
                        dropDownItems={schoolYearList}
                        placeholder={'Select Year'}
                        defaultValue={activeSchoolYearId}
                        borderNone={true}
                        setParentValue={(val) => {
                          let yearId = val + ''
                          if (yearId?.indexOf('mid') > 0) {
                            yearId = yearId?.split('-')?.at(0)
                            setMidActiveSchoolYearId(true)
                          } else {
                            setMidActiveSchoolYearId(false)
                          }
                          setActiveSchoolYearId(val)
                        }}
                      />
                    )}
                  </Box>
                  {isEditable() && (
                    <Box className={classes.actionButtons}>
                      <Button
                        variant='contained'
                        color='secondary'
                        disableElevation
                        sx={siteManagementClassess.cancelButton}
                        onClick={() => {
                          if (unsavedChanges) setCancelModal(true)
                          else onActionHandler('')
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant='contained'
                        disableElevation
                        sx={siteManagementClassess.submitButton}
                        type='submit'
                      >
                        Save
                      </Button>
                    </Box>
                  )}
                </Box>
                <CircleIcon />
                <Stack
                  justifyContent='center'
                  alignItems={'center'}
                  direction='column'
                  className={classes.mainStackContent}
                  sx={{ mt: 2, ml: isEditable() ? 'calc(25% + 60px)' : 'auto' }}
                >
                  <List sx={{ width: '100%', py: 0 }}>
                    <Box style={{ maxWidth: isEditable() ? '80%' : '100%' }}>
                      <DropDown
                        name='programYear'
                        labelTop
                        placeholder='Program Year'
                        dropDownItems={futureYearList}
                        setParentValue={(id) => {
                          if (!isEditable()) {
                            let yearId = id.toString()
                            if (yearId?.indexOf('mid') > 0) {
                              yearId = yearId?.split('-')?.at(0)
                              setMidActiveSchoolYearId(true)
                            } else {
                              setMidActiveSchoolYearId(false)
                            }
                            setActiveSchoolYearId(yearId)
                          }
                        }}
                        alternate={true}
                        size='small'
                      />
                    </Box>
                    <QuestionItem
                      questions={[values[0]]}
                      questionTypes={QuestionTypes}
                      additionalQuestionTypes={QuestionTypes}
                      hasAction={isEditable()}
                    />
                    <QuestionItem
                      questions={[values[1]]}
                      questionTypes={QuestionTypes}
                      additionalQuestionTypes={QuestionTypes}
                      hasAction={isEditable()}
                    />
                  </List>
                  <SortableListContainer
                    questionsList={questionSortList(values)}
                    useDragHandle={true}
                    onSortEnd={({ oldIndex, newIndex }) => {
                      const groups = values
                        .filter((v) => v.additionalQuestion == '' && v.mainQuestion == false)
                        .map((v) => {
                          const arr = [v]
                          let current = v
                          let child
                          while ((child = values.find((x) => x.additionalQuestion == current.slug))) {
                            arr.push(child)
                            current = child
                          }
                          return arr
                        })
                      const newData = arrayMove(groups, oldIndex, newIndex)
                      const newValues = []
                      newValues.push(values[0])
                      newValues.push(values[1])
                      newData.forEach((group) => {
                        group.forEach((q) => {
                          newValues.push({
                            ...q,
                            sequence: newValues.length + 1,
                          })
                        })
                      })
                      newValues.push(values[values.length - 1])
                      setValues(newValues)
                    }}
                  />
                  <List sx={{ width: '100%', py: 0 }}>
                    <QuestionItem
                      questions={[values[values.length - 1]]}
                      questionTypes={QuestionTypes}
                      additionalQuestionTypes={QuestionTypes}
                      hasAction={isEditable()}
                      signature={signature}
                    />
                  </List>
                </Stack>
                {isEditable() && (
                  <Box className={classes.submitButton}>
                    <Button
                      variant='contained'
                      sx={{ ...siteManagementClassess.button, width: '100%' }}
                      onClick={() => setOpenSelectQuestionType(true)}
                    >
                      <Subtitle size={12}>Add Question</Subtitle>
                    </Button>
                  </Box>
                )}
                <Box className={classes.submitButton}>
                  <Button
                    variant='contained'
                    sx={{ ...siteManagementClassess.button, width: '100%' }}
                    type={isEditable() ? 'button' : 'submit'}
                  >
                    <Subtitle size={12}>Submit Withdrawal Request</Subtitle>
                  </Button>
                </Box>
              </Box>

              {openAddQuestion === 'new' && (
                <QuestionModal
                  onClose={(res) => {
                    setOpenAddQuestion('')
                    if (!res) setOpenSelectQuestionType(true)
                  }}
                  questions={currentQuestions}
                  questionTypes={QuestionTypes}
                  additionalQuestionTypes={QuestionTypes}
                />
              )}
              {openAddQuestion === 'default' && (
                <DefaultQuestionModal
                  onClose={() => {
                    setOpenAddQuestion('')
                    setOpenSelectQuestionType(true)
                  }}
                  onCreate={(e) => onSelectDefaultQuestions(e)}
                />
              )}
              {openSelectQuestionType && (
                <SelectDefaultCustomQuestionModal
                  onClose={() => setOpenSelectQuestionType(false)}
                  onCreate={(e) => {
                    setOpenAddQuestion(e)
                    if (e === 'new') {
                      //	Prototype of a question
                      setCurrentQuestions([
                        {
                          id: -1,
                          region_id: region,
                          section: 'quick-link-withdrawal',
                          type: QUESTION_TYPE.TEXTFIELD,
                          sequence: values.length,
                          question: '',
                          defaultQuestion: false,
                          mainQuestion: false,
                          additionalQuestion: '',
                          validation: 0,
                          slug: `meta_${+new Date()}`,
                          options: [],
                          required: false,
                          response: '',
                        },
                      ])
                    }
                    setOpenSelectQuestionType(false)
                  }}
                />
              )}
              <Prompt
                when={unsavedChanges}
                message={JSON.stringify({
                  header: MthTitle.UNSAVED_TITLE,
                  content: MthTitle.UNSAVED_DESCRIPTION,
                })}
              />
              {cancelModal && (
                <CustomConfirmModal
                  header='Cancel Changes'
                  content='Are you sure you want to cancel changes made?'
                  handleConfirmModalChange={(isOk: boolean) => {
                    setCancelModal(false)
                    if (isOk) {
                      setUnsavedChanges(false)
                      onChangeHandler(false)
                      onActionHandler('')
                    }
                  }}
                />
              )}
              {successAlert && (
                <Alert
                  sx={{
                    position: 'absolute',
                    bottom: '25px',
                    marginBottom: '15px',
                    right: '0',
                  }}
                  onClose={() => setSuccessAlert(false)}
                  severity='success'
                >
                  Questions saved successfully.
                </Alert>
              )}
            </Form>
          )}
        </Formik>
      }
    </Grid>
  )
}

export { Withdrawal as default }
