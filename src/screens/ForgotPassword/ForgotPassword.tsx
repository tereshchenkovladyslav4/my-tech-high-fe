import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { BUTTON_LINEAR_GRADIENT } from '../../utils/constants'
import { Button, TextField, Typography } from '@mui/material'
import { useStyles } from './styles'
import { useMutation } from '@apollo/client'
import { forgotPasswordMutation, resendVerificationEmailMutation } from './service'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'

const useHelperTextStyles = makeStyles(() => ({
  root: {
    color: 'white',
  },
  error: {
    '&.MuiFormHelperText-root.Mui-error': {
      color: 'white',
    },
  },
}))

type Alert = {
  message: string
  type: string
  description?: string
}

export const ForgotPassword = () => {
  const classes = useStyles
  const token = window.location.href.split('=')[1]
  const history = useHistory()
  const helperTextStyles = useHelperTextStyles()
  const [alert, setAlert] = useState<Alert>(null)
  const [verifyStatus, setVerifyStatus] = useState<boolean>(true)

  const [forgotPassword] = useMutation(forgotPasswordMutation)
  const [resendEmail, { data: resendEmailResponse, loading: resending, error: resendError }] = useMutation(
    resendVerificationEmailMutation,
  )
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
          const { status, unverified } = data?.data?.forgotPassword
          if (unverified) {
            setVerifyStatus(false)
            setAlert({
              type: 'warning',
              message: 'This account needs to be verified first.',
              description: 'Check your email for a verification link or have one resent below',
            })
          } else {
            if (status) {
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
          }
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

  const handleResendVerificationEmail = async () => {
    resendEmail({
      variables: {
        email: formik.values.email,
      },
    })
  }

  useEffect(() => {
    if (!resending && resendEmailResponse) {
      if (!resendEmailResponse?.resendVerificationEmail) {
        formik.setErrors({ email: ' ' })
        setAlert({
          type: 'error',
          message: 'Faild resend verification email.',
        })
      } else {
        setVerifyStatus(true)
        history.push('/')
      }
    }
  }, [resending])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 12,
        background: BUTTON_LINEAR_GRADIENT,
        width: '100%',
        height: '100vh',
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
          FormHelperTextProps={{
            classes: {
              root: helperTextStyles.root,
              error: helperTextStyles.error,
            },
          }}
        />
        {alert?.message && (
          <Typography fontSize={14} marginTop={3} color={alert.type === 'error' ? 'white' : 'white'}>
            {alert.message}
          </Typography>
        )}
        {alert?.description && (
          <Typography fontSize={14} marginTop={3} color={alert.type === 'error' ? 'white' : 'white'}>
            {alert.description}
          </Typography>
        )}
        {verifyStatus ? (
          <Button variant='contained' sx={classes.button} type='submit'>
            Reset Password
          </Button>
        ) : (
          <Button variant='contained' sx={classes.button} onClick={() => handleResendVerificationEmail()}>
            Resend Verification Link
          </Button>
        )}
      </form>
    </Box>
  )
}
