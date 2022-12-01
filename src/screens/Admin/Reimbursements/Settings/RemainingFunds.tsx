import React from 'react'
import { Typography, Grid } from '@mui/material'
import { useFormikContext } from 'formik'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { FormError } from '@mth/components/FormError'
import { MthNumberInput } from '@mth/components/MthNumberInput'
import { ENABLE_DISABLE_OPTIONS } from '@mth/constants'
import { ReimbursementSetting, RemainingFund } from '@mth/screens/Admin/Reimbursements/Settings/types'

export type RemainingFundsProps = {
  gradeOptions: DropDownItem[]
  setIsChanged: (value: boolean) => void
}

export const RemainingFunds: React.FC<RemainingFundsProps> = ({ gradeOptions, setIsChanged }) => {
  const { errors, setFieldValue, touched, values } = useFormikContext<ReimbursementSetting>()

  const handleChangeOption = (i: number, amount: number | null) => {
    const temp: RemainingFund[] = values?.RemainingFunds || []
    temp[i] = {
      ...temp[i],
      amount,
    }
    setFieldValue('stateCourseCords', temp)
    setIsChanged(true)
  }

  return (
    <>
      <Grid container columnSpacing={6}>
        <Grid item xs={3}>
          <DropDown
            dropDownItems={ENABLE_DISABLE_OPTIONS}
            placeholder='Select'
            sx={{ m: 0 }}
            defaultValue={values?.display_remaining_funds?.toString()}
            setParentValue={(value) => {
              setFieldValue('display_remaining_funds', value === 'true')
              setIsChanged(true)
            }}
            error={{ error: touched.display_remaining_funds && !!errors.display_remaining_funds, errorMsg: '' }}
          />
          <FormError error={touched.display_remaining_funds && errors.display_remaining_funds}></FormError>
        </Grid>
      </Grid>
      {values.display_remaining_funds &&
        gradeOptions?.map((grade, gradeIdx) => (
          <Grid key={gradeIdx} container columnSpacing={6} sx={{ pt: 3 }}>
            <Grid item xs={3}>
              <Typography sx={{ fontSize: '16px', fontWeight: 600, pl: 3, mt: '20px' }}>{grade.label}</Typography>
            </Grid>
            <Grid item xs={3}>
              <MthNumberInput
                numberType='price'
                label='Amount'
                placeholder='Entry'
                fullWidth
                InputLabelProps={{ shrink: true }}
                className='MthFormField'
                value={values.RemainingFunds?.[gradeIdx]?.amount}
                onChangeValue={(value: number | null) => handleChangeOption(gradeIdx, value)}
                error={touched.num_days_delete_updates_required && !!errors.num_days_delete_updates_required}
              />
              <FormError
                error={touched.num_days_delete_updates_required && errors.num_days_delete_updates_required}
              ></FormError>
            </Grid>
          </Grid>
        ))}
    </>
  )
}
