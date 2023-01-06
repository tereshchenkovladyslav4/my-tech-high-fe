import React from 'react'
import DehazeIcon from '@mui/icons-material/Dehaze'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EditIcon from '@mui/icons-material/Edit'
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  inputLabelClasses,
  List,
  outlinedInputClasses,
  Radio,
  Tooltip,
} from '@mui/material'
import { Form, Formik, useFormikContext } from 'formik'
import { SortableHandle } from 'react-sortable-hoc'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { QuestionTypes } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { mthButtonClasses } from '@mth/styles/button.style'
import { LearningQuestionType } from '../types'

const LearningQuestionItem = ({ question }: { question: LearningQuestionType[] }) => {
  const { values, setValues } = useFormikContext<LearningQuestionType[]>()
  const handleChange = (value) => {
    const q = question[0]
    if (q.type == QuestionTypes.CHECK_BOX) {
      if (q.response?.indexOf(value) >= 0) {
        q.response = q.response.replace(value, '')
      } else {
        q.response += value
      }
      value = q.response
    }
    const newValues = values.map((v) =>
      v.id == q.id
        ? {
            ...v,
            response: value,
          }
        : v,
    )

    newValues.forEach((item: LearningQuestionType, index: number) => {
      if (item.parent_slug) {
        const parent = newValues.find((x) => item.parent_slug == x.slug)
        if (
          (parent?.type !== QuestionTypes.AGREEMENT &&
            parent?.response &&
            parent?.options?.find((x) => x.value == parent.response || parent.response.toString().indexOf(x.value) >= 0)
              .action == 2 &&
            parent?.active) ||
          (parent?.type === QuestionTypes.AGREEMENT && value)
        ) {
          newValues[index] = {
            ...item,
            active: true,
          }
        } else {
          newValues[index] = {
            ...item,
            active: false,
          }
        }
      } else {
        newValues[index] = item
      }
    })

    setValues(newValues)
  }

  const QuestionItem = () => {
    switch (question[0].type) {
      case QuestionTypes.TEXTBOX:
        return (
          <Box>
            <MthBulletEditor setValue={() => handleChange()} value='' />
          </Box>
        )
      case QuestionTypes.DROPDOWN:
        return (
          <Box>
            <DropDown
              sx={{
                // marginTop: '10px',
                minWidth: '100%',
                maxWidth: '100%',
                [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                  {
                    borderColor: MthColor.SYSTEM_07,
                    borderWidth: '2px',
                  },
                [`& .${inputLabelClasses.root}.${inputLabelClasses.focused}`]: {
                  transform: 'translate(14px, -11px) scale(1)',
                },
                [`& .${outlinedInputClasses.notchedOutline}`]: {
                  borderColor: MthColor.SYSTEM_07,
                  borderWidth: '2px',
                },
                [`& .${inputLabelClasses.root}.${inputLabelClasses.shrink}`]: {
                  transform: 'translate(14px, -11px) scale(1)',
                },
                [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline} span`]: {
                  fontSize: 16,
                },
              }}
              labelTop
              dropDownItems={question[0].options}
              setParentValue={(v) => handleChange(v as string)}
              alternate={true}
              size='small'
            />
          </Box>
        )
      case QuestionTypes.AGREEMENT:
        return (
          <Box display='flex' justifyContent={'space-between'}>
            <Box display='flex' alignItems='center'>
              <Checkbox
                checked={!!question[0].response}
                sx={{
                  paddingLeft: 0,
                  color: 'MthColor.MTHBLUE',
                  '&.Mui-checked': {
                    color: 'MthColor.MTHBLUE',
                  },
                }}
                onClick={() => handleChange(!question[0].response)}
              />
              <Paragraph size='large' sx={{ fontSize: 16 }}>
                <p dangerouslySetInnerHTML={{ __html: question[0].question }}></p>
              </Paragraph>
            </Box>
            <Box display='inline-flex' paddingTop='10px' height='40px' alignItems='center' justifyContent='center'>
              <Tooltip title='Edit'>
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Delete'>
                <IconButton>
                  <DeleteForeverOutlinedIcon />
                </IconButton>
              </Tooltip>
              <DragHandle />
            </Box>
          </Box>
        )
      case QuestionTypes.INFORMATION:
        return null
      case QuestionTypes.UPLOAD:
        return (
          <Box>
            <MthBulletEditor setValue={(v) => handleChange(v)} value='' />
            <Button sx={{ ...mthButtonClasses.roundDarkGray, padding: '8px 16px', height: 'unset', marginTop: 3 }}>
              Upload File(MAXIMUM OF 20MB)
            </Button>
          </Box>
        )
      case QuestionTypes.MULTIPLE_CHOSE:
        const options = question[0].options
        return (options || []).map((o) => (
          <Box
            key={o.value}
            display='flex'
            alignItems='center'
            sx={{
              borderBottom: '1px solid ' + MthColor.SYSTEM_07,
              marginTop: '10px',
              width: '100%',
            }}
          >
            <Radio
              checked={o.value === question[0].response}
              onChange={(e) => e.currentTarget.checked && handleChange(o.value)}
              sx={{
                paddingLeft: 0,
                color: 'MthColor.MTHBLUE',
                '&.Mui-checked': {
                  color: 'MthColor.MTHBLUE',
                },
              }}
            />
            <Subtitle
              size='small'
              sx={{ wordWrap: 'break-word', maxWidth: '90%', textAlign: 'start', color: MthColor.SYSTEM_05 }}
            >
              {o.label}
            </Subtitle>
          </Box>
        ))

      case QuestionTypes.CHECK_BOX:
        return (question[0]?.options || []).map((o) => (
          <Box
            key={o.value}
            display='flex'
            alignItems='center'
            sx={{
              borderBottom: '1px solid ' + MthColor.SYSTEM_07,
              marginTop: '10px',
              width: '100%',
            }}
          >
            <Checkbox
              checked={question[0]?.response?.indexOf(o.value) >= 0}
              onClick={() => handleChange(o.value)}
              sx={{
                paddingLeft: 0,
                color: 'MthColor.MTHBLUE',
                '&.Mui-checked': {
                  color: 'MthColor.MTHBLUE',
                },
              }}
            />
            <Subtitle
              size='small'
              sx={{ wordWrap: 'break-word', maxWidth: '90%', textAlign: 'start', color: MthColor.SYSTEM_05 }}
            >
              {o.label}
            </Subtitle>
          </Box>
        ))
      default:
        return null
    }
  }

  const DragHandle = SortableHandle(() => (
    <Tooltip title='Move'>
      <IconButton>
        <DehazeIcon />
      </IconButton>
    </Tooltip>
  ))

  return (
    <>
      {question[0].type !== QuestionTypes.AGREEMENT && (
        <Box display='flex' mt='20px' alignItems='center' justifyContent='space-between'>
          <Paragraph size='large' sx={{ fontSize: 16 }}>
            <p dangerouslySetInnerHTML={{ __html: question[0].question }}></p>
          </Paragraph>
          <Box display='inline-flex' paddingTop='10px' height='40px' alignItems='center' justifyContent='center'>
            <Tooltip title='Edit'>
              <IconButton>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
              <IconButton>
                <DeleteForeverOutlinedIcon />
              </IconButton>
            </Tooltip>
            <DragHandle />
          </Box>
        </Box>
      )}
      {QuestionItem()}
      {question[0].can_upload && (
        <Button sx={{ ...mthButtonClasses.roundDarkGray, padding: '8px 16px', height: 'unset', marginTop: 3 }}>
          Upload File(MAXIMUM OF 20MB)
        </Button>
      )}
    </>
  )
}

const SortableItem = SortableElement(LearningQuestionItem)

const LearningQuestionList = ({ learningQuestionList }) => {
  const SortableListContainer = SortableContainer(({ items }: { items: LearningQuestionType[] }) => (
    <List>
      {items.map((item, index) => (
        <SortableItem question={item} key={index} index={index} />
      ))}
    </List>
  ))

  const questionSortList = (values) => {
    const sortList = values
      .filter(
        (v) =>
          !v.parent_slug ||
          v.parent_slug == '' ||
          (values.find((x) => x.slug == v.parent_slug)?.response !== '' &&
            values
              .find((x) => x.slug == v.parent_slug)
              ?.options.find(
                (x) =>
                  x.action == 2 &&
                  (x.value == values.find((y) => y.slug == v.parent_slug)?.response ||
                    values
                      .find((y) => y.slug == v.parent_slug)
                      ?.response.toString()
                      .indexOf(x.value) >= 0),
              ) != null &&
            values.find((x) => x.slug == v.parent_slug)?.active) ||
          (values.find((x) => x.slug == v.parent_slug)?.type === QuestionTypes.AGREEMENT &&
            !!values.find((x) => x.slug == v.parent_slug)?.response), // Parent
      )
      .map((v) => {
        const arr = [v]
        let current = v,
          child
        while ((child = values.find((x) => x.parent_slug == current.slug))) {
          arr.push(child)
          current = child
        }
        return arr
      })
    return sortList
  }

  return (
    <Formik initialValues={learningQuestionList} enableReinitialize={true}>
      {({ values, setValues }) => (
        <Form>
          <Box>
            <SortableListContainer
              items={questionSortList(values)}
              useDragHandle={true}
              onSortEnd={({ oldIndex, newIndex }) => {
                //	Find indexs
                const groups = values
                  .filter((v) => !v.parent_slug || v.parent_slug == '')
                  .map((v) => {
                    const arr = [v]
                    let current = v
                    let child
                    while ((child = values.find((x) => x.parent_slug == current.slug))) {
                      arr.push(child)
                      current = child
                    }
                    return arr
                  })
                const newData = arrayMove(groups, oldIndex, newIndex)
                const newValues = []
                newData.forEach((group) => {
                  group?.forEach((q) => {
                    newValues.push({
                      ...q,
                      sequence: newValues.length + 1,
                    })
                  })
                })
                setValues(newValues)
              }}
            />
          </Box>
        </Form>
      )}
    </Formik>
  )
}

export default LearningQuestionList
