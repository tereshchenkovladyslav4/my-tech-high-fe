import React, { FunctionComponent, useState } from 'react'
import CreateIcon from '@mui/icons-material/Create'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import DownloadFileIcon from '@mth/assets/icons/file-download.svg'
import PageHeader from '@mth/components/PageHeader'
import CustomTable from '@mth/components/Table/CustomTable'
import { Field } from '@mth/components/Table/types'
import { SchoolYearDropDown } from '@mth/screens/Admin/SiteManagement/SchoolPartner/SchoolYearDropDown/SchoolYearDropDown'
import { useStyles } from '../../styles'
import { StateCodeType } from '../../types'
import Filter from './Filter'

const StateCodes: FunctionComponent = () => {
  const classes = useStyles
  const [selectedYearId, setSelectedYearId] = useState<number>()
  const [loading] = useState(false)
  const [query, setQuery] = useState({
    keyword: '',
    page: 1,
    limit: 25,
  })
  const [total] = useState<number>(27)
  const [items] = useState<StateCodeType[]>([
    {
      id: 1,
      title_id: '2020_1',
      grade: 'K',
      state_code: '25020000010',
      teacher_name: 'Andrea Fife',
      title: 'Homeroom',
      subject: 'Homeroom',
    },
    {
      id: 2,
      title_id: '2020_1',
      grade: '1',
      state_code: '25020000010',
      teacher_name: 'Andrea Fife',
      title: 'Homeroom',
      subject: 'Homeroom',
    },
    {
      id: 3,
      title_id: '2020_1',
      grade: '2',
      state_code: '25020000010',
      teacher_name: 'Andrea Fife',
      title: 'Homeroom',
      subject: 'Elementary Math',
    },
    {
      id: 4,
      title_id: '2020_1',
      grade: '3',
      state_code: '25020000010',
      teacher_name: 'Erin Sublette',
      title: 'Homeroom',
      subject: 'Elementary Math',
    },
  ])

  const handleCreateOrEditModal = () => {}

  const setFilter = (field: string, value: string | boolean | number) => {
    setQuery({
      ...query,
      [field]: value,
    })
  }

  const fields: Array<Field> = [
    {
      key: 'title_id',
      label: 'Title ID',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'grade',
      label: 'Grade',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'state_code',
      label: 'State Code',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'teacher_name',
      label: 'Teacher',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'subject',
      label: 'Subject',
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
      key: 'action',
      label: '',
      sortable: false,
      tdClass: '',
      formatter: () => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'}>
            <Tooltip title='Edit' color='primary'>
              <IconButton onClick={() => handleCreateOrEditModal()}>
                <CreateIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )
      },
    },
  ]

  const handleImportModal = () => {}
  const handleDownloadModal = () => {}
  return (
    <Box sx={classes.base}>
      <PageHeader title='State Codes'>
        <SchoolYearDropDown setSelectedYearId={setSelectedYearId} selectedYearId={selectedYearId} />
      </PageHeader>

      <Box sx={{ mt: 3, mb: 2 }} display='flex' justifyContent='flex-end' gap={3} alignItems='center'>
        <Tooltip title='Import' placement='top'>
          <Button
            variant='contained'
            onClick={handleImportModal}
            disableElevation
            sx={{ ...classes.addButton, px: 6 }}
            size='large'
          >
            Import
          </Button>
        </Tooltip>
        <Tooltip title='Download' placement='top'>
          <IconButton onClick={handleDownloadModal} size='large'>
            <img src={DownloadFileIcon} alt='Download Icon' width={27} />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ my: 2 }}>
        <Filter query={query} setValue={setFilter} total={total} />
      </Box>

      <Box>
        <CustomTable items={items} loading={loading} fields={fields} />
      </Box>
    </Box>
  )
}

export default StateCodes
