import React, { ReactElement, useEffect, useState } from 'react'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { Box, Button, Card, Grid, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Field, FieldArray, Form, Formik } from 'formik'
import { map, sortBy, toNumber } from 'lodash'
import { omit } from 'lodash'
import moment from 'moment'
import { Link } from 'react-router-dom'
import * as yup from 'yup'
import { object, string } from 'yup'
import BGSVG from '@mth/assets/ApplicationBG.svg'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { NewApplicationFooter } from '@mth/components/NewApplicationFooter/NewApplicationFooter'
import { QUESTION_TYPE } from '@mth/components/QuestionItem/QuestionItemProps'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Title } from '@mth/components/Typography/Title/Title'
import { getAllRegion } from '@mth/graphql/queries/region'
import { useActiveSchoolYearsByRegionId } from '@mth/hooks'
import { getWindowDimension } from '@mth/utils'
import { DASHBOARD, GRADES, MTHBLUE, RED, SYSTEM_05 } from '../../../utils/constants'
import { toOrdinalSuffix, isNumber } from '../../../utils/stringHelpers'
import { phoneFormat } from '../../../utils/utils'
import { LoadingScreen } from '../../LoadingScreen/LoadingScreen'
import { AdditionalQuestionItem } from '../components/AdditionalQuestionItem/AdditionalQuestionItem'
import { ApplicationQuestion } from '../components/AdditionalQuestionItem/types'
import { useStyles } from '../styles'
import { checkEmailQuery, newParentApplicationMutation, getQuestionsGql } from './service'

export type StudentInput = {
  first_name: string
  last_name: string
  program_year: string
  grade_level: string
}

export const NewParent: React.FC = () => {
  const classes = useStyles
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('sm'))
  const [initStudentQuestions, setInitStudentQuestions] = useState({ meta: {} })
  const [emptyStudent, setEmptyStudent] = useState({ meta: {} })
  const [emptyParent, setEmptyParent] = useState({})
  const [emptyMeta, setEmptyMeta] = useState({})
  const [emptyAddress, setEmptyAddress] = useState({})
  const [emptyPacket, setEmptyPacket] = useState({})
  const initSchema = {
    state: string().required('Required'),
    programYear: string().required('Required'),
  }
  const [validationSchema, setValidationSchema] = useState()
  const [availableRegions, setAvailableRegions] = useState([])
  const [regionId, setRegionId] = useState('')
  const [showEmailError, setShowEmailError] = useState(false)
  const [midYearApplication, setMidYearApplication] = useState<boolean>(false)
  const [grades, setGrades] = useState<string[]>([])
  const [gradesDropDownItems, setGradesDropDownItems] = useState<Array<DropDownItem>>([])
  const [birthDateCut, setBirthDateCut] = useState<string>('')
  const [showConfirmationText, setShowConfirmationText] = useState(false)
  const [questions, setQuestions] = useState<ApplicationQuestion[]>([])
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimension())

  const { schoolYears: schoolYearsData, dropdownItems: schoolYears } = useActiveSchoolYearsByRegionId(+regionId)

  const { loading: questionLoading, data: questionData } = useQuery(getQuestionsGql, {
    variables: { input: { region_id: Number(regionId) } },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!questionLoading && questionData?.getApplicationQuestions) {
      setQuestions(
        questionData.getApplicationQuestions
          .map((v) => ({
            ...v,
            options: v.options ? JSON.parse(v.options || '[]') : [],
            response: '',
            active: !v.additional_question ? true : false,
          }))
          .sort((a, b) => a.order - b.order),
      )

      // add studnet list
      const studentQuestions = { ...initStudentQuestions }
      questionSortList(
        questionData.getApplicationQuestions
          .map((v) => ({ ...v, options: v.options ? JSON.parse(v.options || '[]') : [], response: '' }))
          .sort((a, b) => a.order - b.order),
      ).map((q: unknown) => {
        if (q.type !== QUESTION_TYPE.INFORMATION) {
          if (q.slug?.includes('student_')) {
            studentQuestions[`${q.slug?.replace('student_', '')}`] = ''
          } else if (q.slug?.includes('meta_') && q.student_question) {
            studentQuestions['meta'][`${q.slug?.replace('student_', '')}`] = ''
          }
        }
      })

      setInitStudentQuestions(studentQuestions)
    }
  }, [questionData, regionId, questionLoading])

  useEffect(() => {
    if (questionSortList(questions).length > 0) {
      const empty: unknown = { ...emptyStudent }
      const initParent: unknown = { ...emptyParent }
      const initMeta: unknown = { ...emptyMeta }
      const initAddress: unknown = { ...emptyAddress }
      const initPacket: unknown = { ...emptyPacket }

      const valid_student: unknown = {}
      const valid_student_meta: unknown = {}

      const valid_student_packet: unknown = {}
      const valid_parent: unknown = {}
      const valid_address: unknown = {}
      const valid_packet: unknown = {}
      const valid_meta: unknown = {}

      questionSortList(questions).map((q) => {
        if (q.type !== QUESTION_TYPE.INFORMATION && !q.additional_question) {
          if (q.slug?.includes('student_')) {
            empty[`${q.slug?.replace('student_', '')}`] = ''
            if (q.required) {
              if (q.validation === 1) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup
                  .string()
                  .email('Enter a valid email')
                  .required('Required')
              } else if (q.validation === 2) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup
                  .string()
                  .required('Required')
                  .test(`${q.question}-selected`, `${q.question} is invalid`, (value: unknown) => {
                    return isNumber.test(value)
                  })
              } else if (q.slug?.toLocaleLowerCase().includes('emailconfirm')) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup
                  .string()
                  .required('Required')
                  .oneOf([yup.ref('email')], 'Emails do not match')
              } else if (q.type === QUESTION_TYPE.CHECKBOX) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup
                  .array()
                  .min(1, 'Required')
                  .required('Required')
              } else if (q.type === QUESTION_TYPE.AGREEMENT) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup
                  .bool()
                  .test(q.slug, 'Required', (value) => value === true)
                  .required('Required')
              } else {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup.string().required('Required')
              }
            } else {
              if (q.slug?.toLocaleLowerCase().includes('emailconfirm')) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup
                  .string()
                  .oneOf([yup.ref('email')], 'Emails do not match')
                  .nullable(true)
              } else if (q.validation === 1) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup
                  .string()
                  .email('Enter a valid email')
                  .required('Required')
              }
            }
          } else if (q.slug?.includes('parent_')) {
            initParent[`${q.slug?.replace('parent_', '')}`] = ''
            if (q.required) {
              if (q.slug?.toLocaleLowerCase().includes('emailconfirm')) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                  .string()
                  .required('Required')
                  .oneOf([yup.ref('email')], 'Emails do not match')
              } else if (q.validation === 1) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                  .string()
                  .email('Enter a valid email')
                  .required('Required')
              } else if (q.validation === 2) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                  .string()
                  .required('Required')
                  .test(`${q.question}-selected`, `${q.question} is invalid`, (value: unknown) => {
                    return isNumber.test(value)
                  })
              } else if (q.type === QUESTION_TYPE.CHECKBOX) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup.array().min(1, 'Required').required('Required')
              } else if (q.type === QUESTION_TYPE.AGREEMENT) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                  .bool()
                  .test(q.slug, 'Required', (value) => value === true)
                  .required('Required')
              } else {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup.string().required('Required')
              }
            } else {
              if (q.slug?.toLocaleLowerCase().includes('emailconfirm')) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                  .string()
                  .oneOf([yup.ref('email')], 'Emails do not match')
                  .nullable(true)
              } else if (q.validation === 1) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                  .string()
                  .email('Enter a valid email')
                  .nullable(true)
              } else if (q.validation === 2) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                  .string()
                  .test(`${q.question}-selected`, `${q.question} is invalid`, (value: unknown) => {
                    return !value || isNumber.test(value)
                  })
                  .nullable(true)
              }
            }
          } else if (q.slug?.includes('meta_')) {
            if (q.required) {
              if (q.student_question) {
                empty['meta'][`${q.slug}`] = ''
                if (q.validation === 1) {
                  valid_student_meta[`${q.slug}`] = yup.string().email('Enter a valid email').required('Required')
                } else if (q.validation === 2) {
                  valid_student_meta[`${q.slug}`] = yup
                    .string()
                    .required('Required')
                    .test(`${q.question}-selected`, `${q.question} is invalid`, (value: unknown) => {
                      return isNumber.test(value)
                    })
                } else if (q.type === QUESTION_TYPE.CHECKBOX) {
                  valid_student_meta[`${q.slug}`] = yup.array().min(1, 'Required').required('Required').nullable()
                } else if (q.type === QUESTION_TYPE.AGREEMENT) {
                  valid_student_meta[q.slug] = yup
                    .bool()
                    .test(q.slug, 'Required', (value) => value === true)
                    .required('Required')
                } else {
                  valid_student_meta[`${q.slug}`] = yup.string().required('Required')
                }
              } else {
                initMeta[`${q.slug}`] = ''
                if (q.validation === 1) {
                  valid_meta[`${q.slug}`] = yup.string().email('Enter a valid email').required('Required')
                } else if (q.validation === 2) {
                  valid_meta[`${q.slug}`] = yup
                    .string()
                    .required('Required')
                    .test(`${q.question}-selected`, `${q.question} is invalid`, (value: unknown) => {
                      return isNumber.test(value)
                    })
                } else if (q.type === QUESTION_TYPE.CHECKBOX) {
                  valid_meta[`${q.slug}`] = yup.array().min(1, 'Required').required('Required').nullable()
                } else if (q.type === QUESTION_TYPE.AGREEMENT) {
                  valid_meta[`${q.slug}`] = yup
                    .bool()
                    .test(q.slug, 'Required', (value) => value === true)
                    .required('Required')
                } else {
                  valid_meta[`${q.slug}`] = yup.string().required('Required')
                }
              }
            } else {
              if (q.student_question) {
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
              } else {
                initMeta[`${q.slug}`] = ''
                if (q.validation === 1) {
                  valid_meta[`${q.slug}`] = yup.string().email('Enter a valid email').nullable(true)
                } else if (q.validation === 2) {
                  valid_meta[`${q.slug}`] = yup
                    .string()
                    .test(`${q.question}-selected`, `${q.question} is invalid`, (value: unknown) => {
                      return !value || isNumber.test(value)
                    })
                    .nullable(true)
                }
              }
            }
          } else if (q.slug?.includes('address_')) {
            initAddress[`${q.slug?.replace('address_', '')}`] = ''
            if (q.required) {
              if (q.validation === 2) {
                valid_address[`${q.slug?.replace('address_', '')}`] = yup
                  .string()
                  .required('Required')
                  .test(`${q.question}-selected`, `${q.question} is invalid`, (value: unknown) => {
                    return isNumber.test(value)
                  })
              } else {
                valid_address[`${q.slug?.replace('address_', '')}`] = yup.string().required('Required')
              }
            } else {
              if (q.validation === 2) {
                valid_address[`${q.slug?.replace('address_', '')}`] = yup
                  .string()
                  .test(`${q.question}-selected`, `${q.question} is invalid`, (value: unknown) => {
                    return !value || isNumber.test(value)
                  })
                  .nullable(true)
              }
            }
          } else if (q.slug?.includes('packet_') && q.required) {
            initPacket[`${q.slug?.replace('packet_', '')}`] = ''
            if (!q.student_question) {
              valid_packet[`${q.slug?.replace('packet_', '')}`] = yup.string().required('Required')
            } else {
              valid_student_packet[`${q.slug?.replace('packet_', '')}`] = yup.string().required('Required')
            }
          }
        }
      })
      setEmptyStudent(empty)
      setEmptyParent(initParent)
      setEmptyMeta(initMeta)
      setEmptyAddress(initAddress)
      setEmptyPacket(initPacket)
      setValidationSchema({
        ...initSchema,
        parent: yup.object(valid_parent),
        address: yup.object(valid_address),
        packet: yup.object(valid_packet),
        students: yup.array(yup.object({ ...valid_student, meta: yup.object(valid_student_meta) })),
        meta: yup.object(valid_meta),
      })
    }
  }, [questions])

  const [submitApplicationAction] = useMutation(newParentApplicationMutation)

  const { data: regionData, loading } = useQuery(getAllRegion)

  useEffect(() => {
    if (!loading)
      setAvailableRegions(
        map(regionData.regions, (region) => ({
          label: region.name,
          value: region.id,
        })),
      )
  }, [regionData])

  const submitApplication = async (values) => {
    const submitStudents = values.students?.map((s) => {
      return {
        ...omit(s, ['emailConfirm']),
        meta: JSON.stringify(s?.meta || {}),
        // address: { ...s.address, school_district: s.packet?.school_district },
        // packet: omit(s.packet, ['school_district'])
      }
    })

    const parentInfo = omit(values.parent, ['emailConfirm'])
    if (parentInfo.phone_number) {
      parentInfo.phone_number = phoneFormat(parentInfo.phone_number)
    }

    submitApplicationAction({
      variables: {
        createApplicationInput: {
          referred_by: values.refferedBy,
          state: values.state.toString(),
          program_year: parseInt(values.programYear!),
          parent: parentInfo,
          students: submitStudents,
          midyear_application: midYearApplication,
          meta: JSON.stringify(values.meta),
          address: {
            ...values.address,
            school_district: values.packet?.school_district + '',
            county_id: values.county?.county ? parseInt(values.county?.county) : null,
          },
          packet: omit(values.packet, ['school_district']),
        },
      },
    }).then(() => {
      setShowConfirmationText(true)
    })
  }

  const parseGrades = () => {
    const dropDownItems: DropDownItem[] = []
    GRADES.forEach((grade: string | number) => {
      if (grades?.includes(grade?.toString())) {
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

  const setGradesAndBirthDateCut = (id) => {
    schoolYearsData.forEach((element) => {
      if (id == element?.school_year_id) {
        setGrades(element.grades?.split(','))
        setBirthDateCut(element.birth_date_cut)
      }
    })
  }

  useEffect(() => {
    parseGrades()
  }, [grades])

  const [checkEmail, { loading: emailLoading, data: emailData }] = useLazyQuery(checkEmailQuery, {
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && emailData !== undefined) {
      if (emailData.emailTaken === true) {
        const response = new CustomEvent('emailTaken', { detail: { error: true } })
        document.dispatchEvent(response)
        setShowEmailError(true)
      } else {
        setShowEmailError(false)
      }
    }
  }, [emailLoading, emailData])

  // handle child component
  const questionSortList = (values) => {
    const sortList = values.filter(
      (v) =>
        v.slug !== 'program_year' &&
        !v.mainQuestion &&
        (!v.additional_question ||
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
              ) != null)), // Parent
    )
    return sortList
  }

  const getMatchField = (field, slug) => {
    if (field.students[0][slug]) {
      return field.students[0][slug]
    }
    if (field.students[0].meta[slug]) {
      return field.students[0].meta[slug]
    }
    if (field.meta[slug]) {
      return field.meta[slug]
    }
    if (field.address[slug]) {
      return field.address[slug]
    }
    if (field.packet[slug]) {
      return field.packet[slug]
    }
  }

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
                  x.value === getMatchField(field, values.find((y) => y.slug == v.additional_question)?.slug),
              ) != null &&
            values.find((x) => x.slug == v.additional_question)?.active) ||
          (values.find((x) => x.slug == v.additional_question)?.type == QUESTION_TYPE.MULTIPLECHOICES &&
            values // multi item addintional question
              .find((x) => x.slug == v.additional_question)
              ?.options.find(
                (x) =>
                  x.action == 2 &&
                  x.label === getMatchField(field, values.find((y) => y.slug == v.additional_question)?.slug),
              ) != null &&
            values.find((x) => x.slug == v.additional_question)?.active) ||
          (values.find((x) => x.slug == v.additional_question)?.type == QUESTION_TYPE.CHECKBOX &&
            values // checkbox addintional question
              .find((x) => x.slug == v.additional_question)
              ?.options.find(
                (x) =>
                  x.action == 2 &&
                  getMatchField(field, values.find((y) => y.slug == v.additional_question)?.slug)?.indexOf(x.label) >=
                    0,
              ) != null &&
            values.find((x) => x.slug == v.additional_question)?.active)), // Parent
    )

    return sortList
  }

  const questionAddStudentSortList = (values, field) => {
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
  }

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimension())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [showConfirmationText])

  return !loading ? (
    <Card sx={{ paddingTop: 6, backgroundColor: '#EEF4F8' }}>
      {!showConfirmationText ? (
        <Formik
          initialValues={{
            programYear: undefined,
            state: regionId,
            refferedBy: undefined,
            students: [emptyStudent],
            meta: emptyMeta,
            parent: emptyParent,

            address: emptyAddress,
            packet: emptyPacket,
          }}
          enableReinitialize={true}
          validationSchema={object(validationSchema)}
          onSubmit={async (values) => {
            await submitApplication(values)
          }}
        >
          {({ values, errors }) => {
            return (
              <Form>
                <Box
                  paddingX={windowDimensions.width < 460 ? '20px' : ''}
                  paddingBottom={10}
                  sx={{
                    backgroundImage: `url(${BGSVG})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top',
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '88vh',
                  }}
                >
                  <Grid container rowSpacing={2} paddingTop={10}>
                    <Grid item xs={12}>
                      <Title color={MTHBLUE} textAlign='center'>
                        InfoCenter
                      </Title>
                    </Grid>
                    <Grid item xs={12}>
                      <Title fontWeight='500' textAlign='center'>
                        Apply
                      </Title>
                    </Grid>
                    <Grid item xs={12} display='flex' justifyContent={'center'}>
                      <Field name={'state'} fullWidth focused>
                        {({ field, form, meta }) => (
                          <Box width={'451.53px'}>
                            <DropDown
                              name='state'
                              labelTop
                              dropDownItems={sortBy(availableRegions, 'label')}
                              placeholder='Program State'
                              setParentValue={(id) => {
                                form.setFieldValue(field.name, id)
                                setRegionId(id)
                              }}
                              alternate={true}
                              sx={!!(meta.touched && Boolean(meta.error)) ? classes.textFieldError : classes.dropdown}
                              size='small'
                              error={{
                                error: !!(meta.touched && Boolean(meta.error)),
                                errorMsg: (meta.touched && meta.error) as string,
                              }}
                            />
                          </Box>
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={12} display='flex' justifyContent={'center'}>
                      <Box width={'451.53px'}>
                        <Field name='programYear' fullWidth focused>
                          {({ field, form, meta }) => (
                            <Box width={'100%'}>
                              <DropDown
                                name='programYear'
                                labelTop
                                placeholder='Program Year'
                                dropDownItems={schoolYears}
                                setParentValue={(id) => {
                                  let yearId = id.toString()
                                  if (yearId?.indexOf('mid') > 0) {
                                    yearId = yearId?.split('-')?.at(0)
                                    setMidYearApplication(true)
                                  } else {
                                    setMidYearApplication(false)
                                  }
                                  form.setFieldValue(field.name, toNumber(yearId))
                                  setGradesAndBirthDateCut(yearId)
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
                    {!questionLoading &&
                      questionStudentSortList(questions, values).length > 0 &&
                      questionStudentSortList(questions, values).map(
                        (q: unknown, idx: number): ReactElement | undefined => {
                          if (q.slug === 'parent_email') {
                            return (
                              <Grid key={idx} item xs={12} display='flex' justifyContent={'center'}>
                                <Box width={'451.53px'}>
                                  <Field name={'parent.email'} fullWidth focused>
                                    {({ field, form, meta }) => {
                                      if (showEmailError) {
                                        form.setErrors({
                                          parent: {
                                            email: (
                                              <Paragraph>
                                                This email is already being used.&nbsp;&nbsp;
                                                <Link
                                                  to={DASHBOARD}
                                                  style={{
                                                    fontSize: '11.2px',
                                                    fontWeight: 700,
                                                    color: MTHBLUE,
                                                    textDecoration: 'none',
                                                  }}
                                                >
                                                  Please login{'\u00A0'}
                                                </Link>
                                                to complete an application
                                              </Paragraph>
                                            ),
                                          },
                                        })
                                      }
                                      return (
                                        <Box width={'100%'}>
                                          <TextField
                                            name='parent.email'
                                            size='small'
                                            label={q.question}
                                            focused
                                            variant='outlined'
                                            inputProps={{
                                              style: { color: 'black' },
                                            }}
                                            InputLabelProps={{
                                              style: { color: SYSTEM_05 },
                                            }}
                                            sx={
                                              !!(meta.touched && meta.error)
                                                ? classes.textFieldError
                                                : classes.textField
                                            }
                                            {...field}
                                            error={meta.error || showEmailError}
                                            helperText={meta.touched && meta.error}
                                            onKeyUp={() => {
                                              // TODO fix validation here
                                              checkEmail({
                                                variables: {
                                                  email: field.value,
                                                },
                                              })
                                            }}
                                          />
                                        </Box>
                                      )
                                    }}
                                  </Field>
                                </Box>
                              </Grid>
                            )
                          } else if (q.slug === 'parent_emailConfirm') {
                            return (
                              <Grid key={idx} item xs={12} display='flex' justifyContent={'center'}>
                                <Box width={'451.53px'}>
                                  <Field name={'parent.emailConfirm'} fullWidth focused>
                                    {({ field, meta }) => (
                                      <Box width={'100%'}>
                                        <TextField
                                          name='emailConfirm'
                                          size='small'
                                          label={q.question}
                                          focused
                                          variant='outlined'
                                          inputProps={{
                                            style: { color: 'black' },
                                          }}
                                          InputLabelProps={{
                                            style: { color: SYSTEM_05 },
                                          }}
                                          sx={
                                            !!(meta.touched && meta.error) ? classes.textFieldError : classes.textField
                                          }
                                          {...field}
                                          error={meta.touched && meta.error}
                                          helperText={meta.touched && meta.error}
                                        />
                                      </Box>
                                    )}
                                  </Field>
                                </Box>
                              </Grid>
                            )
                          } else if (q.slug?.includes('student_') || q.student_question) {
                            if (q.slug === 'student_grade_level') {
                              return (
                                <Grid key={idx} item xs={12} display='flex' justifyContent={'center'}>
                                  <Box width={'451.53px'}>
                                    <Field name={'students[0].grade_level'} fullWidth focused>
                                      {({ field, form, meta }) => (
                                        <Box width={'100%'}>
                                          <DropDown
                                            name={'students[0].grade_level'}
                                            labelTop
                                            placeholder={`${q.question} as of ${moment(birthDateCut).format(
                                              !matches ? 'MMMM DD, YYYY' : 'MMM. DD, YYYY',
                                            )}`}
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
                                  </Box>
                                </Grid>
                              )
                            } else if (q.slug?.includes('student_')) {
                              return (
                                <Grid key={idx} item xs={12} display='flex' justifyContent={'center'}>
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
                                <Grid key={idx} item xs={12} display='flex' justifyContent={'center'}>
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
                                <Grid key={idx} item xs={12} display='flex' justifyContent={'center'}>
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
                          } else if (q.slug?.includes('meta_')) {
                            return (
                              <Grid key={idx} item xs={12} display='flex' justifyContent={'center'}>
                                <Box width={'451.53px'}>
                                  <Field name={`meta.${q.slug}`} fullWidth focused>
                                    {({ field, form, meta }) => (
                                      <AdditionalQuestionItem
                                        question={q}
                                        field={field}
                                        form={form}
                                        meta={meta}
                                        handleAddQuestion={handleAddQuestion}
                                      />
                                    )}
                                  </Field>
                                </Box>
                              </Grid>
                            )
                          } else {
                            const parentFieldName = q.slug?.split('_')[0]
                            const childFieldName = q.slug?.replace(parentFieldName + '_', '')
                            return (
                              <Grid key={idx} item xs={12} display='flex' justifyContent={'center'}>
                                <Box width={'451.53px'}>
                                  <Field name={`${parentFieldName}.${childFieldName}`} fullWidth focused>
                                    {({ field, form, meta }) => (
                                      <AdditionalQuestionItem
                                        question={q}
                                        field={field}
                                        form={form}
                                        meta={meta}
                                        handleAddQuestion={handleAddQuestion}
                                      />
                                    )}
                                  </Field>
                                </Box>
                              </Grid>
                            )
                          }
                        },
                      )}
                    <Grid item xs={12} display='flex' justifyContent={'center'}>
                      <Box width={'451.53px'}>
                        <FieldArray name='students'>
                          {({ push, remove }) => (
                            <Grid item container spacing={2} xs={12} sm='auto'>
                              {values.students.map((_, index) => (
                                <>
                                  {!questionLoading &&
                                    questionAddStudentSortList(
                                      questions.filter((qf) => qf.question.includes('student_') || qf.student_question),
                                      _,
                                    ).length > 0 &&
                                    index > 0 &&
                                    questionAddStudentSortList(
                                      questions.filter((qf) => qf.question.includes('student_') || qf.student_question),
                                      _,
                                    ).map((q, idx: number): ReactElement | undefined => {
                                      const firstQuestionSlug = questionAddStudentSortList(
                                        questions.filter(
                                          (qf) => qf.question.includes('student_') || qf.student_question,
                                        ),
                                        _,
                                      )[0].slug
                                      if (q.slug === 'student_grade_level') {
                                        return (
                                          <Grid
                                            item
                                            key={idx}
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
                                                    placeholder={`${q.question} as of ${moment(birthDateCut).format(
                                                      !matches ? 'MMMM DD, YYYY' : 'MMM. DD, YYYY',
                                                    )}`}
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
                                      } else if (q.slug?.includes('student_')) {
                                        return (
                                          <Grid key={idx} item xs={12}>
                                            <Box
                                              width={'100%'}
                                              display='flex'
                                              flexDirection='row'
                                              alignItems={'center'}
                                            >
                                              <Field
                                                name={`students[${index}].${q.slug?.replace('student_', '')}`}
                                                fullWidth
                                                focused
                                              >
                                                {({ field, form, meta }) => (
                                                  <Box width={'100%'}>
                                                    <AdditionalQuestionItem
                                                      question={q}
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
                                          <Grid key={idx} item xs={12}>
                                            <Box
                                              width={'100%'}
                                              display='flex'
                                              flexDirection='row'
                                              alignItems={'center'}
                                            >
                                              <Field name={`students[${index}].meta.${q.slug}`} fullWidth focused>
                                                {({ field, form, meta }) => (
                                                  <Box width={'100%'}>
                                                    <AdditionalQuestionItem
                                                      question={q}
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
                                          <Grid key={idx} item xs={12} display='flex' justifyContent={'center'}>
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
                                                      question={q}
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
                              <Grid item xs={12} display='flex' justifyContent={'center'}>
                                <Button
                                  // color='secondary'
                                  // variant='contained'
                                  disabled={
                                    regionId &&
                                    questionSortList(questions).filter((q) => q.slug.includes('student_')).length > 0
                                      ? false
                                      : true
                                  }
                                  style={classes.addStudentButton}
                                  onClick={() => push(initStudentQuestions)}
                                  // onClick={() => push(emptyStudent)}
                                >
                                  Add Student
                                </Button>
                              </Grid>
                            </Grid>
                          )}
                        </FieldArray>
                      </Box>
                    </Grid>
                    <Grid item xs={12} display='flex' justifyContent={'center'}>
                      <Button
                        variant='contained'
                        type='submit'
                        style={classes.submitButton}
                        // disabled={Boolean(Object.keys(errors).length) || showEmailError}
                      >
                        Submit Application
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Form>
            )
          }}
        </Formik>
      ) : (
        <>
          <Box
            sx={{
              backgroundImage: `url(${BGSVG})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'top',
              display: 'flex',
              flexDirection: 'column',
              minHeight: windowDimensions.width < 460 ? '850px' : '1300px',
            }}
          >
            <Box marginTop={12}>
              <Title color={MTHBLUE} textAlign='center'>
                InfoCenter
              </Title>
            </Box>
            <Box
              sx={{
                width: windowDimensions.width < 460 ? '100%' : '510px',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '100px',
                paddingX: windowDimensions.width < 600 ? '30px' : '',
              }}
            >
              <Title size='medium' fontWeight='500' textAlign='center'>
                Please check your email for a verification link to complete your account setup.
              </Title>
            </Box>
          </Box>
        </>
      )}
      <Box paddingBottom={4}>
        <NewApplicationFooter />
      </Box>
    </Card>
  ) : (
    <LoadingScreen />
  )
}
