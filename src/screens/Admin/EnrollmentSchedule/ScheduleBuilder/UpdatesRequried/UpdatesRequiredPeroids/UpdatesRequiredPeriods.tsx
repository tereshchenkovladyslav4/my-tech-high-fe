import React from 'react'
import { Box } from '@mui/system'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { MultiSelect } from '@mth/components/MultiSelect/MultiSelect'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { ScheduleData } from '@mth/screens/Homeroom/Schedule/types'
import { UpdatesRequiredPeriodsProps } from './types'

const UpdatesRequiredPeriods: React.FC<UpdatesRequiredPeriodsProps> = ({
  scheduleData,
  requireUpdatePeriods,
  standardResponseOptions,
  setScheduleData,
  setRequiredUpdatePeriods,
}) => {
  const handleChangeValue = (periodId: string) => {
    setRequiredUpdatePeriods(requireUpdatePeriods?.filter((item) => item != periodId))
  }

  const handleResponseChangeValue = (schedule: ScheduleData, value: (string | number)[]) => {
    const scheduleIdx = scheduleData?.findIndex((item) => item.period === schedule.period)
    if (scheduleIdx > -1) {
      schedule.standardResponseOptions = value.join(',')
      scheduleData[scheduleIdx] = schedule
      setScheduleData(JSON.parse(JSON.stringify(scheduleData)))
    }
  }

  return (
    <Box sx={{ marginTop: 3, paddingX: 3 }}>
      <Subtitle size='medium' textAlign='left' fontWeight='700'>
        The following Periods require updates:
      </Subtitle>
      <Box sx={{ paddingY: 3 }}>
        {scheduleData?.map((item, index) => {
          if (requireUpdatePeriods?.includes(`${item?.Period?.id}`)) {
            return (
              <Box key={`index_${item?.Period?.id}_${index}`} sx={{ textAlign: 'left' }}>
                <MthCheckbox
                  label={`Period ${item?.period} - ${item?.Title?.name}`}
                  checked={item?.Period?.id ? true : false}
                  onChange={() => {
                    handleChangeValue(`${item?.Period?.id}`)
                  }}
                />
                <Box sx={{ maxWidth: '200px', marginLeft: '50px' }}>
                  <MultiSelect
                    options={standardResponseOptions}
                    label='Select Response'
                    onChange={(value) => {
                      const filteredResponse = value.filter(
                        (item1) => standardResponseOptions.findIndex((option) => option.value === item1) > -1,
                      )
                      handleResponseChangeValue(item, filteredResponse)
                    }}
                    renderValue={item.standardResponseOptions}
                    defaultValue={item.standardResponseOptions?.length ? item.standardResponseOptions.split(',') : []}
                  />
                </Box>
              </Box>
            )
          } else {
            return <Box key={`index_${item?.Period?.id}_${index}`}></Box>
          }
        })}
      </Box>
    </Box>
  )
}

export default UpdatesRequiredPeriods
