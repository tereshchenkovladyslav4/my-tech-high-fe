import { Box } from '@mui/system'
import React, { useState } from 'react'
import { BUTTON_LINEAR_GRADIENT } from '../../utils/constants'
import { Button, TextField, Typography } from '@mui/material'
import { useStyles } from './styles'
import { NewApplicationFooter } from '../../components/NewApplicationFooter/NewApplicationFooter'
import { useMutation } from '@apollo/client'
import { forgotPasswordMutation } from './service'
import { useFormik } from 'formik'
import * as yup from 'yup'

export const ForgotPassword = () => {
  const token = window.location.href.split('=')[1]

  const [forgotPassword] = useMutation(forgotPasswordMutation)
  const [alert, setAlert] = useState(null)
  const classes = useStyles

  const validationSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
  })

  const formik = useFormik({
    initialValues: {
      email: undefined,
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      setAlert(null)
      await completeAccount()
    },
  })

  const completeAccount = async () => {
    forgotPassword({
      variables: {
        email: formik.values.email,
      },
    })
      .then((data) => {
        if (data?.data?.forgotPassword) {
          setAlert({
            type: 'success',
            message: 'Instructions to reset your password have been emailed to you.',
          })
        } else {
          formik.setErrors({ email: ' ' })
          setAlert({
            type: 'error',
            message: 'We were unable to find an account associated with that email address.',
          })
        }
      })
      .catch(() => {
        formik.setErrors({ email: ' ' })
        setAlert({
          type: 'error',
          message: 'We were unable to find an account associated with that email address.',
        })
      })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 12,
        background: BUTTON_LINEAR_GRADIENT,
        width: '100%',
        height: '100vh'
      }}
    >
      <Box>
        <Typography fontSize={58} fontWeight={400} color='white'>
          Reset Your Password
        </Typography>
      </Box>
      <Box>
        <Typography fontSize={17} marginTop={3} color='white'>
          Please enter your email address below and press "Reset Password".
        </Typography>
        <Typography fontSize={17} marginTop={1} color='white'>
          You'll receive instructions on how to set a new password.
        </Typography>
      </Box>
      <form
        onSubmit={formik.handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 24,
        }}
      >
        <TextField
          color='secondary'
          name='email'
          sx={classes.textField}
          label='Email'
          focused
          variant='outlined'
          inputProps={{
            style: { color: 'white' },
          }}
          value={formik.values.email}
          onChange={(e) => {
            formik.handleChange(e)
            setAlert(null)
          }}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        {alert && alert.message && (
          <Typography fontSize={14} marginTop={3} color={alert.type === 'error' ? '#BD0043' : 'white'}>
            {alert.message}
          </Typography>
        )}
        <Button variant='contained' sx={classes.button} type='submit'>
          Reset Password
        </Button>
      </form>
    </Box>
  )
}
