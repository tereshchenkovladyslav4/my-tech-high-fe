import React, { useContext, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import {
  Alert,
  AlertColor,
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { CustomConfirmModal } from '../../../components/CustomConfirmModal/CustomConfirmModal'
import { DropDown } from '../../../components/DropDown/DropDown'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { UserContext, UserInfo } from '../../../providers/UserContext/UserProvider'
import { usStates } from '../../../utils/states'
import { DocumentUploadModal } from '../../Enrollment/Documents/components/DocumentUploadModal/DocumentUploadModal'
import { updateProfile, removeProfilePhoto } from '../service'
import { useStyles } from '../styles'
import { ProfileTemplateType } from './types'

type openAlertSaveType = {
  message: string
  status: AlertColor
  open: boolean
}

export const Profile: ProfileTemplateType = ({ handleIsFormChange }) => {
  const classes = useStyles
  const { me, setMe } = useContext(UserContext)
  const { profile } = me as UserInfo
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [warningModalOpen, setWarningModalOpen] = useState({ title: '', subtitle: '', callback: null })
  const [avatar, setAvatar] = useState<string | null>(null)
  const [recieveText, setRecieveText] = useState(false)
  const [file, setFile] = useState<undefined | File>()

  const [openSaveAlert, setOpenSaveAlert] = useState<openAlertSaveType>({
    message: '',
    status: 'success',
    open: false,
  })
  const [submitUpdate] = useMutation(updateProfile)
  const [submitRemoveProfilePhoto] = useMutation(removeProfilePhoto)

  const uploadPhoto = async (file) => {
    if (file) {
      const bodyFormData = new FormData()
      bodyFormData.append('file', file[0])
      bodyFormData.append('region', 'UT')
      bodyFormData.append('year', '2022')

      const response = await fetch(import.meta.env.SNOWPACK_PUBLIC_S3_UPLOAD, {
        method: 'POST',
        body: bodyFormData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT')}`,
        },
      })
      const imageUrl = await response.json()
      return imageUrl.data.file.item1
    }
    return undefined
  }

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
          phone_number: formik.values.phoneNumber + '',
          preferred_first_name: formik.values.preferredFName,
          preferred_last_name: formik.values.preferredLName,
          state: formik.values.state,
          zipcode: formik.values.zipcode + '',
        },
      },
    })
      .then(async () => {
        // fire upload fetch
        let profileUrl = ''
        if (file) {
          profileUrl = await uploadPhoto(file)
          if (profileUrl) {
            setOpenSaveAlert({ message: 'Profile updated Successfully.', status: 'success', open: true })

            setTimeout(() => {
              setOpenSaveAlert({ message: '', status: 'success', open: false })
              if (formik.values.email != profile.email) location.replace('/')
            }, 2000)
          } else {
            setOpenSaveAlert({
              message: 'Unknown error occured while uploading profile photo.',
              status: 'error',
              open: true,
            })

            setTimeout(() => {
              setOpenSaveAlert({ message: '', status: 'success', open: false })

              if (formik.values.email != me.email) location.replace('/')
            }, 2000)
          }
          handleIsFormChange(false)
        } else {
          setOpenSaveAlert({ message: 'Profile updated Successfully.', status: 'success', open: true })

          setTimeout(() => {
            setOpenSaveAlert({ message: '', status: 'success', open: false })

            if (formik.values.email != me.email) location.replace('/')
          }, 2000)

          handleIsFormChange(false)

          if (formik.values.email != me.email) location.replace('/')
        }

        setMe((prevMe) => {
          return {
            ...prevMe,
            avatar_url: profileUrl,
            profile: {
              preferred_first_name: formik.values.preferredFName,
              preferred_last_name: formik.values.preferredLName,
              first_name: formik.values.legalFName,
              middle_name: formik.values.legalMName,
              last_name: formik.values.legalLName,
              phone: {
                number: formik.values.phoneNumber + '',
                recieve_text: recieveText ? 1 : 0,
              },
              email: formik.values.email,
              address: {
                city: formik.values.city,
                street: formik.values.address1,
                street2: formik.values.address2,
                state: formik.values.state,
                zip: formik.values.zipcode + '',
              },
            },
          }
        })
      })
      .catch(() => {
        setOpenSaveAlert({
          message: 'The email is already in use. Please use different email address.',
          status: 'error',
          open: true,
        })

        setTimeout(() => {
          setOpenSaveAlert({ message: '', status: 'success', open: false })
        }, 2000)

        handleIsFormChange(false)
      })
  }

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const validationSchema = yup.object({
    preferredFName: yup.string().nullable(),
    preferredLName: yup.string().nullable(),
    legalFName: yup.string().required('Legal First Name is required').nullable(),
    legalMName: yup.string().nullable(),
    legalLName: yup.string().required('Legal Last Name is required').nullable(),
    phoneNumber: yup
      .string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .required('Phone number is required')
      .nullable(),
    email: yup.string().email('Please enter a valid email').nullable().required('Email is required'),
    city: yup.string().nullable().required('City is required'),
    recieveText: yup.boolean().nullable(),
    address1: yup.string().nullable().required('Address line 1 is required'),
    address2: yup.string().nullable(),
    state: yup.string().required('State is required').nullable(),
    zipcode: yup.string().required('Zipcode is required').nullable(),
  })

  const formik = useFormik({
    initialValues: {
      preferredFName: profile?.preferred_first_name || '',
      preferredLName: profile?.preferred_last_name || '',
      legalFName: profile?.first_name || '',
      legalMName: profile?.middle_name || '',
      legalLName: profile?.last_name || '',
      phoneNumber: profile?.phone.number || '',
      email: me.email,
      city: profile?.address.city || '',
      recieveText: Boolean(profile?.phone?.recieve_text || ''),
      address1: profile?.address?.street || '',
      address2: profile?.address?.street2 || '',
      state: profile?.address?.state || '',
      zipcode: profile?.address?.zip || '',
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      console.log(me.email, formik.values.email)
      if (me.email != formik.values.email) {
        setWarningModalOpen({
          title: 'Change Email',
          subtitle:
            'Changing your email requires a new verification link to be sent. You will be logged out until you verify your new email. Would you like to proceed?',
          callback: onSave,
        })
      } else await onSave()
    },
  })

  const convertToBlob = (file) => {
    const fileUrl = URL.createObjectURL(file[0])
    return fileUrl
  }

  const getProfilePhoto = (): string | undefined => {
    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    if (avatar) {
      return s3URL + me?.avatar_url
    } else {
      return undefined
    }
  }

  const openImageModal = () => setImageModalOpen(true)

  const handleFile = (fileName: File) => setFile(fileName)

  useEffect(() => {
    if (me && me.avatar_url) setAvatar(me?.avatar_url)
  }, [me])

  useEffect(() => {
    setRecieveText(Boolean(profile?.phone?.recieve_text))
  }, [])

  const Image = () => (
    <Box display='flex' flexDirection='column' justifyContent={'center'} sx={{ height: 167, width: 167 }}>
      {file || avatar ? (
        <>
          <Avatar
            src={file ? convertToBlob(file) : getProfilePhoto()}
            variant='rounded'
            sx={{ height: '100%', width: '100%' }}
          />
          <Box
            component='a'
            onClick={() =>
              setWarningModalOpen({
                title: 'Delete Image',
                subtitle: 'Are you sure you	want to delete this image',
                callback: () => {
                  submitRemoveProfilePhoto().then(() => {
                    setFile(undefined)
                    setAvatar(null)
                  })
                },
              })
            }
            sx={{ cursor: 'pointer', p: 1, zIndex: 999 }}
          >
            <Paragraph size='medium' color='#7B61FF' fontWeight='500' textAlign='center'>
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
    <form onSubmit={formik.handleSubmit} style={{ display: 'flex', height: '100%' }}>
      <Card>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={classes.gridContainer}>
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
          <Grid item xs={3}>
            {Image()}
          </Grid>
          <Grid item xs={3}>
            <Box display='flex' flexDirection='column' height='100%' justifyContent='flex-end'>
              <Paragraph size='medium' fontWeight='500'>
                Preferred First Name
              </Paragraph>
              <TextField
                name='preferredFName'
                value={formik.values.preferredFName}
                onChange={(e) => {
                  handleIsFormChange(true)
                  formik.handleChange(e)
                }}
                error={formik.touched.preferredFName && Boolean(formik.errors.preferredFName)}
                helperText={formik.touched.preferredFName && formik.errors.preferredFName}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display='flex' flexDirection='column' width={'50%'} height='100%' justifyContent='flex-end'>
              <Paragraph size='medium' fontWeight='500'>
                Preferred Last Name
              </Paragraph>
              <TextField
                name='preferredLName'
                value={formik.values.preferredLName}
                onChange={(e) => {
                  handleIsFormChange(true)
                  formik.handleChange(e)
                }}
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
                onChange={(e) => {
                  handleIsFormChange(true)
                  formik.handleChange(e)
                }}
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
                onChange={(e) => {
                  handleIsFormChange(true)
                  formik.handleChange(e)
                }}
                error={formik.touched.legalMName && Boolean(formik.errors.legalMName)}
                helperText={formik.touched.legalMName && formik.errors.legalMName}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display='flex' flexDirection='column' width={'50%'}>
              <Paragraph size='medium' fontWeight='500'>
                Legal Last Name
              </Paragraph>
              <TextField
                name='legalLName'
                value={formik.values.legalLName}
                onChange={(e) => {
                  handleIsFormChange(true)
                  formik.handleChange(e)
                }}
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
                type='number'
                value={formik.values.phoneNumber}
                onChange={(e) => {
                  handleIsFormChange(true)
                  formik.handleChange(e)
                }}
                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              />
              <FormControlLabel
                control={
                  <Checkbox checked={recieveText} onClick={() => setRecieveText(!recieveText)} name='recieveText' />
                }
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
                onChange={(e) => {
                  handleIsFormChange(true)
                  formik.handleChange(e)
                }}
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
                onChange={(e) => {
                  handleIsFormChange(true)
                  formik.handleChange(e)
                }}
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
                onChange={(e) => {
                  handleIsFormChange(true)
                  formik.handleChange(e)
                }}
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
              <DropDown
                dropDownItems={usStates}
                setParentValue={(val) => {
                  formik.values.state = val
                  handleIsFormChange(true)
                }}
                alternate={true}
                size='medium'
                defaultValue={formik.values.state || ''}
              />
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box display='flex' flexDirection='column'>
              <Paragraph size='medium' fontWeight='500'>
                Zip
              </Paragraph>
              <TextField
                name='zipcode'
                type='number'
                value={formik.values.zipcode}
                onChange={(e) => {
                  handleIsFormChange(true)
                  formik.handleChange(e)
                }}
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
                onChange={(e) => {
                  handleIsFormChange(true)
                  formik.handleChange(e)
                }}
                error={formik.touched.address2 && Boolean(formik.errors.address2)}
                helperText={formik.touched.address2 && formik.errors.address2}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid>
          {openSaveAlert.open && (
            <Alert
              sx={{
                position: 'relative',
                bottom: '-83px',
              }}
              onClose={() => {
                setOpenSaveAlert({ open: false, status: 'success', message: '' })
              }}
              severity={openSaveAlert.status}
            >
              {openSaveAlert.message}
            </Alert>
          )}
        </Grid>
        {imageModalOpen && (
          <DocumentUploadModal
            handleModem={() => setImageModalOpen(!imageModalOpen)}
            handleFile={handleFile}
            limit={1}
          />
        )}
        {warningModalOpen && warningModalOpen.title + warningModalOpen.subtitle != '' && (
          <CustomConfirmModal
            header={warningModalOpen.title}
            content={warningModalOpen.subtitle}
            handleConfirmModalChange={(val: boolean, isOk: boolean) => {
              if (isOk && warningModalOpen.callback) warningModalOpen.callback()
              setWarningModalOpen({ title: '', subtitle: '', callback: null })
            }}
          />
        )}
      </Card>
    </form>
  )
}
