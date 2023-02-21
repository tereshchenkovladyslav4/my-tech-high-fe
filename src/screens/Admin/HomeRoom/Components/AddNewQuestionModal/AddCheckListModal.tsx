import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Box, Button, Modal, TextField, outlinedInputClasses } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { checkListDefaultQuestion, QuestionTypes } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { mthButtonClasses } from '@mth/styles/button.style'
import { questionCheckboxList } from '../../LearningLogs/defaultValue'
import { LearningLogQuestion } from '../../LearningLogs/types'
import { getChecklistQuery } from '../../services'
import { addNewQuestionClasses } from './styles'

type AddCheckListModalProp = {
  onClose: () => void
  schoolYearId: number
  onSave: (value: LearningLogQuestion[]) => void
  editQuestion?: LearningLogQuestion[]
}

const AddCheckListModal: React.FC<AddCheckListModalProp> = ({ onClose, schoolYearId, onSave, editQuestion }) => {
  const [validationList, setValidationList] = useState<string[]>(
    editQuestion && editQuestion[0] ? editQuestion[0].validations : [],
  )
  const [question, setQuestion] = useState<string>(
    editQuestion && editQuestion[0] ? editQuestion[0].question : checkListDefaultQuestion,
  )
  const [isError, setIsError] = useState({
    error: false,
    errorMsg: '',
  })
  const { me } = useContext(UserContext)

  const [checkList, setCheckList] = useState<DropDownItem[]>([])
  const [subject, setSubject] = useState<number | null>(editQuestion && editQuestion[0] ? editQuestion[0].grades : null)

  const { data: checklistData, loading: checklistLoading } = useQuery(getChecklistQuery, {
    variables: {
      take: -1,
      regionId: me?.selectedRegionId,
      filter: {
        status: 'Subject Checklist',
        selectedYearId: schoolYearId,
      },
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!checklistLoading) {
      const { checklist } = checklistData
      const checkTempList = [
        {
          value: 'all',
          label: 'All',
        },
      ]
      checklist.results.map((item) => {
        const existItem = checkTempList.find((i) => i.value === item.subject)
        if (!existItem) {
          checkTempList.push({
            value: item.subject,
            label: item.subject,
          })
        }
      })
      setCheckList(checkTempList)
    }
  }, [checklistData])

  const handleSaveQuestion = () => {
    if (!subject) {
      setIsError({
        error: true,
        errorMsg: 'Required',
      })
      return
    }
    const slug = editQuestion && editQuestion[0] ? editQuestion[0].slug : `meta_${+new Date()}`
    onSave([
      {
        type: QuestionTypes.SUBJECT_QUESTION,
        question: question,
        slug: slug,
        parent_slug: '',
        active: true,
        response: '',
        grades: subject,
        validations: validationList,
      },
    ])
  }

  return (
    <Modal open={true} onClose={onClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Box sx={addNewQuestionClasses.modalContainer}>
        <Box sx={{ ...addNewQuestionClasses.modalContent, alignItems: 'flex-start' }}>
          <Box>
            <TextField
              name='title'
              label='Type'
              placeholder='Entry'
              fullWidth
              value={'Subject Checklist'}
              variant='outlined'
              sx={{
                my: 2,
                [`& .${outlinedInputClasses.root}.${outlinedInputClasses.disabled} .${outlinedInputClasses.notchedOutline}`]:
                  {
                    borderColor: MthColor.BLACK,
                  },
                '& .MuiInputBase-root.Mui-disabled': {
                  color: MthColor.BLACK,
                },
                '& .MuiInputLabel-root': {
                  color: MthColor.BLACK,
                },
              }}
              disabled
            />
            <DropDown
              labelTop
              dropDownItems={checkList}
              setParentValue={(val) => {
                setSubject(val)
                setIsError({
                  error: false,
                  errorMsg: '',
                })
              }}
              defaultValue={subject}
              placeholder='Subject'
              sx={{
                '& .MuiInputLabel-root': {
                  color: isError ? MthColor.RED : MthColor.BLACK,
                },
              }}
              error={isError}
            />
          </Box>
          <Box sx={addNewQuestionClasses.btnGroup}>
            <Button sx={mthButtonClasses.roundGray} onClick={onClose}>
              Cancel
            </Button>
            <Button sx={mthButtonClasses.roundDark} onClick={handleSaveQuestion}>
              Save
            </Button>
          </Box>
        </Box>

        <Box>
          <Subtitle>Question</Subtitle>
          <MthBulletEditor value={question} setValue={(value) => setQuestion(value)} />
        </Box>
        <Box sx={{ mt: 2 }}>
          <MthCheckboxList
            values={validationList}
            setValues={(value) => {
              setValidationList(value)
            }}
            checkboxLists={questionCheckboxList}
            haveSelectAll={false}
          />
        </Box>
      </Box>
    </Modal>
  )
}

export default AddCheckListModal
