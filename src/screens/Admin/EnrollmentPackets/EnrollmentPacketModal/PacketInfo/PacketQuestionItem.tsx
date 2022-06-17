import { Box, Checkbox, FormLabel, outlinedInputClasses, Radio, TextField, Grid, FormGroup, FormControl, FormControlLabel} from '@mui/material'
import { useFormikContext } from 'formik'
import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { DropDown } from '../../../../../components/DropDown/DropDown'
import { SYSTEM_05, SYSTEM_07,ERROR_RED, GRADES } from '../../../../../utils/constants'
import { AdditionalQuestionType, EnrollmentQuestion } from '../../../SiteManagement/EnrollmentSetting/EnrollmentQuestions/types'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { DropDownItem } from '../../../../../components/DropDown/types'
import { toOrdinalSuffix } from '../../../../../utils/stringHelpers'
import moment from 'moment'
import { UserContext, UserInfo } from '../../../../../providers/UserContext/UserProvider'
import { gql, useQuery } from '@apollo/client'
import { Controller, useFormContext } from 'react-hook-form'
import { EnrollmentPacketFormType } from '../types'
import { QUESTION_TYPE } from '../../../../../components/QuestionItem/QuestionItemProps'

export const getActiveSchoolYearsByRegionId = gql`
  query GetActiveSchoolYears($regionId: ID!) {
    getSchoolYearsByRegionId(region_id: $regionId) {      
      grades
      school_year_id
    }
  }
`

export default function PacketQuestionItem({
  item,
}: {
  item: EnrollmentQuestion[]
}) {
    const [questionItems, setQuestionItems] = useState<Array<any>>([<Grid></Grid>])
    const { getValues, control } = useFormContext()
    const values = getValues()
    useEffect(() => {
        if(item) {            
            let childsEnable = false
            setQuestionItems(item.map((i) => { 
                if(values[`${i.additional_question}`]) {                    
                    const parentIsAction = item.find((ii) => ii.slug == i.additional_question).options.filter((o) => o.action == 2).find((po) => values[`${i.additional_question}`].length > 1 ? values[`${i.additional_question}`].find((fv) => fv.label == po.label) : po.label == values[`${i.additional_question}`] || po.value == values[`${i.additional_question}`])
                    if(parentIsAction && !childsEnable) {
                        return {...i, isEnable: true}
                    }
                    else {
                        childsEnable = true
                        return {...i, isEnable: false}
                    }
                }
                else {
                    return {...i, isEnable: false}
                }
            }))
        }
        else {
            setQuestionItems([<Grid></Grid>])
        }
    }, [item, values])
    
    const handleAdditionalAction = (slug, value) => {
        let index = 1000
        const updateQuestionItems = questionItems.map((q) => {
            if(q.additional_question === slug) {
                index = q.order
                return {...q, isEnable: value}
            }
            else {
                if(value) {
                    return q
                }
                else {
                    if(q.order > index) {
                        return {...q, isEnable: false}
                    }
                    else {
                        return q
                    }
                    
                }
            }
        })
        setQuestionItems(updateQuestionItems)
    }
    
    return (
    <>
        {questionItems.map((q) => {
                if((q.additional_question && q.isEnable) || !q.additional_question) {
                    if(q.type === QUESTION_TYPE.INFORMATION) {
                        return (
                            <Grid item xs={6}>
                                <Box display='flex' alignItems='center'>
                                    <Paragraph size='large'>
                                        <p dangerouslySetInnerHTML={{ __html: q.question }}></p>
                                    </Paragraph>
                                </Box>
                            </Grid>
                        )
                    }
                    else {
                        return (
                            <Grid item xs={questionItems.length > 1 ? 12 : 6}>
                                {q.type !== QUESTION_TYPE.AGREEMENT && (
                                <Box display='flex' alignItems='center' width={questionItems.length > 1 ? '50%' : '100%'}>
                                    <Subtitle fontWeight='500'>{q.question}</Subtitle>
                                </Box>)}
                                <Box alignItems='center' width={questionItems.length > 1 ? '49%' : '100%'}>
                                    <Item question={q} setAdditionalQuestion = {(slug, value) => handleAdditionalAction(slug, value)}/>
                                </Box>
                            </Grid>
                        )
                    }
                }
            }
        )}
    </>
    )
}
function Item({ question: q, setAdditionalQuestion }: { question: EnrollmentQuestion, setAdditionalQuestion: (slug:string, flag: boolean) => void}) {
    const { control, watch } = useFormContext()
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
        if(q.slug === 'student_grade_level') {
            setDropDownItemsData(gradesDropDownItems || [])
        }
        else {
            setDropDownItemsData(q.options  || [])
        }
    }, [q, gradesDropDownItems])

    useEffect(() => {
        parseGrades()
    }, [grades])

    const parseGrades = () => {
        let dropDownItems = []
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

    function handleChangeOther(field, value: string) {
        const otherTemp = multiSelected(field, 'Other')
        if(otherTemp) {
            const updateOther = field?.value?.map((f) => f.label === 'Other' ? {label: 'Other', value: value} : f)
            field.onChange(updateOther)
        }
        setOtherValue(value)
    }
    
    const multiSelected = (fieldValue, value) => {
        if(q.type === QUESTION_TYPE.CHECKBOX) {
            return fieldValue?.length > 0 && fieldValue?.find((f) => f.label === value) || false
        }
        else {
            return fieldValue?.length > 0 && fieldValue?.indexOf(value) > -1 || false
        }
    }

    const onChange = (field, value) => {
        const temp = [...field?.value]
        const updated = multiSelected(temp, value) ? temp.filter((t) => t.label !== value) : [...temp, {label: value, value: value}]
        field.onChange(updated)
    }

    if (q.type === QUESTION_TYPE.DROPDOWN) {
        return (
            <Controller
                name={q.slug}
                control={control}
                render={({field}) => 
                    <DropDown
                        sx={{
                        minWidth: '100%',
                        [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
                            borderColor: SYSTEM_07,
                        },
                        }}
                        defaultValue={field.value}
                        labelTop
                        dropDownItems={dropDownItemsData}
                        setParentValue={(v) => field.onChange(v as string)}
                        size='small'
                        // error={{
                        //     error: !!(formik.errors[`${keyName}`] && Boolean(formik.errors[`${keyName}`][`${fieldName}`])),
                        //     errorMsg: (formik.errors[`${keyName}`] && formik.errors[`${keyName}`][`${fieldName}`]) as string,
                        //   }}
                    />
                }
            />
        )
    } else if (q.type === QUESTION_TYPE.TEXTFIELD) {
        return (
            <Controller
                name={q.slug}
                control={control}
                render={({ field }) =>
                    <TextField
                        {...field}
                        size='small'
                        variant='outlined'
                        fullWidth
                        sx={{
                        maxWidth: '100%',

                        [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
                            borderColor: SYSTEM_07,
                        },
                        }}
                        InputLabelProps={{
                        style: { color: SYSTEM_05 },
                        }}
                    />}
            />
        
        )
    } else if (q.type === QUESTION_TYPE.CHECKBOX) {
        return (
            <Controller
                name={q.slug}
                control={control}
                render={({ field }) => 
                <FormControl
                    required
                    component="fieldset"
                    variant="standard"
                    sx={{width: '100%'}}
                    // error={ formik.errors[`${keyName}`] && Boolean(formik.errors[`${keyName}`][`${fieldName}`])}
                >
                    <FormGroup style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Grid container>
                            {(q.options).map((o, index) => (
                                <Grid item xs={q.options.length > 3 ? 6 : 12} key={index}> 
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={multiSelected(field.value, o.label)} onClick={() => onChange(field, o.label)}/>
                                        }
                                        label={o.label} 
                                    />
                                    {o.label === 'Other' && (
                                    <TextField
                                        size='small'
                                        sx={{
                                        maxWidth: '50%',

                                        [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
                                            borderColor: SYSTEM_07,
                                        },
                                        }}
                                        InputLabelProps={{
                                        style: { color: SYSTEM_05 },
                                        }}
                                        variant='outlined'
                                        fullWidth
                                        value={otherValue || field.value?.length > 0 && field.value?.find((f) => f.label === 'Other')?.value}
                                        onChange={(e) => handleChangeOther(field, e.target.value)}
                                    />)
                                    }
                                </Grid>
                            ))}
                        </Grid>
                    </FormGroup>
                </FormControl>
            }
            />
        )
    } else if (q.type === QUESTION_TYPE.AGREEMENT) {
        return (
            <Controller
            name={q.slug}
            control={control}
            render={({ field }) => 
            
                <FormControl
                    required
                    name='acknowledge'
                    component="fieldset"
                    variant="standard"
                    // error={ formik.errors[`${keyName}`] && Boolean(formik.errors[`${keyName}`][`${fieldName}`])}
                >
                    <FormGroup style={{ width: '50%' }}>
                        <FormControlLabel
                            control={
                                <Checkbox checked={multiSelected(field.value, q.slug)}  onClick={() => onChange(field, q.slug)} />
                            }
                            label={
                                <Paragraph size='medium'>
                                    <a style={{ color: '#111', textDecoration: 'none' }} href={q.options[0]?.label === 'web' ? q.options[0]?.value :`mailto:${q.options[0]?.value}`}>
                                        {q.question}
                                    </a>
                                </Paragraph>
                            }
                        />
                    </FormGroup>
                </FormControl>
            }
            />
            
        )
    } else if (q.type === QUESTION_TYPE.MULTIPLECHOICES) {
        return (
            <Controller
            name={q.slug}
            control={control}
            render={({ field }) => 
                <FormControl
                    required
                    component="fieldset"
                    variant="standard"
                    sx={{width: '100%'}}
                    // error={ formik.errors[`${keyName}`] && Boolean(formik.errors[`${keyName}`][`${fieldName}`])}
                >
                    <FormGroup style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Grid container>
                            {(q.options ?? []).map((o, index) => (
                            <Grid item xs={q.options.length > 3 ? 6 : 12}  key={index}> 
                                <FormControlLabel
                                    control={
                                        <Radio checked={field.value === o.label} onClick={() => field.onChange(o.label)} />
                                    }
                                    label={o.label} 
                                />
                            </Grid>
                            ))}
                        </Grid>
                    </FormGroup>
                </FormControl>
           }
            />
        )
    }
    else if (q.type === QUESTION_TYPE.CALENDAR) {
        return (
            <Controller
                name={q.slug}
                control={control}
                render={({ field }) => {
                    return <TextField
                        {...field}
                        value={field.value}
                        type='date'
                        placeholder='Date of Birth'
                        size='small'
                        variant='outlined'
                        fullWidth
                        sx={{
                            minWidth: '100%',
                
                            [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
                                borderColor: SYSTEM_07,
                            },
                            }}
                            InputLabelProps={{
                            style: { color: SYSTEM_05 },
                        }}
                    />}}
            />
        )
    }
    return null
}
