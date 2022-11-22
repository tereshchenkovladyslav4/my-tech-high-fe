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
import { CustomConfirmModal } from '@mth/components/CustomConfirmModal/CustomConfirmModal'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { SNOWPACK_PUBLIC_S3_UPLOAD } from '@mth/constants'
import { UserContext, UserInfo } from '@mth/providers/UserContext/UserProvider'
import { usStates } from '../../../utils/states'
import { ImageCropper } from '../ImageCropper'
import { updateProfile } from '../service'
import { settingClasses } from '../styles'
import { ProfileProps } from './types'

type openAlertSaveType = {
  message: string
  status: AlertColor
  open: boolean
}

export const Profile: React.FC<ProfileProps> = ({ handleIsFormChange }) => {
  const { me, setMe } = useContext(UserContext)
  const { profile } = me as UserInfo
  const [warningModalOpen, setWarningModalOpen] = useState<{
    title: string
    subtitle: string
    callback?: () => void
  }>({
    title: '',
    subtitle: '',
  })
  const [avatar, setAvatar] = useState<string | null>(null)
  const [receiveText, setReceiveText] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | undefined>()
  const [open, setOpen] = useState<boolean>(false)
  const [imageToCrop, setImageToCrop] = useState<string | ArrayBuffer | null>('')

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpen(false)
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        const image = reader.result
        setImageToCrop(image)
        handleClickOpen()
        e.target.value = ''
      })

      reader.readAsDataURL(e.target.files[0])
    }
  }

  const [openSaveAlert, setOpenSaveAlert] = useState<openAlertSaveType>({
    message: '',
    status: 'success',
    open: false,
  })
  const [submitUpdate] = useMutation(updateProfile)

  const uploadPhoto = async (file: File) => {
    if (file) {
      const bodyFormData = new FormData()
      bodyFormData.append('file', file)
      bodyFormData.append('region', 'UT')
      bodyFormData.append('year', '2022')

      const response = await fetch(SNOWPACK_PUBLIC_S3_UPLOAD, {
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
    let profileUrl = avatar
    if (uploadedFile) {
      profileUrl = await uploadPhoto(uploadedFile)
      if (!profileUrl) {
        setOpenSaveAlert({
          message: 'Unknown error occurred while uploading profile photo.',
          status: 'error',
          open: true,
        })
        return
      }
    }
    submitUpdate({
      variables: {
        updateProfileInput: {
          avatar_url: profileUrl,
          address_1: formik.values.address1,
          address_2: formik.values.address2,
          city: formik.values.city,
          email: formik.values.email,
          first_name: formik.values.legalFName,
          recieve_text: receiveText ? 1 : 0,
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
        setOpenSaveAlert({ message: 'Profile Updated Successfully', status: 'success', open: true })

        setTimeout(() => {
          setOpenSaveAlert({ message: '', status: 'success', open: false })

          if (formik.values.email !== me?.email) location.replace('/')
        }, 2000)

        handleIsFormChange(false)

        if (formik.values.email !== me?.email) location.replace('/')
        // fire upload fetch

        setMe((prevMe) => {
          return {
            ...prevMe,
            avatar_url: profileUrl || prevMe?.avatar_url,
            profile: {
              preferred_first_name: formik.values.preferredFName,
              preferred_last_name: formik.values.preferredLName,
              first_name: formik.values.legalFName,
              middle_name: formik.values.legalMName,
              last_name: formik.values.legalLName,
              phone: {
                number: formik.values.phoneNumber + '',
                recieve_text: receiveText ? 1 : 0,
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
          } as UserInfo
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
    legalFName: yup.string().required('Required').nullable(),
    legalMName: yup.string().nullable(),
    legalLName: yup.string().required('Required').nullable(),
    phoneNumber: yup.string().matches(phoneRegExp, 'Phone number is not valid').required('Required').nullable(),
    email: yup.string().email('Please enter a valid email').nullable().required('Required'),
    city: yup.string().nullable().required('Required'),
    receiveText: yup.boolean().nullable(),
    address1: yup.string().nullable().required('Required'),
    address2: yup.string().nullable(),
    state: yup.string().required('Required').nullable(),
    zipcode: yup.string().required('Required').nullable(),
  })

  const formik = useFormik({
    initialValues: {
      preferredFName: profile?.preferred_first_name || '',
      preferredLName: profile?.preferred_last_name || '',
      legalFName: profile?.first_name || '',
      legalMName: profile?.middle_name || '',
      legalLName: profile?.last_name || '',
      phoneNumber: profile?.phone?.number || '',
      email: me?.email || '',
      city: profile?.address.city || '',
      receiveText: Boolean(profile?.phone?.recieve_text || ''),
      address1: profile?.address?.street || '',
      address2: profile?.address?.street2 || '',
      state: profile?.address?.state || '',
      zipcode: profile?.address?.zip || '',
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      if (me?.email !== formik.values.email) {
        setWarningModalOpen({
          title: 'Change Email',
          subtitle:
            'Changing your email requires a new verification link to be sent. You will be logged out until you verify your new email. Would you like to proceed?',
          callback: onSave,
        })
      } else await onSave()
    },
  })

  const convertToBlob = (file: File) => {
    return URL.createObjectURL(file)
  }

  const getProfilePhoto = (): string | undefined => {
    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    if (avatar) {
      return s3URL + me?.avatar_url
    } else {
      return undefined
    }
  }

  useEffect(() => {
    if (me && me.avatar_url) setAvatar(me?.avatar_url)
  }, [me])

  useEffect(() => {
    setReceiveText(Boolean(profile?.phone?.recieve_text))
  }, [])

  const Image = () => (
    <Box display='flex' flexDirection='column' justifyContent={'center'} sx={{ height: 167, width: 167 }}>
      <input
        style={{ display: 'none' }}
        id='uploadProfileImageId'
        type='file'
        accept='image/png, image/jpeg'
        onChange={(e) => handleFileInput(e)}
      />
      <label style={{ display: 'flex', justifyContent: 'space-around', minWidth: 160 }} htmlFor='uploadProfileImageId'>
        {uploadedFile || avatar ? (
          <>
            <Avatar
              src={uploadedFile ? convertToBlob(uploadedFile) : getProfilePhoto()}
              variant='rounded'
              sx={{ height: '100%', width: '100%', cursor: 'pointer' }}
            />
          </>
        ) : (
          <Box
            display='flex'
            flexDirection='column'
            justifyContent={'center'}
            sx={{ backgroundColor: '#FAFAFA', alignItems: 'center', cursor: 'pointer', height: '100%', width: '100%' }}
          >
            <SystemUpdateAltIcon />
            <Paragraph size='medium' fontWeight='500'>
              Upload Photo
            </Paragraph>
          </Box>
        )}
      </label>
      {open && <ImageCropper imageToCrop={imageToCrop} setProfileFile={setUploadedFile} />}
    </Box>
  )

  return (
    <Box>
      <form onSubmit={formik.handleSubmit} style={{ display: 'flex', height: '100%' }}>
        <Card>
          <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={settingClasses.gridContainer}>
            <Grid item xs={9}>
              <Subtitle size='large' fontWeight='700'>
                Profile
              </Subtitle>
            </Grid>
            <Grid item xs={3}>
              <Box display='flex' justifyContent='flex-end'>
                <Button variant='contained' sx={settingClasses.saveButton} type='submit'>
                  <Paragraph size='medium' fontWeight='700'>
                    Save Changes
                  </Paragraph>
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              {Image()}
            </Grid>
            <Grid item xs={6} sm={3}>
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
            <Grid item xs={6} sm={6}>
              <Box
                display='flex'
                flexDirection='column'
                width={{ xs: '100%', sm: '50%' }}
                height='100%'
                justifyContent='flex-end'
              >
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
            <Grid item xs={6} sm={3}>
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
            <Grid item xs={6} sm={3}>
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
            <Grid item xs={12} sm={6}>
              <Box display='flex' flexDirection='column' width={{ xs: '100%', sm: '50%' }}>
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
            <Grid item xs={12} sm={3}>
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
                    <Checkbox checked={receiveText} onClick={() => setReceiveText(!receiveText)} name='receiveText' />
                  }
                  label={<Paragraph size='medium'>I can receive text messages via this number</Paragraph>}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={3}>
              <Box display='flex' flexDirection='column'>
                <Paragraph size='medium' fontWeight='500'>
                  State
                </Paragraph>
                <DropDown
                  dropDownItems={usStates}
                  setParentValue={(val) => {
                    formik.values.state = val?.toString()
                    handleIsFormChange(true)
                  }}
                  alternate={true}
                  size='medium'
                  defaultValue={formik.values.state || ''}
                  error={{
                    error: formik.touched.state && Boolean(formik.errors.state),
                    errorMsg: formik.touched.state && Boolean(formik.errors.state) ? 'Required' : '',
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
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
            <Grid item xs={6} sm={6}>
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
          {warningModalOpen && warningModalOpen.title + warningModalOpen.subtitle != '' && (
            <CustomConfirmModal
              header={warningModalOpen.title}
              content={warningModalOpen.subtitle}
              handleConfirmModalChange={(isOk: boolean) => {
                if (isOk && warningModalOpen.callback) warningModalOpen.callback()
                setWarningModalOpen({ title: '', subtitle: '' })
              }}
            />
          )}
        </Card>
      </form>
    </Box>
  )
}
