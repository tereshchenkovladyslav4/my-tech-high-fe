import React, { useEffect, useState, useContext } from 'react'
import { useMutation, useQuery } from '@apollo/client'
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
  Modal,
} from '@mui/material'
import moment from 'moment'
import { Prompt, useHistory } from 'react-router-dom'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import PageHeader from '@mth/components/PageHeader'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { MthTitle } from '@mth/enums'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { mthButtonClasses } from '@mth/styles/button.style'
import { BUTTON_LINEAR_GRADIENT, HOMEROOM_LEARNING_LOGS } from '../../../../../utils/constants'
import {
  GetMastersByIDGql,
  getAssignmentsByMasterIdgql,
  updateMasterById,
  createOrUpdateInstruction,
  DeleteAssignmentGql,
} from '../../services'
import { Master } from '../types'
import { masterUseStyles } from './styles'
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
  const [isChange, setIsChange] = useState<boolean>(false)

  const [isSetInstructions, setIsSetInstructions] = useState<boolean>(false)
  const [instructions, setInstructions] = useState<string>('')

  const [deleteConfirmModal, setDeleteConfirmModal] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<number | null>()

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

      setInstructions(masterData.getMastersById.instructions)
    }
  }, [masterLoading, masterData])

  const handleDelete = (id: string) => {
    setDeleteConfirmModal(true)
    setDeleteId(parseInt(id))
  }

  const [deleteAssignment] = useMutation(DeleteAssignmentGql)
  const submitDelete = async () => {
    await deleteAssignment({
      variables: {
        assignmentId: deleteId,
      },
    })
    refetch()
    setDeleteConfirmModal(false)
  }

  const fields: MthTableField<Assignment>[] = [
    {
      key: 'due_date',
      label: 'Due Date',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'title',
      label: 'Title',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'reminder',
      label: 'Reminder',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'auto_grade',
      label: 'Auto-grade',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'teacher_deadline',
      label: 'Teacher Deadline',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      tdClass: '',
      formatter: (item) => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'} flexWrap={'wrap'}>
            <Tooltip title='Edit' placement='top'>
              <IconButton color='primary' className='actionButton'>
                <CreateIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete' placement='top'>
              <IconButton className='actionButton' color='primary' onClick={() => handleDelete(item.rawData.id)}>
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

  const {
    loading: assloading,
    data: assData,
    refetch,
  } = useQuery(getAssignmentsByMasterIdgql, {
    variables: {
      masterId: masterId,
      take: paginatinLimit,
      sort: null,
      skip: skip,
      search: localSearchField,
    },
    skip: masterId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!assloading && assData?.getAssignmentsByMasterId) {
      setTotalPage(assData?.getAssignmentsByMasterId.total)
      setTableData(
        assData?.getAssignmentsByMasterId.results.map((item: Assignment) => {
          return createData(item)
        }),
      )
    }
  }, [assData])

  const handleChangePageLimit = (num: number) => {
    setPaginatinLimit(num)
    handlePageChange(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSkip(() => {
      return paginatinLimit ? paginatinLimit * (page - 1) : 25
    })
  }
  const [updateMaster] = useMutation(updateMasterById)
  const handleSubmit = async () => {
    await updateMaster({
      variables: {
        updateMaster: {
          master_id: parseInt(masterInfo?.master_id),
          master_name: masterTitle,
          school_year_id: masterSchoolYearId,
        },
      },
    })
    setIsChange(false)
    history.push(HOMEROOM_LEARNING_LOGS)
  }

  const [sbumitInstruction] = useMutation(createOrUpdateInstruction)
  const handleInstructionSubmit = async () => {
    await sbumitInstruction({
      variables: {
        createOrUpdateInstructions: {
          instructions: instructions,
          master_id: parseInt(masterInfo?.master_id),
        },
      },
    })
    setIsSetInstructions(false)
  }

  return (
    <Box sx={{ p: 4, textAlign: 'left' }}>
      <Prompt
        when={isChange ? true : false}
        message={JSON.stringify({
          header: MthTitle.UNSAVED_TITLE,
          content: MthTitle.UNSAVED_DESCRIPTION,
        })}
      />
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
            <Button sx={mthButtonClasses.roundXsPrimary} type='button' onClick={handleSubmit}>
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
                setIsChange(e.target.value !== masterInfo?.master_name)
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
                setIsChange(val !== masterInfo?.school_year_id)
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
              <IconButton onClick={() => setIsSetInstructions(true)}>
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
      <Modal
        open={isSetInstructions}
        onClose={() => setIsSetInstructions(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={masterUseStyles.modalRoot}>
          <Box>
            <Subtitle size='medium' fontWeight='600' sx={{ marginBottom: '30px' }}>
              Instructions
            </Subtitle>
            <MthBulletEditor value={instructions} setValue={(value) => setInstructions(value)} />
          </Box>
          <Box sx={masterUseStyles.btnGroup}>
            <Button
              sx={{ ...mthButtonClasses.roundXsGray, padding: '20px 60px' }}
              type='button'
              onClick={() => setIsSetInstructions(false)}
            >
              Cancel
            </Button>
            <Button
              sx={{ ...mthButtonClasses.roundXsDark, padding: '20px 60px' }}
              type='button'
              onClick={handleInstructionSubmit}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
      {deleteConfirmModal && (
        <WarningModal
          title='Delete'
          subtitle='Are you sure you want to delete this Learning Log?'
          handleModem={() => setDeleteConfirmModal(false)}
          handleSubmit={() => submitDelete()}
          btntitle='Delete'
          canceltitle='Cancel'
        />
      )}
    </Box>
  )
}

export default MasterHoomroom
