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
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import PageHeader from '@mth/components/PageHeader'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { BUTTON_LINEAR_GRADIENT, HOMEROOM_LEARNING_LOGS } from '../../../../../utils/constants'
import { GetMastersByIDGql, getAssignmentsByMasterIdgql } from '../../services'
import { useStyles } from '../../styles'
import { Master } from '../types'
import { Assignment } from './types'

const MasterHoomroom: React.FC<{ masterId: number }> = ({ masterId }) => {
  const [masterTitle, setMasterTitle] = useState<string>()
  const [masterSchoolYearId, setMasterSchoolYearId] = useState<number>(0)
  const [tableData, setTableData] = useState<MthTableRowItem<Assignment>[]>([])
  const [localSearchField, setLocalSearchField] = useState<string>('')

  const [masterInfo, setMasterInfo] = useState<Master | null>(null)

  const [paginatinLimit, setPaginatinLimit] = useState<number>(25)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [skip, setSkip] = useState<number>()

  const { me } = useContext(UserContext)
  const { dropdownItems: schoolYearDropdownItems } = useSchoolYearsByRegionId(me?.selectedRegionId)

  const { loading: masterLoading, data: masterData } = useQuery(GetMastersByIDGql, {
    variables: {
      masterId: masterId,
    },
    skip: masterId ? false : true,
    fetchPolicy: 'network-only',
  })

  const history = useHistory()

  useEffect(() => {
    if (!masterLoading && masterData.getMastersById) {
      setMasterInfo(masterData.getMastersById)
      setMasterTitle(masterData.getMastersById.master_name)
      setMasterSchoolYearId(masterData.getMastersById.school_year_id)
    }
  }, [masterLoading, masterData])

  const fields: MthTableField<Assignment>[] = [
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

  const createData = (assignment: Assignment): MthTableRowItem<Assignment> => {
    return {
      key: `assignment-${assignment.id}`,
      columns: {
        title: assignment.title,
        reminder: moment(assignment.reminder_date).format('MMM DD [at] h:mm A'),
        auto_grade: moment(assignment.auto_grade).format('MMM DD [at] h:mm A'),
        teacher_deadline: moment(assignment.teacher_deadline).format('MMM DD [at] h:mm A'),
        due_date: moment(assignment.due_date).format('MMM DD'),
      },
      rawData: assignment,
    }
  }

  const { loading: assloading, data: assData } = useQuery(getAssignmentsByMasterIdgql, {
    variables: {
      masterId: masterId,
      take: paginatinLimit,
      sort: null,
      skip: skip,
      search: null,
    },
    skip: masterId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!assloading && assData?.getAssignmentsByMasterId) {
      setTotalPage(assData?.getAssignmentsByMasterId.page_total)
      setTableData(
        assData?.getAssignmentsByMasterId.results.map((item: Assignment) => {
          return createData(item)
        }),
      )
    }
  }, [assData])

  const handleChangePageLimit = (num: number) => {
    setPaginatinLimit(num)
    setCurrentPage(0)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSkip(() => {
      return paginatinLimit ? paginatinLimit * (page - 1) : 25
    })
  }

  return (
    <Box sx={{ p: 4, textAlign: 'left' }}>
      <Card
        sx={{
          p: 4,
          borderRadius: '12px',
          boxShadow: '0px 0px 35px rgba(0, 0, 0, 0.05)',
          minHeight: 'calc(100vh - 150px)',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <PageHeader title={masterInfo?.master_name || ''} to={HOMEROOM_LEARNING_LOGS}>
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
              onClick={() => history.push(`${HOMEROOM_LEARNING_LOGS}/edit/${masterId}/edit-assignment`)}
            >
              + Add Assignment
            </Button>
          </Box>
          <Pagination
            setParentLimit={handleChangePageLimit}
            handlePageChange={handlePageChange}
            defaultValue={paginatinLimit || 25}
            numPages={Math.ceil(totalPage / paginatinLimit) || 0}
            currentPage={currentPage}
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
