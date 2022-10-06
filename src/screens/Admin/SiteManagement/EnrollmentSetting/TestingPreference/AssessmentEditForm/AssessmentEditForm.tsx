import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import AddIcon from '@mui/icons-material/Add'
import { Box, Button, TextField } from '@mui/material'
import { Prompt, useHistory } from 'react-router-dom'
import { CommonSelect } from '@mth/components/CommonSelect'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthRoute, MthTitle, OPT_TYPE } from '@mth/enums'
import { saveAssessmentMutation } from '@mth/graphql/mutation/assessment'
import { PageHeader } from '../../../components/PageHeader'
import { CommonSelectType } from '../../../types'
import { testingPreferenceClassess } from '../styles'
import { AssessmentOptionType } from '../types'
import { GradesSelect } from './GradesSelect'
import { OptionForm } from './OptionForm'
import { AssessmentEditFormProps } from './types'

const defaultOption = {
  option_id: 0,
  label: '',
  require_reason: false,
  method: '',
  reason: '',
}

const AssessmentEditForm: React.FC<AssessmentEditFormProps> = ({ assessment, selectedYear, availGrades, refetch }) => {
  const history = useHistory()
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [testName, setTestName] = useState<string>('')
  const [grades, setGrades] = useState<string>('')
  const [information, setInformation] = useState<string>('')
  const [invalidation, setInvalidation] = useState<boolean>(false)
  const [option1, setOption1] = useState<AssessmentOptionType>(defaultOption)
  const [optionList, setOptionList] = useState<AssessmentOptionType[]>([])
  const [addItem, setAddItem] = useState<AssessmentOptionType>()
  const [deleteItem, setDeleteItem] = useState<AssessmentOptionType>()
  const [submitSave, {}] = useMutation(saveAssessmentMutation)
  const pageContents: CommonSelectType[] = [
    {
      name: MthTitle.TEST_NAME,
      component: (
        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', paddingLeft: 3 }}>
          <TextField
            name='title'
            placeholder='Entry'
            value={testName}
            size='small'
            onChange={(e) => {
              setTestName(e.target.value)
              setIsChanged(true)
            }}
            sx={{ my: 1 }}
            error={invalidation && testName == ''}
          />
          <Subtitle sx={testingPreferenceClassess.formError}>{invalidation && testName == '' && 'Required'}</Subtitle>
        </Box>
      ),
    },
    {
      name: MthTitle.GRADES,
      component: (
        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', paddingLeft: 3 }}>
          <GradesSelect grades={grades} setGrades={setGrades} availGrades={availGrades} setIsChanged={setIsChanged} />
          <Subtitle sx={testingPreferenceClassess.formError}>{invalidation && grades == '' && 'Required'}</Subtitle>
        </Box>
      ),
    },
    {
      name: MthTitle.INFORMATION,
      component: (
        <Box sx={{ width: '70%', paddingLeft: 3 }}>
          <MthBulletEditor
            height='100px'
            value={information}
            setValue={(value) => {
              setInformation(value)
              setIsChanged(true)
            }}
          />
        </Box>
      ),
    },
    {
      name: MthTitle.OPTION_1,
      component: (
        <OptionForm option={option1} setOption={setOption1} invalidation={invalidation} setIsChanged={setIsChanged} />
      ),
    },
  ]

  const getOption1Height = () => {
    if (option1) {
      if (option1?.method == OPT_TYPE.OPT_OUT && option1?.require_reason) {
        return '300px'
      } else if (option1?.method == OPT_TYPE.OPT_OUT && !option1?.require_reason) {
        return '70px'
      }
    }
    return 'auto'
  }
  const validation = (): boolean => {
    if (!testName || !grades || !option1?.label || !option1?.method) {
      setInvalidation(true)
      return false
    }

    for (let i = 0; i < optionList.length; i++) {
      if (!optionList[i].label || !optionList[i].method) {
        setInvalidation(true)
        return false
      }
    }

    return true
  }
  const handleClickSave = async () => {
    if (!validation()) {
      return
    }
    await submitSave({
      variables: {
        assessmentInput: {
          assessment: assessment?.assessment_id
            ? {
                SchoolYearId: selectedYear,
                assessment_id: Number(assessment?.assessment_id),
                grades: grades,
                is_archived: assessment?.is_archived,
                information: information,
                test_name: testName,
              }
            : {
                SchoolYearId: selectedYear,
                grades: grades,
                is_archived: false,
                information: information,
                test_name: testName,
              },
          options: [option1].concat(optionList)?.map((option) => ({
            option_id: Number(option?.option_id),
            AssessmentId: Number(option?.AssessmentId),
            reason: option?.reason,
            require_reason: option?.require_reason,
            label: option?.label,
            method: option?.method,
          })),
        },
      },
    })
    setIsChanged(false)
    refetch()
    history.push(`${MthRoute.TESTING_PREFERENCE_PATH}`)
  }

  const handleAddOption = () => {
    const newOption: AssessmentOptionType = {
      index: optionList.length + 1,
      label: '',
      require_reason: false,
      reason: '',
      method: '',
    }
    setOptionList(optionList.concat(newOption))
    setIsChanged(true)
  }

  useEffect(() => {
    if (assessment && optionList.length == 0) {
      setTestName(assessment.test_name)
      setGrades(assessment.grades)
      setInformation(assessment.information)
      if (assessment.Options?.length > 0) {
        const option = assessment.Options?.sort((a, b) => Number(a.option_id) - Number(b.option_id)).at(0)
        setOption1(option || defaultOption)
        const optionList1: AssessmentOptionType[] = assessment.Options.filter(
          (item) => item.option_id != option?.option_id,
        ).map((item, index) => ({ ...item, index: index }))
        setOptionList(optionList1)
      }
    }
  }, [assessment])

  useEffect(() => {
    if (addItem) {
      const tempArray = [
        ...optionList.map((list) => {
          if (list.index == addItem.index) {
            return addItem
          } else {
            return list
          }
        }),
      ]
      setOptionList(tempArray)
    }
  }, [addItem])

  useEffect(() => {
    if (deleteItem) {
      const tempArray = [...optionList.filter((item) => item.option_id != deleteItem.option_id)]
      setOptionList(tempArray)
    }
  }, [deleteItem])

  return (
    <Box>
      <Prompt
        when={isChanged ? true : false}
        message={JSON.stringify({
          header: MthTitle.UNSAVED_TITLE,
          content: MthTitle.UNSAVED_DESCRIPTION,
        })}
      />
      <PageHeader
        title={assessment?.test_name || MthTitle.NEW_ASSESSMENT}
        back={`${MthRoute.TESTING_PREFERENCE_PATH}`}
        handleClickSave={handleClickSave}
      />
      <Box sx={{ paddingX: 4 }}>
        {pageContents?.map((pageContent, index) => (
          <CommonSelect
            key={index}
            index={index}
            verticalDividHeight={
              pageContent.name == MthTitle.INFORMATION
                ? '230px'
                : pageContent.name == MthTitle.OPTION_1
                ? getOption1Height()
                : 'auto'
            }
            selectItem={pageContent}
          />
        ))}
        {optionList?.map((list, index) => (
          <CommonSelect
            key={index}
            index={index}
            verticalDividHeight={'auto'}
            hasDeleteIcon={true}
            handleDeleteAction={() => {
              setDeleteItem(list)
              setIsChanged(true)
            }}
            selectItem={{
              name: `Option ${index + 2}`,
              component: (
                <OptionForm
                  option={list}
                  setOption={setAddItem}
                  invalidation={invalidation}
                  setIsChanged={setIsChanged}
                />
              ),
            }}
          />
        ))}
      </Box>
      <Box sx={{ textAlign: 'left' }}>
        <Button onClick={handleAddOption} sx={testingPreferenceClassess.addBtn} startIcon={<AddIcon />}>
          {MthTitle.ADD_OPTION}
        </Button>
      </Box>
    </Box>
  )
}

export default AssessmentEditForm
