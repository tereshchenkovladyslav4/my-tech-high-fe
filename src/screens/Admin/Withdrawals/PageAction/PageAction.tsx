import React, { useEffect, useState, useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Box, Button } from '@mui/material'
import moment from 'moment'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getSchoolYearsByRegionId } from '../../Dashboard/SchoolYear/SchoolYear'
import { PageActionProps } from '../type'
import { WithdrawalFilters } from '../WithdrawalFilters'
import { actionClassess } from './styles'

type SchoolYearType = {
  school_year_id: number
  date_begin: Date
  date_end: Date
  label?: string
}

const PageAction: React.FC<PageActionProps> = ({
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
}) => {
  const { me } = useContext(UserContext)

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
          borderNone={true}
          setParentValue={(val) => {
            setSelectedYear(Number(val))
          }}
        />
      </Box>
    </>
  )
}

export default PageAction
