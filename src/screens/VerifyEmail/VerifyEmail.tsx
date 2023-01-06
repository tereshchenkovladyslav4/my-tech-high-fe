import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Button, Container, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { useFormik } from 'formik'
import { Link } from 'react-router-dom'
import * as yup from 'yup'
import BGSVG from '@mth/assets/ApplicationBG.svg'
import { NewApplicationFooter } from '@mth/components/NewApplicationFooter/NewApplicationFooter'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Title } from '@mth/components/Typography/Title/Title'
import { MthColor, MthRoute } from '@mth/enums'
import { verifyEmail } from './service'
import { useStyles } from './styles'

export const VerifyEmail: React.FC = () => {
  const token = window.location.href.split('=')[1]

  const [verifyEmailMutation] = useMutation(verifyEmail)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const classes = useStyles

  const validationSchema = yup.object({
    password: yup.string().required('Password is required'),
  })

  const formik = useFormik({
    initialValues: {
      password: undefined,
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      verifyEmailMutation({
        variables: {
          verifyInput: {
            token,
            password: formik.values.password,
          },
        },
      })
        .then(() => {
          setShowSuccess(true)
        })
        .catch(() => {
          setErrorMessage('Please input the correct password.')
          setTimeout(() => {
            setErrorMessage('')
          }, 2000)
        })
    },
  })

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
              <Title color={MthColor.MTHBLUE} textAlign='center'>
                InfoCenter
              </Title>
            </Box>
            <Title fontWeight='500' textAlign='center'>
              Thanks for verifying your email.
            </Title>
            <Title fontWeight='500' textAlign='center' sx={{ marginTop: 2, marginBottom: 6 }}>
              Please input your password to verify your email.
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
                    style: { color: MthColor.SYSTEM_05 },
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
                {errorMessage && (
                  <Paragraph color='#BD0043' size={'large'} textAlign='left' sx={{ width: '440px' }}>
                    {errorMessage}
                  </Paragraph>
                )}
                <Button variant='contained' style={classes.button} type='submit'>
                  <Paragraph fontWeight='700' sx={{ fontSize: '11.2px' }}>
                    Verify Email
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
    <Box sx={{ bgcolor: '#EEF4F8' }}>
      <Container sx={{ bgcolor: '#EEF4F8' }}>
        <Box paddingY={12}>
          <Box
            sx={{
              backgroundImage: `url(${BGSVG})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'top',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '1100px',
            }}
          >
            <Box paddingX={36}>
              <Box marginTop={12}>
                <Title color={MthColor.MTHBLUE} textAlign='center'>
                  InfoCenter
                </Title>
              </Box>
              <Title fontWeight='500' textAlign='center'>
                Email Verification
              </Title>
              <Box marginTop={'5%'}>
                <Title size='medium' fontWeight='500' textAlign='center'>
                  You have successfully verified your email address. Please continue
                  <Link
                    to={MthRoute.DASHBOARD.toString()}
                    style={{ fontWeight: 700, color: MthColor.MTHBLUE, textDecoration: 'none' }}
                  >
                    {'\u00A0'}here{'\u00A0'}
                  </Link>
                  and login.
                </Title>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box paddingBottom={4}>
          <NewApplicationFooter />
        </Box>
      </Container>
    </Box>
  )
}
