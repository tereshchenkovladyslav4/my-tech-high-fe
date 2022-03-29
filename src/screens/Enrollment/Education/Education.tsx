import { useMutation } from '@apollo/client'
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, outlinedInputClasses, TextField } from '@mui/material'
import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { enrollmentContactMutation } from './service'
import { useStyles } from '../styles'
import { EnrollmentContext } from '../../../providers/EnrollmentPacketPrivder/EnrollmentPacketProvider'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ERROR_RED, GRADES, SYSTEM_07, schoolDistricts } from '../../../utils/constants'
import { DropDown } from '../../../components/DropDown/DropDown'
import { map } from 'lodash'
import { DocumentUploadModal } from '../Documents/components/DocumentUploadModal/DocumentUploadModal'

export const Education: FunctionComponent = () => {

  const  [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState('')
  const [lastSchoolAttended, setLastSchoolAttended] = useState('')
  const [acknowledge, setAcknowledge] = useState(false)
  const [iep504, setIEP504] = useState(true)
  const [iep504Final, setIEP504Final] = useState(true)
  const [iepActive, setIEPActive] = useState(false)
  const [iepPerspective, setIEPPerspective] = useState(false)
  const [specEdDoc, setScpecEdDoc] = useState(true)
  const [specEdCurric, setScpecEdCurric] = useState(true)
  const [uploadFile, setUploadFile] = useState<File>()

  const handleFile = (fileName: File) => {setUploadFile(fileName)}


  const setSchoolDistrict = (id: any) => formik.values.schoolDistrict = id
  const setGrade = (id: any) => formik.values.enrollmentGradeLevel = id

  const [submitEducationlMutation, { data }] = useMutation(enrollmentContactMutation)

  const classes = useStyles

  const { setCurrentTab, packetId, student, disabled:disabledField } = useContext(EnrollmentContext)

  const no = 'No'
  const iep = 'Yes - an IEP'
  const plan = 'Yes - a 504 Plan (Not an IEP)'
  const none = 'None - Student has always been home schooled'
  const studentMsg = 'Student was previously enrolled in the following school'
  const iep504Text = 'I understand that an IEP/504 is an important legal document that defines a student\'s educational plan and that it must be reviewed regularly by the school\'s Special Education IEP/504 Team.'
  const iep504FinalText = 'I also understand that all final curriculum and scheduling choices for students with an IEP/504 must be made in consultation with the parent and the school\'s Special Education Team.'

  const renderPlanOptions = () => (
    <Grid item xs={6} marginTop={2}>
    <FormControl
      required
      name='iep504'
      component="fieldset"
      variant="standard"
      //error={formik.touched.lastSchoolAttended && Boolean(formik.errors.lastSchoolAttended)}
      >
    <FormGroup>
      <FormControlLabel 
          control={
            <Checkbox
            disabled={disabledField}
            checked={iep504}
            onClick={() => setIEP504(!iep504)}
            />
          }
          label={iep504Text} 
          />
      <FormControlLabel 
          control={
            <Checkbox
            disabled={disabledField}
            checked={iep504Final}
            onClick={() => setIEP504Final(!iep504Final)}
            />
          }
          label={iep504FinalText}
          sx={{marginTop: 2}}
          />
    </FormGroup>
  </FormControl>
</Grid>
)

  const renderIEPOptions = () => (
    <Grid item xs={6} marginTop={2}>
      <Subtitle fontWeight='500'>
          Has the IEP been active in the past 3 years?
      </Subtitle>
      <FormControl
        required
        name='iep504'
        component="fieldset"
        variant="standard"
        //error={formik.touched.lastSchoolAttended && Boolean(formik.errors.lastSchoolAttended)}
      >
      <FormGroup>
        <FormControlLabel 
          control={
            <Checkbox 
              checked={!iepActive}
              onClick={() => setIEPActive(!iepActive)}
            />
          }
          label={'No'} 
        />
        <FormControlLabel 
          control={
            <Checkbox 
              checked={iepActive}
              onClick={() => setIEPActive(!iepActive)}
            />
          }
          label={'Yes'} 
        />
      </FormGroup>
    </FormControl>
  </Grid>
  )

  const renderIEPPerspective = () => (
    <Grid item xs={6} marginTop={2}>
      <Subtitle fontWeight='500'>
        From your perspective, do you thinking your student still requires Special Education services?
      </Subtitle>
      <FormControl
        required
        name='iep504'
        component="fieldset"
        variant="standard"
        //error={formik.touched.lastSchoolAttended && Boolean(formik.errors.lastSchoolAttended)}
      >
      <FormGroup>
        <FormControlLabel 
            control={
              <Checkbox 
                checked={!iepPerspective}
                onClick={() => setIEPPerspective(!iepPerspective)}
              />
            }
            label={'No, Please email me an exit form to sign'} 
        />
        <FormControlLabel 
            control={
              <Checkbox 
                checked={iepPerspective}
                onClick={() => setIEPPerspective(!iepPerspective)}
              />
            }
            label={'Yes, please schedule me for a meeting with the Special Ed team this fall to review and update the IEP'} 
        />
      </FormGroup>
    </FormControl>
  </Grid>
  )

  const UploadComponent = () => (
    <Grid item xs={6} marginTop={2}>
      <Box display='flex' flexDirection='column'justifyContent={'center'}>
        <Subtitle> If applicable submit IEP or 504 plan </Subtitle>
        <Button variant='contained' sx={classes.documentButton} onClick={() => setOpen(true)} >
          <Paragraph fontWeight='700' size='medium'>
            Select file...
          </Paragraph>
        </Button>
      </Box>
    </Grid>
  )

  const validationSchema = yup.object({
    enrollmentGradeLevel: yup
      .string()
      .required('Enrollment Grade is required'),
    schoolDistrict: yup
      .string()
      .required('School District is required'),
    disabled: yup
      .string()
      .required('Required field'),
    lastSchoolAttended: yup
      .string()
      .required('Required field'),
    schoolName: yup
      .string()
      .when('lastSchoolAttended',{
        is: (lastSchoolAttended) => lastSchoolAttended === studentMsg,
        then: yup.string().required('Please enter the race.')
      }),
    schoolAddress: yup
      .string()
      .when('lastSchoolAttended',{
        is: (lastSchoolAttended) => lastSchoolAttended === studentMsg,
        then: yup.string().required('Please enter the race.')
      }),
    acknowledge: yup
      .boolean()
      .required('Please Acknowledge to continue')
      .when('lastSchoolAttended',{
        is: (lastSchoolAttended) => lastSchoolAttended === studentMsg,
        then: yup.string().required('Please enter the race.')
      })
  });

  const formik = useFormik({
    initialValues: {
      enrollmentGradeLevel: undefined,
      schoolDistrict: student.packets.at(-1)?.school_district,
      schoolName: undefined,
      schoolAddress: undefined,
      disabled: undefined,
      lastSchoolAttended: undefined,
      acknowledge: undefined
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      goNext()
    },
  });


  useEffect(() => {
    console.log(uploadFile)
  },[uploadFile])
  const submitEducation = async () => {

    if((disabled === iep && iepActive && uploadFile === undefined) || disabled === plan && uploadFile === undefined){
      throw 'Please Upload a plan'
    }
    submitEducationlMutation({
      variables: {
        enrollmentPacketEducationInput: {
          packet_id: parseFloat(packetId as unknown as string),
          school_year_id: 10,
          grade_level: formik.values.enrollmentGradeLevel,
          school_district: formik.values.schoolDistrict,
          last_school: formik.values.schoolName,
          last_school_address: formik.values.schoolAddress,
          last_school_type: null,
          permission_to_request_records: null,
          special_ed: null,
          special_ed_desc: null,
          understands_special_ed: null
        }
      }
    })
  }

  const disabledSelected = (value: string) => disabled === value
  const lastSchoolSelected = (value: string) => lastSchoolAttended === value

  const selectDisabledOption = (isDisabled: string) => {
    setDisabled((prev) => (
      isDisabled === prev
        ? ''
        : isDisabled
    ))
  }

  const selectLastSchoolOption = (isDisabled: string) => {
    setLastSchoolAttended((prev) => (
      isDisabled === prev
        ? ''
        : isDisabled
    ))
  }

  useEffect(() => {
    formik.values.disabled = disabled
  },[disabled])

  useEffect(() => {
    formik.values.acknowledge = acknowledge
  },[acknowledge])

  useEffect(() => {
    formik.values.lastSchoolAttended = lastSchoolAttended
    if(lastSchoolAttended === none){
      formik.values.schoolName = undefined
      formik.values.schoolAddress = undefined
    }
  },[lastSchoolAttended])

  useEffect(() => {
    if(iepActive){
      setIEPPerspective(false)
    }
  },[iepActive])

  const goNext = async() => {
      await submitEducation()
      .then(() => {
        setCurrentTab((curr) => curr + 1)
        window.scrollTo(0, 0)
      })
      .catch(e => window.alert(e))
  }
  const parseGrades = map(GRADES, (grade) => {
    return {
      label: grade,
      value: grade.toString()
    }
  })

  const nextTab = (e) => {
    e.preventDefault()
    setCurrentTab((curr) => curr + 1)
    window.scrollTo(0, 0)
  }

  return (
    <form onSubmit={(e) => !disabledField ? formik.handleSubmit(e) : nextTab(e)}>
      { open 
				&& <DocumentUploadModal
          handleModem={() => setOpen(!open)}
          handleFile={handleFile}
				/> 
			}
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12}>
          <Subtitle fontWeight='700'>Education</Subtitle>
        </Grid>
        <Grid item xs={6}>
          <Subtitle fontWeight='500'>Enrollments Grade Level (age for 2022-2023)</Subtitle>
          <DropDown
            disabled={disabledField}
            name='enrollmentGradeLevel'
            dropDownItems={parseGrades}
            setParentValue={setGrade}
            size='small'
            sx={{
              [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: SYSTEM_07,
              },
              marginY: 2,
              width: '100%',
            }}
            error={{
              error: !!(formik.touched.enrollmentGradeLevel && Boolean(formik.errors.enrollmentGradeLevel)),
              errorMsg: (formik.touched.enrollmentGradeLevel && formik.errors.enrollmentGradeLevel) as string,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Subtitle fontWeight='500'>School District of Residence</Subtitle>
          <DropDown
            disabled={disabledField}
            name='schoolDistrict'
            defaultValue={formik.values.schoolDistrict}
            dropDownItems={schoolDistricts}
            setParentValue={setSchoolDistrict}
            size='small'
            sx={{
              [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: SYSTEM_07,
              },
              marginY: 2,
              width: '100%',
            }}
            error={{
              error: !!(formik.touched.schoolDistrict && Boolean(formik.errors.schoolDistrict)),
              errorMsg: (formik.touched.schoolDistrict && formik.errors.schoolDistrict) as string,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Subtitle fontWeight='500'>
            Has this student ever been diagnosed with a learning disability or ever qualified for Special Education
            Services through an IEP or 504 plan (including Speech Therapy)?
          </Subtitle>
        </Grid>
        <Grid item xs={12}>
          <FormLabel sx={{color: ERROR_RED}}>{formik.touched.disabled && formik.errors.disabled}</FormLabel>
          <FormControl
            required
            disabled={disabledField}
            name='disabled'
            component="fieldset"
            variant="standard"
            error={formik.touched.disabled && Boolean(formik.errors.disabled)}
          >
            <FormGroup>
              <FormControlLabel 
                  control={
                    <Checkbox
                      disabled={disabledField}
                      checked={disabledSelected(no)}
                      onClick={() => selectDisabledOption(no)}
                    />
                  }
                  label={no} 
              />
              <FormControlLabel 
                  control={
                    <Checkbox
                      disabled={disabledField}
                      checked={disabledSelected(iep)}
                      onClick={() => selectDisabledOption(iep)}
                    />
                  }
                  label={iep} 
              />
              <FormControlLabel 
                  control={
                    <Checkbox
                      disabled={disabledField}
                      checked={disabledSelected(plan)}
                      onClick={() => selectDisabledOption(plan)}
                    />
                  }
                  label={plan} 
              />
            </FormGroup>
          </FormControl>
          { disabled === plan 
            ? renderPlanOptions()
            : disabled === iep && renderIEPOptions()
          }
          {
            disabled === iep && iepActive && renderIEPPerspective()
          }
          {
            disabled === iep && iepActive && iepPerspective && renderPlanOptions()
          }
          { disabled === plan 
            ? <UploadComponent/>
            : disabled === iep && <UploadComponent/>
          }
        </Grid>
        <Grid item xs={12} marginTop={2}>
          <Subtitle fontWeight='500'>Last School Attended</Subtitle>
          <FormLabel sx={{color: ERROR_RED}}>{formik.touched.lastSchoolAttended && formik.errors.lastSchoolAttended}</FormLabel>
          <FormControl
            required
            name='lastSchoolAttended'
            component="fieldset"
            variant="standard"
            error={formik.touched.lastSchoolAttended && Boolean(formik.errors.lastSchoolAttended)}
          >
            <FormGroup>
              <FormControlLabel 
                  control={
                    <Checkbox
                      disabled={disabledField}
                      checked={lastSchoolSelected(none)}
                      onClick={() => selectLastSchoolOption(none)}
                    />
                  }
                  label={none} 
              />
              <FormControlLabel 
                  control={
                    <Checkbox
                      disabled={disabledField}
                      checked={lastSchoolSelected(studentMsg)}
                      onClick={() => selectLastSchoolOption(studentMsg)}
                    />
                  }
                  label={studentMsg} 
              />
            </FormGroup>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <Subtitle fontWeight='500'>Name of School</Subtitle>
          <TextField 
            size='small' 
            variant='outlined' 
            fullWidth
            disabled={disabledField}
            name='schoolName'
            value={formik.values.schoolName}
            onChange={formik.handleChange}
            error={formik.touched.lastSchoolAttended && lastSchoolAttended !== none && formik.touched.schoolName && Boolean(formik.errors.schoolName)}
            helperText={formik.touched.lastSchoolAttended && lastSchoolAttended !== none && formik.touched.schoolName && formik.errors.schoolName}
            disabled={lastSchoolAttended !== studentMsg}
          />
        </Grid>
        <Grid item xs={6}>
          <Subtitle fontWeight='500'>Address of School</Subtitle>
          <TextField 
            size='small' 
            variant='outlined' 
            fullWidth
            disabled={disabledField}
            name='schoolAddress'
            value={formik.values.schoolAddress}
            onChange={formik.handleChange}
            error={formik.touched.schoolAddress && Boolean(formik.errors.schoolAddress)}
            helperText={formik.touched.schoolAddress && formik.errors.schoolAddress}
            disabled={lastSchoolAttended !== studentMsg}
          />
        </Grid>
        <Grid item xs={12}>
        <FormLabel sx={{color: ERROR_RED}}>{formik.touched.acknowledge && formik.errors.acknowledge}</FormLabel>
          <FormControl
            required
            name='acknowledge'
            component="fieldset"
            variant="standard"
            error={formik.touched.acknowledge && Boolean(formik.errors.acknowledge)}
          >
          <FormGroup style={{ width: '50%' }}>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={disabledField}
                  checked={acknowledge}
                  onClick={() => setAcknowledge(!acknowledge)}
                />
              }
              label={
                <Paragraph size='medium'>
                  I understand that Enrollment&apos;s records will be requested from his/her prior school anytime after
                  June 1 (for Fall enrollments) or January 15 (for mid-year enrollments).
                </Paragraph>
              }
            />
          </FormGroup>
          <FormLabel sx={{color: ERROR_RED}}>{formik.touched.acknowledge && formik.errors.acknowledge}</FormLabel>
          </FormControl>
        </Grid>
        <Box sx={classes.buttonContainer}>
          <Button
            sx={classes.button}
            type='submit'
          >
            <Paragraph fontWeight='700' size='medium'>
              { disabledField ? 'Next' : 'Save &amp; Continue'}
            </Paragraph>
          </Button>
        </Box>
      </Grid>
    </form>
  )
}
