import React, { useState, useEffect, useContext, useCallback, ReactElement } from 'react'
import { gql, useQuery } from '@apollo/client'
import {
  Box,
  Checkbox,
  outlinedInputClasses,
  Radio,
  TextField,
  Grid,
  FormGroup,
  FormControl,
  FormControlLabel,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { GRADES } from '@mth/constants'
import { MthColor, QUESTION_TYPE } from '@mth/enums'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { toOrdinalSuffix } from '@mth/utils'
import { EnrollmentQuestion } from '../../../SiteManagement/EnrollmentSetting/EnrollmentQuestions/types'

export const getActiveSchoolYearsByRegionId = gql`
  query GetActiveSchoolYears($regionId: ID!) {
    getSchoolYearsByRegionId(region_id: $regionId) {
      grades
      school_year_id
    }
  }
`

export const PacketQuestionItem: React.FC<{ item: EnrollmentQuestion[] }> = ({ item }) => {
  const [questionItems, setQuestionItems] = useState<Array<unknown>>([<Grid key={uuidv4()}></Grid>])
  const { getValues } = useFormContext()
  const values = getValues()

  useEffect(() => {
    if (item) {
      let childsEnable = false
      setQuestionItems(
        item.map((i) => {
          if (values[`${i.additional_question}`]) {
            const parentIsAction = item
              .find((ii) => ii.slug == i.additional_question)
              .options.filter((o) => o.action == 2)
              .find((po) =>
                Array.isArray(values[`${i.additional_question}`])
                  ? values[`${i.additional_question}`].find((fv) => fv.label == po.label)
                  : po.label == values[`${i.additional_question}`] || po.value == values[`${i.additional_question}`],
              )
            if (parentIsAction && !childsEnable) {
              return { ...i, isEnable: true }
            } else {
              childsEnable = true
              return { ...i, isEnable: false }
            }
          } else {
            return { ...i, isEnable: false }
          }
        }),
      )
    } else {
      setQuestionItems([<Grid key={uuidv4()}></Grid>])
    }
  }, [item])

  const handleAdditionalAction = (slug, value) => {
    let index = 1000
    const updateQuestionItems = questionItems.map((q) => {
      if (q.additional_question === slug) {
        index = q.order
        return { ...q, isEnable: value }
      } else {
        if (value) {
          return q
        } else {
          if (q.order > index) {
            return { ...q, isEnable: false }
          } else {
            return q
          }
        }
      }
    })
    setQuestionItems(updateQuestionItems)
  }

  return (
    <>
      {questionItems.map((q, index): ReactElement | undefined => {
        if ((q.additional_question && q.isEnable) || !q.additional_question) {
          if (q.type === QUESTION_TYPE.INFORMATION) {
            return (
              <Grid key={index} item xs={6}>
                <Box display='flex' alignItems='center'>
                  <Paragraph size='large'>
                    <p dangerouslySetInnerHTML={{ __html: q.question }}></p>
                  </Paragraph>
                </Box>
              </Grid>
            )
          } else {
            return (
              <Grid key={index} item xs={questionItems.length > 1 ? 12 : 6}>
                {q.type !== QUESTION_TYPE.AGREEMENT && (
                  <Box display='flex' alignItems='center' width={questionItems.length > 1 ? '50%' : '100%'}>
                    <Subtitle fontWeight='500'>{q.question}</Subtitle>
                  </Box>
                )}
                <Box alignItems='center' width={questionItems.length > 1 ? '49%' : '100%'}>
                  <Item question={q} setAdditionalQuestion={(slug, value) => handleAdditionalAction(slug, value)} />
                </Box>
              </Grid>
            )
          }
        } else {
          return undefined
        }
      })}
    </>
  )
}
function Item({
  question: q,
  setAdditionalQuestion,
}: {
  question: EnrollmentQuestion
  setAdditionalQuestion: (slug: string, flag: boolean) => void
}) {
  const { control, watch, setValue, getValues } = useFormContext()
  const [school_year_id] = watch(['school_year_id'])
  const [otherValue, setOtherValue] = useState('')

  const [gradesDropDownItems, setGradesDropDownItems] = useState<Array<DropDownItem>>([])

  const { me } = useContext(UserContext)

  const [grades, setGrades] = useState([])

  const { loading: schoolLoading, data: schoolYearData } = useQuery(getActiveSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    fetchPolicy: 'network-only',
  })

  const values = getValues()
  const [fieldData, setFieldData] = useState(values[`${q.slug}`])

  useEffect(() => {
    if (values) {
      setFieldData(values[`${q.slug}`])
      if (q.type === QUESTION_TYPE.CHECKBOX) {
        const otherTemp = multiSelected('Other')
        if (otherTemp) {
          setOtherValue(values[`${q.slug}`].find((other) => other.label == 'Other').value)
        }
      }
    }
  }, [q])

  useEffect(() => {
    if (q.type !== QUESTION_TYPE.TEXTFIELD && q.type !== QUESTION_TYPE.CALENDAR && fieldData != undefined) {
      setValue(q.slug, fieldData)
    }
  }, [fieldData, q])

  useEffect(() => {
    if (!schoolLoading && schoolYearData?.getSchoolYearsByRegionId) {
      schoolYearData.getSchoolYearsByRegionId.forEach((element) => {
        if (school_year_id == element.school_year_id) {
          setGrades(element.grades?.split(','))
        }
      })
    }
  }, [me, schoolLoading, schoolYearData, school_year_id])

  const [dropDownItemsData, setDropDownItemsData] = useState<Array<DropDownItem>>([])

  useEffect(() => {
    if (q.slug === 'student_grade_level') {
      setDropDownItemsData(gradesDropDownItems || [])
    } else {
      setDropDownItemsData(q.options || [])
    }
  }, [q, gradesDropDownItems])

  useEffect(() => {
    parseGrades()
  }, [grades])

  const parseGrades = () => {
    const dropDownItems = []
    GRADES.forEach((grade) => {
      if (grades?.includes(grade.toString())) {
        if (typeof grade !== 'string') {
          dropDownItems.push({
            label: toOrdinalSuffix(grade) + ' Grade',
            value: grade.toString(),
          })
        }
        if (typeof grade == 'string') {
          dropDownItems.push({
            label: grade,
            value: grade,
          })
        }
      }
    })
    setGradesDropDownItems(dropDownItems)
  }

  function handleChangeOther(value: string) {
    const otherTemp = multiSelected('Other')
    if (otherTemp) {
      const updateOther = fieldData.map((f) => (f.label === 'Other' ? { label: 'Other', value: value } : f))
      setFieldData(updateOther)
    }
    setOtherValue(value)
  }

  const multiSelected = useCallback(
    (value: string | number) => {
      let res = false
      if (q.type === QUESTION_TYPE.CHECKBOX) {
        res = Array.isArray(fieldData) && fieldData?.find((f) => f.label == value) ? true : false
      } else {
        res = fieldData?.indexOf(value) >= 0
      }
      return res
    },
    [fieldData, q],
  )

  const onHandleChange = useCallback(
    (value) => {
      if (q?.options?.find((f) => f.value === value || f.label === value)?.action == 2) {
        if (q.type === QUESTION_TYPE.CHECKBOX) {
          if (Array.isArray(fieldData) && fieldData?.find((f) => f.label === value)) {
            setAdditionalQuestion(q.slug, false)
          } else {
            setAdditionalQuestion(q.slug, true)
          }
        } else {
          setAdditionalQuestion(q.slug, true)
        }
      } else {
        if (q.type === QUESTION_TYPE.CHECKBOX) {
          if (
            Array.isArray(fieldData) &&
            fieldData?.find((f) => q.options?.find((qq) => qq.action == 2 && f.label == qq.label))
          ) {
            setAdditionalQuestion(q.slug, true)
          } else {
            setAdditionalQuestion(q.slug, false)
          }
        } else {
          setAdditionalQuestion(q.slug, false)
        }
      }
      if (q.type === QUESTION_TYPE.AGREEMENT) {
        if (Array.isArray(fieldData) && fieldData.indexOf(value) >= 0) {
          setFieldData(fieldData.filter((f) => f !== value))
        } else {
          setFieldData(fieldData ? [...fieldData, value] : [value])
        }
      } else if (q.type === QUESTION_TYPE.CHECKBOX) {
        if (Array.isArray(fieldData) && fieldData?.find((f) => f.label === value)) {
          setFieldData(fieldData?.filter((f) => f.label !== value))
        } else {
          if (value === 'Other') {
            setFieldData(
              fieldData ? [...fieldData, { label: value, value: otherValue }] : [{ label: value, value: otherValue }],
            )
          } else {
            const temp = fieldData ? [...fieldData, { label: value, value: value }] : [{ label: value, value: value }]
            setFieldData(temp)
          }
        }
      } else {
        setFieldData(value)
      }
    },
    [fieldData, q],
  )

  function onChangeDropDown(value: string | number) {
    const selected = dropDownItemsData.find((f) => f.value === value)
    onHandleChange(selected?.value)
  }

  if (q.type === QUESTION_TYPE.DROPDOWN) {
    return (
      <Controller
        name={q.slug}
        control={control}
        render={({ field }) => (
          <DropDown
            sx={{
              minWidth: '100%',
              [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                {
                  borderColor: MthColor.SYSTEM_07,
                },
            }}
            defaultValue={field.value}
            labelTop
            dropDownItems={dropDownItemsData}
            setParentValue={(v) => onChangeDropDown(v as string)}
            size='small'
            // error={{
            //     error: !!(formik.errors[`${keyName}`] && Boolean(formik.errors[`${keyName}`][`${fieldName}`])),
            //     errorMsg: (formik.errors[`${keyName}`] && formik.errors[`${keyName}`][`${fieldName}`]) as string,
            //   }}
          />
        )}
      />
    )
  } else if (q.type === QUESTION_TYPE.TEXTFIELD) {
    return (
      <Controller
        name={q.slug}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            size='small'
            variant='outlined'
            fullWidth
            sx={{
              maxWidth: '100%',

              [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                {
                  borderColor: MthColor.SYSTEM_07,
                },
            }}
            InputLabelProps={{
              style: { color: MthColor.SYSTEM_05 },
            }}
          />
        )}
      />
    )
  } else if (q.type === QUESTION_TYPE.CHECKBOX) {
    return (
      <Controller
        name={q.slug}
        control={control}
        render={() => (
          <FormControl
            required
            component='fieldset'
            variant='standard'
            sx={{ width: '100%' }}
            // error={ formik.errors[`${keyName}`] && Boolean(formik.errors[`${keyName}`][`${fieldName}`])}
          >
            <FormGroup style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              <Grid container>
                {q.options.map((o, index) => (
                  <Grid item xs={q.options.length > 3 ? 6 : 12} key={index}>
                    <FormControlLabel
                      control={<Checkbox checked={multiSelected(o.label)} onClick={() => onHandleChange(o.label)} />}
                      label={o.label}
                    />
                    {o.label === 'Other' && (
                      <TextField
                        size='small'
                        sx={{
                          maxWidth: '50%',

                          [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                            {
                              borderColor: MthColor.SYSTEM_07,
                            },
                        }}
                        InputLabelProps={{
                          style: { color: MthColor.SYSTEM_05 },
                        }}
                        variant='outlined'
                        fullWidth
                        value={otherValue}
                        onChange={(e) => handleChangeOther(e.target.value)}
                      />
                    )}
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
          </FormControl>
        )}
      />
    )
  } else if (q.type === QUESTION_TYPE.AGREEMENT) {
    return (
      <Controller
        name={q.slug}
        control={control}
        render={() => (
          <FormControl
            required
            name='acknowledge'
            component='fieldset'
            variant='standard'
            // error={ formik.errors[`${keyName}`] && Boolean(formik.errors[`${keyName}`][`${fieldName}`])}
          >
            <FormGroup style={{ width: '50%' }}>
              <FormControlLabel
                control={<Checkbox checked={multiSelected(q.slug)} onClick={() => onHandleChange(q.slug)} />}
                label={
                  <Paragraph size='medium'>
                    <p dangerouslySetInnerHTML={{ __html: q.question }}></p>
                  </Paragraph>
                }
              />
            </FormGroup>
          </FormControl>
        )}
      />
    )
  } else if (q.type === QUESTION_TYPE.MULTIPLECHOICES) {
    return (
      <Controller
        name={q.slug}
        control={control}
        render={({ field }) => (
          <FormControl
            required
            component='fieldset'
            variant='standard'
            sx={{ width: '100%' }}
            // error={ formik.errors[`${keyName}`] && Boolean(formik.errors[`${keyName}`][`${fieldName}`])}
          >
            <FormGroup style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              <Grid container>
                {q.options.map((o, index) => (
                  <Grid item xs={q.options.length > 3 ? 6 : 12} key={index}>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={field.value == (q.slug == 'meta_special_education' ? o.value : o.label)}
                          onClick={() => onHandleChange(q.slug == 'meta_special_education' ? o.value : o.label)}
                        />
                      }
                      label={o.label}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
          </FormControl>
        )}
      />
    )
  } else if (q.type === QUESTION_TYPE.CALENDAR) {
    return (
      <Controller
        name={q.slug}
        control={control}
        render={({ field }) => {
          return (
            <TextField
              {...field}
              value={field.value}
              type='date'
              placeholder='Date of Birth'
              size='small'
              variant='outlined'
              fullWidth
              sx={{
                minWidth: '100%',

                [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                  {
                    borderColor: MthColor.SYSTEM_07,
                  },
              }}
              InputLabelProps={{
                style: { color: MthColor.SYSTEM_05 },
              }}
            />
          )
        }}
      />
    )
  }
  return null
}
