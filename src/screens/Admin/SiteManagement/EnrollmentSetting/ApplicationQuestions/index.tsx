import React, { useEffect, useState, useContext } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Alert, Box, Button, Card, Grid, IconButton, List, Typography } from '@mui/material'
import { Form, Formik } from 'formik'
import _ from 'lodash'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import BGSVG from '@mth/assets/ApplicationBG.svg'
import { DropDownItem } from '@mth/components/DropDown/types'
import { QUESTION_TYPE } from '@mth/components/QuestionItem/QuestionItemProps'
import { MthTitle } from '@mth/enums'
import { getSchoolDistrictsByRegionId } from '@mth/graphql/queries/school-district'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { GRADES } from '../../../../../utils/constants'
import { countries } from '../../../../../utils/countries'
import { usStates } from '../../../../../utils/states'
import { toOrdinalSuffix } from '../../../../../utils/stringHelpers'
import { AddQuestionModal } from '../components/AddQuestionModal/AddQuestionModal'
import { CustomModal } from '../components/CustomModal/CustomModals'
import { DefaultQuestionModal } from '../components/DefaultQuestionModal/DefaultQuestionModal'
import { defaultQuestions } from '../constant/defaultQuestions'
import { ActionQuestionTypes, QuestionTypes } from '../EnrollmentQuestions/types'
import { ProgramYearContext } from '../provider/ProgramYearProvider'
import { AddNewQuestionModal } from './AddNewQuestion/index'
import { ApplicationQuestionItem } from './Question'
import {
  getQuestionsGql,
  saveQuestionsGql,
  deleteQuestionGql,
  getCountiesByRegionId,
  getActiveSchoolYearsByRegionId,
} from './services'
import { useStyles } from './styles'
import { ApplicationQuestion, initQuestions } from './types'
const SortableItem = SortableElement(ApplicationQuestionItem)

export const ApplicationQuestions: React.FC = () => {
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
  const [editItem, setEditItem] = useState([])
  const [specialEd, setSpecialEd] = useState(false)
  const [specialEdOptions, setSpecialEdOptions] = useState([])
  const { loading: countyLoading, data: countyData } = useQuery(getCountiesByRegionId, {
    variables: { regionId: Number(me?.selectedRegionId) },
    fetchPolicy: 'network-only',
  })

  const [counties, setCounties] = useState([])

  const isEditable = () => {
    if (me?.level <= 2) return true
    return false
  }

  const SortableListContainer = SortableContainer(({ items }: { items: ApplicationQuestion[] }) => (
    <List>
      {items.map((item, index) => (
        <SortableItem
          index={index}
          key={index}
          questionTypes={QuestionTypes}
          additionalQuestionTypes={ActionQuestionTypes}
          questions={item}
          hasAction={isEditable()}
        />
      ))}
    </List>
  ))

  useEffect(() => {
    if (!countyLoading && countyData?.getCounties) {
      setCounties(
        countyData.getCounties.map((v) => {
          return { label: v.county_name, value: v.id }
        }),
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

  const [schoolYears, setSchoolYears] = useState<Array<DropDownItem>>([])
  const [schoolYearsData, setSchoolYearsData] = useState([])
  const [grades, setGrades] = useState([])
  const [gradesDropDownItems, setGradesDropDownItems] = useState<Array<DropDownItem>>([])
  const [, setBirthDateCut] = useState<string>('')

  useEffect(() => {
    if (!schoolLoading && schoolYearData.getSchoolYearsByRegionId) {
      const schoolYearsArray = []
      schoolYearData.getSchoolYearsByRegionId
        .filter((item) => moment(item.date_begin).format('YYYY') >= moment().format('YYYY'))
        .map(
          (item: {
            date_begin: string
            date_end: string
            school_year_id: string
            midyear_application: number
            midyear_application_open: string
            midyear_application_close: string
          }): void => {
            schoolYearsArray.push({
              label: `${moment(item.date_begin).format('YYYY')} - ${moment(item.date_end).format('YY')}`,
              value: item.school_year_id,
            })

            if (
              item &&
              item.midyear_application === 1 &&
              moment().isAfter(item?.midyear_application_open) &&
              moment().isBefore(item?.midyear_application_close)
            ) {
              schoolYearsArray.push({
                label: `${moment(item.date_begin).format('YYYY')} - ${moment(item.date_end).format('YY')} Mid-year`,
                value: `${item.school_year_id}-mid`,
              })
            }
          },
        )

      setSchoolYears(schoolYearsArray.sort((a, b) => (a.label > b.label ? 1 : -1)))
      setSchoolYearsData(schoolYearData.getSchoolYearsByRegionId)
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
  const programYearContext = {
    programYear,
    setProgramYear,
    schoolYears,
    gradesDropDownItems,
  }

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
    skip: Number(me?.selectedRegionId) ? false : true,
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

  const history = useHistory()
  useEffect(() => {
    if (data?.getApplicationQuestions) {
      setQuestions(
        data.getApplicationQuestions
          .map((v) => ({
            ...v,
            options: v.options ? JSON.parse(v.options || '[]') : [],
            response: '',
            active: !v.additional_question ? true : false,
          }))
          .sort((a, b) => a.order - b.order),
      )
      setUnsavedChanges(false)
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
          ...countries.filter((item) => item.value !== 'United States'),
        ]
      } else if (selectedQuestion.slug === 'program_year') {
        options = schoolYears
      } else if (selectedQuestion.slug === 'address_school_district') {
        options = schoolDistricts
      } else if (selectedQuestion.slug === 'address_state') {
        options = usStates
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
      main_question: selectedQuestion.main_question,
      additional_question: selectedQuestion.additional_question,
    }
    setEditItem([editItemTemp])
    setOpenAddQuestion('new')
  }

  const questionSortList = (values) => {
    const sortList = values
      .filter(
        (v) =>
          !v.mainQuestion &&
          (!v.additional_question ||
            v.additional_question == '' ||
            (values.find((x) => x.slug == v.additional_question)?.response !== '' &&
              values
                .find((x) => x.slug == v.additional_question)
                ?.options.find(
                  (x) =>
                    x.action == 2 &&
                    (x.value == values.find((y) => y.slug == v.additional_question)?.response ||
                      values
                        .find((y) => y.slug == v.additional_question)
                        ?.response.toString()
                        .indexOf(x.value) >= 0),
                ) != null &&
              values.find((x) => x.slug == v.additional_question)?.active)), // Parent
      )
      .map((v) => {
        const arr = [v]
        let current = v,
          child
        while ((child = values.find((x) => x.additional_question == current.slug))) {
          arr.push(child)
          current = child
        }
        return arr
      })

    return sortList
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
          for (let i = 0; i < vals.length; i++) {
            if (vals[i].id < 0) vals[i].id = 0
            vals[i].order = i + 1
          }

          await saveQuestionsMutation({
            variables: {
              input: vals.map((v) => ({
                id: Number(v.id),
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
                additional_question: v.additional_question,
                main_question: v.main_question,
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
                      <ApplicationQuestionItem key={index} questions={[it]} mainQuestion={true} />
                    ))}
                    <SortableListContainer
                      items={questionSortList(values)}
                      useDragHandle={true}
                      onSortEnd={({ oldIndex, newIndex }) => {
                        //	Find indexs
                        const groups = values
                          .filter((v) => v.additional_question == '' || !v.additional_question)
                          .map((v) => {
                            const arr = [v]
                            let current = v
                            let child
                            while ((child = values.find((x) => x.additional_question == current.slug))) {
                              arr.push(child)
                              current = child
                            }
                            return arr
                          })
                        const newData = arrayMove(groups, oldIndex, newIndex)

                        const newValues = []
                        newData.forEach((group) => {
                          group?.forEach((q) => {
                            newValues.push({
                              ...q,
                              sequence: newValues.length + 1,
                            })
                          })
                        })
                        setValues(newValues)
                      }}
                    />
                  </Box>
                </ProgramYearContext.Provider>
                {openAddQuestion === 'new' && (
                  <AddNewQuestionModal
                    onClose={(e) => {
                      setOpenAddQuestion('')
                      setOpenSelectQuestionType(!e)
                    }}
                    questions={editItem}
                    questionTypes={QuestionTypes}
                    additionalQuestionTypes={ActionQuestionTypes}
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
                      if (e === 'new') {
                        //	Prototype of a question
                        setEditItem([
                          {
                            type: QUESTION_TYPE.TEXTFIELD,
                            question: '',
                            validation: 0,
                            default_question: false,
                            options: [],
                            slug: `meta_${+new Date()}`,
                            required: false,
                            main_question: 0,
                            additional_question: '',
                            student_question: false,
                          },
                        ])
                      }
                      // setEditItem([]);
                      setOpenSelectQuestionType(false)
                    }}
                  />
                )}

                <Button
                  sx={{ ...useStyles.submitButton, color: 'white' }}
                  onClick={() => setOpenSelectQuestionType(true)}
                >
                  Add Question
                </Button>
              </Box>

              <Box sx={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button sx={{ ...useStyles.addStudentButton }}>Add Student</Button>
                <Button sx={{ ...useStyles.submitButton, color: 'white' }}>Submit to Utah Program</Button>
              </Box>

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
