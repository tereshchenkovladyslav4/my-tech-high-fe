import { Alert, Box, Button, Card, Grid, IconButton, List, outlinedInputClasses, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
// @ts-ignore
import BGSVG from '../../../../../assets/ApplicationBG.svg'
import { useStyles } from './styles'
import { ApplicationQuestion, initQuestions } from './types'
import ApplicationQuestionItem from './Question'
import { Form, Formik } from 'formik'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import AddQuestionModal from './AddQuestion/index'
import { useMutation, useQuery } from '@apollo/client'
import { getQuestionsGql, saveQuestionsGql, deleteQuestionGql } from './services'
import AddStudentButton from './AddStudentButton'
import CustomModal from './CustomModals'
import { useHistory } from 'react-router-dom'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { useRecoilValue } from 'recoil'
import { userRegionState } from '../../../../../providers/UserContext/UserProvider'
import _ from 'lodash'

const SortableItem = SortableElement(ApplicationQuestionItem)

const SortableListContainer = SortableContainer(({ items }: { items: ApplicationQuestion[] }) => (
  <List>
    {items.map((item, index) => (
      <SortableItem index={index} key={index} item={item} />
    ))}
  </List>
))

export default function ApplicationQuestions() {
  const [questions, setQuestions] = useState<ApplicationQuestion[]>([])
  const [openAddQuestion, setOpenAddQuestion] = useState(false)
  const [unSaveChangeModal, setUnSaveChangeModal] = useState(false)
  const [cancelModal, setCancelModal] = useState(false)
  const [sucessAlert, setSucessAlert] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const region = useRecoilValue(userRegionState)
  const [saveQuestionsMutation] = useMutation(saveQuestionsGql)
  const [deleteQuestion] = useMutation(deleteQuestionGql)

  const { data, refetch } = useQuery(getQuestionsGql, {
    variables: { input: { region_id: +region?.regionDetail?.id } },
    fetchPolicy: 'network-only',
  })
  const history = useHistory()
  useEffect(() => {
    if (data?.getApplicationQuestions) {
      setQuestions(
        data.getApplicationQuestions
          .map((v) => ({ ...v, options: v.options ? JSON.parse(v.options || '[]') : [] }))
          .sort((a, b) => a.order - b.order),
      )
    }


  }, [data])

  useEffect(() => {
    window.onbeforeunload = (e) => {
      if (!unsavedChanges) return
      e?.preventDefault();
      return 'Unsaved changes'; // Legacy method for cross browser support
    };
    const unreg = history.block(() => {
      if (unsavedChanges) {
        return JSON.stringify({
          header: 'Unsaved Changes',
          content: 'Are you sure you want to leave without saving changes?'
        })
      }
      return
    })
    return () => {
      unreg()
      window.onbeforeunload = null
    }
  }, [history, unsavedChanges])

  return (
    <Grid
      sx={{
        padding: '1rem 2.5rem',
      }}
    >
      <Formik
        initialValues={questions}
        enableReinitialize={true}
        validate={(values) => {
          if (_.isEqual(values, questions) === unsavedChanges) {
            setUnsavedChanges(!unsavedChanges)
          }
        }}
        onSubmit={async (vals) => {
          questions.forEach((q) => {
            if (!vals.find((v) => v.id === q.id)) {
              deleteQuestion({ variables: { id: q.id } })
            }
          })
          await saveQuestionsMutation({
            variables: {
              input: vals.map((v) => ({
                id: v.id,
                type: v.type,
                question: v.question,
                required: v.required,
                options: v.options?.length ? JSON.stringify(v.options) : undefined,
                order: v.order,
                region_id: +region?.regionDetail?.id,
              })),
            },
          })
          refetch()
          setSucessAlert(true)
          setTimeout(() => setSucessAlert(false), 5000)
        }}
      >
        {({ values, setValues }) => (
          <Form>
            <Box
              sx={{
                textAlign: 'left',
                marginBottom: '12px',
                marginLeft: '32px',
              }}
            >
              <IconButton
                onClick={() => {
                  history.goBack()
                }}
                sx={{
                  position: 'relative',
                  bottom: '2px',
                }}
              >
                <ArrowBackIosRoundedIcon
                  sx={{
                    fontSize: '15px',
                    stroke: 'black',
                    strokeWidth: 2,
                  }}
                />
              </IconButton>
              <Typography paddingLeft='7px' fontSize='20px' fontWeight='700' component='span'>
                Application Questions
              </Typography>
            </Box>
            <Card sx={styles.card}>
              <Box
                sx={{
                  display: 'flex',
                  height: '40px',
                  width: '100%',
                  justifyContent: 'end',
                }}
              >
                <Button
                  sx={styles.cancelButton}
                  onClick={() => {
                    if (unsavedChanges) {
                      setCancelModal(true)
                    } else {
                      history.goBack()
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button sx={styles.actionButtons} type='submit'>
                  Save
                </Button>
              </Box>
              <Box
                paddingY={10}
                sx={{
                  backgroundImage: `url(${BGSVG})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'top',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ color: '#4145FF', fontWeight: 700, fontSize: '24.1679px' }}>Info Center</Typography>

                <Typography sx={{ color: '#1A1A1A', fontWeight: 500, fontSize: '24.1679px' }}>Apply</Typography>

                <Box width='600px'>
                  {initQuestions.map((it, index) => (
                    <ApplicationQuestionItem key={index} item={it} mainQuestion={true} />
                  ))}
                  <SortableListContainer
                    items={values}
                    useDragHandle={true}
                    onSortEnd={({ oldIndex, newIndex }) => {
                      const newData = arrayMove(values, oldIndex, newIndex).map((v, i) => ({
                        ...v,
                        order: i,
                      }))
                      setValues(newData)
                    }}
                  />
                </Box>
                {openAddQuestion && <AddQuestionModal onClose={() => setOpenAddQuestion(false)} />}

                <Button sx={{ ...useStyles.submitButton, color: 'white' }} onClick={() => setOpenAddQuestion(true)}>
                  Add Question
                </Button>
              </Box>
              <AddStudentButton />

              {unSaveChangeModal && (
                <CustomModal
                  title='Unsaved Changes'
                  description='Are you sure you want to leave without saving changes?'
                  onClose={() => {
                    setUnSaveChangeModal(false)
                  }}
                  onConfirm={() => {
                    setUnSaveChangeModal(false)
                    setUnsavedChanges(false)
                    history.goBack()
                  }}
                />
              )}
              {cancelModal && (
                <CustomModal
                  title='Cancel Changes'
                  description='Are you sure you want to cancel changes made?'
                  cancelStr='No'
                  confirmStr='Yes'
                  onClose={() => {
                    setCancelModal(false)
                  }}
                  onConfirm={() => {
                    setCancelModal(false)
                    setUnsavedChanges(false)
                    history.goBack()
                  }}
                />
              )}
              {sucessAlert && (
                <Alert
                  sx={{
                    position: 'absolute',
                    bottom: '25px',
                    marginBottom: '15px',
                    right: '0',
                  }}
                  onClose={() => setSucessAlert(false)}
                  severity='success'
                >
                  Questions saved successfully
                </Alert>
              )}
            </Card>
          </Form>
        )}
      </Formik>
    </Grid>
  )
}

const styles = {
  card: {
    padding: '20px',
    background: '#EEF4F8',
  },
  actionButtons: {
    borderRadius: 10,
    mr: '20px',
    background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
    fontWeight: 'bold',
    paddingX: '20px',
    color: 'white',
  },
  cancelButton: {
    borderRadius: 10,
    mr: '20px',
    background: 'linear-gradient(90deg, #D23C33 0%, rgba(62, 39, 131, 0) 100%) #D23C33',
    fontWeight: 'bold',
    paddingX: '20px',
    color: 'white',
  },
  addButton: {
    textAlign: 'center',
    color: '#1A1A1A',
  },
}
