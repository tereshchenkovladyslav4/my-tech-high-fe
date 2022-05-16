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

export default function PacketQuestionItem({
  item,
}: {
  item: EnrollmentQuestion
}) {
    const [additionalQuestion, setAdditionalQuestion] = useState(false)
    const [additionalQuestion2, setAdditionalQuestion2] = useState(false)
    
    let questionEle
    if(item.type === 7) {
        questionEle = (
            <Grid item xs={6}>
                <Box display='flex' alignItems='center'>
                    <Paragraph size='large'>
                        <p dangerouslySetInnerHTML={{ __html: item.question }}></p>
                    </Paragraph>
                </Box>
            </Grid>
        )
    }
    else {
        questionEle = (
            <Grid item xs={6}>
                {item.type !== 4 && (<Box display='flex' alignItems='center'>
                    <Subtitle fontWeight='500'>{item.question}</Subtitle>
                </Box>)}
                <Item question={item} setAdditionalQuestion = {setAdditionalQuestion}/>
            </Grid>
        )
    }
    
    return (
    <>
        {questionEle}
        {additionalQuestion && (
            <Grid item xs={12}>
                <Box alignItems='center' width={'50%'}>
                    <Subtitle fontWeight='500'>{item.additional?.question}</Subtitle>
                    <Item question={item.additional} setAdditionalQuestion = {setAdditionalQuestion2}/>
                </Box>
            </Grid>
        )}
        {additionalQuestion && additionalQuestion2 && (
            <Grid item xs={12}>
                <Box alignItems='center' width={'50%'}>
                    <Subtitle fontWeight='500'>{item.additional?.question}</Subtitle>
                    <Item question={item.additional2} setAdditionalQuestion = {() => {}}/>
                </Box>
            </Grid>
        )}        
    </>
    )
}
function Item({ question: q, setAdditionalQuestion }: { question: EnrollmentQuestion | AdditionalQuestionType, setAdditionalQuestion: (flag:boolean) => void}) {
    const { control } = useFormContext()
   
    const [otherValue, setOtherValue] = useState('')

    const [gradesDropDownItems, setGradesDropDownItems] = useState<Array<DropDownItem>>([])

    const [grades, setGrades] = useState([])
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
        if(q.type === 3) {
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

    if (q.type === 1) {
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
    } else if (q.type === 2) {
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
    } else if (q.type === 3) {
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
    } else if (q.type === 4) {
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
    } else if (q.type === 5) {
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
    else if (q.type === 6) {
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
