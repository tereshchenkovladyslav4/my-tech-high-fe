import React, { useState } from 'react'
import { Box, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import { useFormikContext } from 'formik'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { DIPLOMA_SEEKING_PATH_ITEMS, REDUCE_FUNDS_ITEMS } from '@mth/constants'
import { MthColor, ReduceFunds } from '@mth/enums'
import { CourseTitles } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/CourseEdit/CourseTitles'
import { editCourseClasses } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/CourseEdit/styles'
import { Course, CourseFormProps } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/types'

const CourseForm: React.FC<CourseFormProps> = ({
  schoolYearId,
  schoolYearData,
  scheduleBuilder,
  providerItems,
  gradeOptions,
}) => {
  const { errors, handleChange, setFieldValue, touched, values, setFieldTouched } = useFormikContext<Course>()
  const [showGradeError, setShowGradeError] = useState<boolean>(false)
  const [showAltGradeError, setShowAltGradeError] = useState<boolean>(false)

  const validateGrades = (field: string, newValue: string) => {
    const newValues = { ...values, [field]: newValue }
    const grades = [
      newValues?.min_grade,
      newValues?.max_grade,
      newValues?.min_alt_grade || Number.NEGATIVE_INFINITY.toString(),
      newValues?.max_alt_grade || Number.POSITIVE_INFINITY.toString(),
    ].map((item) => (item?.startsWith('K') ? 0 : +item))

    // Check grades
    if (grades[0] >= grades[1]) {
      setShowGradeError(true)
      return
    }
    // Check alternative grades
    if (grades[2] >= grades[3]) {
      setShowAltGradeError(true)
      return
    }
    setFieldValue(field, newValue)
  }

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
                value={values?.name}
                onChange={(e) => {
                  handleChange(e)
                }}
                error={touched.name && !!errors.name}
              />
              <Subtitle sx={editCourseClasses.formError}>{touched.name && errors.name}</Subtitle>
            </Grid>
            <Grid item xs={6}>
              <DropDown
                dropDownItems={gradeOptions}
                placeholder='Minimum Grade Level'
                labelTop
                auto={false}
                setParentValue={(value) => {
                  validateGrades('min_grade', value.toString())
                }}
                sx={{ m: 0 }}
                defaultValue={values?.min_grade}
                error={{ error: touched.min_grade && !!errors.min_grade, errorMsg: '' }}
              />
              <Subtitle sx={editCourseClasses.formError}>{touched.min_grade && errors.min_grade}</Subtitle>
            </Grid>
            <Grid item xs={6}>
              <DropDown
                dropDownItems={gradeOptions}
                placeholder='Maximum Grade Level'
                labelTop
                auto={false}
                setParentValue={(value) => {
                  validateGrades('max_grade', value.toString())
                }}
                sx={{ m: 0 }}
                defaultValue={values?.max_grade}
                error={{ error: touched.max_grade && !!errors.max_grade, errorMsg: '' }}
              />
              <Subtitle sx={editCourseClasses.formError}>{touched.max_grade && errors.max_grade}</Subtitle>
            </Grid>
            <Grid item xs={6}>
              <DropDown
                dropDownItems={gradeOptions}
                placeholder='Alternative Minimum'
                labelTop
                auto={false}
                setParentValue={(value) => {
                  validateGrades('min_alt_grade', value.toString())
                }}
                sx={{ m: 0 }}
                defaultValue={values?.min_alt_grade}
                error={{ error: touched.min_alt_grade && !!errors.min_alt_grade, errorMsg: '' }}
              />
              <Subtitle sx={editCourseClasses.formError}>{touched.min_alt_grade && errors.min_alt_grade}</Subtitle>
            </Grid>
            <Grid item xs={6}>
              <DropDown
                dropDownItems={gradeOptions}
                placeholder='Alternative Maximum'
                labelTop
                auto={false}
                setParentValue={(value) => {
                  validateGrades('max_alt_grade', value.toString())
                }}
                sx={{ m: 0 }}
                defaultValue={values?.max_alt_grade}
                error={{ error: touched.max_alt_grade && !!errors.max_alt_grade, errorMsg: '' }}
              />
              <Subtitle sx={editCourseClasses.formError}>{touched.max_alt_grade && errors.max_alt_grade}</Subtitle>
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
                <Typography sx={{ fontSize: '18px', fontWeight: '700', mb: 1 }}>Reduce Funds Notification</Typography>
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
              <TextField
                name='limit'
                label='Limit'
                placeholder='Entry'
                type='number'
                fullWidth
                value={values?.limit || ''}
                onChange={(e) => {
                  setFieldValue('limit', Number(e.target.value) || '')
                }}
                error={touched.limit && !!errors.limit}
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
              <Subtitle sx={editCourseClasses.formError}>{touched.price && errors.price}</Subtitle>
            </Grid>
            <Grid item xs={12}>
              <CourseTitles schoolYearId={schoolYearId} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {showGradeError && (
        <WarningModal
          title='Error'
          subtitle='The Minimum Grade Level must be less than the Maximum Grade Level.'
          btntitle='Ok'
          handleModem={() => setShowGradeError(false)}
          handleSubmit={() => setShowGradeError(false)}
          textCenter={true}
        />
      )}
      {showAltGradeError && (
        <WarningModal
          title='Error'
          subtitle='The Minimum Alternative Grade Level must be less than the Maximum Alternative Grade Level.'
          btntitle='Ok'
          handleModem={() => setShowAltGradeError(false)}
          handleSubmit={() => setShowAltGradeError(false)}
          textCenter={true}
        />
      )}
    </Box>
  )
}

export default CourseForm
