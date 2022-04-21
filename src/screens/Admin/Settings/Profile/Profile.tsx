import { useMutation } from '@apollo/client'
import { Avatar, Box, Button, Card, Grid, TextField } from '@mui/material'
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

const Profile = () => {
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

  const onSave = () => {
    // submitUpdate({
    //   variables: {
    //     updateProfileInput: {
    //       email: formik.values.email,
    //       phone_number: formik.values.phoneNumber,
    //       preferred_first_name: formik.values.preferredFName,
    //       preferred_last_name: formik.values.preferredLName,
    //     },
    //   },
    // }).then((res) => {
    //   // set catch and then here, return snackbox for both success and fail
    // })
    // // fire upload fetch
    // uploadPhoto(file)
  }

  const onRemoveProfilePhoto = () => {
    setWarningModalOpen(!warningModalOpen)
    submitRemoveProfilePhoto().then((res) => {
      setFile(undefined)
      setAvatar(null)
    })
  }

  const validationSchema = yup.object({
    preferredFName: yup.string().nullable(),
    preferredLName: yup.string().nullable(),
    phoneNumber: yup.string().required('Phone number is required').nullable(),
    email: yup.string().email('Please enter a valid email').nullable().required('Email is required'),
  })

  const formik = useFormik({
    initialValues: {
      preferredFName: '',
      preferredLName: '',
      phoneNumber: '',
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      await onSave()
    },
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

  const uploadPhoto = (file) => {
    var bodyFormData = new FormData()
    if (file) {
      bodyFormData.append('file', file[0])
      bodyFormData.append('region', 'UT')
      bodyFormData.append('year', '2022')
      fetch(import.meta.env.SNOWPACK_PUBLIC_S3_UPLOAD, {
        method: 'POST',
        body: bodyFormData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT')}`,
        },
      }).then(async (res) => {
        res.json().then(({ data }) => {
          console.log('Upload: ', data)
        })
      })
    }
  }

  const openImageModal = () => setImageModalOpen(true)

  const handleFile = (fileName: File) => setFile(fileName)

  useEffect(() => {
    if (me && me.avatar_url) setAvatar(me.avatar_url)

    console.log(file), [file]
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
            <Paragraph size='medium' fontWeight='500' textAlign='center'>
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
            <Grid item xs={3} paddingX={2}>
              {Image()}
            </Grid>
            <Grid item xs={3} paddingX={2}>
              <Box display='flex' flexDirection='column' height='100%' justifyContent='flex-end'>
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
            <Grid item xs={6} paddingX={2}>
              <Box display='flex' flexDirection='column' width={'50%'} height='100%' justifyContent='flex-end'>
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
            <Grid item xs={3} paddingX={2}>
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
              </Box>
            </Grid>
            <Grid item xs={3} paddingX={2}>
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
          </Grid>
        </Grid>
        {imageModalOpen && (
          <DocumentUploadModal handleModem={() => setImageModalOpen(!imageModalOpen)} handleFile={handleFile} />
        )}
        {warningModalOpen && (
          <WarningModal
            handleSubmit={() => onRemoveProfilePhoto()}
            handleModem={() => setWarningModalOpen(!warningModalOpen)}
            title='Delete Image'
            subtitle='Are you sure you  want to delete  this image'
          />
        )}
      </Card>
    </form>
  )
}
export { Profile as default }
