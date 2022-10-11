import React, { useEffect, useState } from 'react'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import { IconButton, Typography, Grid } from '@mui/material'
import { Box } from '@mui/system'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { ScheduleBuilderProps } from '../types'
import { scheduleBuilderClassess } from './styles'
import { ScheduleType } from './types'
const ScheduleBuilder: React.FC<ScheduleBuilderProps> = () => {
  const [tableData, setTableData] = useState<MthTableRowItem<ScheduleType>[]>([])
  const dropdownOptions: DropDownItem[] = [
    {
      label: 'Select',
      value: -1,
    },
    {
      label: '50',
      value: 50,
    },
    {
      label: '100',
      value: 100,
    },
    {
      label: 'All',
      value: 1000,
    },
  ]

  const fields: MthTableField<ScheduleType>[] = [
    {
      key: 'Period',
      label: 'Period',
      sortable: false,
      tdClass: '',
      width: '25%',
      formatter: (item: MthTableRowItem<ScheduleType>) => {
        return (
          <Box>
            {!item.rawData.Text && (
              <Grid container alignItems='center'>
                <Typography sx={scheduleBuilderClassess.tableContent} component={'span'}>
                  {item.rawData.Period}
                </Typography>
                <Box sx={{ marginLeft: 6.9 }}>
                  <DropDown
                    dropDownItems={dropdownOptions}
                    setParentValue={() => {}}
                    size='small'
                    defaultValue={dropdownOptions[0].value}
                    borderNone
                  />
                </Box>
              </Grid>
            )}
            {item.rawData.Text && (
              <>
                <Typography sx={scheduleBuilderClassess.tableContent} component={'span'}>
                  {item.rawData.Period}
                </Typography>

                <Typography sx={{ m: 1, fontSize: '14px', marginTop: -1, marginLeft: 9.5 }} component={'span'}>
                  {item.rawData.Text}
                </Typography>
              </>
            )}
          </Box>
        )
      },
    },
    {
      key: 'Subject',
      label: 'Subject',
      sortable: false,
      tdClass: '',
      width: '25%',
      formatter: (item: MthTableRowItem<ScheduleType>) => {
        return (
          <Box>
            {!item.rawData.Text && <></>}
            {item.rawData.Text && (
              <>
                <Typography sx={scheduleBuilderClassess.tableContent} component={'span'}>
                  {item.rawData.Subject}
                </Typography>
              </>
            )}
          </Box>
        )
      },
    },
    {
      key: 'Type',
      label: 'Course Type',
      sortable: false,
      tdClass: '',
      width: '25%',
      formatter: (item: MthTableRowItem<ScheduleType>) => {
        return (
          <Box>
            {!item.rawData.Text && <></>}
            {item.rawData.Text && (
              <>
                <Typography sx={scheduleBuilderClassess.tableContent} component={'span'}>
                  {item.rawData.Type}
                </Typography>
              </>
            )}
          </Box>
        )
      },
    },
    {
      key: 'Description',
      label: 'Description',
      sortable: false,
      tdClass: '',
      width: '25%',
      formatter: (item: MthTableRowItem<ScheduleType>) => {
        return (
          <Box>
            {!item.rawData.Text && <></>}
            {item.rawData.Text && (
              <>
                <Typography sx={scheduleBuilderClassess.tableContent} component={'span'}>
                  {item.rawData.Description}
                </Typography>
              </>
            )}
          </Box>
        )
      },
    },
  ]

  const schedules: ScheduleType[] = [
    {
      Period: '01',
      Subject: 'Homeroom',
      Type: 'My Tech High Direct',
      Description: 'Weekly Learning Logs and Homeroom Resources',
      Text: 'Homeroom',
    },
    {
      Period: '02',
      Subject: 'Homeroom',
      Type: 'My Tech High Direct',
      Description: 'Weekly Learning Logs and Homeroom Resources',
      Text: null,
    },
  ]

  const createData = (schedule: ScheduleType): MthTableRowItem<ScheduleType> => {
    return {
      columns: {
        Period: schedule.Period,
        Subject: schedule.Subject,
        Type: schedule.Type,
        Description: schedule.Description,
      },
      rawData: schedule,
    }
  }

  useEffect(() => {
    if (schedules?.length) {
      setTableData(
        schedules.map((item: ScheduleType) => {
          return createData(item)
        }),
      )
    }
  }, [])

  const questionClick = () => {}

  const handleArrange = async (arrangedItems: MthTableRowItem<ScheduleType>[]) => {
    setTableData(arrangedItems)
  }

  return (
    <Box sx={scheduleBuilderClassess.main}>
      <MthTable
        items={tableData}
        fields={fields}
        isDraggable={true}
        checkBoxColor='secondary'
        onArrange={handleArrange}
        sx={scheduleBuilderClassess.customTable}
      />
      <IconButton
        size='large'
        edge='start'
        aria-label='open drawer'
        onClick={questionClick}
        sx={[{ mr: 2 }, scheduleBuilderClassess.questionButton]}
      >
        <QuestionMarkIcon />
      </IconButton>
    </Box>
  )
}

export default ScheduleBuilder
