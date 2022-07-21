import React, { useContext, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Alert, Box, Button, Grid, List, Stack, Typography } from '@mui/material'
import { Formik, Form } from 'formik'
import _ from 'lodash'
import { Prompt } from 'react-router-dom'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import { useStyles } from '../../../screens/Admin/SiteManagement/styles'
import { Subtitle } from '../../Typography/Subtitle/Subtitle'
import { defaultQuestions, Question, QUESTION_TYPE } from '../../QuestionItem/QuestionItemProps'
import { saveQuestionsMutation, deleteQuestionMutation } from '../../../graphql/mutation/question'
import { getQuestionsByRegionQuery } from '../../../graphql/queries/question'
import { UserContext } from '../../../providers/UserContext/UserProvider'
import { saveWithdrawalMutation } from '../../../graphql/mutation/withdrawal'
import { WithdrawalStatus } from '../../../core/enums'
import CircleIcon from './CircleIcon'
import QuestionModal from '../../QuestionItem/AddNewQuestion'
import CustomConfirmModal from '../../CustomConfirmModal/CustomConfirmModal'
import QuestionItem from '../../QuestionItem/QuestionItem'
import SelectDefaultCustomQuestionModal from '../../QuestionItem/AddNewQuestion/SelectDefaultCustomQuestionModal'
import DefaultQuestionModal from '../../QuestionItem/AddNewQuestion/DefaultQuestionModal'

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
const AdditionalQuestionTypes = [
  {
    value: QUESTION_TYPE.DROPDOWN,
    label: 'Drop Down',
  },
  {
    value: QUESTION_TYPE.CHECKBOX,
    label: 'Checkbox',
  },
  {
    value: QUESTION_TYPE.MULTIPLECHOICES,
    label: 'Multiple Choices',
  },
]

const Withdrawal: React.FC<{
  action?: (page: string) => void
  handleChange?: (flag: boolean) => void
  region: number
  studentId?: number
}> = ({ action, handleChange, region, studentId }) => {
  const signature = useRef(null)
  const { me } = useContext(UserContext)
  const isEditable = (): boolean => {
    if (me?.level && me?.level <= 2) return true
    return false
  }

  const SortableItem = SortableElement(QuestionItem)

  const questionSortList = (values: Question[]) => {
    const sortList = values
      .filter(
        (v) =>
          // isEditable() ? (v.additionalQuestion == '' && v.mainQuestion == false)	//	Admin  (ask additional question)
          // 	:
          !v.mainQuestion &&
          (v.additionalQuestion == '' ||
            (values.find((x) => x.slug == v.additionalQuestion)?.response != '' &&
              values
                .find((x) => x.slug == v.additionalQuestion)
                ?.options.find(
                  (x) =>
                    x.action == 2 &&
                    (x.value == values.find((y) => y.slug == v.additionalQuestion)?.response ||
                      values
                        .find((y) => y.slug == v.additionalQuestion)
                        ?.response.toString()
                        .indexOf(x.value) >= 0),
                ) != null)), // Parent
      )
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
    return sortList

    // let newValues = [];
    // sortList.forEach(group => {
    // 	group.forEach(q => {
    // 		const parent = values.find(x => x.slug == q.additionalQuestion);
    // 		// const isSel = parent?.options.find()
    // 		if((q.additionalQuestion == '' || (parent?.response != '' )) &&
    // 			!newValues.find(f => f.find(ff => ff.id === q.id))){
    // 			newValues.push([{
    // 				...q,
    // 				sequence: newValues.length + 1
    // 			}])
    // 		}
    // 	})
    // });
    // console.log({newValues})
    // return newValues;
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
            additionalQuestionTypes={AdditionalQuestionTypes}
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
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  useEffect(() => {
    window['setFormChanged']('WithdrawalForm', unsavedChanges)
  }, [unsavedChanges])

  //	Select Questions Query from the Database
  const { data: questionsData, refetch: refetchQuestionData } = useQuery(getQuestionsByRegionQuery, {
    variables: { regionId: region, section: 'quick-link-withdrawal' },
    fetchPolicy: 'network-only',
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

  //	Read existing questions from the database and show, Initialize Unsaved flag state to false
  useEffect(() => {
    if (questionsData?.questionsByRegion) {
      if (questionsData.questionsByRegion.length == 0) {
        //  Initial questions for admin
        isEditable() &&
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
              question:
                'Type full legal parent name and provide a Digital Signature below. Signature (use the mouse to sign)',
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
        setQuestions(
          questionsData.questionsByRegion.map(
            (v: {
              options: string
              mainQuestion: number
              defaultQuestion: number
              required: number
              question: string
            }) => {
              return {
                ...v,
                options: JSON.parse(v.options),
                mainQuestion: v.mainQuestion == 1 ? true : false,
                defaultQuestion: v.defaultQuestion == 1 ? true : false,
                required: v.required == 1 ? true : false,
                response: (v.question === 'Student' && studentId) || '',
                studentId: studentId,
              }
            },
          ),
        )
      }
      setUnsavedChanges(false)
    }
  }, [questionsData])

  //	This state helps for the validation check run when submit only
  const [isSubmitting, setIsSubmitting] = useState(false)

  //	Remove Success Message after 5 seconds when showed
  useEffect(() => {
    if (successAlert) {
      setTimeout(() => setSuccessAlert(false), 5000)
    }
  }, [successAlert])

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

  return (
    <Grid
      sx={{
        padding: '1rem 2.5rem',
      }}
    >
      {questions.length > 0 && (
        <Formik
          initialValues={questions}
          enableReinitialize={true}
          validate={(values: Question[]) => {
            let isEqual = true
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
              values.forEach((val) => {
                if (val.required && val.response === '') {
                  //	Check Additional questions
                  if (val.additionalQuestion != '') {
                    const parent = values.find((v) => v.slug == val.additionalQuestion)
                    if (parent?.response) {
                      let bExist = false
                      for (let i = 0; i < parent.response.length; i++) {
                        if (parent.options.find((o) => o.value == parent.response.substr(i, 1)).action == 2) {
                          bExist = true
                          break
                        }
                      }
                      if (bExist) {
                        errors[val.id] = val.question + ' is required.'
                      }
                    }
                  } else errors[val.id] = val.question + ' is required.'
                } else if (val.validation > 0 && val.response !== '') {
                  if (val.validation == 1) {
                    //	Check numbers
                    if (!new RegExp(/^[0-9]+$/).test(val.response)) errors[val.id] = 'Please enter numbers only.'
                  } else {
                    //	Check email
                    if (
                      !new RegExp(
                        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                      ).test(val.response)
                    )
                      errors[val.id] = 'Please enter valid email address.'
                  }
                }

                if (val.slug == 'signature' && signature?.current.isEmpty()) {
                  errors[val.id] = 'Signature is required.'
                }
              })

              return errors
            }
          }}
          onSubmit={async (vals, formikBag) => {
            setIsSubmitting(true)
            formikBag
              .validateForm()
              .then(async (res) => {
                //setIsSubmitting(false);
                if (Object.keys(res).length > 0) {
                  return
                }

                if (!isEditable()) {
                  const { data } = await submitResponses({
                    variables: {
                      withdrawalInput: {
                        withdrawal: {
                          StudentId: parseInt(vals[0].response),
                          date: new Date().toISOString(),
                          date_effective: vals[1].response,
                          response: JSON.stringify(vals.map((v) => v).splice(2)),
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

                  return
                }
                const newquestions: Array<any> = [] // = vals.map((v) => v);
                //	Move additional questions behind the parent question
                for (let i = 0; i < vals.length; i++) {
                  if (vals[i].additionalQuestion === '') {
                    newquestions.push(vals[i])
                    vals.splice(i, 1)
                    i--
                  }
                }
                let length = newquestions.length
                while (true) {
                  for (let i = 0; i < vals.length; i++) {
                    const parentIndex = newquestions.findIndex((q) => q.slug === vals[i].additionalQuestion)
                    if (parentIndex >= 0) {
                      newquestions.splice(parentIndex + 1, 0, vals[i])
                      vals.splice(i, 1)
                      i--
                    }
                  }
                  if (length == newquestions.length) break
                  length = newquestions.length
                }

                //	Remove unncessary additional questions if exists
                //while(true) {
                //	newquestions = newquestions.filter(q => q.additionalQuestion == '' || newquestions.find(x => x.slug == q.additionalQuestion) != null);
                //	if(length == newquestions.length)
                //		break;
                //	length = newquestions.length;
                //}

                questions
                  .filter((x) => !x.mainQuestion)
                  .forEach((q) => {
                    if (!newquestions.find((v) => v.id === q.id)) {
                      deleteQuestion({ variables: { questionId: q.id } })
                    }
                  })

                for (let i = 0; i < newquestions.length; i++) {
                  if (newquestions[i].id < 0) newquestions[i].id = 0
                  newquestions[i].sequence = i + 1
                }

                const { data } = await saveQuestions({
                  variables: {
                    questionsInput: newquestions.map((v) => {
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
                        },
                      }
                    }),
                  },
                })
                if (data.saveQuestions) {
                  refetchQuestionData()
                  setSuccessAlert(true)
                  setUnsavedChanges(false)
                  onChangeHandler(false)
                } else {
                  console.error(data)
                }
              })
              .catch((err) => {
                //setIsSubmitting(false);
              })
          }}
        >
          {({ values, setValues }) => (
            <Form name={'WithdrawalForm'}>
              <Box sx={useStyles.base}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 20, ml: 1 }}>Withdraw</Typography>
                  {isEditable() && (
                    <>
                      <Button
                        variant='contained'
                        color='secondary'
                        disableElevation
                        sx={useStyles.cancelButton}
                        onClick={() => {
                          if (unsavedChanges) setCancelModal(true)
                          else onActionHandler('')
                        }}
                      >
                        Cancel
                      </Button>
                      <Button variant='contained' disableElevation sx={useStyles.submitButton} type='submit'>
                        Save
                      </Button>
                    </>
                  )}
                </Box>
                <CircleIcon />
                <Stack
                  justifyContent='center'
                  alignItems={'center'}
                  direction='column'
                  sx={{ width: '50%', margin: 'auto', mt: 2, ml: isEditable() ? 'calc(25% + 60px)' : 'auto' }}
                >
                  <List sx={{ width: '100%', py: 0 }}>
                    <QuestionItem
                      questions={[values[0]]}
                      questionTypes={QuestionTypes}
                      additionalQuestionTypes={AdditionalQuestionTypes}
                      hasAction={isEditable()}
                    />
                    <QuestionItem
                      questions={[values[1]]}
                      questionTypes={QuestionTypes}
                      additionalQuestionTypes={AdditionalQuestionTypes}
                      hasAction={isEditable()}
                    />
                  </List>
                  <SortableListContainer
                    questionsList={questionSortList(values)}
                    useDragHandle={true}
                    onSortEnd={({ oldIndex, newIndex }) => {
                      //	Find indexs
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
                      //oldIndex = values.findIndex(x => x.id == groups[oldIndex].id);
                      //newIndex = values.findIndex(x => x.id == groups[newIndex].id);

                      //const newData = arrayMove(values, oldIndex, newIndex).map((v, i) => ({
                      //	...v,
                      //	sequence: i + 1,
                      //}));
                      setValues(newValues)
                    }}
                  />
                  <List sx={{ width: '100%', py: 0 }}>
                    <QuestionItem
                      questions={[values[values.length - 1]]}
                      questionTypes={QuestionTypes}
                      additionalQuestionTypes={AdditionalQuestionTypes}
                      hasAction={isEditable()}
                      signature={signature}
                    />
                  </List>
                </Stack>
                {isEditable() && (
                  <Box sx={{ width: '40%', margin: 'auto', mt: 2, ml: 'calc(25% + 60px)' }}>
                    <Button
                      variant='contained'
                      sx={{ ...useStyles.button, width: '100%' }}
                      onClick={() => setOpenSelectQuestionType(true)}
                    >
                      <Subtitle size={12}>Add Question</Subtitle>
                    </Button>
                  </Box>
                )}
                <Box sx={{ width: '40%', margin: 'auto', mt: 2, ml: 'calc(25% + 60px)' }}>
                  <Button
                    variant='contained'
                    sx={{ ...useStyles.button, width: '100%' }}
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
                  additionalQuestionTypes={AdditionalQuestionTypes}
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
                when={unsavedChanges ? true : false}
                message={JSON.stringify({
                  header: 'Unsaved Changes',
                  content: 'Are you sure you want to leave without saving changes?',
                })}
              />
              {cancelModal && (
                <CustomConfirmModal
                  header='Cancel Changes'
                  content='Are you sure you want to cancel changes made?'
                  handleConfirmModalChange={(val: boolean, isOk: boolean) => {
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
      )}
    </Grid>
  )
}

export { Withdrawal as default }
