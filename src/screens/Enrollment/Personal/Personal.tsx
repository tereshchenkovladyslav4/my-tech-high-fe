import React, { useContext, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Grid, Box, Button } from '@mui/material'
import { useFormik } from 'formik'
import { omit } from 'lodash'
import * as yup from 'yup'
import { QUESTION_TYPE } from '../../../components/QuestionItem/QuestionItemProps'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { EnrollmentContext } from '../../../providers/EnrollmentPacketPrivder/EnrollmentPacketProvider'
import { TabContext, UserContext, UserInfo } from '../../../providers/UserContext/UserProvider'
import { isNumber } from '../../../utils/stringHelpers'
import { GroupItem } from '../Group'
import { useStyles } from '../styles'
import { enrollmentContactMutation } from './service'
import { PersonalTemplateType } from './types'

export const Personal: PersonalTemplateType = ({ id, questions }) => {
  const { tab, setTab, setVisitedTabs } = useContext(TabContext)
  const classes = useStyles

  const { me, setMe } = useContext(UserContext)
  const { setPacketId, disabled } = useContext(EnrollmentContext)
  const { profile, students } = me as UserInfo

  const student = students.find((s) => s.student_id === id)

  const [metaData, setMetaData] = useState(
    (student.packets.at(-1)?.meta && JSON.parse(student.packets.at(-1)?.meta)) || {},
  )

  const [validationSchema, setValidationSchema] = useState(yup.object({}))
  const [submitPersonalMutation] = useMutation(enrollmentContactMutation)

  useEffect(() => {
    const initMeta = { ...metaData }
    if (questions?.groups?.length > 0) {
      const valid_student = {}
      const valid_parent = {}
      const valid_meta = {}
      const valid_address = {}
      const valid_packet = {}
      questions.groups.map((g) => {
        g.questions.map((q) => {
          if (q.type !== QUESTION_TYPE.UPLOAD && q.type !== QUESTION_TYPE.INFORMATION) {
            if (q.slug?.includes('student_')) {
              if (q.required) {
                if (q.slug?.toLocaleLowerCase().includes('emailconfirm')) {
                  valid_student[`${q.slug?.replace('student_', '')}`] = yup
                    .string()
                    .required('Required')
                    .oneOf([yup.ref('email')], 'Emails do not match')
                } else if (q.validation === 1) {
                  valid_student[`${q.slug?.replace('student_', '')}`] = yup
                    .string()
                    .email('Enter a valid email')
                    .required('Required')
                    .nullable()
                } else if (q.validation === 2) {
                  valid_student[`${q.slug?.replace('student_', '')}`] = yup
                    .string()
                    .required('Required')
                    .test(`${q.question}-selected`, `${q.question} is invalid`, (value) => {
                      return isNumber.test(value)
                    })
                } else if (q.type === QUESTION_TYPE.CHECKBOX || q.type === QUESTION_TYPE.AGREEMENT) {
                  valid_student[`${q.slug?.replace('student_', '')}`] = yup
                    .array()
                    .min(1, 'Required')
                    .required('Required')
                    .nullable()
                } else {
                  valid_student[`${q.slug?.replace('student_', '')}`] = yup.string().required('Required').nullable()
                }
              }
            } else if (q.slug?.includes('parent_')) {
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
                    .nullable()
                } else if (q.validation === 2) {
                  valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                    .string()
                    .required('Required')
                    .test(`${q.question}-selected`, `${q.question} is invalid`, (value) => {
                      return isNumber.test(value)
                    })
                } else if (q.type === QUESTION_TYPE.CHECKBOX || q.type === QUESTION_TYPE.AGREEMENT) {
                  valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                    .array()
                    .min(1, 'Required')
                    .required('Required')
                    .nullable()
                } else {
                  valid_parent[`${q.slug?.replace('parent_', '')}`] = yup.string().required('Required').nullable()
                }
              }
            } else if (q.slug?.includes('meta_') && q.required && !q.additional_question) {
              if (!initMeta[q.slug]) {
                initMeta[q.slug] = ''
              }
              if (q.validation === 1) {
                valid_meta[`${q.slug}`] = yup.string().email('Enter a valid email').required('Required').nullable()
              } else if (q.validation === 2) {
                valid_meta[`${q.slug}`] = yup
                  .string()
                  .required('Required')
                  .test(`${q.question}-selected`, `${q.question} is invalid`, (value) => {
                    return isNumber.test(value)
                  })
              } else if (q.type === 3 || q.type === 4) {
                valid_meta[`${q.slug}`] = yup.array().min(1, 'Required').required('Required').nullable()
              } else if (q.type === QUESTION_TYPE.CHECKBOX) {
                valid_meta[`${q.slug}`] = yup.array().min(1, 'Required').required('Required').nullable()
              } else if (q.type === QUESTION_TYPE.AGREEMENT) {
                valid_meta[`${q.slug}`] = yup.array().min(1, 'Required').required('Required').nullable()
              } else {
                valid_meta[`${q.slug}`] = yup.string().required('Required').nullable()
              }
            } else if (q.slug?.includes('address_') && q.required) {
              valid_address[`${q.slug?.replace('address_', '')}`] = yup.string().required('Required').nullable()
            } else if (q.slug?.includes('packet_') && q.required) {
              valid_packet[`${q.slug?.replace('packet_', '')}`] = yup.string().required('Required').nullable()
            }
          }
        })
      })

      setMetaData(initMeta)

      setValidationSchema(
        yup.object({
          parent: yup.object(valid_parent),
          student: yup.object(valid_student),
          meta: yup.object(valid_meta),
          address: yup.object(valid_address),
          packet: yup.object(valid_packet),
        }),
      )
    }
  }, [questions])

  const [initFormikValues, setInitFormikValues] = useState({})

  useEffect(() => {
    setInitFormikValues({
      parent: { ...profile, phone_number: profile.phone.number, emailConfirm: profile.email },
      student: {
        ...student.person,
        phone_number: student.person.phone.number,
        grade_levels: student.grade_levels,
        grade_level: student.current_school_year_status.grade_level,
        emailConfirm: student.person.email,
      },
      packet: { ...student.packets.at(-1) },
      meta: metaData,
      address: { ...profile.address },
      school_year_id: student.current_school_year_status.school_year_id,
    })
  }, [profile, student, metaData])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initFormikValues,
    validationSchema: validationSchema,
    onSubmit: () => {
      goNext()
    },
  })

  const submitPersonal = async () => {
    const address = { ...formik.values.address }
    if (address.address_id) {
      address.address_id = parseInt(address.address_id)
    }
    if (address.state) {
      address.state = address.state + ''
    }
    if (address.country_id) {
      address.country_id = address.country_id + ''
    }
    submitPersonalMutation({
      variables: {
        enrollmentPacketContactInput: {
          student_id: parseInt(id as unknown as string),
          parent: omit(formik.values.parent, ['address', 'person_id', 'phone', 'emailConfirm']),
          packet: {
            secondary_contact_first: formik.values.packet?.secondary_contact_first || '',
            secondary_contact_last: formik.values.packet?.secondary_contact_last || '',
            school_district: formik.values.packet?.school_district || '',
            meta: JSON.stringify(formik.values.meta),
          },
          student: {
            ...omit(formik.values.student, ['person_id', 'photo', 'phone', 'grade_levels', 'emailConfirm']),
            address: address,
          },
          school_year_id: student.current_school_year_status.school_year_id,
        },
      },
    }).then((data) => {
      setPacketId(data.data.saveEnrollmentPacketContact.packet.packet_id)
      setMe((prev) => {
        return {
          ...prev,
          profile: {
            ...prev.profile,
            address: address,
          },
          students: prev?.students.map((student) => {
            const returnValue = { ...student }
            if (student.student_id === data.data.saveEnrollmentPacketContact.student.student_id) {
              return data.data.saveEnrollmentPacketContact.student
            }
            return returnValue
          }),
        }
      })
      setTab({
        currentTab: tab.currentTab + 1,
      })
      setVisitedTabs(Array.from(Array(tab.currentTab + 1).keys()))
      window.scrollTo(0, 0)
    })
  }
  const goNext = async () => {
    await submitPersonal()
  }

  const nextTab = (e) => {
    e.preventDefault()
    setTab({
      currentTab: tab.currentTab + 1,
    })
    window.scrollTo(0, 0)
  }

  return (
    <form onSubmit={(e) => (!disabled ? formik.handleSubmit(e) : nextTab(e))}>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {questions?.groups?.map((item, index) => (
          <GroupItem key={index} group={item} formik={formik} />
        ))}
        <Box sx={classes.buttonContainer}>
          <Button sx={classes.button} type='submit'>
            <Paragraph fontWeight='700' size='medium'>
              {disabled ? 'Next' : 'Save & Continue'}
            </Paragraph>
          </Button>
        </Box>
      </Grid>
    </form>
  )
}
