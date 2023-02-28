import React from 'react'
import { Box, Grid, TextField, Typography } from '@mui/material'
import { useFormikContext } from 'formik'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { MthNumberInput } from '@mth/components/MthNumberInput'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { REDUCE_FUNDS_ITEMS } from '@mth/constants'
import { MthColor, ReduceFunds } from '@mth/enums'
import { editProviderClasses } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/ProviderEdit/styles'
import { Provider, ProviderFormProps } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/types'
import { defaultReduceFunds } from '@mth/utils/default-reduce-funds.util'

const ProviderForm: React.FC<ProviderFormProps> = ({ setIsChanged, periodsItems, schoolYearData }) => {
  const { errors, handleChange, setFieldValue, touched, values, setFieldTouched } = useFormikContext<Provider>()

  return (
    <Box sx={{ width: '100%', textAlign: 'left', mb: '70px' }}>
      <Grid container rowSpacing={4} columnSpacing={4}>
        <Grid item xs={10}>
          <TextField
            name='name'
            label='Provider'
            placeholder='Entry'
            fullWidth
            InputLabelProps={{ shrink: true }}
            className='MthFormField'
            value={values?.name}
            onChange={(e) => {
              handleChange(e)
              setIsChanged(true)
            }}
            error={touched.name && !!errors.name}
          />
          <Subtitle sx={editProviderClasses.formError}>{touched.name && errors.name}</Subtitle>
        </Grid>

        <Grid item xs={12} sx={{ ml: '-12px' }}>
          <MthCheckbox
            label='Display this Provider wherever Provider filters are shown'
            checked={values?.is_display}
            onChange={() => {
              setFieldValue('is_display', !values?.is_display)
            }}
          />
        </Grid>

        <Grid item xs={10}>
          <Grid container columnSpacing={4}>
            <Grid item xs={6}>
              <DropDown
                dropDownItems={REDUCE_FUNDS_ITEMS}
                placeholder='Reduce Funds'
                labelTop
                setParentValue={(value) => {
                  if (value === ReduceFunds.NONE) {
                    setFieldValue('price', null)
                  } else if (values.reduce_funds === ReduceFunds.NONE) {
                    setFieldTouched('price', false)
                    setFieldTouched('reduce_funds_notification', false)
                  }
                  setFieldValue('reduce_funds', value)
                }}
                sx={{ m: 0 }}
                defaultValue={values?.reduce_funds || undefined}
                error={{ error: touched.reduce_funds && !!errors.reduce_funds, errorMsg: '' }}
                disabled={!defaultReduceFunds(schoolYearData)}
              />
              <Subtitle sx={editProviderClasses.formError}>{touched.reduce_funds && errors.reduce_funds}</Subtitle>
            </Grid>
            <Grid item xs={6}>
              <MthNumberInput
                numberType='price'
                label='Price'
                placeholder='Entry'
                fullWidth
                InputLabelProps={{ shrink: true }}
                className='MthFormField'
                value={values?.price}
                onChangeValue={(value: number | null) => {
                  setFieldValue('price', value)
                }}
                error={touched.price && !!errors.price}
                disabled={values?.reduce_funds === ReduceFunds.NONE}
              />
              <Subtitle sx={editProviderClasses.formError}>{touched.price && errors.price}</Subtitle>
            </Grid>
          </Grid>
        </Grid>
        {values?.reduce_funds != ReduceFunds.NONE && (
          <Grid item xs={10}>
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: '700',
                mb: 1,
                color:
                  touched.reduce_funds_notification && errors.reduce_funds_notification
                    ? MthColor.ERROR_RED
                    : MthColor.SYSTEM_01,
              }}
            >
              Reduce Funds Notification
            </Typography>
            <MthBulletEditor
              value={values?.reduce_funds_notification}
              setValue={(value) => {
                setFieldValue('reduce_funds_notification', value)
              }}
              error={touched.reduce_funds_notification && Boolean(errors.reduce_funds_notification)}
            />
            <Subtitle sx={editProviderClasses.formError}>
              {touched.reduce_funds_notification && errors.reduce_funds_notification}
            </Subtitle>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: '700',
              mb: 1,
              color: touched.PeriodIds && errors.PeriodIds ? MthColor.ERROR_RED : MthColor.SYSTEM_01,
            }}
          >
            Require Multiple Periods
          </Typography>
          <Subtitle sx={{ fontSize: '14px', color: MthColor.RED }}>
            {!!values?.SchedulePeriods?.length &&
              'These settings cannot be changed once a student has added this provider to their schedule.'}
          </Subtitle>
          <Box sx={{ ml: '-12px' }}>
            <MthCheckbox
              label='If this Provider is selected, it must also be selected for the following Periods:'
              checked={values?.multiple_periods}
              disabled={!!values?.SchedulePeriods?.length}
              onChange={() => {
                setFieldValue('multiple_periods', !values?.multiple_periods)
              }}
            />
          </Box>
        </Grid>

        {!!values?.multiple_periods && (
          <>
            <Grid item xs={12} sx={{ ml: 4 }}>
              <MthCheckboxList
                checkboxLists={periodsItems}
                haveSelectAll={false}
                values={values?.PeriodIds || []}
                disabled={!!values?.SchedulePeriods?.length}
                setValues={(value) => {
                  setFieldValue('PeriodIds', value)
                }}
              />
              <Subtitle sx={editProviderClasses.formError}>{touched.PeriodIds && errors.PeriodIds}</Subtitle>
            </Grid>
            <Grid item xs={10}>
              <Typography sx={{ fontSize: '18px', fontWeight: '700', mb: 1 }}>Multiple Periods Notification</Typography>
              <MthBulletEditor
                value={values?.multi_periods_notification}
                setValue={(value) => {
                  setFieldValue('multi_periods_notification', value)
                }}
                error={touched.multi_periods_notification && Boolean(errors.multi_periods_notification)}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
}

export default ProviderForm
