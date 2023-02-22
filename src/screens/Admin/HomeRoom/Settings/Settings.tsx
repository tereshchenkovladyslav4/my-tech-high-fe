import React, { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { Alert, AlertColor, Button, Checkbox, TextField, InputAdornment, Typography, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import { useFormik } from 'formik'
import { map } from 'lodash'
import { Prompt } from 'react-router-dom'
import * as yup from 'yup'
import { CommonSelect } from '@mth/components/CommonSelect'
import { DropDown } from '@mth/components/DropDown/DropDown'
import PageHeader from '@mth/components/PageHeader'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, MthRoute, HomeroomSettings } from '@mth/enums'
import { saveHomeroomSettingMutation } from '@mth/graphql/mutation/homeroom-settings'
import { getHomeroomSettingBySchoolYearIdQuery } from '@mth/graphql/queries/homeroom-settings'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { HomeroomSettingsModel } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { useStyles } from './styles'

type openAlertSaveType = {
  message: string
  status: AlertColor
  open: boolean
}

const Settings: React.FC = () => {
  const { me } = useContext(UserContext)
  const [gradeSubject, setGradeSubject] = useState<string>()
  const [displayStudent, setDisplayStudent] = useState<string>()
  const [customBuilt, setCustomBuilt] = useState<string>()
  const [splitEnrollment, setSplitEnrollment] = useState<string>()
  const [specialEdStatus, setSpecialEdStatus] = useState<boolean>(false)
  const [diplomaStatus, setDiplomaStatus] = useState<boolean>(false)
  const [hasChange, setChanged] = useState<boolean>(false)
  const [homeroomSettings, setHomeroomSettings] = useState<HomeroomSettingsModel>()
  const [openSaveAlert, setOpenSaveAlert] = useState<openAlertSaveType>({
    message: '',
    status: 'success',
    open: false,
  })
  const [enabledGradesSubjects, setEnabledGradesSubjects] = useState<{ id: number; subject?: string }[]>()
  const [addedPercentageItems, setAddedPercentagesItems] = useState<{ id: number; percentage?: string }[]>()

  const styles = useStyles
  const {
    dropdownItems: schoolYearDropdownItems,
    schoolYears: schoolYears,
    selectedYearId,
    setSelectedYearId,
  } = useSchoolYearsByRegionId(me?.selectedRegionId)

  const { loading, data, refetch } = useQuery(getHomeroomSettingBySchoolYearIdQuery, {
    variables: {
      schoolYearId: selectedYearId,
    },
    skip: !selectedYearId,
    fetchPolicy: 'network-only',
  })

  const [saveHomeroomSetting] = useMutation(saveHomeroomSettingMutation)

  const enabledOptions = [
    {
      label: 'Yes',
      value: 'yes',
    },
    {
      label: 'No',
      value: 'no',
    },
  ]
  const gradesSubjectOptions = [
    {
      label: 'Enabled',
      value: 'enabled',
    },
    {
      label: 'Disabled',
      value: 'disabled',
    },
  ]

  const validationSchema = yup.object({
    days_to_submit_early: yup.number().required('Required'),
    max_of_excused_learning_logs_allowed: yup.number().required('Required'),
    grading_scale_percentage: yup.number().required('Required'),
    passing_average: yup.number().required('Required'),
    grades_by_subject: yup.string().required('Required').nullable(),
    notify_when_graded: yup.string().required('Required').nullable(),
    update_required_schedule_to_submit: yup.string().required('Required').nullable(),
    notify_when_resubmit_required: yup.string().required('Required').nullable(),
    gender: yup.boolean().nullable(),
    special_education: yup.boolean().nullable(),
    diploma: yup.boolean().nullable(),
    zero_count: yup.boolean().nullable(),
  })

  const formik = useFormik({
    initialValues: {
      days_to_submit_early: homeroomSettings?.days_to_submit_early,
      max_of_excused_learning_logs_allowed: homeroomSettings?.max_of_excused_learning_logs_allowed,
      grading_scale_percentage: homeroomSettings?.grading_scale_percentage,
      passing_average: homeroomSettings?.passing_average,
      grades_by_subject: gradeSubject,
      notify_when_graded: displayStudent,
      update_required_schedule_to_submit: customBuilt,
      notify_when_resubmit_required: splitEnrollment,
      gender: false,
      special_education: false,
      diploma: false,
      zero_count: false,
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      await handleSubmit()
    },
    enableReinitialize: true,
  })

  const handleSubmit = async () => {
    const response = await saveHomeroomSetting({
      variables: {
        createHomeroomSettingInput: {
          id: homeroomSettings?.id || 0,
          SchoolYearId: Number(selectedYearId),
          days_to_submit_early: Number(formik?.values?.days_to_submit_early),
          diploma: formik?.values?.diploma,
          gender: formik?.values?.gender,
          grades_by_subject: formik?.values?.grades_by_subject == 'enabled' ? true : false,
          grading_scale_percentage: Number(formik?.values?.grading_scale_percentage),
          max_of_excused_learning_logs_allowed: Number(formik?.values?.max_of_excused_learning_logs_allowed),
          notify_when_graded: formik?.values?.notify_when_graded == 'yes' ? true : false,
          notify_when_resubmit_required: formik?.values?.notify_when_resubmit_required == 'yes' ? true : false,
          passing_average: Number(formik?.values?.passing_average),
          special_education: formik?.values?.special_education,
          update_required_schedule_to_submit:
            formik?.values?.update_required_schedule_to_submit == 'yes' ? true : false,
          zero_count: formik?.values?.zero_count,
        },
      },
    })
    if (response) refetch()
  }

  const homeroomSettingsItems = [
    {
      name: HomeroomSettings.DAY_TO_SUBMIT,
      component: (
        <Box display='flex'>
          <TextField
            type='number'
            placeholder='Entry'
            sx={{ width: '200px' }}
            value={homeroomSettings?.days_to_submit_early}
            onChange={(e) => {
              formik.setFieldValue('days_to_submit_early', e.target.value)
              if (e.target.value) {
                setChanged(true)
              } else {
                setChanged(false)
              }
            }}
          />
        </Box>
      ),
    },
    {
      name: HomeroomSettings.DISPLAY_STUDENT,
      component: (
        <Box display='flex'>
          <Box display='flex' alignItems='center'>
            <Checkbox
              name='gender'
              checked={formik.values.gender}
              onClick={(e) => {
                const checkedValue = (e as unknown as React.ChangeEvent<HTMLInputElement>).target.checked
                setChanged(true)
                formik.setFieldValue('gender', checkedValue)
              }}
            />
            <Paragraph size={'large'} color={MthColor.SYSTEM_01}>
              Gender
            </Paragraph>
          </Box>
          <Box display='flex' alignItems='center' sx={{ ml: { xs: 0, lg: 3, xl: 9 } }}>
            <Checkbox
              name='special_education'
              checked={formik.values.special_education}
              sx={{ color: specialEdStatus ? MthColor.BLACK_GRADIENT : MthColor.GRAY }}
              onClick={(e) => {
                const checkedValue = (e as unknown as React.ChangeEvent<HTMLInputElement>).target.checked
                setChanged(true)
                formik.setFieldValue('special_education', checkedValue)
              }}
            />
            <Paragraph size={'large'} color={specialEdStatus ? MthColor.SYSTEM_01 : MthColor.GRAY}>
              Special Education Status
            </Paragraph>
          </Box>
          <Box display='flex' alignItems='center' sx={{ ml: { xs: 0, lg: 3, xl: 9 } }}>
            <Checkbox
              name='diploma'
              checked={formik.values.diploma}
              sx={{ color: diplomaStatus ? MthColor.BLACK_GRADIENT : MthColor.GRAY }}
              onClick={(e) => {
                const checkedValue = (e as unknown as React.ChangeEvent<HTMLInputElement>).target.checked
                setChanged(true)
                formik.setFieldValue('diploma', checkedValue)
              }}
            />
            <Paragraph size={'large'} color={diplomaStatus ? MthColor.SYSTEM_01 : MthColor.GRAY}>
              Diploma-seeking Status
            </Paragraph>
          </Box>
        </Box>
      ),
    },
    {
      name: HomeroomSettings.SCHEDULE_TO_SUBMIT,
      component: (
        <DropDown
          defaultValue={customBuilt}
          name='schedule_to_submit'
          sx={styles.dropdownWrapper}
          dropDownItems={enabledOptions}
          placeholder='Select'
          placeholderColor={MthColor.BLACK}
          setParentValue={(id) => {
            setChanged(true)
            formik.setFieldValue('update_required_schedule_to_submit', id)
          }}
          error={{
            error:
              !!formik.errors.update_required_schedule_to_submit && formik.touched.update_required_schedule_to_submit,
            errorMsg: (formik.touched.update_required_schedule_to_submit &&
              formik.errors.update_required_schedule_to_submit) as string,
          }}
        />
      ),
    },
    {
      name: HomeroomSettings.NOTIFY_WHEN_RESUBMIT,
      component: (
        <Box display={'flex'} flexDirection='row' alignItems='center' sx={{ width: '100%' }}>
          <DropDown
            defaultValue={splitEnrollment}
            name='notify_when_resubmit_required'
            sx={styles.dropdownWrapper}
            dropDownItems={enabledOptions}
            placeholder='Select'
            placeholderColor={MthColor.BLACK}
            setParentValue={(id) => {
              setChanged(true)
              formik.setFieldValue('notify_when_resubmit_required', id)
              if (id === 'Disabled') {
                formik.setFieldValue('always_unlock', false)
              }
            }}
            error={{
              error: !!formik.errors.notify_when_resubmit_required && formik.touched.notify_when_resubmit_required,
              errorMsg: (formik.touched.notify_when_resubmit_required &&
                formik.errors.notify_when_resubmit_required) as string,
            }}
          />
        </Box>
      ),
    },

    {
      name: HomeroomSettings.NOTIFY_WHEN_GRADED,
      component: (
        <DropDown
          defaultValue={displayStudent}
          name='notify_when_graded'
          sx={styles.dropdownWrapper}
          dropDownItems={enabledOptions}
          placeholder='Select'
          placeholderColor={MthColor.BLACK}
          setParentValue={(id) => {
            setChanged(true)
            formik.setFieldValue('notify_when_graded', id)
          }}
          error={{
            error: !!formik.errors.notify_when_graded && formik.touched.notify_when_graded,
            errorMsg: (formik.touched.notify_when_graded && formik.errors.notify_when_graded) as string,
          }}
        />
      ),
    },
    {
      name: HomeroomSettings.MAX_OF_EXCUSED,
      component: (
        <Box display='flex'>
          <TextField
            type='number'
            placeholder='Entry'
            onChange={(e) => {
              formik.setFieldValue('max_of_excused_learning_logs_allowed', e.target.value)
              if (e.target.value) {
                setChanged(true)
              } else {
                setChanged(false)
              }
            }}
            sx={{ width: '200px' }}
          />
        </Box>
      ),
    },
    {
      name: HomeroomSettings.GRADING_SCALE,
      component: (
        <Box display='flex' sx={{ gap: '32px' }}>
          <Box textAlign='left'>
            <TextField
              type='number'
              label='Percentage'
              placeholder='Entry'
              sx={styles.outlinedTextWrapper}
              onChange={(e) => {
                formik.setFieldValue('grading_scale_percentage', e.target.value)
                if (e.target.value) {
                  setChanged(true)
                } else {
                  setChanged(false)
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <Typography color={MthColor.BLACK}>%</Typography>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            {addedPercentageItems?.map((obj, index) => {
              return (
                <Box sx={{ marginTop: '24px' }} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      type='number'
                      label='Percentage'
                      placeholder='Entry'
                      defaultValue={obj?.percentage ?? ''}
                      sx={styles.outlinedTextWrapper}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <Typography color={MthColor.BLACK}>%</Typography>
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <Box
                      onClick={() => {
                        setAddedPercentagesItems(
                          addedPercentageItems.filter((item) => Number(item.id) !== Number(obj.id)),
                        )
                      }}
                    >
                      <Tooltip title='Delete' placement='top'>
                        <DeleteForeverOutlinedIcon
                          sx={{ cursor: 'pointer', width: '70px', color: MthColor.BLACK }}
                          fontSize='medium'
                        />
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              )
            })}
            <Subtitle
              size={16}
              fontWeight='600'
              color={MthColor.MTHBLUE}
              textAlign='left'
              sx={{ marginTop: '18px', cursor: 'pointer' }}
              onClick={() => {
                setAddedPercentagesItems([
                  ...(addedPercentageItems ?? []),
                  { id: addedPercentageItems?.length ?? 1, percentage: '' },
                ])
              }}
            >
              + Add Percentage
            </Subtitle>
          </Box>
          <Box>
            <Box display='flex' alignItems='center' sx={{ gap: '24px' }}>
              <Subtitle size={16} fontWeight='600'>
                Passing Average
              </Subtitle>
              <TextField
                type='number'
                label='Percentage'
                placeholder='Entry'
                sx={styles.outlinedTextWrapper}
                onChange={(e) => {
                  formik.setFieldValue('passing_average', e.target.value)
                  if (e.target.value) {
                    setChanged(true)
                  } else {
                    setChanged(false)
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end' sx={{ color: MthColor.BLACK }}>
                      <Typography color={MthColor.BLACK}>%</Typography>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
            <Box display='flex' alignItems='center' sx={{ marginTop: '18px' }}>
              <Checkbox
                name='zero_count'
                checked={formik.values.zero_count}
                onClick={(e) =>
                  formik.setFieldValue(
                    'zero_count',
                    (e as unknown as React.ChangeEvent<HTMLInputElement>).target.checked,
                  )
                }
              />
              <Paragraph size={'large'} color={MthColor.SYSTEM_01}>
                At least one Zero counts as a failing grade
              </Paragraph>
            </Box>
          </Box>
        </Box>
      ),
    },
    {
      name: HomeroomSettings.GRADES_SUBJECT,
      component: (
        <Box>
          <DropDown
            defaultValue={gradeSubject}
            name='grades_subject'
            sx={styles.dropdownWrapper}
            dropDownItems={gradesSubjectOptions}
            placeholder='Select'
            placeholderColor={MthColor.BLACK}
            setParentValue={(value) => {
              setChanged(true)
              formik.setFieldValue('grades_by_subject', value)
              if (value === 'enabled') {
                setEnabledGradesSubjects([{ id: 1, subject: '' }])
              } else {
                setEnabledGradesSubjects([])
              }
            }}
            error={{
              error: !!formik.errors.grades_by_subject && formik.touched.grades_by_subject,
              errorMsg: (formik.touched.grades_by_subject && formik.errors.grades_by_subject) as string,
            }}
          />
          {formik.values.grades_by_subject === 'enabled' &&
            enabledGradesSubjects?.map((obj, index) => {
              return (
                <Box textAlign='left' sx={{ marginTop: '24px' }} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      placeholder='Entry'
                      defaultValue={obj?.subject ?? ''}
                      label='Subject'
                      sx={styles.outlinedTextWrapper}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <Box
                      onClick={() => {
                        setEnabledGradesSubjects(
                          enabledGradesSubjects.filter((item) => Number(item.id) !== Number(obj.id)),
                        )
                      }}
                    >
                      <Tooltip title='Delete' placement='top'>
                        <DeleteForeverOutlinedIcon
                          sx={{ cursor: 'pointer', width: '70px', color: MthColor.BLACK }}
                          fontSize='medium'
                        />
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              )
            })}
          {formik.values.grades_by_subject === 'enabled' && (
            <Subtitle
              size={16}
              fontWeight='600'
              color={MthColor.MTHBLUE}
              textAlign='left'
              sx={{ marginTop: '18px', cursor: 'pointer' }}
              onClick={() => {
                setEnabledGradesSubjects([
                  ...(enabledGradesSubjects ?? []),
                  { id: enabledGradesSubjects?.length ? enabledGradesSubjects.length + 1 : 1, subject: '' },
                ])
              }}
            >
              + Add Subject
            </Subtitle>
          )}
        </Box>
      ),
    },
  ]

  useEffect(() => {
    if (selectedYearId) {
      const selectedSchoolYear = schoolYears.find((s) => s.school_year_id === selectedYearId)
      setDiplomaStatus(selectedSchoolYear?.diploma_seeking ?? true)
      setSpecialEdStatus(selectedSchoolYear?.special_ed ?? true)
    } else {
      setGradeSubject(undefined)
      setDisplayStudent(undefined)
      setCustomBuilt(undefined)
      setSplitEnrollment(undefined)
    }
  }, [me?.selectedRegionId, selectedYearId])

  useEffect(() => {
    if (!loading && data?.homeroomSettingBySchoolYearId) {
      setHomeroomSettings(data?.homeroomSettingBySchoolYearId?.at(0))
    }
  }, [loading, data])

  return (
    <form onSubmit={formik.handleSubmit} style={{ height: '100%' }}>
      <Box sx={styles.baseSettings}>
        <PageHeader title='Homeroom Settings' to={MthRoute.HOMEROOM}>
          <Button
            variant='contained'
            type='submit'
            onSubmit={() => {
              formik.handleSubmit()
            }}
            sx={{
              background: MthColor.BUTTON_LINEAR_GRADIENT,
              borderRadius: 10,
              width: 100,
            }}
          >
            Save
          </Button>
        </PageHeader>
        <Box sx={{ marginTop: '28px', marginBottom: '20px' }}>
          <DropDown
            dropDownItems={schoolYearDropdownItems}
            placeholder={'Select Year'}
            defaultValue={selectedYearId || 0}
            borderNone={true}
            setParentValue={(val) => {
              setSelectedYearId(+val)
            }}
          />
        </Box>
        {map(homeroomSettingsItems, (item, index) => (
          <Box key={item.name} sx={{ width: '100%' }}>
            <CommonSelect
              key={index}
              index={index}
              selectItem={item}
              verticalDividHeight={
                item.name === HomeroomSettings.GRADING_SCALE
                  ? `${addedPercentageItems ? addedPercentageItems.length * 80 + 100 : 120}px`
                  : item.name === HomeroomSettings.GRADES_SUBJECT
                  ? formik.values.grades_by_subject === 'enabled'
                    ? `${enabledGradesSubjects && enabledGradesSubjects.length * 80 + 100}px`
                    : '50px'
                  : '50px'
              }
              titleWidth='32px'
            />
          </Box>
        ))}
        {openSaveAlert.open && (
          <Alert
            sx={{
              width: '100%',
            }}
            onClose={() => {
              setOpenSaveAlert({ open: false, status: 'success', message: '' })
            }}
            severity={openSaveAlert.status}
          >
            {openSaveAlert.message}
          </Alert>
        )}

        <Prompt
          when={hasChange ? true : false}
          message={JSON.stringify({
            header: 'Unsaved Changes',
            content: 'Are you sure you want to leave without saving changes?',
          })}
        />
      </Box>
    </form>
  )
}

export default Settings
