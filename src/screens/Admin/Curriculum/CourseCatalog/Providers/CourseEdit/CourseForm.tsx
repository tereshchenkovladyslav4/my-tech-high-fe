import React from 'react'
import { Box, Grid, TextField, Typography } from '@mui/material'
import { useFormikContext } from 'formik'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { DIPLOMA_SEEKING_PATH_ITEMS, REDUCE_FUNDS_ITEMS } from '@mth/constants'
import { ReduceFunds } from '@mth/enums'
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
  const { errors, handleChange, setFieldValue, touched, values } = useFormikContext<Course>()

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
                setParentValue={(value) => {
                  setFieldValue('min_grade', value)
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
                setParentValue={(value) => {
                  setFieldValue('max_grade', value)
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
                setParentValue={(value) => {
                  setFieldValue('min_alt_grade', value)
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
                setParentValue={(value) => {
                  setFieldValue('max_alt_grade', value)
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
                <Typography sx={{ fontSize: '18px', fontWeight: '700', mb: 1 }}>Course Notification</Typography>
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
    </Box>
  )
}

export default CourseForm
