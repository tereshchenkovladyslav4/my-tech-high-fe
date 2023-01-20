import React from 'react'
import { Box, Typography } from '@mui/material'
import { extractContent } from '@mth/utils'

type InformationProps = {
  information: string
}

const Information: React.FC<InformationProps> = ({ information }) => {
  return (
    <Box>
      <Typography fontSize='20px' fontWeight={700} component='span'>
        {'Direct Order & Reimbursement Information'}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: 10,
          marginTop: 3,
        }}
      >
        <Typography fontSize='14px' fontWeight={500} component='span'>
          {extractContent(information)}
        </Typography>
      </Box>
    </Box>
  )
}

export default Information
