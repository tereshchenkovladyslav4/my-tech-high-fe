import React from 'react'
import { Box, Typography } from '@mui/material'
import { useFormikContext } from 'formik'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { customBuiltClasses } from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/CustomBuiltDescription/styles'
import { CustomBuiltDescription } from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/CustomBuiltDescription/types'

const CustomBuiltDescriptionForm: React.FC = () => {
  const { errors, setFieldValue, touched, values } = useFormikContext<CustomBuiltDescription>()

  return (
    <Box sx={{ width: '100%', textAlign: 'left' }}>
      <Typography
        sx={{
          fontSize: '18px',
          fontWeight: '700',
          mb: 6,
          color: touched.custom_built_description && errors.custom_built_description ? MthColor.ERROR_RED : '',
        }}
      >
        Custom-built Description
      </Typography>
      <MthBulletEditor
        value={values?.custom_built_description}
        setValue={(value) => {
          setFieldValue('custom_built_description', value)
        }}
        error={touched.custom_built_description && Boolean(errors.custom_built_description)}
      />
      <Subtitle sx={customBuiltClasses.formError}>
        {touched.custom_built_description && errors.custom_built_description}
      </Subtitle>
    </Box>
  )
}

export default CustomBuiltDescriptionForm
