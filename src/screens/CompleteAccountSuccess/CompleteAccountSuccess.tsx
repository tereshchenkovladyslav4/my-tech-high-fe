import { useMutation } from '@apollo/client'
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import BGSVG from '../../assets/ApplicationBG.svg'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link } from 'react-router-dom'
import { useStyles } from './styles';
import { Title } from '../../components/Typography/Title/Title';
import { NewApplicationFooter } from '../../components/NewApplicationFooter/NewApplicationFooter';
import { DASHBOARD, MTHBLUE } from '../../utils/constants';

export type StudentInput = {
  first_name: string
  last_name: string
  program_year: string
  grade_level: string
}

export const CompleteAccountSuccess = () => {

  const classes = useStyles

  return (
		<Container>
        <Box paddingX={36} paddingY={12} height={'100vh'}>
          <Box
            sx={{
              backgroundImage: `url(${BGSVG})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'top',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box marginTop={12}>
              <Title color={MTHBLUE} textAlign='center'>
                InfoCenter
              </Title>
            </Box>
            <Title fontWeight='500' textAlign='center'>
              Apply
            </Title>
            <Box marginTop={'25%'}>
              <Title size='medium' fontWeight='500' textAlign='center'>
                You have successfully created your account. please continue
                <Link 
                  to={DASHBOARD} 
                  style={{ fontWeight: 700, color: MTHBLUE, textDecoration: 'none' }}
                >
                  {'\u00A0'}here{'\u00A0'}
                </Link>
                and login.
              </Title>
            </Box>
          </Box>
        </Box>
      <Box paddingBottom={4}>
        <NewApplicationFooter />
      </Box>
    </Container>
	)
}
