import React, { FunctionComponent, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Alert, AlertColor, Button, Checkbox } from '@mui/material'
import { Box } from '@mui/system'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { useFormik } from 'formik'
import htmlToDraft from 'html-to-draftjs'
import { map, toNumber } from 'lodash'
import Wysiwyg from 'react-draft-wysiwyg'
import { Prompt } from 'react-router-dom'
import * as yup from 'yup'
import { CommonSelect } from '@mth/components/CommonSelect'
import { DropDown } from '@mth/components/DropDown/DropDown'
import PageHeader from '@mth/components/PageHeader'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { MthColor, MthRoute, ScheduleBuilder } from '@mth/enums'
import { SchoolYear } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { SchoolYearDropDown } from '@mth/screens/Admin/SiteManagement/SchoolPartner/SchoolYearDropDown/SchoolYearDropDown'
import { createOrUpdateScheduleBuilder, getSchoolYear } from '../../services'
import { useStyles } from '../../styles'
import { GradesSelect } from './GradeSelect'

type openAlertSaveType = {
  message: string
  status: AlertColor
  open: boolean
}

const Settings: FunctionComponent = () => {
  const classes = useStyles
  const [selectedYearId, setSelectedYearId] = useState<number>()
  const [maxPeriods, setMaxPeriods] = useState<number>()
  const [thirdParty, setThirdParty] = useState<string>()
  const [customBuilt, setCustomBuilt] = useState<string>()
  const [splitEnrollment, setSplitEnrollment] = useState<string>()
  const [alwaysUnlock, setAlwaysUnlock] = useState<boolean>()
  const [scheduleBuilderId, setScheduleBuilderId] = useState<number>()
  const [currentBlocks, setCurrentBlocks] = useState(0)
  const [isValid, setIsValid] = useState(false)
  const [editorTouched, setEditorTouched] = useState(false)
  const [hasChange, setChanged] = useState(false)
  const { me } = useContext(UserContext)
  const validateEditor = () => {
    setEditorTouched(true)
    setIsValid(editorState.getCurrentContent().hasText())
  }
  const [grades, setGrades] = useState<string>('')
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [openSaveAlert, setOpenSaveAlert] = useState<openAlertSaveType>({
    message: '',
    status: 'success',
    open: false,
  })
  const editorRef = useRef<unknown>(null)
  const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromText('')))

  const handleBodyChange = (e: Wysiwyg.EditorState) => {
    setEditorTouched(true)
    setChanged(true)
    setIsValid(e.getCurrentContent().hasText())
    setEditorState(e)
  }
  const { data } = useQuery<{ getSchoolYear: SchoolYear }>(getSchoolYear, {
    variables: {
      school_year_id: selectedYearId,
    },
    skip: !selectedYearId, //me?.selectedRegionId ? false : true,
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (selectedYearId && data) {
      const scheduleBuilder = data?.getSchoolYear?.ScheduleBuilder
      if (scheduleBuilder) {
        const {
          max_num_periods,
          custom_built,
          split_enrollment,
          split_enrollment_grades,
          always_unlock,
          parent_tooltip,
          third_party_provider,
          id,
        } = scheduleBuilder

        const contentBlock = htmlToDraft(parent_tooltip || '')
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)

        setMaxPeriods(max_num_periods)
        setGrades(split_enrollment_grades || '')
        setCustomBuilt(Boolean(custom_built) ? 'Enabled' : 'Disabled')
        setSplitEnrollment(Boolean(split_enrollment) ? 'Enabled' : 'Disabled')
        setAlwaysUnlock(always_unlock)
        setEditorState(EditorState.createWithContent(contentState))
        setThirdParty(Boolean(third_party_provider) ? 'Enabled' : 'Disabled')
        setScheduleBuilderId(id)
      }
    } else {
      setMaxPeriods(undefined)
      setCustomBuilt(undefined)
      setSplitEnrollment(undefined)
      setAlwaysUnlock(undefined)
      setEditorState(EditorState.createWithContent(ContentState.createFromText('')))
      setThirdParty(undefined)
      setScheduleBuilderId(undefined)
    }
  }, [me?.selectedRegionId, selectedYearId, data])

  const handleEditorChange = (state: Draft.DraftModel.Encoding.RawDraftContentState) => {
    try {
      if (currentBlocks !== 0 && currentBlocks !== state.blocks.length) {
        ;(editorRef.current as Element).scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
      setCurrentBlocks(state.blocks.length)
    } catch {}
  }

  const enabledOptions = [
    {
      label: 'Enabled',
      value: 'Enabled',
    },
    {
      label: 'Disabled',
      value: 'Disabled',
    },
  ]

  const validationSchema = yup.object({
    max_num_periods: yup.number().required('Required').nullable(),
    custom_built: yup.string().required('Required').nullable(),
    split_enrollment: yup.string().required('Required').nullable(),
    third_party_provider: yup.string().required('Required').nullable(),
    always_unlock: yup.boolean().nullable(),
  })

  const formik = useFormik({
    initialValues: {
      max_num_periods: maxPeriods,
      custom_built: customBuilt,
      split_enrollment: splitEnrollment,
      third_party_provider: thirdParty,
      always_unlock: Boolean(alwaysUnlock),
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      await handleSubmit()
    },
    enableReinitialize: true,
  })
  const handleParentValueMaxNumPeriods = useCallback(
    (id) => {
      setChanged(true)
      formik.setFieldValue('max_num_periods', id)
    },
    [formik],
  )
  const scheduleBuilderItems = [
    {
      name: ScheduleBuilder.MAX_NUM_PERIODS,
      component: (
        <DropDown
          name='max_num_periods'
          defaultValue={maxPeriods}
          dropDownItems={map([...Array(10).keys()], (num) => ({
            label: num + 1,
            value: num + 1,
          }))}
          sx={{ width: '200px', textAlign: 'left' }}
          placeholder='Select'
          setParentValue={handleParentValueMaxNumPeriods}
          error={{
            error: !!formik.errors.max_num_periods && formik.touched.max_num_periods,
            errorMsg: (formik.touched.max_num_periods && formik.errors.max_num_periods) as string,
          }}
        />
      ),
    },
    {
      name: ScheduleBuilder.PARTY_PROVIDER,
      component: (
        <DropDown
          defaultValue={thirdParty}
          name='third_party_provider'
          sx={{ width: '200px', textAlign: 'left' }}
          dropDownItems={enabledOptions}
          placeholder='Select'
          setParentValue={(id) => {
            setChanged(true)
            formik.setFieldValue('third_party_provider', id)
          }}
          error={{
            error: !!formik.errors.third_party_provider && formik.touched.third_party_provider,
            errorMsg: (formik.touched.third_party_provider && formik.errors.third_party_provider) as string,
          }}
        />
      ),
    },
    {
      name: ScheduleBuilder.CUSTOM_BUILT,
      component: (
        <DropDown
          defaultValue={customBuilt}
          name='custom_built'
          sx={{ width: '200px', textAlign: 'left' }}
          dropDownItems={enabledOptions}
          placeholder='Select'
          setParentValue={(id) => {
            setChanged(true)
            formik.setFieldValue('custom_built', id)
          }}
          error={{
            error: !!formik.errors.custom_built && formik.touched.custom_built,
            errorMsg: (formik.touched.custom_built && formik.errors.custom_built) as string,
          }}
        />
      ),
    },
    {
      name: ScheduleBuilder.SPLIT_ENROLLMENT,
      component: (
        <Box display={'flex'} flexDirection='row' alignItems='center' sx={{ width: '100%' }}>
          <DropDown
            defaultValue={splitEnrollment}
            name='split_enrollment'
            sx={{ width: '200px', textAlign: 'left' }}
            dropDownItems={enabledOptions}
            placeholder='Select'
            setParentValue={(id) => {
              setChanged(true)
              formik.setFieldValue('split_enrollment', id)
              if (id === 'Disabled') {
                formik.setFieldValue('always_unlock', false)
              }
            }}
            error={{
              error: !!formik.errors.split_enrollment && formik.touched.split_enrollment,
              errorMsg: (formik.touched.split_enrollment && formik.errors.split_enrollment) as string,
            }}
          />
          <GradesSelect
            grades={grades}
            setGrades={setGrades}
            isChanged={isChanged}
            setIsChanged={setIsChanged}
            disabled={formik.values.split_enrollment === 'Disabled' || formik.values.split_enrollment === undefined}
          />
          <Box display='flex' alignItems='center'>
            <Checkbox
              name='always_unlock'
              disabled={formik.values.split_enrollment === 'Disabled' || formik.values.split_enrollment === undefined}
              checked={formik.values.always_unlock}
              onClick={(e) =>
                formik.setFieldValue(
                  'always_unlock',
                  (e as unknown as React.ChangeEvent<HTMLInputElement>).target.checked,
                )
              }
              sx={{
                marginLeft: 4,
              }}
            />
            <Paragraph size={'large'}>{ScheduleBuilder.CHECKBOX_LABEL}</Paragraph>
          </Box>
        </Box>
      ),
    },
    {
      name: ScheduleBuilder.TOOLTIP,
      component: (
        <Box flexDirection={'column'} display='flex'>
          <Box
            sx={{
              border: '1px solid #d1d1d1',
              borderRadius: 1,
              'div.DraftEditor-editorContainer': {
                minHeight: '200px',
                maxHeight: '250px',
                overflow: 'scroll',
                padding: 1,
                '.public-DraftStyleDefault-block': {
                  margin: 0,
                },
              },
            }}
          >
            <Wysiwyg.Editor
              onContentStateChange={handleEditorChange}
              placeholder='  Type here...'
              editorRef={(ref) => (editorRef.current = ref)}
              editorState={editorState}
              onEditorStateChange={(e) => {
                handleBodyChange(e)
              }}
              toolbar={{
                options: [
                  'inline',
                  'blockType',
                  'fontSize',
                  'fontFamily',
                  'list',
                  'textAlign',
                  'colorPicker',
                  'link',
                  'embedded' /*, 'emoji'*/,
                  'image',
                  'remove',
                  'history',
                ],
              }}
            />
          </Box>
          {editorTouched && !isValid && (
            <Paragraph size={'large'} color={MthColor.RED} sx={{ marginTop: -8 }}>
              Please enter tooltip information
            </Paragraph>
          )}
        </Box>
      ),
    },
  ]

  const [submitCreate] = useMutation(createOrUpdateScheduleBuilder)
  const handleSubmit = async () => {
    const enabledEnum = {
      Enabled: 1,
      Disabled: 0,
    }

    if (editorState.getCurrentContent().hasText()) {
      submitCreate({
        variables: {
          scheduleBuilderInput: {
            school_year_id: toNumber(selectedYearId),
            max_num_periods: formik.values.max_num_periods,
            custom_built: enabledEnum[formik.values.custom_built as keyof typeof enabledEnum],
            split_enrollment: enabledEnum[formik.values.split_enrollment as keyof typeof enabledEnum],
            split_enrollment_grades: grades,
            always_unlock: formik.values.always_unlock === true ? 1 : 0,
            parent_tooltip: draftToHtml(convertToRaw(editorState.getCurrentContent())),
            third_party_provider: enabledEnum[formik.values.third_party_provider as keyof typeof enabledEnum],
            id: toNumber(scheduleBuilderId) || null,
          },
        },
      })
        .then((resp) => {
          if (resp.data) {
            setChanged(false)
            setOpenSaveAlert({
              message: `Successfully ${scheduleBuilderId ? 'updated' : 'created Schedule Builder'}`,
              status: 'success',
              open: true,
            })
            window.scroll({
              top: 100,
              behavior: 'smooth',
            })
            setTimeout(() => {
              setOpenSaveAlert({ message: '', status: 'success', open: false })
              window.scroll({
                top: 0,
                behavior: 'smooth',
              })
            }, 1500)
          }
        })
        .catch((err) => {
          setOpenSaveAlert({ message: err?.message, status: 'error', open: true })
          window.scroll({
            top: 100,
            behavior: 'smooth',
          })
          setTimeout(() => {
            setOpenSaveAlert({ message: '', status: 'success', open: false })
            window.scroll({
              top: 0,
              behavior: 'smooth',
            })
          }, 1500)
        })
    }
  }
  return (
    <form onSubmit={formik.handleSubmit} style={{ height: '100%' }}>
      <Box sx={classes.baseSettings}>
        <PageHeader title='Schedule Builder Settings' to={MthRoute.CURRICULUM_COURSE_CATALOG}>
          <Button
            variant='contained'
            type='submit'
            onClick={() => validateEditor()}
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
        <Box>
          <SchoolYearDropDown setSelectedYearId={setSelectedYearId} selectedYearId={selectedYearId} align='start' />
        </Box>
        {map(scheduleBuilderItems, (item, index) => (
          <Box key={item.name} sx={{ width: '100%' }}>
            <CommonSelect
              key={index}
              index={index > 2 ? index + 1 : index}
              selectItem={item}
              verticalDividHeight={item.name == ScheduleBuilder.TOOLTIP ? '250px' : '50px'}
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
