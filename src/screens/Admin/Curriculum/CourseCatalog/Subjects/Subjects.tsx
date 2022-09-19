import React, { useEffect, useState } from 'react'
import { DeleteForeverOutlined } from '@mui/icons-material'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import CreateIcon from '@mui/icons-material/Create'
import DehazeIcon from '@mui/icons-material/Dehaze'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'
import { Box, Button, Card, IconButton, Tooltip } from '@mui/material'
import { SortableHandle } from 'react-sortable-hoc'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import Titles from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/Titles'
import { Subject } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/types'
import CourseCatalogHeader from '../Components/CourseCatalogHeader/CourseCatalogHeader'

const Subjects: React.FC = () => {
  // TODO Titles of the archived subject must be archived.
  const subjectsData: Subject[] = [
    {
      id: 1,
      name: 'Math',
      periods: 'Period 2 - Math, Period 4 - Elective, Period 6 - Core,  Period 7 - Optional Core',
      active: false,
      priority: 1,
      titles: [
        {
          name: 'Accounting',
          grades: '9-12',
          diplomaSeeking: false,
          customBuilt: true,
          thirdParty: true,
          splitEnrollment: true,
          semesterOnly: false,
          active: false,
        },
        {
          name: 'Algebra I',
          grades: '7-12',
          diplomaSeeking: false,
          customBuilt: true,
          thirdParty: true,
          splitEnrollment: false,
          semesterOnly: false,
          active: false,
        },
      ],
    },
    {
      id: 2,
      name: 'Language Arts',
      periods: 'Period 3 - Language Arts, Period 6 - Core, Period 6 - Semester Core, Period 7 - Optional Core',
      active: true,
      priority: 2,
    },
    {
      id: 3,
      name: 'Science',
      periods: 'Period 4 - Science, Period 4 - Elective, Period 6 - Core, Period 7 - Optional Core',
      active: true,
      priority: 3,
    },
    {
      id: 4,
      name: 'P.E. / Health',
      periods: 'Period 6 - Elective, Period 6 - Elective, Period 6 - Semester Elective, Period 7 - Optional Elective',
      active: true,
      priority: 4,
      titles: [
        {
          name: 'Fitness for Life',
          grades: '9-12',
          diplomaSeeking: false,
          customBuilt: true,
          thirdParty: true,
          splitEnrollment: true,
          semesterOnly: false,
          active: true,
        },
        {
          name: 'Health',
          grades: 'K-12',
          diplomaSeeking: false,
          customBuilt: true,
          thirdParty: true,
          splitEnrollment: true,
          semesterOnly: false,
          active: false,
        },
        {
          name: 'P.E. ',
          grades: 'K-12',
          diplomaSeeking: true,
          customBuilt: true,
          thirdParty: true,
          splitEnrollment: true,
          semesterOnly: true,
          active: true,
        },
      ],
    },
  ]

  const DragHandle = SortableHandle(() => (
    <Tooltip title='Move'>
      <IconButton className='actionButton' color='primary'>
        <DehazeIcon />
      </IconButton>
    </Tooltip>
  ))

  const [loading] = useState(false)
  const [selectedYear, setSelectedYear] = useState<number>(0)
  const [searchField, setSearchField] = useState<string>('')
  const [showArchived, setShowArchived] = useState<boolean>(false)
  const [subjects] = useState<Subject[]>(subjectsData)
  const [tableData, setTableData] = useState<MthTableRowItem<Subject>[]>([])

  const fields: MthTableField<Subject>[] = [
    {
      key: 'name',
      label: 'Subject',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'periods',
      label: 'Periods',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      tdClass: '',
      formatter: (item: MthTableRowItem<Subject>) => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'}>
            <Tooltip title={item.rawData.active ? 'Edit' : ''}>
              <IconButton color='primary' disabled={!item.rawData.active} className='actionButton'>
                <CreateIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={item.rawData.active ? 'Archive' : 'Unarchive'}>
              <IconButton className='actionButton' color='primary'>
                {item.rawData.active ? <SystemUpdateAltRoundedIcon /> : <CallMissedOutgoingIcon />}
              </IconButton>
            </Tooltip>
            {!item.rawData.active && (
              <Tooltip title='Delete'>
                <IconButton className='actionButton' color='primary'>
                  <DeleteForeverOutlined />
                </IconButton>
              </Tooltip>
            )}
            {item.rawData.active && <DragHandle />}
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

  const createData = (subject: Subject): MthTableRowItem<Subject> => {
    return {
      columns: {
        name: subject.name,
        periods: subject.periods,
      },
      selectable: subject.active,
      rawData: subject,
      expandNode: <Titles titles={subject.titles} />,
    }
  }

  useEffect(() => {
    if (subjects?.length) {
      setTableData(
        subjects
          .map((item) => {
            return { ...item, titles: item.titles?.filter((x) => showArchived || x.active) }
          })
          .map((item) => {
            return createData(item)
          }),
      )
    }
  }, [subjects, showArchived])

  return (
    <Box sx={{ p: 4, textAlign: 'left' }}>
      <Card sx={{ p: 4, borderRadius: '12px', boxShadow: '0px 0px 35px rgba(0, 0, 0, 0.05)' }}>
        <CourseCatalogHeader
          title='Subjects'
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          searchField={searchField}
          setSearchField={setSearchField}
          showArchived={showArchived}
          setShowArchived={setShowArchived}
        />

        <Box>
          <MthTable
            items={tableData}
            loading={loading}
            fields={fields}
            selectable={true}
            checkBoxColor={MthColor.MTHBLUE}
          />
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
          >
            <Subtitle sx={{ fontSize: '14px', fontWeight: '700' }}>+ Add Subject</Subtitle>
          </Button>
        </Box>
      </Card>
    </Box>
  )
}

export default Subjects
