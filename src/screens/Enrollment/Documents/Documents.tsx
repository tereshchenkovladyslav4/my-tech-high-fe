import { Box, Button, Grid } from '@mui/material'
import React, { FunctionComponent, useContext,  useEffect,  useState } from 'react'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { DocumentUpload } from './components/DocumentUpload/DocumentUpload'
import { useStyles } from '../styles'
import { EnrollmentContext } from '../../../providers/EnrollmentPacketPrivder/EnrollmentPacketProvider'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { uploadDocumentMutation } from './service'
import { DocumentType } from './components/DocumentUpload/types'
import { filter, map, toNumber } from 'lodash'
import { useHistory } from 'react-router-dom'
import { HOMEROOM } from '../../../utils/constants'
import { GQLFile } from '../../HomeroomStudentProfile/Student/types'
import { getPacketFiles } from '../../Admin/EnrollmentPackets/services'
import { S3FileType } from './components/DocumentUploadModal/types'
import { LoadingScreen } from '../../LoadingScreen/LoadingScreen'
import { TabContext, UserContext } from '../../../providers/UserContext/UserProvider'
import { SuccessModal } from '../../../components/SuccessModal/SuccessModal'
export const Documents: FunctionComponent = () => {

  const { packetId, student, disabled } = useContext(EnrollmentContext)

  const { me, setMe } = useContext(UserContext)
  const { tab, setTab, visitedTabs, setVisitedTabs } = useContext(TabContext)

  const classes = useStyles
  const [birthCert, setBirthCert] = useState<File | GQLFile>()
  const [immunRec, setImmunRec] = useState<File>()
  const [residencyRecord, setResidencyRecord] = useState<File>()
  
  const missingInfo = student.packets?.at(-1).status === 'Missing Info'

  const missingFiles = student.packets?.at(-1).missing_files

  const bcFile = filter(student.packets.at(-1).files,(file) => file.kind == 'bc').at(-1)
  const imFile = filter(student.packets.at(-1).files,(file) => file.kind == 'im').at(-1)
  const urFile = filter(student.packets.at(-1).files,(file) => file.kind == 'ur').at(-1)

  const fileIds = [bcFile?.file_id, imFile?.file_id, urFile?.file_id]

  const [dataLoading, setDataLoading] = useState(true)

  const [files, setFiles] = useState<S3FileType[]>()

  const [showSuccess, setShowSuccess] = useState(false)

  const { loading, error, data: fileData, } = useQuery(getPacketFiles, {
    variables: {
      fileIds: fileIds.toString()
    },
    fetchPolicy: 'network-only',
  })

  const [documents, setDocuments] = useState([])

  const [uploadDocument,{data}] = useMutation(uploadDocumentMutation)
  const history = useHistory()

  const submitRecord = (documentType: DocumentType, file: File) => {
    switch(documentType){
      case 'ur':
        setResidencyRecord(file)
        break;
      case 'im':
        setImmunRec(file)
        break;
      case 'bc':
        setBirthCert(file)
        break;
    }
  }

  useEffect(() => {
    if(!loading && fileData !== undefined){
      setFiles(fileData.packetFiles.results)
    }
  },[loading])

  const onNext = async () => {
    const filesToUpload = [
      {
        file: birthCert,
        type: 'bc'
      },
      {
        file: immunRec,
        type: 'im'
      },
      {
        file: residencyRecord,
        type: 'ur'
      }
    ]

    map(filesToUpload, async (uploadEl, idx) => {
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
                    mth_file_id: data.file.file_id
                  }
                ]
              ))
            })
          })
      }
    })
  }

  useEffect(() => {
    if(documents?.length === 3){
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

  useEffect(() => {
    if(data){
      if(!missingInfo){
        setVisitedTabs([...visitedTabs, tab.currentTab])
        setTab({
          currentTab: 4,
        })
        window.scrollTo(0, 0)
      }else{
        setShowSuccess(true)
    }
  }},[data])

  const nextTab = (e) => {
    e.preventDefault()
    setTab({
      currentTab: 4,
    })
    window.scrollTo(0, 0)
  }

  const isLoading = () => {
    if(disabled){
      if(files?.length > 0){
        setDataLoading(false)
      }
    }else{
      setDataLoading(false)
    }
  }

  useEffect(() => {
    isLoading()
  }, [files])

  const onSubmit = () => {
    history.push(`${HOMEROOM}`)
    location.reload()
  }
  return (
    !dataLoading ? <form>
    {showSuccess 
      && <SuccessModal 
        title='' 
        subtitle='Your Enrollment Packet has been submitted successfully and is now pending approval.”' 
        handleSubmit={onSubmit} 
      />
    }
    <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={12}>
        <Box width='50%'>
          <Subtitle fontWeight='700'>Required Documents to scan (or photograph) and upload</Subtitle>
          <Paragraph size='medium'>
            All documents are kept private and secure. Please upload files specific to this student (ie don&apos;t include
            another student&apos;s documents).
          </Paragraph>
        </Box>
      </Grid>
      <Grid item xs={12} marginTop={4}>
        <DocumentUpload
          title={"Enrollment's Birth Certificate (required)"}
          subtitle={'Allowed file types: pdf, png, jpg, jpeg, gif, bmp (Less than 25MB)'}
          document='bc'
          handleUpload={submitRecord}
          file={files && filter(files,(file) => file.file_id === bcFile.file_id )}
          disabled={disabled && !missingFiles.includes('bc')}
        />
      </Grid>
      <Grid item xs={12}>
        <DocumentUpload
          title={"Enrollment's Immunization Record or Personal Exemption Form (required)"}
          subtitle={'Allowed file types: pdf, png, jpg, jpeg, gif, bmp (Less than 25MB)'}
          document='im'
          handleUpload={submitRecord}
          file={files && filter(files,(file) => file.file_id === imFile.file_id )}
          disabled={disabled && !missingFiles.includes('im')}
        />
      </Grid>
      <Grid item xs={12}>
        <DocumentUpload
          title={
            "Parent's Proof of Utah Residency issued within 60 days such as a current utility bill, mortgage or rental statement (required)"
          }
          subtitle={'Allowed file types: pdf, png, jpg, jpeg, gif, bmp (Less than 25MB)'}
          document='ur'
          handleUpload={submitRecord}
          file={files && filter(files,(file) => file.file_id === urFile.file_id )}
          disabled={disabled && !missingFiles.includes('ur')}
        />
      </Grid>
      <Box sx={classes.buttonContainer}>
          <Button
            sx={classes.button}
            onClick={(e) => disabled 
              ? nextTab(e)
              : onNext() 
            }
          >
            <Paragraph fontWeight='700' size='medium'>
            { disabled 
              ? 'Next' 
              : student.packets?.at(-1).status === 'Missing Info'
                ? 'Submit'
                : 'Save & Continue'
            }
            </Paragraph>
          </Button>
      </Box>
    </Grid>
    </form>
    : <LoadingScreen/>
  )
}