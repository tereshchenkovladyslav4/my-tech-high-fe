import React from 'react'
import { Box } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { ADMIN_REDUCE_FUNDS_ITEMS } from '@mth/constants'
import { ReduceFunds } from '@mth/enums'
import { ProgramSettingChanged } from '../types'

type ReimbursementsSelectProps = {
  reimbursements: ReduceFunds | undefined
  requireSoftware: boolean | undefined
  setReimbursements: (value: ReduceFunds) => void
  setRequireSoftware: (value: boolean) => void
  setIsChanged: (value: ProgramSettingChanged) => void
  isChanged: ProgramSettingChanged
}

export const ReimbursementsSelect: React.FC<ReimbursementsSelectProps> = ({
  reimbursements,
  requireSoftware,
  setReimbursements,
  setRequireSoftware,
  setIsChanged,
  isChanged,
}) => {
  const handleChange = (value: ReduceFunds) => {
    setReimbursements(value)
    setRequireSoftware(value === ReduceFunds.SUPPLEMENTAL || value === ReduceFunds.TECHNOLOGY)
    setIsChanged({
      ...isChanged,
      reimbursements: true,
    })
  }

  return (
    <Box sx={{ width: '100%', flexDirection: 'row' }} style={{ display: 'flex' }}>
      <Box>
        <DropDown
          dropDownItems={ADMIN_REDUCE_FUNDS_ITEMS}
          placeholder={'Select'}
          defaultValue={reimbursements}
          sx={{ width: '160px', marginLeft: '13px' }}
          borderNone={false}
          setParentValue={(value) => handleChange(value.toString() as ReduceFunds)}
        />
      </Box>{' '}
      <MthCheckbox
        label={'Required Software'}
        labelSx={{ fontWeight: 700 }}
        wrapSx={{ ml: 6 }}
        checked={!!requireSoftware}
        onChange={() => {
          setRequireSoftware(!requireSoftware)
          setIsChanged({ ...isChanged, requireSoftware: true })
        }}
        disabled={!reimbursements || reimbursements === ReduceFunds.NONE}
      />
    </Box>
  )
}
