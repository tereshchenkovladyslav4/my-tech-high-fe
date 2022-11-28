import React from 'react'
import { Box, Grid } from '@mui/material'
import { useFormikContext } from 'formik'
import { range } from 'lodash'
import { CommonSelect } from '@mth/components/CommonSelect'
import { CommonSelectType } from '@mth/components/CommonSelect/types'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { FormError } from '@mth/components/FormError'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
import { MthNumberInput } from '@mth/components/MthNumberInput'
import { MultiSelect } from '@mth/components/MultiSelect/MultiSelect'
import { ENABLE_DISABLE_OPTIONS, YES_NO_OPTIONS } from '@mth/constants'
import { ReduceFunds } from '@mth/enums'
import { SchoolYear } from '@mth/models'
import { RemainingFunds } from '@mth/screens/Admin/Reimbursements/Settings/RemainingFunds'
import { ReimbursementSetting } from '@mth/screens/Admin/Reimbursements/Settings/types'

export type ReimbursementsSettingsFormProps = {
  schoolYear: SchoolYear
  gradeOptions: DropDownItem[]
}

export const ReimbursementsSettingsForm: React.FC<ReimbursementsSettingsFormProps> = ({ schoolYear, gradeOptions }) => {
  const { errors, setFieldValue, touched, values } = useFormikContext<ReimbursementSetting>()

  const periodOptions: CheckBoxListVM[] = range(1, (schoolYear.ScheduleBuilder?.max_num_periods || 0) + 1, 1).map(
    (item) => ({
      label: `${item}`,
      value: `${item}`,
    }),
  )
  const percentageOptions: DropDownItem[] = range(0, 101, 5).map((item) => ({ label: `${item}%`, value: item }))

  const settingList: (CommonSelectType | null)[] = [
    {
      name: 'Information section on Parent Page',
      component: (
        <Box sx={{ pr: { md: '10%' } }}>
          <MthBulletEditor
            value={values?.information || ''}
            setValue={(value) => {
              setFieldValue('information', value)
            }}
            error={touched.information && Boolean(errors.information)}
          />
          <FormError error={touched.information && errors.information}></FormError>
        </Box>
      ),
    },
    schoolYear.reimbursements === ReduceFunds.SUPPLEMENTAL || schoolYear.direct_orders === ReduceFunds.SUPPLEMENTAL
      ? {
          name: 'Supplemental Learning Funds',
          component: (
            <Grid container columnSpacing={6}>
              <Grid item xs={3}>
                <MthNumberInput
                  numberType='numeric'
                  label='Reimbursement Forms'
                  placeholder='Entry'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  className='MthFormField'
                  value={values?.supplemental_reimbursements_forms}
                  onChangeValue={(value: number | null) => {
                    setFieldValue('supplemental_reimbursements_forms', value)
                  }}
                  error={touched.supplemental_reimbursements_forms && !!errors.supplemental_reimbursements_forms}
                  disabled={schoolYear.reimbursements !== ReduceFunds.SUPPLEMENTAL}
                />
                <FormError
                  error={touched.supplemental_reimbursements_forms && errors.supplemental_reimbursements_forms}
                ></FormError>
              </Grid>
              <Grid item xs={3}>
                <MthNumberInput
                  numberType='numeric'
                  label='Direct Order Forms'
                  placeholder='Entry'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  className='MthFormField'
                  value={values?.supplemental_direct_order_forms}
                  onChangeValue={(value: number | null) => {
                    setFieldValue('supplemental_direct_order_forms', value)
                  }}
                  error={touched.supplemental_direct_order_forms && !!errors.supplemental_direct_order_forms}
                  disabled={schoolYear.direct_orders !== ReduceFunds.SUPPLEMENTAL}
                />
                <FormError
                  error={touched.supplemental_direct_order_forms && errors.supplemental_direct_order_forms}
                ></FormError>
              </Grid>
            </Grid>
          ),
        }
      : null,
    schoolYear.reimbursements === ReduceFunds.TECHNOLOGY || schoolYear.direct_orders === ReduceFunds.TECHNOLOGY
      ? {
          name: 'Technology Allowance',
          component: (
            <Grid container columnSpacing={6}>
              <Grid item xs={3}>
                <MthNumberInput
                  numberType='numeric'
                  label='Reimbursement Forms'
                  placeholder='Entry'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  className='MthFormField'
                  value={values?.technology_reimbursements_forms}
                  onChangeValue={(value: number | null) => {
                    setFieldValue('technology_reimbursements_forms', value)
                  }}
                  error={touched.technology_reimbursements_forms && !!errors.technology_reimbursements_forms}
                  disabled={schoolYear.reimbursements !== ReduceFunds.TECHNOLOGY}
                />
                <FormError
                  error={touched.technology_reimbursements_forms && errors.technology_reimbursements_forms}
                ></FormError>
              </Grid>
              <Grid item xs={3}>
                <MthNumberInput
                  numberType='numeric'
                  label='Direct Order Forms'
                  placeholder='Entry'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  className='MthFormField'
                  value={values?.technology_direct_order_forms}
                  onChangeValue={(value: number | null) => {
                    setFieldValue('technology_direct_order_forms', value)
                  }}
                  error={touched.technology_direct_order_forms && !!errors.technology_direct_order_forms}
                  disabled={schoolYear.direct_orders !== ReduceFunds.TECHNOLOGY}
                />
                <FormError
                  error={touched.technology_direct_order_forms && errors.technology_direct_order_forms}
                ></FormError>
              </Grid>
            </Grid>
          ),
        }
      : null,
    schoolYear.ScheduleBuilder?.custom_built
      ? {
          name: 'Custom-built',
          component: (
            <Grid container columnSpacing={6}>
              <Grid item xs={3}>
                <MthNumberInput
                  numberType='numeric'
                  label='Reimbursement Forms'
                  placeholder='Entry'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  className='MthFormField'
                  value={values?.custom_reimbursements_forms}
                  onChangeValue={(value: number | null) => {
                    setFieldValue('custom_reimbursements_forms', value)
                  }}
                  error={touched.custom_reimbursements_forms && !!errors.custom_reimbursements_forms}
                />
                <FormError
                  error={touched.custom_reimbursements_forms && errors.custom_reimbursements_forms}
                ></FormError>
              </Grid>
              <Grid item xs={3}>
                <MthNumberInput
                  numberType='numeric'
                  label='Direct Order Forms'
                  placeholder='Entry'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  className='MthFormField'
                  value={values?.custom_direct_order_forms}
                  onChangeValue={(value: number | null) => {
                    setFieldValue('custom_direct_order_forms', value)
                  }}
                  error={touched.custom_direct_order_forms && !!errors.custom_direct_order_forms}
                />
                <FormError error={touched.custom_direct_order_forms && errors.custom_direct_order_forms}></FormError>
              </Grid>
            </Grid>
          ),
          mergedItems: [
            {
              name: 'Merged Periods',
              component: (
                <Grid container columnSpacing={6}>
                  <Grid item xs={3}>
                    <DropDown
                      dropDownItems={YES_NO_OPTIONS}
                      placeholder='Select'
                      sx={{ m: 0 }}
                      defaultValue={values?.is_merged_periods?.toString()}
                      setParentValue={(value) => {
                        setFieldValue('is_merged_periods', value == 'true')
                      }}
                      error={{
                        error: touched.is_merged_periods && !!errors.is_merged_periods,
                        errorMsg: '',
                      }}
                    />
                    <FormError error={touched.is_merged_periods && errors.is_merged_periods}></FormError>
                  </Grid>
                  <Grid item xs={3}>
                    <MultiSelect
                      options={periodOptions}
                      placeholder='Select'
                      onChange={(value) => {
                        const filteredGrades = value.filter(
                          (item) => periodOptions.findIndex((option) => option.value === item) > -1,
                        )
                        setFieldValue('merged_periods', filteredGrades.join(','))
                      }}
                      // renderValue={renderGrades(values.grades)}
                      defaultValue={values?.merged_periods?.length ? values.merged_periods.split(',') : []}
                      error={{ error: touched.merged_periods && !!errors.merged_periods, errorMsg: '' }}
                      disabled={!values.is_merged_periods}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <MthNumberInput
                      numberType='numeric'
                      label='Reimbursement Forms'
                      placeholder='Entry'
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      className='MthFormField'
                      value={values?.merged_periods_reimbursements_forms}
                      onChangeValue={(value: number | null) => {
                        setFieldValue('merged_periods_reimbursements_forms', value)
                      }}
                      error={
                        touched.merged_periods_reimbursements_forms && !!errors.merged_periods_reimbursements_forms
                      }
                      disabled={!values.is_merged_periods}
                    />
                    <FormError
                      error={touched.merged_periods_reimbursements_forms && errors.merged_periods_reimbursements_forms}
                    ></FormError>
                  </Grid>
                  <Grid item xs={3}>
                    <MthNumberInput
                      numberType='numeric'
                      label='Direct Order Forms'
                      placeholder='Entry'
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      className='MthFormField'
                      value={values?.merged_periods_direct_order_forms}
                      onChangeValue={(value: number | null) => {
                        setFieldValue('merged_periods_direct_order_forms', value)
                      }}
                      error={touched.merged_periods_direct_order_forms && !!errors.merged_periods_direct_order_forms}
                      disabled={!values.is_merged_periods}
                    />
                    <FormError
                      error={touched.merged_periods_direct_order_forms && errors.merged_periods_direct_order_forms}
                    ></FormError>
                  </Grid>
                </Grid>
              ),
            },
          ],
        }
      : null,
    schoolYear.ScheduleBuilder?.third_party_provider
      ? {
          name: '3rd Party Provider',
          component: (
            <Grid container columnSpacing={6}>
              <Grid item xs={3}>
                <MthNumberInput
                  numberType='numeric'
                  label='Reimbursement Forms'
                  placeholder='Entry'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  className='MthFormField'
                  value={values?.third_party_reimbursements_forms}
                  onChangeValue={(value: number | null) => {
                    setFieldValue('third_party_reimbursements_forms', value)
                  }}
                  error={touched.third_party_reimbursements_forms && !!errors.third_party_reimbursements_forms}
                />
                <FormError
                  error={touched.third_party_reimbursements_forms && errors.third_party_reimbursements_forms}
                ></FormError>
              </Grid>
            </Grid>
          ),
        }
      : null,
    schoolYear.require_software
      ? {
          name: 'Required Software',
          component: (
            <Grid container columnSpacing={6}>
              <Grid item xs={3}>
                <MthNumberInput
                  numberType='numeric'
                  label='Reimbursement Forms'
                  placeholder='Entry'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  className='MthFormField'
                  value={values?.require_software_reimbursements_forms}
                  onChangeValue={(value: number | null) => {
                    setFieldValue('require_software_reimbursements_forms', value)
                  }}
                  error={
                    touched.require_software_reimbursements_forms && !!errors.require_software_reimbursements_forms
                  }
                />
                <FormError
                  error={touched.require_software_reimbursements_forms && errors.require_software_reimbursements_forms}
                ></FormError>
              </Grid>
            </Grid>
          ),
        }
      : null,
    {
      name: 'Max Number of Receipts',
      component: (
        <Grid container columnSpacing={6}>
          <Grid item xs={3}>
            <MthNumberInput
              numberType='numeric'
              placeholder='Entry'
              fullWidth
              InputLabelProps={{ shrink: true }}
              className='MthFormField'
              value={values?.max_receipts}
              onChangeValue={(value: number | null) => {
                setFieldValue('max_receipts', value)
              }}
              error={touched.max_receipts && !!errors.max_receipts}
            />
            <FormError error={touched.max_receipts && errors.max_receipts}></FormError>
          </Grid>
        </Grid>
      ),
    },
    {
      name: 'Require Passing Grade',
      component: (
        <Grid container columnSpacing={6}>
          <Grid item xs={3}>
            <DropDown
              dropDownItems={ENABLE_DISABLE_OPTIONS}
              placeholder='Select'
              sx={{ m: 0 }}
              defaultValue={values?.require_passing_grade?.toString()}
              setParentValue={(value) => {
                setFieldValue('require_passing_grade', value === 'true')
              }}
              error={{ error: touched.require_passing_grade && !!errors.require_passing_grade, errorMsg: '' }}
            />
            <FormError error={touched.require_passing_grade && errors.require_passing_grade}></FormError>
          </Grid>
          <Grid item xs={3}>
            <DropDown
              dropDownItems={percentageOptions}
              placeholder='Grade'
              labelTop
              sx={{ m: 0 }}
              defaultValue={values?.min_grade_percentage || undefined}
              setParentValue={(value) => {
                setFieldValue('min_grade_percentage', value)
              }}
              error={{ error: touched.min_grade_percentage && !!errors.min_grade_percentage, errorMsg: '' }}
              disabled={!values.require_passing_grade}
            />
            <FormError error={touched.min_grade_percentage && errors.min_grade_percentage}></FormError>
          </Grid>
        </Grid>
      ),
    },
    {
      name: 'Allow Parent to delete requests after submission',
      component: (
        <Grid container columnSpacing={6}>
          <Grid item xs={3}>
            <DropDown
              dropDownItems={ENABLE_DISABLE_OPTIONS}
              placeholder='Select'
              sx={{ m: 0 }}
              defaultValue={values?.allow_delete?.toString()}
              setParentValue={(value) => {
                setFieldValue('allow_delete', value === 'true')
              }}
              error={{ error: touched.allow_delete && !!errors.allow_delete, errorMsg: '' }}
            />
            <FormError error={touched.allow_delete && errors.allow_delete}></FormError>
          </Grid>
        </Grid>
      ),
    },
    {
      name: 'Allow user to submit request with Updates Required',
      component: (
        <Grid container columnSpacing={6}>
          <Grid item xs={3}>
            <DropDown
              dropDownItems={ENABLE_DISABLE_OPTIONS}
              placeholder='Select'
              sx={{ m: 0 }}
              defaultValue={values?.allow_submit_with_updates_required?.toString()}
              setParentValue={(value) => {
                setFieldValue('allow_submit_with_updates_required', value === 'true')
              }}
              error={{
                error: touched.allow_submit_with_updates_required && !!errors.allow_submit_with_updates_required,
                errorMsg: '',
              }}
            />
            <FormError
              error={touched.allow_submit_with_updates_required && errors.allow_submit_with_updates_required}
            ></FormError>
          </Grid>
        </Grid>
      ),
    },
    {
      name: 'Automatically Delete Updates Required',
      component: (
        <Grid container columnSpacing={6}>
          <Grid item xs={3}>
            <DropDown
              dropDownItems={ENABLE_DISABLE_OPTIONS}
              placeholder='Select'
              sx={{ m: 0 }}
              defaultValue={values?.auto_delete_updates_required?.toString()}
              setParentValue={(value) => {
                setFieldValue('auto_delete_updates_required', value === 'true')
              }}
              error={{
                error: touched.auto_delete_updates_required && !!errors.auto_delete_updates_required,
                errorMsg: '',
              }}
            />
            <FormError error={touched.auto_delete_updates_required && errors.auto_delete_updates_required}></FormError>
          </Grid>
          <Grid item xs={3}>
            <MthNumberInput
              numberType='numeric'
              label='Days'
              placeholder='Entry'
              fullWidth
              InputLabelProps={{ shrink: true }}
              className='MthFormField'
              value={values?.num_days_delete_updates_required}
              onChangeValue={(value: number | null) => {
                setFieldValue('num_days_delete_updates_required', value)
              }}
              error={touched.num_days_delete_updates_required && !!errors.num_days_delete_updates_required}
              disabled={!values.auto_delete_updates_required}
            />
            <FormError
              error={touched.num_days_delete_updates_required && errors.num_days_delete_updates_required}
            ></FormError>
          </Grid>
        </Grid>
      ),
    },
    {
      name: 'Display Remaining Funds',
      component: <RemainingFunds gradeOptions={gradeOptions}></RemainingFunds>,
    },
  ]

  return (
    <>
      {settingList.map(
        (setting, pIdx) =>
          setting !== null && (
            <Box key={pIdx}>
              <CommonSelect
                key={pIdx}
                index={pIdx}
                selectItem={setting}
                dividerStyle={
                  setting.mergedItems?.length ? { top: '24px', height: '100%' } : { top: '24px', bottom: '24px' }
                }
              />

              {setting.mergedItems?.map((child, cIdx) => (
                <CommonSelect
                  key={`${pIdx}-${cIdx}`}
                  index={pIdx}
                  selectItem={child}
                  dividerStyle={
                    setting.mergedItems?.length && cIdx + 1 === setting.mergedItems.length
                      ? { bottom: '24px', height: '100%' }
                      : {}
                  }
                />
              ))}
            </Box>
          ),
      )}
    </>
  )
}
