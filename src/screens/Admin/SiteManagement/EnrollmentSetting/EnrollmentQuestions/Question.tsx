import { Box, Checkbox, IconButton, outlinedInputClasses, Radio, TextField, Grid, FormGroup, FormControl, FormControlLabel } from '@mui/material'
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
    <IconButton>
        <DehazeIcon />
    </IconButton>
))

export default function EnrollmentQuestionItem({
    item,
    group,
    mainQuestion = false,
}: {
    item: EnrollmentQuestion
    group: string
    mainQuestion?: boolean
}) {
    const tabName = useContext(TabContext)
    const { values, setValues } = useFormikContext<EnrollmentQuestionTab[]>()
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [additionalQuestion, setAdditionalQuestion] = useState(false)
    const [additionalQuestion2, setAdditionalQuestion2] = useState(false)

    useEffect(() => {
        setAdditionalQuestion(false)
        setAdditionalQuestion2(false)
    }, [item])
    let questionEle
    //   const [deleteQuestion] = useMutation(deleteQuestionGql)
    if (item.type === 4) {
        questionEle = (
            <Grid item xs={6}>
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
                                    <a style={{ color: '#111', textDecoration: 'none' }} href={item.options[0]?.label === 'web' ? item.options[0]?.value : `mailto:${item.options[0]?.value}`}>
                                        {item.question}
                                    </a>
                                </Paragraph>
                            }
                        />
                    </FormGroup>
                </FormControl>
                {!mainQuestion && (
                    <Box display='inline-flex' height='40px'>
                        <IconButton onClick={() => setShowEditDialog(true)}>
                            <EditIcon />
                        </IconButton>

                        {item.removable && (<IconButton onClick={() => setShowDeleteDialog(true)}>
                            <DeleteForeverOutlinedIcon />
                        </IconButton>)}
                        <DragHandle />
                    </Box>
                )}
            </Grid>
        )
    }
    else if (item.type === 7) {
        questionEle = (
            <Grid item xs={6}>
                <Box display='flex' alignItems='center'>
                    <Paragraph size='large'>
                        <p dangerouslySetInnerHTML={{ __html: item.question }}></p>
                    </Paragraph>
                    {!mainQuestion && (
                        <Box display='inline-flex' height='40px'>
                            <IconButton onClick={() => setShowEditDialog(true)}>
                                <EditIcon />
                            </IconButton>

                            {item.removable && (<IconButton onClick={() => setShowDeleteDialog(true)}>
                                <DeleteForeverOutlinedIcon />
                            </IconButton>)}
                            <DragHandle />
                        </Box>
                    )}
                </Box>
            </Grid>
        )
    }
    else {
        questionEle = (
            <Grid item xs={6}>
                <Box display='flex' alignItems='center'>
                    <Subtitle fontWeight='500'>{item.question}</Subtitle>
                    {!mainQuestion && (
                        <Box display='inline-flex' height='40px'>
                            <DragHandle />
                            <IconButton onClick={() => setShowEditDialog(true)}>
                                <EditIcon />
                            </IconButton>

                            {item.removable && (<IconButton onClick={() => setShowDeleteDialog(true)}>
                                <DeleteForeverOutlinedIcon />
                            </IconButton>)}

                        </Box>
                    )}
                </Box>
                <Item question={item} setAdditionalQuestion={(value) => { setAdditionalQuestion(value), setAdditionalQuestion2(false) }} />
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
                        <Item question={item.additional} setAdditionalQuestion={setAdditionalQuestion2} />
                    </Box>
                </Grid>
            )}
            {additionalQuestion && additionalQuestion2 && (
                <Grid item xs={12}>
                    <Box alignItems='center' width={'50%'}>
                        <Subtitle fontWeight='500'>{item.additional2?.question}</Subtitle>
                        <Item question={item.additional2} setAdditionalQuestion={() => { }} />
                    </Box>
                </Grid>
            )}
            {showEditDialog && <AddNewQuestionModal onClose={() => setShowEditDialog(false)} editItem={item} group={group} newQuestion={false} />}
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
                                    { ...g, questions: g.questions.filter((q) => q.question !== item.question).sort((a, b) => a.order - b.order).map((item, index) => { return { ...item, order: index + 1 } }) }
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
function Item({ question: q, setAdditionalQuestion }: { question: EnrollmentQuestion | AdditionalQuestionType, setAdditionalQuestion: (flag: boolean) => void }) {
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
                        setAdditionalQuestion(false)
                    }
                    else {
                        setAdditionalQuestion(true)
                    }
                }
                else {
                    setAdditionalQuestion(true)
                }
            }
            else {
                if (q.type !== 3) {
                    setAdditionalQuestion(false)
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
