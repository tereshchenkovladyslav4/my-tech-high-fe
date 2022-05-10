import { Title } from '../../components/Typography/Title/Title'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import BGSVG from '../../assets/ApplicationBG.svg'
import { MTHBLUE, SYSTEM_05 } from '../../utils/constants'
import { Button, TextField } from '@mui/material'
import { useStyles } from './styles'
import { Paragraph } from '../../components/Typography/Paragraph/Paragraph'
import { NewApplicationFooter } from '../../components/NewApplicationFooter/NewApplicationFooter'
import { useMutation } from '@apollo/client'
import { confirmAccount } from './service'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { CompleteAccountSuccess } from '../CompleteAccountSuccess/CompleteAccountSuccess'

export const CompleteAccount = () => {
  const token = window.location.href.split('=')[1]

  const [confirmEmail] = useMutation(confirmAccount)
  const [showSuccess, setShowSuccess] = useState(false)

  const classes = useStyles

  const validationSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    )
    .required('Password is required'),
    confirmPassword: yup
      .string()
      .required('Please enter your password again')
      .oneOf([yup.ref('password')], 'Passwords do not match'),
  })

  const formik = useFormik({
    initialValues: {
      email: undefined,
      password: undefined,
      confirmPassword: undefined,
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      await completeAccount()
    },
  })

  const completeAccount = async () => {
    confirmEmail({
      variables: {
        verifyInput: {
          token,
          password: formik.values.password,
        },
      },
    }).then(() => setShowSuccess(true))
  }

  return !showSuccess ? (
    <Box paddingY={6} sx={{ bgcolor: '#EEF4F8' }}>
      <Box
        sx={{
          backgroundImage: `url(${BGSVG})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box>
          <Box paddingX={36}>
            <Box marginTop={12} marginBottom={3}>
              <Title color={MTHBLUE} textAlign='center'>
                InfoCenter
              </Title>
            </Box>
            <Title fontWeight='500' textAlign='center'>
              Thanks for verifying your email.
            </Title>
            <Title fontWeight='500' textAlign='center' sx={{ marginTop: 2, marginBottom: 6 }}>
              Please create a password to complete your account
            </Title>
            <Box sx={{ minHeight: '800px' }}>
              <form
                onSubmit={formik.handleSubmit}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <TextField
                  name='email'
                  sx={classes.textField}
                  label='Account Email'
                  focused
                  variant='outlined'
                  inputProps={{
                    style: { color: 'black' },
                  }}
                  InputLabelProps={{
                    style: { color: SYSTEM_05 },
                  }}
                  size='small'
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                  name='password'
                  type='password'
                  size='small'
                  sx={classes.textField}
                  label='Password'
                  focused
                  variant='outlined'
                  inputProps={{
                    style: { color: 'black' },
                  }}
                  InputLabelProps={{
                    style: { color: SYSTEM_05 },
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
                <TextField
                  name='confirmPassword'
                  type='password'
                  size='small'
                  sx={classes.textField}
                  label='Re-type Password'
                  focused
                  variant='outlined'
                  inputProps={{
                    style: { color: 'black' },
                  }}
                  InputLabelProps={{
                    style: { color: SYSTEM_05 },
                  }}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                />
                <Button variant='contained' style={classes.button} type='submit'>
                  <Paragraph fontWeight='700' sx={{ fontSize: '11.2px' }}>
                    Create Account
                  </Paragraph>
                </Button>
              </form>
            </Box>
            <Box bottom={20}>
              <NewApplicationFooter />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  ) : (
    <CompleteAccountSuccess />
  )
}
