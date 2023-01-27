import React, { useEffect, useState } from 'react'
import { Box, Checkbox, Typography } from '@mui/material'
import { Grid } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { MthColor } from '@mth/enums'
import { isValidDate } from '../helpers'
import { EnrollmentPacketFormType } from '../types'
import { CustomDateInput } from './CustomDateInput'

export const VaccinesInfoHeader: React.FC = () => {
  const { watch, setValue, control } = useFormContext<EnrollmentPacketFormType>()
  const [immunizations, enableExemptionDate] = watch(['immunizations', 'enableExemptionDate'])
  const [fullExempt, setFullExempt] = useState<boolean>(false)

  useEffect(() => {
    let _enableExamptiondate = false
    let _fullExempt = true
    if (immunizations) {
      for (const im of immunizations) {
        if (im.value === 'Exempt') {
          _enableExamptiondate = true
        } else {
          _fullExempt = false
        }
      }
    }
    setValue('enableExemptionDate', _enableExamptiondate)
    setFullExempt(_fullExempt)
  }, [immunizations])

  function toggleExempt() {
    setValue(
      'immunizations',
      immunizations.map((im) => ({
        ...im,
        value: !fullExempt ? 'Exempt' : '',
        siblings: immunizations.filter(
          (i) => i?.immunization_id && im?.immunization?.consecutives?.includes(+i?.immunization_id),
        ),
      })),
    )
  }

  return (
    <>
      <Grid container sx={{ gap: '25px' }}>
        <Box style={{ marginRight: 5 }}>
          <Grid item>
            <Typography fontSize='14px' color={MthColor.SYSTEM_01} fontWeight='700'>
              Exempt
            </Typography>
            <Checkbox color='primary' checked={fullExempt} onChange={toggleExempt} />
          </Grid>
        </Box>
        <Box style={{ marginRight: 5 }}>
          <Grid item>
            <Typography
              sx={{ marginBottom: '5px' }}
              component='div'
              fontSize='14px'
              color={MthColor.SYSTEM_01}
              fontWeight='700'
            >
              Exemption Date
            </Typography>
            <Controller
              name='exemptionDate'
              control={control}
              render={({ field }) => (
                <CustomDateInput
                  initVal={field.value}
                  onChange={(v) => field.onChange(v)}
                  disabled={!enableExemptionDate}
                  showError={enableExemptionDate && !isValidDate(field.value)}
                />
              )}
            />
          </Grid>
        </Box>
        <Box style={{ marginRight: 5 }}>
          <Grid item>
            <Typography component='div' fontSize='14px' color={MthColor.SYSTEM_01} fontWeight='700'>
              Medical Exemption
            </Typography>
            <Controller
              name='medicalExempt'
              control={control}
              render={({ field }) => (
                <Checkbox
                  color='primary'
                  checked={field.value}
                  onChange={() => field.onChange(!field.value)}
                  disabled={!enableExemptionDate}
                />
              )}
            />
          </Grid>
        </Box>
      </Grid>
    </>
  )
}
