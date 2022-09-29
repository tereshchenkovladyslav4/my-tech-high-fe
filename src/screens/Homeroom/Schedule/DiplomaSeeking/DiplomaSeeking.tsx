import React from 'react'
import { Box } from '@mui/system'
import { MthRadioGroup } from '@mth/components/MthRadioGroup'
import { DiplomaSeekingProps } from '../types'
import { diplomaSeekingClassess } from './styles'

const DiplomaSeeking: React.FC<DiplomaSeekingProps> = ({ diplomaQuestion, options, setOptions, isError }) => {
  return (
    <Box sx={diplomaSeekingClassess.main}>
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
