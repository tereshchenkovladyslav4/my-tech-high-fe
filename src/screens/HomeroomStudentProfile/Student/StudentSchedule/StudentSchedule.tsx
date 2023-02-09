import React, { useEffect, useState } from 'react'
import { Box, Card, Tooltip, Typography } from '@mui/material'
import { useHistory } from 'react-router-dom'
import DownloadFileIcon from '@mth/assets/icons/file-download.svg'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, MthRoute, MthTitle } from '@mth/enums'
import { useActiveScheduleSchoolYears, useStudentSchedulePeriods } from '@mth/hooks'
import { ScheduleData } from '@mth/screens/Homeroom/Schedule/types'
import { studentScheduleClasses } from '@mth/screens/HomeroomStudentProfile/Student/StudentSchedule/styles'

export const StudentSchedule: React.FC = () => {
  const currentStudentId = Number(location.pathname.split('/').at(-1))
  const history = useHistory()

  const fields: MthTableField<ScheduleData>[] = [
    {
      key: 'Period',
      label: 'Period',
      width: '30%',
      formatter: (item: MthTableRowItem<ScheduleData>) => {
        return (
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ py: '4px', fontSize: '13px', fontWeight: '700', color: MthColor.SYSTEM_06 }}>
              {('0' + item.rawData.period).slice(-2)}
            </Typography>
            <Typography sx={{ py: '4px', paddingX: 2, fontSize: '13px', fontWeight: '700', color: MthColor.SYSTEM_06 }}>
              {item.rawData.Period?.category}
            </Typography>
          </Box>
        )
      },
    },
    {
      key: 'Subject',
      label: 'Subject',
      width: '70%',
      formatter: (item: MthTableRowItem<ScheduleData>) => {
        return (
          <Box>
            <Typography sx={{ fontSize: '13px', fontWeight: '500', color: MthColor.SYSTEM_06 }}>
              {item.rawData.Subject?.name || item.rawData.Title?.name}
            </Typography>
          </Box>
        )
      },
    },
  ]

  const [tableData, setTableData] = useState<MthTableRowItem<ScheduleData>[]>([])
  const [secondSemesterTableData, setSecondSemesterTableData] = useState<MthTableRowItem<ScheduleData>[]>([])

  const { activeScheduleYearId } = useActiveScheduleSchoolYears(currentStudentId)
  const { scheduleData, secondScheduleData, hasSecondSemester } = useStudentSchedulePeriods(
    currentStudentId,
    activeScheduleYearId,
  )

  const createData = (schedule: ScheduleData): MthTableRowItem<ScheduleData> => {
    return {
      key: `schedule-${schedule.period}`,
      columns: {},
      rawData: schedule,
    }
  }

  useEffect(() => {
    if (scheduleData?.length) {
      setTableData(
        scheduleData.map((item) => {
          return createData(item)
        }),
      )
    }
    if (secondScheduleData?.length) {
      setSecondSemesterTableData(
        secondScheduleData.map((item) => {
          return createData(item)
        }),
      )
    }
  }, [scheduleData, secondScheduleData])

  return (
    <>
      {!!activeScheduleYearId && !!scheduleData?.length && (
        <Card
          sx={{
            borderRadius: 4,
            alignSelf: 'center',
            width: '100%',
            paddingY: 2,
            paddingX: 4,
            boxShadow: '0px 0px 28.951px rgba(0, 0, 0, 0.04)',
          }}
        >
          <Box
            display='flex'
            flexDirection='row'
            alignItems='center'
            justifyContent='space-between'
            marginTop={2}
            marginBottom={1}
          >
            <Box sx={{ display: 'flex' }}>
              <Subtitle sx={{ fontSize: '16px', fontWeight: 700 }}>Schedule</Subtitle>
              <Box sx={{ paddingX: 3, marginY: 'auto', cursor: 'pointer' }}>
                <Tooltip title='Download' placement='top'>
                  <img src={DownloadFileIcon} alt='Download Icon' />
                </Tooltip>
              </Box>
            </Box>
            <Paragraph
              sx={{ textDecoration: 'underline', cursor: 'pointer' }}
              color={MthColor.MTHBLUE}
              onClick={() =>
                history.push(
                  `${MthRoute.HOMEROOM}${MthRoute.SUBMIT_SCHEDULE}/${currentStudentId}?backTo=${MthRoute.HOMEROOM}/${currentStudentId}`,
                )
              }
            >
              Update/View All
            </Paragraph>
          </Box>
          {hasSecondSemester && (
            <Typography sx={studentScheduleClasses.semesterTitle}>{MthTitle.FIRST_SEMESTER}</Typography>
          )}
          <MthTable items={tableData} fields={fields} oddBg={false} sx={studentScheduleClasses.customTable} />
          {hasSecondSemester && (
            <Typography sx={studentScheduleClasses.semesterTitle}>{MthTitle.SECOND_SEMESTER}</Typography>
          )}
          {hasSecondSemester && (
            <MthTable
              items={secondSemesterTableData}
              fields={fields}
              oddBg={false}
              sx={studentScheduleClasses.customTable}
              labelSize={13}
            />
          )}
        </Card>
      )}
    </>
  )
}
