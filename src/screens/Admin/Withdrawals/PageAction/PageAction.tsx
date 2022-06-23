import { Box, Button, FormControl, MenuItem, Select } from '@mui/material'
import React, { useEffect, useState, useContext } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { useQuery } from '@apollo/client'
import { getWithdrawalsCountByStatusQuery } from '../../../../graphql/queries/withdrawal'
import { WithdrawalFilters } from '../WithdrawalFilters'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { makeStyles } from '@material-ui/styles'
import { useStyles } from './styles'
import { PageActionProps, WithdrawalCount } from '../type'

const selectStyles = makeStyles({
  select: {
    '& .MuiSvgIcon-root': {
      color: 'blue',
    },
  },
})

const PageAction = ({
  totalWithdrawals,
  searchField,
  paginationLimit,
  selectedStatuses,
  setSelectedStatuses,
  onQuickWithdrawalClick,
  setSkip,
  setPaginationLimit,
}: PageActionProps) => {
  const { me } = useContext(UserContext)
  const classes = useStyles
  const selectedClass = selectStyles()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [withdrawalCounts, setWithdrawalCounts] = useState<WithdrawalCount>()
  const [selectedYear, setSelectedYear] = useState<string | number>('1')
  const schoolYears = [
    {
      label: '21-22',
      value: '1',
    },
    {
      label: '22-23',
      value: '2',
    },
    {
      label: '23-24',
      value: '3',
    },
  ]

  //	Table Page change action
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSkip(paginationLimit ? paginationLimit * (page - 1) : 25)
  }

  const { data: withdrawalsCountData } = useQuery(getWithdrawalsCountByStatusQuery, {
    variables: {
      filter: {
        region_id: me?.selectedRegionId,
        keyword: searchField,
      },
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
    if (withdrawalsCountData && withdrawalsCountData.withdrawalCountsByStatus.error === false) {
      setWithdrawalCounts(withdrawalsCountData.withdrawalCountsByStatus.results)
    }
  }, [withdrawalsCountData])

  return (
    <>
      <Box sx={classes.container}>
        <Box sx={classes.content}>
          <Box sx={classes.buttonDiv}>
            <Button sx={classes.quickWithdrawalButton} onClick={onQuickWithdrawalClick}>
              Quick Withdrawal
            </Button>
          </Box>
        </Box>
        <Pagination
          setParentLimit={setPaginationLimit}
          handlePageChange={handlePageChange}
          defaultValue={paginationLimit || 25}
          numPages={Math.ceil(totalWithdrawals / paginationLimit)}
          currentPage={currentPage}
        />
      </Box>
      <Box>
        <WithdrawalFilters
          filters={selectedStatuses}
          setFilters={setSelectedStatuses}
          withdrawCount={withdrawalCounts}
        />
      </Box>
      <Box display='flex' flexDirection='row' justifyContent='flex-end' sx={{ mr: 3 }} alignItems='center'>
        <FormControl variant='standard' sx={{ m: 1 }}>
          <Select
            size='small'
            value={selectedYear}
            IconComponent={ExpandMoreIcon}
            disableUnderline
            onChange={(e) => {
              setSelectedYear(e.target.value)
            }}
            label='year'
            className={selectedClass.select}
            sx={{ color: 'blue', border: 'none' }}
          >
            {schoolYears.map((sy) => (
              <MenuItem key={sy.value} value={sy.value}>
                {sy.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </>
  )
}

export default PageAction
