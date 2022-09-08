import React, { useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Alert, AlertColor, Box, Button, Card, Grid, TextField } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { UserContext, UserInfo } from '@mth/providers/UserContext/UserProvider'
import { updatePassword } from '../service'
import { settingClasses } from '../styles'
import { AccountProps } from './types'

type openAlertSaveType = {
  message: string
  status: AlertColor
  open: boolean
}

export const Account: React.FC<AccountProps> = ({ handleIsFormChange }) => {
  const { me } = useContext(UserContext)
  const { profile } = me as UserInfo
  const [updatePasswordMutation] = useMutation(updatePassword)

  const [openSaveAlert, setOpenSaveAlert] = useState<openAlertSaveType>({
    message: '',
    status: 'success',
    open: false,
  })

  const onSave = async () => {
    await updatePasswordMutation({
      variables: {
        updateAccountInput: {
          oldpassword: '',
          password: formik.values.newPassword,
        },
      },
    })
      .then(() => {
        setOpenSaveAlert({ message: 'New Password Saved', status: 'success', open: true })
        window.scroll({
          top: 100,
          behavior: 'smooth',
        })

        setTimeout(() => {
          setOpenSaveAlert({ message: '', status: 'success', open: false })
        }, 2000)

        handleIsFormChange(false)
      })
      .catch((err) => {
        setOpenSaveAlert({ message: err?.message, status: 'error', open: true })
        window.scroll({
          top: 100,
          behavior: 'smooth',
        })
        setTimeout(() => {
          setOpenSaveAlert({ message: '', status: 'success', open: false })
        }, 2000)

        handleIsFormChange(false)
      })
  }

  const validationSchema = yup.object({
    newPassword: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        'Passwords must contain 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character.',
      )
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .required('Re-Enter password is required')
      .oneOf([yup.ref('newPassword')], 'Passwords do not match'),
  })

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      await onSave()
    },
  })

  return (
    <form onSubmit={formik.handleSubmit} style={{ display: 'flex', minHeight: '75vh' }}>
      <Card sx={{ width: '100%' }}>
        {/* Needed to prevent auto complete for the new password field */}
        <Box sx={{ width: 0, height: 0, overflow: 'hidden' }}>
          <TextField name='fakePassword' type='password' autoComplete='off' />
        </Box>
        <Grid container paddingX={6} rowSpacing={2} marginTop={1} sx={settingClasses.gridContainer}>
          <Grid item xs={12} textAlign={'left'} display='flex' flexDirection={'row'} alignItems='center'>
            <Subtitle fontWeight='700' size='large'>
              Account
            </Subtitle>
            <Button
              variant='contained'
              sx={{ ...settingClasses.accountSaveChangesMobile, display: { xs: 'block', sm: 'none' } }}
              type='submit'
            >
              <Paragraph size='medium' fontWeight='700'>
                Save Changes
              </Paragraph>
            </Button>
          </Grid>
          <Grid item container xs={12}>
            <Grid item sm={10} xs={12}>
              <Box display='flex' flexDirection='column' width={'100%'}>
                <Paragraph size='medium' fontWeight='500' textAlign='left'>
                  Username
                </Paragraph>
                <TextField disabled variant='filled' value={profile?.email} />
              </Box>
            </Grid>
            <Grid item sm={2} xs={0} sx={{ marginTop: '20px' }}>
              <Button
                variant='contained'
                sx={{ ...settingClasses.accountSaveChanges, display: { xs: 'none', sm: 'block' } }}
                type='submit'
              >
                <Paragraph size='medium' fontWeight='700'>
                  Save Changes
                </Paragraph>
              </Button>
            </Grid>
            <Grid item sm={10} xs={12}>
              <hr
                style={{
                  borderTop: `solid 1px ${MthColor.SYSTEM_08}`,
                  width: '100%',
                  borderBottom: '0',
                  margin: '22px 0 16px 0',
                }}
              />
            </Grid>
            <Grid item sm={10} xs={12}>
              <Box display='flex' flexDirection='column' width={'100%'}>
                <Paragraph size='medium' fontWeight='500' textAlign='left'>
                  New Password
                </Paragraph>
                <TextField
                  name='newPassword'
                  type='password'
                  onBlur={formik.handleBlur}
                  value={formik.values.newPassword}
                  onChange={(e) => {
                    handleIsFormChange(true)
                    formik.handleChange(e)
                  }}
                  error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                  helperText={formik.touched.newPassword && formik.errors.newPassword}
                />
              </Box>
            </Grid>
            <Grid item sm={2} />
            <Grid item sm={10} xs={12}>
              <Box display='flex' flexDirection='column' width={'100%'}>
                <Paragraph size='medium' fontWeight='500' textAlign='left'>
                  Re-Enter Password
                </Paragraph>
                <TextField
                  name='confirmPassword'
                  type='password'
                  value={formik.values.confirmPassword}
                  onChange={(e) => {
                    handleIsFormChange(true)
                    formik.handleChange(e)
                  }}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                />
              </Box>
            </Grid>
            <Grid item sm={10} xs={12}>
              <hr
                style={{
                  borderTop: `solid 1px ${MthColor.SYSTEM_08}`,
                  width: '100%',
                  borderBottom: '0',
                  margin: '22px 0 16px 0',
                }}
              />
            </Grid>
            <Grid item sm={2} xs={0} />
            <Grid item sm={12} xs={12} textAlign={'left'}>
              <Subtitle>Secondary Observer Account (Added by Admin)</Subtitle>
            </Grid>
            <Grid item sm={5} xs={12} sx={{ marginTop: { sm: 0, xs: 2 } }}>
              <Box width={'100%'} display={'flex'} justifyContent={'flex-end'}>
                <Box display='flex' flexDirection='column' width={'100%'} marginRight={{ sm: 2, xs: 0 }}>
                  <Paragraph size='medium' fontWeight='500' textAlign='left'>
                    First Name
                  </Paragraph>
                  <TextField disabled variant='filled' />
                </Box>
              </Box>
            </Grid>
            <Grid item sm={5} xs={12} sx={{ marginTop: { sm: 0, xs: 2 } }}>
              <Box width={'100%'} display={'flex'} justifyContent={'flex-start'}>
                <Box display='flex' flexDirection='column' width={'100%'} marginLeft={{ sm: 2, xs: 0 }}>
                  <Paragraph size='medium' fontWeight='500' textAlign='left'>
                    Last Name
                  </Paragraph>
                  <TextField disabled variant='filled' value='' />
                </Box>
              </Box>
            </Grid>
            <Grid item sm={2} xs={0} />
            <Grid item sm={10} xs={12}>
              <Box display='flex' flexDirection='column' width={'100%'}>
                <Paragraph size='medium' fontWeight='500' textAlign='left'>
                  Username
                </Paragraph>
                <TextField disabled variant='filled' />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={12}>
          {openSaveAlert.open && (
            <Alert
              sx={{}}
              onClose={() => {
                setOpenSaveAlert({ open: false, status: 'success', message: '' })
              }}
              severity={openSaveAlert.status}
            >
              {openSaveAlert.message}
            </Alert>
          )}
        </Grid>
      </Card>
    </form>
  )
}
