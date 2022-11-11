import React, { FunctionComponent, useState, useMemo, useCallback, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { withStyles } from '@material-ui/core/styles'
import { DeleteForeverOutlined } from '@mui/icons-material'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import CreateIcon from '@mui/icons-material/Create'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Grid,
  FormControlLabel,
  Checkbox,
  TextField,
  MenuItem,
  FormHelperText,
  Card,
  Modal,
} from '@mui/material'
import { ContentState, EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { useFormik } from 'formik'
import htmlToDraft from 'html-to-draftjs'
import { capitalize } from 'lodash'
import Wysiwyg from 'react-draft-wysiwyg'
import { useSetRecoilState } from 'recoil'
import * as Yup from 'yup'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthNumberInput } from '@mth/components/MthNumberInput'
import PageHeader from '@mth/components/PageHeader'
import CustomTable from '@mth/components/Table/CustomTable'
import { Field } from '@mth/components/Table/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { MthColor } from '@mth/enums'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { loadingState } from '@mth/providers/Store/State'
import { getPeriods, upsertPeriod, periodArchive, deletePeriodsByIds } from '@mth/screens/Admin/Curriculum/services'
import { ordinalSuffixOf } from '@mth/utils'
import { useStyles } from '../../styles'
import { PeriodItem, SEMESTER_TYPE, REDUCE_FUNDS_TYPE, OptionType, SEMESTER_MESSAGE } from '../../types'
import { SaveCancelComponent } from '../Components/SaveCancelComponent'
import Filter from './Filter'

// validation message
Yup.setLocale({
  mixed: {
    required: 'Required',
  },
})
const initialEditorState = EditorState.createWithContent(ContentState.createFromText(''))

const CssTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderWidth: '1px !important',
        borderColor: 'black',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#333333',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#333333',
    },
  },
})(TextField)

const Periods: FunctionComponent = () => {
  const classes = useStyles
  const setLoading = useSetRecoilState(loadingState)
  const {
    loading: yearLoading,
    selectedYearId,
    setSelectedYearId,
    selectedYear: schoolYearData,
    dropdownItems: schoolYearDropdownItems,
  } = useSchoolYearsByRegionId()
  // Modal for Archive, Unarchive, Delete
  const [modalWarning, setModalWarning] = useState<'delete' | 'unarchive' | 'archive' | ''>('')
  const [modalErrorGradeValidation, setModalErrorGradeValidation] = useState<boolean>(false)
  const [temp, setTemp] = useState<PeriodItem>()
  // Create / Update
  const [open, setOpen] = useState<boolean>(false)
  // Html Editor
  const [editorStatePeriod, setEditorStatePeriod] = useState(initialEditorState)
  const [editorStateSemester, setEditorStateSemester] = useState(initialEditorState)

  const [items, setItems] = useState<Array<PeriodItem>>([])
  // Filter Box
  const [query, setQuery] = useState({
    keyword: '',
    archived: false,
  })

  const setFilter = (field: string, value: string | boolean) => {
    setQuery({
      ...query,
      [field]: value,
    })
  }
  // --------------------------------------------- mutations periods
  const [apiUpsertPeriod] = useMutation(upsertPeriod)
  const [apiPeriodArchive] = useMutation(periodArchive)
  const [apiDeletePeriodsByIds] = useMutation(deletePeriodsByIds)
  // --------------------------------------------- query periods
  const {
    loading,
    data: periods,
    refetch: refetchPeriod,
  } = useQuery(getPeriods, {
    variables: {
      school_year_id: selectedYearId ? +selectedYearId : 0,
      keyword: query.keyword,
      archived: query.archived,
    },
    skip: !selectedYearId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    setItems(periods?.periods || [])
  }, [periods])

  const grades: string[] = useMemo(() => {
    return (
      schoolYearData?.grades
        ?.split(',')
        .sort((a: string, b: string) => (parseInt(a) > parseInt(b) ? 1 : -1))
        .sort((a: string) => (a === 'Kindergarten' ? -1 : 0)) || []
    )
  }, [schoolYearData])

  const gradeList: OptionType[] = useMemo(
    () =>
      grades.map(
        (value: string): OptionType => ({
          label: ordinalSuffixOf(value) + ' Grade',
          value,
        }),
      ),
    [grades],
  )

  // count of Max period
  const maxPeriodCount: number = useMemo(() => {
    return schoolYearData?.ScheduleBuilder?.max_num_periods || 0
  }, [schoolYearData])

  // open modals
  const handleArchiveModal = (item: PeriodItem) => {
    setTemp(item)
    setModalWarning(item.archived ? 'unarchive' : 'archive')
  }

  const handleDeleteModal = (item: PeriodItem) => {
    setTemp(item)
    setModalWarning('delete')
  }
  // toggle archived, delete item
  const handleArchiveOrDelete = async () => {
    if (!temp) return
    else {
      setLoading(true)
      if (modalWarning === 'delete') {
        await apiDeletePeriodsByIds({
          variables: {
            ids: [temp.id],
          },
        })
          .then(({ data }) => {
            setLoading(false)
            if (data?.periodDeleteByIds?.affected && data.periodDeleteByIds.affected > 0) {
              setItems(items.filter((el) => el.id !== temp.id))
            }
          })
          .catch(() => {
            setLoading(false)
          })
      } else {
        // toggle archived
        await apiPeriodArchive({
          variables: {
            id: temp.id,
            archived: !temp.archived,
          },
        })
          .then(() => {
            setLoading(false)
            setItems(items.filter((el) => el.id !== temp.id))
          })
          .catch(() => {
            setLoading(false)
          })
      }
    }
    setModalWarning('')
  }

  // create / update
  const handleSubmit = useCallback(
    (values) => {
      if (selectedYearId) {
        const variables = { school_year_id: +selectedYearId, ...values }
        if (variables.reduce_funds === REDUCE_FUNDS_TYPE.NONE) {
          variables.price = 0
        }
        if (values.notify_period) {
          variables.message_period = draftToHtml(convertToRaw(editorStatePeriod.getCurrentContent()))
        }
        if (values.notify_semester && values.semester !== SEMESTER_TYPE.NONE) {
          variables.message_semester = draftToHtml(convertToRaw(editorStateSemester.getCurrentContent()))
        }
        if (temp?.id) variables.id = temp.id
        if (variables.price === '') delete variables.price
        setLoading(true)
        apiUpsertPeriod({
          variables: {
            PeriodInput: variables,
          },
        })
          .then(() => {
            setOpen(false)
            refetchPeriod()
            setFilter('archived', false)
          })
          .finally(() => {
            setLoading(false)
          })
      }
    },
    [editorStatePeriod, editorStateSemester, selectedYearId, temp],
  )

  const initialValues: PeriodItem = {
    period: 0,
    category: '',
    grade_level_min: '',
    grade_level_max: '',
    reduce_funds: REDUCE_FUNDS_TYPE.NONE,
    price: '',
    semester: SEMESTER_TYPE.NONE,
    message_period: '',
    message_semester: '',
    notify_semester: false,
    notify_period: false,
  }
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      period: Yup.number().required().min(1, 'Required'),
      category: Yup.string().required(),
      grade_level_max: Yup.string().required(),
      grade_level_min: Yup.string().required(),
      notify_semester: Yup.boolean(),
      notify_period: Yup.boolean(),
      message_period: Yup.string().when('notify_period', {
        is: true,
        then: Yup.string()
          .required()
          .test('html_content', 'Required', () => editorStatePeriod.getCurrentContent().hasText()),
      }),
      message_semester: Yup.string().when('notify_semester', {
        is: true,
        then: Yup.string()
          .required()
          .test('html_content', 'Required', () => editorStateSemester.getCurrentContent().hasText()),
      }),
      price: Yup.number()
        .when(['reduce_funds'], {
          is: (reduce_funds: REDUCE_FUNDS_TYPE) => reduce_funds !== REDUCE_FUNDS_TYPE.NONE,
          then: Yup.number().required('Required').positive('Should be greater than 0').nullable(),
        })
        .nullable(),
    }),
    onSubmit: async (values) => {
      handleSubmit(values)
    },
  })

  const handleCreateModal = () => {
    setTemp(undefined)
    setEditorStatePeriod(initialEditorState)
    setEditorStateSemester(initialEditorState)
    formik.resetForm()
    setOpen(true)
  }

  const handleEditModal = (item: PeriodItem) => {
    formik.resetForm()
    setTemp(item)
    formik.setValues({
      period: item.period,
      category: item.category,
      grade_level_min: item.grade_level_min,
      grade_level_max: item.grade_level_max,
      reduce_funds: item.reduce_funds,
      semester: item.semester,
      price: item.price || '',
      message_period: item.message_period,
      message_semester: item.message_semester,
      notify_semester: item.notify_semester,
      notify_period: item.notify_period,
    })

    if (item.message_period) {
      const contentBlock = htmlToDraft(item.message_period)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        setEditorStatePeriod(editorState)
      }
    } else {
      setEditorStatePeriod(initialEditorState)
    }
    if (item.message_semester) {
      const contentBlock = htmlToDraft(item.message_semester)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        setEditorStateSemester(editorState)
      }
    } else {
      setEditorStateSemester(initialEditorState)
    }
    setOpen(true)
  }

  const handleEditorChangePeriod = async (state: EditorState) => {
    await Promise.all([setEditorStatePeriod(state)]).then(() => {
      // prevent slow editing due to formik validation
      const content = state.getCurrentContent()
      const message = draftToHtml(convertToRaw(content))
      if (message !== formik.values.message_period) {
        if (!content.hasText()) formik.setFieldValue('message_period', '')
        else if (formik.values.message_period !== 'html') formik.setFieldValue('message_period', 'html')
      }
    })
  }

  const handleEditorChangeSemester = async (state: EditorState) => {
    await Promise.all([setEditorStateSemester(state)]).then(() => {
      // prevent slow editing due to formik validation
      const content = state.getCurrentContent()
      const message = draftToHtml(convertToRaw(content))
      if (message !== formik.values.message_semester) {
        if (!content.hasText()) formik.setFieldValue('message_semester', '')
        else if (formik.values.message_semester !== 'html') formik.setFieldValue('message_semester', 'html')
      }
    })
  }

  // Validation min - max grade levels
  const validateGrade = (gradeMin: string, gradeMax: string) => {
    const indexMin = grades.findIndex((el) => el === gradeMin)
    const indexMax = grades.findIndex((el) => el === gradeMax)
    if (indexMin <= indexMax || indexMax === -1) {
      setModalErrorGradeValidation(false)
      return true
    } else {
      setModalErrorGradeValidation(true)
      return false
    }
  }
  // Grade Level Max
  const handleGradeLevelMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGradeMin = e.target.value
    const isValidateGrade = validateGrade(newGradeMin, formik.values.grade_level_max)
    if (isValidateGrade) {
      formik.handleChange(e)
    }
  }
  // Grade Level Max
  const handleGradeLevelMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGradeMax = e.target.value
    const isValidateGrade = validateGrade(formik.values.grade_level_min, newGradeMax)
    if (isValidateGrade) {
      formik.handleChange(e)
    }
  }

  const fields: Field<PeriodItem>[] = [
    {
      key: 'period',
      label: 'Period',
      sortable: false,
      thClass: 'w-28',
    },
    {
      key: 'grade',
      label: 'Grades',
      sortable: false,
      thClass: 'w-31',
      formatter: (item) =>
        item.grade_level_min === item.grade_level_max
          ? item.grade_level_min === 'Kindergarten'
            ? 'K'
            : item.grade_level_min
          : `${item.grade_level_min === 'Kindergarten' ? 'K' : item.grade_level_min} - ${
              item.grade_level_max === 'Kindergarten' ? 'K' : item.grade_level_max
            }`,
    },
    {
      key: 'category',
      label: 'Category',
      sortable: false,
      thClass: 'w-37',
    },
    {
      key: 'semester',
      label: '2nd Semester',
      sortable: false,
      thClass: '',
      formatter: (item) => SEMESTER_MESSAGE[item.semester],
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      thClass: 'w-31',
      formatter: (item) => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'}>
            {item.archived ? (
              <IconButton disabled>
                <CreateIcon />
              </IconButton>
            ) : (
              <IconButton onClick={() => handleEditModal(item)}>
                <Tooltip title='Edit' color='primary' placement='top'>
                  <CreateIcon />
                </Tooltip>
              </IconButton>
            )}
            <IconButton onClick={() => handleArchiveModal(item)} color='primary' sx={{ mr: item.archived ? 0 : 5 }}>
              <Tooltip title={item.archived ? 'Unarchive' : 'Archive'} placement='top'>
                {item.archived ? <CallMissedOutgoingIcon /> : <SystemUpdateAltRoundedIcon />}
              </Tooltip>
            </IconButton>

            {item.archived && (
              <IconButton onClick={() => handleDeleteModal(item)}>
                <Tooltip title='Delete' color='primary' placement='top'>
                  <DeleteForeverOutlined />
                </Tooltip>
              </IconButton>
            )}
          </Box>
        )
      },
    },
  ]

  return (
    <Box sx={{ p: 4, textAlign: 'left' }}>
      <Card
        sx={{
          p: 4,
          borderRadius: '12px',
          boxShadow: '0px 0px 35px rgba(0, 0, 0, 0.05)',
          minHeight: 'calc(100vh - 150px)',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <PageHeader title='Periods' to='/curriculum/course-catalog'>
            <DropDown
              dropDownItems={schoolYearDropdownItems}
              placeholder={'Select Year'}
              defaultValue={selectedYearId}
              borderNone={true}
              setParentValue={(val) => setSelectedYearId(Number(val))}
            />
          </PageHeader>
        </Box>

        <Filter query={query} setValue={setFilter} />

        <Box>
          <CustomTable
            items={items}
            loading={loading || yearLoading}
            fields={fields}
            striped
            size='lg'
            isEmptyText={false}
            borderedLeft
          />
        </Box>

        {!query.archived && (
          <Box sx={{ mt: 4, textAlign: 'left' }}>
            <Button
              variant='contained'
              onClick={handleCreateModal}
              disableElevation
              sx={classes.addButton}
              size='large'
              className='bg-gradient'
            >
              + Add Period
            </Button>
          </Box>
        )}
      </Card>

      <Modal
        open={open}
        aria-labelledby='child-modal-title'
        disableAutoFocus={true}
        aria-describedby='child-modal-description'
      >
        <form onReset={formik.handleReset} onSubmit={formik.handleSubmit}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '630px',
              height: 'auto',
              bgcolor: 'white',
              borderRadius: 2,
              p: 6,
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <Grid container rowSpacing={3} columnSpacing={4} sx={classes.form}>
              <Grid item xs={12} sm={6}>
                <CssTextField
                  name='period'
                  label='Period'
                  placeholder='Period'
                  fullWidth
                  value={formik.values.period}
                  onChange={(e) => {
                    formik.handleChange(e)
                  }}
                  error={formik.touched.period && !!formik.errors.period}
                  helperText={formik.touched.period && formik.errors.period}
                  InputLabelProps={{ shrink: true, sx: classes.textLabel }}
                  select
                  disabled={!!temp?.id}
                  defaultValue=''
                >
                  {[...Array(maxPeriodCount)].map((vv, ii) => (
                    <MenuItem key={`${ii}_${vv}`} value={ii + 1}>
                      {ii + 1}
                    </MenuItem>
                  ))}
                  {!maxPeriodCount && (
                    <MenuItem key='none' value='' disabled>
                      None
                    </MenuItem>
                  )}
                </CssTextField>
              </Grid>
              <Grid item xs={12}>
                <CssTextField
                  name='category'
                  label='Category'
                  placeholder='Category'
                  fullWidth
                  value={formik.values.category}
                  onChange={(e) => {
                    formik.handleChange(e)
                  }}
                  error={formik.touched.category && !!formik.errors.category}
                  helperText={formik.touched.category && formik.errors.category}
                  InputLabelProps={{ shrink: true, sx: classes.textLabel }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CssTextField
                  name='grade_level_min'
                  label='Minimum Grade Level'
                  placeholder='Minimum Grade Level'
                  fullWidth
                  value={formik.values.grade_level_min}
                  onChange={handleGradeLevelMin}
                  error={formik.touched.grade_level_min && !!formik.errors.grade_level_min}
                  helperText={formik.touched.grade_level_min && formik.errors.grade_level_min}
                  InputLabelProps={{ shrink: true, sx: classes.textLabel }}
                  SelectProps={{ displayEmpty: true }}
                  select
                >
                  {gradeList.map((option) => (
                    <MenuItem key={`min_${option.value}`} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </CssTextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CssTextField
                  name='grade_level_max'
                  label='Maximum Grade Level'
                  placeholder='Maximum Grade Level'
                  fullWidth
                  value={formik.values.grade_level_max}
                  onChange={handleGradeLevelMax}
                  onBlur={formik.handleBlur}
                  error={formik.touched.grade_level_max && !!formik.errors.grade_level_max}
                  helperText={formik.touched.grade_level_max && formik.errors.grade_level_max}
                  InputLabelProps={{ shrink: true, sx: classes.textLabel }}
                  SelectProps={{ displayEmpty: true }}
                  select
                >
                  {gradeList.map((option) => (
                    <MenuItem key={`max_${option.value}`} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </CssTextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CssTextField
                  name='reduce_funds'
                  label='Reduce Funds'
                  placeholder='Reduce Funds'
                  fullWidth
                  value={formik.values.reduce_funds}
                  onChange={(e) => {
                    if (e.target.value === REDUCE_FUNDS_TYPE.NONE) formik.setFieldValue('price', '')
                    formik.handleChange(e)
                  }}
                  error={formik.touched.reduce_funds && !!formik.errors.reduce_funds}
                  helperText={formik.touched.reduce_funds && formik.errors.reduce_funds}
                  InputLabelProps={{ shrink: true, sx: classes.textLabel }}
                  SelectProps={{ displayEmpty: true }}
                  select
                >
                  {[
                    { label: 'None', value: REDUCE_FUNDS_TYPE.NONE },
                    { label: 'Supplemental Learning Funds', value: REDUCE_FUNDS_TYPE.SUPPLEMENTAL },
                    { label: 'Technology Allowance', value: REDUCE_FUNDS_TYPE.TECHNOLOGY },
                  ].map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </CssTextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MthNumberInput
                  numberType='price'
                  label='Price'
                  placeholder='Entry'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  className='MthFormField'
                  value={formik.values?.price}
                  onChangeValue={(value: number | null) => {
                    formik.setFieldValue('price', value)
                  }}
                  error={formik.touched.price && !!formik.errors.price}
                  disabled={formik.values?.reduce_funds === REDUCE_FUNDS_TYPE.NONE}
                />
                <Subtitle
                  sx={{
                    color: MthColor.ERROR_RED,
                    fontSize: '12px',
                    fontWeight: 400,
                    lineHeight: '20px',
                    marginLeft: '12px',
                    marginTop: '4px',
                  }}
                >
                  {formik.touched.price && formik.errors.price}
                </Subtitle>
              </Grid>
              <Grid item xs={12}>
                <CssTextField
                  name='semester'
                  label='2nd Semester Changes'
                  placeholder='2nd Semester Changes'
                  fullWidth
                  value={formik.values.semester}
                  onChange={(e) => {
                    formik.handleChange(e)
                  }}
                  error={formik.touched.semester && !!formik.errors.semester}
                  helperText={formik.touched.semester && formik.errors.semester}
                  InputLabelProps={{ shrink: true, sx: classes.textLabel }}
                  SelectProps={{ displayEmpty: true }}
                  select
                >
                  {[
                    { label: SEMESTER_MESSAGE[SEMESTER_TYPE.NONE], value: SEMESTER_TYPE.NONE },
                    { label: SEMESTER_MESSAGE[SEMESTER_TYPE.PERIOD], value: SEMESTER_TYPE.PERIOD },
                    { label: SEMESTER_MESSAGE[SEMESTER_TYPE.SUBJECT], value: SEMESTER_TYPE.SUBJECT },
                  ].map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </CssTextField>
              </Grid>

              <Grid item xs={12}>
                <Box>
                  {formik.values.semester !== SEMESTER_TYPE.NONE && (
                    <>
                      <FormControlLabel
                        sx={{ pb: 1 }}
                        control={
                          <Checkbox
                            checked={formik.values.notify_semester}
                            name='notify_semester'
                            onChange={formik.handleChange}
                          />
                        }
                        label={`Display a notification when the ${formik.values.semester.toLocaleLowerCase()} is not changed at 2nd Semester`}
                      />
                      {formik.values.notify_semester && (
                        <>
                          <Typography
                            variant='h6'
                            sx={{
                              mb: 1,
                              fontWeight: '700',
                              fontSize: '1rem',
                            }}
                            className={
                              formik.touched.message_semester && !!formik.errors.message_semester ? 'Mui-error' : ''
                            }
                          >
                            Notification Message
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Box
                              sx={{
                                border: '1px solid #d1d1d1',
                                borderRadius: 1,
                                marginBottom: '6px',
                                'div.DraftEditor-editorContainer': {
                                  minHeight: '100px',
                                  maxHeight: '200px',
                                  overflow: 'scroll',
                                  padding: 1,
                                  '.public-DraftStyleDefault-block': {
                                    margin: 0,
                                  },
                                },
                              }}
                            >
                              <Wysiwyg.Editor
                                onEditorStateChange={handleEditorChangeSemester}
                                placeholder='  Type here...'
                                editorState={editorStateSemester}
                                toolbar={{
                                  options: ['inline', 'list', 'link'],
                                  inline: {
                                    options: ['bold', 'italic'],
                                  },
                                  list: {
                                    options: ['unordered', 'ordered'],
                                  },
                                }}
                              />
                            </Box>
                            {formik.touched.message_semester && !!formik.errors.message_semester && (
                              <FormHelperText error sx={{ pl: 2 }}>
                                {formik.errors.message_semester}
                              </FormHelperText>
                            )}
                          </Box>
                        </>
                      )}
                    </>
                  )}
                </Box>
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.notify_period}
                        name='notify_period'
                        onChange={formik.handleChange}
                      />
                    }
                    label='Display a notification when this period is selected'
                  />
                  {formik.values.notify_period && (
                    <>
                      <Typography
                        variant='h6'
                        sx={{
                          mb: 1,
                          fontWeight: '700',
                          fontSize: '1rem',
                        }}
                        className={formik.touched.message_period && !!formik.errors.message_period ? 'Mui-error' : ''}
                      >
                        Notification Message
                      </Typography>
                      <Box>
                        <Box
                          sx={{
                            border: '1px solid #d1d1d1',
                            borderRadius: 1,
                            marginBottom: '6px',
                            'div.DraftEditor-editorContainer': {
                              minHeight: '100px',
                              maxHeight: '200px',
                              overflow: 'scroll',
                              padding: 1,
                              '.public-DraftStyleDefault-block': {
                                margin: 0,
                              },
                            },
                          }}
                        >
                          <Wysiwyg.Editor
                            onEditorStateChange={handleEditorChangePeriod}
                            placeholder='  Type here...'
                            editorState={editorStatePeriod}
                            toolbar={{
                              options: ['inline', 'list', 'link'],
                              inline: {
                                options: ['bold', 'italic'],
                              },
                              list: {
                                options: ['unordered', 'ordered'],
                              },
                            }}
                          />
                        </Box>
                        {formik.touched.message_period && !!formik.errors.message_period && (
                          <FormHelperText error sx={{ pl: 2 }}>
                            {formik.errors.message_period}
                          </FormHelperText>
                        )}
                      </Box>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
            <SaveCancelComponent isSubmitted={false} handleCancel={() => setOpen(false)} />
          </Box>
        </form>
      </Modal>

      {!!modalWarning && (
        <WarningModal
          handleModem={() => setModalWarning('')}
          title={modalWarning}
          btntitle={capitalize(modalWarning)}
          subtitle={`Are you sure you want to ${modalWarning} this Period?`}
          handleSubmit={handleArchiveOrDelete}
          canceltitle='Cancel'
          classNameBtnOk='bg-gradient-dark'
          className='custom-modal'
        >
          {modalWarning === 'delete' && (
            <Typography
              fontWeight='600'
              fontSize={14}
              align='center'
              sx={{ marginLeft: '-10px', marginRight: '-10px' }}
            >
              Doing so will remove it from any student&lsquo;s schedule for this year.
            </Typography>
          )}
        </WarningModal>
      )}

      {!!modalErrorGradeValidation && (
        <WarningModal
          handleModem={() => setModalErrorGradeValidation(false)}
          title='Error'
          btntitle='Ok'
          subtitle='The Minimum Grade Level must be less than the Maximum Grade Level.'
          handleSubmit={() => setModalErrorGradeValidation(false)}
          canceltitle=''
          textCenter={true}
        >
          {modalWarning === 'delete' && (
            <Typography fontWeight='600' fontSize={14} align='center'>
              Doing so will remove it from any student&lsquo;s schedule for this year.
            </Typography>
          )}
        </WarningModal>
      )}
    </Box>
  )
}

export default Periods
