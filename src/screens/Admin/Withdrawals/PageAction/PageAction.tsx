import React, { useEffect, useState, useContext } from 'react'
import { Box, Button } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { PageActionProps } from '../type'
import { WithdrawalFilters } from '../WithdrawalFilters'
import { actionClassess } from './styles'

const PageAction: React.FC<PageActionProps> = ({
  totalWithdrawals,
  paginationLimit,
  selectedStatuses,
  withdrawalCounts,
  setSelectedStatuses,
  onQuickWithdrawalClick,
  setSkip,
  setPaginationLimit,
  setSelectedYear,
}) => {
  const { me } = useContext(UserContext)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const {
    dropdownItems: schoolYearDropdownItems,
    selectedYearId,
    setSelectedYearId,
  } = useSchoolYearsByRegionId(me?.selectedRegionId)

  //	Table Page change action
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSkip(paginationLimit ? paginationLimit * (page - 1) : 25)
  }

  const handlePageLimit = (limit: number) => {
    setPaginationLimit(limit)
    handlePageChange(1)
  }

  useEffect(() => {
    setSelectedYear(selectedYearId || 0)
  }, [selectedYearId])

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
          dropDownItems={schoolYearDropdownItems}
          placeholder={'Select Year'}
          defaultValue={selectedYearId}
          borderNone={true}
          setParentValue={(val) => {
            setSelectedYearId(+val)
          }}
        />
      </Box>
    </>
  )
}

export default PageAction
