import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Box, Button, FormHelperText, Grid, outlinedInputClasses, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { capitalize, omit } from 'lodash'
import { useHistory } from 'react-router-dom'
import SignatureCanvas from 'react-signature-canvas'
import * as yup from 'yup'
import { SuccessModal } from '@mth/components/SuccessModal/SuccessModal'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { isNumber } from '@mth/constants'
import { FileCategory, MthColor, MthRoute, QUESTION_TYPE } from '@mth/enums'
import { EnrollmentContext } from '@mth/providers/EnrollmentPacketPrivder/EnrollmentPacketProvider'
import { UserContext, UserInfo } from '@mth/providers/UserContext/UserProvider'
import { uploadFile } from '@mth/services'
import { getRegionCode, getWindowDimension } from '@mth/utils'
import { EnrollmentQuestionItem } from '../Question'
import { useStyles } from '../styles'
import { enrollmentContactMutation } from './service'
import { SubmissionProps } from './types'

export const Submission: React.FC<SubmissionProps> = ({ id, questions }) => {
  const { setPacketId, packetId, disabled } = useContext(EnrollmentContext)

  const classes = useStyles
  const [signature, setSignature] = useState<File>()
  const [fileId, setFileId] = useState<number | undefined>()
  const signatureRef = useRef<SignatureCanvas>(null)
  const [signatureInvalid, setSignatureInvalid] = useState(false)

  const [showSuccess, setShowSuccess] = useState(false)
  const [submitEnrollment] = useMutation(enrollmentContactMutation)
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimension())

  const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
    const res: Response = await fetch(dataUrl)
    const blob: Blob = await res.blob()
    return new File([blob], fileName, { type: 'image/png' })
  }

  const history = useHistory()

  const { me, setMe } = useContext(UserContext)
  const { profile, students } = me as UserInfo

  const student = students.find((s) => s.student_id === id)

  const [validationSchema, setValidationSchema] = useState(
    yup.object({
      meta: yup.object({
        meta_parentlegalname: yup.string().required('Required').nullable(),
      }),
    }),
  )

  const [metaData, setMetaData] = useState(student.packets.at(-1)?.meta && JSON.parse(student.packets.at(-1)?.meta))
  const [isSubmit, setIsSubmit] = useState<boolean>(false)

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimension())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (disabled == true) signatureRef?.current?.off()
    else signatureRef?.current?.on()
  }, [disabled])

  useEffect(() => {
    const initMeta = { ...metaData }
    if (questions?.groups?.length > 0) {
      const valid_student = {}
      const valid_parent = {}
      const valid_meta = {}
      const valid_address = {}
      const valid_packet = {}
      valid_meta['meta_parentlegalname'] = yup.string().required('Required').nullable()
      questions.groups?.map((g) => {
        g.questions?.map((q) => {
          if (q.type !== QUESTION_TYPE.UPLOAD && q.type !== QUESTION_TYPE.INFORMATION) {
            if (q.slug?.includes('student_')) {
              if (q.required) {
                if (q.slug?.toLocaleLowerCase().includes('emailconfirm')) {
                  valid_student[`${q.slug?.replace('student_', '')}`] = yup
                    .string()
                    .nullable()
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
                    .nullable()
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
    if (!metaData?.meta_parentlegalname) {
      metaData.meta_parentlegalname = ''
    }

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
      meta: metaData || {},
      address: { ...profile.address },
      school_year_id: student.current_school_year_status.school_year_id,
    })
  }, [profile, student, metaData])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initFormikValues,
    validationSchema: validationSchema,
    onSubmit: () => {
      if (!signatureRef?.current?.isEmpty()) {
        getSignature()
      }
    },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement> | undefined) => {
    if (signatureRef?.current?.isEmpty()) {
      setSignatureInvalid(true)
    }
    setIsSubmit(true)
    formik.handleSubmit(e)
  }

  const resetSignature = () => {
    signatureRef?.current?.clear()
  }

  const getSignature = async () => {
    if (signatureRef && signatureRef.current) {
      const file = await dataUrlToFile(signatureRef.current.getTrimmedCanvas().toDataURL('image/png'), 'signature')
      setSignature(file)
    }
  }

  useEffect(() => {
    if (signature) {
      const selectedRegion = me?.userRegion?.find((region) => region.region_id === me?.selectedRegionId)
      uploadFile(signature, FileCategory.SIGNATURE, getRegionCode(selectedRegion?.regionDetail?.name)).then((res) => {
        if (res.success && res.data?.file?.file_id) setFileId(res.data.file.file_id)
      })
    }
  }, [signature])

  useEffect(() => {
    if (fileId) {
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
      submitEnrollment({
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
            signature_file_id: fileId,
            packet_id: parseFloat(packetId as unknown as string),
            school_year_id: student.current_school_year_status.school_year_id,
          },
        },
      }).then((data) => {
        setPacketId(data.data.saveEnrollmentPacketSubmit.packet.packet_id)
        setMe((prev) => {
          return {
            ...prev,
            profile: {
              ...prev.profile,
              address: address,
            },
            students: prev?.students?.map((student) => {
              const returnValue = { ...student }
              if (student.student_id === data.data.saveEnrollmentPacketSubmit.student.student_id) {
                return data.data.saveEnrollmentPacketSubmit.student
              }
              return returnValue
            }),
          }
        })
        if (data) setShowSuccess(true)
      })
    }
  }, fileId)

  const nextTab = (e) => {
    e.preventDefault()
    history.push(`${MthRoute.HOMEROOM}` + '/' + id)
    window.scrollTo(0, 0)
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
  const questionsLists = questionsArr ? questionsArr.filter((item) => !item[0].additional_question) : []

  return (
    <form onSubmit={(e) => (!disabled ? handleSubmit(e) : nextTab(e))}>
      {showSuccess && (
        <SuccessModal
          title='Success'
          subtitle={`${capitalize(
            student.person.first_name,
          )}'s Enrollment Packet has been submitted successfully and is now pending approval.`}
          btntitle='Done'
          handleSubmit={() => {
            history.push(`${MthRoute.HOMEROOM}`)
            location.reload()
          }}
        />
      )}
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {questionsLists?.map((item, index) => (
          <EnrollmentQuestionItem key={index} item={item} group={'root'} formik={formik} />
        ))}
      </Grid>
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12}>
          <Box display='flex' flexDirection='column' alignItems='center' justifyContent={'center'} width='100%'>
            <Box
              sx={{
                width: { xs: '100%', sm: '35%' },
                marginTop: { xs: '40px', sm: '0px' },
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <FormHelperText style={{ textAlign: 'center' }}>
                Type full legal parent name and provide a Digital Signature below.
              </FormHelperText>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display='flex' flexDirection='column' alignItems='center' justifyContent={'center'} width='100%'>
            <Box
              sx={{
                width: windowDimensions.width > 600 ? '500px' : '300px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <TextField
                sx={{
                  [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                    {
                      borderColor: MthColor.SYSTEM_07,
                    },
                }}
                name={'meta.meta_parentlegalname'}
                InputLabelProps={{
                  style: { color: MthColor.SYSTEM_05 },
                }}
                variant='outlined'
                fullWidth
                focused
                placeholder='Entry'
                error={isSubmit && formik.errors['meta'] && Boolean(formik.errors['meta']['meta_parentlegalname'])}
                helperText={isSubmit && formik.errors['meta'] && formik.errors['meta']['meta_parentlegalname']}
                onChange={formik.handleChange}
                value={formik.values['meta'] ? formik.values['meta']['meta_parentlegalname'] : ''}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display='flex' flexDirection='column' alignItems='center' justifyContent={'center'} width='100%'>
            <Box
              sx={{
                width: { xs: '100%', sm: '35%' },
                marginTop: { xs: '40px', sm: '0px' },
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <FormHelperText style={{ textAlign: 'center' }}>Signature (use the mouse to sign)</FormHelperText>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ borderBottom: '1px solid', width: { sm: 500, xs: 300 } }}>
            <SignatureCanvas
              canvasProps={{ width: windowDimensions.width > 600 ? 500 : 300, height: 100 }}
              ref={signatureRef}
            />
          </Box>
        </Grid>
        {signatureInvalid && (
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <FormHelperText style={{ textAlign: 'center', color: MthColor.RED }}>Required</FormHelperText>
          </Grid>
        )}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paragraph
            size='medium'
            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => resetSignature()}
          >
            Reset
          </Paragraph>
        </Grid>
        <Box sx={classes.buttonContainer}>
          <Button sx={classes.button} type='submit'>
            <Paragraph fontWeight='700' size='medium'>
              {disabled ? 'Go Back to Student Profile' : 'Done'}
            </Paragraph>
          </Button>
        </Box>
      </Grid>
    </form>
  )
}
