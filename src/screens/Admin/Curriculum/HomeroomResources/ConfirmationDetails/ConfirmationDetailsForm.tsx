import React from 'react'
import { Box, Grid } from '@mui/material'
import { useFormikContext } from 'formik'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { homeroomResourcesClasses } from '../styles'
import { ConfirmationDetails, ConfirmationDetailsFormProps } from '../types'

const ConfirmationDetailsForm: React.FC<ConfirmationDetailsFormProps> = ({ setIsChanged }) => {
  const { errors, setFieldValue, touched, values } = useFormikContext<ConfirmationDetails>()

  return (
    <Box sx={{ width: '100%', px: 8, py: 16, textAlign: 'left' }}>
      <Grid container sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Grid item xs={10}>
          <Subtitle sx={homeroomResourcesClasses.formError}>{touched.details && errors.details}</Subtitle>
          <MthBulletEditor
            value={values?.details}
            setValue={(value) => {
              setFieldValue('details', value)
              setIsChanged(true)
            }}
            error={touched.details && Boolean(errors.details)}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default ConfirmationDetailsForm
