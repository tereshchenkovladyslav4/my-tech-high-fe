import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { makeStyles } from '@material-ui/styles'
import { Button, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useFormik } from 'formik'
import { useHistory } from 'react-router-dom'
import * as yup from 'yup'
import { MthColor } from '@mth/enums'
import { forgotPasswordMutation, resendVerificationEmailMutation } from './service'
import { forgotPasswordClasses } from './styles'

const useHelperTextStyles = makeStyles(() => ({
  root: {
    color: MthColor.WHITE,
  },
  error: {
    '&.MuiFormHelperText-root.Mui-error': {
      color: MthColor.WHITE,
    },
  },
}))

type Alert = {
  type: 'success' | 'error'
  message: string
  description?: string
}

export const ForgotPassword: React.FC = () => {
  const history = useHistory()
  const helperTextStyles = useHelperTextStyles()
  const [alert, setAlert] = useState<Alert | null>(null)
  const [verifyStatus, setVerifyStatus] = useState<boolean>(true)

  const [forgotPassword] = useMutation(forgotPasswordMutation)
  const [resendEmail, { data: resendEmailResponse, loading: resending }] = useMutation(resendVerificationEmailMutation)

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
              type: 'error',
              message: 'This account needs to be verified first.',
              description: 'Check your email for a verification link or have one resent below.',
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
    setAlert(null)
    resendEmail({
      variables: {
        email: formik.values.email,
      },
    })
  }

  useEffect(() => {
    if (!resending && resendEmailResponse) {
      formik.setErrors({ email: undefined })
      if (resendEmailResponse?.resendVerificationEmail) {
        setAlert({
          type: 'error',
          message: 'Failed to resend verification email.',
        })
      } else {
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
        background: MthColor.BUTTON_LINEAR_GRADIENT,
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
          Please enter your email address below and press &ldquo;Reset Password.&rdquo;
        </Typography>
        <Typography fontSize={17} marginTop={1} color='white'>
          You&apos;ll receive instructions on how to set a new password.
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
          sx={forgotPasswordClasses.textField}
          label='Email'
          focused
          variant='outlined'
          inputProps={{
            style: { color: MthColor.WHITE },
          }}
          value={formik.values.email}
          onChange={(e) => {
            formik.handleChange(e)
            setAlert(null)
            setVerifyStatus(true)
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
          <Typography fontSize={14} marginTop={3} color={alert.type === 'error' ? MthColor.WHITE : MthColor.WHITE}>
            {alert.message}
          </Typography>
        )}
        {alert?.description && (
          <Typography fontSize={14} marginTop={2} color={alert.type === 'error' ? MthColor.WHITE : MthColor.WHITE}>
            {alert.description}
          </Typography>
        )}
        {verifyStatus ? (
          <Button variant='contained' sx={forgotPasswordClasses.button} type='submit'>
            Reset Password
          </Button>
        ) : (
          <Button variant='contained' sx={forgotPasswordClasses.button} onClick={() => handleResendVerificationEmail()}>
            Resend Verification Link
          </Button>
        )}
      </form>
    </Box>
  )
}
