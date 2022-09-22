import React, { FunctionComponent, useState } from 'react'
import { DeleteForeverOutlined } from '@mui/icons-material'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import CreateIcon from '@mui/icons-material/Create'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'
import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material'
import PageHeader from '@mth/components/PageHeader'
import CustomTable from '@mth/components/Table/CustomTable'
import { Field, ValueOf } from '@mth/components/Table/types'
import { TableItem } from '@mth/components/Table/types'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { SchoolYearDropDown } from '@mth/screens/Admin/SiteManagement/SchoolPartner/SchoolYearDropDown/SchoolYearDropDown'
import { useStyles } from '../../styles'
import { PeriodItem } from '../../types'
import Filter from './Filter'
const Periods: FunctionComponent = () => {
  const classes = useStyles
  const [selectedYearId, setSelectedYearId] = useState<number>()
  // Modal for Archive, Unarchive, Delete
  const [modalWarning, setModalWarning] = useState<'delete' | 'unarchive' | 'archive' | ''>('')
  const [temp, setTemp] = useState<PeriodItem>()
  const [loading] = useState(false)
  const [items, setItems] = useState<Array<PeriodItem>>([
    {
      id: 1,
      grade: 'K-12',
      category: 'Homeroom',
      secondSemester: 'None',
      archived: true,
    },
    {
      id: 2,
      grade: 'K',
      category: 'Math',
      secondSemester: 'None',
      archived: true,
    },
    {
      id: 3,
      grade: 'K-12',
      category: 'Language Arts',
      secondSemester: 'None',
      archived: false,
    },
  ])

  const [query, setQuery] = useState({
    keyword: '',
    hideArchived: true,
  })

  const handleCreateOrEditModal = () => {}

  const handleArchiveModal = (item: PeriodItem) => {
    setTemp(item)
    setModalWarning(item.archived ? 'unarchive' : 'archive')
  }
  const handleArchiveOrDelete = () => {
    if (!temp) return
    else {
      if (modalWarning === 'delete') {
        // TODO: Mutation Delete
        // MOCK
        setItems(items.filter((el) => el.id !== temp.id))
        // MOCK end
      } else {
        // TODO: Mutation Toggle
        // MOCK
        const updatedItems = items.map((el) => {
          if (el.id === temp.id) {
            return {
              ...el,
              archived: !el.archived,
            }
          } else return el
        })
        setItems(updatedItems)
        // MOCK end
      }
    }
    setModalWarning('')
  }

  const handleAdd = () => {
    // setArchiveModal(true)
  }

  const handleDelete = (item: PeriodItem) => {
    // Remove this localStorage line after the delete functionality is implemented
    // I added this code to fix a lint issue
    setTemp(item)
    setModalWarning('delete')
  }

  const setFilter = (field: string, value: string | boolean) => {
    setQuery({
      ...query,
      [field]: value,
    })
  }

  const fields: Field<PeriodItem>[] = [
    {
      key: 'id',
      label: 'Period',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'grade',
      label: 'Grades',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'category',
      label: 'Category',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'secondSemester',
      label: '2nd Semester',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      tdClass: '',
      formatter: (_: ValueOf<PeriodItem>, item: TableItem<PeriodItem>) => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'}>
            <Tooltip title='Edit' color='primary'>
              <span>
                <IconButton onClick={() => handleCreateOrEditModal()} disabled={item.archived}>
                  <CreateIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={item.archived ? 'Unarchive' : 'Archive'}>
              <IconButton onClick={() => handleArchiveModal(item)} color='primary' sx={{ mr: item.archived ? 0 : 5 }}>
                {item.archived ? <CallMissedOutgoingIcon sx={{ color: '#A3A3A4' }} /> : <SystemUpdateAltRoundedIcon />}
              </IconButton>
            </Tooltip>

            {item.archived && (
              <Tooltip title='Delete' color='primary'>
                <IconButton onClick={() => handleDelete(item)}>
                  <DeleteForeverOutlined />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )
      },
    },
  ]

  return (
    <Box sx={classes.base}>
      <PageHeader title='Periods'>
        <SchoolYearDropDown setSelectedYearId={setSelectedYearId} selectedYearId={selectedYearId} />
      </PageHeader>

      <Box sx={{ my: 2 }}>
        <Filter query={query} setValue={setFilter} />
      </Box>

      <Box>
        <CustomTable items={items} loading={loading} fields={fields} striped size='lg' borderedLeft />
      </Box>

      <Box sx={{ mt: 4, textAlign: 'left' }}>
        <Button variant='contained' onClick={handleAdd} disableElevation sx={classes.addButton} size='large'>
          + Add Period
        </Button>
      </Box>

      {!!modalWarning && (
        <WarningModal
          handleModem={() => setModalWarning('')}
          title={modalWarning}
          btntitle={<span style={{ textTransform: 'capitalize' }}>{modalWarning}</span>}
          subtitle={`Are you sure want to ${modalWarning} this Period?`}
          handleSubmit={handleArchiveOrDelete}
          canceltitle='Cancel'
        >
          {modalWarning === 'delete' && (
            <Typography fontWeight='600' fontSize={14} align='center'>
              Doing so will remove it from any student&lsquo;s schedule for this year.
            </Typography>
          )}
        </WarningModal>
      )}
    </Box>
  )
}

export default Periods
