import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Box, Button, Card, Stack, styled, TextField } from '@mui/material'
import moment from 'moment'
import { Prompt, useHistory } from 'react-router-dom'
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
import { MthTitle } from '@mth/enums'
import { mthButtonClasses } from '@mth/styles/button.style'
import { HOMEROOM_LEARNING_LOGS } from '../../../../../utils/constants'
import AddNewQuestionModal from '../../Components/AddNewQuestionModal/AddNewQuestionModal'
import { DefaultQuestionModal } from '../../Components/DefaultQuestionModal/DefaultQuestionModal'
import {
  createAssignmentMutation,
  createOrUpdateLearningLogQuestionMutation,
  GetLearningLogQuestionByMasterIdQuery,
  GetMastersByIDGql,
} from '../../services'
import { defaultQuestions } from '../defaultValue'
import { LearningLogQuestion } from '../types'
import { Master } from '../types'
import CustomQuestion from './AssignmentQuestion/CustomQuestion'
import LearningQuestionList from './AssignmentQuestion/LearningQuestionList'
import { masterUseStyles } from './styles'
import { AssignmentQuestionType, LearningQuestionType } from './types'

const CssTextField = styled(TextField, {
  shouldForwardProp: (props) => props !== 'focusColor',
})(() => ({
  // focused color for input with variant='standard'
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

const EditAssignment: React.FC<{ masterId: number }> = ({ masterId }) => {
  const history = useHistory()

  const [master, setMaster] = useState<Master>('')
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
  const [confirmTitle, setConfirmTitle] = useState<string>('')
  const [confirmSubTitle, setConfirmSubTitle] = useState<string>('')

  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [openDefaultQuestionModal, setOpenDefaultQuestionModal] = useState<boolean>(false)
  const [openAddQuestionModal, setOpenAddQuestionModal] = useState<boolean>(false)

  const [questionType, setQuestionType] = useState<RadioGroupOption[]>(defaultQuestions)
  const [learningQuestionList, setLearningQuestionList] = useState<LearningQuestionType[]>([])

  const [assignmentId, setAssignmentId] = useState<number | null>()

  const [isCustomeQuestionModal, setIsCustomeQuestionModal] = useState<boolean>(false)
  const [editQuestionList, setEditQuestionList] = useState<AssignmentQuestionType[]>([])

  const { loading: masterLoading, data: masterData } = useQuery(GetMastersByIDGql, {
    variables: {
      masterId: masterId,
    },
    skip: masterId ? false : true,
    fetchPolicy: 'network-only',
  })

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
      setLearningQuestionList(
        questionData?.getLearningLogQuestionByAssignmentId.map((item) => {
          return {
            ...item,
            response: '',
            active: !item.parent_slug ? true : false,
            options: JSON.parse(item.options),
          }
        }),
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
                value={assignmentTitle}
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
    history.push(`${HOMEROOM_LEARNING_LOGS}/edit/${masterId}`)
  }

  const handleCancel = () => {
    setIsConfirmModal(true)
    setConfirmTitle('Cancel Changes')
    setConfirmSubTitle('Are you sure you want to cancel changes made?')
  }

  const [createAssignment] = useMutation(createAssignmentMutation)

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
    setAssignmentId(parseInt(newAssignment.createNewAssignment.id))
  }

  const handleSaveQuestion = async (value: LearningLogQuestion[]) => {
    await createLearningLogQuestion({
      variables: {
        createOrUpdateLearningLogQuestionInput: value.map((item) => {
          return {
            ...item,
            assignment_id: assignmentId,
            page: 1,
          }
        }),
      },
    })
    setOpenAddQuestionModal(false)
    setIsCustomeQuestionModal(false)
    setQuestionType(defaultQuestions)
    questionRefetch()
  }

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
        <PageHeader title={master?.master_name || ''} to={`${HOMEROOM_LEARNING_LOGS}/edit/${masterId}`}>
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
        {/* <CommonSelectList settingList={editAssignmentList}></CommonSelectList> */}
        {editAssignmentList?.map((editSeeing, index) => (
          <CommonSelect key={index} index={index + 1} selectItem={editSeeing} verticalDividHeight='auto' />
        ))}
      </Card>
      {assignmentId && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
            <Subtitle fontWeight='700' size={'medium'}>
              Learning Log
            </Subtitle>
            <Box display='flex'>
              <Button sx={{ ...mthButtonClasses.roundXsGray, mr: '20px' }} type='button' onClick={handleCancel}>
                Cancel
              </Button>
              <Button sx={mthButtonClasses.roundXsDark} type='button' onClick={handleSubmit}>
                Save
              </Button>
            </Box>
          </Box>
          <Card
            sx={{
              p: 4,
              borderRadius: '12px',
              boxShadow: '0px 0px 35px rgba(0, 0, 0, 0.05)',
              // width: '50%',
              margin: '20px auto',
            }}
          >
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
                justifyContent: 'flex-end',
              }}
            >
              <Box
                sx={{
                  top: '10%',
                  px: '12%',
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <LearningQuestionList learningQuestionList={learningQuestionList} />
                </Box>
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
                  }}
                >
                  + Add Question
                </Button>
                <Button sx={{ ...mthButtonClasses.roundXsDark, minHeight: '50px', marginTop: '60px' }} type='button'>
                  + Add Page
                </Button>
                <Subtitle size={'medium'}>1/1</Subtitle>
              </Box>
            </Box>
          </Card>
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
    </Box>
  )
}

export default EditAssignment
