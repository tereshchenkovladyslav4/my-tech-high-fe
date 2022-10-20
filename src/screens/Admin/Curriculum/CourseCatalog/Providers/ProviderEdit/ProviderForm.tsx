import React from 'react'
import { Box, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import { useFormikContext } from 'formik'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { REDUCE_FUNDS_ITEMS } from '@mth/constants'
import { MthColor, ReduceFunds } from '@mth/enums'
import { editProviderClasses } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/ProviderEdit/styles'
import { Provider, ProviderFormProps } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/types'

const ProviderForm: React.FC<ProviderFormProps> = ({ setIsChanged, periodsItems }) => {
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
            label='Display this provider wherever provider filters are shown'
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
                defaultValue={values?.reduce_funds}
                error={{ error: touched.reduce_funds && !!errors.reduce_funds, errorMsg: '' }}
              />
              <Subtitle sx={editProviderClasses.formError}>{touched.reduce_funds && errors.reduce_funds}</Subtitle>
            </Grid>
            <Grid item xs={6}>
              <TextField
                name='price'
                label='Price'
                placeholder='Entry'
                InputProps={{ startAdornment: <InputAdornment position='start'>$</InputAdornment> }}
                type='number'
                fullWidth
                value={values?.price || ''}
                onChange={(e) => {
                  setFieldValue('price', Number(e.target.value) || '')
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
            <Typography sx={{ fontSize: '18px', fontWeight: '700', mb: 1 }}>Reduce Funds Notification</Typography>
            <MthBulletEditor
              value={values?.reduce_funds_notification}
              setValue={(value) => {
                setFieldValue('reduce_funds_notification', value)
              }}
              error={touched.reduce_funds_notification && Boolean(errors.reduce_funds_notification)}
            />
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
          <Box sx={{ ml: '-12px' }}>
            <MthCheckbox
              label='If this Provider is selected, it must also be selected for the following periods:'
              checked={values?.multiple_periods}
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
