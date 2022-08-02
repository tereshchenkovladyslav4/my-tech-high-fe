import React, { FunctionComponent } from 'react'
import { Box, Grid } from '@mui/material'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { Title } from '../../../components/Typography/Title/Title'
import { BUTTON_LINEAR_GRADIENT } from '../../../utils/constants'

export const Contact: FunctionComponent = () => (
  <Box sx={{ background: BUTTON_LINEAR_GRADIENT, paddingY: 10, paddingX: 12 }}>
    <Grid container>
      <Grid item xs={6}>
        <Title size='large' color='white'>
          Contact us
        </Title>
        <Subtitle color='white'>If you have questions, please reach out!</Subtitle>
      </Grid>
      <Grid item xs={6} alignItems='center' display='flex' justifyContent='center'>
        <Box sx={{ border: 'solid 1px white', padding: 2, borderRadius: 10, width: '50%' }}>
          <Paragraph color='white'>help@mytechhigh.com</Paragraph>
        </Box>
      </Grid>
    </Grid>
  </Box>
)
