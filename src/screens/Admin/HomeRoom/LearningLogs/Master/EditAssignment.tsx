import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import DehazeIcon from '@mui/icons-material/Dehaze'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { Box, Button, Card, IconButton, List, Stack, styled, TextField, Tooltip } from '@mui/material'
import moment from 'moment'
import { Prompt, useHistory } from 'react-router-dom'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { SortableHandle } from 'react-sortable-hoc'
import BGSVG from '@mth/assets/ApplicationBG.svg'
import { CommonSelect } from '@mth/components/CommonSelect'
import { DefaultDatePicker } from '@mth/components/DefaultDatePicker/DefaultDatePicker'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
import { MthTimePicker } from '@mth/components/MthTimePicker/MthTimePicker'
import PageHeader from '@mth/components/PageHeader'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { QuestionTypes } from '@mth/constants'
import { MthRoute, MthTitle } from '@mth/enums'
import { mthButtonClasses } from '@mth/styles/button.style'
import AddNewQuestionModal from '../../Components/AddNewQuestionModal/AddNewQuestionModal'
import { DefaultQuestionModal } from '../../Components/DefaultQuestionModal/DefaultQuestionModal'
import {
  createAssignmentMutation,
  createOrUpdateLearningLogQuestionMutation,
  getAssignmentByIdGql,
  GetLearningLogQuestionByMasterIdQuery,
  GetMastersByIDGql,
  updateAssignmentMutation,
} from '../../services'
import { defaultQuestions } from '../defaultValue'
import { LearningLogQuestion } from '../types'
import { Master } from '../types'
import CustomQuestion from './AssignmentQuestion/CustomQuestion'
import LearningQuestionList from './AssignmentQuestion/LearningQuestionList'
import { masterUseStyles } from './styles'
import { Assignment, AssignmentQuestionType, LearningQuestionType } from './types'

const CssTextField = styled(TextField, {
  shouldForwardProp: (props) => props !== 'focusColor',
})(() => ({
  '& .MuiOutlinedInput-root': {
    minWidth: '500px',
    height: '56px',
    '& fieldset': {
      border: '1px solid rgba(26, 26, 26, 0.25) !important',
    },
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#ccc',
    borderWidth: '1px',
  },
  // focused color for input with variant='filled'
  '& .MuiFilledInput-underline:after': {
    borderBottomColor: '#ccc',
    borderWidth: '1px',
  },
}))

const EditAssignment: React.FC<{ masterId: number; assignmentId?: number }> = ({ masterId, assignmentId }) => {
  const history = useHistory()

  const [tempAssignmentId, setTempAssignmentId] = useState<number>(assignmentId)

  const [master, setMaster] = useState<Master>()
  const [assignmentTitle, setAssignmentTitle] = useState<string>('')
  const [isTitleError, setIsTitleError] = useState<boolean>(false)

  const [dueDate, setDueDate] = useState<Date>(new Date())
  const [dueTime, setDueTime] = useState<string>('00:00')
  const [reminderDate, setReminderDate] = useState<Date>(new Date())
  const [reminderTime, setReminderTime] = useState('00:00')
  const [teacherDate, setTeacherDate] = useState<Date>(new Date())
  const [teacherTime, setTeacherTime] = useState<string>('00:00')

  const [autoGradeDate, setAutoGradeDate] = useState<Date>(new Date())
  const [autoGradeTime, setAutoGradeTime] = useState('00:00')
  const [autoGradeEmail, setAutoGradeEmail] = useState<boolean>(false)

  const [isConfirmModal, setIsConfirmModal] = useState<boolean>(false)
  const [isConfirmQuestionModal, setIsConfirmQuestionModal] = useState<boolean>(false)
  const [questionChanged, setQuestionChanged] = useState<boolean>(false)

  const [confirmTitle, setConfirmTitle] = useState<string>('')
  const [confirmSubTitle, setConfirmSubTitle] = useState<string>('')

  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [openDefaultQuestionModal, setOpenDefaultQuestionModal] = useState<boolean>(false)
  const [openAddQuestionModal, setOpenAddQuestionModal] = useState<boolean>(false)

  const [questionType, setQuestionType] = useState<RadioGroupOption[]>(defaultQuestions)
  const [tempLearningQuestionList, setTempLearningQuestionList] = useState<LearningQuestionType[]>([])

  const [assignment, setAssignment] = useState<Assignment>()
  const [tempAssignment, setTempAssignment] = useState<Assignment>()

  const [isCustomeQuestionModal, setIsCustomeQuestionModal] = useState<boolean>(false)
  const [editQuestionList, setEditQuestionList] = useState<AssignmentQuestionType[]>([])
  const [questionPageNum, setQuestionPageNum] = useState<number>(1)

  const [deletePageNum, setDeletePageNum] = useState<number | null>()
  const [confirmDeletePageModal, setConfirmDeletePageModal] = useState<boolean>(false)

  const [deleteQuestionSlug, setDeleteQuestionSlug] = useState<string>('')
  const [confirmDeleteQuestionModal, setConfirmDeleteQuestionModal] = useState<boolean>(false)

  const { loading: masterLoading, data: masterData } = useQuery(GetMastersByIDGql, {
    variables: {
      masterId: masterId,
    },
    skip: masterId ? false : true,
    fetchPolicy: 'network-only',
  })

  const {
    loading: assignmentLoading,
    data: assignmentData,
    refetch: assignmentRefetch,
  } = useQuery(getAssignmentByIdGql, {
    variables: {
      assignmentId: tempAssignmentId,
    },
    skip: tempAssignmentId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!assignmentLoading && assignmentData?.getAssignmentById) {
      setAssignment(assignmentData?.getAssignmentById)
      setTempAssignment(assignmentData?.getAssignmentById)
    }
  }, [assignmentLoading, assignmentData])

  const {
    loading: questionLoading,
    data: questionData,
    refetch: questionRefetch,
  } = useQuery(GetLearningLogQuestionByMasterIdQuery, {
    variables: {
      assignmentId: assignmentId,
    },
    skip: assignmentId ? false : true,
    fetchPolicy: 'network-only',
  })

  const [createLearningLogQuestion] = useMutation(createOrUpdateLearningLogQuestionMutation)

  useEffect(() => {
    if (!questionLoading && questionData?.getLearningLogQuestionByAssignmentId) {
      setTempLearningQuestionList(
        questionData?.getLearningLogQuestionByAssignmentId
          .map((item) => {
            return {
              ...item,
              response: '',
              active: !item.parent_slug ? true : false,
              options: JSON.parse(item.options),
            }
          })
          .sort((a, b) => (a.order > b.order ? 1 : -1)),
      )
    }
  }, [questionLoading, questionData])

  useEffect(() => {
    if (!masterLoading && masterData?.getMastersById) {
      setMaster(masterData?.getMastersById)
    }
  }, [masterLoading, masterData])

  const editAssignmentList = [
    {
      name: 'Title',
      component: (
        <Box>
          <Stack direction='row' spacing={1} alignItems='center' sx={{ my: 2 }}>
            <Stack direction='row' sx={{ ml: 1.5 }} alignItems='center'>
              <CssTextField
                label='Title'
                placeholder='Entry'
                fullWidth
                InputLabelProps={{ shrink: true }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAssignmentTitle(e.target.value)
                  setIsTitleError(false)
                  setIsChanged(true)
                }}
                className='MthFormField'
                value={tempAssignment?.title}
              />
            </Stack>
          </Stack>
          {isTitleError && <Subtitle sx={masterUseStyles.formError}>Required</Subtitle>}
        </Box>
      ),
    },
    {
      name: 'Due Date',
      component: (
        <Stack direction='row' spacing={1} alignItems='center' sx={{ my: 2 }}>
          <Stack direction='row' sx={{ ml: 1.5 }} alignItems='center'>
            <Box sx={{ minWidth: '284px' }}>
              <DefaultDatePicker
                date={dueDate}
                label='Date'
                handleChange={(e) => {
                  setDueDate(e)
                  setIsChanged(true)
                }}
              />
            </Box>
            <Box sx={{ minWidth: '220px' }}>
              <MthTimePicker
                time={dueTime}
                label='Time'
                handleChange={(e) => {
                  setDueTime(e)
                  setIsChanged(true)
                }}
              />
            </Box>
          </Stack>
        </Stack>
      ),
    },
    {
      name: 'Reminder',
      component: (
        <Stack direction='row' spacing={1} alignItems='center' sx={{ my: 2 }}>
          <Stack direction='row' sx={{ ml: 1.5 }} alignItems='center'>
            <Box sx={{ minWidth: '284px' }}>
              <DefaultDatePicker
                date={reminderDate}
                label='Date'
                handleChange={(e) => {
                  setReminderDate(e)
                  setIsChanged(true)
                }}
              />
            </Box>
            <Box sx={{ minWidth: '220px' }}>
              <MthTimePicker
                time={reminderTime}
                label='Time'
                handleChange={(e) => {
                  setReminderTime(e)
                  setIsChanged(true)
                }}
              />
            </Box>
          </Stack>
        </Stack>
      ),
    },
    {
      name: 'Auto-grade',
      component: (
        <Stack direction='row' spacing={1} alignItems='center' sx={{ my: 2 }}>
          <Stack direction='row' sx={{ ml: 1.5 }} alignItems='center'>
            <Box sx={{ minWidth: '284px' }}>
              <DefaultDatePicker
                date={autoGradeDate}
                label='Date'
                handleChange={(e) => {
                  setAutoGradeDate(e)
                  setIsChanged(true)
                }}
              />
            </Box>
            <Box sx={{ minWidth: '220px' }}>
              <MthTimePicker
                time={autoGradeTime}
                label='Time'
                handleChange={(e) => {
                  setAutoGradeTime(e)
                  setIsChanged(true)
                }}
              />
            </Box>
            <MthCheckbox
              label={'Send Auto-grade Email'}
              labelSx={{ fontWeight: 700 }}
              wrapSx={{ ml: 6 }}
              checked={autoGradeEmail}
              onChange={(e) => {
                setAutoGradeEmail(e.target.checked)
                setIsChanged(true)
              }}
            />
          </Stack>
        </Stack>
      ),
    },
    {
      name: 'Teacher Deadline',
      component: (
        <Stack direction='row' spacing={1} alignItems='center' sx={{ my: 2 }}>
          <Stack direction='row' sx={{ ml: 1.5 }} alignItems='center'>
            <Box sx={{ minWidth: '284px' }}>
              <DefaultDatePicker
                date={teacherDate}
                label='Date'
                handleChange={(e) => {
                  setTeacherDate(e)
                  setIsChanged(true)
                }}
              />
            </Box>
            <Box sx={{ minWidth: '220px' }}>
              <MthTimePicker
                time={teacherTime}
                label='Time'
                handleChange={(e) => {
                  setTeacherTime(e)
                  setIsChanged(true)
                }}
              />
            </Box>
          </Stack>
        </Stack>
      ),
    },
  ]

  const handleCancelSubmit = () => {
    setIsConfirmModal(false)
    setIsConfirmQuestionModal(false)
    history.push(`${MthRoute.HOMEROOM_LEARNING_LOGS}/edit/${masterId}`)
  }

  const handleCancel = () => {
    setIsConfirmModal(true)
    setConfirmTitle('Cancel Changes')
    setConfirmSubTitle('Are you sure you want to cancel changes made?')
  }

  const handleQuestionCancel = () => {
    if (questionChanged) {
      setIsConfirmQuestionModal(true)
      setConfirmTitle('Unsaved Changes')
      setConfirmSubTitle('Are you sure you want to leave without saving changes?')
    } else {
      handleCancelSubmit()
    }
  }

  const [createAssignment] = useMutation(createAssignmentMutation)
  const [updateAssignment] = useMutation(updateAssignmentMutation)

  const handleSubmit = async () => {
    if (!assignmentTitle) {
      setIsTitleError(true)
      return
    }
    const dueDateTime = moment(`${moment(dueDate).tz('America/Denver').format('yyyy-MM-DD')} ${dueTime}`).toISOString()
    const reminderDateTime = moment(
      `${moment(reminderDate).tz('America/Denver').format('yyyy-MM-DD')} ${reminderTime}`,
    ).toISOString()
    const autoGradeDateTime = moment(
      `${moment(autoGradeDate).tz('America/Denver').format('yyyy-MM-DD')} ${autoGradeTime}`,
    ).toISOString()
    const teacherDateTime = moment(
      `${moment(teacherDate).tz('America/Denver').format('yyyy-MM-DD')} ${teacherTime}`,
    ).toISOString()
    const { data: newAssignment } = await createAssignment({
      variables: {
        createNewAssignmentInput: {
          autoGradeDateTime: autoGradeDateTime,
          autoGradeEmail: autoGradeEmail,
          dueDateTime: dueDateTime,
          master_id: masterId,
          reminderDateTime: reminderDateTime,
          title: assignmentTitle,
          teacher_deadline: teacherDateTime,
        },
      },
    })
    setIsChanged(false)
    setTempAssignmentId(parseInt(newAssignment.createNewAssignment.id))
    assignmentRefetch()
  }

  const handleSaveQuestion = async (value: LearningLogQuestion[]) => {
    setQuestionChanged(true)
    if (!value.id) {
      setTempLearningQuestionList([
        ...tempLearningQuestionList,
        ...value.map((item) => {
          return {
            ...item,
            assignment_id: assignmentId,
            page: questionPageNum,
          }
        }),
      ])
    } else {
      setTempLearningQuestionList(
        tempLearningQuestionList.map((item) => {
          if (item.id === value[0].id) {
            return value[0]
          } else {
            return item
          }
        }),
      )
    }
    setIsCustomeQuestionModal(false)
    setOpenAddQuestionModal(false)
  }

  const submitQuestionSave = async () => {
    if (tempLearningQuestionList.length > 0) {
      await createLearningLogQuestion({
        variables: {
          createOrUpdateLearningLogQuestionInput: tempLearningQuestionList.map((item, index) => {
            return {
              assignment_id: item.assignment_id,
              page: item.page,
              parent_slug: item.parent_slug,
              question: item.question,
              slug: item.slug,
              type: item.type,
              options: JSON.stringify(item.options),
              default_question: item.default_question,
              order: index + 1,
            }
          }),
        },
      })
    } else {
      await createLearningLogQuestion({
        variables: {
          createOrUpdateLearningLogQuestionInput: [{ assignment_id: assignmentId }],
        },
      })
    }

    await updateAssignment({
      variables: {
        updateAssignmentInput: {
          autoGradeDateTime: moment(tempAssignment?.auto_grade).toISOString(),
          autoGradeEmail: tempAssignment?.auto_grade_email ? true : false,
          dueDateTime: moment(tempAssignment?.due_date).toISOString(),
          master_id: masterId,
          reminderDateTime: moment(tempAssignment?.reminder_date).toISOString(),
          title: tempAssignment?.title,
          teacher_deadline: moment(tempAssignment?.teacher_deadline).toISOString(),
          assignment_id: parseInt(tempAssignment?.id),
          page_count: tempAssignment?.page_count,
        },
      },
    })

    await assignmentRefetch()

    await questionRefetch()
  }

  const handleDeleteQuestion = (val: LearningQuestionType) => {
    setDeleteQuestionSlug(val?.slug)
    setConfirmDeleteQuestionModal(true)
  }

  const confirmDeleteQuestion = () => {
    setTempLearningQuestionList(tempLearningQuestionList.filter((item) => item.slug !== deleteQuestionSlug))
    setConfirmDeleteQuestionModal(false)
  }

  const handleAddPage = () => {
    setTempAssignment({
      ...tempAssignment,
      page_count: tempAssignment?.page_count + 1,
    })
  }

  const DragHandle = SortableHandle(() => (
    <Tooltip title='Move'>
      <IconButton>
        <DehazeIcon />
      </IconButton>
    </Tooltip>
  ))

  const handleDeletePage = (pageNum: number) => {
    setDeletePageNum(pageNum)
    setConfirmDeletePageModal(true)
  }

  const confirmDeletePage = () => {
    setTempLearningQuestionList(
      tempLearningQuestionList
        .filter((item) => item.page !== deletePageNum)
        .map((item) => {
          if (item.page > deletePageNum) {
            return {
              ...item,
              page: item.page - 1,
            }
          } else {
            return item
          }
        }),
    )
    setTempAssignment({ ...tempAssignment, page_count: tempAssignment?.page_count - 1 })
    setConfirmDeletePageModal(false)
  }

  const LearningQuestionPage = ({ pageNum }: { pageNum: number }) => {
    return (
      <Card
        key={pageNum}
        sx={{
          p: 4,
          borderRadius: '12px',
          boxShadow: '0px 0px 35px rgba(0, 0, 0, 0.05)',
          margin: '20px auto',
        }}
      >
        <Box display='flex' justifyContent={'flex-end'}>
          <Tooltip title='Delete'>
            <IconButton onClick={() => handleDeletePage(pageNum)}>
              <DeleteForeverOutlinedIcon />
            </IconButton>
          </Tooltip>
          <DragHandle />
        </Box>
        <Box
          paddingBottom={10}
          paddingX={'20px'}
          sx={{
            position: 'relative',
            backgroundImage: `url(${BGSVG})`,
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '66vh',
            justifyContent:
              tempLearningQuestionList.filter((item) => item.page === pageNum).length === 0
                ? 'flex-end'
                : 'space-between',
          }}
        >
          <Box sx={{ width: '100%' }}>
            <LearningQuestionList
              learningQuestionList={tempLearningQuestionList.filter((item) => item.page === pageNum)}
              handleDeleteQuestion={(val) => handleDeleteQuestion(val)}
            />
          </Box>
          <Box
            sx={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              marginTop: 2,
            }}
          >
            <Button
              sx={{ ...mthButtonClasses.primary }}
              type='button'
              onClick={() => {
                setOpenDefaultQuestionModal(true)
                setQuestionPageNum(pageNum)
              }}
            >
              + Add Question
            </Button>
            <Button
              sx={{ ...mthButtonClasses.roundXsDark, minHeight: '50px', marginTop: '60px' }}
              type='button'
              onClick={() => handleAddPage()}
            >
              + Add Page
            </Button>
            <Subtitle size={'medium'}>{`${pageNum}/${tempAssignment?.page_count}`}</Subtitle>
          </Box>
        </Box>
      </Card>
    )
  }

  const SortableItem = SortableElement(LearningQuestionPage)

  const SortableListContainer = SortableContainer(({ items }: { items: number[] }) => (
    <List>
      {items.map((item, index) => (
        <SortableItem pageNum={item + 1} key={index} index={index} />
      ))}
    </List>
  ))

  return (
    <Box sx={{ p: 4, textAlign: 'left' }}>
      <Prompt
        when={isChanged}
        message={JSON.stringify({
          header: MthTitle.UNSAVED_TITLE,
          content: MthTitle.UNSAVED_DESCRIPTION,
        })}
      />
      <Card
        sx={{
          p: 4,
          borderRadius: '12px',
          boxShadow: '0px 0px 35px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* <Box sx={{ mb: 4 }}> */}
        <PageHeader title={master?.master_name || ''} to={`${MthRoute.HOMEROOM_LEARNING_LOGS}/edit/${masterId}`}>
          <Box display='flex'>
            <Button sx={{ ...mthButtonClasses.roundXsGray, mr: '20px' }} type='button' onClick={handleCancel}>
              Cancel
            </Button>
            <Button sx={mthButtonClasses.roundXsDark} type='button' onClick={handleSubmit}>
              Save
            </Button>
          </Box>
        </PageHeader>
        {/* </Box> */}
        {editAssignmentList?.map((editSeeing, index) => (
          <CommonSelect key={index} index={index + 1} selectItem={editSeeing} verticalDividHeight='auto' />
        ))}
      </Card>
      {assignment && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
            <Subtitle fontWeight='700' size={'medium'}>
              Learning Log
            </Subtitle>
            <Box display='flex'>
              <Button sx={{ ...mthButtonClasses.roundXsGray, mr: '20px' }} type='button' onClick={handleQuestionCancel}>
                Cancel
              </Button>
              <Button sx={mthButtonClasses.roundXsDark} type='button' onClick={submitQuestionSave}>
                Save
              </Button>
            </Box>
          </Box>
          {tempAssignment?.page_count > 0 && (
            <SortableListContainer
              items={[...Array(tempAssignment?.page_count).keys()]}
              useDragHandle={true}
              onSortEnd={({ oldIndex, newIndex }) => {
                const newList = tempLearningQuestionList.map((item: LearningLogQuestion) => {
                  if (item.page === oldIndex + 1) {
                    return {
                      ...item,
                      page: newIndex + 1,
                    }
                  } else if (item.page === newIndex + 1) {
                    return {
                      ...item,
                      page: oldIndex + 1,
                    }
                  } else {
                    return item
                  }
                })
                setTempLearningQuestionList(newList)
              }}
            />
          )}
        </>
      )}

      {isConfirmModal && (
        <WarningModal
          handleModem={() => setIsConfirmModal(false)}
          title={confirmTitle}
          subtitle={confirmSubTitle}
          btntitle='Yes'
          canceltitle='Cancel'
          handleSubmit={handleCancelSubmit}
          showIcon={true}
          textCenter
        />
      )}
      {isConfirmQuestionModal && (
        <WarningModal
          handleModem={() => setIsConfirmQuestionModal(false)}
          title={confirmTitle}
          subtitle={confirmSubTitle}
          btntitle='Yes'
          canceltitle='Cancel'
          handleSubmit={handleCancelSubmit}
          showIcon={true}
          textCenter
        />
      )}

      <CustomQuestion
        isCustomeQuestionModal={isCustomeQuestionModal}
        onClose={() => setIsCustomeQuestionModal(false)}
        master={master}
        handleSaveQuestion={handleSaveQuestion}
        assignmentId={assignmentId}
        editQuestionList={editQuestionList}
      />
      {openDefaultQuestionModal && (
        <DefaultQuestionModal
          onClose={() => {
            setOpenDefaultQuestionModal(false)
          }}
          onAction={(value: 'default' | 'custom') => {
            if (value === 'default') {
              setOpenAddQuestionModal(true)
            }
            if (value === 'custom') {
              setEditQuestionList([
                {
                  id: undefined,
                  type: QuestionTypes.TEXTBOX,
                  question: '',
                  options: [],
                  validations: [],
                  slug: `meta_${+new Date()}`,
                  parentSlug: '',
                  response: '',
                  active: true,
                },
              ])
              setIsCustomeQuestionModal(true)
            }
            setOpenDefaultQuestionModal(false)
          }}
          setQuestionType={setQuestionType}
          questionType={questionType}
        />
      )}
      {openAddQuestionModal && (
        <AddNewQuestionModal
          onClose={() => {
            setOpenAddQuestionModal(false)
            setQuestionType(defaultQuestions)
          }}
          type={questionType.find((obj) => obj.value)?.label ?? ''}
          onSave={handleSaveQuestion}
        />
      )}
      {confirmDeletePageModal && (
        <WarningModal
          handleModem={() => setConfirmDeletePageModal(false)}
          title='Delete'
          subtitle='Are you sure you want to delete this page?'
          btntitle='Delete'
          canceltitle='Cancel'
          handleSubmit={() => confirmDeletePage()}
        />
      )}

      {confirmDeleteQuestionModal && (
        <WarningModal
          handleModem={() => setConfirmDeleteQuestionModal(false)}
          title='Delete Question'
          subtitle='Are you sure you want to delete this question?'
          btntitle='Delete'
          canceltitle='Cancel'
          handleSubmit={() => confirmDeleteQuestion()}
        />
      )}
    </Box>
  )
}

export default EditAssignment
