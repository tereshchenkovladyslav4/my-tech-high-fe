import React, { FormEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Box, Button, Grid, List } from '@mui/material'
import { useFormik } from 'formik'
import { filter, map, omit } from 'lodash'
import * as yup from 'yup'
import { AnySchema } from 'yup'
import { S3FileType } from '@mth/components/DocumentUploadModal/types'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { isNumber } from '@mth/constants'
import { EmailTemplateEnum, PacketStatus, QUESTION_TYPE } from '@mth/enums'
import { FileCategory, MthColor } from '@mth/enums'
import { getEmailTemplateQuery } from '@mth/graphql/queries/email-template'
import { Address, EmailTemplate, EnrollmentPacket, Packet, Person, Student } from '@mth/models'
import { EnrollmentContext } from '@mth/providers/EnrollmentPacketPrivder/EnrollmentPacketProvider'
import { TabContext, UserContext, UserInfo } from '@mth/providers/UserContext/UserProvider'
import { getPacketFiles } from '@mth/screens/Admin/EnrollmentPackets/services'
import { EnrollmentQuestion } from '@mth/screens/Admin/SiteManagement/EnrollmentSetting/EnrollmentQuestions/types'
import { DocumentUpload } from '@mth/screens/Enrollment/Documents/components/DocumentUpload/DocumentUpload'
import { LoadingScreen } from '@mth/screens/LoadingScreen/LoadingScreen'
import { uploadFile } from '@mth/services'
import { getRegionCode } from '@mth/utils'
import { useStyles } from '../styles'
import { deleteDocumentsMutation, enrollmentContactMutation, uploadDocumentMutation } from './service'
import { DocumentsProps, PacketDocument } from './types'

export const Documents: React.FC<DocumentsProps> = ({ id, regionId, questions }) => {
  const classes = useStyles

  const { tab, setTab, setVisitedTabs } = useContext(TabContext)
  const { me, setMe } = useContext(UserContext)
  const { setPacketId, disabled, packetId } = useContext(EnrollmentContext)
  const { profile, students } = me as UserInfo
  const student = useMemo(() => students?.find((s) => Number(s.student_id) === Number(id)), [id, students])
  const packet = useMemo(() => student?.packets?.at(-1), [student?.packets])
  const fileNamePrefix = useMemo(
    () => `${student?.person.first_name.charAt(0).toUpperCase()}.${student?.person.last_name}`,
    [student?.person.first_name, student?.person.last_name],
  )
  const { data: emailTemplateData } = useQuery<{ emailTemplateName: EmailTemplate }>(getEmailTemplateQuery, {
    variables: {
      regionId: regionId,
      template: EmailTemplateEnum.MISSING_INFORMATION,
    },
    skip: !regionId,
    fetchPolicy: 'network-only',
  })
  const [dataLoading, setDataLoading] = useState(true)
  const [fileIds, setFileIds] = useState<string>('')
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const [validationSchema, setValidationSchema] = useState(yup.object({}))
  const [metaData, setMetaData] = useState((packet?.meta && JSON.parse(packet?.meta || '')) || {})
  const [filesToUpload, setFilesToUpload] = useState<{ [key: string]: File[] }>({})
  const [filesToDelete, setFilesToDelete] = useState<S3FileType[]>([])

  const [packetFiles, setPacketFiles] = useState<S3FileType[]>()
  const [initFormikValues, setInitFormikValues] = useState({})

  const formik = useFormik<{ address?: Address; parent?: Person; student?: Student; packet?: Packet; meta?: unknown }>({
    enableReinitialize: true,
    initialValues: initFormikValues,
    validationSchema: validationSchema,
    onSubmit: async () => {
      await goNext()
    },
  })

  const { loading, data: fileData } = useQuery(getPacketFiles, {
    variables: {
      fileIds: fileIds,
    },
    skip: !fileIds,
    fetchPolicy: 'network-only',
  })

  const [uploadDocument, { data: saveEnrollmentPacketData }] = useMutation<{
    saveEnrollmentPacketDocument: EnrollmentPacket
  }>(uploadDocumentMutation)

  const [deleteDocuments] = useMutation(deleteDocumentsMutation)
  const [saveEnrollmentContact] = useMutation<{ saveEnrollmentPacketContact: EnrollmentPacket }>(
    enrollmentContactMutation,
  )

  const submitDocuments = async () => {
    const address = { ...formik.values.address }
    if (address.address_id) {
      address.address_id = +address.address_id
    }
    if (address.state) {
      address.state = address.state + ''
    }
    if (address.country_id) {
      address.country_id = address.country_id + ''
    }
    try {
      const resPacket = (
        await saveEnrollmentContact({
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
        })
      ).data?.saveEnrollmentPacketContact
      if (resPacket && resPacket.packet && resPacket.student) {
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
        for (const key in filesToUpload) {
          if (filesToUpload.hasOwnProperty(key)) {
            const files = filesToUpload[key]
            files?.map((file) => {
              promises.push(
                new Promise(async (resolve) => {
                  const regionName = getRegionCode(me?.userRegion?.at(-1)?.regionDetail?.name)
                  const res = await uploadFile(file, FileCategory.PACKET, regionName)
                  if (res.success && res.data?.file.file_id) {
                    tempUploads.push({
                      kind: key,
                      mth_file_id: res.data.file.file_id,
                    })
                  }
                  resolve(true)
                }),
              )
            })
          }
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
        }
        if (resPacket?.packet?.status == PacketStatus.RESUBMITTED) {
          history.back()
          return
        } else {
          setVisitedTabs(Array.from(Array((tab?.currentTab || 0) + 1).keys()))
          setTab({ currentTab: (tab?.currentTab || 0) + 1 })
          window.scrollTo(0, 0)
        }
        setPacketId(resPacket.packet.packet_id)
        setMe((prev) => {
          return {
            ...prev,
            students: prev?.students?.map((student) => {
              const returnValue = { ...student }
              if (student.student_id == resPacket?.student?.student_id) {
                return resPacket.student
              }
              return returnValue
            }),
          }
        })
      }
    } catch (e) {
      console.error(e)
    }
  }
  const nextTab = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      setIsSubmit(true)
      e.preventDefault()
      setTab({ currentTab: (tab?.currentTab || 0) + 1 })
      window.scrollTo(0, 0)
    },
    [setTab, tab?.currentTab],
  )

  const specialEdStatus = useCallback(
    (item: EnrollmentQuestion) => {
      const specialResponseMeta = formik?.values?.packet?.meta
      const specialResponse = specialResponseMeta ? JSON.parse(specialResponseMeta) : {}
      const slug = item.options?.[0]?.label?.trim()
      if (slug === 'sped') {
        return !!(specialResponse && (specialResponse.meta_special_education || 0) !== 0)
      } else {
        return true
      }
    },
    [formik?.values?.packet?.meta],
  )
  const checkValidate = useCallback(
    (item: EnrollmentQuestion) => {
      if (item) {
        if (item.missedInfo) {
          return !!filesToUpload?.[item.question]?.length
        } else if (item.required && specialEdStatus(item)) {
          const exist = !!packetFiles?.filter((file) =>
            file.name.includes(`${fileNamePrefix}${item.options?.[0]?.label}`),
          )?.length
          const upload = !!filesToUpload?.[item.question]?.length
          return exist || upload
        } else {
          return true
        }
      }
      return false
    },
    [fileNamePrefix, filesToUpload, packetFiles, specialEdStatus],
  )
  const checkValidateDocments = useCallback(() => {
    if (packet?.status == PacketStatus.MISSING_INFO && Object.keys(filesToUpload).length == 0) {
      return false
    }
    let validDoc = true
    questions?.groups[0]?.questions?.map((item) => (validDoc = validDoc && checkValidate(item)))
    return validDoc
  }, [checkValidate, filesToUpload, packet?.status, questions?.groups])
  const goNext = async () => {
    setIsSubmit(true)
    if (checkValidateDocments()) {
      await submitDocuments()
    }
  }

  const submitRecord = useCallback(
    (documentType: string, files: File[]) => {
      const renamedFiles = files.map((f, index) => {
        const fileName = `${f.name.split('.').slice(0, -1).join('.')}${index !== 0 ? index + 1 : ''}`
        const fileExt = f.name.split('.').slice(-1)
        return new File([f], `${fileName}.${fileExt}`, {
          type: f.type,
        })
      })
      setFilesToUpload({ ...filesToUpload, [documentType]: renamedFiles })
    },
    [filesToUpload],
  )
  const handleDelete = useCallback(
    (file: S3FileType) => {
      setPacketFiles(filter(packetFiles, (validFile) => validFile.file_id !== file.file_id))
      setFilesToDelete((prev) => prev.concat(file))
    },
    [packetFiles],
  )

  const questionsArr = useMemo(
    () =>
      questions?.groups[0]?.questions?.map((q) => {
        let current = q,
          child
        const arr = [q]

        while ((child = questions?.groups[0]?.questions.find((x) => x.additional_question == current.slug))) {
          arr.push(child)
          current = child
        }
        return arr
      }),
    [questions?.groups],
  )

  const questionsLists = useMemo(() => {
    const list = questionsArr?.filter((item) => item.length && !item[0].additional_question) || []
    if (emailTemplateData?.emailTemplateName?.standard_responses) {
      const standard_responses = JSON.parse(String(emailTemplateData?.emailTemplateName?.standard_responses))
      for (const resItem of standard_responses) {
        for (const subResItem of resItem.responses) {
          if (packet?.missing_files?.includes(subResItem.title)) {
            const listItems = list.filter((e) => e[0].id == resItem.id)
            if (listItems.length) {
              listItems[0][0].missedInfo = true
            }
            break
          }
        }
      }
    }
    return list
  }, [emailTemplateData?.emailTemplateName?.standard_responses, packet?.missing_files, questionsArr])

  useEffect(() => {
    const initMeta = { ...metaData }
    if (questions?.groups?.length > 0) {
      const valid_student: { [key: string]: AnySchema } = {}
      const valid_parent: { [key: string]: AnySchema } = {}
      const valid_meta: { [key: string]: AnySchema } = {}
      const valid_address: { [key: string]: AnySchema } = {}
      const valid_packet: { [key: string]: AnySchema } = {}
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
      packet: { ...packet },
      meta: metaData,
      address: { ...profile?.address },
      school_year_id: student?.current_school_year_status.school_year_id,
    })
  }, [profile, student, metaData, packet])

  useEffect(() => {
    if (saveEnrollmentPacketData) {
      setMe((prev) => {
        return {
          ...prev,
          students: prev?.students?.map((student) => {
            const returnValue = { ...student }
            if (student.student_id == saveEnrollmentPacketData.saveEnrollmentPacketDocument?.student?.student_id) {
              return saveEnrollmentPacketData.saveEnrollmentPacketDocument.student
            }
            return returnValue
          }),
        }
      })
      if (saveEnrollmentPacketData?.saveEnrollmentPacketDocument?.packet?.status == PacketStatus.RESUBMITTED) {
        history.back()
      } else {
        setVisitedTabs(Array.from(Array((tab?.currentTab || 0) + 1).keys()))
        setTab({ currentTab: (tab?.currentTab || 0) + 1 })
        window.scrollTo(0, 0)
      }
    }
  }, [saveEnrollmentPacketData, setMe, setTab, setVisitedTabs, tab?.currentTab])

  useEffect(() => {
    const tempIds = map(packet?.files || [], 'mth_file_id').toString()
    if (fileIds !== tempIds) {
      setFileIds(tempIds)
    }
  }, [fileIds, packet?.files])

  useEffect(() => {
    setDataLoading(false)
  }, [packetFiles])

  useEffect(() => {
    if (!loading && fileData !== undefined) {
      setPacketFiles(fileData.packetFiles.results)
    }
  }, [loading, fileData])

  return !dataLoading ? (
    <form onSubmit={!disabled ? formik.handleSubmit : nextTab}>
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12}>
          <List>
            {questionsLists?.map(
              (item, index) =>
                specialEdStatus(item[0]) && (
                  <Grid item xs={12} marginTop={4} key={index}>
                    <DocumentUpload
                      packet={packet}
                      disabled={Boolean(disabled)}
                      item={item}
                      formik={formik}
                      handleUpload={submitRecord}
                      files={(packetFiles || [])
                        .filter((file) => filesToDelete.findIndex((x) => x.file_id === file.file_id) < 0)
                        .filter((file) => file.name.includes(`${fileNamePrefix}${item[0]?.options?.[0]?.label}`))
                        .sort((a, b) => Number(b.file_id) - Number(a.file_id))}
                      handleDelete={handleDelete}
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
