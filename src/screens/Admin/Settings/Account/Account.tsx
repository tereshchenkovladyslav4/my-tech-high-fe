import { Box, Button, Card, Grid, TextField } from '@mui/material'
import React, { useContext } from 'react'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { UserContext, UserInfo } from '../../../../providers/UserContext/UserProvider'
import { SYSTEM_08 } from '../../../../utils/constants'
import { useStyles } from '../styles'
import { updatePassword } from '../service'
import { useMutation } from '@apollo/client'
import * as yup from 'yup'
import { useFormik } from 'formik'

const Account = () => {
  const classes = useStyles
  const { me } = useContext(UserContext)
  const { profile } = me as UserInfo
  const [updatePasswordMutation] = useMutation(updatePassword)

  const onSave = async () => {
    // await updatePasswordMutation({
    //   variables: {
    //     updateAccountInput: {
    //       password: formik.values.newPassword,
    //       confirm_password: formik.values.confirmNewPassword,
    //     },
    //   },
    // })
  }

  const validationSchema = yup.object({
    currentPassword: yup.string().required('Current Password is required'),
    newPassword: yup
      .string()
      .min(8, ' New Password should be of minimum 8 characters length')
      .required('New Password is required'),
    confirmNewPassword: yup
      .string()
      .required('Re-Enter new password is required')
      .oneOf([yup.ref('password')], 'Passwords do not match'),
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
          <Grid item container xs={12} paddingX={30}>
            <Grid item xs={12}>
              <Box display='flex' flexDirection='column' width={'100%'}>
                <Paragraph size='medium' fontWeight='500' textAlign='left'>
                  Username
                </Paragraph>
                <TextField disabled variant='filled' value={profile?.email} />
              </Box>
            </Grid>
            <Grid item md={12} sm={12} xs={12} sx={{ padding: '20px 0px' }}>
              <hr style={{ borderTop: `solid 1px ${SYSTEM_08}`, width: '100%', borderBottom: '0' }} />
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
                  name='password'
                  type='password'
                  value={formik.values.currentPassword}
                  onChange={formik.handleChange}
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
                  name='password'
                  type='password'
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
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
                  name='confirmPassword'
                  type='password'
                  value={formik.values.confirmNewPassword}
                  onChange={formik.handleChange}
                  error={formik.touched.confirmNewPassword && Boolean(formik.errors.confirmNewPassword)}
                  helperText={formik.touched.confirmNewPassword && formik.errors.confirmNewPassword}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </form>
  )
}
export { Account as default }
