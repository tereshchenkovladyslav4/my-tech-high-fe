import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Box, Typography, Card, Grid, IconButton, Button, Alert, Stack } from '@mui/material'
import { Form, Formik } from 'formik'
import { includes } from 'lodash'
import _ from 'lodash'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { COUNTRIES, GRADES, US_STATES } from '@mth/constants'
import { MthTitle } from '@mth/enums'
import { getSchoolDistrictsByRegionId } from '@mth/graphql/queries/school-district'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { toOrdinalSuffix } from '@mth/utils'
import { AddQuestionModal } from '../components/AddQuestionModal/AddQuestionModal'
import { CustomModal } from '../components/CustomModal/CustomModals'
import { DefaultQuestionModal } from '../components/DefaultQuestionModal/DefaultQuestionModal'
import { defaultQuestions } from '../constant/defaultQuestions'
import { QuestionTypes } from '../EnrollmentQuestions/types'
import { ProgramYearContext } from '../provider/ProgramYearProvider'
import { AddNewQuestionModal } from './AddNewQuestion/index'
import { AddUploadModal } from './AddUpload/index'
import { Breadcrumbs } from './components/Breadcrumbs/Breadcrumbs'
import { Step } from './components/Breadcrumbs/types'
import Contact from './Contact/Contact'
import { Documents } from './Documents/Documents'
import Education from './Education/Education'
import Personal from './Personal/Personal'
import {
  getQuestionsGql,
  saveQuestionsGql,
  deleteQuestionsGql,
  deleteQuestionGroupGql,
  getCountiesByRegionId,
  getActiveSchoolYearsByRegionId,
  getSpecialEdsByRegionId,
} from './services'
import { useStyles } from './styles'
import { Submission } from './Submission/Submission'
import { TabContext } from './TabContextProvider'
import { EnrollmentQuestionTab, initEnrollmentQuestions } from './types'

export const EnrollmentQuestions: React.FC = () => {
  const [questionsData, setQuestionsData] = useState<EnrollmentQuestionTab[]>(initEnrollmentQuestions)
  const [currentTab, setCurrentTab] = useState(0)
  const [sucessAlert, setSucessAlert] = useState(false)
  const [cancelModal, setCancelModal] = useState(false)
  const [unSaveChangeModal, setUnSaveChangeModal] = useState(false)
  const [openAddQuestion, setOpenAddQuestion] = useState('')
  const [openAddUpload, setOpenAddUpload] = useState(false)
  const [visitedTabs, setVisitedTabs] = useState([])
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [specialEd, setSpecialEd] = useState(false)
  const [specialEdOptions, setSpecialEdOptions] = useState([])

  const [specialEdStatus, setSpecialEdStatus] = useState<boolean>(false)
  const [specialEdList, setSpecialEdList] = useState<unknown>([])

  const [schoolYearList, setSchoolYearList] = useState<DropDownItem[]>([])
  const [activeSchoolYearId, setActiveSchoolYearId] = useState<string>('')
  const [midActiveSchoolYearId, setMidActiveSchoolYearId] = useState<boolean>(false)

  const classes = useStyles
  const history = useHistory()
  const [saveQuestionsMutation] = useMutation(saveQuestionsGql)
  const [deleteQuestions] = useMutation(deleteQuestionsGql)
  const [deleteQuestionGroup] = useMutation(deleteQuestionGroupGql)
  const { me } = useContext(UserContext)
  const { data, refetch } = useQuery(getQuestionsGql, {
    variables: {
      input: {
        region_id: Number(me?.selectedRegionId),
        school_year_id: parseInt(activeSchoolYearId),
        mid_year: midActiveSchoolYearId,
      },
    },
    fetchPolicy: 'network-only',
    skip: !activeSchoolYearId,
  })

  const { data: specialEdData } = useQuery(getSpecialEdsByRegionId, {
    variables: {
      regionId: Number(me?.selectedRegionId),
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    setSpecialEdStatus(false)
    const thisSchoolYear = specialEdData?.region?.SchoolYears.find(
      (i) =>
        moment(i.date_begin).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD') &&
        moment(i.date_end).format('YYYY-MM-DD') > moment().format('YYYY-MM-DD'),
    )
    if (thisSchoolYear) {
      setSpecialEdStatus(thisSchoolYear.special_ed_options)
      if (thisSchoolYear.special_ed_options && thisSchoolYear.special_ed_options) {
        const special_ed_options = thisSchoolYear.special_ed_options.split(',')
        const specialList = special_ed_options.filter((ii) => ii != 'None')
        setSpecialEdList(specialList)
      }
      setSpecialEdStatus(thisSchoolYear.special_ed_options)
    } else {
      setSpecialEdStatus(false)
    }
  }, [specialEdData?.region?.SchoolYears])

  const [editItem, setEditItem] = useState(null)
  const [openSelectQuestionType, setOpenSelectQuestionType] = useState(false)

  const convertSpeicalEdOptions = (optionString) => {
    const temp = []
    if (optionString != '' && optionString != null) {
      const optionArray = optionString.split(',')
      optionArray.map((option, index) => {
        temp.push({
          label: option.trim(),
          value: index,
        })
      })
    }
    return temp
  }

  useEffect(() => {
    if (data?.getEnrollmentQuestions.length > 0) {
      const jsonTabData = data?.getEnrollmentQuestions.map((t) => {
        if (t.groups.length > 0) {
          const jsonGroups = t.groups
            .map((g) => {
              if (g.questions.length > 0) {
                const jsonQuestions = g.questions
                  .map((q) => {
                    return {
                      ...q,
                      options: JSON.parse(q.options) || [],
                    }
                  })
                  .sort((a, b) => a.order - b.order)
                return { ...g, questions: jsonQuestions }
              }
              return g
            })
            .sort((a, b) => a.order - b.order)
          return { ...t, groups: jsonGroups }
        }
        return t
      })
      const contactTab = jsonTabData.find((item) => item.tab_name === 'Contact')
      const personTab = jsonTabData.find((item) => item.tab_name === 'Personal')
      const educationTab = jsonTabData.find((item) => item.tab_name === 'Education')
      const documentTab = jsonTabData.find((item) => item.tab_name === 'Documents')
      const submissionTab = jsonTabData.find((item) => item.tab_name === 'Submission')
      if (!contactTab) {
        jsonTabData.push({
          tab_name: 'Contact',
          is_active: true,
          groups: [],
        })
      }
      if (!personTab) {
        jsonTabData.push({
          tab_name: 'Personal',
          is_active: true,
          groups: [],
        })
      }
      if (!educationTab) {
        jsonTabData.push({
          tab_name: 'Education',
          is_active: true,
          groups: [],
        })
      }
      if (!documentTab) {
        jsonTabData.push({
          tab_name: 'Documents',
          is_active: true,
          groups: [],
        })
      }
      if (!submissionTab) {
        jsonTabData.push({
          tab_name: 'Submission',
          is_active: true,
          groups: [],
        })
      }
      setQuestionsData(jsonTabData)
      setUnsavedChanges(false)
    } else {
      setQuestionsData(initEnrollmentQuestions)
    }
  }, [data])

  useEffect(() => {
    window.onbeforeunload = (e) => {
      if (!unsavedChanges) return
      e?.preventDefault()
    }
    const unreg = history.block(() => {
      if (unsavedChanges) {
        return JSON.stringify({
          header: MthTitle.UNSAVED_TITLE,
          content: MthTitle.UNSAVED_DESCRIPTION,
        })
      }
      return undefined
    })
    return () => {
      unreg()
      window.onbeforeunload = null
    }
  }, [history, unsavedChanges])

  useEffect(() => {
    setVisitedTabs([...visitedTabs, currentTab])
  }, [currentTab])

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

  const disabled = true
  const handleBreadCrumbClicked = (idx) => {
    if (includes(visitedTabs, idx) || disabled) {
      setCurrentTab(idx)
    }
  }

  const { loading: countyLoading, data: countyData } = useQuery(getCountiesByRegionId, {
    variables: { regionId: Number(me?.selectedRegionId) },
    fetchPolicy: 'network-only',
  })

  const [counties, setCounties] = useState([])

  useEffect(() => {
    if (!countyLoading && countyData?.getCounties) {
      setCounties(
        countyData.getCounties.map((v) => {
          return { label: v.county_name, value: Number(v.id) }
        }),
      )
    }
  }, [countyData])

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
  const [, setBirthDateCut] = useState<string>('')
  useEffect(() => {
    if (!schoolLoading && schoolYearData.getSchoolYearsByRegionId) {
      const tempSchoolYearList: DropDownItem[] = []
      setSchoolYears(
        schoolYearData.getSchoolYearsByRegionId
          .sort((a, b) => (a.date_begin > b.date_begin ? 1 : -1))
          .map((item) => {
            tempSchoolYearList.push({
              label: moment(item.date_begin).format('YYYY') + '-' + moment(item.date_end).format('YY'),
              value: item.school_year_id + '',
            })
            if (item.midyear_application === 1) {
              tempSchoolYearList.push({
                label: moment(item.date_begin).format('YYYY') + '-' + moment(item.date_end).format('YY') + ' Mid-Year',
                value: item.school_year_id + '-mid',
              })
            }
            if (moment().format('YYYY-MM-DD') > item.date_begin && moment().format('YYYY-MM-DD') < item.date_end) {
              setActiveSchoolYearId(item.school_year_id + '')
              setMidActiveSchoolYearId(false)
            }
            return {
              label: moment(item.date_begin).format('YYYY') + '-' + moment(item.date_end).format('YYYY'),
              value: item.school_year_id,
            }
          }),
      )
      setSchoolYearsData(schoolYearData.getSchoolYearsByRegionId)

      setSchoolYearList(tempSchoolYearList)

      if (schoolYearData.getSchoolYearsByRegionId.length > 0) {
        setSpecialEd(schoolYearData.getSchoolYearsByRegionId[0].special_ed)
        setSpecialEdOptions(convertSpeicalEdOptions(schoolYearData.getSchoolYearsByRegionId[0].special_ed_options))
      }
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
      setProgramYear,
    }),
    [],
  )

  useEffect(() => {
    if (programYear) {
      setGradesAndBirthDateCut(programYear)
    }
  }, [programYear])

  useEffect(() => {
    parseGrades()
  }, [grades])

  const parseGrades = () => {
    const dropDownItems = []
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

  const { loading: schoolDistrictsDataLoading, data: schoolDistrictsData } = useQuery(getSchoolDistrictsByRegionId, {
    variables: {
      regionId: Number(me?.selectedRegionId),
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })
  const [schoolDistricts, setSchoolDistricts] = useState<Array<DropDownItem>>([])

  useEffect(() => {
    if (!schoolDistrictsDataLoading && schoolDistrictsData?.schoolDistrict.length > 0) {
      setSchoolDistricts(
        schoolDistrictsData?.schoolDistrict.map((d) => {
          return { label: d.school_district_name, value: d.school_district_name }
        }),
      )
    }
  }, [schoolDistrictsDataLoading])

  useEffect(() => {
    window['setFormChanged']('EnrollmentQuestionsForm', unsavedChanges)
  }, [unsavedChanges])

  const onSelectDefaultQuestions = (selected) => {
    let options = []
    let selectedQuestion = {}
    if (selected == 'Special Education') {
      options = specialEdOptions
      selectedQuestion = {
        label:
          'Has this student ever been diagnosed with a learning disability or ever qualified for Special Education Services (including Speech Therapy)?',
        type: 'Multiple Choices',
        slug: 'meta_special_education',
        validation: 0,
      }
    } else {
      selectedQuestion = defaultQuestions.filter((d) => d.label == selected)[0]
      if (selectedQuestion.slug === 'address_county_id') {
        options = counties
      } else if (selectedQuestion.slug === 'address_country_id') {
        options = [
          {
            label: 'United States',
            value: 'United States',
          },
          ...COUNTRIES.filter((item) => item.value !== 'United States'),
        ]
      } else if (selectedQuestion.slug === 'program_year') {
        options = schoolYears
      } else if (selectedQuestion.slug === 'address_school_district') {
        options = schoolDistricts
      } else if (selectedQuestion.slug === 'address_state') {
        options = US_STATES
      } else if (selectedQuestion.slug === 'student_gender') {
        options = [
          { label: 'Male', value: 1 },
          { label: 'Female', value: 2 },
          //        {label: 'Non Binary', value: 3},
          //        {label: 'Undeclared', value: 4},
        ]
      } else if (selectedQuestion.slug === 'student_grade_level') {
        options = gradesDropDownItems
      }
    }

    const editItemTemp = {
      type: QuestionTypes.find((q) => q.label === selectedQuestion.type).value,
      question: selectedQuestion.label,
      validation: selectedQuestion.validation,
      default_question: true,
      options: options,
      slug: selectedQuestion.slug,
    }
    setEditItem([editItemTemp])
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
                if (q.slug === 'address_country_id' || q.slug === 'address_state') {
                  q.options.filter((v) => (v.value = v.value + ''))
                }
                return {
                  ...q,
                  options: JSON.stringify(q?.options || []),
                }
              })
              questionsData[vIndex].groups[gIndex]?.questions.forEach((qD) => {
                if (!submitQuestions.find((s) => s.id === qD.id)) {
                  deleteQuestions({ variables: { id: qD.id } })
                }
              })
              return { ...g, questions: submitQuestions }
            })
            questionsData[vIndex].groups.forEach((gD) => {
              if (!submitGroups.find((s) => s.id === gD.id)) {
                deleteQuestionGroup({ variables: { id: gD.id } })
              }
            })
            return { ...v, groups: submitGroups }
          })
          const res = await saveQuestionsMutation({
            variables: {
              input: submitTabs.map((v) => ({
                id: v.id,
                is_active: v.is_active,
                tab_name: v.tab_name,
                groups: v.groups,
                region_id: Number(me?.selectedRegionId),
                school_year_id: parseInt(activeSchoolYearId),
                mid_year: midActiveSchoolYearId,
              })),
            },
          })
          if (res) {
            refetch()
            setSucessAlert(true)
            setTimeout(() => setSucessAlert(false), 5000)
          }
        }}
      >
        {({ values }) => (
          <Form name='EnrollmentQuestionsForm'>
            <Card sx={styles.card}>
              <Box
                sx={{
                  display: 'flex',
                  height: '40px',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <Stack direction='row' spacing={1} alignItems='center'>
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
                </Stack>
                <Box display={'flex'} justifyContent='space-between'>
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
                <Breadcrumbs steps={breadCrumbData} handleClick={handleBreadCrumbClicked} />
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
                      <Documents
                        specialEd={{
                          specialEdStatus: specialEdStatus,
                          specialEdList: specialEdList,
                        }}
                      />
                    ) : (
                      <Submission />
                    )}
                  </Box>
                </ProgramYearContext.Provider>
                {openAddQuestion === 'new' && (
                  <AddNewQuestionModal
                    onClose={(e) => {
                      setOpenAddQuestion('')
                      setOpenSelectQuestionType(e)
                    }}
                    editItem={editItem}
                    isNewQuestion={true}
                  />
                )}
                {openAddQuestion === 'default' && (
                  <DefaultQuestionModal
                    onClose={() => {
                      setOpenAddQuestion('')
                      setOpenSelectQuestionType(true)
                    }}
                    onCreate={(e) => {
                      onSelectDefaultQuestions(e)
                    }}
                    special_ed={specialEd}
                  />
                )}
                {openSelectQuestionType && (
                  <AddQuestionModal
                    onClose={() => setOpenSelectQuestionType(false)}
                    onCreate={(e) => {
                      setOpenAddQuestion(e)
                      setEditItem([])
                      setOpenSelectQuestionType(false)
                    }}
                  />
                )}

                {openAddUpload && (
                  <AddUploadModal
                    onClose={() => setOpenAddUpload(false)}
                    specialEd={{
                      specialEdStatus: specialEdStatus,
                      specialEdList: specialEdList,
                    }}
                  />
                )}
                {currentTab === 3 && (
                  <Box sx={classes.buttonGroup}>
                    <Button sx={{ ...classes.submitButton, color: 'white' }} onClick={() => setOpenAddUpload(true)}>
                      Add Upload
                    </Button>
                  </Box>
                )}
                <Box sx={classes.buttonGroup}>
                  <Button
                    sx={{ ...classes.submitButton, color: 'white', marginTop: currentTab === 3 ? 3 : 10 }}
                    onClick={() => setOpenSelectQuestionType(true)}
                  >
                    Add Question
                  </Button>
                  <Button
                    sx={{
                      ...classes.submitButton,
                      color: 'white',
                      width: '150px',
                      marginTop: currentTab === 3 ? 3 : 10,
                    }}
                    onClick={() => {
                      if (currentTab < 4) setCurrentTab(currentTab + 1)
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </TabContext.Provider>

              {unSaveChangeModal && (
                <CustomModal
                  title={MthTitle.UNSAVED_TITLE}
                  description={MthTitle.UNSAVED_DESCRIPTION}
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
