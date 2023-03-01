import React, { useEffect, useState, useContext } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { DeleteForeverOutlined } from '@mui/icons-material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CreateIcon from '@mui/icons-material/Create'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Card, IconButton, Tooltip, InputAdornment, OutlinedInput } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { MthColor, MthRoute } from '@mth/enums'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { HomeRoomHeader } from '../Components/HomeRoomHeader'
import { CreateNewMasterGql, DeleteMasterByIdGql, GetMastersBySchoolYearIDGql } from '../services'
import ClassesComponent from './Classes'
import { CreateMasterModal } from './CreateMasterModal'
import { Classes, Master } from './types'

const LearningLogs: React.FC = () => {
  const history = useHistory()

  // const [searchField, setSearchField] = useState<string>('')
  const [tableData, setTableData] = useState<MthTableRowItem<Master>[]>([])
  const [localSearchField, setLocalSearchField] = useState<string>('')
  const [isCreateModal, setIsCreateModal] = useState<boolean>(false)

  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<number | null>()

  const { me } = useContext(UserContext)
  const {
    dropdownItems: schoolYearDropdownItems,
    selectedYearId,
    setSelectedYearId,
    selectedYear,
  } = useSchoolYearsByRegionId(me?.selectedRegionId)

  const handleDeleteMaster = async (masterId: number) => {
    setDeleteConfirm(true)
    setDeleteId(masterId)
  }

  const [deleteMaster] = useMutation(DeleteMasterByIdGql)
  const submitDeleteMaster = async () => {
    await deleteMaster({
      variables: {
        masterId: Number(deleteId),
      },
    })
    refetch()
    setDeleteConfirm(false)
  }

  const fields: MthTableField<Master>[] = [
    {
      key: 'master',
      label: 'Master',
      sortable: false,
      tdClass: '',
      width: '30%',
    },
    {
      key: 'classesCount',
      label: 'Classes',
      sortable: false,
      tdClass: '',
      width: '50%',
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      tdClass: '',
      width: 'calc(25% - 48px)',
      formatter: (item: MthTableRowItem<Master>) => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'} flexWrap={'wrap'}>
            <Tooltip
              title='Edit'
              placement='top'
              onClick={() => history.push(`${MthRoute.HOMEROOM_LEARNING_LOGS}/edit/${item.rawData.master_id}`)}
            >
              <IconButton color='primary' className='actionButton'>
                <CreateIcon />
              </IconButton>
            </Tooltip>
            {calcMasterStudentCount(item.rawData.Classes || []) > 0 ? (
              <IconButton className='actionButton' color='primary' disabled>
                <DeleteForeverOutlined />
              </IconButton>
            ) : (
              <Tooltip title='Delete' placement='top'>
                <IconButton
                  className='actionButton'
                  color='primary'
                  onClick={() => handleDeleteMaster(item.rawData.master_id)}
                >
                  <DeleteForeverOutlined />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title='Clone' placement='top'>
              <IconButton className='actionButton' color='primary'>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              onClick={() => {
                if (item.toggleExpand) item.toggleExpand()
              }}
              className='actionButton expandButton'
              color='primary'
            >
              <ExpandMoreOutlinedIcon />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  const { loading, data, refetch } = useQuery(GetMastersBySchoolYearIDGql, {
    variables: {
      schoolYearId: selectedYearId,
    },
    skip: selectedYearId ? false : true,
    fetchPolicy: 'network-only',
  })

  const createData = (master: Master): MthTableRowItem<Master> => {
    return {
      key: `master-${master.master_id}`,
      columns: {
        master: master.master_name,
        classesCount: master.classesCount,
      },
      rawData: master,
      expandNode: <ClassesComponent master={master} refetch={refetch} />,
    }
  }

  const calcMasterStudentCount = (classes: Classes[]) => {
    let count = 0
    classes.map((item) => {
      count += item.HomeroomStudents?.length
    })
    return count
  }

  useEffect(() => {
    if (!loading && data) {
      setTableData(
        data.getMastersBySchoolId.map((item: Master) => {
          return createData({
            master_id: item.master_id,
            master_name: item.master_name,
            classesCount: calcMasterStudentCount(item?.Classes || []),
            Classes: item?.Classes,
          })
        }),
      )
    }
  }, [data, loading])

  const [createNewMaster] = useMutation(CreateNewMasterGql)

  const createMasterSubmit = async (values: Master) => {
    await createNewMaster({
      variables: {
        createNewMasterInput: {
          school_year_id: values.school_year_id,
          master_name: values.master_name,
        },
      },
    })
    refetch()
    setIsCreateModal(false)
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
        <HomeRoomHeader
          title='Homerooms & Learning Logs'
          selectedYear={selectedYearId || 0}
          setSelectedYear={setSelectedYearId}
          schoolYearDropdownItems={schoolYearDropdownItems}
        />

        {/* search */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            mb: 4,
          }}
        >
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

        <Box>
          <MthTable items={tableData} loading={false} fields={fields} checkBoxColor='secondary' />
        </Box>

        <Box sx={{ mt: '100px' }}>
          <Button
            variant='contained'
            sx={{
              borderRadius: 2,
              fontSize: 12,
              background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
              width: 140,
              height: 48,
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': {
                background: MthColor.PRIMARY_MEDIUM_MOUSEOVER,
                color: 'white',
              },
            }}
            onClick={() => setIsCreateModal(true)}
          >
            <Subtitle sx={{ fontSize: '14px', fontWeight: '500' }}>+ Add Master</Subtitle>
            <Subtitle sx={{ display: 'none' }}>{selectedYear?.school_year_id}</Subtitle>
          </Button>
        </Box>
      </Card>
      {isCreateModal && (
        <CreateMasterModal
          selectedYear={selectedYearId || 0}
          schoolYearDropdownItems={schoolYearDropdownItems}
          handleClose={() => setIsCreateModal(false)}
          handleSubmit={createMasterSubmit}
        />
      )}
      {deleteConfirm && (
        <WarningModal
          title='Delete'
          subtitle='Are you sure you want to delete this Master Homeroom?'
          handleModem={() => setDeleteConfirm(false)}
          handleSubmit={() => submitDeleteMaster()}
          btntitle='Delete'
          canceltitle='Cancel'
        />
      )}
    </Box>
  )
}

export default LearningLogs
