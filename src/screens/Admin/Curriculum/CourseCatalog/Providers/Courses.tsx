import React, { useEffect, useState } from 'react'
import { DeleteForeverOutlined } from '@mui/icons-material'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import CreateIcon from '@mui/icons-material/Create'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { Course, CoursesProps } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/types'

const Courses: React.FC<CoursesProps> = ({ courses }) => {
  const [loading] = useState(false)

  const fields: MthTableField<Course>[] = [
    {
      key: 'name',
      label: 'Course',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'grades',
      label: 'Grades',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'diplomaSeeking',
      label: 'Diploma-seeking',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'reducesFunds',
      label: 'Reduces Funds',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'semesterOnly',
      label: 'Semester Only',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'limit',
      label: 'Limits',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'subjects',
      label: 'Subjects',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      tdClass: '',
      formatter: (item: MthTableRowItem<Course>) => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'}>
            <Tooltip title={item.rawData.active ? 'Edit' : ''} placement='top'>
              <IconButton className='actionButton' color='primary' disabled={!item.rawData.active}>
                <CreateIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={item.rawData.active ? 'Archive' : 'Unarchive'} placement='top'>
              <IconButton className='actionButton' color='primary'>
                {item.rawData.active ? <SystemUpdateAltRoundedIcon /> : <CallMissedOutgoingIcon />}
              </IconButton>
            </Tooltip>
            {!item.rawData.active && (
              <Tooltip title='Delete' placement='top'>
                <IconButton className='actionButton' color='primary'>
                  <DeleteForeverOutlined />
                </IconButton>
              </Tooltip>
            )}
            {item.rawData.active && (
              <Tooltip title='Clone' placement='top'>
                <IconButton className='actionButton expandButton' color='primary'>
                  <ContentCopyOutlinedIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )
      },
    },
  ]

  const [tableData, setTableData] = useState<MthTableRowItem<Course>[]>([])

  const createData = (course: Course): MthTableRowItem<Course> => {
    return {
      columns: {
        name: course.name,
        grades: course.grades,
        diplomaSeeking: course.diplomaSeeking === undefined ? 'N/A' : course.diplomaSeeking ? 'Yes' : 'No',
        reducesFunds: course.reducesFunds === undefined ? 'N/A' : course.reducesFunds ? 'Yes' : 'No',
        semesterOnly: course.semesterOnly === undefined ? 'N/A' : course.semesterOnly ? 'Yes' : 'No',
        limit: course.limit || 0,
        subjects: course.subjects,
      },
      rawData: course,
    }
  }

  useEffect(() => {
    if (courses?.length) {
      setTableData(
        courses.map((item) => {
          return createData(item)
        }),
      )
    }
  }, [courses])

  return (
    <Box sx={{ pb: 3, textAlign: 'left', borderTop: `solid 1px ${MthColor.SYSTEM_09}` }}>
      {!!courses?.length && (
        <Box sx={{ borderTop: `solid 1px ${MthColor.SYSTEM_09}` }}>
          <MthTable items={tableData} loading={loading} fields={fields} selectable={true} size='small' oddBg={false} />
        </Box>
      )}

      <Box sx={{ mt: '56px' }}>
        <Button
          variant='contained'
          sx={{
            borderRadius: 2,
            fontSize: 12,
            background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
            width: 160,
            height: 37,
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': {
              background: MthColor.PRIMARY_MEDIUM_MOUSEOVER,
              color: 'white',
            },
          }}
        >
          <Subtitle sx={{ fontSize: '14px', fontWeight: '700' }}>+ Add Course</Subtitle>
        </Button>
      </Box>
    </Box>
  )
}

export default Courses
