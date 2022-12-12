import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Button, Grid, TextField } from '@mui/material'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useFormik } from 'formik'
import { map } from 'lodash'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import { SuccessModal } from '@mth/components/SuccessModal/SuccessModal'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { MthColor } from '@mth/enums'
import { AuthContext } from '@mth/providers/AuthProvider/AuthContext'
import { CustomModal } from '@mth/screens/Admin/SiteManagement/EnrollmentSetting/components/CustomModal/CustomModals'
import { loginMutation, resendVerificationEmailMutation } from './service'
import { useStyles } from './styles'

export const Login: React.FC = () => {
  const infocenterHelpLinks = [
    {
      title: 'Review program details in Parent Link',
    },
    {
      title: 'Submit Enrollment Packets and additional applications',
    },
    {
      title: 'Read Announcements',
    },
    {
      title: 'View the InfoCenter Calendar',
    },
    {
      title: 'Design and manage schedules',
    },
    {
      title: 'Submit Weekly Learning Logs',
    },
    {
      title: 'Check student progress',
    },
    {
      title: 'Submit and track Requests for Reimbursement and Direct Orders',
    },
    {
      title: 'Update student and family information',
    },
    {
      title: 'Bookmark this website: infocenter.tech',
    },
  ]

  const canvasHelpLinks = [
    {
      title: 'Gain access to digital curriculum, practice exercises, and hands-on projects',
    },
    {
      title: 'Request online support from a Tech Mentor',
    },
    {
      title: 'Bookmark this website: tech.sparkeducation.com',
    },
  ]

  const renderInfocenterHelpLinks = (arr: Array<unknown>, canvas?: boolean): ReactElement[] =>
    map(arr, (link, idx) => (
      <Grid item key={idx} xs={12} textAlign='left'>
        <Paragraph size='large' color={canvas ? 'black' : 'white'}>
          {link.title}
        </Paragraph>
        {!canvas ? (
          <hr style={{ borderTop: 'dotted 1px white', borderBottom: '0' }} />
        ) : (
          <hr style={{ borderTop: 'dotted 1px black', borderBottom: '0' }} />
        )}
      </Grid>
    ))

  const classes = useStyles()
  const [login, { data, loading, error }] = useMutation(loginMutation)
  const [resendEmail, { data: resendEmailResponse, loading: resending }] = useMutation(resendVerificationEmailMutation)
  const [unverified, setUnverified] = useState<boolean>(false)
  const [signinError, setSigninError] = useState<string>('')
  const [resendResult, setResendResult] = useState<boolean | undefined>(undefined)
  const { setCredentials } = useContext(AuthContext)
  const history = useHistory()

  const loginAction = async (username: string, password: string) => {
    login({
      variables: {
        loginInput: {
          username,
          password,
        },
      },
    })
  }

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        // .email("Invalid Email Format")
        .required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      loginAction(values.username, values.password)
    },
  })

  const handleForgotPassword = () => {
    history.push('/forgot-password')
  }

  const handleResendVerificationEmail = async () => {
    resendEmail({
      variables: {
        email: formik.values.username,
      },
    })
  }

  useEffect(() => {
    if (!loading && data !== undefined) {
      if (data.login?.unverified) {
        setUnverified(true)
      } else {
        const jwt = data.login.jwt
        localStorage.setItem('JWT', jwt)
        setCredentials(jwt)
      }
    } else {
      if (error?.networkError || error?.graphQLErrors?.length > 0 || error?.clientErrors.length > 0) {
        setSigninError(
          error?.clientErrors[0]?.message || error?.graphQLErrors[0]?.message || error?.networkError?.message || '',
        )
      }
    }
  }, [loading])

  useEffect(() => {
    if (!resending && resendEmailResponse) {
      setResendResult(!resendEmailResponse?.resendVerificationEmail)
      if (!resendEmailResponse?.resendVerificationEmail) {
        setUnverified(false)
      }
    }
  }, [resending])

  return (
    <Box sx={{ backgroundColor: 'white' }}>
      <Box sx={{ alignItems: 'center', paddingBottom: 4 }}>
        {!!signinError && (
          <WarningModal
            title='Sign in'
            subtitle={'Whoops! You have entered an invalid username or password. Please try again.'}
            btntitle='Ok'
            handleModem={() => setSigninError('')}
            handleSubmit={() => setSigninError('')}
            textCenter
          />
        )}
        {resendResult === false && (
          <WarningModal
            title='Error'
            subtitle='Failed to resend verification email.'
            btntitle='Close'
            handleModem={() => setResendResult(undefined)}
            handleSubmit={() => setResendResult(undefined)}
          />
        )}
        {resendResult === true && (
          <SuccessModal
            title='Success'
            subtitle='A new email with the verification link has been sent. Please verifiy your email within 24 hours.'
            btntitle='Done'
            handleSubmit={() => setResendResult(undefined)}
          />
        )}
        {unverified && (
          <CustomModal
            title='Unverified Email'
            description='This account needs to be verified first.'
            subDescription='Check your email for a verification link or have one resent below.'
            confirmStr='Resend'
            cancelStr='Cancel'
            onClose={() => {
              setUnverified(false)
            }}
            onConfirm={() => {
              handleResendVerificationEmail()
            }}
          />
        )}
        <Grid container className={classes.mainContent}>
          {/*Infocenter*/}
          <Grid item container xs={12} md={6} className={classes.signInContent}>
            <Grid item xs={12}>
              <Box textAlign='left'>
                <Typography color='white' className={classes.mainHeader}>
                  InfoCenter
                </Typography>
                <Typography color='white' className={classes.subHeader}>
                  Manage your My Tech High experience
                </Typography>
              </Box>
            </Grid>
            <Grid item container alignItems='center'>
              <Grid item xs={12} md={8}>
                <Box display='flex' flexDirection='column' width='100%'>
                  <Box sx={{ width: '100%', paddingTop: 2 }}>
                    {formik.touched.username && !!formik.errors.username && (
                      <Typography fontSize={14} fontWeight={100} color='red' sx={{ paddingBottom: '5px' }}>
                        {formik.errors.username}
                      </Typography>
                    )}
                    <TextField
                      label='Email'
                      color='secondary'
                      focused
                      variant='outlined'
                      sx={{ marginBottom: 2, width: '100%' }}
                      inputProps={{
                        style: { color: 'white' },
                      }}
                      value={formik.values.username}
                      name='username'
                      onChange={formik.handleChange}
                      error={formik.touched.username && !!formik.errors.username}
                    />
                  </Box>
                  <Box className={classes.passwordContainer}>
                    {formik.touched.password && !!formik.errors.password && (
                      <Typography fontSize={14} fontWeight={100} color='red' sx={{ paddingBottom: '5px' }}>
                        {formik.errors.password}
                      </Typography>
                    )}
                    <TextField
                      color='secondary'
                      id='outlined-read-only-input'
                      label='Password'
                      variant='outlined'
                      focused
                      inputProps={{
                        style: { color: 'white' },
                      }}
                      type='password'
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      error={formik.touched.password && !!formik.errors.password}
                      name='password'
                      sx={{ width: '100%' }}
                    />
                    <Typography className={classes.forgotPassword} onClick={handleForgotPassword}>
                      Forgot Password
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box className={classes.singInButtonBox}>
                  <Button variant='contained' onClick={() => formik.handleSubmit()} className={classes.signInButton}>
                    Sign In
                  </Button>
                </Box>
              </Grid>
              <Grid item container sx={{ marginY: 4 }}>
                {renderInfocenterHelpLinks(infocenterHelpLinks)}
              </Grid>
            </Grid>
          </Grid>
          <Grid item container xs={12} md={6} className={classes.launchpadContent}>
            <Grid item xs={12}>
              <Box textAlign='left'>
                <Typography color='black' className={classes.mainHeader}>
                  Launchpad
                </Typography>
                <Typography color='black' className={classes.subHeader}>
                  Home of MTH Direct DreamLink Learning and Accelerated Spark Online courses
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }} className={classes.launchSignInBox}>
                <a
                  href={'https://tech.sparkeducation.com/login?redirectURI=%2F'}
                  target='_blank'
                  style={{
                    textDecoration: 'none',
                  }}
                  rel='noreferrer'
                >
                  <Button variant='contained' className={classes.canvasButton}>
                    Sign In
                  </Button>
                </a>
              </Box>
            </Grid>
            <Box className={classes.launchpadDesc}>{renderInfocenterHelpLinks(canvasHelpLinks, true)}</Box>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Link
            to={'applications'}
            target='_blank'
            rel='noopener noreferrer'
            style={{ maxWidth: '600px', width: '95%' }}
          >
            <Button
              variant='contained'
              style={{
                borderRadius: 8,
                fontSize: 12,
                background: MthColor.BUTTON_LINEAR_GRADIENT,
                height: 48,
                width: '100%',
              }}
            >
              Apply Now
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  )
}
