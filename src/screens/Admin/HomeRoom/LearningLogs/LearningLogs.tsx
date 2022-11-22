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
import { MthColor } from '@mth/enums'
import { SchoolYearResponseType, useSchoolYearsByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { commonClasses } from '@mth/styles/common.style'
import { HOMEROOM_LEARNING_LOGS } from '../../../../utils/constants'
import { HomeRoomHeader } from '../Components/HomeRoomHeader'
import { CreateNewMasterGql, GetMastersBySchoolYearIDGql } from '../services'
import Classes from './Classes'
import { CreateMasterModal } from './CreateMasterModal'
import { Master } from './types'

const LearningLogs: React.FC = () => {
  const history = useHistory()

  const [selectedYear, setSelectedYear] = useState<number>(0)
  const [selectedYearData, setSelectedYearData] = useState<SchoolYearResponseType | undefined>()
  // const [searchField, setSearchField] = useState<string>('')
  const [tableData, setTableData] = useState<MthTableRowItem<Master>[]>([])
  const [localSearchField, setLocalSearchField] = useState<string>('')

  const [isCreateModal, setIsCreateModal] = useState<boolean>(false)

  const { me } = useContext(UserContext)
  const { dropdownItems: schoolYearDropdownItems, schoolYears: schoolYears } = useSchoolYearsByRegionId(
    me?.selectedRegionId,
  )

  useEffect(() => {
    if (selectedYear && schoolYears) {
      const schoolYearData = schoolYears.find((item) => item.school_year_id == selectedYear)
      if (schoolYearData) setSelectedYearData(schoolYearData)
    }
  }, [selectedYear])

  useEffect(() => {
    if (schoolYears?.length) setSelectedYear(schoolYears[0].school_year_id)
  }, [schoolYears])

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
      // 48px is for checkbox
      width: 'calc(25% - 48px)',
      formatter: (item: MthTableRowItem<Master>) => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'} flexWrap={'wrap'}>
            <Tooltip
              title='Edit'
              placement='top'
              onClick={() => history.push(`${HOMEROOM_LEARNING_LOGS}/edit/${item.rawData.master_id}`)}
            >
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

  const createData = (master: Master): MthTableRowItem<Master> => {
    return {
      key: `master-${master.master_id}`,
      columns: {
        master: master.master_name,
        classesCount: master.classesCount,
      },
      rawData: master,
      expandNode: <Classes classes={master.classes} />,
    }
  }

  // const exampleData = [
  //   {
  //     id: 1,
  //     master: '2020-21 Master',
  //     classesCount: 2,
  //     classes: [
  //       {
  //         class_id: 1,
  //         className: 'Arcadia',
  //         teacher: 'Erin Sublette',
  //         students: 245,
  //         ungraded: '20',
  //         additionalTeacher: 'Andrea Fife, Bree Clukey',
  //       },
  //       {
  //         class_id: 2,
  //         className: 'Arches',
  //         teacher: 'Andrea Fife',
  //         students: 300,
  //         ungraded: 'Yes',
  //         additionalTeacher: 'Erin Sublette, Bree Clukey',
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     master: '2020-21 Mid-year Master',
  //     classesCount: 2,
  //     classes: [
  //       {
  //         class_id: 3,
  //         className: 'Arcadia',
  //         teacher: 'Erin Sublette',
  //         students: 100,
  //         ungraded: '5',
  //         additionalTeacher: 'Andrea Fife, Bree Clukey',
  //       },
  //       {
  //         class_id: 4,
  //         className: 'Arches',
  //         teacher: 'Andrea Fife',
  //         students: 15,
  //         ungraded: '0',
  //         additionalTeacher: 'Erin Sublette, Bree Clukey',
  //       },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     master: '2020-21 Second Homeroom',
  //     classesCount: 18,
  //     classes: [],
  //   },
  // ]

  const { loading, data, refetch } = useQuery(GetMastersBySchoolYearIDGql, {
    variables: {
      schoolYearId: selectedYear,
    },
    skip: selectedYear ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && data) {
      setTableData(
        data.getMastersBySchoolId.map((item: Master) => {
          return createData({
            master_id: item.master_id,
            master_name: item.master_name,
            classesCount: 0,
            classes: [],
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
          school_year_id: values.schoolYear,
          master_name: values.master_name,
        },
      },
    })
    refetch()
    setIsCreateModal(false)
  }

  return (
    <Box sx={commonClasses.mainLayout}>
      <Card sx={{ ...commonClasses.mainBlock, ...commonClasses.fitScreen }}>
        <HomeRoomHeader
          title='Homerooms & Learning Logs'
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
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
            <Subtitle sx={{ display: 'none' }}>{selectedYearData?.school_year_id}</Subtitle>
          </Button>
        </Box>
      </Card>
      {isCreateModal && (
        <CreateMasterModal
          selectedYear={selectedYear}
          schoolYearDropdownItems={schoolYearDropdownItems}
          handleClose={() => setIsCreateModal(false)}
          handleSubmit={createMasterSubmit}
        />
      )}
    </Box>
  )
}

export default LearningLogs
