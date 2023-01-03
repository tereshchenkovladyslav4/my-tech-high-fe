import React from 'react'
import { Button, Grid } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import {
  BLACK_GRADIENT,
  BUTTON_LINEAR_GRADIENT,
  GREEN_GRADIENT,
  RED_GRADIENT,
  YELLOW_GRADIENT,
} from '../../../../utils/constants'
import { checkImmmValueWithSpacing, isValidDate, isValidVaccInput } from './helpers'
import { EnrollmentPacketFormType, SaveButtonsType } from './types'

export const PacketSaveButtons: React.FC<{ submitForm: () => void }> = ({ submitForm }) => {
  const { watch, getValues, setValue, setError } = useFormContext<EnrollmentPacketFormType>()

  const [status, exemptionDate, enableExemptionDate] = watch(['status', 'exemptionDate', 'enableExemptionDate'])
  const onlySaveButton = !['Submitted', 'Resubmitted'].includes(status)

  const isValidExemptDate = !enableExemptionDate || isValidDate(exemptionDate)

  function onClick(action: SaveButtonsType) {
    const values = getValues()

    if (enableExemptionDate && !isValidDate(values.exemptionDate)) {
      setError('exemptionDate', { type: 'required', message: 'Please enter a valid date' })
      return
    }

    if (action === 'Missing Info') {
      setValue('showMissingInfoModal', true)
    } else if (action === 'Age Issue') {
      setValue('showAgeIssueModal', true)
    } else {
      let isValid = true
      for (const e of values.immunizations) {
        if (e?.immunization?.is_deleted) continue
        if (!isValidVaccInput(e?.value, e?.immunization?.immunity_allowed === 1)) {
          isValid = false
          break
        }
        if (e.value === 'Exempt' && !isValidDate(values.exemptionDate)) {
          isValid = false
          break
        }
        if (!checkImmmValueWithSpacing(e, values.immunizations)) {
          isValid = false
          break
        }
      }
      if (['Accepted', 'Conditional'].includes(action)) {
        setValue('preSaveStatus', action)
        if (isValid) {
          submitForm()
          setValue('status', action)
        } else setValue('showSaveWarnModal', true)
      } else {
        if (isValid) submitForm()
        else setValue('showSaveWarnModal', true)
      }
    }
  }

  return (
    <>
      <Grid
        sx={{
          '&.MuiGrid-root': {
            width: '100%',
            // minWidth: '600px',
          },
        }}
        container
      >
        <Grid container>
          <Grid item>
            <Button
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                height: 25,
                background: BUTTON_LINEAR_GRADIENT,
                color: 'white',
                width: '92px',
                marginRight: '5px',
              }}
              onClick={() => onClick('Save')}
              disabled={!isValidExemptDate}
            >
              Save
            </Button>
          </Grid>
          <Grid item>
            <Button
              disabled={onlySaveButton || !isValidExemptDate}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                height: 25,
                background: GREEN_GRADIENT,
                color: 'white',
                width: '92px',
                marginRight: '5px',
              }}
              onClick={() => onClick('Accepted')}
            >
              Accept
            </Button>
          </Grid>

          <Grid item>
            <Button
              disabled={onlySaveButton || !isValidExemptDate}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                height: 25,
                background: RED_GRADIENT,
                color: 'white',
                width: '92px',
                marginRight: '5px',
              }}
              onClick={() => onClick('Missing Info')}
            >
              Missing Info
            </Button>
          </Grid>
          <Grid item>
            <Button
              disabled={onlySaveButton || !isValidExemptDate}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                height: 25,
                background: YELLOW_GRADIENT,
                color: 'white',
                width: '92px',
                marginRight: '5px',
              }}
              onClick={() => onClick('Age Issue')}
            >
              Age Issue
            </Button>
          </Grid>
          <Grid item>
            <Button
              disabled={onlySaveButton || !isValidExemptDate}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                height: 25,
                background: BLACK_GRADIENT,
                color: 'white',
                width: '92px',
                marginRight: '5px',
              }}
              onClick={() => onClick('Conditional')}
            >
              Conditional
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
