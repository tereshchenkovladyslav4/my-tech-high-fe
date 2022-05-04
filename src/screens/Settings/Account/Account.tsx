
import { Alert, AlertColor, Box, Button, Card, Grid, TextField } from '@mui/material'
import React, { useContext, useState } from 'react'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { UserContext, UserInfo } from '../../../providers/UserContext/UserProvider'
import { useStyles } from '../styles'
import { updatePassword } from '../service'
import { useMutation } from '@apollo/client'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { WarningModal } from '../../../components/WarningModal/Warning';

type openAlertSaveType = {
  message: string,
  status: AlertColor,
  open: boolean,
}

export const Account = ({handleIsFormChange}) => {
  const classes = useStyles

  const { me } = useContext(UserContext)
  const { profile } = me as UserInfo

  const [updatePasswordMutation] = useMutation(updatePassword)
  const [message, setMessage] = useState('')

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
          password: formik.values.newPassword
        }
      }
    }).then(res => {
      setOpenSaveAlert({ message: 'Password changed Successfully', status: 'success', open: true })

      setTimeout(() => {
        setOpenSaveAlert({ message: '', status: 'success', open: false })
      }, 2000)

      handleIsFormChange(false);
    }).catch(err => {
      setOpenSaveAlert({ message: err?.message, status: 'error', open: true })

      setTimeout(() => {
        setOpenSaveAlert({ message: '', status: 'success', open: false })
      }, 2000)

      handleIsFormChange(false);
    })
  }

  const validationSchema = yup.object({
    newPassword: yup
      .string()
      .min(8, 'Password should be of minimum 8 characters length')
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .required('Re-Enter password is required')
      .oneOf([yup.ref("newPassword")], "Passwords do not match"),
  })

  const formik = useFormik({
    initialValues: {
      newPassword: undefined,
      confirmPassword: undefined,
    },
    validationSchema: validationSchema,
    onSubmit: async() => {
      await onSave()
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} style={{display: 'flex', height: '100%'}}>
    <Card>
      <Grid container paddingX={6} rowSpacing={2} marginTop={1}> 
        <Grid item xs={12} textAlign={'left'}>
          <Subtitle fontWeight='700' size='large'>Account</Subtitle>
        </Grid>
        <Grid item container xs={12} paddingX={6}>
          <Grid item xs={12}>
            <Paragraph size='medium' fontWeight='500' textAlign='left'>
                Username
            </Paragraph>
          </Grid>
          <Grid item xs={10}>
            <Box display='flex' flexDirection='column' width={'100%'} >
              <TextField 
                disabled 
                variant="filled"
                value={profile?.email}
              />
            </Box>  
          </Grid>
          <Grid item xs={2}>
              <Button variant='contained'sx={classes.accountSaveChanges} type='submit'>
                <Paragraph size='medium' fontWeight='700'>
                  Save Changes
                </Paragraph>
              </Button>
          </Grid>
          <Grid item xs={10}>
            <Box display='flex' flexDirection='column' width={'100%'} >
              <Paragraph size='medium' fontWeight='500' textAlign='left'>
                New Password
              </Paragraph>
              <TextField
                name='newPassword'
                type='password'
                value={formik.values.newPassword}
                onChange={(e) => {
                  handleIsFormChange(true);
                  formik.handleChange(e);
                }}
                error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                helperText={formik.touched.newPassword && formik.errors.newPassword}
              />
            </Box>  
          </Grid>
          <Grid item xs={2}/>
          <Grid item xs={10}>
            <Box display='flex' flexDirection='column' width={'100%'} >
              <Paragraph size='medium' fontWeight='500' textAlign='left'>
                Re-Enter Password
              </Paragraph>
              <TextField
                name='confirmPassword'
                type='password'
                value={formik.values.confirmPassword}
                onChange={(e) => {
                  handleIsFormChange(true);
                  formik.handleChange(e);
                }}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              />
            </Box>  
          </Grid>
          <Grid item xs={2}/>
          <Grid item xs={12} textAlign={'left'}>
            <Subtitle>Secondary Observer Account (Added by Admin)</Subtitle>
          </Grid>
          <Grid item xs={5}>
            <Box width={'100%'} display={'flex'} justifyContent={'flex-end'} >
              <Box display='flex' flexDirection='column' width={'100%'} marginRight={2}>
                <Paragraph size='medium' fontWeight='500' textAlign='left'>
                  First Name
                </Paragraph>
                <TextField 
                  disabled 
                  variant="filled" 
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={5}>
            <Box width={'100%'} display={'flex'} justifyContent={'flex-start'}>
              <Box display='flex' flexDirection='column' width={'100%'}  marginLeft={2}>
                <Paragraph size='medium' fontWeight='500' textAlign='left'>
                  Last Name
                </Paragraph>
                <TextField 
                  disabled 
                  variant="filled"
                  value=""
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={2}/>
          <Grid item xs={10}>
            <Box display='flex' flexDirection='column' width={'100%'} >
              <Paragraph size='medium' fontWeight='500' textAlign='left'>
                Username
              </Paragraph>
              <TextField 
                  disabled 
                  variant="filled" 
                />
            </Box> 
          </Grid>
        </Grid>
      </Grid>
      <Grid>
        {openSaveAlert.open && (<Alert
          sx={{
            position: 'relative',
            bottom: '-83px'
          }}
          onClose={() => {
            setOpenSaveAlert({ open: false, status: 'success', message: '' })
          }}
          severity={openSaveAlert.status}
        >
          {openSaveAlert.message}
        </Alert>)}
      </Grid>
    </Card>
  </form>
  )
}
