import { Button, Divider, Grid, TextField } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useEffect, useState } from 'react'
import { Paragraph } from '../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../components/Typography/Subtitle/Subtitle'
import { BUTTON_LINEAR_GRADIENT } from '../../utils/constants'
import { Typography } from '@mui/material'
import { map } from 'lodash'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import { Metadata } from '../../components/Metadata/Metadata'
import { Contact } from './Contact/Contact'
import { Footer } from './Footer/Footer'
import { useStyles } from './styles'
import { loginMutation } from './service'
import { useMutation } from '@apollo/client'
import { AuthContext } from '../../providers/AuthProvider/AuthContext'
import { Link } from 'react-router-dom'
import { ApolloError } from '../Admin/Users/interfaces'
import { WarningModal } from '../../components/WarningModal/Warning'
import { useHistory } from 'react-router-dom'
export const Login = () => {
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
      title: 'Bookmark this website: infocenter.mytechhigh.com',
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
      title: 'Bookmark this website: mytechhigh.com/canvas',
    },
  ]

  const [apolloError, setApolloError] = useState<ApolloError>({
    title: '',
    severity: '',
    flag: false,
  })

  const renderInfocenterHelpLinks = (arr: Array<any>, canvas?: boolean) =>
    map(arr, (link, idx) => (
      <Grid item xs={12} textAlign='left'>
        <Paragraph size='large' color={canvas ? 'black' : 'white'}>
          {link.title}
        </Paragraph>
        <hr style={{ borderTop: 'dotted 1px white', borderBottom: '0' }} />
      </Grid>
    ))

  const classes = useStyles
  const [login, { data, loading, error }] = useMutation(loginMutation)
  const [username, setUsername] = useState<string | undefined>()
  const [password, setPassword] = useState<string | undefined>()
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
  useEffect(() => {
    if (!loading && data !== undefined) {
      const jwt = data.login.jwt
      localStorage.setItem('JWT', jwt)
      setCredentials(jwt)
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

  return (
    <Box sx={{ backgroundColor: 'white' }}>
      <Box sx={{ alignItems: 'center', marginBottom: 4 }}>
        {apolloError.flag && (
          <WarningModal
            handleModem={() => setApolloError({ title: '', severity: '', flag: false })}
            title={apolloError.severity}
            subtitle={apolloError.title}
            btntitle='Close'
            handleSubmit={() => setApolloError({ title: '', severity: '', flag: false })}
          />
        )}
        <Grid
          container
          sx={{
            position: 'relative',
            paddingY: '48px',
            paddingX: '93px',
          }}
        >
          {/*Infocenter*/}
          <Grid item container xs={6} sx={{ background: BUTTON_LINEAR_GRADIENT, padding: 6 }}>
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
              <Grid item xs={8}>
                <Box display='flex' flexDirection='column' width='100%'>
                  <TextField
                    label='Username'
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
                  <Box sx={classes.passwordContainer}>
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
                    <Typography sx={classes.forgotPassword} onClick={handleForgotPassword}>
                      Forgot Password
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant='contained' onClick={() => loginAction()} sx={classes.signInButton}>
                    Sign In
                  </Button>
                </Box>
              </Grid>
              <Grid item container sx={{ marginY: 4 }}>
                {renderInfocenterHelpLinks(infocenterHelpLinks)}
              </Grid>
              <Grid item xs={12}>
                <Metadata
                  title={<Subtitle color='white'> Watch this two-minute InfoCenter overview.</Subtitle>}
                  subtitle={<Paragraph color='white'>of navigation InfoCenter</Paragraph>}
                  image={<PlayCircleOutlineIcon style={{ color: 'white', marginRight: 24 }} />}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item container xs={6} sx={{ padding: 6, background: '#EEF4F8' }}>
            <Grid item xs={12}>
              <Box textAlign='left'>
                <Typography fontSize={58} fontWeight={400} color='black'>
                  Canvas
                </Typography>
                <Typography fontSize={17} color='black'>
                  Home of MTH Direct tech and entrepreneurship courses
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: -20 }}>
                <Button variant='contained' sx={classes.canvasButton}>
                  Sign In
                </Button>
              </Box>
            </Grid>
            <Box sx={{ marginTop: -30 }}>{renderInfocenterHelpLinks(canvasHelpLinks, true)}</Box>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Link to={'applications'} target='_blank' rel='noopener noreferrer'>
            <Button
              variant='contained'
              style={{
                borderRadius: 8,
                fontSize: 12,
                background: BUTTON_LINEAR_GRADIENT,
                width: 600,
                height: 48,
              }}
            >
              Apply Now
            </Button>
          </Link>
        </Box>
      </Box>
      <Contact />
      <Footer />
    </Box>
  )
}
