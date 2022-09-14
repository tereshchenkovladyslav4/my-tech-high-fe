import React from 'react'
import { Box } from '@mui/system'
import { TestingPreferenceProps } from '../types'
import { testingPrefrenceClassess } from './styles'

const TestingPreference: React.FC<TestingPreferenceProps> = ({}) => {
  return <Box sx={testingPrefrenceClassess.main}>....Testing Prefrence Coming Soon</Box>
}

export default TestingPreference
