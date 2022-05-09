import { Box, Button, Card, Grid, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useStyles } from '../styles'
import BGSVG from '../../../assets/AdminApplicationBG.svg'
import { DropDown } from '../../../components/DropDown/DropDown'
import { DropDownItem } from '../../../components/DropDown/types'
import { gql, useMutation, useQuery } from '@apollo/client'
import { AddApplicationMutation, getQuestionsGql } from './service'
import { UserContext } from '../../../providers/UserContext/UserProvider'
import { Formik, FieldArray, Form, Field } from 'formik'
import * as yup from 'yup'
import { map, toNumber } from 'lodash'
import { GRADES, RED, SYSTEM_05 } from '../../../utils/constants'
import { toOrdinalSuffix, isPhoneNumber, isNumber } from '../../../utils/stringHelpers'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { array, object, string } from 'yup'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import moment from 'moment'
import { ApplicationQuestion } from '../components/AdditionalQuestionItem/types'
import { AdditionalQuestionItem } from '../components/AdditionalQuestionItem/AdditionalQuestionItem'
import { getAllRegion } from '../../../graphql/queries/region'

export const getRegionByUserId = gql`
  query UserRegionByUserId($userId: ID!) {
    userRegionByUserId(user_id: $userId) {
      region_id
    }
  }
`

export const getActiveSchoolYearsByRegionId = gql`
  query GetActiveSchoolYears($regionId: ID!) {
    getActiveSchoolYears(region_id: $regionId) {
      date_begin
      date_end
      date_reg_close
      date_reg_open
      grades
      birth_date_cut
      special_ed
      school_year_id
    }
  }
`

export const ExistingParent = () => {
  const [emptyStudent, setEmptyStudent] = useState({ first_name: '', last_name: '' , grade_level: undefined})
  const initSchema = {
    programYear: string().required('Grade Level is required')
  }
  const [validationSchema, setValidationSchema] = useState()

  const { me, setMe } = useContext(UserContext)
  const [schoolYears, setSchoolYears] = useState<Array<DropDownItem>>([])
  const [regionId, setRegionId] = useState<string>('')
  const [grades, setGrades] = useState([])
  const [schoolYearsData, setSchoolYearsData] = useState([])
  const [gradesDropDownItems, setGradesDropDownItems] = useState<Array<DropDownItem>>([])
  const [birthDateCut, setBirthDateCut] = useState<string>('')
  const { loading: regionLoading, data: regionData } = useQuery(getRegionByUserId, {
    variables: {
      userId: me?.user_id,
    },
    skip: regionId == '' ? false : true,
    fetchPolicy: 'network-only',
  })

  const { loading: schoolLoading, data: schoolYearData } = useQuery(getActiveSchoolYearsByRegionId, {
    variables: {
      regionId: regionId,
    },
    skip: regionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const { loading: questionLoading, data: questionData } = useQuery(getQuestionsGql, {
    variables: { input: { region_id: Number(regionId) } },    
    // skip: regionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const [availableRegions, setAvailableRegions] = useState([])
  const { data: regionsData, loading: regionsDataLoading, error } = useQuery(getAllRegion)
  useEffect(() => {
    !regionsDataLoading &&
      setAvailableRegions(
        map(regionsData.regions, (region) => ({
          label: region.name,
          value: region.id,
        })),
      )
  }, [regionsData])

  const [questions, setQuestions] = useState<ApplicationQuestion[]>([])
  useEffect(() => {
    if (!questionLoading && questionData?.getExistApplicationQuestions) {
      setQuestions(
        questionData.getExistApplicationQuestions
          .map((v) => ({ ...v, options: v.options ? JSON.parse(v.options || '[]') : [] }))
          .sort((a, b) => a.order - b.order),
      )
    }
  }, [questionData, regionId])

  useEffect(() => {
    if(questions.length > 0) {
      let empty = {...emptyStudent}
      let valid_student = {}
      let valid_meta = {}
      questions.map((q) => {
        if(q.slug?.includes('student_')) {
          empty[`${q.slug.replace('student_', '')}`] = ''
          if(q.required) {
            if(q.slug.toLocaleLowerCase().includes('emailconfirm')) {
              valid_student[`${q.slug.replace('student_', '')}`] = yup
                  .string()
                  .required('Email is required')
                  .oneOf([yup.ref('email')], 'Emails do not match')
            }
            else {
              valid_student[`${q.slug.replace('student_', '')}`] = yup.string().required(`${q.question} is required`)
            }
          }
        }
        else if(q.slug?.includes('meta_') && q.required) {
          if(q.validation === 1) {
            valid_meta[`${q.slug}`] = yup.string().email('Enter a valid email').required('Email is required')
          }
          else if(q.validation === 2) {
            valid_meta[`${q.slug}`] = yup.string()
            .required(`${q.question} is required`)
            .test(`${q.question}-selected`, `${q.question} is invalid`, (value) => {
              return isNumber.test(value)
            })
          }
          else {
            valid_meta[`${q.slug}`] = yup.string().required(`${q.question} is required`)
          }
        }
      })
      setEmptyStudent(empty)
      setValidationSchema({...initSchema, students: yup.array(yup.object(valid_student)), meta: yup.object(valid_meta)})
    }
  }, [questions])

  const classes = useStyles

  const [submitApplicationAction, { data }] = useMutation(AddApplicationMutation)

  const submitApplication = async (data) => {
    submitApplicationAction({
      variables: {
        createApplicationInput: {
          state: 'UT',
          program_year: parseInt(data.programYear!),
          students: data.students,
          meta: JSON.stringify(data.meta)
        },
      },
    }).then((res) => {
      setMe((prev) => {
        console.log('receive students', res.data.createNewStudentApplication.students)
        return {
          ...prev,
          students: prev?.students?.concat(res.data.createNewStudentApplication.students),
        }
      })
    })
  }

  const setGradesAndBirthDateCut = (id) => {
    schoolYearsData.forEach((element) => {
      if (id == element.school_year_id) {
        setGrades(element.grades?.split(','))
        setBirthDateCut(element.birth_date_cut)
      }
    })
  }

  const parseGrades = () => {
    let dropDownItems = []
    GRADES.forEach((grade) => {
      if (grades.includes(grade.toString())) {
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

  useEffect(() => {
    if (!regionLoading && regionData) {
      setRegionId(regionData?.userRegionByUserId[0]?.region_id)
    }
  }, [me?.user_id, regionData])

  useEffect(() => {
    if (!schoolLoading && schoolYearData?.getActiveSchoolYears) {
      setSchoolYears(
        schoolYearData?.getActiveSchoolYears.map((item) => {
          return {
            label: moment(item.date_begin).format('YYYY') + '-' + moment(item.date_end).format('YYYY'),
            value: item.school_year_id,
          }
        }),
      )
      setSchoolYearsData(schoolYearData?.getActiveSchoolYears)
    }
  }, [regionId, schoolYearData])

  useEffect(() => {
    parseGrades()
  }, [grades])

  return (
    <Card sx={{ paddingTop: 8, margin: 4 }}>
      <Formik
        initialValues={{
          programYear: undefined,
          students: [emptyStudent],
          meta: undefined,
        }}
        validationSchema={object(validationSchema)}
        onSubmit={async (values) => {
          await submitApplication(values)
        }}
      >
        {({ values, errors, isSubmitting, isValid }) => (
          <Form>
            <Box
              paddingX={36}
              paddingTop={18}
              paddingBottom={10}
              sx={{
                backgroundImage: `url(${BGSVG})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Grid container>
                <Grid item xs={12} display='flex' justifyContent={'center'}>
                  <Box width={'406.73px'}>
                    <Field name='programYear' fullWidth focused>
                      {({ field, form, meta }) => (
                        <Box width={'100%'} display='block'>
                          <DropDown
                            name='programYear'
                            labelTop
                            placeholder='Program Year'
                            dropDownItems={schoolYears}
                            setParentValue={(id) => {
                              form.setFieldValue(field.name, toNumber(id))
                              setGradesAndBirthDateCut(id)
                            }}
                            alternate={true}
                            size='small'
                            sx={!!(meta.touched && meta.error) ? classes.textFieldError : classes.dropdown}
                            error={{
                              error: !!(meta.touched && meta.error),
                              errorMsg: (meta.touched && meta.error) as string,
                            }}
                          />
                        </Box>
                      )}
                    </Field>
                  </Box>
                </Grid>
                {!questionLoading && questions.length > 0 && (<Grid item xs={12} display='flex' justifyContent={'center'}>
                  <Box width={'451.53px'}>
                      {questions.map((q, index) => q.slug.includes('meta_') && 
                      (
                        <Grid item xs={12} display='flex' justifyContent={'center'}>
                          <Box width={'451.53px'}>
                            <Field
                              name = {`meta.${q.slug}`}
                              fullWidth
                              focused
                            >
                              {({ field, form, meta }) => (
                                <AdditionalQuestionItem question={q} field={field} form={form} meta={meta}/>
                              )}
                            </Field>
                          </Box>
                        </Grid>
                      ))}
                  </Box>
                </Grid>)}
                <Grid item xs={12} display='flex' justifyContent={'center'}>
                  <Box width={'451.53px'}>
                    <FieldArray name='students'>
                      {({ push, remove }) => (
                        <>
                          {values.students.map((_, index) => (
                            <Grid item container spacing={2} xs={12} sm="auto">
                              {!questionLoading && questions.length > 0 && 
                                questions.map((q) => {
                                  if(q.slug === 'student_grade_level') {
                                    return (
                                      <Grid item xs={12}>
                                        <Field name={`students[${index}].grade_level`} fullWidth focused>
                                          {({ field, form, meta }) => (
                                            <Box width={'100%'}>
                                              <DropDown
                                                name={`students[${index}].grade_level`}
                                                labelTop
                                                placeholder={`Student Grade Level (${moment().diff(
                                                  birthDateCut,
                                                  'years',
                                                )}) as of ${moment(birthDateCut).format('MMM Do YYYY')}`}
                                                dropDownItems={gradesDropDownItems}
                                                setParentValue={(id) => {
                                                  form.setFieldValue(field.name, id)
                                                }}
                                                alternate={true}
                                                size='small'
                                                sx={
                                                  !!(meta.touched && meta.error) ? classes.textFieldError : classes.dropdown
                                                }
                                                error={{
                                                  error: !!(meta.touched && meta.error),
                                                  errorMsg: (meta.touched && meta.error) as string,
                                                }}
                                              />
                                            </Box>
                                          )}
                                        </Field>
                                      </Grid>
                                    )
                                  }
                                  else if(q.slug.includes('student_')) {
                                    return (
                                      <Grid item xs={12}>
                                        <Box 
                                          width={index === 0 ? '100%' : '103.9%'} 
                                          display='flex' 
                                          flexDirection='row' 
                                          alignItems={'center'}
                                        >
                                          <Field 
                                            name={`students[${index}].${q.slug.replace('student_', '')}`}
                                            fullWidth
                                            focused
                                          >
                                            {({ field, form, meta }) => (
                                              <Box width={'100%'}>
                                                <AdditionalQuestionItem question={q} key={index} field={field} form={form} meta={meta}/>
                                              </Box>
                                            )}
                                          </Field>
                                          {
                                            index !== 0 && q.slug === 'student_first_name'
                                            ? <DeleteForeverOutlinedIcon 
                                                sx={{left: 12, position: 'relative', color: 'darkgray'}}
                                                onClick={() => remove(index)}
                                              />
                                            : null
                                          }
                                        </Box>
                                      </Grid>
                                    )
                                  }
                                })
                              }
                            </Grid>
                          ))}
                          <Grid item>
                            {typeof errors.students === 'string' ? (
                              <Paragraph color={RED}>{errors.students}</Paragraph>
                            ) : null}
                          </Grid>
                          <Grid item>
                            <Button
                              color='secondary'
                              variant='contained'
                              style={classes.addStudentButton}
                              onClick={() => push(emptyStudent)}
                            >
                              Add Student
                            </Button>
                          </Grid>
                        </>
                      )}
                    </FieldArray>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Button variant='contained' style={classes.submitButton} type='submit' disabled={ Boolean(Object.keys(errors).length)}>
                  {`Submit to ${availableRegions[regionId - 1]?.label || ''} School`}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>
    </Card>
  )
}
