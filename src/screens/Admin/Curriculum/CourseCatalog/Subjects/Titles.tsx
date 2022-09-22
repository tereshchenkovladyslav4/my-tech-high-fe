import React, { useEffect, useState } from 'react'
import { DeleteForeverOutlined } from '@mui/icons-material'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import CreateIcon from '@mui/icons-material/Create'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { Title, TitlesProps } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/types'

const Titles: React.FC<TitlesProps> = ({ titles }) => {
  const [loading] = useState(false)

  const fields: MthTableField<Title>[] = [
    {
      key: 'name',
      label: 'Title',
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
      key: 'customBuilt',
      label: 'Custom-built',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'thirdParty',
      label: '3rd Party',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'splitEnrollment',
      label: 'Split Enrollment',
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
      key: 'action',
      label: '',
      sortable: false,
      tdClass: '',
      formatter: (item: MthTableRowItem<Title>) => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'}>
            <Tooltip title={item.rawData.active ? 'Edit' : ''}>
              <IconButton className='actionButton' color='primary' disabled={!item.rawData.active}>
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
            {item.rawData.active && (
              <Tooltip title='Clone'>
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

  const [tableData, setTableData] = useState<MthTableRowItem<Title>[]>([])

  const createData = (title: Title): MthTableRowItem<Title> => {
    return {
      columns: {
        name: <Typography sx={{ color: MthColor.MTHBLUE, fontSize: 'inherit' }}>{title.name}</Typography>,
        grades: title.grades,
        diplomaSeeking: title.diplomaSeeking === undefined ? 'N/A' : title.diplomaSeeking ? 'Yes' : 'No',
        customBuilt: title.customBuilt === undefined ? 'N/A' : title.customBuilt ? 'Yes' : 'No',
        thirdParty: title.thirdParty === undefined ? 'N/A' : title.thirdParty ? 'Yes' : 'No',
        splitEnrollment: title.splitEnrollment === undefined ? 'N/A' : title.splitEnrollment ? 'Yes' : 'No',
        semesterOnly: title.semesterOnly === undefined ? 'N/A' : title.semesterOnly ? 'Yes' : 'No',
      },
      selectable: title.active,
      rawData: title,
    }
  }

  useEffect(() => {
    if (titles?.length) {
      setTableData(
        titles.map((item) => {
          return createData(item)
        }),
      )
    }
  }, [titles])

  return (
    <Box sx={{ pb: 3, textAlign: 'left' }}>
      {!!titles?.length && (
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
          <Subtitle sx={{ fontSize: '14px', fontWeight: '700' }}>+ Add Title</Subtitle>
        </Button>
      </Box>
    </Box>
  )
}

export default Titles
