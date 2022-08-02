import React, { useState, useContext, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { makeStyles } from '@material-ui/styles'
import { Button, TextField } from '@mui/material'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useFormik } from 'formik'
import { useHistory } from 'react-router-dom'
import * as yup from 'yup'
import { AuthContext } from '../../providers/AuthProvider/AuthContext'
import { BUTTON_LINEAR_GRADIENT } from '../../utils/constants'
import { CompleteAccountSuccess } from '../CompleteAccountSuccess/CompleteAccountSuccess'
import { resetPasswordMutation } from './service'
import { useStyles } from './styles'
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

export const ResetPassword: FunctionComponent = () => {
  const token = window.location.href.split('=')[1]
  const decodedToken = atob(token)
  const [, email] = decodedToken.split('-')
  const [resetPassword] = useMutation(resetPasswordMutation)
  const [showSuccess] = useState(false)
  const { credentials, setCredentials } = useContext(AuthContext)
  const [alert, setAlert] = useState(null)
  const classes = useStyles
  const history = useHistory()
  const validationSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
      )
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .required('Please enter your password again')
      .oneOf([yup.ref('password')], 'Passwords do not match'),
  })
  const helperTextStyles = useHelperTextStyles()

  const formik = useFormik({
    initialValues: {
      email: email,
      password: undefined,
      confirmPassword: undefined,
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      setAlert(null)
      await completeAccount()
    },
  })

  const completeAccount = async () => {
    resetPassword({
      variables: {
        verifyInput: {
          token,
          password: formik.values.password,
        },
      },
    })
      .then((data) => {
        if (data?.data?.resetPassword) {
          localStorage.setItem('JWT', data.data.resetPassword.token)
          setCredentials(data.data.resetPassword.token)
        } else {
          setAlert({
            type: 'error',
            message: 'Please check password again.',
          })
        }
      })
      .catch((error) => {
        formik.setErrors({ password: ' ', confirmPassword: ' ' })
        setAlert({
          type: 'error',
          message: error.message,
        })
      })
  }

  useEffect(() => {
    if (credentials) {
      history.push('/')
    }
  }, [credentials])

  return !showSuccess ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: BUTTON_LINEAR_GRADIENT,
        paddingTop: 12,
        minHeight: '100vh',
      }}
    >
      <Box>
        <Typography fontSize={58} fontWeight={400} color='white' marginBottom={5}>
          Update Your Password
        </Typography>
      </Box>
      <form
        onSubmit={formik.handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
          error={formik.touched.email && Boolean(formik.errors.email)}
          FormHelperTextProps={{
            classes: {
              root: helperTextStyles.root,
              error: helperTextStyles.error,
            },
          }}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          color='secondary'
          name='password'
          type='password'
          sx={classes.textField}
          label='Password'
          focused
          variant='outlined'
          inputProps={{
            style: { color: 'white' },
          }}
          value={formik.values.password}
          onChange={(e) => {
            formik.handleChange(e)
            setAlert(null)
          }}
          FormHelperTextProps={{
            classes: {
              root: helperTextStyles.root,
              error: helperTextStyles.error,
            },
          }}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <TextField
          color='secondary'
          name='confirmPassword'
          type='password'
          sx={classes.textField}
          label='Re-type Password'
          focused
          variant='outlined'
          inputProps={{
            style: { color: 'white' },
          }}
          FormHelperTextProps={{
            classes: {
              root: helperTextStyles.root,
              error: helperTextStyles.error,
            },
          }}
          value={formik.values.confirmPassword}
          onChange={(e) => {
            formik.handleChange(e)
            setAlert(null)
          }}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          style={{
            marginTop: formik.touched.password && Boolean(formik.errors.password) ? '32px' : undefined,
          }}
        />
        {alert && alert.message && (
          <Typography fontSize={14} marginTop={3} color={alert.type === 'error' ? '#BD0043' : 'white'}>
            {alert.message}
          </Typography>
        )}
        <Button variant='contained' sx={classes.button} type='submit'>
          Update Password
        </Button>
      </form>
    </Box>
  ) : (
    <CompleteAccountSuccess />
  )
}
