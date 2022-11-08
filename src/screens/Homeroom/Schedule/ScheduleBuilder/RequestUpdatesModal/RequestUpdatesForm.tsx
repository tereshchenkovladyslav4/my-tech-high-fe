import React from 'react'
import { Box, Typography } from '@mui/material'
import { useFormikContext } from 'formik'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { requestUpdatesClasses } from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/RequestUpdatesModal/styles'
import {
  PeriodSelect,
  RequestUpdatesFormProps,
} from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/RequestUpdatesModal/types'

const RequestUpdatesForm: React.FC<RequestUpdatesFormProps> = ({ periodsItems }) => {
  const { errors, setFieldValue, touched, values } = useFormikContext<PeriodSelect>()

  return (
    <Box sx={{ width: '100%', textAlign: 'left' }}>
      <Box>
        <Typography sx={{ fontSize: '20px', fontWeight: '700', lineHeight: '22px', mb: 2 }}>
          Please select the Periods you would like to update:
        </Typography>
        <MthCheckboxList
          checkboxLists={periodsItems}
          haveSelectAll={false}
          values={values?.PeriodIds || []}
          setValues={(value) => {
            setFieldValue('PeriodIds', value)
          }}
        />
      </Box>
      <Subtitle sx={requestUpdatesClasses.formError}>{touched.PeriodIds && errors.PeriodIds}</Subtitle>
    </Box>
  )
}

export default RequestUpdatesForm
