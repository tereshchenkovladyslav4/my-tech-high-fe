import React from 'react'
import { Box } from '@mui/system'
import { MthRadioGroup } from '@mth/components/MthRadioGroup'
import { DiplomaSeekingProps } from '../types'
import { diplomaSeekingClassess } from './styles'

const DiplomaSeeking: React.FC<DiplomaSeekingProps> = ({ title, description, options, setOptions }) => {
  return (
    <Box sx={diplomaSeekingClassess.main}>
      <MthRadioGroup
        ariaLabel='diploma-seeking'
        title={title}
        description={description}
        options={options}
        handleChangeOption={setOptions}
      />
    </Box>
  )
}

export default DiplomaSeeking
