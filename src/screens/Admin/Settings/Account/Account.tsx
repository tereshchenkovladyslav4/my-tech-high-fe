import React, { useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Alert, AlertColor, Box, Button, Card, Grid, TextField } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { isValidPassword } from '@mth/constants'
import { MthColor, MthTitle } from '@mth/enums'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { updatePassword } from '../service'
import { useStyles } from '../styles'

type openAlertSaveType = {
  message: string
  status: AlertColor
  open: boolean
}

export const Account: React.FC<{ handleIsFormChange: () => void }> = ({ handleIsFormChange }) => {
  const classes = useStyles

  const { me } = useContext(UserContext)
  const [openSaveAlert, setOpenSaveAlert] = useState<openAlertSaveType>({
    message: '',
    status: 'success',
    open: false,
  })

  const [updatePasswordMutation] = useMutation(updatePassword)

  const onSave = async () => {
    updatePasswordMutation({
      variables: {
        updateAccountInput: {
          password: formik.values.newPassword,
          oldpassword: formik.values.currentPassword,
        },
      },
    })
      .then(() => {
        setOpenSaveAlert({ message: 'New Password Saved', status: 'success', open: true })

        setTimeout(() => {
          setOpenSaveAlert({ message: '', status: 'success', open: false })
        }, 2000)

        handleIsFormChange(false)
      })
      .catch((error) => {
        setOpenSaveAlert({ message: error?.message, status: 'error', open: true })

        setTimeout(() => {
          setOpenSaveAlert({ message: '', status: 'success', open: false })
        }, 2000)

        handleIsFormChange(false)
      })
  }

  const validationSchema = yup.object({
    currentPassword: yup.string().required('Current Password is required'),
    newPassword: yup.string().matches(isValidPassword, MthTitle.PASSWORD_HINT).required('New Password is required'),
    confirmNewPassword: yup
      .string()
      .required('Re-Enter new password is required')
      .oneOf([yup.ref('newPassword')], 'Password does not match'),
  })

  const formik = useFormik({
    initialValues: {
      currentPassword: undefined,
      newPassword: undefined,
      confirmNewPassword: undefined,
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      await onSave()
    },
    onChange: async () => {
      handleIsFormChange(true)
    },
  })

  return (
    <form onSubmit={formik.handleSubmit} style={{ display: 'flex', height: '100%' }}>
      <Card>
        <Grid container paddingX={6} rowSpacing={2} marginTop={1} sx={classes.gridContainer}>
          <Grid item xs={9}>
            <Subtitle size='large' fontWeight='700'>
              Account
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
          <Grid item container xs={12} sm={12} paddingX={30}>
            <Grid item xs={12}>
              <Box display='flex' flexDirection='column' width={'100%'}>
                <Paragraph size='medium' fontWeight='500' textAlign='left'>
                  Username
                </Paragraph>
                <TextField disabled variant='filled' value={me?.email} />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <hr
                style={{
                  borderTop: `solid 1px ${MthColor.SYSTEM_08}`,
                  width: '100%',
                  borderBottom: '0',
                  margin: '22px 0 16px 0',
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Paragraph size='large' fontWeight='700' textAlign='left'>
                Change Password
              </Paragraph>
            </Grid>
            <Grid item xs={12}>
              <Box display='flex' flexDirection='column' width={'100%'}>
                <Paragraph size='medium' fontWeight='500' textAlign='left'>
                  Current Password
                </Paragraph>
                <TextField
                  onBlur={formik.handleBlur}
                  name='currentPassword'
                  type='password'
                  value={formik.values.currentPassword}
                  onChange={(e) => {
                    handleIsFormChange(true)
                    formik.handleChange(e)
                  }}
                  error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
                  helperText={formik.touched.currentPassword && formik.errors.currentPassword}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display='flex' flexDirection='column' width={'100%'}>
                <Paragraph size='medium' fontWeight='500' textAlign='left'>
                  New Password
                </Paragraph>
                <TextField
                  name='newPassword'
                  type='password'
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
            <Grid item xs={12}>
              <Box display='flex' flexDirection='column' width={'100%'}>
                <Paragraph size='medium' fontWeight='500' textAlign='left'>
                  Re-Enter New Password
                </Paragraph>
                <TextField
                  name='confirmNewPassword'
                  type='password'
                  value={formik.values.confirmNewPassword}
                  onChange={(e) => {
                    handleIsFormChange(true)
                    formik.handleChange(e)
                  }}
                  error={formik.touched.confirmNewPassword && Boolean(formik.errors.confirmNewPassword)}
                  helperText={formik.touched.confirmNewPassword && formik.errors.confirmNewPassword}
                />
              </Box>
            </Grid>
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
      </Card>
    </form>
  )
}
