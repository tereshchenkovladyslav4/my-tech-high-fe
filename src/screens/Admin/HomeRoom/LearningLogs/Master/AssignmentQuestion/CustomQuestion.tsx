import React, { useContext, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  OutlinedInput,
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { map, omit } from 'lodash'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { additionalAssignmentCustomQuestionTypes, assignmentCustomQuestionTypes, QuestionTypes } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { mthButtonClasses } from '@mth/styles/button.style'
import { renderGrades, toOrdinalSuffix } from '@mth/utils'
import { LearningLogQuestion, Master } from '../../types'
import { AssignmentQuestionType, QuestionOptionType } from '../types'
import { QuestionOptions } from './Options'

type CustomQuestionProps = {
  isCustomeQuestionModal: boolean
  onClose: () => void
  master: Master
  handleSaveQuestion: (value: LearningLogQuestion) => void
  assignmentId: number
  editQuestionList: AssignmentQuestionType[]
}

const ITEM_HEIGHT = 40
const ITEM_PADDING_TOP = 6

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const validationCheckList = [
  { value: 'required', label: 'Required' },
  { value: 'can_upload', label: 'Add an Upload Option', disabled: false },
  { value: 'grade_specific', label: 'Grade Specific Question' },
]

const CustomQuestion: React.FC<CustomQuestionProps> = ({
  isCustomeQuestionModal,
  onClose,
  master,
  handleSaveQuestion,
  assignmentId,
  editQuestionList,
}) => {
  const { me } = useContext(UserContext)
  const { schoolYears } = useSchoolYearsByRegionId(me?.selectedRegionId)

  const [grades, setGrades] = useState<Array<string | number>>([])
  const [questionList, setQuestionList] = useState<AssignmentQuestionType[]>(editQuestionList)

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  useEffect(() => {
    setQuestionList(editQuestionList)
  }, [editQuestionList])

  useEffect(() => {
    if (master && schoolYears.length > 0) {
      const schoolYear = schoolYears.find((item) => item.school_year_id === master.school_year_id)
      setGrades(
        schoolYear?.grades.split(',').sort((a, b) => {
          if (isNaN(b)) {
            return 1
          } else if (Number(a) > Number(b)) {
            return 1
          } else {
            return -1
          }
        }) || [],
      )
    }
  }, [master, schoolYears])

  const renderGradeList = (selectedList: Array<string | number>) =>
    map(grades, (grade, index) => {
      if (typeof grade !== 'string') {
        return (
          <MenuItem key={index} value={grade}>
            <Checkbox checked={selectedList.indexOf(grade.toString()) > -1} />
            <ListItemText primary={`${toOrdinalSuffix(grade)} Grade`} />
          </MenuItem>
        )
      } else {
        return (
          <MenuItem key={index} value={grade}>
            <Checkbox checked={selectedList.indexOf(grade) > -1} />
            <ListItemText primary={grade} />
          </MenuItem>
        )
      }
    })

  const handleGradeChange = (event: SelectChangeEvent<string[]>, targetIndex: number) => {
    const {
      target: { value },
    } = event
    const newQuestionList: AssignmentQuestionType[] = questionList.map(
      (item: AssignmentQuestionType, index: number) => {
        if (index === targetIndex) {
          return {
            ...item,
            grades: value,
          }
        } else {
          return item
        }
      },
    )
    setQuestionList(newQuestionList)
  }

  const handleQuestionItemChange = (updatedQuestionItem: AssignmentQuestionType, targetIndex: number) => {
    const newQuestionList: AssignmentQuestionType[] = questionList.map(
      (item: AssignmentQuestionType, index: number) => {
        if (targetIndex === index) {
          if (updatedQuestionItem.type === QuestionTypes.UPLOAD) {
            return {
              ...updatedQuestionItem,
              validations: updatedQuestionItem.validations.filter((i) => i !== 'can_upload'),
            }
          } else {
            return updatedQuestionItem
          }
        } else {
          return item
        }
      },
    )

    setQuestionList(newQuestionList)
  }

  const handleQuestionList = (targetIndex: number, questionOptions: QuestionOptionType[]) => {
    const newQuestionList = questionList.map((item: AssignmentQuestionType, index: number) => {
      if (index === targetIndex) {
        return {
          ...item,
          options: questionOptions,
        }
      } else {
        return item
      }
    })
    setQuestionList(newQuestionList)
  }

  const handleAdditionalQuestion = (
    questionItem: AssignmentQuestionType,
    val: number,
    newOps: QuestionOptionType,
    targetIndex: number,
  ) => {
    const newQuestionList = questionList.map((item: AssignmentQuestionType, index: number) => {
      if (index === targetIndex) {
        return {
          ...item,
          options: newOps,
        }
      } else {
        return item
      }
    })

    if (val === 2) {
      const parentQuestion = newQuestionList.find((item) => item.parent_slug === questionItem.slug)

      if (!parentQuestion) {
        setQuestionList([
          ...newQuestionList,
          {
            id: undefined,
            type: QuestionTypes.TEXTBOX,
            question: '',
            options: [],
            validations: [],
            slug: `meta_${+new Date()}`,
            parent_slug: questionItem.slug,
            active: false,
            grades: [],
          },
        ])
      }
    } else {
      const addOption = questionItem.options?.filter((item) => item.action === 2)
      if (addOption && addOption.length < 2) {
        setQuestionList(newQuestionList.filter((q) => q.parent_slug !== questionItem.slug))
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let isError = false
    const submittedQuestion = questionList.map((item: AssignmentQuestionType) => {
      if (!item.question) {
        isError = true
      }
      return {
        ...omit(item, 'parent_slug'),
        options: item?.options?.filter((itemOption) => itemOption.label) || [],
        default_question: false,
        assignment_id: assignmentId,
        validations: item.validations,
        parent_slug: item.parent_slug,
        grades: item.grades || [],
      }
    })
    if (isError) {
      setIsSubmitted(true)
      return
    }
    handleSaveQuestion(submittedQuestion)
  }

  const validationOptions = (questionItem: AssignmentQuestionType) => {
    if (questionItem.type === QuestionTypes.UPLOAD) {
      return validationCheckList.map((item) => {
        if (item.value === 'can_upload') {
          return {
            ...item,
            disabled: true,
          }
        } else {
          return item
        }
      })
    }
    return validationCheckList
  }

  return (
    <Modal open={isCustomeQuestionModal} aria-labelledby='child-modal-title' aria-describedby='child-modal-description'>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          bgcolor: MthColor.WHITE,
          borderRadius: 8,
          padding: '35px 60px',
        }}
      >
        <Box sx={{ maxHeight: '90vh', overflowY: 'auto' }}>
          {questionList.map((questionItem: AssignmentQuestionType, index: number) => (
            <Box key={index} sx={{ padding: 2 }}>
              {index > 0 && <hr style={{ height: '1px', backgroundColor: '#1a1a1a1a', marginBottom: '30px' }} />}
              <Box
                sx={{
                  display: 'flex',
                  height: '40px',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <DropDown
                  sx={{
                    minWidth: '200px',
                  }}
                  labelTop
                  dropDownItems={
                    !questionItem.parent_slug ? assignmentCustomQuestionTypes : additionalAssignmentCustomQuestionTypes
                  }
                  placeholder='Type'
                  defaultValue={questionItem.type}
                  setParentValue={(v) => {
                    handleQuestionItemChange({ ...questionItem, type: v }, index)
                  }}
                  size='small'
                />
                {index === 0 && (
                  <Box sx={{ display: 'flex' }}>
                    <Button sx={mthButtonClasses.roundSmallGray} onClick={() => onClose()} type='button'>
                      Cancel
                    </Button>
                    <Button
                      sx={{ ...mthButtonClasses.roundSmallDark, marginLeft: '30px' }}
                      type='button'
                      onClick={handleSubmit}
                    >
                      Save
                    </Button>
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  marginTop: '30px',
                }}
              >
                <Subtitle fontWeight='600' size={'medium'} sx={{ marginBottom: '10px' }}>
                  Question
                </Subtitle>
                <MthBulletEditor
                  value={questionItem.question}
                  setValue={(value) => handleQuestionItemChange({ ...questionItem, question: value }, index)}
                  height='150px'
                />
                {isSubmitted && !questionItem.question && <Subtitle color='red'>Required</Subtitle>}
                {[QuestionTypes.CHECK_BOX, QuestionTypes.MULTIPLE_CHOSE, QuestionTypes.DROPDOWN].includes(
                  questionItem.type,
                ) && (
                  <Box sx={{ marginTop: '30px' }}>
                    <QuestionOptions
                      questionItem={questionItem}
                      options={questionItem.options}
                      handleQuestionList={handleQuestionList}
                      handleAdditionalQuestion={handleAdditionalQuestion}
                      targetIndex={index}
                    />
                  </Box>
                )}
              </Box>
              <Box sx={{ marginTop: '30px' }}>
                <MthCheckboxList
                  values={questionItem.validations || []}
                  setValues={(value) => {
                    handleQuestionItemChange({ ...questionItem, validations: value }, index)
                  }}
                  checkboxLists={validationOptions(questionItem)}
                  haveSelectAll={false}
                />
                {questionItem.validations?.includes('grade_specific') && (
                  <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id={'grade-tag-' + index}>Grades</InputLabel>
                    <Select
                      labelId={'grade-tag-' + index}
                      multiple
                      value={questionItem?.grades || []}
                      onChange={(e) => handleGradeChange(e, index)}
                      input={<OutlinedInput label='Grades' />}
                      renderValue={(selected) => renderGrades(selected.join(','))}
                      MenuProps={MenuProps}
                    >
                      {renderGradeList(questionItem?.grades || [])}
                    </Select>
                  </FormControl>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Modal>
  )
}

export default CustomQuestion
