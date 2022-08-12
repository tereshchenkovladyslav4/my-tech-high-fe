import React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, InputAdornment, OutlinedInput } from '@mui/material'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { PageHeaderProps } from '../type'
import { headerClassess } from './styles'

const PageHeader: React.FC<PageHeaderProps> = ({
  totalWithdrawals,
  searchField,
  setSearchField,
  onEmailClick,
  onWithdrawClick,
  onReinstateClick,
}) => {
  return (
    <Box sx={headerClassess.pageHeader}>
      <Box sx={headerClassess.pageHeaderContent}>
        <Subtitle size='medium' fontWeight='700'>
          Withdraws
        </Subtitle>
        <Subtitle size='medium' fontWeight='700' sx={{ marginLeft: 2 }}>
          {totalWithdrawals}
        </Subtitle>
        <Box marginLeft={4} sx={{ width: '300px' }}>
          <OutlinedInput
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'Search...')}
            size='small'
            fullWidth
            value={searchField}
            placeholder='Search...'
            onChange={(e) => setSearchField(e.target.value)}
            startAdornment={
              <InputAdornment position='start'>
                <SearchIcon style={{ color: 'black' }} />
              </InputAdornment>
            }
          />
        </Box>
      </Box>
      <Box sx={headerClassess.pageHeaderButtonGroup}>
        <Button sx={headerClassess.emailButton} onClick={onEmailClick}>
          Email
        </Button>
        <Button sx={headerClassess.withdrawalButton} onClick={onWithdrawClick}>
          Withdraw
        </Button>
        <Button sx={headerClassess.reinstateButton} onClick={onReinstateClick}>
          Reinstate
        </Button>
      </Box>
    </Box>
  )
}

export default PageHeader
