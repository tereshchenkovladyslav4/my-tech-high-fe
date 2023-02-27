import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Box } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { CheckBoxListVM, MthCheckboxList } from '@mth/components/MthCheckboxList'
import { CheckListVM, LearningLogQuestion } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getChecklistQuery } from '../../../services'
import { LearningQuestionType } from '../types'

type SubjectQuestionProp = {
  question: LearningQuestionType | LearningLogQuestion
  schoolYearId: number
}

const SubjectQuestion: React.FC<SubjectQuestionProp> = ({ question, schoolYearId }) => {
  const [gradeList, setGradeList] = useState<DropDownItem[]>([])
  const [selectedGrade, setSelectedGrade] = useState<string>()
  const [goalList, setGoalList] = useState<CheckBoxListVM[]>([])
  const [checkedGoals, setCheckedGoals] = useState([''])

  const [subjectCheckList, setSubjectCheckList] = useState<CheckListVM[]>([])

  const [subjectList, setSubjectList] = useState<DropDownItem[]>([])

  const { me } = useContext(UserContext)
  const { data: checklistData, loading: checklistLoading } = useQuery(getChecklistQuery, {
    variables: {
      take: -1,
      regionId: me?.selectedRegionId,
      filter: {
        status: 'Subject Checklist',
        selectedYearId: schoolYearId,
      },
    },
    skip: me?.selectedRegionId && question?.grades && schoolYearId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!checklistLoading && checklistData) {
      const { checklist } = checklistData
      setSubjectCheckList(checklist.results)
    }
  }, [checklistData])

  useEffect(() => {
    const tempGradeList: DropDownItem[] = []
    const tempSubjectList: DropDownItem[] = []
    subjectCheckList.map((item) => {
      if (question.grades !== 'all') {
        const existGradeItem = tempGradeList.find((i) => i.value === item.grade)
        if (!existGradeItem && item.subject === question.grades) {
          tempGradeList.push({
            value: `${item.grade}`,
            label: item.grade,
          })
        }
      } else {
        const existSubjectItem = tempSubjectList.find((i) => i.value === item.subject)
        if (!existSubjectItem) {
          tempSubjectList.push({
            value: `${item.subject}`,
            label: item.subject,
          })
        }
      }
    })
    setGradeList(tempGradeList)
    setSubjectList(tempSubjectList)
  }, [subjectCheckList, question])

  const handleSelectGrade = (val: string | number) => {
    setSelectedGrade(`${val}`)
    const goalTempList = subjectCheckList
      .filter((item) => item.grade === val)
      .map((item) => ({ value: item.id + '', label: item.goal })) as CheckBoxListVM[]
    setGoalList(goalTempList)
    setCheckedGoals([])
  }

  const handleSelectSubject = (val: string) => {
    setGoalList([])
    const tempGradeList: DropDownItem[] = []
    subjectCheckList.map((item) => {
      const existGradeItem = tempGradeList.find((i) => i.value === item.grade)
      if (!existGradeItem && item.subject === val) {
        tempGradeList.push({
          value: `${item.grade}`,
          label: item.grade,
        })
      }
    })
    setGradeList(tempGradeList)
    setCheckedGoals([])
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {question?.grades === 'all' && (
          <Box sx={{ width: '40%' }}>
            <DropDown
              labelTop
              dropDownItems={subjectList}
              placeholder='Subject'
              setParentValue={(val) => handleSelectSubject(`${val}`)}
            />
          </Box>
        )}
        <Box sx={{ width: '40%' }}>
          <DropDown
            labelTop
            dropDownItems={gradeList}
            placeholder='Grade Level'
            setParentValue={(val) => handleSelectGrade(val)}
          />
        </Box>
      </Box>
      {selectedGrade && (
        <Box sx={{ mt: 2 }}>
          <MthCheckboxList
            setValues={(value) => {
              setCheckedGoals(value)
            }}
            checkboxLists={goalList}
            haveSelectAll={false}
            values={checkedGoals}
          />
        </Box>
      )}
    </Box>
  )
}

export default SubjectQuestion
