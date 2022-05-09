import { Box, Button, Checkbox, FormControlLabel, FormGroup, Grid, TextField, FormControl, FormLabel, FormHelperText } from '@mui/material'
import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react'
import { DropDown } from '../../../components/DropDown/DropDown'
import { DropDownItem } from '../../../components/DropDown/types'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { HOMEROOM, RED } from '../../../utils/constants'
import { useStyles } from '../styles'
import SignatureCanvas from 'react-signature-canvas'
import { submitEnrollmentMutation, enrollmentContactMutation } from './service'
import { EnrollmentContext } from '../../../providers/EnrollmentPacketPrivder/EnrollmentPacketProvider'
import { useHistory } from 'react-router-dom'
import { SuccessModal } from '../../../components/SuccessModal/SuccessModal'
import EnrollmentQuestionItem from '../Question'
import { useFormik } from 'formik'
import { omit } from 'lodash';
import { useMutation, useQuery } from '@apollo/client'
import { isPhoneNumber, isNumber } from '../../../utils/stringHelpers'
import * as yup from 'yup';
import { TabContext, UserContext, UserInfo } from '../../../providers/UserContext/UserProvider'

export default function SubmissionNew({id, questions}) {

  const { setPacketId, packetId, disabled } = useContext(EnrollmentContext)
  
  const classes = useStyles
  const [understand, setUnderstand] = useState(false)
  const [approve, setApprove] = useState(false)
  const [signature, setSignature] = useState<File>()
  const [fileId, setFileId] = useState()
  const signatureRef = useRef()
  const[signatureInvalid, setSignatureInvalid] = useState(false)

  const [showSuccess, setShowSuccess] = useState(false)
  const [submitEnrollment, {data}] = useMutation(enrollmentContactMutation)

  const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> =>  {
    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    return new File([blob], fileName, { type: 'image/png' });
  }

  const history = useHistory()
  
  const { me, setMe } = useContext(UserContext)
  const { profile, students } = me as UserInfo

  const student = students.find((s) => s.student_id === id)

  const [validationSchema, setValidationSchema] = useState(yup.object({}))
    
  useEffect(() => {
    if(questions.groups?.length > 0) {
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
      if(!signatureRef.current.isEmpty()){
        getSignature()
      }
    },
  });

  const handleSubmit = (e) => {
    if(signatureRef.current.isEmpty()){
      setSignatureInvalid(true)
    }
    formik.handleSubmit(e)
  }
  
  const resetSignature = () => {
    signatureRef.current.clear()
  }
  
  const getSignature = async () => {
    const file = await dataUrlToFile(signatureRef.current.getTrimmedCanvas().toDataURL('image/png'), 'signature')
    setSignature(file)
  }

  useEffect(() => {
    if(signature){
      uploadSignature()
    }
  }, [signature])

  const uploadSignature = async() => {
    var bodyFormData = new FormData();
    bodyFormData.append('file', signature )
    bodyFormData.append('region', 'UT')
    bodyFormData.append('year', '2022')
    fetch( import.meta.env.SNOWPACK_PUBLIC_S3_URL,{
      method: 'POST',
      body: bodyFormData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('JWT')}`
      },
    }).then((res) => {
      res.json()
      .then(({data}) => {
        setFileId(data.file.file_id)
      })
    })
  }

  useEffect(() => {
    if(fileId){
    //   submitEnrollment({
    //     variables: {
    //       enrollmentPacketDocumentInput: {
    //         ferpa_agreement: formik.values.ferpa,
    //         photo_permission: formik.values.studentPhoto,
    //         dir_permission: formik.values.schoolDistrict,
    //         signature_name: formik.values.printName,
    //         signature_file_id: fileId,
    //         agrees_to_policy: formik.values.understand ? 1 : 0,
    //         approves_enrollment: formik.values.approve ? 1 : 0,
    //         packet_id: parseFloat(packetId as unknown as string),
    //       }
    //     }
    //   })
        submitEnrollment({
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
                    students: prev?.students.map((student) => {
                    const returnValue = { ...student }
                    if (student.student_id === data.data.saveEnrollmentPacketContact.student.student_id) {
                        return data.data.saveEnrollmentPacketContact.student
                    }
                    return returnValue
                    }),
                }
            })
            data && setShowSuccess(true)
        })
    }
  },fileId)

//   useEffect(() => {
//     if(data !== undefined){
//       data && setShowSuccess(true)
//     }
//   },[data])

  const nextTab = (e) => {
    e.preventDefault()
    history.push(`${HOMEROOM}`)
    window.scrollTo(0, 0)
    }



  return (
    <form onSubmit={(e) => !disabled ? handleSubmit(e) : nextTab(e)}>
        {showSuccess 
        && <SuccessModal 
            title='' 
            subtitle='Your Enrollment Packet has been submitted successfully and is now pending approval.' 
            btntitle='Done'
            handleSubmit={() => {
            history.push(`${HOMEROOM}`)
            location.reload()
            }}
        />
        }
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {questions.groups[0]?.questions.map((item, index) => (
                <EnrollmentQuestionItem key={index} item={item} group={'root'} formik={formik}/>
            ))}
        </Grid>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12}>
                <Box display='flex' flexDirection='column' alignItems='center' justifyContent={'center'} width='100%'>
                <Box sx={{ width: '35%', display:'flex', flexDirection: 'row', justifyContent: 'center'  }}>
                    <FormHelperText style={{textAlign:'center'}}>Type full legal parent name and provide a Digital Signature below. Signature (use the mouse to sign)</FormHelperText>
                </Box>
                </Box>
            </Grid>
            <Grid item xs={12} sx={{display:'flex', justifyContent: 'center',}}>
                <Box sx={{borderBottom:'1px solid', width: 500}}>
                <SignatureCanvas 
                    canvasProps={{width: 500, height:100,}} 
                    ref={signatureRef}
                />
                </Box>
            </Grid>
            {signatureInvalid 
                &&  <Grid 
                item 
                xs={12} 
                sx={{display:'flex', justifyContent: 'center',}}
                >
                <FormHelperText style={{textAlign:'center',color: RED}}>Signature required</FormHelperText>
                </Grid>
            }
            <Grid item xs={12} sx={{display:'flex', justifyContent: 'center',}}>
                <Paragraph size='medium' sx={{textDecoration: 'underline', cursor: 'pointer'}} onClick={() => resetSignature()}>Reset</Paragraph>
            </Grid>
            <Box sx={classes.buttonContainer}>
                <Button
                sx={classes.button}
                type='submit'
                >
                <Paragraph fontWeight='700' size='medium'>
                { disabled ? 'Go Home' : 'Done'}
                </Paragraph>
                </Button>
            </Box>
        </Grid>
    </form>
  )
}
