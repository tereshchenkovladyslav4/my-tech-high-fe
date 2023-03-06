import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { Box } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { FormError } from '@mth/components/FormError'
import { CheckBoxListVM, MthCheckboxList } from '@mth/components/MthCheckboxList'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { QuestionTypes } from '@mth/constants'
import { ChecklistEnum, RoleLevel } from '@mth/enums'
import { CheckListVM, LearningLogQuestion } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { extractContent } from '@mth/utils/string.util'
import { CheckListField } from '../../../CheckList/types'
import { getChecklistQuery } from '../../../services'
import { LearningQuestionType } from '../types'

type SubjectQuestionProp = {
  question: LearningQuestionType | LearningLogQuestion
  schoolYearId?: number
  showError?: boolean
  handleChangeValue?: (question: LearningLogQuestion) => void
}

const SubjectQuestion: React.FC<SubjectQuestionProp> = ({ question, schoolYearId, showError, handleChangeValue }) => {
  const { me } = useContext(UserContext)
  const roleLevel = me?.role?.level
  const [gradeList, setGradeList] = useState<DropDownItem[]>([])
  const [selectedGrade, setSelectedGrade] = useState<number>(0)
  const [goalList, setGoalList] = useState<CheckBoxListVM[]>([])
  const [subjectCheckList, setSubjectCheckList] = useState<CheckListVM[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [independentOptions, setIndependentOptions] = useState<CheckBoxListVM[]>([])
  const [selectedIndependent, setSelectedIndependent] = useState<string[]>([])
  const [getCheckList, { data: checkListData, loading: checkListLoading }] = useLazyQuery(getChecklistQuery)

  const subjectList = useMemo(() => {
    const tempSubjectList: DropDownItem[] = []
    subjectCheckList.map((item) => {
      const existSubjectItem = tempSubjectList.find((i) => i.value === item.subject)
      if (!existSubjectItem) {
        tempSubjectList.push({
          value: `${item.subject}`,
          label: item.subject,
        })
      }
    })
    if (question?.grades && question?.grades != 'all') setSelectedSubject(question.grades)
    return tempSubjectList
  }, [subjectCheckList, question])

  const handleSelectGrade = (val: number) => {
    setSelectedGrade(val)
    const goalTempList = subjectCheckList
      .filter((item) => item.grade === val)
      .map((item) => ({ value: item.id + '', label: item.goal })) as CheckBoxListVM[]
    setGoalList(goalTempList)
  }

  const handleSelectSubject = (val: string) => {
    setSelectedSubject(val)
    setSelectedGrade(0)
  }

  useEffect(() => {
    if (schoolYearId) {
      getCheckList({
        variables: {
          take: -1,
          regionId: roleLevel === RoleLevel.SUPER_ADMIN ? me?.selectedRegionId : me?.userRegion?.at(0)?.region_id,
          filter: {
            status:
              question.type === QuestionTypes.SUBJECT_QUESTION && question.grades
                ? ChecklistEnum.SUBJECT
                : ChecklistEnum.INDEPENDENT,
            selectedYearId: schoolYearId,
          },
        },
      })
    }
  }, [roleLevel, schoolYearId, question])

  useEffect(() => {
    if (!checkListLoading && checkListData?.checklist) {
      const { checklist } = checkListData
      setSubjectCheckList(checklist.results)
      if (question.type === QuestionTypes.INDEPENDENT_QUESTION) {
        setIndependentOptions(
          checklist.results.map((obj: CheckListField) => {
            return { label: obj?.goal ?? '', value: obj?.id?.toString() }
          }),
        )
      }
    }
  }, [checkListLoading, checkListData])

  useEffect(() => {
    if (selectedSubject && subjectList?.length > 0) {
      const subjectItem = subjectList.find((item) => item.value === selectedSubject)
      if (subjectItem) {
        const gradeTempList = subjectCheckList
          .filter((item) => item.subject === subjectItem.label)
          .map((item) => ({ value: item.grade + '', label: item.grade })) as DropDownItem[]
        setGradeList(gradeTempList)
      }
    }
  }, [selectedSubject, subjectList, question])
  return (
    <Box>
      {roleLevel !== RoleLevel.SUPER_ADMIN && (
        <Subtitle fontWeight='600' sx={{ cursor: 'pointer', fontSize: '14px', paddingY: 1 }}>
          {`${extractContent(question?.question)} ${question?.required ? '*' : ''}`}
        </Subtitle>
      )}
      {question.type === QuestionTypes.INDEPENDENT_QUESTION ? (
        <Box>
          <MthCheckboxList
            setValues={(values) => {
              setSelectedIndependent(values)
            }}
            checkboxLists={independentOptions}
            haveSelectAll={false}
            values={selectedIndependent}
          />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {question?.grades == 'all' && (
              <Box sx={{ width: '40%' }}>
                <DropDown
                  labelTop
                  dropDownItems={subjectList}
                  defaultValue={selectedSubject}
                  placeholder='Subject'
                  setParentValue={(val) => handleSelectSubject(`${val}`)}
                  error={{
                    error: showError && question?.required && !selectedSubject,
                    errorMsg: 'Required',
                  }}
                />
              </Box>
            )}
            {selectedSubject && (
              <Box sx={{ width: '40%' }}>
                <DropDown
                  labelTop
                  dropDownItems={gradeList}
                  defaultValue={selectedGrade}
                  placeholder='Grade Level'
                  setParentValue={(val) => handleSelectGrade(+val)}
                  error={{
                    error: showError && question?.required && !selectedGrade,
                    errorMsg: 'Required',
                  }}
                />
              </Box>
            )}
          </Box>
          {!!selectedGrade && (
            <Box sx={{ mt: 2 }}>
              <MthCheckboxList
                setValues={(values) => {
                  if (handleChangeValue)
                    handleChangeValue({
                      ...(question as LearningLogQuestion),
                      answer: JSON.stringify(values),
                    })
                }}
                checkboxLists={goalList}
                haveSelectAll={false}
                values={question?.answer ? JSON.parse(question.answer as string) : []}
              />
              {showError && question?.required && question?.answer == undefined && <FormError error={'Required'} />}
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default SubjectQuestion
