import { Box, Typography, Card, Grid, IconButton, Button, Alert } from '@mui/material';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import React, { FunctionComponent, useContext, useEffect, useMemo, useState, createContext } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Breadcrumbs } from './components/Breadcrumbs/Breadcrumbs'
import { Step } from './components/Breadcrumbs/types'
import { useStyles } from './styles'
import { NavLink, useHistory } from 'react-router-dom'
import { Form, Formik, useFormikContext } from 'formik'
import { find, includes } from 'lodash'
import { EnrollmentQuestionTab, initEnrollmentQuestions } from './types'
import CustomModal from '../components/CustomModal/CustomModals'
import AddNewQuestionModal from './AddNewQuestion/index'
import AddUploadModal from './AddUpload/index'
import Contact from './Contact/Contact'
import Education from './Education/Education'
import { Submission } from './Submission/Submission'
import Personal  from './Personal/Personal'
import { Documents } from './Documents/Documents'
import { TabContext } from './TabContextProvider'
import { useRecoilValue } from 'recoil'
import moment from 'moment'
import {ProgramYearContext} from '../provider/ProgramYearProvider'
import {GRADES} from '../../../../../utils/constants'
import {toOrdinalSuffix} from '../../../../../utils/stringHelpers'
import { DropDownItem } from '../../../../../components/DropDown/types'
import { userRegionState } from '../../../../../providers/UserContext/UserProvider'
import { 
  getQuestionsGql, 
  saveQuestionsGql, 
  deleteQuestionsGql, 
  deleteQuestionGroupGql, 
  getCountiesByRegionId,
  getActiveSchoolYearsByRegionId,
  getSchoolDistrictsByRegionId,
  getAllRegion,

} from './services'
import { useMutation, useQuery } from '@apollo/client'
import _ from 'lodash'
import { QuestionTypes } from '../EnrollmentQuestions/types'
import { defaultQuestions } from '../constant/defaultQuestions'
import DefaultQuestionModal from '../components/DefaultQuestionModal/DefaultQuestionModal'
import AddQuestionModal from '../components/AddQuestionModal/AddQuestionModal'

export default function EnrollmentQuestions() {
  const [questionsData, setQuestionsData] = useState<EnrollmentQuestionTab[]>(initEnrollmentQuestions)
  const [currentTab, setCurrentTab] = useState(0)
  const [sucessAlert, setSucessAlert] = useState(false)
  const [cancelModal, setCancelModal] = useState(false)
  const [unSaveChangeModal, setUnSaveChangeModal] = useState(false)
  const [openAddQuestion, setOpenAddQuestion] = useState('')
  const [openAddUpload, setOpenAddUpload] = useState(false)
  const [visitedTabs, setVisitedTabs] = useState([])
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const classes = useStyles
  const history = useHistory()
  const [saveQuestionsMutation] = useMutation(saveQuestionsGql)
  const [deleteQuestions] = useMutation(deleteQuestionsGql)
  const [deleteQuestionGroup] = useMutation(deleteQuestionGroupGql)
  const region = useRecoilValue(userRegionState)
  const { data, refetch } = useQuery(getQuestionsGql, {
    variables: { input: { region_id: +region?.regionDetail?.id } },
    fetchPolicy: 'network-only',
  })

  const [editItem, setEditItem] = useState(null)
  const [openSelectQuestionType, setOpenSelectQuestionType] = useState(false)

  useEffect(() => {
    if (data?.getEnrollmentQuestions.length > 0) {
      const jsonTabData = data?.getEnrollmentQuestions.map((t) => {
        if(t.groups.length > 0) {
          const jsonGroups = t.groups.map((g) => {
            if(g.questions.length > 0) {
              const jsonQuestions = g.questions.map((q) => {
                return {
                  ...q,
                  additional2: {... JSON.parse(q.additional2), options: JSON.parse(JSON.parse(q.additional2).options)} || [],
                  additional: {... JSON.parse(q.additional), options: JSON.parse(JSON.parse(q.additional).options)} || [],
                  options: JSON.parse(q.options) || []
                }
              }).sort((a, b) => a.order - b.order)
              return {...g, questions: jsonQuestions}
            }            
            return g
          }).sort((a, b) => a.order - b.order)
          return {...t, groups: jsonGroups}
        }
        return t
      })
      setQuestionsData(jsonTabData)
      setUnsavedChanges(false)
    }
    // else {
    //   setQuestionsData(initEnrollmentQuestions)
    // }
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

  useEffect(() => {
    setVisitedTabs([...visitedTabs, currentTab])
  },[currentTab])

  const breadCrumbData: Step[] = [
    {
      label: 'Contact',
      active: true,
    },
    {
      label: 'Personal',
      active: currentTab >= 1,
    },
    {
      label: 'Education',
      active: currentTab >= 2,
    },
    {
      label: 'Documents',
      active: currentTab >= 3,
    },
    {
      label: 'Submission',
      active: currentTab >= 4,
    },
  ]

  const disabled = true;
  const handleBreadCrumbClicked = (idx) => {
    if(includes(visitedTabs, idx) || disabled){
      setCurrentTab(idx)
    }
  }

  const {loading: countyLoading, data: countyData } = useQuery(getCountiesByRegionId, {
    variables: {regionId: +region?.regionDetail?.id},
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

  const { loading: schoolLoading, data: schoolYearData } = useQuery(getActiveSchoolYearsByRegionId, {
    variables: {
      regionId: +region?.regionDetail?.id,
    },
    fetchPolicy: 'network-only',
  })

  const [schoolYears, setSchoolYears] = useState<Array<DropDownItem>>([])
  const [schoolYearsData, setSchoolYearsData] = useState([])
  const [grades, setGrades] = useState([])
  const [gradesDropDownItems, setGradesDropDownItems] = useState<Array<DropDownItem>>([])
  const [birthDateCut, setBirthDateCut] = useState<string>('')
  useEffect(() => {
    if (!schoolLoading && schoolYearData.getActiveSchoolYears) {
      setSchoolYears(
        schoolYearData.getActiveSchoolYears.map((item) => {
          return {
            label: moment(item.date_begin).format('YYYY') + '-' + moment(item.date_end).format('YYYY'),
            value: item.school_year_id,
          }
        }),
      )
      setSchoolYearsData(schoolYearData.getActiveSchoolYears)
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
      regionId: +region?.regionDetail?.id,
    },
    skip: +region?.regionDetail?.id ? false : true,
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
        initialValues={[...questionsData]}
        enableReinitialize={true}
        validate={(values) => {
          if (_.isEqual(values, questionsData) === unsavedChanges) {
            setUnsavedChanges(!unsavedChanges)
          }
        }}
        onSubmit={async (vals) => {
          const submitTabs = vals.map((v, vIndex) => {
            const submitGroups = v.groups.map((g, gIndex) => { 
              const submitQuestions = g.questions.map((q) => {                
                return {
                  ...q,
                  additional2: JSON.stringify({...q.additional2, options: JSON.stringify(q.additional2?.options || [])}),
                  additional: JSON.stringify({...q.additional, options: JSON.stringify(q.additional?.options || [])}),
                  options: JSON.stringify(q?.options || [])
                }
              })
              questionsData[vIndex].groups[gIndex]?.questions.forEach((qD) => {
                if(!submitQuestions.find((s) => s.id === qD.id)) {
                  deleteQuestions({variables: {id: qD.id}})
                }
              })              
              return {...g, questions: submitQuestions}              
            })
            questionsData[vIndex].groups.forEach((gD) => {
              if(!submitGroups.find((s) => s.id === gD.id)) {
                deleteQuestionGroup({variables: {id: gD.id}})
              }
            })
            return {...v, groups: submitGroups}
          })
          const res = await saveQuestionsMutation({
            variables: {
              input: submitTabs.map((v) => ({
                id: v.id,
                is_active: v.is_active,
                tab_name: v.tab_name,
                groups: v.groups,
                region_id: +region?.regionDetail?.id,
              })),
            },
          })
          if(res) {
            refetch()
            setSucessAlert(true)
            setTimeout(() => setSucessAlert(false), 5000)
          }          
        }}
      >
         {({ values, setValues, submitForm }) => (
          <Form>
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
                <Box sx={classes.header}>                    
                  <Box
                    sx={{
                      textAlign: 'left',
                      marginBottom: '12px',
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        if (JSON.stringify(values) === JSON.stringify(questionsData)) {
                          history.goBack()
                        } else {
                          setUnSaveChangeModal(true)
                        }
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
                      Enrollment Questions
                    </Typography>
                  </Box>
                  <Breadcrumbs steps={breadCrumbData} handleClick={handleBreadCrumbClicked}/>
                </Box>
                <TabContext.Provider value={breadCrumbData[currentTab]?.label}>
                  <ProgramYearContext.Provider value={programYearContext}>
                    <Box sx={classes.breadcrumbs}>
                      {currentTab === 0 ? (
                        <Contact />
                      ) : currentTab === 1 ? (
                        <Personal />
                      ) : currentTab === 2 ? (
                        <Education />
                      ) : currentTab === 3 ? (
                        <Documents />
                      ) : (
                        <Submission />
                      )}
                    </Box>
                  </ProgramYearContext.Provider>
                  {openAddQuestion === 'new' && <AddNewQuestionModal onClose={() => setOpenAddQuestion('')} editItem={editItem} newQuestion={true}/>}
                  {openAddQuestion === 'default' && <DefaultQuestionModal onClose={() => setOpenAddQuestion('')} onCreate={(e) => {onSelectDefaultQuestions(e)}}/>}
                  {openSelectQuestionType && <AddQuestionModal onClose={() => setOpenSelectQuestionType(false)} onCreate={(e) => {setOpenAddQuestion(e); setEditItem(null); setOpenSelectQuestionType(false)}}/>}

                  {openAddUpload && <AddUploadModal onClose={() => setOpenAddUpload(false)}/>}
                  {currentTab === 3 && (
                    <Box sx={classes.buttonGroup}>
                      <Button sx={{ ...classes.submitButton, color: 'white'}} onClick={() => setOpenAddUpload(true)}>
                        Add Upload
                      </Button>
                    </Box>
                  )}
                  <Box sx={classes.buttonGroup}>
                    <Button sx={{ ...classes.submitButton, color: 'white', marginTop: currentTab === 3 ? 3 : 10}} onClick={() => setOpenSelectQuestionType(true)}>
                      Add Question
                    </Button>
                    <Button sx={{ ...classes.submitButton, color: 'white', width: '150px', marginTop: currentTab === 3 ? 3 : 10 }} onClick={() => {currentTab < 4 && setCurrentTab(currentTab + 1)}}>
                      Next
                    </Button>
                  </Box>      
                </TabContext.Provider>      

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
      padding: '40px 40px',
      textAlign: 'start',
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