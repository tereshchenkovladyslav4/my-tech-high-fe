import React from 'react'
import { Box } from '@mui/system'
import { MthRadioGroup } from '@mth/components/MthRadioGroup'
import { DiplomaSeekingProps } from '../types'
import { diplomaSeekingClasses } from './styles'

const DiplomaSeeking: React.FC<DiplomaSeekingProps> = ({ diplomaQuestion, options, setOptions, isError }) => {
  return (
    <Box sx={diplomaSeekingClasses.main}>
      <MthRadioGroup
        ariaLabel='diploma-seeking'
        title={diplomaQuestion.title}
        description={diplomaQuestion.description}
        options={options}
        handleChangeOption={setOptions}
        isError={isError}
      />
    </Box>
  )
}

export default DiplomaSeeking
