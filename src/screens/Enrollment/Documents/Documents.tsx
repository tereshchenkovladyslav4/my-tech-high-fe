import React, { FormEvent, useCallback, useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Box, Button, Grid, List } from '@mui/material'
import { useFormik } from 'formik'
import { filter, map, omit } from 'lodash'
import * as yup from 'yup'
import { S3FileType } from '@mth/components/DocumentUploadModal/types'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { isNumber } from '@mth/constants'
import { QUESTION_TYPE } from '@mth/enums'
import { FileCategory, MthColor } from '@mth/enums'
import { EnrollmentContext } from '@mth/providers/EnrollmentPacketPrivder/EnrollmentPacketProvider'
import { TabContext, UserContext, UserInfo } from '@mth/providers/UserContext/UserProvider'
import { EnrollmentQuestion } from '@mth/screens/Admin/SiteManagement/EnrollmentSetting/EnrollmentQuestions/types'
import { uploadFile } from '@mth/services'
import { getPacketFiles } from '../../Admin/EnrollmentPackets/services'
import { LoadingScreen } from '../../LoadingScreen/LoadingScreen'
import { useStyles } from '../styles'
import { DocumentUpload } from './components/DocumentUpload/DocumentUpload'
import { deleteDocumentsMutation, enrollmentContactMutation, uploadDocumentMutation } from './service'
import { DocumentsProps, PacketDocument } from './types'

export const Documents: React.FC<DocumentsProps> = ({ id, questions }) => {
  const classes = useStyles

  const { tab, setTab, setVisitedTabs } = useContext(TabContext)
  const { me, setMe } = useContext(UserContext)
  const { setPacketId, disabled, packetId } = useContext(EnrollmentContext)
  const { profile, students } = me as UserInfo
  const student = students?.find((s) => s.student_id === id)
  const fileNamePrefix = `${student?.person.first_name.charAt(0).toUpperCase()}.${student?.person.last_name}`
  const fileIds = map(student?.packets?.at(-1)?.files || [], 'mth_file_id')

  const [dataLoading, setDataLoading] = useState(true)
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const [validationSchema, setValidationSchema] = useState(yup.object({}))
  const [metaData, setMetaData] = useState(
    (student?.packets?.at(-1)?.meta && JSON.parse(student?.packets?.at(-1)?.meta || '')) || {},
  )
  const [filesToUpload, setFilesToUpload] = useState<{ files: File[]; type: string }[]>([])
  const [filesToDelete, setFilesToDelete] = useState<S3FileType[]>([])

  const [packetFiles, setPacketFiles] = useState<S3FileType[]>()
  const [initFormikValues, setInitFormikValues] = useState({})

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initFormikValues,
    validationSchema: validationSchema,
    onSubmit: async () => {
      await goNext()
    },
  })

  const [uploadDocument, { data }] = useMutation(uploadDocumentMutation)
  const [deleteDocuments] = useMutation(deleteDocumentsMutation)
  const [saveEnrollmentContact] = useMutation(enrollmentContactMutation)

  const submitDocuments = async () => {
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
    saveEnrollmentContact({
      variables: {
        enrollmentPacketContactInput: {
          student_id: +id,
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
          school_year_id: student?.current_school_year_status.school_year_id,
        },
      },
    }).then(async (data) => {
      setPacketId(data.data.saveEnrollmentPacketContact.packet.packet_id)
      setMe((prev) => {
        return {
          ...prev,
          profile: {
            ...prev?.profile,
            address: address,
          },
          students: prev?.students?.map((student) => {
            const returnValue = { ...student }
            if (student.student_id === data.data.saveEnrollmentPacketContact.student.student_id) {
              return data.data.saveEnrollmentPacketContact.student
            }
            return returnValue
          }),
        }
      })

      const promises: Promise<boolean>[] = []

      if (filesToDelete.length) {
        promises.push(
          new Promise(async (resolve) => {
            await deleteDocuments({
              variables: {
                deleteEnrollmentPacketDocumentsInput: {
                  packetId: +packetId,
                  mthFileIds: map(filesToDelete, 'file_id'),
                },
              },
            })
            resolve(true)
          }),
        )
      }

      const tempUploads: PacketDocument[] = []
      if (filesToUpload.length > 0) {
        filesToUpload.map((uploadEl) => {
          uploadEl.files?.map((file) => {
            promises.push(
              new Promise(async (resolve) => {
                const res = await uploadFile(file, FileCategory.PACKET)
                if (res.success && res.data?.file.file_id) {
                  tempUploads.push({
                    kind: uploadEl.type,
                    mth_file_id: res.data.file.file_id,
                  })
                }
                resolve(true)
              }),
            )
          })
        })
      }

      if (promises.length) {
        await Promise.all(promises)
        await uploadDocument({
          variables: {
            enrollmentPacketDocumentInput: {
              packet_id: +packetId,
              documents: tempUploads,
            },
          },
        })
      } else {
        setVisitedTabs(Array.from(Array((tab?.currentTab || 0) + 1).keys()))
        setTab({ currentTab: (tab?.currentTab || 0) + 1 })
        window.scrollTo(0, 0)
      }
    })
  }

  const { loading, data: fileData } = useQuery(getPacketFiles, {
    variables: {
      fileIds: fileIds?.toString() || '',
    },
    skip: !fileIds?.length,
    fetchPolicy: 'network-only',
  })

  const nextTab = (e: FormEvent<HTMLFormElement>) => {
    setIsSubmit(true)
    e.preventDefault()
    setTab({ currentTab: (tab?.currentTab || 0) + 1 })
    window.scrollTo(0, 0)
  }

  const goNext = async () => {
    setIsSubmit(true)
    let validDoc = true
    questions?.groups[0]?.questions?.map((item) => (validDoc = validDoc && checkValidate(item)))
    if (validDoc) {
      await submitDocuments()
    }
  }

  const submitRecord = useCallback(
    (documentType: string, files: File[]) => {
      if (files?.length) {
        setFilesToUpload([...filesToUpload, { files: files, type: documentType }])
      }
    },
    [filesToUpload],
  )

  const checkValidate = (item: EnrollmentQuestion) => {
    if (item) {
      if (item.required && specialEdStatus(item)) {
        const exist = !!packetFiles?.filter((file) =>
          file.name.includes(`${fileNamePrefix}${item.options?.[0]?.label}`),
        )?.length
        const upload = filesToUpload?.filter((file) => file.type === item.question).length > 0
        return exist || upload
      } else {
        return true
      }
    }
    return false
  }

  const questionsArr = questions?.groups[0]?.questions?.map((q) => {
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

  const specialEdStatus = (item: EnrollmentQuestion) => {
    const specialResponseMeta = formik?.values?.packet?.meta
    const specialResponse = specialResponseMeta ? JSON.parse(specialResponseMeta) : {}
    const slug = item.options?.[0]?.label?.trim()
    if (slug === 'sped') {
      return !!(specialResponse && (specialResponse.meta_special_education || 0) !== 0)
    } else {
      return true
    }
  }

  useEffect(() => {
    const initMeta = { ...metaData }
    if (questions?.groups?.length > 0) {
      const valid_student: { [key: string]: object } = {}
      const valid_parent: { [key: string]: object } = {}
      const valid_meta: { [key: string]: object } = {}
      const valid_address: { [key: string]: object } = {}
      const valid_packet: { [key: string]: object } = {}
      questions.groups.map((g) => {
        g.questions.map((q) => {
          if (q.type !== QUESTION_TYPE.UPLOAD && q.type !== QUESTION_TYPE.INFORMATION) {
            if (q.slug?.includes('student_')) {
              const slug = `${q.slug?.replace('student_', '')}`
              if (q.required) {
                if (q.slug?.toLocaleLowerCase().includes('emailconfirm')) {
                  valid_student[slug] = yup
                    .string()
                    .nullable()
                    .required('Required')
                    .oneOf([yup.ref('email')], 'Emails do not match')
                } else if (q.validation === 1) {
                  valid_student[slug] = yup.string().required('Required').nullable()
                } else if (q.validation === 2) {
                  valid_student[slug] = yup
                    .string()
                    .required('Required')
                    .test(`${q.question}-selected`, `${q.question} is invalid`, (value) => {
                      return !!value && isNumber.test(value)
                    })
                } else if (q.type === QUESTION_TYPE.CHECKBOX || q.type === QUESTION_TYPE.AGREEMENT) {
                  valid_student[slug] = yup.array().min(1, 'Required').required('Required').nullable()
                } else {
                  valid_student[slug] = yup.string().required('Required').nullable()
                }
              }
            } else if (q.slug?.includes('parent_')) {
              const slug = `${q.slug?.replace('parent_', '')}`
              if (q.required) {
                if (q.slug?.toLocaleLowerCase().includes('emailconfirm')) {
                  valid_parent[slug] = yup
                    .string()
                    .nullable()
                    .required('Required')
                    .oneOf([yup.ref('email')], 'Emails do not match')
                } else if (q.validation === 1) {
                  valid_parent[slug] = yup.string().email('Enter a valid email').required('Required').nullable()
                } else if (q.validation === 2) {
                  valid_parent[slug] = yup
                    .string()
                    .required('Required')
                    .test(`${q.question}-selected`, `${q.question} is invalid`, (value) => {
                      return !!value && isNumber.test(value)
                    })
                } else if (q.type === QUESTION_TYPE.CHECKBOX || q.type === QUESTION_TYPE.AGREEMENT) {
                  valid_parent[slug] = yup.array().min(1, 'Required').required('Required').nullable()
                } else {
                  valid_parent[slug] = yup.string().required('Required').nullable()
                }
              }
            } else if (q.slug?.includes('meta_') && q.required && !q.additional_question) {
              const slug = q.slug
              if (!initMeta[slug]) {
                initMeta[q.slug] = ''
              }
              if (q.validation === 1) {
                valid_meta[slug] = yup.string().required('Required').nullable()
              } else if (q.validation === 2) {
                valid_meta[slug] = yup
                  .string()
                  .required('Required')
                  .test(`${q.question}-selected`, `${q.question} is invalid`, (value) => {
                    return !!value && isNumber.test(value)
                  })
              } else if (q.type === QUESTION_TYPE.CHECKBOX) {
                valid_meta[slug] = yup.array().min(1, 'Required').required('Required').nullable()
              } else if (q.type === QUESTION_TYPE.AGREEMENT) {
                valid_meta[slug] = yup.array().min(1, 'Required').required('Required').nullable()
              } else {
                valid_meta[slug] = yup.string().required('Required').nullable()
              }
            } else if (q.slug?.includes('address_') && q.required) {
              const slug = `${q.slug?.replace('address_', '')}`
              valid_address[slug] = yup.string().required('Required').nullable()
            } else if (q.slug?.includes('packet_') && q.required) {
              const slug = `${q.slug?.replace('packet_', '')}`
              valid_packet[slug] = yup.string().required('Required').nullable()
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

  useEffect(() => {
    setInitFormikValues({
      parent: { ...profile, phone_number: profile?.phone?.number, emailConfirm: profile?.email },
      student: {
        ...student?.person,
        phone_number: student?.person.phone?.number,
        grade_levels: student?.grade_levels,
        grade_level: student?.current_school_year_status.grade_level,
        emailConfirm: student?.person.email,
      },
      packet: { ...student?.packets?.at(-1) },
      meta: metaData,
      address: { ...profile?.address },
      school_year_id: student?.current_school_year_status.school_year_id,
    })
  }, [profile, student, metaData])

  useEffect(() => {
    if (data) {
      setMe((prev) => {
        return {
          ...prev,
          students: prev?.students?.map((student) => {
            const returnValue = { ...student }
            if (student.student_id === data.saveEnrollmentPacketDocument.student.student_id) {
              return data.saveEnrollmentPacketDocument.student
            }
            return returnValue
          }),
        }
      })
      setVisitedTabs(Array.from(Array((tab?.currentTab || 0) + 1).keys()))
      setTab({ currentTab: (tab?.currentTab || 0) + 1 })
      window.scrollTo(0, 0)
    }
  }, [data])

  useEffect(() => {
    setDataLoading(false)
  }, [packetFiles])

  useEffect(() => {
    if (!loading && fileData !== undefined) {
      setPacketFiles(fileData.packetFiles.results)
    }
  }, [loading])

  return !dataLoading ? (
    <form onSubmit={(e) => (!disabled ? formik.handleSubmit(e) : nextTab(e))}>
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12}>
          <List>
            {questionsLists?.map(
              (item, index) =>
                specialEdStatus(item[0]) && (
                  <Grid item xs={12} marginTop={4} key={index}>
                    <DocumentUpload
                      disabled={!!disabled}
                      item={item}
                      formik={formik}
                      handleUpload={submitRecord}
                      files={(packetFiles || [])
                        .filter((file) => file.name.includes(`${fileNamePrefix}${item[0]?.options?.[0]?.label}`))
                        .sort((a, b) => Number(b.file_id) - Number(a.file_id))}
                      handleDelete={(file: S3FileType) => {
                        setPacketFiles(filter(packetFiles, (validFile) => validFile !== file))
                        setFilesToDelete((prev) => prev.concat(file))
                      }}
                      fileName={`${fileNamePrefix}${item[0]?.options?.[0]?.label}`}
                    />
                    {item[0].type === QUESTION_TYPE.UPLOAD && !checkValidate(item[0]) && !disabled && isSubmit && (
                      <Paragraph color={MthColor.RED} size='medium' fontWeight='700' sx={{ marginLeft: '12px' }}>
                        Required
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
