import React from 'react'
import { Box, Grid, TextField, Typography } from '@mui/material'
import { useFormikContext } from 'formik'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { MthNumberInput } from '@mth/components/MthNumberInput'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { DIPLOMA_SEEKING_PATH_ITEMS, REDUCE_FUNDS_ITEMS } from '@mth/constants'
import { MthColor, ReduceFunds } from '@mth/enums'
import { StateCourseCords } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/TitleEdit/StateCourseCodes'
import { editTitleClasses } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/TitleEdit/styles'
import ValidGradesSelector from '../../Components/ValidateGrades/ValidGradesSelector'
import { Title, TitleFormProps } from '../types'

const TitleForm: React.FC<TitleFormProps> = ({ schoolYearData, subjectsItems, gradeOptions, scheduleBuilder }) => {
  const { errors, handleChange, setFieldValue, touched, values, setFieldTouched } = useFormikContext<Title>()

  return (
    <Box sx={{ width: '100%', textAlign: 'left', mb: '70px' }}>
      <Grid container columnSpacing={4}>
        <Grid item xs={6}>
          <Grid container columnSpacing={4} rowSpacing={3}>
            <Grid item xs={6}>
              <DropDown
                dropDownItems={subjectsItems}
                placeholder='Subject'
                labelTop
                setParentValue={(value) => {
                  setFieldValue('subject_id', value)
                }}
                sx={{ m: 0 }}
                defaultValue={values?.subject_id}
                error={{ error: touched.subject_id && !!errors.subject_id, errorMsg: '' }}
              />
              <Subtitle sx={editTitleClasses.formError}>{touched.subject_id && errors.subject_id}</Subtitle>
            </Grid>
            <Grid item xs={6} />
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
              <Subtitle sx={editTitleClasses.formError}>{touched.name && errors.name}</Subtitle>
            </Grid>
            <ValidGradesSelector gradeOptions={gradeOptions} />
            <Grid item xs={6}>
              {schoolYearData?.diploma_seeking && (
                <>
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
                  />
                  <Subtitle sx={editTitleClasses.formError}>
                    {touched.diploma_seeking_path && errors.diploma_seeking_path}
                  </Subtitle>
                </>
              )}
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
              <Subtitle sx={editTitleClasses.formError}>{touched.reduce_funds && errors.reduce_funds}</Subtitle>
            </Grid>
            <Grid item xs={6} />
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
              <Subtitle sx={editTitleClasses.formError}>{touched.price && errors.price}</Subtitle>
            </Grid>
            <Grid item xs={12}>
              {!!scheduleBuilder?.always_unlock && (
                <MthCheckbox
                  label='Always unlock this subject for 2nd Semester'
                  checked={values?.always_unlock}
                  onChange={() => {
                    setFieldValue('always_unlock', !values?.always_unlock)
                  }}
                />
              )}
              {!!scheduleBuilder?.custom_built && (
                <MthCheckbox
                  label='Allow Custom-built for this subject'
                  checked={values?.custom_built}
                  onChange={() => {
                    setFieldValue('custom_built', !values?.custom_built)
                  }}
                />
              )}
              {!!scheduleBuilder?.third_party_provider && (
                <MthCheckbox
                  label='Allow 3rd Party Provider for this subject'
                  checked={values?.third_party_provider}
                  onChange={() => {
                    setFieldValue('third_party_provider', !values?.third_party_provider)
                  }}
                />
              )}
              {!!scheduleBuilder?.split_enrollment && (
                <MthCheckbox
                  label='Allow Split Enrollment for this subject'
                  checked={values?.split_enrollment}
                  onChange={() => {
                    setFieldValue('split_enrollment', !values?.split_enrollment)
                  }}
                />
              )}
              <MthCheckbox
                label='This subject qualifies for Required Software Reimbursement'
                checked={values?.software_reimbursement}
                onChange={() => {
                  setFieldValue('software_reimbursement', !values?.software_reimbursement)
                }}
              />{' '}
              <MthCheckbox
                label='Display a notification when selecting this subject'
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
                  <Subtitle sx={editTitleClasses.formError}>{touched.course_id && errors.course_id}</Subtitle>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <Grid container columnSpacing={4} rowSpacing={3}>
            {!!values?.custom_built && (
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontSize: '18px',
                    fontWeight: '700',
                    mb: 1,
                    color:
                      touched.custom_built_description && errors.custom_built_description ? MthColor.ERROR_RED : '',
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
                <Subtitle sx={editTitleClasses.formError}>
                  {touched.custom_built_description && errors.custom_built_description}
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
                      touched.reduce_funds_notification && errors.reduce_funds_notification ? MthColor.ERROR_RED : '',
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
                <Subtitle sx={editTitleClasses.formError}>
                  {touched.reduce_funds_notification && errors.reduce_funds_notification}
                </Subtitle>
              </Grid>
            )}
            {!!values?.display_notification && (
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontSize: '18px',
                    fontWeight: '700',
                    mb: 1,
                    color: touched.subject_notification && errors.subject_notification ? MthColor.ERROR_RED : '',
                  }}
                >
                  Subject Notification
                </Typography>
                <MthBulletEditor
                  value={values?.subject_notification}
                  setValue={(value) => {
                    setFieldValue('subject_notification', value)
                  }}
                  error={touched.subject_notification && Boolean(errors.subject_notification)}
                />
                <Subtitle sx={editTitleClasses.formError}>
                  {touched.subject_notification && errors.subject_notification}
                </Subtitle>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid container sx={{ mt: '70px' }}>
        <Grid item xs={8}>
          <StateCourseCords />
        </Grid>
      </Grid>
    </Box>
  )
}

export default TitleForm
