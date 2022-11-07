import React from 'react'
import { Box } from '@mui/system'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { UpdateRequiredPeriodsProps } from './types'

const UpdateRequiredPeriods: React.FC<UpdateRequiredPeriodsProps> = ({
  scheduleData,
  requireUpdatePeriods,
  setRequiredUpdatePeriods,
}) => {
  const handleChangeValue = (periodId: string) => {
    setRequiredUpdatePeriods(requireUpdatePeriods?.filter((item) => item != periodId))
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
                <DropDown
                  dropDownItems={[]}
                  placeholder='Select Response'
                  sx={{ maxWidth: '200px' }}
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  setParentValue={(__value) => {}}
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  sx={{ maxWidth: '200px', marginLeft: '25px' }}
                />
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

export default UpdateRequiredPeriods
