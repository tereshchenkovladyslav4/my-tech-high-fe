import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Button, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { NewApplicationFooter } from '@mth/components/NewApplicationFooter/NewApplicationFooter'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Title } from '@mth/components/Typography/Title/Title'
import { isValidPassword } from '@mth/constants'
import { MthColor, MthTitle, RoleLevel } from '@mth/enums'
import { getWindowDimension } from '@mth/utils'
import BGSVG from '../../assets/ApplicationBG.svg'
import { CompleteAccountSuccess } from '../CompleteAccountSuccess/CompleteAccountSuccess'
import { confirmAccount, sendApplicationEmail } from './service'
import { useStyles } from './styles'

export const CompleteAccount: React.FC = () => {
  const token = window.location.href.split('=')[1]

  const [confirmEmail] = useMutation(confirmAccount)
  const [sendApplicationReceiveEmail] = useMutation(sendApplicationEmail)
  const [showSuccess, setShowSuccess] = useState(false)
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimension())

  const classes = useStyles

  const validationSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().matches(isValidPassword, MthTitle.PASSWORD_HINT).required('Password is required'),
    confirmPassword: yup
      .string()
      .required('Please enter your password again')
      .oneOf([yup.ref('password')], 'Passwords do not match'),
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
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
    }).then((res) => {
      setShowSuccess(true)
      const roleLevel = res?.data?.verify?.level
      if (roleLevel === RoleLevel.PARENT) sendApplicationReceiveEmail({ variables: { email: formik.values.email } })
    })
  }

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimension())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [showSuccess])

  return !showSuccess ? (
    <Box paddingY={6} sx={{ backgroundColor: MthColor.SYSTEM_09 }}>
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
          <Box paddingX={windowDimensions.width < 1000 ? 5 : 36}>
            <Box marginTop={12} marginBottom={3}>
              <Title color={MthColor.MTHBLUE} textAlign='center'>
                InfoCenter
              </Title>
            </Box>
            <Title fontWeight='500' textAlign='center'>
              Thank you for verifying your email.
            </Title>
            <Title fontWeight='500' textAlign='center' sx={{ marginTop: 2, marginBottom: 6 }}>
              Please create a password to complete your account setup.
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
                  sx={{
                    ...classes.textField,
                    width: windowDimensions.width < 500 ? '100%' : '451.53px',
                  }}
                  label='Account Email'
                  focused
                  variant='outlined'
                  inputProps={{
                    style: { color: 'black' },
                  }}
                  InputLabelProps={{
                    style: { color: MthColor.SYSTEM_05 },
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
                  sx={{
                    ...classes.textField,
                    width: windowDimensions.width < 500 ? '100%' : '451.53px',
                  }}
                  label='Password'
                  focused
                  variant='outlined'
                  inputProps={{
                    style: { color: 'black' },
                  }}
                  InputLabelProps={{
                    style: { color: MthColor.SYSTEM_05 },
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
                  sx={{
                    ...classes.textField,
                    width: windowDimensions.width < 500 ? '100%' : '451.53px',
                  }}
                  label='Re-type Password'
                  focused
                  variant='outlined'
                  inputProps={{
                    style: { color: 'black' },
                  }}
                  InputLabelProps={{
                    style: { color: MthColor.SYSTEM_05 },
                  }}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                />
                <Button
                  variant='contained'
                  style={{ ...classes.button, width: windowDimensions.width < 500 ? '100%' : '451.53px' }}
                  type='submit'
                >
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
