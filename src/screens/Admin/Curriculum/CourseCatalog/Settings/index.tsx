import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Alert, AlertColor, Button, Checkbox, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { ContentBlock, ContentState, convertToRaw, EditorBlock, EditorState } from 'draft-js'
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

const Settings: React.FC = () => {
  const classes = useStyles
  const [selectedYearId, setSelectedYearId] = useState<number>()
  const [maxPeriods, setMaxPeriods] = useState<number>()
  const [thirdParty, setThirdParty] = useState<string>()
  const [customBuilt, setCustomBuilt] = useState<string>()
  const [splitEnrollment, setSplitEnrollment] = useState<string>()
  const [alwaysUnlock, setAlwaysUnlock] = useState<boolean>()
  const [scheduleBuilderId, setScheduleBuilderId] = useState<number>()
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

  const orderedList = 0
  const unorderedList = 1
  const baseBullets = [[1], ['•', '▫', '▪']]
  const leavingLevel = 0
  const initiatingLevel = 1
  const crossingLevel = 2
  let curListLvl = 0
  let listEntriesLastIdx: number[][] | string[][] = []
  let currentBlockKey = ''
  const getSisterBullet = (idx: number | string, type: number, whichSister: number) => {
    if (type === orderedList) {
      if (Number.isInteger(idx)) {
        return Number(idx) + whichSister
      } else {
        return String.fromCharCode((idx as string)?.charCodeAt(0) + whichSister)
      }
    }
    return idx
  }

  const getLevelBaseBullet = (depth: number, type: number, action: number) => {
    const curLevelBaseIdx = baseBullets[type][depth % baseBullets[type].length]
    return action === leavingLevel ? getSisterBullet(curLevelBaseIdx, type, -1) : curLevelBaseIdx
  }

  const setLevelNextEntryBullet = (type: number, depth: number, action = crossingLevel, blockKey: string) => {
    switch (action) {
      case crossingLevel:
        if (!listEntriesLastIdx[type]) {
          if (type === orderedList) {
            listEntriesLastIdx[type] = [1]
          } else {
            listEntriesLastIdx[type] = ['•']
          }
        }
        listEntriesLastIdx[type][depth] = getSisterBullet(
          listEntriesLastIdx[type][depth],
          type,
          blockKey === currentBlockKey ? 0 : 1,
        )
        currentBlockKey = blockKey
        break
      case leavingLevel:
        listEntriesLastIdx[type].splice(depth, 1)
        if (depth > 0 && !listEntriesLastIdx[type][depth - 1]) {
          listEntriesLastIdx[type][depth - 1] = getLevelBaseBullet(depth - 1, type, initiatingLevel)
        }
        break
      default:
        listEntriesLastIdx[type][depth] = getLevelBaseBullet(depth, type, action)
        break
    }
  }

  const handleBlockRender = (block: ContentBlock) => {
    let blockType = -1
    switch (block.getType()) {
      case 'ordered-list-item':
        blockType = orderedList
        break
      case 'unordered-list-item':
        blockType = unorderedList
        break
      default:
        break
    }

    if (blockType >= 0) {
      if (block.getDepth() === curListLvl) {
        setLevelNextEntryBullet(blockType, curListLvl, crossingLevel, block.getKey())
      } else {
        if (!listEntriesLastIdx[blockType]) {
          listEntriesLastIdx[blockType] = []
        }
        if (block.getDepth() < curListLvl) {
          setLevelNextEntryBullet(blockType, curListLvl, leavingLevel, block.getKey())
        } else {
          setLevelNextEntryBullet(
            blockType,
            block.getDepth(),
            listEntriesLastIdx[blockType][block.getDepth()] ? undefined : initiatingLevel,
            block.getKey(),
          )
        }
        curListLvl = block.getDepth()
      }

      const levelIndexToDisplay = listEntriesLastIdx[blockType][curListLvl]
      const HTMLStyles = editorStylesToHTMLStyles(block.getInlineStyleAt(0))
      return {
        component: (props: Wysiwyg.EditorState) => (
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Box>
              <Typography className='bullet' sx={{ ...HTMLStyles, marginRight: '8px' }}>{`${levelIndexToDisplay}${
                blockType === orderedList ? '.' : ' '
              }`}</Typography>
            </Box>
            <EditorBlock {...props} />
          </Box>
        ),
      }
    } else {
      listEntriesLastIdx = []
      curListLvl = -1
    }
  }

  const editorStylesToHTMLStyles = (editorStyles) => {
    return editorStyles
      .map((editorStyle) => getHTMLStyles(editorStyle))
      .toArray()
      .reduce((acc, styles) => {
        return { ...acc, ...styles }
      }, {})
  }

  const getHTMLStyles = (editorStyle) => {
    let matches = null
    if ((matches = editorStyle.match(/fontsize-(.*)/))) return { fontSize: matches[1] + 'px' }
    else if ((matches = editorStyle.match(/color-(.*)/))) return { color: matches[1] }
    else if ((matches = editorStyle.match(/fontfamily-(.*)/))) return { fontFamily: matches[1] }
    else
      switch (editorStyle) {
        case 'BOLD':
          return { fontWeight: 'bold' }
        case 'ITALIC':
          return { fontStyle: 'italic' }
        case 'SUPERSCRIPT':
          return { fontSize: '.7rem', position: 'relative', top: '-.5rem' }
        case 'SUBSCRIPT':
          return { fontSize: '.7rem', position: 'relative', bottom: '-.5rem' }
        case 'UNDERLINE':
          return { textDecoration: 'underline' }
        case 'STRIKETHROUGH':
          return { textDecoration: 'line-through' }
        default:
          return {}
      }
  }
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
            sx={{ ml: { xs: 0, lg: 3, xl: 7 } }}
          />
          <Box display='flex' alignItems='center' sx={{ ml: { xs: 0, lg: 3, xl: 9 } }}>
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
                '&.Mui-disabled': {
                  position: 'relative',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    width: 18,
                    height: 18,
                    borderRadius: '2px',
                    border: `solid 2px ${MthColor.SYSTEM_12}`,
                    backgroundColor: MthColor.SYSTEM_07,
                  },
                  '& svg': {
                    opacity: 0,
                  },
                },
              }}
            />
            <Paragraph
              size={'large'}
              color={formik.values.split_enrollment === 'Enabled' ? MthColor.SYSTEM_01 : MthColor.SYSTEM_06}
            >
              {ScheduleBuilder.CHECKBOX_LABEL}
            </Paragraph>
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
              placeholder='  Type here...'
              editorRef={(ref) => (editorRef.current = ref)}
              editorState={editorState}
              onEditorStateChange={(e) => {
                handleBodyChange(e)
              }}
              customBlockRenderFunc={handleBlockRender}
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
              index={index}
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
