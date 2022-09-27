import React from 'react'
import { Box } from '@mui/system'
import { MthRadioGroup } from '@mth/components/MthRadioGroup'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { testingPrefrenceClassess } from '../TestingPreference/styles'
import { DiplomaSeekingProps } from '../types'
import { diplomaSeekingClassess } from './styles'

const DiplomaSeeking: React.FC<DiplomaSeekingProps> = ({ diplomaQuestion, options, setOptions, isError }) => {
  return (
    <Box sx={diplomaSeekingClassess.main}>
      {isError && <Subtitle sx={testingPrefrenceClassess.formError}>Required</Subtitle>}
      <MthRadioGroup
        ariaLabel='diploma-seeking'
        title={diplomaQuestion.title}
        description={diplomaQuestion.description}
        options={options}
        handleChangeOption={setOptions}
      />
    </Box>
  )
}

export default DiplomaSeeking
