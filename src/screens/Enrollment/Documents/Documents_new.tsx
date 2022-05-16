import { Box, Grid } from '@mui/material'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { DocumentUpload } from './components_new/DocumentUpload/DocumentUpload'
import { List, Button } from '@mui/material'
import { TabContext, UserContext, UserInfo } from '../../../providers/UserContext/UserProvider'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { useStyles } from '../styles'
import { useFormik } from 'formik'
import { EnrollmentContext } from '../../../providers/EnrollmentPacketPrivder/EnrollmentPacketProvider'
import { getPacketFiles } from '../../Admin/EnrollmentPackets/services'
import { omit } from 'lodash';
import { useMutation, useQuery } from '@apollo/client'
import { isPhoneNumber, isNumber } from '../../../utils/stringHelpers'
import * as yup from 'yup';
import { HOMEROOM } from '../../../utils/constants'
import { useHistory } from 'react-router-dom'
import { uploadDocumentMutation, enrollmentContactMutation } from './service'
import { LoadingScreen } from '../../LoadingScreen/LoadingScreen'
import { SuccessModal } from '../../../components/SuccessModal/SuccessModal'
import { S3FileType } from './components/DocumentUploadModal/types'

export default function DocumentsNew({id, questions}) {
  const classes = useStyles
  const { tab, setTab, visitedTabs, setVisitedTabs } = useContext(TabContext)

  const { me, setMe } = useContext(UserContext)
  const { setPacketId, disabled, packetId } = useContext(EnrollmentContext)
  const { profile, students } = me as UserInfo

  const student = students.find((s) => s.student_id === id)

  const [validationSchema, setValidationSchema] = useState(yup.object({}))
  // const [submitPersonalMutation, { data }] = useMutation(enrollmentContactMutation)
    
  useEffect(() => {
    if(questions?.groups?.length > 0) {
      let valid_student = {}
      let valid_parent = {}
      let valid_meta = {}
      questions.groups.map((g) => {
        g.questions.map((q) => {
          if(q.type !== 8 || q.type !== 7) {
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
          }
        })
      })
      
      setValidationSchema(yup.object({parent: yup.object(valid_parent), students: yup.array(yup.object(valid_student)), meta: yup.object(valid_meta)}))
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
      if(filesToUpload.length > 0) {
        filesToUpload.map(async (uploadEl, idx) => {
          var bodyFormData = new FormData();
          if(uploadEl.file){
            bodyFormData.append('file',uploadEl.file[0])
            bodyFormData.append('region', 'UT')
            bodyFormData.append('year', '2022')
            fetch( import.meta.env.SNOWPACK_PUBLIC_S3_URL,{
              method: 'POST',
              body: bodyFormData,
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('JWT')}`
              },
            })
            .then( async(res) => {
              res.json()
                .then( ({data}) => {
                  setDocuments((curr) => (
                    [
                      ...curr,
                      {
                        kind: uploadEl.type,
                        mth_file_id: data?.file.file_id
                      }
                    ]
                  ))
                })
              })
          }
        })
      }
      else {
        setVisitedTabs(Array.from(Array(tab.currentTab + 1).keys()))        
        setTab({
          currentTab: tab.currentTab + 1,
        })
        window.scrollTo(0, 0)
      }
    })
  }

  const formik = useFormik({
    initialValues: {
      parent: {...profile, phone_number: profile.phone.number},
      student: {...student.person, phone_number: student.person.phone.number, grade_levels: student.grade_levels, grade_level: student.current_school_year_status.grade_level},
      packet: {...student.packets.at(-1)},
      meta: student.packets.at(-1)?.meta && JSON.parse(student.packets.at(-1)?.meta) || {},
      address: {...student.person.address},
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      goNext()
    },
  })

  const [files, setFiles] = useState<S3FileType[]>()

  const [uploadDocument,{data}] = useMutation(uploadDocumentMutation)

  useEffect(() => {
    if(data){
      // if(!missingInfo){
        setVisitedTabs(Array.from(Array(tab.currentTab + 1).keys()))        
        setTab({
          currentTab: tab.currentTab + 1,
        })
        window.scrollTo(0, 0)
      // }else{
        
    // }
    }
    else {
      console.log('packet file store fail')
    }
  },[data])

  const [fileIds, setFileIds] = useState<String[]>()

  useEffect(() => {
    let temp = []
    student.packets.at(-1).files.map((f) => {temp.push(f?.mth_file_id)})
    setFileIds(temp)
  }, student.packets)

  const { loading, error, data: fileData, } = useQuery(getPacketFiles, {
    variables: {
      fileIds: fileIds?.toString() || ''
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if(!loading && fileData !== undefined){
      setFiles(fileData.packetFiles.results)
    }
  },[loading])

  const [dataLoading, setDataLoading] = useState(true)

  const isLoading = () => {
    if(disabled){
      if(files?.length > 0){
        setDataLoading(false)
      }
    } else{
      setDataLoading(false)
    }
  }

  useEffect(() => {
    isLoading()
  }, [files])


  const nextTab = (e) => {
    e.preventDefault()
    setTab({
      currentTab: tab.currentTab + 1
    })
    window.scrollTo(0, 0)
  }

  const [documents, setDocuments] = useState([])
      
  const goNext = async () => {  
    await submitDocuments()
  }

  useEffect(() => {
    if(documents?.length > 0){
        uploadDocument({
          variables: {
            enrollmentPacketDocumentInput: {
              packet_id: parseFloat(packetId as unknown as string),
              documents
            }
          }
        })
      }
  },[documents])

  const history = useHistory()

  const submitRecord = useCallback((documentType: string, file: File) => {
    // switch(documentType){
    //   case 'ur':
    //     setResidencyRecord(file)
    //     break;
    //   case 'im':
    //     setImmunRec(file)
    //     break;
    //   case 'bc':
    //     setBirthCert(file)
    //     break;
    // }
    if(file){
      setFilesToUpload([...filesToUpload, {file: file, type: documentType}])
    }    
  }, [filesToUpload])

  return (
    !dataLoading ? <form  onSubmit={(e) => !disabled ? formik.handleSubmit(e) : nextTab(e)}>
      
    <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={12}>
        <List>
          {questions?.groups[0]?.questions.map((item, index) => (
            <Grid item xs={12} marginTop={4}>
              <DocumentUpload
                item={item}
                formik={formik}
                handleUpload={submitRecord}
                file={files && files.filter((file) => file.name.includes(`${student.person.first_name}.${student.person.last_name}${item.options[0]?.label}`)).sort((a, b) => b.file_id - a.file_id)}
                firstName={student.person.first_name}
                lastName={student.person.last_name}
              />  
            </Grid>
          ))}
        </List>
      </Grid>
      <Box sx={classes.buttonContainer}>
          <Button
            sx={classes.button}
            type='submit'
          >
            <Paragraph fontWeight='700' size='medium'>
                {'Save & Continue'}
            </Paragraph>
          </Button>
      </Box>
    </Grid>
    </form>
    : <LoadingScreen/>
  )
}