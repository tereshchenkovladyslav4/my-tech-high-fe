import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { QUESTION_TYPE } from '@mth/components/QuestionItem/QuestionItemProps'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { AdditionalQuestionAction, MthColor } from '@mth/enums'
import { ReimbursementQuestion } from '@mth/models'
import {
  QUESTION_SETTING_LIST,
  REIMBURSEMENT_ADDITIONAL_QUESTION_TYPES,
  REIMBURSEMENT_QUESTION_TYPES,
} from '../../../defaultValues'
import { Options } from '../Options'
import { questionEditClasses } from '../styles'

export type QuestionEditProps = {
  editQuestion: ReimbursementQuestion
  setEditQuestion: (value: ReimbursementQuestion) => void
  addAdditionalQuestion: (question: ReimbursementQuestion, additionalQuestion: ReimbursementQuestion) => void
  deleteAdditionalQuestion: (value: ReimbursementQuestion) => void
}

export const QuestionEdit: React.FC<QuestionEditProps> = ({
  editQuestion,
  setEditQuestion,
  addAdditionalQuestion,
  deleteAdditionalQuestion,
}) => {
  const handleChangeQuestionType = (value: string | number | QUESTION_TYPE) => {
    setEditQuestion({
      ...editQuestion,
      type: value as QUESTION_TYPE,
    })
  }

  useEffect(() => {
    if (!editQuestion?.Options?.length) {
      switch (editQuestion.type) {
        case QUESTION_TYPE.MULTIPLECHOICES:
          setEditQuestion({
            ...editQuestion,
            Options: [
              {
                label: '',
                value: '',
                action: AdditionalQuestionAction.CONTINUE_TO_NEXT,
              },
            ] as DropDownItem[],
          })
          break
        case QUESTION_TYPE.DROPDOWN:
          setEditQuestion({
            ...editQuestion,
            Options: [
              {
                label: 'Yes',
                value: 'yes',
                action: AdditionalQuestionAction.CONTINUE_TO_NEXT,
              },
              {
                label: 'No',
                value: 'no',
                action: AdditionalQuestionAction.CONTINUE_TO_NEXT,
              },
            ] as DropDownItem[],
          })
          break
        case QUESTION_TYPE.CHECKBOX:
          setEditQuestion({
            ...editQuestion,
            Options: [
              {
                label: 'Yes',
                value: 'yes',
                action: AdditionalQuestionAction.CONTINUE_TO_NEXT,
              },
              {
                label: 'No',
                value: 'no',
                action: AdditionalQuestionAction.CONTINUE_TO_NEXT,
              },
            ] as DropDownItem[],
          })
          break
      }
    }
  }, [editQuestion])

  return (
    <>
      {!!editQuestion?.additional_question && (
        <Subtitle
          fontWeight='600'
          sx={{ cursor: 'pointer', fontSize: '14px', borderTop: `2px solid ${MthColor.GRAY}`, paddingY: 1 }}
        >
          Additional Question
        </Subtitle>
      )}
      <Box sx={questionEditClasses.modalContent}>
        <Box sx={{ paddingY: 2, minWidth: '30%' }}>
          <DropDown
            dropDownItems={
              !editQuestion?.additional_question
                ? REIMBURSEMENT_QUESTION_TYPES
                : REIMBURSEMENT_ADDITIONAL_QUESTION_TYPES
            }
            placeholder={'Type'}
            labelTop
            defaultValue={!editQuestion?.default_question ? QUESTION_TYPE.TEXTFIELD : 0}
            setParentValue={handleChangeQuestionType}
            size='small'
            sx={{ m: 0 }}
          />
        </Box>
      </Box>
      <Box>
        <MthBulletEditor
          value={editQuestion?.question}
          setValue={(value) =>
            setEditQuestion({
              ...editQuestion,
              question: value,
            })
          }
          error={false}
        />
      </Box>
      <Options
        options={editQuestion?.Options || []}
        setOptions={(values) => {
          if (values?.find((item) => item?.action === AdditionalQuestionAction.ASK_ADDITIONAL_QUESTION)) {
            addAdditionalQuestion(
              {
                ...editQuestion,
                Options: values,
              },
              {
                type: QUESTION_TYPE.TEXTFIELD,
                default_question: editQuestion?.default_question,
                required: false,
                display_for_admin: false,
                priority: 0,
                question: '',
                options: '',
                SchoolYearId: editQuestion?.SchoolYearId,
                slug: `meta_${+new Date()}`,
                reimbursement_form_type: editQuestion?.reimbursement_form_type,
                is_direct_order: editQuestion?.is_direct_order,
                sortable: true,
                additional_question: editQuestion?.slug,
              },
            )
          } else {
            deleteAdditionalQuestion({
              ...editQuestion,
              Options: values,
            })
          }
        }}
        setFocused={() => {}}
        setBlured={() => {}}
        isDefault={editQuestion?.default_question}
        type={editQuestion?.type}
      />
      <Box sx={{ mt: 2 }}>
        <MthCheckboxList
          values={editQuestion?.SettingList || []}
          setValues={(value) => {
            setEditQuestion({
              ...editQuestion,
              SettingList: value,
            })
          }}
          checkboxLists={
            !editQuestion?.additional_question && editQuestion?.type === QUESTION_TYPE.INFORMATION
              ? QUESTION_SETTING_LIST.filter((list) => list.value === 'display_for_admin')
              : editQuestion?.additional_question
              ? QUESTION_SETTING_LIST.filter((list) => list.value === 'required')
              : QUESTION_SETTING_LIST
          }
          haveSelectAll={false}
        />
      </Box>
    </>
  )
}
