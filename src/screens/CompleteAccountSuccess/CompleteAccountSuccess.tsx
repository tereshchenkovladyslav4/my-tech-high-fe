import React, { FunctionComponent } from 'react'
import { Box, Container } from '@mui/material'

import { Link } from 'react-router-dom'

import BGSVG from '../../assets/ApplicationBG.svg'
import { NewApplicationFooter } from '../../components/NewApplicationFooter/NewApplicationFooter'
import { Title } from '../../components/Typography/Title/Title'
import { DASHBOARD, MTHBLUE } from '../../utils/constants'

export type StudentInput = {
  first_name: string
  last_name: string
  program_year: string
  grade_level: string
}

export const CompleteAccountSuccess: FunctionComponent = () => {
  return (
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
                <Title color={MTHBLUE} textAlign='center'>
                  InfoCenter
                </Title>
              </Box>
              <Title fontWeight='500' textAlign='center'>
                Apply
              </Title>
              <Box marginTop={'50%'}>
                <Title size='medium' fontWeight='500' textAlign='center'>
                  You have successfully created your account. Please continue
                  <Link to={DASHBOARD} style={{ fontWeight: 700, color: MTHBLUE, textDecoration: 'none' }}>
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
