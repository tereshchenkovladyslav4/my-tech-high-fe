import React from 'react'
import { Box } from '@mui/system'
import { MthColor } from '@mth/enums'
import { Paragraph } from '../Typography/Paragraph/Paragraph'

export const NewApplicationFooter: React.FC = () => (
  <Box display='flex' flexDirection='column' width='100%'>
    <Box display='flex' flexDirection='row' width='100%' justifyContent='center'>
      <Paragraph>
        © {new Date().getFullYear()} {'\u00A0'}{' '}
      </Paragraph>
      <Paragraph color={MthColor.MTHBLUE}>My Tech High, Inc.</Paragraph>
    </Box>
    <Box display='flex' flexDirection='row' textAlign='center' justifyContent='center'>
      <Paragraph color={MthColor.MTHBLUE} textAlign='center'>
        Terms of Use | &nbsp;
      </Paragraph>
      <Paragraph color={MthColor.MTHBLUE} textAlign='center'>
        Privacy &amp; COPPA Policy{' '}
      </Paragraph>
    </Box>
  </Box>
)
