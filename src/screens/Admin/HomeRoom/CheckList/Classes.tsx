import React, { useEffect, useState } from 'react'
import { DeleteForeverOutlined } from '@mui/icons-material'
import CreateIcon from '@mui/icons-material/Create'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { Classes, ClassessProps } from './types'

const Classes: React.FC<ClassessProps> = ({ classes }) => {
  const fields: MthTableField<Classes>[] = [
    {
      key: 'name',
      label: 'Class Name',
      sortable: true,
      tdClass: '',
      width: '10%',
    },
    {
      key: 'teacher',
      label: 'Primary Teacher',
      sortable: true,
      tdClass: '',
      width: '15%',
    },
    {
      key: 'students',
      label: 'Students',
      sortable: true,
      tdClass: '',
      width: '10%',
    },
    {
      key: 'ungraded',
      label: 'Ungraded',
      sortable: true,
      tdClass: '',
      width: '10%',
    },
    {
      key: 'additionalTeachers',
      label: 'Additional Teachers',
      sortable: false,
      tdClass: '',
      width: '15%',
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      tdClass: '',
      // 48px is for checkbox
      width: 'calc(19% - 48px)',
      formatter: (item: MthTableRowItem<Classes>) => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'} flexWrap={'wrap'}>
            <Tooltip title='Edit' placement='top'>
              <IconButton className='actionButton' color='primary'>
                <CreateIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete' placement='top'>
              <IconButton className={'actionButton ' + item.key} color='primary'>
                <DeleteForeverOutlined />
              </IconButton>
            </Tooltip>
          </Box>
        )
      },
    },
  ]

  const [tableData, setTableData] = useState<MthTableRowItem<Classes>[]>([])
  const createData = (classesItem: Classes): MthTableRowItem<Classes> => {
    return {
      key: 'classes ' + classesItem.class_id,
      columns: {
        name: classesItem.className,
        teacher: classesItem.teacher,
        students: classesItem.students,
        ungraded: classesItem.ungraded,
        additionalTeachers: classesItem.additionalTeacher,
      },
      rawData: classesItem,
    }
  }

  useEffect(() => {
    if (classes?.length) {
      setTableData(
        classes?.map((item: Classes) => {
          return createData(item)
        }),
      )
    }
  }, [])

  return (
    <Box sx={{ pb: 3, textAlign: 'left' }}>
      <Box sx={{ borderTop: `solid 1px ${MthColor.SYSTEM_09}` }}>
        <MthTable items={tableData} fields={fields} showSelectAll={false} size='small' oddBg={false} />
      </Box>

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
          <Subtitle sx={{ fontSize: '12px', fontWeight: '500' }}>+ Add Teacher</Subtitle>
        </Button>
      </Box>
    </Box>
  )
}

export default Classes
