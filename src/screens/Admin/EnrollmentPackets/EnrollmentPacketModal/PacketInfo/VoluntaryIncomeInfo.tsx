import React from 'react'
import { Grid, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { Controller, useFormContext } from 'react-hook-form'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { monthlyIncome } from '../../../../../utils/constants'

export const VoluntaryIncomeInfo: React.FC = () => {
  const { control } = useFormContext()
  return (
    <Box sx={{ paddingTop: '15px' }}>
      <Subtitle size='small' fontWeight='700'>
        Voluntary Income Information
      </Subtitle>
      <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
        <Grid item lg={6} xs={12}>
          <Box display='flex' flexDirection='column'>
            <Subtitle size='small' fontWeight='500'>
              Household Size
            </Subtitle>
            <Controller
              name='household_size'
              control={control}
              render={({ field }) => (
                <TextField {...field} placeholder='Household Size' size='small' variant='outlined' fullWidth />
              )}
            />
          </Box>
        </Grid>
        <Grid item lg={6} xs={12}>
          <Box display='flex' flexDirection='column' minWidth='250px'>
            <Subtitle size='small' fontWeight='500'>
              Household Gross Monthly Income
            </Subtitle>
            <Controller
              name='household_income'
              control={control}
              render={({ field }) => (
                <DropDown
                  dropDownItems={monthlyIncome}
                  placeholder='Entry'
                  defaultValue={field.value}
                  setParentValue={(v) => field.onChange(v as string)}
                  size='small'
                />
              )}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
