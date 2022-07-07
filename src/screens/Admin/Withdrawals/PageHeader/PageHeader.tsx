import React from 'react'
import { Box, Button, InputAdornment, OutlinedInput } from '@mui/material'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import SearchIcon from '@mui/icons-material/Search'
import { useStyles } from './styles'
import { PageHeaderProps } from '../type'

const PageHeader = ({
  totalWithdrawals,
  searchField,
  setSearchField,
  onEmailClick,
  onWithdrawClick,
  onReinstateClick,
}: PageHeaderProps) => {
  const classes = useStyles

  return (
    <Box sx={classes.pageHeader}>
      <Box sx={classes.pageHeaderContent}>
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
      <Box sx={classes.pageHeaderButtonGroup}>
        <Button sx={classes.emailButton} onClick={onEmailClick}>
          Email
        </Button>
        <Button sx={classes.withdrawalButton} onClick={onWithdrawClick}>
          Withdraw
        </Button>
        <Button sx={classes.reinstateButton} onClick={onReinstateClick}>
          Reinstate
        </Button>
      </Box>
    </Box>
  )
}

export default PageHeader
