import { Alert, Box, Button, Card, Grid, IconButton, List, outlinedInputClasses, Typography } from '@mui/material'
import React, { useEffect, useState, useContext, useMemo } from 'react'
// @ts-ignore
import BGSVG from '../../../../../assets/ApplicationBG.svg'
import { useStyles } from './styles'
import { ApplicationQuestion, initQuestions } from './types'
import ApplicationQuestionItem from './Question'
import { Form, Formik } from 'formik'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import AddNewQuestionModal from './AddNewQuestion/index'
import { useMutation, useQuery } from '@apollo/client'
import { 
  getQuestionsGql,
  saveQuestionsGql, 
  deleteQuestionGql, 
  getCountiesByRegionId, 
  getActiveSchoolYearsByRegionId,
  getSchoolDistrictsByRegionId,
  getAllRegion,
  } from './services'
import CustomModal from '../components/CustomModal/CustomModals'
import { useHistory } from 'react-router-dom'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { useRecoilValue } from 'recoil'
import { userRegionState } from '../../../../../providers/UserContext/UserProvider'
import _ from 'lodash'
import AddQuestionModal from '../components/AddQuestionModal/AddQuestionModal'
import DefaultQuestionModal from '../components/DefaultQuestionModal/DefaultQuestionModal'
import { defaultQuestions } from '../constant/defaultQuestions'
import { QuestionTypes } from '../EnrollmentQuestions/types'
import moment from 'moment'
import { DropDownItem } from '../../../../../components/DropDown/types'
import {ProgramYearContext} from '../provider/ProgramYearProvider'
import {GRADES} from '../../../../../utils/constants'
import {toOrdinalSuffix} from '../../../../../utils/stringHelpers'
import { UserContext } from '../../../../../providers/UserContext/UserProvider'
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
  const [openSelectQuestionType, setOpenSelectQuestionType] = useState(false)
  const [unSaveChangeModal, setUnSaveChangeModal] = useState(false)
  const [cancelModal, setCancelModal] = useState(false)
  const [sucessAlert, setSucessAlert] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const { me } = useContext(UserContext)
  
  const [saveQuestionsMutation] = useMutation(saveQuestionsGql)
  const [deleteQuestion] = useMutation(deleteQuestionGql)
  const [openAddQuestion, setOpenAddQuestion] = useState('')
  const [editItem, setEditItem] = useState(null)
  const {loading: countyLoading, data: countyData } = useQuery(getCountiesByRegionId, {
    variables: {regionId: Number(me?.selectedRegionId)},
    fetchPolicy: 'network-only',
  })

  const [counties, setCounties] = useState([])

  useEffect(() => {
    if (!countyLoading && countyData?.getCounties) {
      setCounties(
        countyData.getCounties
          .map((v) => {return {label: v.county_name, value: v.id}})
      )
      setUnsavedChanges(false)
    }
  }, [countyData])

  const { data, refetch } = useQuery(getQuestionsGql, {
    variables: { input: { region_id: Number(me?.selectedRegionId) } },
    fetchPolicy: 'network-only',
  })

  const { loading: schoolLoading, data: schoolYearData } = useQuery(getActiveSchoolYearsByRegionId, {
    variables: {
      regionId: Number(me?.selectedRegionId),
    },
    fetchPolicy: 'network-only',
  })

  
  const [schoolYears, setSchoolYears] = useState<Array<DropDownItem>>([])
  const [schoolYearsData, setSchoolYearsData] = useState([])
  const [grades, setGrades] = useState([])
  const [gradesDropDownItems, setGradesDropDownItems] = useState<Array<DropDownItem>>([])
  const [birthDateCut, setBirthDateCut] = useState<string>('')

  useEffect(() => {
    if (!schoolLoading && schoolYearData.getSchoolYearsByRegionId) {
      setSchoolYears(
        schoolYearData.getSchoolYearsByRegionId.map((item) => {
          return {
            label: moment(item.date_begin).format('YYYY') + '-' + moment(item.date_end).format('YYYY'),
            value: item.school_year_id,
          }
        }),
      )
      setSchoolYearsData(schoolYearData.getSchoolYearsByRegionId)
    }
  }, [schoolYearData])

  const setGradesAndBirthDateCut = (id) => {
    schoolYearsData.forEach((element) => {
      if (id == element.school_year_id) {
        setGrades(element.grades?.split(','))
        setBirthDateCut(element.birth_date_cut)
      }
    })
  }

  const [programYear, setProgramYear] = useState()
  const programYearContext = useMemo(
    () => ({
      programYear,
      setProgramYear
    }),
    []
  )

  useEffect(() => {
    if(programYear) {
      setGradesAndBirthDateCut(programYear)
    }
  }, [programYear])

  useEffect(() => {
    parseGrades()
  }, [grades])

  const parseGrades = () => {
    let dropDownItems = []
    GRADES.forEach((grade) => {
      if (grades?.includes(grade.toString())) {
        if (typeof grade !== 'string') {
          dropDownItems.push({
            label: toOrdinalSuffix(grade) + ' Grade',
            value: grade.toString(),
          })
        }
        if (typeof grade == 'string') {
          dropDownItems.push({
            label: grade,
            value: grade,
          })
        }
      }
    })
    setGradesDropDownItems(dropDownItems)
  }

  const {loading: schoolDistrictsDataLoading, data: schoolDistrictsData} = useQuery(getSchoolDistrictsByRegionId, {
    variables: {
      regionId: Number(me?.selectedRegionId),
    },
    skip: Number(me?.selectedRegionId) ? false : true,
    fetchPolicy: 'network-only',
  })
  const [schoolDistricts, setSchoolDistricts] = useState<Array<DropDownItem>>([])

  useEffect(() => {
      if(!schoolDistrictsDataLoading && schoolDistrictsData?.schoolDistrict.length > 0) {
          setSchoolDistricts(schoolDistrictsData?.schoolDistrict.map((d) => {return {label: d.school_district_name, value: d.school_district_name}}))
      }
  }, [schoolDistrictsDataLoading])

  const { data: regionData, loading: regionDataLoading, error } = useQuery(getAllRegion)
  const [availableRegions, setAvailableRegions] = useState([])
  useEffect(() => {
    !regionDataLoading &&
      setAvailableRegions(
        regionData.regions?.map((region) => ({
          label: region.name,
          value: region.id,
        })),
      )
  }, [regionDataLoading])


  const history = useHistory()
  useEffect(() => {
    if (data?.getApplicationQuestions) {
      setQuestions(
        data.getApplicationQuestions
          .map((v) => ({ ...v, options: v.options ? JSON.parse(v.options || '[]') : [] }))
          .sort((a, b) => a.order - b.order),
      )
      setUnsavedChanges(false)
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

  const onSelectDefaultQuestions = (selected) => {
    const selectedQuestion = defaultQuestions.filter((d) => d.label == selected)[0]
    let options = []
    if(selectedQuestion.slug === 'county') {
      options = counties
    }
    else if(selectedQuestion.slug === 'program_year') {
      options = schoolYears
    }
    else if(selectedQuestion.slug === 'packet_school_district') {
      options = schoolDistricts
    }
    else if(selectedQuestion.slug === 'address_state') {
      options = availableRegions
    }
    else if(selectedQuestion.slug === 'student_gender') {
      options = [
        {label: 'Male', value: 1},
        {label: 'Female', value: 2},
        {label: 'Non Binary', value: 3},
        {label: 'Undeclared', value: 4},
      ]
    }
    else if(selectedQuestion.slug === 'student_grade_level') {
      options = gradesDropDownItems
    }

    const editItemTemp = {
      type: QuestionTypes.find((q) => q.label === selectedQuestion.type).value,
      question: selectedQuestion.label,
      validation: selectedQuestion.validation,
      default_question: true,
      options: options,
      slug: selectedQuestion.slug
    }
    setEditItem(editItemTemp)
    setOpenAddQuestion('new')
  }

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
                validation: v.validation,
                student_question: v.student_question,
                default_question: v.default_question,
                region_id: Number(me?.selectedRegionId),
                slug: v.slug || '',
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

                <ProgramYearContext.Provider value={programYearContext}>
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
                          order: i + 1,
                        }))
                        setValues(newData)
                      }}
                    />
                  </Box>
                </ProgramYearContext.Provider>
                {openAddQuestion === 'new' && <AddNewQuestionModal onClose={(e) => {setOpenAddQuestion(''); setOpenSelectQuestionType(e)}} editItem={editItem} newQuestion={true}/>}
                {openAddQuestion === 'default' && <DefaultQuestionModal onClose={() => {setOpenAddQuestion(''); setOpenSelectQuestionType(true)}} onCreate={(e) => {onSelectDefaultQuestions(e)}}/>}
                {openSelectQuestionType && <AddQuestionModal onClose={() => setOpenSelectQuestionType(false)} onCreate={(e) => {setOpenAddQuestion(e); setEditItem(null); setOpenSelectQuestionType(false)}}/>}

                <Button sx={{ ...useStyles.submitButton, color: 'white' }} onClick={() => setOpenSelectQuestionType(true)}>
                  Add Question
                </Button>
              </Box>


              <Box sx={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button sx={{ ...useStyles.addStudentButton }}>Add Student</Button>
                <Button sx={{ ...useStyles.submitButton, color: 'white' }}>Submit to Utah Program</Button>
              </Box>

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
