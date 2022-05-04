import { useMutation } from '@apollo/client'
import { Alert, AlertColor, Avatar, Box, Button, Card, Grid, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { UserContext, UserInfo } from '../../../../providers/UserContext/UserProvider'
import { updateProfile, removeProfilePhoto } from '../service'
import { useStyles } from '../styles'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import { DocumentUploadModal } from '../../../Enrollment/Documents/components/DocumentUploadModal/DocumentUploadModal'
import { WarningModal } from '../../../../components/WarningModal/Warning'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { Prompt } from 'react-router-dom'
import { values } from 'lodash'

type openAlertSaveType = {
  message: string,
  status: AlertColor,
  open: boolean,
}

export const Profile = ({handleIsFormChange}) => {
  const classes = useStyles
  const { me } = useContext(UserContext)
  const { profile } = me as UserInfo
  
  const [submitUpdate, { data }] = useMutation(updateProfile)
  const [submitRemoveProfilePhoto, { data: userData }] = useMutation(removeProfilePhoto)

  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [warningModalOpen, setWarningModalOpen] = useState(false)
  const hasImage = !!me.avatar_url
  const [avatar, setAvatar] = useState(null)
  const [file, setFile] = useState<undefined | File>()
  
  const [openSaveAlert, setOpenSaveAlert] = useState<openAlertSaveType>({
    message: '',
    status: 'success',
    open: false,
  })

  const onSave = () => {
    submitUpdate({
      variables: {
        updateProfileInput: {
          email: formik.values.email,
          phone_number: formik.values.phoneNumber,
          preferred_first_name: formik.values.preferredFName,
          preferred_last_name: formik.values.preferredLName,
          first_name: profile?.first_name,
          last_name: profile?.last_name,
        },
      },
    }).then( async (res)  => {
      // fire upload fetch
      if(file) {
        const upload = await uploadPhoto(file)
        if(upload) {
          setOpenSaveAlert({ message: 'Profile Updated Successfully', status: 'success', open: true })

          setTimeout(() => {
            setOpenSaveAlert({ message: '', status: 'success', open: false })

            if(formik.values.email != profile.email)
              location.replace('/');
          }, 2000)
        }
        else {
          setOpenSaveAlert({ message: 'Unknown error occured while uploading profile photo.', status: 'error', open: true })

          setTimeout(() => {
            setOpenSaveAlert({ message: '', status: 'success', open: false })

            if(formik.values.email != profile.email)
              location.replace('/');
          }, 2000)
        }

        handleIsFormChange(false);
      }
      else {
        setOpenSaveAlert({ message: 'Profile Updated Successfully', status: 'success', open: true })

        setTimeout(() => {
          setOpenSaveAlert({ message: '', status: 'success', open: false })

          if(formik.values.email != profile.email)
            location.replace('/');
        }, 2000)

        handleIsFormChange(false);
      }
    }).catch(err => {
      setOpenSaveAlert({ message: err?.message, status: 'error', open: true })

      setTimeout(() => {
        setOpenSaveAlert({ message: '', status: 'success', open: false })
      }, 2000)

      handleIsFormChange(false);
    })
  }

  const onSubmitFailed = () => {
    formik.values.email = profile.email;
  }

  const onRemoveProfilePhoto = () => {
    setWarningModalOpen(!warningModalOpen)
    submitRemoveProfilePhoto().then((res) => {
      setFile(undefined)
      setAvatar(null)
    })
  }

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const validationSchema = yup.object({
    preferredFName: yup
      .string()
      .nullable(),
    preferredLName: yup
      .string()
      .nullable(),
    phoneNumber: yup
      .string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .required('Phone number is required')
      .nullable(),
    email: yup
      .string()
      .email('Please enter a valid email')
      .nullable()
      .required('Email is required'),
  })

  const formik = useFormik({
    initialValues: {
      preferredFName: profile?.preferred_first_name,
      preferredLName: profile?.preferred_last_name,
      phoneNumber: profile?.phone.number,
      email: profile?.email,
      first_name: profile?.first_name,
      last_name: profile?.last_name,
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      await onSave()
    }
  })

  const convertToBlob = (file) => {
    const fileUrl = URL.createObjectURL(file[0])
    return fileUrl
  }

  const getProfilePhoto = () => {
    if (!avatar) return

    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + me.avatar_url
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

  const openImageModal = () => setImageModalOpen(true)

  const handleFile = (fileName: File) => setFile(fileName)

  useEffect(() => {
    if (me && me.avatar_url)
      setAvatar(me.avatar_url)
  }, [me])

  const Image = () => (
    <Box display='flex' flexDirection='column' justifyContent={'center'} sx={{ height: 167, width: 167 }}>
      {file || avatar ? (
        <>
          <Avatar
            src={file ? convertToBlob(file) : getProfilePhoto()}
            variant='rounded'
            sx={{ height: '100%', width: '100%' }}
          />
          <Box onClick={() => setWarningModalOpen(true)} sx={{ cursor: 'pointer' }}>
            <Paragraph size='medium' fontWeight='500' textAlign='center' color='#4145FF'>
              Remove Profile Picture
            </Paragraph>
          </Box>
        </>
      ) : (
        <Box
          display='flex'
          flexDirection='column'
          justifyContent={'center'}
          sx={{ backgroundColor: '#FAFAFA', alignItems: 'center', cursor: 'pointer', height: '100%', width: '100%' }}
          onClick={() => openImageModal()}
        >
          <SystemUpdateAltIcon />
          <Paragraph size='medium' fontWeight='500'>
            Upload Photo
          </Paragraph>
        </Box>
      )}
    </Box>
  )

  return (
    <form onSubmit={formik.handleSubmit} style={{ height: '100%' }}>
      <Card>
        <Grid container paddingX={6} paddingBottom={6} rowSpacing={2} marginTop={1} sx={classes.gridContainer}>
          <Grid item xs={9}>
            <Subtitle size='large' fontWeight='700'>
              Profile
            </Subtitle>
          </Grid>
          <Grid item xs={3}>
            <Box display='flex' justifyContent='flex-end'>
              <Button variant='contained' sx={classes.saveButton} type='submit'>
                <Paragraph size='medium' fontWeight='700'>
                  Save Changes
                </Paragraph>
              </Button>
            </Box>
          </Grid>
          <Grid item container rowSpacing={2} xs={12} paddingX={6}>
            <Grid item xs={3} padding={2}>
              {Image()}
            </Grid>
            <Grid item xs={3} padding={2}>
              <Box display='flex' flexDirection='column' height='100%' justifyContent='flex-end'>
                <Paragraph size='medium' fontWeight='500'>
                  Preferred First Name
                </Paragraph>
                <TextField
                  name='preferredFName'
                  value={formik.values.preferredFName}
                  onChange={(e) => {
                    handleIsFormChange(true);
                    formik.handleChange(e);
                  }}
                  error={formik.touched.preferredFName && Boolean(formik.errors.preferredFName)}
                  helperText={formik.touched.preferredFName && formik.errors.preferredFName}
                />
              </Box>
            </Grid>
            <Grid item xs={6} padding={2}>
              <Box display='flex' flexDirection='column' width={'50%'} height='100%' justifyContent='flex-end'>
                <Paragraph size='medium' fontWeight='500'>
                  Preferred Last Name
                </Paragraph>
                <TextField
                  name='preferredLName'
                  value={formik.values.preferredLName}
                  onChange={(e) => {
                    handleIsFormChange(true);
                    formik.handleChange(e);
                  }}
                  error={formik.touched.preferredLName && Boolean(formik.errors.preferredLName)}
                  helperText={formik.touched.preferredLName && formik.errors.preferredLName}
                />
              </Box>
            </Grid>
            <Grid item xs={3} padding={2}>
              <Box display='flex' flexDirection='column'>
                <Paragraph size='medium' fontWeight='500'>
                  Phone
                </Paragraph>
                <TextField
                  name='phoneNumber'
                  value={formik.values.phoneNumber}
                  onChange={(e) => {
                    handleIsFormChange(true);
                    formik.handleChange(e);
                  }}
                  error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                />
              </Box>
            </Grid>
            <Grid item xs={3} padding={2}>
              <Box display='flex' flexDirection='column'>
                <Paragraph size='medium' fontWeight='500'>
                  Email
                </Paragraph>
                <TextField
                  name='email'
                  value={formik.values.email}
                  onChange={(e) => {
                    handleIsFormChange(true);
                    formik.handleChange(e);
                  }}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid>
          {openSaveAlert.open && (<Alert
            sx={{
              position: 'relative'
            }}
            onClose={() => {
              setOpenSaveAlert({ open: false, status: 'success', message: '' })
            }}
            severity={openSaveAlert.status}
          >
            {openSaveAlert.message}
          </Alert>)}
        </Grid>
        {imageModalOpen && (
          <DocumentUploadModal handleModem={() => setImageModalOpen(!imageModalOpen)} handleFile={handleFile} 
          limit={1} />
        )}
        {warningModalOpen && (
          <WarningModal
            handleSubmit={() => onRemoveProfilePhoto()}
            handleModem={() => setWarningModalOpen(!warningModalOpen)}
            title='Delete Image'
            subtitle='Are you sure you  want to delete this image'
          />
        )}
      </Card>
    </form>
  )
}
