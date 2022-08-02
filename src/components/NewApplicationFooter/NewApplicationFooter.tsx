import React, { FunctionComponent } from 'react'
import { Box } from '@mui/system'
import { MTHBLUE } from '../../utils/constants'
import { Paragraph } from '../Typography/Paragraph/Paragraph'

export const NewApplicationFooter: FunctionComponent = () => (
  <Box display='flex' flexDirection='column' width='100%'>
    <Box display='flex' flexDirection='row' width='100%' justifyContent='center'>
      <Paragraph>© 2021 {'\u00A0'} </Paragraph>
      <Paragraph color={MTHBLUE}>My Tech High, Inc.</Paragraph>
    </Box>
    <Box display='flex' flexDirection='row' textAlign='center' justifyContent='center'>
      <Paragraph color={MTHBLUE} textAlign='center'>
        Terms of Use | &nbsp;
      </Paragraph>
      <Paragraph color={MTHBLUE} textAlign='center'>
        Privacy &amp; COPPA Policy{' '}
      </Paragraph>
    </Box>
  </Box>
)
