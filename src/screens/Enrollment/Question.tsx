import { Box, Checkbox, FormLabel, outlinedInputClasses, Radio, TextField, Grid, FormGroup, FormControl, FormControlLabel} from '@mui/material'
import { useFormikContext } from 'formik'
import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Paragraph } from '../../components/Typography/Paragraph/Paragraph'
import { DropDown } from '../../components/DropDown/DropDown'
import { SYSTEM_05, SYSTEM_07,ERROR_RED, GRADES } from '../../utils/constants'
import { AdditionalQuestionType, EnrollmentQuestion } from '../Admin/SiteManagement/EnrollmentSetting/EnrollmentQuestions/types'
import { Subtitle } from '../../components/Typography/Subtitle/Subtitle'
import { DropDownItem } from '../../components/DropDown/types'
import { toOrdinalSuffix } from '../../utils/stringHelpers'
import moment from 'moment'
import { UserContext, UserInfo } from '../../providers/UserContext/UserProvider'
import { gql, useQuery } from '@apollo/client'

const getSchoolDistrictsByRegionId = gql`
  query SchoolDistrict($regionId: ID!) {
    schoolDistrict(id: $regionId) {
      id
      school_district_name
      Region_id
    }
  }
`

export default function EnrollmentQuestionItem({
  item,
  group,
  formik,
}: {
  item: EnrollmentQuestion
  group: string
  formik: any
}) {
    const [additionalQuestion, setAdditionalQuestion] = useState(false)
    const [additionalQuestion2, setAdditionalQuestion2] = useState(false)
    
    useEffect(() => {
        if(item.type === 1 || item.type === 3 || item.type === 5) {
            formik.values.meta[`${item.slug}`] && item.options.find((o) => o.action === 2)?.label === formik.values.meta[`${item.slug}`] && formik.values.meta[`${item.slug}_additional`] && setAdditionalQuestion(true)
            item.additional?.options.find((o) => o.action === 2)?.label === formik.values.meta[`${item.slug}_additional`] && formik.values.meta[`${item.slug}`] && formik.values.meta[`${item.slug}_additional`] && setAdditionalQuestion2(true)
        }
    }, [item, formik])
    
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
                <Item question={item} setAdditionalQuestion = {setAdditionalQuestion} formik={formik}/>
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
                    <Item question={item.additional} setAdditionalQuestion = {setAdditionalQuestion2} formik={formik}/>
                </Box>
            </Grid>
        )}
        {additionalQuestion && additionalQuestion2 && (
            <Grid item xs={12}>
                <Box alignItems='center' width={'50%'}>
                    <Subtitle fontWeight='500'>{item.additional?.question}</Subtitle>
                    <Item question={item.additional2} setAdditionalQuestion = {() => {}} formik={formik}/>
                </Box>
            </Grid>
        )}        
    </>
    )
}
function Item({ question: q, setAdditionalQuestion, formik }: { question: EnrollmentQuestion | AdditionalQuestionType, setAdditionalQuestion: (flag:boolean) => void, formik: any }) {
    
    const { me, setMe } = useContext(UserContext)
    const { userRegion } = me as UserInfo
    const {loading, data: schoolDistrictsData} = useQuery(getSchoolDistrictsByRegionId, {
        variables: {
          regionId: me?.userRegion[0].region_id,
        },
        skip: me?.userRegion[0].region_id ? false : true,
        fetchPolicy: 'network-only',
      })

    const keyName = q.slug?.split('_')[0]
    const fieldName = !q.slug?.includes('meta_') ? q.slug?.replace(`${keyName}_`, '') : q.slug
    
    const [fieldData, setFieldData] = useState(
        formik.values[`${keyName}`] ? formik.values[`${keyName}`][`${fieldName}`] : null
    )
    const [otherValue, setOtherValue] = useState('')

    const [gradesDropDownItems, setGradesDropDownItems] = useState<Array<DropDownItem>>([])

    const [grades, setGrades] = useState([])
    const [schoolDistricts, setSchoolDistricts] = useState<Array<DropDownItem>>([])

    useEffect(() => {
        if(!loading && schoolDistrictsData?.schoolDistrict.length > 0) {
            setSchoolDistricts(schoolDistrictsData?.schoolDistrict.map((d) => {return {label: d.school_district_name, value: d.school_district_name}}))
        }
    }, [loading])

    const [dropDownItemsData, setDropDownItemsData] = useState<Array<DropDownItem>>([])
    useEffect(() => {
        if(q.slug === 'student_grade_level') {
            setDropDownItemsData(gradesDropDownItems || [])
        }
        else if(q.slug === 'packet_school_district') {
            setDropDownItemsData(schoolDistricts || [])
        }
        else {
            setDropDownItemsData(q.options  || [])
        }

    }, [q, schoolDistricts, gradesDropDownItems])

    useEffect(() => {
        if(formik.values.student?.grade_levels?.length > 0) {
            setGrades(formik.values.student?.grade_levels.map((l) => l.grade_level))
        }
    }, [formik.values])

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

    
    const multiSelected = useCallback((value: string | number) => {
        if(q.type === 3) {
            return fieldData?.find((f) => f.label === value)
        }
        return fieldData?.indexOf(value) >= 0
    },[fieldData])

    useEffect(()=> {
        if(q.type !== 2 && fieldData) {
            formik.values[`${keyName}`][`${fieldName}`] = fieldData
            if(q.type === 3) {
                const otherTemp = multiSelected('Other')
                if(otherTemp) {
                    setOtherValue(otherTemp?.value)
                }
            }
        }
    }, [fieldData, q])
    
    function getDropDownLabel(value: string | number) {
        const selected = dropDownItemsData.find((f) => f.value === value)
        return selected?.value || ''
    }

    function onChangeDropDown(value: string | number) {
        const selected = dropDownItemsData.find((f) => f.value === value)
        onChange(selected?.value)
    }

    function handleChangeOther(value: string) {
        const otherTemp = multiSelected('Other')
        if(otherTemp) {
            const updateOther = fieldData.map((f) => f.label === 'Other' ? {label: 'Other', value: value} : f)
            setFieldData(updateOther)
        }
        setOtherValue(value)
    }

    const onChange = useCallback((value: string | number) => {
        if(q.type !== 2) {
            if(q.options.find((f) => f.label === value)?.action === 2) {
                setAdditionalQuestion(true)
            }
            else {
                setAdditionalQuestion(false)
            }
            if(q.type === 4){
                if(fieldData && fieldData.indexOf(value) >= 0) {
                    setFieldData(fieldData.filter((f) => f !== value))
                }
                else {
                    setFieldData(fieldData ? [...fieldData, value] : [value])
                }
            }
            else if(q.type === 3) {
                if(fieldData && fieldData?.find((f) => f.label === value)) {
                    setFieldData(fieldData?.filter((f) => f.label !== value))
                }
                else {
                    if(value === 'Other') {
                        setFieldData(fieldData ? [...fieldData, {label: value, value: otherValue}] : [{label: value, value: otherValue}])
                    }
                    else {
                        setFieldData(fieldData ? [...fieldData, {label: value, value: value}] : [{label: value, value: value}])
                    }
                }
            }
            else {
                setFieldData(value)
            }            
        }
    },[fieldData, otherValue])

    if (q.type === 1) {
        return (
        <DropDown
            sx={{
            minWidth: '100%',
            [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: SYSTEM_07,
            },
            }}
            defaultValue={getDropDownLabel(formik.values[`${keyName}`][`${fieldName}`])}
            labelTop
            dropDownItems={dropDownItemsData}
            setParentValue={(v) => onChangeDropDown(v as string)}
            size='small'
            error={{
                error: !!(formik.errors[`${keyName}`] && Boolean(formik.errors[`${keyName}`][`${fieldName}`])),
                errorMsg: (formik.errors[`${keyName}`] && formik.errors[`${keyName}`][`${fieldName}`]) as string,
              }}
        />
        )
    } else if (q.type === 2) {
        return (
        <TextField
            name={`${keyName}.${fieldName}`}
            value={formik.values[`${keyName}`] ? formik.values[`${keyName}`][`${fieldName}`] : ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            size='small'
            sx={{
            maxWidth: '100%',

            [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: SYSTEM_07,
            },
            }}
            InputLabelProps={{
            style: { color: SYSTEM_05 },
            }}
            variant='outlined'
            fullWidth
            focused
            error={formik.errors[`${keyName}`] && Boolean(formik.errors[`${keyName}`][`${fieldName}`])}
            helperText={formik.errors[`${keyName}`] && formik.errors[`${keyName}`][`${fieldName}`]}
        />
        )
    } else if (q.type === 3) {
        return (
            <>
                <FormLabel sx={{ color: ERROR_RED, fontSize: '0.75rem' }}>{formik.errors[`${keyName}`] && formik.errors[`${keyName}`][`${fieldName}`]}</FormLabel>
                <FormControl
                    required
                    component="fieldset"
                    variant="standard"
                    sx={{width: '100%'}}
                    error={ formik.errors[`${keyName}`] && Boolean(formik.errors[`${keyName}`][`${fieldName}`])}
                >
                    <FormGroup style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Grid container>
                            {(q.options ?? []).map((o, index) => (
                                <Grid item xs={q.options.length > 3 ? 6 : 12} key={index}> 
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={multiSelected(o.label)} onClick={() => onChange(o.label)}/>
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
                                        value={otherValue}
                                        onChange={(e) => handleChangeOther(e.target.value)}
                                    />)
                                    }
                                </Grid>
                            ))}
                        </Grid>
                    </FormGroup>
                </FormControl>
            </>
            
        )
    } else if (q.type === 4) {
        return (
            <>
                <FormLabel sx={{ color: ERROR_RED, fontSize: '0.75rem' }}>{formik.errors[`${keyName}`] && formik.errors[`${keyName}`][`${fieldName}`]}</FormLabel>
                <FormControl
                    required
                    name='acknowledge'
                    component="fieldset"
                    variant="standard"
                    error={ formik.errors[`${keyName}`] && Boolean(formik.errors[`${keyName}`][`${fieldName}`])}
                >
                    <FormGroup style={{ width: '50%' }}>
                        <FormControlLabel
                            control={
                                <Checkbox checked={multiSelected(q.slug)} onClick={() => onChange(q.slug)} />
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
            </>
            
        )
    } else if (q.type === 5) {
        return (
            <>
                <FormLabel sx={{ color: ERROR_RED, fontSize: '0.75rem' }}>{formik.errors[`${keyName}`] && formik.errors[`${keyName}`][`${fieldName}`]}</FormLabel>
                <FormControl
                    required
                    component="fieldset"
                    variant="standard"
                    sx={{width: '100%'}}
                    error={ formik.errors[`${keyName}`] && Boolean(formik.errors[`${keyName}`][`${fieldName}`])}
                >
                    <FormGroup style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Grid container>
                            {(q.options ?? []).map((o, index) => (
                            <Grid item xs={q.options.length > 3 ? 6 : 12}  key={index}> 
                                <FormControlLabel
                                    control={
                                        <Radio checked={fieldData === o.label} onClick={() => onChange(o.label)} />
                                    }
                                    label={o.label} 
                                />
                            </Grid>
                            ))}
                        </Grid>
                    </FormGroup>
                </FormControl>
            </>
            
        )
    }
    else if (q.type === 6) {
        return (
        <TextField
            size='small'        
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name={`${keyName}.${fieldName}`}
            value={moment(formik.values[`${keyName}`][`${fieldName}`]).format('YYYY-MM-DD')}
            sx={{
            minWidth: '100%',

            [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: SYSTEM_07,
            },
            }}
            InputLabelProps={{
            style: { color: SYSTEM_05 },
            }}
            variant='outlined'
            focused
            type="date"
            error={formik.errors[`${keyName}`] && Boolean(formik.errors[`${keyName}`][`${fieldName}`])}
            helperText={formik.errors[`${keyName}`] && formik.errors[`${keyName}`][`${fieldName}`]}
        />
        )
    }
    return null
}
