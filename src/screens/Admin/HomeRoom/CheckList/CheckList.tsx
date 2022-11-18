import React, { useEffect, useState, useContext } from 'react'
import CreateIcon from '@mui/icons-material/Create'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Card, IconButton, Tooltip, InputAdornment, OutlinedInput } from '@mui/material'
import DownloadFileIcon from '@mth/assets/icons/file-download.svg'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { SchoolYearResponseType, useSchoolYearsByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { commonClasses } from '@mth/styles/common.style'
import { HomeRoomHeader } from '../Components/HomeRoomHeader'

import { checkListClass } from './styles'
import { SubjectCheckList, IndependentCheckList } from './types'

const CheckList: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(0)
  const [selectedYearData, setSelectedYearData] = useState<SchoolYearResponseType | undefined>()
  const [localSearchField, setLocalSearchField] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [checkListItems, setCheckListItems] = useState<DropDownItem[]>([])
  const [selectedCheckListItem, setSelectedCheckListItem] = useState<string | number | boolean>('subject_checklist')
  const [tableData, setTableData] = useState<MthTableRowItem<SubjectCheckList>[]>([])
  const { me } = useContext(UserContext)
  const { dropdownItems: schoolYearDropdownItems, schoolYears: schoolYears } = useSchoolYearsByRegionId(
    me?.selectedRegionId,
  )
  const [paginatinLimit, setPaginatinLimit] = useState<number>(Number(localStorage.getItem('pageLimit')) || 25)
  const [skip, setSkip] = useState<number>(0)

  useEffect(() => {
    setCheckListItems([
      { label: 'Subject Checklist', value: 'subject_checklist' },
      { label: 'Independent Checklist', value: 'independent_checklist' },
    ])
  }, [])

  useEffect(() => {
    if (selectedYear && schoolYears) {
      const schoolYearData = schoolYears.find((item) => item.school_year_id == selectedYear)
      if (schoolYearData) setSelectedYearData(schoolYearData)
    }
  }, [selectedYear])

  useEffect(() => {
    if (schoolYears?.length) setSelectedYear(schoolYears[0].school_year_id)
  }, [schoolYears])

  const subjectFields: MthTableField<SubjectCheckList>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: false,
      tdClass: '',
      width: '0',
    },
    {
      key: 'grade',
      label: 'Grade',
      sortable: false,
      tdClass: '',
      width: '0',
    },
    {
      key: 'subject',
      label: 'Subject',
      sortable: false,
      tdClass: '',
      width: '0',
    },
    {
      key: 'goal',
      label: 'Goal',
      sortable: false,
      tdClass: '',
      width: '0',
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      tdClass: '',
      width: 'calc(25% - 48px)',
      formatter: (item: MthTableRowItem<SubjectCheckList>) => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'} flexWrap={'wrap'}>
            <Box sx={{ display: 'none' }}>{item.key}</Box>
            <Tooltip title='Edit' placement='top'>
              <IconButton color='primary' className='actionButton'>
                <CreateIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )
      },
    },
  ]

  const independentFields: MthTableField<IndependentCheckList>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: false,
      tdClass: '',
      width: '0',
    },
    {
      key: 'goal',
      label: 'Goal',
      sortable: false,
      tdClass: '',
      width: '0',
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      tdClass: '',
      width: 'calc(25% - 48px)',
      formatter: (item: MthTableRowItem<IndependentCheckList>) => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'} flexWrap={'wrap'}>
            <Box sx={{ display: 'none' }}>{item.key}</Box>
            <Tooltip title='Edit' placement='top'>
              <IconButton color='primary' className='actionButton'>
                <CreateIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )
      },
    },
  ]

  const exampleData = [
    {
      columns: { id: 1, grade: 'K', subject: 2, goal: ['a', `${selectedYearData}`] },
      key: 'subject-false-40',
      rawData: { id: 2, grade: 'K', subject: 2, goal: ['a', `${skip}`] },
      selectable: true,
    },
  ]

  const handleChangePageLimit = (value: number) => {
    handlePageChange(1)
    setPaginatinLimit(value)
  }

  const handlePageChange = (page: number) => {
    localStorage.setItem('currentPage', page.toString())
    setCurrentPage(page)
    setSkip(() => {
      return paginatinLimit ? paginatinLimit * (page - 1) : 25
    })
  }

  return (
    <Box sx={commonClasses.mainLayout}>
      <Card sx={{ ...commonClasses.mainBlock, ...commonClasses.fitScreen }}>
        <HomeRoomHeader
          title='CheckList'
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          schoolYearDropdownItems={schoolYearDropdownItems}
        />
        {/* checklist type dropdown */}
        <Box sx={checkListClass.flexCenterBetween}>
          <DropDown
            dropDownItems={checkListItems}
            defaultValue={selectedCheckListItem}
            sx={{ minWidth: '200px', maxWidth: '230px', textAlign: 'left', alignItems: 'center' }}
            borderNone={true}
            color={MthColor.BLACK}
            setParentValue={(value) => {
              setSelectedCheckListItem(value)
              if (value === 'independent_checklist') {
                setTableData(exampleData)
              } else {
                setTableData([])
              }
            }}
          />

          {/* import button */}
          <Box sx={{ ...checkListClass.flexCenter, gap: '24px' }}>
            <Button variant='contained' sx={checkListClass.submitBtn}>
              <Subtitle sx={{ fontSize: '14px', fontWeight: '500' }}>+ Import</Subtitle>
            </Button>
            <Tooltip title='Download' placement='top' sx={checkListClass.tooltipBtn}>
              <img src={DownloadFileIcon} alt='Download Icon' width={24} height={24} />
            </Tooltip>
          </Box>
        </Box>

        {/* search */}
        <Box sx={{ ...checkListClass.flexCenterBetween, my: 4 }}>
          <Box sx={{ width: { xs: '100%', md: '280px' } }}>
            <OutlinedInput
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'Search...')}
              size='small'
              fullWidth
              value={localSearchField || ''}
              placeholder='Search...'
              onChange={(e) => setLocalSearchField(e.target.value)}
              startAdornment={
                <InputAdornment position='start'>
                  <SearchIcon style={{ color: 'black' }} />
                </InputAdornment>
              }
            />
          </Box>
          <Pagination
            setParentLimit={handleChangePageLimit}
            handlePageChange={handlePageChange}
            defaultValue={paginatinLimit || 25}
            numPages={Math.ceil((100 as number) / paginatinLimit) || 0}
            currentPage={currentPage}
          />
        </Box>

        {/* render mthTable table */}
        <Box>
          <MthTable
            items={tableData}
            loading={false}
            fields={selectedCheckListItem === 'subject_checklist' ? subjectFields : independentFields}
            checkBoxColor='secondary'
          />
        </Box>
      </Card>
    </Box>
  )
}

export default CheckList
