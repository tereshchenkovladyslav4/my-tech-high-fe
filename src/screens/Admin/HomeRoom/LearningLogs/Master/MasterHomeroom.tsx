import React, { useEffect, useState, useContext } from 'react'
import { useQuery } from '@apollo/client'
import { DeleteForeverOutlined } from '@mui/icons-material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CreateIcon from '@mui/icons-material/Create'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  Card,
  IconButton,
  Tooltip,
  InputAdornment,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import PageHeader from '@mth/components/PageHeader'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { commonClasses } from '@mth/styles/common.style'
import { BUTTON_LINEAR_GRADIENT, HOMEROOM_LEARNING_LOGS } from '../../../../../utils/constants'
import { GetMastersBySchoolYearIDGql, GetMastersByIDGql } from '../../services'
import { useStyles } from '../../styles'
import { Master } from '../types'
import { Teacher } from './types'

const MasterHoomroom: React.FC<{ masterId: number }> = ({ masterId }) => {
  const [selectedYear, setSelectedYear] = useState<number>(0)

  const [masterTitle, setMasterTitle] = useState<string>()
  const [masterSchoolYearId, setMasterSchoolYearId] = useState<number>(0)
  // const [searchField, setSearchField] = useState<string>('')
  const [tableData, setTableData] = useState<MthTableRowItem<Teacher>[]>([])
  const [localSearchField, setLocalSearchField] = useState<string>('')

  const [masterInfo, setMasterInfo] = useState<Master>({})

  const { me } = useContext(UserContext)
  const { dropdownItems: schoolYearDropdownItems, schoolYears: schoolYears } = useSchoolYearsByRegionId(
    me?.selectedRegionId,
  )

  const { loading: masterLoading, data: masterData } = useQuery(GetMastersByIDGql, {
    variables: {
      masterId: masterId,
    },
    skip: masterId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!masterLoading && masterData.getMastersById) {
      setMasterInfo(masterData.getMastersById)
      setMasterTitle(masterData.getMastersById.master_name)
      setMasterSchoolYearId(masterData.getMastersById.school_year_id)
    }
  }, [masterLoading, masterData])

  useEffect(() => {
    if (schoolYears?.length) setSelectedYear(schoolYears[0].school_year_id)
  }, [schoolYears])

  const fields: MthTableField<Teacher>[] = [
    {
      key: 'due_date',
      label: 'Due Date',
      sortable: false,
      tdClass: '',
      // width: '30%',
    },
    {
      key: 'title',
      label: 'Title',
      sortable: false,
      tdClass: '',
      // width: '30%',
    },
    {
      key: 'reminder',
      label: 'Reminder',
      sortable: false,
      tdClass: '',
      // width: '30%',
    },
    {
      key: 'auto_grade',
      label: 'Auto-grade',
      sortable: false,
      tdClass: '',
      // width: '50%',
    },
    {
      key: 'teacher_deadline',
      label: 'Teacher Deadline',
      sortable: false,
      tdClass: '',
      // width: '50%',
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      tdClass: '',
      // 48px is for checkbox
      // width: 'calc(25% - 48px)',
      formatter: () => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'} flexWrap={'wrap'}>
            <Tooltip title='Edit' placement='top'>
              <IconButton color='primary' className='actionButton'>
                <CreateIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete' placement='top'>
              <IconButton className='actionButton' color='primary'>
                <DeleteForeverOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title='Clone' placement='top'>
              <IconButton className='actionButton' color='primary'>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )
      },
    },
  ]

  const createData = (teacher: Teacher): MthTableRowItem<Teacher> => {
    return {
      key: `teacher-${teacher.id}`,
      columns: {
        due_date: teacher.due_date,
        title: teacher.title,
        reminder: teacher.reminder,
        auto_grade: teacher.auto_grade,
        teacher_deadline: teacher.teacher_deadline,
      },
      rawData: teacher,
    }
  }

  const exampleData = [
    {
      id: 1,
      due_date: 'Aug 1',
      title: 'Learning Log #1-2',
      reminder: 'Aug 1 at 10:00 AM',
      auto_grade: 'Aug 2 at 8:00 AM',
      teacher_deadline: 'Aug 2 at 8:00 AM',
    },
    {
      id: 2,
      due_date: 'Aug 2',
      title: 'Learning Log #2-2',
      reminder: 'Aug 1 at 11:00 AM',
      auto_grade: 'Aug 2 at 18:00 PM',
      teacher_deadline: 'Aug 2 at 8:00 AM',
    },
    {
      id: 3,
      due_date: 'Aug 11',
      title: 'Learning Log #10-2',
      reminder: 'Aug 1 at 11:00 AM',
      auto_grade: 'Aug 2 at 8:00 AM',
      teacher_deadline: 'Aug 2 at 8:00 AM',
    },
  ]

  const { loading, data } = useQuery(GetMastersBySchoolYearIDGql, {
    variables: {
      schoolYearId: selectedYear,
    },
    skip: selectedYear ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && data) {
      setTableData(
        exampleData.map((item: Teacher) => {
          return createData(item)
        }),
      )
    }
  }, [data, loading])

  return (
    <Box sx={commonClasses.mainLayout}>
      <Card sx={{ ...commonClasses.mainBlock, ...commonClasses.fitScreen }}>
        <Box sx={{ mb: 4 }}>
          <PageHeader title={masterInfo.master_name || ''} to={HOMEROOM_LEARNING_LOGS}>
            <Button sx={useStyles.saveButtons} type='button'>
              Save
            </Button>
          </PageHeader>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ width: '40%' }}>
            <TextField
              label='Master Title'
              placeholder='Entry'
              fullWidth
              InputLabelProps={{ shrink: true }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setMasterTitle(e.target.value)
              }}
              className='MthFormField'
              value={masterTitle}
            />
          </Box>
          <Box sx={{ width: '40%' }}>
            <DropDown
              dropDownItems={schoolYearDropdownItems}
              placeholder='Year'
              name='schoolYear'
              labelTop
              sx={{ m: 0 }}
              defaultValue={masterSchoolYearId}
              setParentValue={(val) => {
                setMasterSchoolYearId(+val)
              }}
            />
          </Box>
        </Box>

        {/* search */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            my: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography fontSize='18px' fontWeight='700'>
              Instructions
            </Typography>
            <Tooltip title='Edit' sx={{ marginLeft: '15px' }}>
              <IconButton>
                <EditIcon sx={{ color: '#4145FF' }} />
              </IconButton>
            </Tooltip>
          </Box>
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
        </Box>

        <Box
          sx={{
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginY: '12px',
          }}
        >
          <Box
            sx={{
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Button
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                background: BUTTON_LINEAR_GRADIENT,
                color: 'white',
                padding: '10px 30px',
                fontSize: '12px',
              }}
            >
              + Add Assignment
            </Button>
          </Box>
          <Pagination
            // setParentLimit={handleChangePageLimit}
            handlePageChange={() => {}}
            // defaultValue={paginatinLimit || 25}
            numPages={8}
            currentPage={1}
          />
        </Box>

        <Box>
          <MthTable items={tableData} loading={false} fields={fields} checkBoxColor='secondary' />
        </Box>
      </Card>
    </Box>
  )
}

export default MasterHoomroom
