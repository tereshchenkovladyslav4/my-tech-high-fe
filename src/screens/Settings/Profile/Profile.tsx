import { useMutation } from '@apollo/client'
import { Avatar, Box, Button, Card, Checkbox, FormControlLabel, Grid, OutlinedInput, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { UserContext, UserInfo } from '../../../providers/UserContext/UserProvider'
import { updateProfile, removeProfilePhoto } from '../service'
import { useStyles } from '../styles'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { DocumentUploadModal } from '../../Enrollment/Documents/components/DocumentUploadModal/DocumentUploadModal'
import { WarningModal } from '../../../components/WarningModal/Warning'
import * as yup from 'yup';
import { useFormik } from 'formik';

export const Profile = () => {

  const classes = useStyles
  const { me } = useContext(UserContext)
  const { profile } = me as UserInfo

  const [submitUpdate, { data }] = useMutation(updateProfile)
  const [submitRemoveProfilePhoto, {data:userData}] = useMutation(removeProfilePhoto);

  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [warningModalOpen, setWarningModalOpen] = useState(false)
  const hasImage = !!me.avatar_url
  const [avatar, setAvatar] = useState(null);
  //const [prefFirstName, setPrefFirstName] = useState(profile.preferred_first_name)
  //const [prefLastName, setPrefLastName] = useState(profile.preferred_last_name)
  //const [firstName, setFirstName] = useState(profile.first_name)
  //const [middleName, setMiddleName] = useState(profile.middle_name)
  //const [lastName, setLastName] = useState(profile.last_name)
  //const [phone, setPhone] = useState(profile.phone.number)
  //const [email, setEmail] = useState(profile.email)
  //const [city, setCity] = useState(profile.address.city)
  //const [recieveText, setRecieveText] = useState(false)
  //const [address, setAddress] = useState(profile.address.street)
  //const [state, setState] = useState(profile.address.state)
  //const [zipcode, setZipcode] = useState(profile.address.zip)
  //const [address2, setAddress2] = useState(profile.address.street2)
  const [recieveText, setRecieveText] = useState(false)
  const [file, setFile] = useState<undefined | File>()

  const uploadLimit = 1

  const onSave = async () => {
    submitUpdate({
      variables: {
        updateProfileInput: {
          address_1: formik.values.address1,
          address_2: formik.values.address2,
          city: formik.values.city,
          email: formik.values.email,
          first_name: formik.values.legalFName,
          recieve_text: recieveText ? 1 : 0,
          last_name: formik.values.legalLName,
          middle_name: formik.values.legalMName,
          phone_number: formik.values.phoneNumber,
          preferred_first_name: formik.values.preferredFName,
          preferred_last_name: formik.values.preferredLName,
          state: formik.values.state,
          zipcode: formik.values.zipcode
        },
      },
    }).then( async (res)  => {
      // set catch and then here, return snackbox for both success and fail

      // fire upload fetch
      const upload = await uploadPhoto(file)
      if(upload){
        location.reload()
      } 
        
    })

    
  }

  const onRemoveProfilePhoto = () => {
    setWarningModalOpen(!warningModalOpen)
    submitRemoveProfilePhoto().then((res) => {
      setFile(undefined)
      setAvatar(null)
    })
  }

  const validationSchema = yup.object({
    preferredFName: yup
      .string()
      .nullable(),
    preferredLName: yup
      .string()
      .nullable(),
    legalFName: yup
      .string()
      .required('Legal First Name is required')
      .nullable(),
    legalMName: yup
      .string()
      .nullable(),
    legalLName: yup
      .string()
      .required('Legal Last Name is required')
      .nullable(),
    phoneNumber: yup
      .string()
      .required('Phone number is required')
      .nullable(),
    email: yup
      .string()
      .email('Please enter a valid email')
      .nullable()
      .required('Email is required'),
    city: yup
      .string()
      .nullable()
      .required('City is required'),
    recieveText: yup
      .boolean()
      .nullable(),
    address1: yup
      .string()
      .nullable()
      .required('Address line 1 is required'),
    address2: yup
      .string()
      .nullable(),
    state: yup
      .string()
      .required('State is required')
      .nullable(),
    zipcode: yup
      .string()
      .required('Zipcode is required')
      .nullable(),
  })

  const formik = useFormik({
    initialValues: {
      preferredFName: profile.preferred_first_name,
      preferredLName: profile.preferred_last_name,
      legalFName: profile.first_name,
      legalMName: profile.middle_name,
      legalLName: profile.last_name,
      phoneNumber: profile.phone.number,
      email: profile.email,
      city: profile.address.city,
      recieveText: Boolean(profile.phone.recieve_text),
      address1: profile.address.street,
      address2: profile.address.street2,
      state: profile.address.state,
      zipcode: profile.address.zip,
    },
    validationSchema: validationSchema,
    onSubmit: async() => {
      await onSave()
    },
  })

  const convertToBlob = (file) => {
    const fileUrl = URL.createObjectURL(file[0])
    return fileUrl
  }

  const getProfilePhoto = () => {
      if( !avatar )
      return;

      const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/';
      return s3URL + me.avatar_url;
  }

  const uploadPhoto = async (file) => {

    if(!file)
      return

    var bodyFormData = new FormData()
      bodyFormData.append('file',file[0])
      bodyFormData.append('region', 'UT')
      bodyFormData.append('year', '2022')

    return fetch( import.meta.env.SNOWPACK_PUBLIC_S3_UPLOAD,{
          method: 'POST',
          body: bodyFormData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('JWT')}`
          },
        })
        .then( async(res) => {
          return res.json()
            .then( ({data}) => {
              return data;
            })
          })
  }

  const openImageModal = () =>  setImageModalOpen(true)

  const handleFile = (fileName: File) => setFile(fileName)

  useEffect(() => {
    if(me && me.avatar_url)
      setAvatar(me.avatar_url)

    console.log(file), [file]
  }, [me] )

  useEffect(() => {
    setRecieveText( Boolean( profile.phone.recieve_text ))
  }, [])

  const Image = () => (
    <Box 
      display='flex' 
      flexDirection='column' 
      justifyContent={'center'}
      sx={{height: 167, width: 167}}
    >
    {
      ( file || avatar )
        ? <>
        <Avatar 
          src={file ? convertToBlob(file) : getProfilePhoto()} 
          variant='rounded' 
          sx={{height: '100%', width: '100%'}}  
        />
        <Box component='a' onClick={() => setWarningModalOpen(true)} sx={{cursor:'pointer',p: 1}}>
          <Paragraph size='medium' color='#7B61FF' fontWeight='500' textAlign='center'>Remove Profile Picture</Paragraph>
        </Box>
        </>
        : <Box 
          display='flex' 
          flexDirection='column' 
          justifyContent={'center'} 
          sx={{backgroundColor: '#FAFAFA', alignItems:'center', cursor:'pointer', height: '100%', width: '100%'}}
          onClick={() => openImageModal()}
        >
          <SystemUpdateAltIcon/>
          <Paragraph size='medium' fontWeight='500'>Upload Photo</Paragraph>
        </Box>
    }
  </Box>
  )

  return (
    <form onSubmit={formik.handleSubmit} style={{display: 'flex', height: '100%'}}>
    <Card>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={classes.gridContainer} >
        <Grid item xs={9}>
          <Subtitle size='large' fontWeight='700'>
            Profile
          </Subtitle>
        </Grid>
        <Grid item xs={3}>
          <Box display='flex' justifyContent='flex-end'>
            <Button variant='contained'sx={classes.saveButton} type='submit'>
              <Paragraph size='medium' fontWeight='700'>
                Save Changes
              </Paragraph>
            </Button>
          </Box>
        </Grid>
        <Grid item xs={3}>
          {Image()}
        </Grid>
        <Grid item xs={3}>
          <Box display='flex' flexDirection='column' height='100%' justifyContent='flex-end' >
            <Paragraph size='medium' fontWeight='500'>
              Preferred First Name
            </Paragraph>
            <TextField
              name='preferredFName'
              value={formik.values.preferredFName}
              onChange={formik.handleChange}
              error={formik.touched.preferredFName && Boolean(formik.errors.preferredFName)}
              helperText={formik.touched.preferredFName && formik.errors.preferredFName}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box display='flex' flexDirection='column' width={'50%'} height='100%' justifyContent='flex-end' >
            <Paragraph size='medium' fontWeight='500'>
              Preferred Last Name
            </Paragraph>
            <TextField
              name='preferredLName'
              value={formik.values.preferredLName}
              onChange={formik.handleChange}
              error={formik.touched.preferredLName && Boolean(formik.errors.preferredLName)}
              helperText={formik.touched.preferredLName && formik.errors.preferredLName}
            />
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box display='flex' flexDirection='column'>
            <Paragraph size='medium' fontWeight='500'>
              Legal First Name
            </Paragraph>
            <TextField
              name='legalFName'
              value={formik.values.legalFName}
              onChange={formik.handleChange}
              error={formik.touched.legalFName && Boolean(formik.errors.legalFName)}
              helperText={formik.touched.legalFName && formik.errors.legalFName}
            />
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box display='flex' flexDirection='column'>
            <Paragraph size='medium' fontWeight='500'>
              Legal Middle Name
            </Paragraph>
            <TextField
              name='legalMName'
              value={formik.values.legalMName}
              onChange={formik.handleChange}
              error={formik.touched.legalMName && Boolean(formik.errors.legalMName)}
              helperText={formik.touched.legalMName && formik.errors.legalMName}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box display='flex' flexDirection='column' width={'50%'}>
            <Paragraph size='medium' fontWeight='500'>
              Last Name
            </Paragraph>
            <TextField
              name='legalLName'
              value={formik.values.legalLName}
              onChange={formik.handleChange}
              error={formik.touched.legalLName && Boolean(formik.errors.legalLName)}
              helperText={formik.touched.legalLName && formik.errors.legalLName}
            />
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box display='flex' flexDirection='column'>
            <Paragraph size='medium' fontWeight='500'>
              Phone
            </Paragraph>
            <TextField
              name='phoneNumber'
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
              helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            />
            <FormControlLabel
              control={<Checkbox 
                checked={recieveText}
                onClick={() => setRecieveText(!recieveText)}
                name='recieveText'
              />}
              label={<Paragraph size='medium'>I can receive text messages via this number</Paragraph>}
            />
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box display='flex' flexDirection='column'>
            <Paragraph size='medium' fontWeight='500'>
              Email
            </Paragraph>
            <TextField
              name='email'
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box display='flex' flexDirection='column'>
            <Paragraph size='medium' fontWeight='500'>
              City
            </Paragraph>
            <TextField
              name='city'
              value={formik.values.city}
              onChange={formik.handleChange}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
            />
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box display='flex' flexDirection='column'>
            <Paragraph size='medium' fontWeight='500'>
              Address Line 1
            </Paragraph>
            <TextField
              name='address1'
              value={formik.values.address1}
              onChange={formik.handleChange}
              error={formik.touched.address1 && Boolean(formik.errors.address1)}
              helperText={formik.touched.address1 && formik.errors.address1}
            />
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box display='flex' flexDirection='column'>
            <Paragraph size='medium' fontWeight='500'>
              State
            </Paragraph>
            <TextField
              name='state'
              value={formik.values.state}
              onChange={formik.handleChange}
              error={formik.touched.state && Boolean(formik.errors.state)}
              helperText={formik.touched.state && formik.errors.state}
            />
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box display='flex' flexDirection='column'>
            <Paragraph size='medium' fontWeight='500'>
              Zipcode
            </Paragraph>
            <TextField
              name='zipcode'
              value={formik.values.zipcode}
              onChange={formik.handleChange}
              error={formik.touched.zipcode && Boolean(formik.errors.zipcode)}
              helperText={formik.touched.zipcode && formik.errors.zipcode}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box display='flex' flexDirection='column'>
            <Paragraph size='medium' fontWeight='500'>
              Address Line 2
            </Paragraph>
            <TextField
              name='address2'
              value={formik.values.address2}
              onChange={formik.handleChange}
              error={formik.touched.address2 && Boolean(formik.errors.address2)}
              helperText={formik.touched.address2 && formik.errors.address2}
            />
          </Box>
        </Grid>
      </Grid>
      { 
        imageModalOpen 
          && <DocumentUploadModal
            handleModem={() => setImageModalOpen(!imageModalOpen)}
            handleFile={handleFile}
            limit={uploadLimit}
          /> 
      }
      {
        warningModalOpen 
          && <WarningModal
            handleSubmit={() => onRemoveProfilePhoto()}
            handleModem={() => setWarningModalOpen(!warningModalOpen)}
            title='Delete Image'
            subtitle='Are you sure you  want to delete  this image'
          /> 
			}
    </Card>
    </form>
  )
}

