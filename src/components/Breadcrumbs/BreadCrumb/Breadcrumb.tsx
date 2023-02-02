import React from 'react'
import { Box } from '@mui/material'
import { Paragraph } from '../../Typography/Paragraph/Paragraph'
import { BreadcrumbProps } from './types'

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ title, active, idx, handleClick }) => {
  const showBorder = active ? '#4145FF' : '#EEF4F8'

  return (
    <Box
      style={{ borderColor: showBorder, cursor: 'pointer' }}
      borderBottom={4}
      display='inline-block'
      paddingRight={5}
      onClick={() => handleClick(idx)}
    >
      <Paragraph size='medium' fontWeight='700'>
        {title}
      </Paragraph>
    </Box>
  )
}
