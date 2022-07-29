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
import { useHistory, useRouteMatch } from 'react-router-dom'
import { QUESTION_TYPE } from '../../../components/QuestionItem/QuestionItemProps'
import { omit } from 'lodash'

export const getRegionByUserId = gql`
  query UserRegionByUserId($userId: ID!) {
    userRegionByUserId(user_id: $userId) {
      region_id
    }
  }
`

export const getActiveSchoolYearsByRegionId = gql`
  query GetActiveSchoolYears($regionId: ID!) {
    getSchoolYearsByRegionId(region_id: $regionId) {
      date_begin
      date_end
      date_reg_close
      date_reg_open
      grades
      birth_date_cut
      special_ed
      special_ed_options
      school_year_id
      midyear_application
      midyear_application_open
      midyear_application_close
    }
  }
`

export const ExistingParent = () => {
  const [emptyStudent, setEmptyStudent] = useState({ meta: {} })
  const initSchema = {
    programYear: string().required('Program Year is required'),
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
          .map((v) => ({ ...v, options: v.options ? JSON.parse(v.options || '[]') : [], response: '' }))
          // .filter((v) => !v.additional_question)
          .sort((a, b) => a.order - b.order),
      )
    }
  }, [questionData, regionId])

  useEffect(() => {
    if (questionSortList(questions).length > 0) {
      let empty = { ...emptyStudent }
      let valid_student = {}
      let valid_meta = {}
      let valid_student_meta = {}
      let valid_student_address: any = {}
      let valid_student_packet: any = {}
      questionSortList(questions).map((q) => {
        if (q.type !== QUESTION_TYPE.INFORMATION) {
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
                  .test(`${q.question}-selected`, `${q.question} is invalid`, (value: any) => {
                    return isNumber.test(value)
                  })
              }else if (q.slug?.toLocaleLowerCase().includes('emailconfirm')) {
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
                  .test(
                    q.slug,
                    `${q.question.replace(/<[^>]+>/g, '')} is required`,
                    value => value === true
                  )
                  .required(
                    `${q.question.replace(/<[^>]+>/g, '')} is required`
                  );
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
                  .test(`${q.question}-selected`, `${q.question} is invalid`, (value: any) => {
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
                  .test(
                    q.slug,
                    `${q.question.replace(/<[^>]+>/g, '')} is required`,
                    value => value === true
                  )
                  .required(
                    `${q.question.replace(/<[^>]+>/g, '')} is required`
                  );
              } else {
                valid_student_meta[`${q.slug}`] = yup.string().required(`${q.question} is required`)
              }
            } else {
              empty['meta'][`${q.slug}`] = ''
              if (q.validation === 1) {
                valid_student_meta[`${q.slug}`] = yup
                  .string()
                  .email('Enter a valid email')
                  .nullable(true)
              } else if (q.validation === 2) {
                valid_student_meta[`${q.slug}`] = yup
                  .string()
                  .test(`${q.question}-selected`, `${q.question} is invalid`, (value: any) => {
                    return !value || isNumber.test(value)
                  })
                  .nullable(true)
              }
            }
          }
          else if (q.slug?.includes('packet_') && q.required) {
            if (!q.student_question) {
              valid_packet[`${q.slug?.replace('packet_', '')}`] = yup.string().required(`${q.question} is required`)
            }
            else {
              valid_student_packet[`${q.slug?.replace('packet_', '')}`] = yup.string().required(`${q.question} is required`)
            }
          }
        }
      })
      setEmptyStudent(empty)
      setValidationSchema({
        ...initSchema,
        students: yup.array(yup.object({ ...valid_student, meta: yup.object(valid_student_meta) })),
        meta: yup.object(valid_meta),
      })
    }
  }, [questions])

  const classes = useStyles

  const [submitApplicationAction, { data }] = useMutation(AddApplicationMutation)

  const history = useHistory()

  const submitApplication = async (data) => {
    const submitStudents = data.students?.map((s) => {
      return { ...omit(s, ['emailConfirm']), 
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

  useEffect(() => {
    if (!regionLoading && regionData) {
      setRegionId(regionData?.userRegionByUserId[0]?.region_id)
    }
  }, [me?.user_id, regionData])

  // useEffect(() => {
  //   if (!schoolLoading && schoolYearData?.getSchoolYearsByRegionId) {
  //     setSchoolYears(
  //       schoolYearData?.getSchoolYearsByRegionId.map((item) => {
  //         return {
  //           label: moment(item.date_begin).format('YYYY') + '-' + moment(item.date_end).format('YYYY'),
  //           value: item.school_year_id,
  //         }
  //       }),
  //     )
  //     setSchoolYearsData(schoolYearData?.getSchoolYearsByRegionId)
  //   }
  // }, [regionId, schoolYearData])

  useEffect(() => {
    if (!schoolLoading && schoolYearData?.getSchoolYearsByRegionId) {
      let schoolYearsArray: Array<DropDownItem> = []
      schoolYearData?.getSchoolYearsByRegionId.map(
        (item: {
          date_begin: string
          date_end: string
          school_year_id: string
          midyear_application: number
          midyear_application_open: string
          midyear_application_close: string
        }) => {
          schoolYearsArray.push({
            label: `${moment(item.date_begin).format('YYYY')} - ${moment(item.date_end).format('YYYY')}`,
            value: item.school_year_id,
          })

          if (item && moment().isAfter(item?.midyear_application_open) && moment().isBefore(item?.midyear_application_close)) {
            schoolYearsArray.push({
              label: `${moment(item.midyear_application_open).format('YYYY')} - ${moment(
                item.midyear_application_close,
              ).format('YYYY')} Mid-year Program`,
              value: `${item.school_year_id}-mid`,
            })
          }
        },
      )
      setSchoolYears(schoolYearsArray)
      setSchoolYearsData(schoolYearData?.getSchoolYearsByRegionId)
    }
  }, [regionId, schoolYearData])

  useEffect(() => {
    parseGrades()
  }, [grades])

  // handle child component
  const questionSortList = (values) => {
    const sortList = values.filter(v =>
      v.slug !== 'program_year' && (!v.mainQuestion && (!v.additional_question
      || (values.find(x => x.slug == v.additional_question)?.response != ''
        && (values.find(x => x.slug == v.additional_question)?.options.find(
          x => x.action == 2 && (x.value == values.find(y => y.slug == v.additional_question)?.response
            || values.find(y => y.slug == v.additional_question)?.response.toString().indexOf(x.value) >= 0)) != null)))) 		// Parent
    );
    return sortList;
  }

  const handleAddQuestion = (value, q) => {
		if(q.type == QUESTION_TYPE.CHECKBOX) {
			if(q.response.indexOf(value) >= 0) {
				q.response = q.response.replace(value, '');
			}
			else {
				q.response += value;
			}
			value = q.response;
		}
		const newValues = questions.map((v) => (v.id == q.id ? {
			...v,
			response: value
		} : v));
		let current = q;
		while(newValues.find(x => current.slug == x.additional_question)
			&& (current.response == '' || current.options.find(x => x.value == current.response
			|| current.response.toString().indexOf(x.value) >= 0).action != 2)) {
			current = newValues.find(x => current.slug == x.additional_question);
			current.response = '';
		}

		setQuestions(
			newValues
		);
	};

  return (
    <Card sx={{ paddingTop: 8, margin: 4 }}>
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
        
        {({ values, errors, isSubmitting, isValid }) => (
          <Form>
            <Box
              // paddingX={36}
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
              <Grid item xs={12} display='flex' justifyContent={'center'}>
                <Box width={'451.53px'}>
                  <Field name='programYear' fullWidth focused>
                    {({ field, form, meta }) => (
                      <Box width={'100%'} display='block'>
                        <DropDown
                          name='programYear'
                          labelTop
                          placeholder="Program Year"
                          dropDownItems={schoolYears}
                          setParentValue={(originalId) => {
                            let id = originalId.toString();
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
                {!questionLoading && questionSortList(questions).length > 0 
                && questionSortList(questions).map((q, index) => {
                  // if (q.slug == 'program_year') {
                  //   return (
                  //       <Grid item xs={12} display='flex' justifyContent={'center'}>
                  //         <Box width={'451.53px'}>
                  //           <Field name='programYear' fullWidth focused>
                  //             {({ field, form, meta }) => (
                  //               <Box width={'100%'} display='block'>
                  //                 <DropDown
                  //                   name='programYear'
                  //                   labelTop
                  //                   placeholder={q.question}
                  //                   dropDownItems={q.options}
                  //                   setParentValue={(originalId) => {
                  //                     const id = originalId.toString();
                  //                     if (id.toString()?.indexOf('mid') > 0) {
                  //                       id = id?.split('-')?.at(0)
                  //                     }
                  //                     form.setFieldValue(field.name, toNumber(id))
                  //                     setGradesAndBirthDateCut(id)
                  //                   }}
                  //                   alternate={true}
                  //                   size='small'
                  //                   sx={!!(meta.touched && meta.error) ? classes.textFieldError : classes.dropdown}
                  //                   error={{
                  //                     error: !!(meta.touched && meta.error),
                  //                     errorMsg: (meta.touched && meta.error) as string,
                  //                   }}
                  //                 />
                  //               </Box>
                  //             )}
                  //           </Field>
                  //         </Box>
                  //       </Grid>                      
                  //   )
                  // }
                  if (q.slug?.includes('student_') || q.student_question) {
                    if (q.slug === 'student_grade_level') {
                      return (
                        <Grid item xs={12} display='flex' justifyContent={'center'}>
                          <Box width={'451.53px'}>
                            <Field name={`students[0].grade_level`} fullWidth focused>
                              {({ field, form, meta }) => (
                                <Box width={'100%'}>
                                  <DropDown
                                    name={`students[0].grade_level`}
                                    labelTop
                                    placeholder={`${q.question} (age) as of ${moment(birthDateCut).format(
                                      'MMM Do YYYY',
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
                        <Grid item xs={12} display='flex' justifyContent={'center'}>
                          <Box width={'451.53px'} display='flex' flexDirection='row' alignItems={'center'}>
                            <Field name={`students[0].${q.slug?.replace('student_', '')}`} fullWidth focused>
                              {({ field, form, meta }) => (
                                <Box width={'100%'}>
                                  <AdditionalQuestionItem question={q} field={field} form={form} meta={meta} handleAddQuestion={handleAddQuestion} />
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
                                  <AdditionalQuestionItem question={q} field={field} form={form} meta={meta} handleAddQuestion={handleAddQuestion}  />
                                </Box>
                              )}
                            </Field>
                          </Box>
                        </Grid>
                      )
                    }
                    else if (!q.slug?.includes('meta_') && q.student_question) {
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
                              name={`students[0].${parentFieldName}.${childFieldName}`}
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
                          </Box>
                        </Grid>
                      )
                    }
                  }
                }
                )}
                <Grid item xs={12} display='flex' justifyContent={'center'}>
                  <Box width={'451.53px'}>
                    <FieldArray name='students'>
                      {({ push, remove }) => (
                        <Grid item container spacing={2} xs={12} sm='auto'>
                          {values.students.map((_, index) => (
                            <>
                              {!questionLoading &&
                                questionSortList(questions).length > 0 &&
                                index > 0 &&
                                questionSortList(questions).map((q) => {
                                  const firstQuestionSlug = questionSortList(questions).filter((qf) => qf.question.includes('student_') || qf.student_question)[0].slug
                                  if (q.slug === 'student_grade_level') {
                                    return (
                                      <Grid item xs={12} 
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
                                                placeholder={`${q.question} (age) as of ${moment(
                                                  birthDateCut,
                                                ).format('MMM Do YYYY')}`}
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
                                        <Box
                                          width={'100%'}
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
                                  }
                                  else if (q.slug?.includes('meta_') && q.student_question) {
                                    return (
                                      <Grid item xs={12}>
                                        <Box
                                          width={'100%'}
                                          display='flex'
                                          flexDirection='row'
                                          alignItems={'center'}
                                        >
                                          <Field
                                            name={`students[${index}].meta.${q.slug}`}
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
                                  }
                                  else if (!q.slug?.includes('meta_') && q.student_question) {
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
