import React, { useEffect, useState } from 'react'
import { Box, Grid, TextField, Typography } from '@mui/material'
import { useFormikContext } from 'formik'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { MthNumberInput } from '@mth/components/MthNumberInput'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { DIPLOMA_SEEKING_PATH_ITEMS, REDUCE_FUNDS_ITEMS } from '@mth/constants'
import { MthColor, ReduceFunds } from '@mth/enums'
import { CourseTitles } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/CourseEdit/CourseTitles'
import { editCourseClasses } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/CourseEdit/styles'
import { Course, CourseFormProps, Provider } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/types'
import ValidGradesSelector from '../../Components/ValidateGrades/ValidGradesSelector'

const CourseForm: React.FC<CourseFormProps> = ({
  schoolYearId,
  schoolYearData,
  providerItems,
  resourceItems,
  providers,
  gradeOptions,
}) => {
  const { errors, handleChange, setFieldValue, touched, values, setFieldTouched } = useFormikContext<Course>()
  const [provider, setProvider] = useState<Provider | undefined>()
  const noneOption: DropDownItem = { label: 'None', value: 0 }

  useEffect(() => {
    if (values.provider_id) {
      const provider = providers?.find((item) => +item.id === +values.provider_id)
      setProvider(provider)
      if (provider?.multiple_periods) {
        setFieldValue('limit', null)
      }
    }
  }, [values.provider_id, providers])

  return (
    <Box sx={{ width: '100%', textAlign: 'left', mb: '70px' }}>
      <Grid container columnSpacing={4}>
        <Grid item xs={6}>
          <Grid container columnSpacing={4} rowSpacing={3}>
            <Grid item xs={12}>
              <DropDown
                dropDownItems={providerItems}
                placeholder='Provider'
                labelTop
                setParentValue={(value) => {
                  setFieldValue('provider_id', value)
                }}
                sx={{ m: 0 }}
                defaultValue={values?.provider_id}
                error={{ error: touched.provider_id && !!errors.provider_id, errorMsg: '' }}
              />
              <Subtitle sx={editCourseClasses.formError}>{touched.provider_id && errors.provider_id}</Subtitle>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name='name'
                label='Title'
                placeholder='Entry'
                fullWidth
                InputLabelProps={{ shrink: true }}
                className='MthFormField'
                value={values?.name}
                onChange={(e) => {
                  handleChange(e)
                }}
                error={touched.name && !!errors.name}
              />
              <Subtitle sx={editCourseClasses.formError}>{touched.name && errors.name}</Subtitle>
            </Grid>
            <ValidGradesSelector gradeOptions={gradeOptions} />
            <Grid item xs={12}>
              <MthCheckbox
                label='Always unlock this course for 2nd Semester changes'
                checked={values?.always_unlock}
                onChange={() => {
                  setFieldValue('always_unlock', !values?.always_unlock)
                }}
              />
              {!!values?.show_software_reimbursement && (
                <MthCheckbox
                  label='This course qualifies for Required Software Reimbursement'
                  checked={values?.software_reimbursement}
                  onChange={() => {
                    setFieldValue('software_reimbursement', !values?.software_reimbursement)
                  }}
                />
              )}
              <MthCheckbox
                label='Display a notification message for this course'
                checked={values?.display_notification}
                onChange={() => {
                  setFieldValue('display_notification', !values?.display_notification)
                }}
              />{' '}
              <MthCheckbox
                label='Launchpad Course'
                checked={values?.launchpad_course}
                onChange={() => {
                  setFieldValue('launchpad_course', !values?.launchpad_course)
                }}
              />
              {values?.launchpad_course && (
                <Grid item xs={6} sx={{ mt: 1, ml: '54px' }}>
                  <TextField
                    name='course_id'
                    label='Course ID'
                    placeholder='Entry'
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    className='MthFormField'
                    value={values?.course_id}
                    onChange={(e) => {
                      setFieldValue('course_id', e.target.value)
                    }}
                    error={touched.course_id && !!errors.course_id}
                  />
                  <Subtitle sx={editCourseClasses.formError}>{touched.course_id && errors.course_id}</Subtitle>
                </Grid>
              )}
            </Grid>
            {!!values?.display_notification && (
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontSize: '18px',
                    fontWeight: '700',
                    mb: 1,
                    color:
                      touched.course_notification && errors.course_notification
                        ? MthColor.ERROR_RED
                        : MthColor.SYSTEM_01,
                  }}
                >
                  Course Notification
                </Typography>
                <MthBulletEditor
                  value={values?.course_notification}
                  setValue={(value) => {
                    setFieldValue('course_notification', value)
                  }}
                  error={touched.course_notification && Boolean(errors.course_notification)}
                />
                <Subtitle sx={editCourseClasses.formError}>
                  {touched.course_notification && errors.course_notification}
                </Subtitle>
              </Grid>
            )}
            {values?.reduce_funds != ReduceFunds.NONE && (
              <Grid item xs={12}>
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
                <Subtitle sx={editCourseClasses.formError}>
                  {touched.reduce_funds_notification && errors.reduce_funds_notification}
                </Subtitle>
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <Grid container columnSpacing={4} rowSpacing={3}>
            <Grid item xs={12}>
              <TextField
                name='website'
                label='Website'
                placeholder='Entry'
                fullWidth
                InputLabelProps={{ shrink: true }}
                className='MthFormField'
                value={values?.website}
                onChange={(e) => {
                  handleChange(e)
                }}
                error={touched.website && !!errors.website}
              />
              <Subtitle sx={editCourseClasses.formError}>{touched.website && errors.website}</Subtitle>
            </Grid>
            <Grid item xs={6}>
              <DropDown
                dropDownItems={DIPLOMA_SEEKING_PATH_ITEMS}
                placeholder='Diploma-seeking Path'
                labelTop
                setParentValue={(value) => {
                  setFieldValue('diploma_seeking_path', value)
                }}
                sx={{ m: 0 }}
                defaultValue={values?.diploma_seeking_path}
                error={{ error: touched.diploma_seeking_path && !!errors.diploma_seeking_path, errorMsg: '' }}
                disabled={!schoolYearData?.diploma_seeking}
              />
              <Subtitle sx={editCourseClasses.formError}>
                {touched.diploma_seeking_path && errors.diploma_seeking_path}
              </Subtitle>
            </Grid>
            <Grid item xs={6}>
              <MthNumberInput
                numberType='numeric'
                name='limit'
                label='Limit'
                placeholder='Entry'
                fullWidth
                InputLabelProps={{ shrink: true }}
                className='MthFormField'
                value={values?.limit}
                onChangeValue={(value) => {
                  setFieldValue('limit', value)
                }}
                error={touched.limit && !!errors.limit}
                disabled={provider?.multiple_periods}
              />
              <Subtitle sx={editCourseClasses.formError}>{touched.limit && errors.limit}</Subtitle>
            </Grid>
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
              <Subtitle sx={editCourseClasses.formError}>{touched.reduce_funds && errors.reduce_funds}</Subtitle>
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
              <Subtitle sx={editCourseClasses.formError}>{touched.price && errors.price}</Subtitle>
            </Grid>
            <Grid item xs={12}>
              <DropDown
                dropDownItems={[noneOption].concat(resourceItems)}
                placeholder='Associated Homeroom Resource'
                labelTop
                setParentValue={(value) => {
                  setFieldValue('resource_id', value)
                }}
                sx={{ m: 0 }}
                defaultValue={values?.resource_id || 0}
              />
            </Grid>
            <Grid item xs={12}>
              <CourseTitles schoolYearId={schoolYearId} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default CourseForm
