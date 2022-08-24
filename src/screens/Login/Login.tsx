import React, { FunctionComponent, ReactElement, useContext, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Button, Grid, TextField } from '@mui/material'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { map } from 'lodash'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { Paragraph } from '../../components/Typography/Paragraph/Paragraph'
import { WarningModal } from '../../components/WarningModal/Warning'
import { AuthContext } from '../../providers/AuthProvider/AuthContext'
import { BUTTON_LINEAR_GRADIENT } from '../../utils/constants'
import { CustomModal } from '../Admin/SiteManagement/EnrollmentSetting/components/CustomModal/CustomModals'
import { ApolloError } from '../Admin/Users/interfaces'
import { loginMutation, resendVerificationEmailMutation } from './service'
import { useStyles } from './styles'

export const Login: FunctionComponent = () => {
  const infocenterHelpLinks = [
    {
      title: 'Find answers in Parent Link',
    },
    {
      title: 'Submit applications and enrollment packets',
    },
    {
      title: 'Read announcements',
    },
    {
      title: 'View the calendar',
    },
    {
      title: 'Submit Weekly Learning Logs',
    },
    {
      title: 'Check student grades',
    },
    {
      title: 'Update student and family information',
    },
    {
      title: 'Manage schedules',
    },
    {
      title: 'Submit and track reimbursements',
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

  const [apolloError, setApolloError] = useState<ApolloError>({
    title: '',
    severity: '',
    flag: false,
  })

  const renderInfocenterHelpLinks = (arr: Array<unknown>, canvas?: boolean): ReactElement[] =>
    map(arr, (link, idx) => (
      <Grid item key={idx} xs={12} textAlign='left'>
        <Paragraph size='large' color={canvas ? 'black' : 'white'}>
          {link.title}
        </Paragraph>
        <hr style={{ borderTop: 'dotted 1px white', borderBottom: '0' }} />
      </Grid>
    ))

  const classes = useStyles()
  const [login, { data, loading, error }] = useMutation(loginMutation)
  const [resendEmail, { data: resendEmailResponse, loading: resending }] = useMutation(resendVerificationEmailMutation)
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [unverified, setUnverified] = useState<boolean>(false)
  const { setCredentials } = useContext(AuthContext)
  const history = useHistory()
  const loginAction = async () => {
    login({
      variables: {
        loginInput: {
          username,
          password,
        },
      },
    })
  }
  const handleForgotPassword = () => {
    history.push('/forgot-password')
  }

  const handleResendVerificationEmail = async () => {
    resendEmail({
      variables: {
        email: username,
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
        setApolloError({
          title: error?.clientErrors[0]?.message || error?.graphQLErrors[0]?.message || error?.networkError?.message,
          severity: 'Error',
          flag: true,
        })
      }
    }
  }, [loading])

  useEffect(() => {
    if (!resending && resendEmailResponse) {
      if (!resendEmailResponse?.resendVerificationEmail) {
        setApolloError({
          title: 'Faild resend verification email.',
          severity: 'Error',
          flag: true,
        })
      } else {
        setUnverified(false)
      }
    }
  }, [resending])

  return (
    <Box sx={{ backgroundColor: 'white' }}>
      <Box sx={{ alignItems: 'center', paddingBottom: 4 }}>
        {apolloError.flag && (
          <WarningModal
            handleModem={() => setApolloError({ title: '', severity: '', flag: false })}
            title={apolloError.severity}
            subtitle={apolloError.title}
            btntitle='Close'
            handleSubmit={() => setApolloError({ title: '', severity: '', flag: false })}
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
          <Grid item container xs={12} md={6} sx={{ background: BUTTON_LINEAR_GRADIENT, padding: 6 }}>
            <Grid item xs={12}>
              <Box textAlign='left'>
                <Typography fontSize={58} fontWeight={400} color='white'>
                  InfoCenter
                </Typography>
                <Typography fontSize={17} color='white'>
                  Manage your My Tech High experience
                </Typography>
              </Box>
            </Grid>
            <Grid item container alignItems='center'>
              <Grid item xs={12} md={8}>
                <Box display='flex' flexDirection='column' width='100%'>
                  <TextField
                    label='Email'
                    color='secondary'
                    focused
                    variant='outlined'
                    sx={{ marginY: 2 }}
                    inputProps={{
                      style: { color: 'white' },
                    }}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <Box className={classes.passwordContainer}>
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                  <Button variant='contained' onClick={() => loginAction()} className={classes.signInButton}>
                    Sign In
                  </Button>
                </Box>
              </Grid>
              <Grid item container sx={{ marginY: 4 }}>
                {renderInfocenterHelpLinks(infocenterHelpLinks)}
              </Grid>
            </Grid>
          </Grid>
          <Grid item container xs={12} md={6} sx={{ padding: 6, background: '#EEF4F8' }}>
            <Grid item xs={12}>
              <Box textAlign='left'>
                <Typography fontSize={58} fontWeight={400} color='black'>
                  Launchpad
                </Typography>
                <Typography fontSize={17} color='black'>
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
                background: BUTTON_LINEAR_GRADIENT,
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
