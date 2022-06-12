import { Box, Checkbox, IconButton, outlinedInputClasses, Radio, TextField, Grid, FormGroup, FormControl, FormControlLabel, Tooltip } from '@mui/material'
import { useFormikContext } from 'formik'
import React, { useState, useEffect, useContext } from 'react'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { DropDown } from '../../../../../components/DropDown/DropDown'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { AdditionalQuestionType, EnrollmentQuestion, EnrollmentQuestionTab } from './types'
import DehazeIcon from '@mui/icons-material/Dehaze'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EditIcon from '@mui/icons-material/Edit'
import { SortableHandle } from 'react-sortable-hoc'
import AddNewQuestionModal from './AddNewQuestion'
import { ContentState, EditorState, convertToRaw } from 'draft-js'
import { convertFromHTML } from 'draft-convert'
import htmlToDraft from 'html-to-draftjs'
import { useMutation } from '@apollo/client'
// import { deleteQuestionGql } from './services'
import CustomModal from '../components/CustomModal/CustomModals'
import { SYSTEM_05, SYSTEM_07 } from '../../../../../utils/constants'
import { TabContext } from './TabContextProvider'
import { ProgramYearContext } from '../provider/ProgramYearProvider'

const DragHandle = SortableHandle(() => (
    <Tooltip title="Move">
        <IconButton>
            <DehazeIcon />
        </IconButton>
    </Tooltip>
))

export default function EnrollmentQuestionItem({
    item,
    group,
    mainQuestion = false,
}: {
    item: EnrollmentQuestion[]
    group: string
    mainQuestion?: boolean
}) {
    const tabName = useContext(TabContext)
    const { values, setValues } = useFormikContext<EnrollmentQuestionTab[]>()
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [questionItems, setQuestionItems] = useState<Array<any>>([<Grid></Grid>])

    useEffect(() => {
        if(item) {
            setQuestionItems(item.map((i) => { return {...i, isEnable: false}}))
        }
        else {
            setQuestionItems([<Grid></Grid>])
        }
    }, [item])
    
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
                    if (q.type === 4) {
                        return (
                            <Grid item xs={q.additional_question ? 12 : 6}>
                                <FormControl
                                    required
                                    name='acknowledge'
                                    component="fieldset"
                                    variant="standard"
                                >
                                    <FormGroup style={{ width: '50%' }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox />
                                            }
                                            label={
                                                <Paragraph size='medium'>
                                                    <a style={{ color: '#111', textDecoration: 'none' }} href={item[0].options[0]?.label === 'web' ? item[0].options[0]?.value : `mailto:${item[0].options[0]?.value}`}>
                                                        {item[0].question}
                                                    </a>
                                                </Paragraph>
                                            }
                                        />
                                    </FormGroup>
                                </FormControl>
                                {!q.additional_question && !mainQuestion && (
                                    <Box display='inline-flex' height='40px'>
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => setShowEditDialog(true)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                
                                        <Tooltip title="Delete">
                                            <IconButton onClick={() => setShowDeleteDialog(true)}>
                                                <DeleteForeverOutlinedIcon />
                                            </IconButton>
                                        </Tooltip>
                
                                        <DragHandle />
                                    </Box>
                                )}
                            </Grid>
                        )
                    }
                    else if (q.type === 7) {
                        return (
                            <Grid item xs={q.additional_question ? 12 : 6}>
                                <Box display='flex' alignItems='center' width={q.additional_question ? '50%' : '100%'}>
                                    <Paragraph size='large'>
                                        <p dangerouslySetInnerHTML={{ __html: q.question }}></p>
                                    </Paragraph>
                                    {!q.additional_question && !mainQuestion && (
                                        <Box display='inline-flex' height='40px'>
                                            <Tooltip title="Edit">
                                                <IconButton onClick={() => setShowEditDialog(true)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                
                                            <Tooltip title="Delete">
                                                <IconButton onClick={() => setShowDeleteDialog(true)}>
                                                    <DeleteForeverOutlinedIcon />
                                                </IconButton>
                                            </Tooltip>
                                            
                                            <DragHandle />
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                        )
                    }
                    else {
                        return (
                            <Grid item xs={q.additional_question ? 12 : 6}>
                                <Box display='flex' alignItems='center' width={q.additional_question ? '50%' : '100%'}>
                                    <Subtitle fontWeight='500'>{q.question}</Subtitle>
                                    {!q.additional_question && !mainQuestion && (
                                        <Box display='inline-flex' height='40px'>
                                            <Tooltip title="Edit">
                                                <IconButton onClick={() => setShowEditDialog(true)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                
                                            <Tooltip title="Delete">
                                                <IconButton onClick={() => setShowDeleteDialog(true)}>
                                                    <DeleteForeverOutlinedIcon />
                                                </IconButton>
                                            </Tooltip>
                
                                            <DragHandle />
                
                                        </Box>
                                    )}
                                </Box>
                                <Box alignItems='center' width={q.additional_question ? '50%' : '100%'}>
                                    <Item question={q} setAdditionalQuestion={(slug, value) => handleAdditionalAction(slug, value)} />
                                </Box>
                                
                            </Grid>
                        )
                    }
                }
            })}
            {showEditDialog && <AddNewQuestionModal onClose={() => setShowEditDialog(false)} editItem={item} group={group} isNewQuestion={false} />}
            {showDeleteDialog && (
                <CustomModal
                    title='Delete Question'
                    description='Are you sure you want to delete this question?'
                    confirmStr='Delete'
                    onClose={() => setShowDeleteDialog(false)}
                    onConfirm={() => {
                        setShowDeleteDialog(false)
                        const newValues = values.map((v) => {
                            if (v.tab_name === tabName) {
                                const newGroups = v.groups.map((g) =>
                                (g.group_name === group ?
                                    { ...g, questions: g.questions.filter((q) => q.question !== item[0].question).sort((a, b) => a.order - b.order).map((item, index) => { return { ...item, order: index + 1 } }) }
                                    :
                                    g
                                )
                                )
                                // v.groups = newGroups
                                return { ...v, groups: newGroups }
                            }
                            return v
                        })
                        setValues(newValues)
                        // deleteQuestion({ variables: { id: item.id } })
                    }}
                />
            )}
        </>
    )
}
function Item({ question: q, setAdditionalQuestion }: { question: EnrollmentQuestion, setAdditionalQuestion: (slug:string, flag: boolean) => void }) {
    const [selectedOption, setSelectedOption] = useState([])
    const { setProgramYear } = useContext(ProgramYearContext)
    useEffect(() => {
        setSelectedOption([])
    }, [q])
    function onChange(value: string | number) {
        if (q.type !== 2) {
            if (q.options[+value - 1]?.action === 2) {
                if (q.type === 3) {
                    if (selectedOption.indexOf(value) > -1) {
                        setAdditionalQuestion(q.slug, false)
                    }
                    else {
                        setAdditionalQuestion(q.slug, true)
                    }
                }
                else {
                    setAdditionalQuestion(q.slug, true)
                }
            }
            else {
                if (q.type !== 3) {
                    setAdditionalQuestion(q.slug, false)
                }
            }
            if (q.type === 3) {
                if (selectedOption.indexOf(value) > -1) {
                    setSelectedOption(selectedOption.filter(s => s !== value))
                }
                else {
                    setSelectedOption([...selectedOption, value])
                }
            }
            else {
                setSelectedOption([value])
            }
        }
        if (q.slug === 'program_year') {
            setProgramYear(value)
        }
    }
    if (q.type === 1) {
        return (
            <DropDown
                sx={{
                    minWidth: '100%',
                    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
                        borderColor: SYSTEM_07,
                    },
                }}
                labelTop
                defaultValue={selectedOption}
                dropDownItems={q.options || []}
                setParentValue={(v) => onChange(v as string)}
                size='small'
            />
        )
    } else if (q.type === 2) {
        return (
            <TextField
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
            />
        )
    } else if (q.type === 3) {
        return (
            <FormControl
                required
                component="fieldset"
                variant="standard"
                sx={{ width: '100%' }}
            >
                <FormGroup style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Grid container>
                        {(q.options ?? []).map((o, index) => (
                            <Grid item xs={q.options.length > 3 ? 6 : 12} key={index}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={selectedOption.indexOf(o.value) > -1 ? true : false} onClick={() => onChange(o.value)} />
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
                                    />)
                                }
                            </Grid>
                        ))}
                    </Grid>
                </FormGroup>
            </FormControl>
        )
    } else if (q.type === 5) {
        return (
            <FormControl
                required
                component="fieldset"
                variant="standard"
                sx={{ width: '100%' }}
            >
                <FormGroup style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Grid container>
                        {(q.options ?? []).map((o, index) => (
                            <Grid item xs={q.options.length > 3 ? 6 : 12} key={index}>
                                <FormControlLabel
                                    control={
                                        <Radio checked={selectedOption[0] === o.value} onClick={() => onChange(o.value)} />
                                    }
                                    label={o.label}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </FormGroup>
            </FormControl>
        )
    }
    else if (q.type === 6) {
        return (
            <TextField
                size='small'
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
                onChange={(v) => { }}
                focused
                type="date"
            />
        )
    }
    return null
}
