import React, { useContext, useEffect, useState } from 'react'
import { Grid, Box, Button } from '@mui/material'
import { TabContext, UserContext, UserInfo } from '../../../providers/UserContext/UserProvider'
import GroupItem from '../Group'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { useStyles } from '../styles'
import { useFormik } from 'formik'
import moment from 'moment'
import { EnrollmentContext } from '../../../providers/EnrollmentPacketPrivder/EnrollmentPacketProvider'
import { enrollmentContactMutation } from './service'
import { omit } from 'lodash';
import { useMutation, useQuery } from '@apollo/client'
import { isPhoneNumber, isNumber } from '../../../utils/stringHelpers'
import * as yup from 'yup';

export default function ContactNew({id, questions}) {
  const { me, setMe } = useContext(UserContext)
  const { tab, setTab, visitedTabs, setVisitedTabs } = useContext(TabContext)
  const { setPacketId, disabled } = useContext(EnrollmentContext)
  const { profile, students } = me as UserInfo

  const student = students.find((s) => s.student_id === id)

  const classes = useStyles

  const [validationSchema, setValidationSchema] = useState(yup.object({}))

  useEffect(() => {
    if(questions?.groups?.length > 0) {
      let valid_student = {}
      let valid_parent = {}
      let valid_meta = {}
      questions.groups.map((g) => {
        g.questions.map((q) => {
          if(q.slug?.includes('student_')) {
            if(q.required) {
              if(q.slug?.toLocaleLowerCase().includes('emailconfrim')) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup
                    .string()
                    .required('Email is required')
                    .oneOf([yup.ref('email')], 'Emails do not match')
              }
              else if(q.type === 3 || q.type === 4) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup.array().min(1).required(`${q.question} is required`)
              }
              else {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup.string().required(`${q.question} is required`)
              }
            }
          }
          else if(q.slug?.includes('parent_')) {
            if(q.required) {
              if(q.slug?.toLocaleLowerCase().includes('emailconfirm')) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                    .string()
                    .required('Email is required')
                    .oneOf([yup.ref('email')], 'Emails do not match')
              }
              else if(q.validation === 1) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup.string().email('Enter a valid email').required('Email is required')
              }
              else if(q.validation === 2) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup.string()
                .required(`${q.question} is required`)
                .test(`${q.question}-selected`, `${q.question} is invalid`, (value) => {
                  return isNumber.test(value)
                })
              }
              else if(q.type === 3 || q.type === 4) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup.array().min(1).required(`${q.question} is required`)
              }
              else {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup.string().required(`${q.question} is required`)
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
            else if(q.type === 3 || q.type === 4) {
              valid_meta[`${q.slug}`] = yup.array().min(1).required(`${q.question} is required`)
            }
            else {
              valid_meta[`${q.slug}`] = yup.string().required(`${q.question} is required`)
            }
          }
        })
      })
      
      setValidationSchema(yup.object({parent: yup.object(valid_parent), students: yup.array(yup.object(valid_student)), meta: yup.object(valid_meta)}))
    }
  }, [questions])

  const [submitContactMutation, { data }] = useMutation(enrollmentContactMutation)
  
  const formik = useFormik({
    initialValues: {
      parent: {...profile, phone_number: profile.phone.number},
      student: {...student.person, phone_number: student.person.phone.number},
      packet: student.packets.at(-1),
      meta: student.packets.at(-1)?.meta && JSON.parse(student.packets.at(-1)?.meta) || {},
      address: student.person.address,
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      goNext()
    },
  })

  const submitContact = async () => {
    submitContactMutation({
      variables: {
        enrollmentPacketContactInput: {
          student_id: parseInt(id as unknown as string),
            parent: omit(formik.values.parent, ['address', 'person_id', 'phone', 'emailConfirm']),
            packet: {
              secondary_contact_first: formik.values.packet?.secondary_contact_first || '', 
              secondary_contact_last: formik.values.packet?.secondary_contact_last || '', 
              school_district: formik.values.packet?.school_district || '',
              meta: JSON.stringify(formik.values.meta)},
            student: {
              ...omit(formik.values.student, ['person_id', 'photo', 'phone', 'grade_levels']),
              address: formik.values.address,              
            },
            school_year_id: student.current_school_year_status.school_year_id,
        }
      }
    }).then((data) => {
      setPacketId(data.data.saveEnrollmentPacketContact.packet.packet_id)
      setMe((prev) => {
        return {
          ...prev,
          profile: {
            ...prev.profile,
            ...formik.values.parent,
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
    })
  }
  const goNext = async () => {
      await submitContact()
        .then(() => {
          setTab({
            currentTab: tab.currentTab + 1
          })
          setVisitedTabs(Array.from(Array(tab.currentTab + 1).keys()))      
          window.scrollTo(0, 0)
        })
    }

  const nextTab = (e) => {
    e.preventDefault()
    setTab({
      currentTab: tab.currentTab + 1
    })
    window.scrollTo(0, 0)
  }

  return (
      <form onSubmit={(e) => !disabled ? formik.handleSubmit(e) : nextTab(e)}>
          <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              {questions?.groups?.map((item, index) => (
                  <GroupItem key={index} group={item} formik={formik}/>
              ))}
              <Box sx={classes.buttonContainer}>
                  <Button
                    sx={classes.button}
                    type='submit'
                  >
                      <Paragraph fontWeight='700' size='medium'>
                      {disabled ? 'Next' : 'Save & Continue'}
                      </Paragraph>
                  </Button>
              </Box>
          </Grid>
      </form>        
  )
}