/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FunctionComponent, useState, useContext, useMemo } from 'react'
import { useQuery } from '@apollo/client'
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
} from '@mui/material'
import { ContentState, EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { useFormik } from 'formik'
import htmlToDraft from 'html-to-draftjs'
import Wysiwyg from 'react-draft-wysiwyg'
import * as Yup from 'yup'
import { MthModal } from '@mth/components/MthModal/MthModal'
import PageHeader from '@mth/components/PageHeader'
import CustomTable from '@mth/components/Table/CustomTable'
import { Field, ValueOf } from '@mth/components/Table/types'
import { TableItem } from '@mth/components/Table/types'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { getSchoolYearByYearIdForPeriod } from '@mth/screens/Admin/Curriculum/services'
import { SchoolYearDropDown } from '@mth/screens/Admin/SiteManagement/SchoolPartner/SchoolYearDropDown/SchoolYearDropDown'
import { ordinalSuffixOf } from '@mth/utils'
import { useStyles } from '../../styles'
import { PeriodItem, SEMESTER_TYPE, REDUCE_FUNDS_TYPE, OptionType, SEMESTER_MESSAGE } from '../../types'
import Filter from './Filter'

// validation message
Yup.setLocale({
  mixed: {
    required: 'Required',
  },
})

const Periods: FunctionComponent = () => {
  const classes = useStyles
  const [selectedYearId, setSelectedYearId] = useState<number | undefined>()
  // Modal for Archive, Unarchive, Delete
  const [modalWarning, setModalWarning] = useState<'delete' | 'unarchive' | 'archive' | ''>('')
  const [temp, setTemp] = useState<PeriodItem>()
  const [loading] = useState(false)
  const [open, setOpen] = useState<boolean>(true)
  const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromText('')))

  const [items, setItems] = useState<Array<PeriodItem>>([
    {
      id: 1,
      period: 1,
      grade: 'K-12',
      category: 'Homeroom',
      grade_level_min: '1',
      grade_level_max: '2',
      semester: SEMESTER_TYPE.NONE,
      reduce_funds: REDUCE_FUNDS_TYPE.TECHNOLOGY,
      price: 12,
      archived: true,
      notify_semester: true,
      notify_period: false,
      message: '<p>1111<p>',
    },
    {
      id: 2,
      period: 2,
      grade: 'K',
      category: 'Math',
      grade_level_min: '3',
      grade_level_max: '4',
      semester: SEMESTER_TYPE.SUBJECT,
      reduce_funds: REDUCE_FUNDS_TYPE.TECHNOLOGY,
      archived: false,
      notify_semester: true,
      notify_period: false,
      message: '<p>2222<p>',
    },
    {
      id: 3,
      period: 3,
      grade: 'K-12',
      category: 'Language Arts',
      grade_level_min: '3',
      grade_level_max: '6',
      semester: SEMESTER_TYPE.PERIOD,
      reduce_funds: REDUCE_FUNDS_TYPE.SUPPLEMENTAL,
      archived: false,
      notify_semester: true,
      notify_period: false,
      message: '<p>3333<p>',
    },
  ])

  const [query, setQuery] = useState({
    keyword: '',
    hideArchived: true,
  })

  const { data: schoolYearData } = useQuery(getSchoolYearByYearIdForPeriod, {
    variables: {
      school_year_id: selectedYearId,
    },
    skip: !selectedYearId,
    fetchPolicy: 'network-only',
  })

  const gradeList: OptionType[] = useMemo(() => {
    return (
      schoolYearData?.getSchoolYear?.grades
        ?.split(',')
        .sort((a: string, b: string) => (parseInt(a) > parseInt(b) ? 1 : -1))
        .sort((a: string) => (a === 'Kindergarten' ? -1 : 0))
        .map(
          (value: string): OptionType => ({
            label: ordinalSuffixOf(value) + ' Grade',
            value,
          }),
        ) || []
    )
  }, [schoolYearData])

  const maxPeriodCount: number = useMemo(() => {
    return schoolYearData?.getSchoolYear?.ScheduleBuilder?.max_num_periods || 0
  }, [schoolYearData])

  const handleArchiveModal = (item: PeriodItem) => {
    setTemp(item)
    setModalWarning(item.archived ? 'unarchive' : 'archive')
  }
  const handleArchiveOrDelete = () => {
    if (!temp) return
    else {
      if (modalWarning === 'delete') {
        // TODO: Mutation Delete
        // MOCK
        setItems(items.filter((el) => el.id !== temp.id))
        // MOCK end
      } else {
        // TODO: Mutation Toggle
        // MOCK
        const updatedItems = items.map((el) => {
          if (el.id === temp.id) {
            return {
              ...el,
              archived: !el.archived,
            }
          } else return el
        })
        setItems(updatedItems)
        // MOCK end
      }
    }
    setModalWarning('')
  }

  const handleDelete = (item: PeriodItem) => {
    // Remove this localStorage line after the delete functionality is implemented
    // I added this code to fix a lint issue
    setTemp(item)
    setModalWarning('delete')
  }

  const setFilter = (field: string, value: string | boolean) => {
    setQuery({
      ...query,
      [field]: value,
    })
  }
  const initialValues: PeriodItem = {
    period: 1,
    category: '',
    grade_level_min: '',
    grade_level_max: '',
    reduce_funds: REDUCE_FUNDS_TYPE.NONE,
    price: '',
    semester: SEMESTER_TYPE.NONE,
    message: '',
    notify_semester: false,
    notify_period: false,
  }
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      period: Yup.number().required(),
      category: Yup.string().required(),
      grade_level_max: Yup.string().required(),
      grade_level_min: Yup.string().required(),
      notify_semester: Yup.boolean(),
      notify_period: Yup.boolean(),
      message: Yup.string().when(['notify_semester', 'notify_period'], {
        is: (notify_semester: boolean, notify_period: boolean) => notify_semester || notify_period,
        then: Yup.string()
          .required()
          .test('html_content', 'Required', () => editorState.getCurrentContent().hasText()),
      }),
      price: Yup.number().when(['reduce_funds'], {
        is: (reduce_funds: REDUCE_FUNDS_TYPE) => !!reduce_funds,
        then: Yup.number().required(),
      }),
    }),
    onSubmit: async () => {},
  })

  const handleSubmit = () => {
    formik.handleSubmit()
  }
  const handleAdd = () => {
    setTemp(undefined)
    formik.resetForm()
    setOpen(true)
  }
  const handleEditModal = (item: PeriodItem) => {
    setTemp(item)
    formik.setValues({
      period: item.period,
      category: item.category,
      grade_level_min: item.grade_level_min,
      grade_level_max: item.grade_level_max,
      reduce_funds: item.reduce_funds,
      semester: item.semester,
      price: item.price,
      message: item.message,
      notify_semester: item.notify_semester,
      notify_period: item.notify_period,
    })
    if (item.message) {
      const contentBlock = htmlToDraft(item.message)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        setEditorState(editorState)
      }
    }
    setOpen(true)
  }
  const handleEditorChange = async (state: EditorState) => {
    await Promise.all([setEditorState(state)]).then(() => {
      const content = state.getCurrentContent()
      formik.setFieldValue('message', draftToHtml(convertToRaw(content)))
      formik.setFieldTouched('message', true)
    })
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
      formatter: (value: ValueOf<PeriodItem>) => SEMESTER_MESSAGE[value as SEMESTER_TYPE],
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      thClass: 'w-31',
      formatter: (_: ValueOf<PeriodItem>, item: TableItem<PeriodItem>) => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'}>
            {item.archived ? (
              <IconButton disabled>
                <CreateIcon />
              </IconButton>
            ) : (
              <Tooltip title='Edit' color='primary' placement='top'>
                <IconButton onClick={() => handleEditModal(item)}>
                  <CreateIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={item.archived ? 'Unarchive' : 'Archive'} placement='top'>
              <IconButton onClick={() => handleArchiveModal(item)} color='primary' sx={{ mr: item.archived ? 0 : 5 }}>
                {item.archived ? <CallMissedOutgoingIcon sx={{ color: '#A3A3A4' }} /> : <SystemUpdateAltRoundedIcon />}
              </IconButton>
            </Tooltip>

            {item.archived && (
              <Tooltip title='Delete' color='primary' placement='top'>
                <IconButton onClick={() => handleDelete(item)}>
                  <DeleteForeverOutlined />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )
      },
    },
  ]

  return (
    <Box sx={classes.base}>
      <PageHeader title='Periods'>
        <SchoolYearDropDown setSelectedYearId={setSelectedYearId} selectedYearId={selectedYearId} />
      </PageHeader>

      <Box sx={{ my: 2 }}>
        <Filter query={query} setValue={setFilter} />
      </Box>

      <Box>
        <CustomTable items={items} loading={loading} fields={fields} striped size='lg' borderedLeft />
      </Box>

      <Box sx={{ mt: 4, textAlign: 'left' }}>
        <Button variant='contained' onClick={handleAdd} disableElevation sx={classes.addButton} size='large'>
          + Add Period
        </Button>
      </Box>

      {!!modalWarning && (
        <WarningModal
          handleModem={() => setModalWarning('')}
          title={modalWarning}
          btntitle={<span style={{ textTransform: 'capitalize' }}>{modalWarning}</span>}
          subtitle={`Are you sure want to ${modalWarning} this Period?`}
          handleSubmit={handleArchiveOrDelete}
          canceltitle='Cancel'
        >
          {modalWarning === 'delete' && (
            <Typography fontWeight='600' fontSize={14} align='center'>
              Doing so will remove it from any student&lsquo;s schedule for this year.
            </Typography>
          )}
        </WarningModal>
      )}

      <MthModal open={open} onClose={() => setOpen(false)} confirmStr='Save' onConfirm={handleSubmit} noCloseOnBackdrop>
        <Grid container rowSpacing={3} columnSpacing={4} sx={{ width: '620px', ...classes.form }}>
          <Grid item xs={12} sm={6}>
            <TextField
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
              InputLabelProps={{ shrink: true }}
              select
              disabled={!!temp?.id}
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
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
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
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name='grade_level_min'
              label='Minimum Grade Level'
              placeholder='Minimum Grade Level'
              fullWidth
              value={formik.values.grade_level_min}
              onChange={(e) => {
                formik.handleChange(e)
              }}
              error={formik.touched.grade_level_min && !!formik.errors.grade_level_min}
              helperText={formik.touched.grade_level_min && formik.errors.grade_level_min}
              InputLabelProps={{ shrink: true }}
              SelectProps={{ displayEmpty: true }}
              select
            >
              {gradeList.map((option) => (
                <MenuItem key={`min_${option.value}`} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name='grade_level_max'
              label='Maximum Grade Level'
              placeholder='Maximum Grade Level'
              fullWidth
              value={formik.values.grade_level_max}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.grade_level_max && !!formik.errors.grade_level_max}
              helperText={formik.touched.grade_level_max && formik.errors.grade_level_max}
              InputLabelProps={{ shrink: true }}
              SelectProps={{ displayEmpty: true }}
              select
            >
              {gradeList.map((option) => (
                <MenuItem key={`max_${option.value}`} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name='reduce_funds'
              label='Reduce Funds'
              placeholder='Category'
              fullWidth
              value={formik.values.reduce_funds}
              onChange={(e) => {
                formik.handleChange(e)
              }}
              error={formik.touched.reduce_funds && !!formik.errors.reduce_funds}
              helperText={formik.touched.reduce_funds && formik.errors.reduce_funds}
              InputLabelProps={{ shrink: true }}
              SelectProps={{ displayEmpty: true }}
              select
            >
              {[
                { label: 'None', value: '' },
                { label: 'Supplemental Learning Funds', value: REDUCE_FUNDS_TYPE.SUPPLEMENTAL },
                { label: 'Technology Allowance', value: REDUCE_FUNDS_TYPE.TECHNOLOGY },
              ].map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name='price'
              label='Price'
              placeholder='Period'
              fullWidth
              value={formik.values.price}
              onChange={(e) => {
                formik.handleChange(e)
              }}
              error={formik.touched.price && !!formik.errors.price}
              helperText={formik.touched.price && formik.errors.price}
              InputLabelProps={{ shrink: true }}
              disabled={!formik.values.reduce_funds}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name='semester'
              label='2nd Semester Changes'
              placeholder='Category'
              fullWidth
              value={formik.values.semester}
              onChange={(e) => {
                formik.handleChange(e)
              }}
              error={formik.touched.semester && !!formik.errors.semester}
              helperText={formik.touched.semester && formik.errors.semester}
              InputLabelProps={{ shrink: true }}
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
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox checked={formik.values.notify_period} name='notify_period' onChange={formik.handleChange} />
              }
              label='Display a notification when this period is selected'
            />
            {formik.values.semester === SEMESTER_TYPE.SUBJECT && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.notify_semester}
                    name='notify_semester'
                    onChange={formik.handleChange}
                  />
                }
                label='Display a notification when the subject is not changed at 2nd Semester'
              />
            )}
          </Grid>

          {(formik.values.notify_period || formik.values.notify_semester) && (
            <Grid item xs={12}>
              <Typography
                variant='h6'
                sx={{
                  mb: 1,
                  fontWeight: '700',
                }}
                className={formik.touched.message && !!formik.errors.message ? 'Mui-error' : ''}
              >
                Notification Message
              </Typography>
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
                  onEditorStateChange={handleEditorChange}
                  placeholder='  Type here...'
                  editorState={editorState}
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
              {formik.touched.message && !!formik.errors.message && (
                <FormHelperText error sx={{ pl: 2 }}>
                  {formik.errors.message}
                </FormHelperText>
              )}
            </Grid>
          )}
        </Grid>
      </MthModal>
    </Box>
  )
}

export default Periods
