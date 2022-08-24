import React, { useEffect, useState } from 'react'
import { Box, Container } from '@mui/material'
import { Link } from 'react-router-dom'
import BGSVG from '@mth/assets/ApplicationBG.svg'
import { NewApplicationFooter } from '@mth/components/NewApplicationFooter/NewApplicationFooter'
import { Title } from '@mth/components/Typography/Title/Title'
import { MthColor, MthRoute } from '@mth/enums'
import { getWindowDimension } from '@mth/utils'

export type StudentInput = {
  first_name: string
  last_name: string
  program_year: string
  grade_level: string
}

export const CompleteAccountSuccess: React.FC = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimension())

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimension())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
            <Box paddingX={windowDimensions.width < 1000 ? 3 : 36}>
              <Box marginTop={12}>
                <Title color={MthColor.MTHBLUE} textAlign='center'>
                  InfoCenter
                </Title>
              </Box>
              <Box marginTop={'100px'}>
                <Title size={windowDimensions.width < 460 ? 'small' : 'medium'} fontWeight='500' textAlign='center'>
                  You have successfully created your account. Please continue
                  <Link
                    to={MthRoute.DASHBOARD as string}
                    style={{ fontWeight: 700, color: MthColor.MTHBLUE, textDecoration: 'none' }}
                  >
                    {'\u00A0'}here{'\u00A0'}
                  </Link>
                  and Sign In.
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
