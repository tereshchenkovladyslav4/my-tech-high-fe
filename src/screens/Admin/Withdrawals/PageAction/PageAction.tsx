import React, { useEffect, useState, useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Box, Button, FormControl, MenuItem, Select } from '@mui/material'
import { makeStyles } from '@material-ui/styles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import moment from 'moment'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { WithdrawalFilters } from '../WithdrawalFilters'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { actionClassess } from './styles'
import { PageActionProps } from '../type'
import { getSchoolYearsByRegionId } from '../../Dashboard/SchoolYear/SchoolYear'
import { DropDown } from '../../SiteManagement/components/DropDown/DropDown'
import { DropDownItem } from '../../SiteManagement/components/DropDown/types'

const selectStyles = makeStyles({
  select: {
    '& .MuiSvgIcon-root': {
      color: 'blue',
    },
  },
})

type SchoolYearType = {
  school_year_id: number
  date_begin: Date
  date_end: Date
  label?: string
}

const PageAction = ({
  totalWithdrawals,
  paginationLimit,
  selectedStatuses,
  withdrawalCounts,
  setSelectedStatuses,
  onQuickWithdrawalClick,
  setSkip,
  setPaginationLimit,
  selectedYear,
  setSelectedYear,
}: PageActionProps) => {
  const { me } = useContext(UserContext)
  const selectedClass = selectStyles()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [schoolYears, setSchoolYears] = useState<DropDownItem[]>([])
  const schoolYearData = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  //	Table Page change action
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSkip(paginationLimit ? paginationLimit * (page - 1) : 25)
  }

  useEffect(() => {
    if (schoolYearData?.data?.region?.SchoolYears) {
      const { SchoolYears } = schoolYearData?.data?.region
      setSchoolYears(
        SchoolYears.map((item: SchoolYearType) => ({
          value: item.school_year_id,
          label: moment(item.date_begin).format('YY') + ' - ' + moment(item.date_end).format('YY'),
        })),
      )
      setSelectedYear(SchoolYears[0].school_year_id)
    }
  }, [schoolYearData?.data?.region?.SchoolYears])

  const handlePageLimit = (limit: number) => {
    setPaginationLimit(limit)
    handlePageChange(1)
  }

  return (
    <>
      <Box sx={actionClassess.container}>
        <Box sx={actionClassess.content}>
          <Box sx={actionClassess.buttonDiv}>
            <Button sx={actionClassess.quickWithdrawalButton} onClick={onQuickWithdrawalClick}>
              Quick Withdraw
            </Button>
          </Box>
        </Box>
        <Pagination
          setParentLimit={handlePageLimit}
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
        <DropDown
          dropDownItems={schoolYears}
          placeholder={'Select Year'}
          defaultValue={selectedYear}
          sx={{ width: '200px' }}
          borderNone={true}
          setParentValue={(val) => {
            setSelectedYear(val)
          }}
        />
      </Box>
    </>
  )
}

export default PageAction
