import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { makeStyles, Theme } from '@material-ui/core/styles'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { Box, Button, Card, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Formik, FieldArray, Form, Field } from 'formik'
import { toNumber } from 'lodash'
import { omit } from 'lodash'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { object, string } from 'yup'
import * as yup from 'yup'
import BGSVG from '@mth/assets/AdminApplicationBG.svg'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { QUESTION_TYPE } from '@mth/components/QuestionItem/QuestionItemProps'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { getActiveSchoolYearsByRegionId } from '@mth/graphql/queries/school-year'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { GRADES, RED } from '../../../utils/constants'
import { toOrdinalSuffix, isNumber } from '../../../utils/stringHelpers'
import { AdditionalQuestionItem } from '../components/AdditionalQuestionItem/AdditionalQuestionItem'
import { ApplicationQuestion } from '../components/AdditionalQuestionItem/types'
import { useStyles } from '../styles'
import { AddApplicationMutation, getQuestionsGql } from './service'

const additionalStyles = makeStyles((theme: Theme) => ({
  mainContent: {
    [theme.breakpoints.down('xs')]: {
      margin: '8px',
    },
    paddingTop: '64px',
    margin: '32px',
  },
  studentsContent: {
    '& .MuiGrid-item': {
      width: '100%',
    },
  },
}))

export const getRegionByUserId = gql`
  query UserRegionByUserId($userId: ID!) {
    userRegionByUserId(user_id: $userId) {
      region_id
    }
  }
`

export const ExistingParent: React.FC = () => {
  const [emptyStudent, setEmptyStudent] = useState({ meta: {} })
  const initSchema = {
    programYear: string().required('Program Year is required'),
  }
  const [validationSchema, setValidationSchema] = useState()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('sm'))

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

  const [questions, setQuestions] = useState<ApplicationQuestion[]>([])
  useEffect(() => {
    if (!questionLoading && questionData?.getExistApplicationQuestions) {
      const questionList = questionData.getExistApplicationQuestions
        .map((v) => ({
          ...v,
          options: v.options ? JSON.parse(v.options || '[]') : [],
          response: '',
          active: !v.additional_question ? true : false,
        }))
        .sort((a, b) => a.order - b.order)

      setQuestions(questionList)
      generateValidation(questionList)
    }
  }, [questionData, regionId])

  const generateValidation = (questionList: ApplicationQuestion[]) => {
    if (questionList.length > 0) {
      const empty = { ...emptyStudent }
      const valid_student = {}
      const valid_student_meta = {}

      const valid_student_packet: unknown = {}
      questionList.map((q) => {
        if (q.type !== QUESTION_TYPE.INFORMATION && !q.additional_question) {
          if (q.slug?.includes('student_')) {
            empty[`${q.slug?.replace('student_', '')}`] = ''
            if (q.required) {
              if (q.validation === 1) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup
                  .string()
                  .email('Enter a valid email')
                  .required('Email is required')
              } else if (q.validation === 2) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup
                  .string()
                  .required(`${q.question} is required`)
                  .test(`${q.question}-selected`, `${q.question} is invalid`, (value: unknown) => {
                    return isNumber.test(value)
                  })
              } else if (q.slug?.toLocaleLowerCase().includes('emailconfirm')) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup
                  .string()
                  .required('Email is required')
                  .oneOf([yup.ref('email')], 'Emails do not match')
              } else if (q.type === QUESTION_TYPE.CHECKBOX) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup
                  .array()
                  .min(1, `${q.question} is required`)
                  .required(`${q.question} is required`)
              } else if (q.type === QUESTION_TYPE.AGREEMENT) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup
                  .bool()
                  .test(q.slug, `${q.question.replace(/<[^>]+>/g, '')} is required`, (value) => value === true)
                  .required(`${q.question.replace(/<[^>]+>/g, '')} is required`)
              } else {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup.string().required(`${q.question} is required`)
              }
            } else {
              if (q.slug?.toLocaleLowerCase().includes('emailconfirm')) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup
                  .string()
                  .oneOf([yup.ref('email')], 'Emails do not match')
                  .nullable(true)
              }
            }
          } else if (q.slug?.includes('meta_')) {
            if (q.required) {
              empty['meta'][`${q.slug}`] = ''
              if (q.validation === 1) {
                valid_student_meta[`${q.slug}`] = yup
                  .string()
                  .email('Enter a valid email')
                  .required('Email is required')
              } else if (q.validation === 2) {
                valid_student_meta[`${q.slug}`] = yup
                  .string()
                  .required(`${q.question} is required`)
                  .test(`${q.question}-selected`, `${q.question} is invalid`, (value: unknown) => {
                    return isNumber.test(value)
                  })
              } else if (q.type === QUESTION_TYPE.CHECKBOX) {
                valid_student_meta[`${q.slug}`] = yup
                  .array()
                  .min(1, `${q.question} is required`)
                  .required(`${q.question} is required`)
                  .nullable()
              } else if (q.type === QUESTION_TYPE.AGREEMENT) {
                valid_student_meta[q.slug] = yup
                  .bool()
                  .test(q.slug, `${q.question.replace(/<[^>]+>/g, '')} is required`, (value) => value === true)
                  .required(`${q.question.replace(/<[^>]+>/g, '')} is required`)
              } else {
                valid_student_meta[`${q.slug}`] = yup.string().required(`${q.question} is required`)
              }
            } else {
              empty['meta'][`${q.slug}`] = ''
              if (q.validation === 1) {
                valid_student_meta[`${q.slug}`] = yup.string().email('Enter a valid email').nullable(true)
              } else if (q.validation === 2) {
                valid_student_meta[`${q.slug}`] = yup
                  .string()
                  .test(`${q.question}-selected`, `${q.question} is invalid`, (value: unknown) => {
                    return !value || isNumber.test(value)
                  })
                  .nullable(true)
              }
            }
          } else if (q.slug?.includes('packet_') && q.required) {
            if (!q.student_question) {
              valid_packet[`${q.slug?.replace('packet_', '')}`] = yup.string().required(`${q.question} is required`)
            } else {
              valid_student_packet[`${q.slug?.replace('packet_', '')}`] = yup
                .string()
                .required(`${q.question} is required`)
            }
          }
        }
      })
      setEmptyStudent(empty)
      setValidationSchema({
        ...initSchema,
        students: yup.array(yup.object({ ...valid_student, meta: yup.object(valid_student_meta) })),
      })
    }
  }

  const classes = useStyles
  const extraClasses = additionalStyles()

  const [submitApplicationAction] = useMutation(AddApplicationMutation)

  const history = useHistory()

  const submitApplication = async (data) => {
    const submitStudents = data.students?.map((s) => {
      return {
        ...omit(s, ['emailConfirm']),
        meta: JSON.stringify(s?.meta || {}),
        // address: { ...s.address, county_id: Number(s.address?.county_id) || -1,
        //    school_district: s.packet?.school_district }, packet: omit(s.packet, ['school_district'])
      }
    })
    submitApplicationAction({
      variables: {
        createApplicationInput: {
          state: 'UT',
          program_year: parseInt(data.programYear!),
          students: submitStudents,
          meta: JSON.stringify(data.meta),
          // address: { ...data.address, school_district: data.packet?.school_district, county_id: data.county?.county ? parseInt(data.county?.county) : null },
          // packet: omit(data.packet, ['school_district']),
        },
      },
    }).then((res) => {
      setMe((prev) => {
        return {
          ...prev,
          students: prev?.students?.concat(res.data.createNewStudentApplication.students).sort(function (a, b) {
            if (a.person.first_name.toLocaleLowerCase() < b.person.first_name.toLocaleLowerCase()) {
              return -1
            }
            if (a.person.first_name.toLocaleLowerCase() > b.person.first_name.toLocaleLowerCase()) {
              return 1
            }
            return 0
          }),
        }
      })
      history.push('/homeroom')
    })
  }

  const setGradesAndBirthDateCut = (id) => {
    schoolYearsData.forEach((element) => {
      if (id == element?.school_year_id) {
        setGrades(element.grades?.split(','))
        setBirthDateCut(element.birth_date_cut)
      }
    })
  }

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

  useEffect(() => {
    if (!regionLoading && regionData) {
      setRegionId(regionData?.userRegionByUserId[0]?.region_id)
    }
  }, [me?.user_id, regionData])

  useEffect(() => {
    if (!schoolLoading && schoolYearData?.getActiveSchoolYears) {
      const schoolYearsArray: Array<DropDownItem> = []
      schoolYearData.getActiveSchoolYears
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
                label: `${moment(item.date_begin).format('YYYY')} - ${moment(item.date_end).format(
                  'YY',
                )} Mid-year Program`,
                value: `${item.school_year_id}-mid`,
              })
            }
          },
        )
      setSchoolYears(schoolYearsArray.sort((a, b) => (a.label > b.label ? 1 : -1)))
      setSchoolYearsData(schoolYearData?.getActiveSchoolYears)
    }
  }, [regionId, schoolYearData])

  useEffect(() => {
    parseGrades()
  }, [grades])

  const questionStudentSortList = (values, field) => {
    const sortList = values.filter(
      (v) =>
        v.slug !== 'program_year' &&
        !v.mainQuestion &&
        (!v.additional_question || // main question
          (values.find((x) => x.slug == v.additional_question)?.type == QUESTION_TYPE.DROPDOWN &&
            values
              .find((x) => x.slug == v.additional_question) // drop down addintion question
              ?.options.find(
                (x) =>
                  x.action == 2 &&
                  x.value ===
                    (field[values.find((y) => y.slug == v.additional_question)?.slug] ||
                      field.meta?.[values.find((y) => y.slug == v.additional_question)?.slug]),
              ) != null &&
            values.find((x) => x.slug == v.additional_question)?.active) ||
          (values.find((x) => x.slug == v.additional_question)?.type == QUESTION_TYPE.MULTIPLECHOICES &&
            values // multi item addintional question
              .find((x) => x.slug == v.additional_question)
              ?.options.find(
                (x) =>
                  x.action == 2 &&
                  x.label ===
                    (field[values.find((y) => y.slug == v.additional_question)?.slug] ||
                      field.meta?.[values.find((y) => y.slug == v.additional_question)?.slug]),
              ) != null &&
            values.find((x) => x.slug == v.additional_question)?.active) ||
          (values.find((x) => x.slug == v.additional_question)?.type == QUESTION_TYPE.CHECKBOX &&
            values // checkbox addintional question
              .find((x) => x.slug == v.additional_question)
              ?.options.find(
                (x) =>
                  x.action == 2 &&
                  (
                    field[values.find((y) => y.slug == v.additional_question)?.slug] ||
                    field.meta?.[values.find((y) => y.slug == v.additional_question)?.slug]
                  )?.indexOf(x.label) >= 0,
              ) != null &&
            values.find((x) => x.slug == v.additional_question)?.active)), // Parent
    )

    return sortList
  }

  const handleAddQuestion = (value, q) => {
    if (q.type == QUESTION_TYPE.CHECKBOX) {
      if (q.response.indexOf(value) >= 0) {
        q.response = q.response.replace(value, '')
      } else {
        q.response += value
      }
      value = q.response
    }
    const newValues = questions.map((v) =>
      v.id == q.id
        ? {
            ...v,
            response: value,
          }
        : v,
    )

    newValues.forEach((item: ApplicationQuestion, index: number) => {
      if (item.additional_question) {
        const parent = newValues.find((x) => item.additional_question == x.slug)
        if (
          parent?.response &&
          parent.options.find((x) => x.value == parent.response || parent.response.toString().indexOf(x.value) >= 0)
            .action == 2 &&
          parent?.active
        ) {
          newValues[index] = {
            ...item,
            active: true,
          }
        } else {
          newValues[index] = {
            ...item,
            active: false,
          }
        }
      } else {
        newValues[index] = item
      }
    })

    setQuestions(newValues)
    generateValidation(newValues)
  }

  return (
    <Card className={extraClasses.mainContent}>
      <Formik
        initialValues={{
          programYear: undefined,
          students: [emptyStudent],
          meta: {},
        }}
        enableReinitialize={true}
        validationSchema={object(validationSchema)}
        onSubmit={async (values) => {
          await submitApplication(values)
        }}
      >
        {({ values, errors }) => (
          <Form>
            <Box
              // paddingX={36}
              paddingTop={18}
              paddingBottom={10}
              paddingX={2}
              sx={{
                backgroundImage: `url(${BGSVG})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Grid item xs={12} display='flex' justifyContent={'center'}>
                <Box width={'451.53px'}>
                  <Field name='programYear' fullWidth focused>
                    {({ field, form, meta }) => (
                      <Box width={'100%'} display='block'>
                        <DropDown
                          name='programYear'
                          labelTop
                          placeholder='Program Year'
                          dropDownItems={schoolYears}
                          setParentValue={(originalId) => {
                            let id = originalId.toString()
                            if (id.toString()?.indexOf('mid') > 0) {
                              id = id?.split('-')?.at(0)
                            }
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
              <Grid container rowSpacing={2}>
                {!questionLoading &&
                  questionStudentSortList(questions, values?.students[0]).length > 0 &&
                  questionStudentSortList(questions, values?.students[0]).map((q): unknown | undefined => {
                    if (q.slug?.includes('student_') || q.student_question) {
                      if (q.slug === 'student_grade_level') {
                        return (
                          <Grid item xs={12} display='flex' justifyContent={'center'}>
                            <Box width={'451.53px'}>
                              <Field name={'students[0].grade_level'} fullWidth focused>
                                {({ field, form, meta }) => (
                                  <Box width={'100%'}>
                                    <DropDown
                                      name={'students[0].grade_level'}
                                      labelTop
                                      placeholder={
                                        birthDateCut == ''
                                          ? q.question
                                          : `${q.question} as of ${moment(birthDateCut).format(
                                              !matches ? 'MMMM DD, YYYY' : 'MMM DD, YYYY',
                                            )}`
                                      }
                                      dropDownItems={gradesDropDownItems}
                                      setParentValue={(id) => {
                                        form.setFieldValue(field.name, id)
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
                        )
                      } else if (q.slug?.includes('student_')) {
                        return (
                          <Grid item xs={12} display='flex' justifyContent={'center'}>
                            <Box width={'451.53px'} display='flex' flexDirection='row' alignItems={'center'}>
                              <Field name={`students[0].${q.slug?.replace('student_', '')}`} fullWidth focused>
                                {({ field, form, meta }) => (
                                  <Box width={'100%'}>
                                    <AdditionalQuestionItem
                                      question={q}
                                      field={field}
                                      form={form}
                                      meta={meta}
                                      handleAddQuestion={handleAddQuestion}
                                    />
                                  </Box>
                                )}
                              </Field>
                            </Box>
                          </Grid>
                        )
                      } else if (q.slug?.includes('meta_') && q.student_question) {
                        return (
                          <Grid item xs={12} display='flex' justifyContent={'center'}>
                            <Box width={'451.53px'} display='flex' flexDirection='row' alignItems={'center'}>
                              <Field name={`students[0].meta.${q.slug}`} fullWidth focused>
                                {({ field, form, meta }) => (
                                  <Box width={'100%'}>
                                    <AdditionalQuestionItem
                                      question={q}
                                      field={field}
                                      form={form}
                                      meta={meta}
                                      handleAddQuestion={handleAddQuestion}
                                    />
                                  </Box>
                                )}
                              </Field>
                            </Box>
                          </Grid>
                        )
                      } else if (!q.slug?.includes('meta_') && q.student_question) {
                        const parentFieldName = q.slug?.split('_')[0]
                        const childFieldName = q.slug?.replace(parentFieldName + '_', '')
                        return (
                          <Grid item xs={12} display='flex' justifyContent={'center'}>
                            <Box width={'451.53px'} display='flex' flexDirection='row' alignItems={'center'}>
                              <Field name={`students[0].${parentFieldName}.${childFieldName}`} fullWidth focused>
                                {({ field, form, meta }) => (
                                  <Box width={'100%'}>
                                    <AdditionalQuestionItem
                                      question={q}
                                      field={field}
                                      form={form}
                                      meta={meta}
                                      handleAddQuestion={handleAddQuestion}
                                    />
                                  </Box>
                                )}
                              </Field>
                            </Box>
                          </Grid>
                        )
                      } else {
                        return undefined
                      }
                    } else {
                      return undefined
                    }
                  })}
                <Grid item xs={12} display='flex' justifyContent={'center'}>
                  <Box width={'451.53px'}>
                    <FieldArray name='students'>
                      {({ push, remove }) => (
                        <Grid item container spacing={2} xs={12} sm='auto' className={extraClasses.studentsContent}>
                          {values.students.map((_, index) => (
                            <>
                              {!questionLoading &&
                                questionStudentSortList(questions, _).length > 0 &&
                                index > 0 &&
                                questionStudentSortList(questions, _).map((q): ReactElement | undefined => {
                                  const firstQuestionSlug = questionStudentSortList(questions, _).filter(
                                    (qf) => qf.question.includes('student_') || qf.student_question,
                                  )[0].slug
                                  if (q.slug === 'student_grade_level') {
                                    return (
                                      <Grid
                                        item
                                        xs={12}
                                        width={'100%'}
                                        display='flex'
                                        flexDirection='row'
                                        alignItems={'center'}
                                      >
                                        <Field name={`students[${index}].grade_level`} fullWidth focused>
                                          {({ field, form, meta }) => (
                                            <Box width={'100%'}>
                                              <DropDown
                                                name={`students[${index}].grade_level`}
                                                labelTop
                                                placeholder={
                                                  birthDateCut == ''
                                                    ? q.question
                                                    : `${q.question} as of ${moment(birthDateCut).format(
                                                        !matches ? 'MMMM DD, YYYY' : 'MMM DD, YYYY',
                                                      )}`
                                                }
                                                dropDownItems={gradesDropDownItems}
                                                setParentValue={(id) => {
                                                  form.setFieldValue(field.name, id)
                                                }}
                                                alternate={true}
                                                size='small'
                                                sx={
                                                  !!(meta.touched && meta.error)
                                                    ? classes.textFieldError
                                                    : classes.dropdown
                                                }
                                                error={{
                                                  error: !!(meta.touched && meta.error),
                                                  errorMsg: (meta.touched && meta.error) as string,
                                                }}
                                              />
                                            </Box>
                                          )}
                                        </Field>
                                        {index !== 0 && q.slug === firstQuestionSlug ? (
                                          <DeleteForeverOutlinedIcon
                                            sx={{ left: 12, position: 'relative', color: 'darkgray' }}
                                            onClick={() => remove(index)}
                                          />
                                        ) : null}
                                      </Grid>
                                    )
                                  } else if (q.slug.includes('student_')) {
                                    return (
                                      <Grid item xs={12}>
                                        <Box width={'100%'} display='flex' flexDirection='row' alignItems={'center'}>
                                          <Field
                                            name={`students[${index}].${q.slug.replace('student_', '')}`}
                                            fullWidth
                                            focused
                                          >
                                            {({ field, form, meta }) => (
                                              <Box width={'100%'}>
                                                <AdditionalQuestionItem
                                                  question={{ ...q, indexing: index }}
                                                  key={index}
                                                  field={field}
                                                  form={form}
                                                  meta={meta}
                                                  handleAddQuestion={handleAddQuestion}
                                                />
                                              </Box>
                                            )}
                                          </Field>
                                          {index !== 0 && q.slug === firstQuestionSlug ? (
                                            <DeleteForeverOutlinedIcon
                                              sx={{ left: 12, position: 'relative', color: 'darkgray' }}
                                              onClick={() => remove(index)}
                                            />
                                          ) : null}
                                        </Box>
                                      </Grid>
                                    )
                                  } else if (q.slug?.includes('meta_') && q.student_question) {
                                    return (
                                      <Grid item xs={12}>
                                        <Box width={'100%'} display='flex' flexDirection='row' alignItems={'center'}>
                                          <Field name={`students[${index}].meta.${q.slug}`} fullWidth focused>
                                            {({ field, form, meta }) => (
                                              <Box width={'100%'}>
                                                <AdditionalQuestionItem
                                                  question={{ ...q, indexing: index }}
                                                  key={index}
                                                  field={field}
                                                  form={form}
                                                  meta={meta}
                                                  handleAddQuestion={handleAddQuestion}
                                                />
                                              </Box>
                                            )}
                                          </Field>
                                          {index !== 0 && q.slug === firstQuestionSlug ? (
                                            <DeleteForeverOutlinedIcon
                                              sx={{ left: 12, position: 'relative', color: 'darkgray' }}
                                              onClick={() => remove(index)}
                                            />
                                          ) : null}
                                        </Box>
                                      </Grid>
                                    )
                                  } else if (!q.slug?.includes('meta_') && q.student_question) {
                                    const parentFieldName = q.slug?.split('_')[0]
                                    const childFieldName = q.slug?.replace(parentFieldName + '_', '')
                                    return (
                                      <Grid item xs={12} display='flex' justifyContent={'center'}>
                                        <Box
                                          width={'451.53px'}
                                          display='flex'
                                          flexDirection='row'
                                          alignItems={'center'}
                                        >
                                          <Field
                                            name={`students[${index}].${parentFieldName}.${childFieldName}`}
                                            fullWidth
                                            focused
                                          >
                                            {({ field, form, meta }) => (
                                              <Box width={'100%'}>
                                                <AdditionalQuestionItem
                                                  question={{ ...q, indexing: index }}
                                                  field={field}
                                                  form={form}
                                                  meta={meta}
                                                  handleAddQuestion={handleAddQuestion}
                                                />
                                              </Box>
                                            )}
                                          </Field>
                                          {index !== 0 && q.slug === firstQuestionSlug ? (
                                            <DeleteForeverOutlinedIcon
                                              sx={{ left: 12, position: 'relative', color: 'darkgray' }}
                                              onClick={() => remove(index)}
                                            />
                                          ) : null}
                                        </Box>
                                      </Grid>
                                    )
                                  } else {
                                    return undefined
                                  }
                                })}
                            </>
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
                        </Grid>
                      )}
                    </FieldArray>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant='contained'
                    style={classes.submitButton}
                    type='submit'
                    // disabled={Boolean(Object.keys(errors).length)}
                  >
                    Submit Application
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
