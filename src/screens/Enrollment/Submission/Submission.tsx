import { Box, Button, Checkbox, FormControlLabel, FormGroup, Grid, TextField, FormControl, FormLabel, FormHelperText } from '@mui/material'
import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react'
import { DropDown } from '../../../components/DropDown/DropDown'
import { DropDownItem } from '../../../components/DropDown/types'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { DASHBOARD, HOMEROOM } from '../../../utils/constants'
import { useStyles } from '../styles'
import SignatureCanvas from 'react-signature-canvas'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useMutation } from '@apollo/client'
import { submitEnrollmentMutation } from './service'
import { EnrollmentContext } from '../../../providers/EnrollmentPacketPrivder/EnrollmentPacketProvider'
import { Prompt, useHistory } from 'react-router-dom'
import { SuccessModal } from '../../../components/SuccessModal/SuccessModal'

export const Submission: FunctionComponent = () => {

  const { packetId, student, disabled, setMe } = useContext(EnrollmentContext)

  const setFerpa = (id: any) => formik.values.ferpa = id
  const setStudentPhoto = (id: any) => formik.values.studentPhoto = id
  const setDistrict = (id: any) => formik.values.schoolDistrict = id
  const classes = useStyles
  const [understand, setUnderstand] = useState(false)
  const [approve, setApprove] = useState(false)
  const [signature, setSignature] = useState<File>()
  const [fileId, setFileId] = useState()
  const signatureRef = useRef()

  const [showSuccess, setShowSuccess] = useState(false)
  const [submitEnrollment, {data}] = useMutation(submitEnrollmentMutation)

  const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> =>  {
    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    return new File([blob], fileName, { type: 'image/png' });
}

  const history = useHistory()
  
  const validationSchema = yup.object({
    printName: yup
      .string()
      .required('Printed name is required'),
    ferpa: yup
      .string()
      .required('Ferpa response is required'),
    studentPhoto: yup
      .string()
      .required('Student Photo response is required'),
    schoolDistrict: yup
      .string()
      .required('School District permission is required'),
    understand: yup
      .bool()
      .oneOf([true], 'Field must be checked'),
    approve: yup
      .bool()
      .oneOf([true], 'Field must be checked'),
  })

  const formik = useFormik({
    initialValues: {
      printName: undefined,
      ferpa: student.packets.at(-1)?.ferpa_agreement,
      studentPhoto: student.packets.at(-1)?.photo_permission,
      schoolDistrict: student.packets.at(-1)?.photo_permission,
      understand: understand,
      approve: undefined,
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      getSignature()
    },
  });

  const dropDownOptions: DropDownItem[] = [
    {
      label: 'Yes',
      value: 1,
    },
    {
      label: 'No',
      value: 2,
    },
  ]

  const ferpaPermissions: DropDownItem[] = [
    {
      label: 'I give my permission for the school to share immunization with USIIS.',
      value: 1,
    },
    {
      label: 'I do not give my permission for the school to share immunization with USIIS.',
      value: 2
    }
  ]
  
  const resetSignature = () => {
    signatureRef.current.clear()
  }
  
  const getSignature = async () => {
    const file = await dataUrlToFile(signatureRef.current.getTrimmedCanvas().toDataURL('image/png'), 'signature')
    setSignature(file)
  }

  useEffect(() => {
    formik.values.understand = understand
  },[understand])

  useEffect(() => {
    formik.values.approve = approve
  },[approve])

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
      submitEnrollment({
        variables: {
          enrollmentPacketDocumentInput: {
            ferpa_agreement: formik.values.ferpa,
            photo_permission: formik.values.studentPhoto,
            dir_permission: formik.values.schoolDistrict,
            signature_name: formik.values.printName,
            signature_file_id: fileId,
            agrees_to_policy: formik.values.understand ? 1 : 0,
            approves_enrollment: formik.values.approve ? 1 : 0,
            packet_id: parseFloat(packetId as unknown as string),
          }
        }
      })
    }
  },fileId)

  //useEffect(() => {
  //  data && history.push(HOMEROOM)
  //},[data])

  const nextTab = (e) => {
    e.preventDefault()
    history.push(`${HOMEROOM}/${student.student_id}`)
    window.scrollTo(0, 0)
}

  return (
    <form onSubmit={(e) => !disabled ? formik.handleSubmit(e) : nextTab(e)}>
    <Prompt
      when={ showSuccess }
      message={JSON.stringify({
        header: "Unsaved Work",
        content: "Changes you made will not be saved",
      })}
    />
    <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={12}>
        <Box width='50%'>
          <Subtitle fontWeight='700'>Required Documents to scan (or photograph) and upload</Subtitle>
          <Box marginTop={1}>
            <Paragraph size='medium'>
              All documents are kept private and secure. Please upload files specific to this student (ie don&apos;t
              include another student&apos;s documents).
            </Paragraph>
          </Box> 
        </Box>
      </Grid>
      <Grid item xs={6}>
        <FormControl
          disabled={disabled}
          required
          component="fieldset"
          variant="standard"
          error={formik.touched.understand && Boolean(formik.errors.understand)}
        >
        <FormGroup>
          <FormControlLabel
            control={<Checkbox
              disabled={disabled}
              checked={understand}
              onClick={() =>  setUnderstand(!understand)}
            />}
            label={
              <Paragraph size='medium'>
                I have read, understand, and agree to abide by the information outlined in the Enrollment Packet Policies page, including the repayment policy for withdrawing early or failing to demonstrate active participation (up to $350/course).
              </Paragraph>
            }
          />
        </FormGroup>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
      <FormControl
          required
          component="fieldset"
          variant="standard"
          error={formik.touched.understand && Boolean(formik.errors.understand)}
        >
        <FormGroup>
          <FormControlLabel
            control={<Checkbox 
              disabled={disabled}
              checked={approve}
              onClick={() =>  setApprove(!approve)}
            />}
            label={
              <Paragraph size='medium'>
                I approve for my student to be enrolled in any one of the following schools (Gateway Preparatory Academy, Digital Education Center - Tooele County School District, Advanced Learning Center - Nebo School District, and Southwest Education Academy - Iron County School District)
              </Paragraph>
            }
          />
        </FormGroup>
        </FormControl>
      </Grid>
      <Grid item xs={4} marginTop={4}>
        <Subtitle fontWeight='500'>FERPA Agreement Options</Subtitle>
        <DropDown
          disabled={disabled}
          size='small'
          dropDownItems={dropDownOptions}
          defaultValue={formik.values.ferpa}
          setParentValue={setFerpa}
          error={{
            error: !!(formik.touched.ferpa && Boolean(formik.errors.ferpa)),
            errorMsg: (formik.touched.ferpa && formik.errors.ferpa) as string,
          }}
        />
      </Grid>
      <Grid item xs={4} marginTop={4}>
        <Subtitle fontWeight='500'>Student Photo Permissions</Subtitle>
        <DropDown
          disabled={disabled}
          size='small'
          dropDownItems={dropDownOptions}
          defaultValue={formik.values.studentPhoto}
          setParentValue={setStudentPhoto}
          error={{
            error: !!(formik.touched.studentPhoto && Boolean(formik.errors.studentPhoto)),
            errorMsg: (formik.touched.studentPhoto && formik.errors.studentPhoto) as string,
          }}
        />
      </Grid>
      <Grid item xs={4} marginTop={4}>
        <Subtitle fontWeight='500'>School Student Directory Permissions</Subtitle>
        <DropDown
          disabled={disabled}
          size='small'
          dropDownItems={dropDownOptions}
          defaultValue={formik.values.schoolDistrict}
          setParentValue={setDistrict}
          error={{
            error: !!(formik.touched.schoolDistrict && Boolean(formik.errors.schoolDistrict)),
            errorMsg: (formik.touched.schoolDistrict && formik.errors.schoolDistrict) as string,
          }}
        />
      </Grid>
      <Grid item xs={12} marginTop={4}  justifyContent='center' display={'flex'}>
        <Box width={'60%'}>
        <Paragraph size='medium' textAlign='center'>
          I approve for my student to be enrolled in any one of the following schools (Gateway Preparatory Academy, Digital Education Center - Tooele County School District, Advanced Learning Center - Nebo School District, and Southwest Education Academy - Iron County School District)
        </Paragraph>
      </Box>
      </Grid>
      <Grid item xs={12}>
        <Box display='flex' flexDirection='column' alignItems='center' justifyContent={'center'} width='100%'>
          <TextField
            disabled={disabled}
            size='small'
            variant='outlined'
            fullWidth
            name='printName'
            value={formik.values.printName}
            onChange={formik.handleChange}
            error={formik.touched.printName && Boolean(formik.errors.printName)}
            helperText={formik.touched.printName && formik.errors.printName}
            style={{ width: '45%' }}
          />
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
      <Grid item xs={12} sx={{display:'flex', justifyContent: 'center',}}>
        <Paragraph size='medium' sx={{textDecoration: 'underline', cursor: 'pointer'}} onClick={() => resetSignature()}>Reset</Paragraph>
      </Grid>
      <Box sx={classes.buttonContainer}>
        <Button
          sx={classes.button}
          type='submit'
        >
          <Paragraph fontWeight='700' size='medium'>
          { disabled ? 'Go Home' : 'Save &amp; Continue'}
          </Paragraph>
        </Button>
      </Box>
    </Grid>
    </form>
  )
}
