import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { List, Button } from '@mui/material'
import { Box, Grid } from '@mui/material'
import { useFormik } from 'formik'
import { omit } from 'lodash'
import * as yup from 'yup'
import { QUESTION_TYPE } from '../../../components/QuestionItem/QuestionItemProps'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { EnrollmentContext } from '../../../providers/EnrollmentPacketPrivder/EnrollmentPacketProvider'
import { TabContext, UserContext, UserInfo } from '../../../providers/UserContext/UserProvider'
import { RED } from '../../../utils/constants'
import { isNumber } from '../../../utils/stringHelpers'
import { getPacketFiles } from '../../Admin/EnrollmentPackets/services'
import { LoadingScreen } from '../../LoadingScreen/LoadingScreen'
import { useStyles } from '../styles'
import { DocumentUpload } from './components/DocumentUpload/DocumentUpload'
import { S3FileType } from './components/DocumentUploadModal/types'
import { uploadDocumentMutation, enrollmentContactMutation } from './service'
import { DocuementsTemplateType } from './types'

export const Documents: DocuementsTemplateType = ({ id, questions }) => {
  const classes = useStyles
  const { tab, setTab, setVisitedTabs } = useContext(TabContext)

  const { me, setMe } = useContext(UserContext)
  const { setPacketId, disabled, packetId } = useContext(EnrollmentContext)
  const { profile, students } = me as UserInfo

  const student = students.find((s) => s.student_id === id)

  const [validationSchema, setValidationSchema] = useState(yup.object({}))
  // const [submitPersonalMutation, { data }] = useMutation(enrollmentContactMutation)

  useEffect(() => {
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
                    .required('Email is required')
                    .oneOf([yup.ref('email')], 'Emails do not match')
                } else if (q.validation === 1) {
                  valid_student[`${q.slug?.replace('student_', '')}`] = yup
                    .string()
                    .email('Enter a valid email')
                    .required('Email is required')
                    .nullable()
                } else if (q.validation === 2) {
                  valid_student[`${q.slug?.replace('student_', '')}`] = yup
                    .string()
                    .required(`${q.question} is required`)
                    .test(`${q.question}-selected`, `${q.question} is invalid`, (value) => {
                      return isNumber.test(value)
                    })
                } else if (q.type === QUESTION_TYPE.CHECKBOX || q.type === QUESTION_TYPE.AGREEMENT) {
                  valid_student[`${q.slug?.replace('student_', '')}`] = yup
                    .array()
                    .min(1)
                    .required(`${q.question} is required`)
                    .nullable()
                } else {
                  valid_student[`${q.slug?.replace('student_', '')}`] = yup
                    .string()
                    .required(`${q.question} is required`)
                    .nullable()
                }
              }
            } else if (q.slug?.includes('parent_')) {
              if (q.required) {
                if (q.slug?.toLocaleLowerCase().includes('emailconfirm')) {
                  valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                    .string()
                    .required('Email is required')
                    .oneOf([yup.ref('email')], 'Emails do not match')
                } else if (q.validation === 1) {
                  valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                    .string()
                    .email('Enter a valid email')
                    .required('Email is required')
                    .nullable()
                } else if (q.validation === 2) {
                  valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                    .string()
                    .required(`${q.question} is required`)
                    .test(`${q.question}-selected`, `${q.question} is invalid`, (value) => {
                      return isNumber.test(value)
                    })
                } else if (q.type === QUESTION_TYPE.CHECKBOX || q.type === QUESTION_TYPE.AGREEMENT) {
                  valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                    .array()
                    .min(1)
                    .required(`${q.question} is required`)
                    .nullable()
                } else {
                  valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                    .string()
                    .required(`${q.question} is required`)
                    .nullable()
                }
              }
            } else if (q.slug?.includes('meta_') && q.required && !q.additional_question) {
              if (q.validation === 1) {
                valid_meta[`${q.slug}`] = yup
                  .string()
                  .email('Enter a valid email')
                  .required('Email is required')
                  .nullable()
              } else if (q.validation === 2) {
                valid_meta[`${q.slug}`] = yup
                  .string()
                  .required(`${q.question} is required`)
                  .test(`${q.question}-selected`, `${q.question} is invalid`, (value) => {
                    return isNumber.test(value)
                  })
              } else if (q.type === QUESTION_TYPE.CHECKBOX) {
                valid_meta[`${q.slug}`] = yup.array().min(1).required(`${q.question} is required`).nullable()
              } else if (q.type === QUESTION_TYPE.AGREEMENT) {
                valid_meta[`${q.slug}`] = yup
                  .array()
                  .min(1)
                  .required(`${q.question.replace(/<[^>]+>/g, '')} is required`)
                  .nullable()
              } else {
                valid_meta[`${q.slug}`] = yup.string().required(`${q.question} is required`).nullable()
              }
            } else if (q.slug?.includes('address_') && q.required) {
              valid_address[`${q.slug?.replace('address_', '')}`] = yup
                .string()
                .required(`${q.question} is required`)
                .nullable()
            } else if (q.slug?.includes('packet_') && q.required) {
              valid_packet[`${q.slug?.replace('packet_', '')}`] = yup
                .string()
                .required(`${q.question} is required`)
                .nullable()
            }
          }
        })
      })

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

  const [submitDocumentMutation] = useMutation(enrollmentContactMutation)

  const [filesToUpload, setFilesToUpload] = useState([])

  const submitDocuments = async () => {
    submitDocumentMutation({
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
            address: formik.values.address,
          },
          school_year_id: student.current_school_year_status.school_year_id,
        },
      },
    }).then(async (data) => {
      setPacketId(data.data.saveEnrollmentPacketContact.packet.packet_id)
      setMe((prev) => {
        return {
          ...prev,
          students: prev?.students.map((student) => {
            const returnValue = { ...student }
            if (student.student_id === data.data.saveEnrollmentPacketContact.student.student_id) {
              return data.data.saveEnrollmentPacketContact.student
            }
            return returnValue
          }),
        }
      })
      if (filesToUpload.length > 0) {
        const tempUploads = []
        await Promise.all(
          filesToUpload.map(async (uploadEl) => {
            const bodyFormData = new FormData()
            if (uploadEl.file) {
              bodyFormData.append('file', uploadEl.file[0])
              bodyFormData.append('region', 'UT')
              bodyFormData.append('year', '2022')
              const res = await fetch(import.meta.env.SNOWPACK_PUBLIC_S3_URL, {
                method: 'POST',
                body: bodyFormData,
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('JWT')}`,
                },
              })
              const { data } = await res.json()
              tempUploads.push({
                kind: uploadEl.type,
                mth_file_id: data?.file.file_id,
              })
            }
          }),
        )
        setDocuments(tempUploads)
      } else {
        setVisitedTabs(Array.from(Array(tab.currentTab + 1).keys()))
        setTab({
          currentTab: tab.currentTab + 1,
        })
        window.scrollTo(0, 0)
      }
    })
  }

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
      meta: (student.packets.at(-1)?.meta && JSON.parse(student.packets.at(-1)?.meta)) || {},
      address: { ...student.person.address },
      school_year_id: student.current_school_year_status.school_year_id,
    })
  }, [profile, student])
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initFormikValues,
    validationSchema: validationSchema,
    onSubmit: () => {
      goNext()
    },
  })

  const [files, setFiles] = useState<S3FileType[]>()

  const [uploadDocument, { data }] = useMutation(uploadDocumentMutation)

  useEffect(() => {
    if (data) {
      // if(!missingInfo){
      setMe((prev) => {
        return {
          ...prev,
          students: prev?.students.map((student) => {
            const returnValue = { ...student }
            if (student.student_id === data.saveEnrollmentPacketDocument.student.student_id) {
              return data.saveEnrollmentPacketDocument.student
            }
            return returnValue
          }),
        }
      })
      setVisitedTabs(Array.from(Array(tab.currentTab + 1).keys()))
      setTab({
        currentTab: tab.currentTab + 1,
      })
      window.scrollTo(0, 0)
      // }else{

      // }
    } else {
      console.log('packet file store fail')
    }
  }, [data])

  const [fileIds, setFileIds] = useState<string[]>()

  useEffect(() => {
    const temp = []
    student.packets.at(-1).files.map((f) => {
      temp.push(f?.mth_file_id)
    })
    setFileIds(temp)
  }, student.packets)

  const { loading, data: fileData } = useQuery(getPacketFiles, {
    variables: {
      fileIds: fileIds?.toString() || '',
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && fileData !== undefined) {
      setFiles(fileData.packetFiles.results)
    }
  }, [loading])

  const [dataLoading, setDataLoading] = useState(true)

  const isLoading = () => {
    // if(disabled){
    //   if(files?.length > 0){
    //     setDataLoading(false)
    //   }
    // } else{
    //   setDataLoading(false)
    // }
    setDataLoading(false)
  }

  useEffect(() => {
    isLoading()
  }, [files])

  const nextTab = (e) => {
    e.preventDefault()
    setTab({
      currentTab: tab.currentTab + 1,
    })
    window.scrollTo(0, 0)
  }

  const [documents, setDocuments] = useState([])

  const goNext = async () => {
    let validDoc = true
    questions?.groups[0]?.questions.map((item) => (validDoc = validDoc && checkValidate(item)))
    if (validDoc) {
      await submitDocuments()
    }
  }

  useEffect(() => {
    if (documents?.length > 0) {
      uploadDocument({
        variables: {
          enrollmentPacketDocumentInput: {
            packet_id: parseFloat(packetId as unknown as string),
            documents,
          },
        },
      })
    }
  }, [documents])

  const submitRecord = useCallback(
    (documentType: string, file: File) => {
      if (file) {
        setFilesToUpload([...filesToUpload, { file: file, type: documentType }])
      }
    },
    [filesToUpload],
  )

  const checkValidate = (item) => {
    if (item) {
      if (item.required && specialEdStatus(item)) {
        const exist =
          files?.filter((file) =>
            file.name.includes(
              `${student.person.first_name.charAt(0).toUpperCase()}.${student.person.last_name}${
                item.options[0]?.label
              }`,
            ),
          ).length > 0
            ? true
            : false
        const upload = filesToUpload?.filter((file) => file.type === item.question).length > 0 ? true : false
        return exist || upload
      } else {
        return true
      }
    }
    return false
  }
  const questionsArr = questions?.groups[0]?.questions.map((q) => {
    let current = q,
      child
    const arr = [q]

    while ((child = questions?.groups[0]?.questions.find((x) => x.additional_question == current.slug))) {
      arr.push(child)
      current = child
    }
    return arr
  })
  const questionsLists = questionsArr.filter((item) => !item[0].additional_question)

  const specialEdStatus = (item) => {
    const specialResponseMeta = formik?.values?.packet?.meta
    const specialResponse = specialResponseMeta ? JSON.parse(specialResponseMeta) : {}
    const slug = item.options[0]?.label?.trim()
    if (slug === 'sped') {
      if (specialResponse && specialResponse.meta_special_education !== 'None') {
        return true
      }
      return false
    } else {
      return true
    }
  }
  return !dataLoading ? (
    <form onSubmit={(e) => (!disabled ? formik.handleSubmit(e) : nextTab(e))}>
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12}>
          <List>
            {questionsLists.map(
              (item, index) =>
                specialEdStatus(item[0]) && (
                  <Grid item xs={12} marginTop={4} key={index}>
                    <DocumentUpload
                      disabled={disabled}
                      item={item}
                      formik={formik}
                      handleUpload={submitRecord}
                      file={
                        files &&
                        files
                          .filter((file) =>
                            file.name.includes(
                              `${student.person.first_name.charAt(0).toUpperCase()}.${student.person.last_name}${
                                item[0].options[0]?.label
                              }`,
                            ),
                          )
                          .sort((a, b) => b.file_id - a.file_id)
                      }
                      firstName={student.person.first_name}
                      lastName={student.person.last_name}
                    />
                    {item[0].type === QUESTION_TYPE.UPLOAD && !checkValidate(item[0]) && !disabled && (
                      <Paragraph color={RED} size='medium' fontWeight='700' sx={{ marginLeft: '12px' }}>
                        File is required
                      </Paragraph>
                    )}
                  </Grid>
                ),
            )}
          </List>
        </Grid>
        <Box sx={classes.buttonContainer}>
          <Button sx={classes.button} type='submit'>
            <Paragraph fontWeight='700' size='medium'>
              {disabled ? 'Next' : 'Save & Continue'}
            </Paragraph>
          </Button>
        </Box>
      </Grid>
    </form>
  ) : (
    <LoadingScreen />
  )
}
