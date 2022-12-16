import React, { useMemo } from 'react'
import { ErrorOutlineOutlined } from '@mui/icons-material'
import { Checkbox, Box, Typography, Tooltip, InputAdornment } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { MthColor } from '@mth/enums'
import { checkImmmValueWithSpacing, isValidDate, isValidVaccInput } from '../helpers'
import { EnrollmentPacketFormType } from '../types'
import { CustomDateInput } from './CustomDateInput'
import { StudentImmunization } from './types'

export const ImmunizationItem: React.FC<{ item: StudentImmunization }> = ({ item }) => {
  const { watch, setValue } = useFormContext<EnrollmentPacketFormType>()

  const [immunizations, showError] = watch(['immunizations', 'showValidationErrors'])

  const siblings = useMemo(
    () =>
      immunizations.filter(
        (immunization) =>
          immunization?.immunization_id && item?.immunization?.consecutives?.includes(+immunization?.immunization_id),
      ),
    [immunizations],
  )

  const exempt = useMemo(
    () => item.value === 'Exempt' && siblings?.every((v) => v.value === 'Exempt'),
    [item.value, siblings],
  )
  const validValue = useMemo(
    () =>
      !item?.immunization?.is_deleted && isValidVaccInput(item?.value || '', item.immunization?.immunity_allowed === 1),
    [item.immunization?.immunity_allowed, item.value],
  )
  const validDateSpace = useMemo(() => {
    return checkImmmValueWithSpacing(item, immunizations)
  }, [item, immunizations])

  function onExemptCheck(exempt: boolean) {
    setValue(
      'immunizations',
      immunizations.map((immunization) => {
        if (
          immunization.immunization_id &&
          (immunization.immunization_id === item.immunization_id ||
            item.immunization?.consecutives?.includes(+immunization.immunization_id))
        ) {
          return {
            ...immunization,
            value: exempt ? 'Exempt' : '',
          }
        }
        return immunization
      }),
    )
  }

  function changeImmunValue(value: string) {
    const isTopVac = item.immunization?.consecutive_vaccine === 0
    if (value === 'Exempt' && isTopVac) onExemptCheck(true)
    setValue(
      'immunizations',
      immunizations.map((im) => {
        if (im.immunization_id === item.immunization_id) {
          return {
            ...im,
            value,
          }
        }
        return im
      }),
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        background: validValue ? 'unset' : item?.immunization?.is_deleted ? '#f0f0f0' : 'rgba(255, 214, 38, 0.3)',
        border: showError && !validValue && !item?.immunization?.is_deleted ? '2px solid red' : 'unset',
        opacity: item?.immunization?.is_deleted ? 0.4 : 1,
      }}
    >
      {item?.immunization?.consecutive_vaccine === 0 ? (
        <Checkbox
          color='primary'
          checked={exempt}
          sx={{
            paddingY: '10px',
          }}
          disabled={isValidDate(item?.value || '') || item.immunization.is_deleted}
          onChange={(e) => onExemptCheck(e.target.checked)}
        />
      ) : (
        <Box sx={{ width: '42px' }} />
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          borderBottom: '0.5px solid #A3A3A4',
          paddingY: '10px',
          marginLeft: '5px',
        }}
      >
        <Tooltip title={item?.immunization?.tooltip || ''}>
          <Typography
            sx={{ width: '70px', display: 'inline-block' }}
            component='span'
            fontSize='14px'
            color={MthColor.SYSTEM_01}
            fontWeight='700'
          >
            {item?.immunization?.title}
          </Typography>
        </Tooltip>

        <CustomDateInput
          initVal={item.value || ''}
          onChange={changeImmunValue}
          showError={showError && (!isValidDate || !validDateSpace)}
          allowIM={item?.immunization?.immunity_allowed === 1}
          disabled={item?.immunization?.is_deleted}
          endAdornment={
            (showError || !validDateSpace) && (
              <InputAdornment position='end'>
                <Tooltip
                  title='Does not fall within vaccine timeframe, school may request a new vaccine record.'
                  sx={{ width: '20px' }}
                >
                  <ErrorOutlineOutlined color='error' />
                </Tooltip>
              </InputAdornment>
            )
          }
        />
      </Box>
    </Box>
  )
}

export default ImmunizationItem
